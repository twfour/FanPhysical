#!/usr/bin/env python3
import hmac
import json
import os
import re
import socket
import ssl
import subprocess
import threading
import time
import urllib.error
import urllib.request
from collections import Counter
from html import escape
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import quote, unquote, urlparse


ROOT = Path(__file__).resolve().parent
APP_ENV = os.environ.get("FANPHYSICS_ENV", "development").strip().lower()


def load_env_file(path):
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


load_env_file(ROOT / ".env")

HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8001"))
DEEPSEEK_API_URL = os.environ.get(
    "DEEPSEEK_API_URL",
    "https://api.deepseek.com/chat/completions",
)
DEEPSEEK_MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-flash")
DEEPSEEK_THINKING = os.environ.get("DEEPSEEK_THINKING", "disabled").strip().lower()
if DEEPSEEK_THINKING not in {"enabled", "disabled"}:
    DEEPSEEK_THINKING = "disabled"
try:
    DEEPSEEK_TIMEOUT_SECONDS = max(10.0, float(os.environ.get("DEEPSEEK_TIMEOUT_SECONDS", "90")))
except ValueError:
    DEEPSEEK_TIMEOUT_SECONDS = 90.0
try:
    DEEPSEEK_MAX_RETRIES = min(4, max(0, int(os.environ.get("DEEPSEEK_MAX_RETRIES", "2"))))
except ValueError:
    DEEPSEEK_MAX_RETRIES = 2
RETRYABLE_HTTP_STATUS = {429, 500, 502, 503, 504}
MAX_BODY_BYTES = 120_000
MAX_CONVERSATION_MESSAGES = 12
MAX_CONVERSATION_MESSAGE_CHARS = 4_000
PROBLEM_INDEX_PATH = ROOT / "data" / "problems" / "index.json"
PROBLEM_DIR = PROBLEM_INDEX_PATH.parent
CHAPTER_GUIDES_PATH = ROOT / "data" / "chapter-guides.json"
NOTEBOOKLM_EDIT_PASSWORD = os.environ.get("NOTEBOOKLM_EDIT_PASSWORD", "")
NOTEBOOKLM_EDIT_ENABLED = len(NOTEBOOKLM_EDIT_PASSWORD) >= 12
NOTEBOOKLM_LINKS_PATH = Path(
    os.environ.get("NOTEBOOKLM_LINKS_PATH", str(ROOT / "work" / "notebooklm-links.json"))
).expanduser()
if not NOTEBOOKLM_LINKS_PATH.is_absolute():
    NOTEBOOKLM_LINKS_PATH = ROOT / NOTEBOOKLM_LINKS_PATH
NOTEBOOKLM_LINKS_LOCK = threading.RLock()
NOTEBOOKLM_AUTH_FAILURES = {}
NOTEBOOKLM_AUTH_WINDOW_SECONDS = 10 * 60
NOTEBOOKLM_AUTH_MAX_FAILURES = 6
MAX_NOTEBOOKLM_EDIT_BODY_BYTES = 8_000


def html_response(handler, status, html):
    body = html.encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "text/html; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def load_problem_catalog():
    payload = json.loads(PROBLEM_INDEX_PATH.read_text(encoding="utf-8"))
    catalog = []
    for item in payload.get("problems", []):
        problem_id = item.get("id")
        filename = item.get("file")
        if not isinstance(problem_id, str) or not isinstance(filename, str):
            continue
        path = (PROBLEM_DIR / filename).resolve()
        if path.parent != PROBLEM_DIR.resolve() or not path.is_file():
            continue
        try:
            problem = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        if problem.get("skip"):
            continue
        catalog.append((problem_id, problem))
    return catalog


def load_chapter_guides():
    payload = json.loads(CHAPTER_GUIDES_PATH.read_text(encoding="utf-8"))
    guides = payload.get("chapters", {})
    return guides if isinstance(guides, dict) else {}


def normalize_notebooklm_url(value):
    text = str(value or "").strip()
    if not text:
        return ""
    parsed = urlparse(text)
    if parsed.scheme != "https" or parsed.hostname != "notebooklm.google.com":
        return ""
    match = re.match(r"^/notebook/([A-Za-z0-9_-]+)", parsed.path)
    if not match:
        return ""
    return f"https://notebooklm.google.com/notebook/{match.group(1)}"


def load_notebooklm_links_document():
    try:
        payload = json.loads(NOTEBOOKLM_LINKS_PATH.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return {"version": 1, "chapters": {}}
    except (OSError, json.JSONDecodeError):
        return {"version": 1, "chapters": {}}
    chapters = payload.get("chapters")
    if not isinstance(chapters, dict):
        chapters = {}
    return {"version": 1, "chapters": chapters}


def load_notebooklm_link_overrides():
    with NOTEBOOKLM_LINKS_LOCK:
        document = load_notebooklm_links_document()
    overrides = {}
    for chapter, item in document["chapters"].items():
        raw_url = item.get("url") if isinstance(item, dict) else item
        normalized = normalize_notebooklm_url(raw_url)
        if normalized:
            overrides[str(chapter)] = normalized
    return overrides


def save_notebooklm_link_override(chapter, url):
    with NOTEBOOKLM_LINKS_LOCK:
        document = load_notebooklm_links_document()
        chapters = document["chapters"]
        if url:
            chapters[chapter] = {"url": url, "updatedAt": int(time.time())}
        else:
            chapters.pop(chapter, None)
        NOTEBOOKLM_LINKS_PATH.parent.mkdir(parents=True, exist_ok=True)
        temporary_path = NOTEBOOKLM_LINKS_PATH.with_name(
            f"{NOTEBOOKLM_LINKS_PATH.name}.tmp-{os.getpid()}-{threading.get_ident()}"
        )
        temporary_path.write_text(
            json.dumps(document, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        os.chmod(temporary_path, 0o600)
        os.replace(temporary_path, NOTEBOOKLM_LINKS_PATH)


def notebooklm_edit_client_ip(handler):
    forwarded = handler.headers.get("X-Real-IP", "").strip()
    return forwarded or handler.client_address[0]


def notebooklm_auth_is_limited(client_ip):
    now = time.monotonic()
    with NOTEBOOKLM_LINKS_LOCK:
        attempts = [
            timestamp
            for timestamp in NOTEBOOKLM_AUTH_FAILURES.get(client_ip, [])
            if now - timestamp < NOTEBOOKLM_AUTH_WINDOW_SECONDS
        ]
        NOTEBOOKLM_AUTH_FAILURES[client_ip] = attempts
        return len(attempts) >= NOTEBOOKLM_AUTH_MAX_FAILURES


def record_notebooklm_auth_failure(client_ip):
    with NOTEBOOKLM_LINKS_LOCK:
        NOTEBOOKLM_AUTH_FAILURES.setdefault(client_ip, []).append(time.monotonic())


def clear_notebooklm_auth_failures(client_ip):
    with NOTEBOOKLM_LINKS_LOCK:
        NOTEBOOKLM_AUTH_FAILURES.pop(client_ip, None)


def notebooklm_password_matches(candidate):
    if not NOTEBOOKLM_EDIT_ENABLED or not isinstance(candidate, str):
        return False
    return hmac.compare_digest(candidate.encode("utf-8"), NOTEBOOKLM_EDIT_PASSWORD.encode("utf-8"))


def group_problem_catalog(catalog):
    grouped = {}
    for problem_id, problem in catalog:
        grouped.setdefault(problem.get("chapter") or "未分类", []).append((problem_id, problem))
    return grouped


def notebooklm_chapter_path(chapter):
    return f"/notebooklm/chapter/{quote(chapter, safe='')}"


def request_origin(handler):
    forwarded_proto = handler.headers.get("X-Forwarded-Proto", "").split(",", 1)[0].strip()
    scheme = forwarded_proto or ("https" if APP_ENV == "production" else "http")
    host = handler.headers.get("Host") or f"{HOST}:{PORT}"
    return f"{scheme}://{host}"


def notebooklm_styles():
    return """
    :root{--ink:#20231f;--muted:#686d64;--paper:#f7f3e8;--line:#d8d0bd;--accent:#a13d2d}
    *{box-sizing:border-box}body{margin:0;background:#e8e2d3;color:var(--ink);font-family:"Songti SC","STSong",serif;line-height:1.82}
    main{width:min(900px,calc(100% - 28px));margin:24px auto 64px;background:var(--paper);padding:clamp(28px,6vw,72px);box-shadow:0 18px 50px #342d1e22;border-top:6px solid var(--accent)}
    .notebook-shell{width:min(1200px,calc(100% - 28px));margin:24px auto 64px;display:grid;grid-template-columns:minmax(220px,260px) minmax(0,900px);gap:20px;align-items:start}
    .notebook-shell>main{grid-column:2;grid-row:1;width:100%;margin:0}.notebook-sidebar{grid-column:1;grid-row:1;position:sticky;top:20px;max-height:calc(100vh - 40px);overflow:auto;border:1px solid var(--line);border-top:6px solid var(--accent);background:var(--paper);padding:18px;box-shadow:0 12px 30px #342d1e18}
    .sidebar-kicker{margin:0;color:var(--accent);font-family:"Kaiti SC","STKaiti",serif;font-size:.78rem;letter-spacing:.14em}.notebook-sidebar h2{margin:.35em 0 1em;border:0;padding:0;font-size:1.15rem;line-height:1.35}
    .notebook-directory{display:grid;gap:5px}.notebook-directory a{display:block;border-left:3px solid transparent;padding:7px 9px;color:var(--muted);font-family:"Noto Sans SC","Microsoft YaHei",sans-serif;font-size:.88rem;font-weight:650;line-height:1.45;text-decoration:none}.notebook-directory a:hover{border-left-color:#c69b70;background:#fffdf7;color:var(--ink)}.notebook-directory a.is-current{border-left-color:var(--accent);background:#fffdf7;color:var(--ink);font-weight:800}
    .sidebar-footer{display:block;margin-top:16px;border-top:1px solid var(--line);padding:13px 9px 0;color:#7b2f24;font-family:"Noto Sans SC","Microsoft YaHei",sans-serif;font-size:.86rem;font-weight:800;text-decoration:none}
    .sidebar-footer+.sidebar-footer{margin-top:6px;border-top:0;padding-top:5px}
    header{border-bottom:1px solid var(--line);padding-bottom:24px;margin-bottom:34px}.eyebrow{color:var(--accent);font-family:"Kaiti SC","STKaiti",serif;letter-spacing:.16em}
    h1{font-size:clamp(2rem,6vw,3.7rem);line-height:1.12;margin:.35em 0 .2em}h2{font-size:1.35rem;margin:2.2em 0 .7em;border-left:4px solid var(--accent);padding-left:.7em}
    h3{font-size:1.05rem;margin:1.5em 0 .35em}.meta,.quiet{color:var(--muted)}.formula,.answer,.step,.practice{border:1px solid var(--line);padding:16px 20px;margin:12px 0;background:#fffdf7}
    .answer{border-color:#c69b70}.knowledge{display:flex;gap:8px;flex-wrap:wrap}.tag{border:1px solid var(--line);padding:2px 10px;border-radius:999px;font-size:.88rem}
    mjx-container{color:var(--ink);font-size:1.04em}mjx-container[display="true"]{max-width:100%;margin:1em 0!important;padding:.25em 0 .4em;overflow-x:auto;overflow-y:hidden;text-align:left!important}
    ol,ul{padding-left:1.5em}a{color:#7b2f24;text-decoration-thickness:1px;text-underline-offset:3px}.directory{display:grid;gap:12px}.directory a{display:block;padding:14px 16px;border:1px solid var(--line);background:#fffdf7;text-decoration:none}.directory a:hover{border-color:var(--accent)}
    .lesson-pager{display:flex;justify-content:space-between;gap:16px;margin-top:42px;padding-top:22px;border-top:1px solid var(--line)}.directory-section{scroll-margin-top:20px}
    .chapter-heading-link{color:inherit;text-decoration:none}.chapter-heading-link:hover{color:var(--accent)}.chapter-meta-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.chapter-meta-row span{border:1px solid var(--line);border-radius:999px;background:#fffdf7;padding:3px 11px;color:var(--muted);font-family:"Noto Sans SC","Microsoft YaHei",sans-serif;font-size:.85rem;font-weight:700}
    .chapter-problem-list{display:grid;gap:10px;margin:0;padding:0;list-style:none}.chapter-problem-card{border:1px solid var(--line);background:#fffdf7;padding:14px 16px}.chapter-problem-card a{display:block;color:var(--ink);font-size:1rem;font-weight:800;text-decoration:none}.chapter-problem-card a:hover{color:var(--accent)}.chapter-problem-card p{margin:.4em 0 0;color:var(--muted);font-size:.92rem;line-height:1.65}
    .chapter-law-list{display:grid;gap:10px;margin:0;padding:0;list-style:none;counter-reset:chapter-law}.chapter-law-list li{position:relative;border-left:3px solid #c69b70;background:#fffdf7;padding:12px 15px 12px 44px}.chapter-law-list li:before{position:absolute;left:14px;top:12px;counter-increment:chapter-law;content:counter(chapter-law);color:var(--accent);font-family:"Noto Sans SC","Microsoft YaHei",sans-serif;font-weight:900}
    .chapter-formula-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.chapter-formula-card{min-width:0;border:1px solid var(--line);background:#fffdf7;padding:15px 17px}.chapter-formula-card h3{margin:0 0 .5em;color:var(--ink)}.chapter-formula-card p{margin:.4em 0 0;color:var(--muted);font-size:.9rem}.chapter-formula-card mjx-container[display="true"]{font-size:.96em}
    .chapter-notebook-card{border:1px solid #c69b70;background:#fffdf7;padding:18px 20px}.chapter-notebook-card p{margin:0 0 12px;color:var(--muted)}.notebook-cta{display:inline-flex;align-items:center;min-height:42px;border-radius:7px;background:var(--accent);padding:0 16px;color:#fff;font-family:"Noto Sans SC","Microsoft YaHei",sans-serif;font-size:.92rem;font-weight:800;text-decoration:none}.notebook-cta:hover{background:#7b2f24}.chapter-source-url{display:block;overflow-wrap:anywhere;border:1px dashed var(--line);background:var(--paper);padding:9px 11px;color:var(--muted);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.78rem;line-height:1.5}.chapter-source-url[hidden]{display:none}
    .chapter-notebook-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.notebook-edit-button,.notebook-reset-button,.notebook-save-button,.notebook-cancel-button{min-height:38px;border:1px solid var(--line);border-radius:6px;background:var(--paper);padding:0 13px;color:var(--ink);font-family:"Noto Sans SC","Microsoft YaHei",sans-serif;font-size:.86rem;font-weight:800;cursor:pointer}.notebook-edit-button:hover,.notebook-reset-button:hover,.notebook-cancel-button:hover{border-color:var(--accent);color:var(--accent)}.notebook-save-button{border-color:var(--accent);background:var(--accent);color:#fff}.notebook-save-button:hover{background:#7b2f24}.notebook-edit-button:disabled,.notebook-reset-button:disabled,.notebook-save-button:disabled,.notebook-cancel-button:disabled{cursor:not-allowed;opacity:.55}.notebook-reset-button[hidden],.notebook-edit-form[hidden]{display:none}.notebook-edit-form{margin-top:14px;border-top:1px solid var(--line);padding-top:14px}.notebook-edit-form label{display:block;margin-bottom:6px;font-family:"Noto Sans SC","Microsoft YaHei",sans-serif;font-size:.88rem;font-weight:800}.notebook-edit-form label:not(:first-child){margin-top:12px}.notebook-edit-form input{width:100%;min-height:42px;border:1px solid var(--line);border-radius:6px;background:#fff;padding:8px 10px;color:var(--ink);font:inherit}.notebook-edit-form input:focus{border-color:var(--accent);outline:2px solid #a13d2d22}.notebook-edit-help{margin:8px 0 0!important;font-size:.82rem}.notebook-edit-status{min-height:1.5em;margin:8px 0 0!important;color:var(--accent)!important;font-family:"Noto Sans SC","Microsoft YaHei",sans-serif;font-size:.84rem;font-weight:700}
    @media(max-width:900px){.notebook-shell{width:min(900px,calc(100% - 28px));grid-template-columns:1fr}.notebook-shell>main{grid-column:1;grid-row:2}.notebook-sidebar{grid-column:1;grid-row:1;position:static;max-height:280px}.notebook-directory{grid-template-columns:repeat(auto-fit,minmax(210px,1fr))}}
    @media(max-width:700px){.chapter-formula-grid{grid-template-columns:1fr}}
    @media(max-width:600px){.notebook-shell{width:100%;margin:0;gap:0}.notebook-shell>main{margin:0;width:100%;box-shadow:none;padding:25px 20px}.notebook-sidebar{border-right:0;border-left:0;padding:18px 20px}.notebook-directory{grid-template-columns:1fr}.lesson-pager{display:block}.lesson-pager a{display:block;margin:.5em 0}}
    """


def notebooklm_math_head():
    return r"""
    <script>
      window.MathJax = {
        tex: {
          inlineMath: [["\\(", "\\)"]],
          displayMath: [["\\[", "\\]"]],
          processEscapes: true
        },
        chtml: {
          displayAlign: "left",
          displayIndent: "0"
        },
        options: {
          skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"]
        }
      };
    </script>
    <script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    """


def notebooklm_chapter_editor_script():
    return r"""
    <script>
      (function () {
        var card = document.querySelector(".chapter-notebook-card[data-chapter]");
        if (!card) return;

        var chapter = card.getAttribute("data-chapter") || "";
        var defaultUrl = card.getAttribute("data-default-url") || "";
        var currentUrl = card.getAttribute("data-current-url") || defaultUrl;
        var hasOverride = card.getAttribute("data-has-override") === "1";
        var editEnabled = card.getAttribute("data-edit-enabled") === "1";
        var description = card.querySelector(".notebook-status-copy");
        var linkSlot = card.querySelector(".notebook-link-slot");
        var sourceUrl = card.querySelector(".chapter-source-url");
        var editButton = card.querySelector(".notebook-edit-button");
        var resetButton = card.querySelector(".notebook-reset-button");
        var form = card.querySelector(".notebook-edit-form");
        var input = card.querySelector(".notebook-url-input");
        var passwordInput = card.querySelector(".notebook-password-input");
        var saveButton = card.querySelector(".notebook-save-button");
        var cancelButton = card.querySelector(".notebook-cancel-button");
        var status = card.querySelector(".notebook-edit-status");

        function normalizeNotebookUrl(value) {
          var text = String(value || "").trim();
          if (!text) return "";
          try {
            var parsed = new URL(text);
            var match = parsed.pathname.match(/^\/notebook\/([A-Za-z0-9_-]+)/);
            if (parsed.protocol !== "https:" || parsed.hostname !== "notebooklm.google.com" || !match) return "";
            return "https://notebooklm.google.com/notebook/" + match[1];
          } catch (error) {
            return "";
          }
        }

        function clearLinkSlot() {
          while (linkSlot.firstChild) linkSlot.removeChild(linkSlot.firstChild);
        }

        function renderLink() {
          clearLinkSlot();
          if (currentUrl) {
            var link = document.createElement("a");
            link.className = "notebook-cta";
            link.href = currentUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "打开 " + chapter + " NotebookLM 笔记";
            linkSlot.appendChild(link);
            description.textContent = hasOverride
              ? "本章正在使用服务器保存的 NotebookLM 笔记网址，所有设备均可访问。"
              : "本章已经关联 NotebookLM 笔记，可继续查看音频、视频、问答和其他学习材料。";
            sourceUrl.hidden = true;
            editButton.textContent = "修改笔记网址";
          } else {
            description.textContent = "本章尚未关联 NotebookLM 笔记。下面的章节地址可以直接添加为 NotebookLM 网站来源。";
            sourceUrl.hidden = false;
            editButton.textContent = "添加笔记网址";
          }
          resetButton.hidden = !hasOverride;
          input.value = currentUrl;
        }

        renderLink();
        if (!editEnabled) {
          editButton.disabled = true;
          editButton.textContent = "服务器端编辑未配置";
          status.textContent = "当前环境没有配置管理密码，因此仅支持查看。";
        }

        editButton.addEventListener("click", function () {
          if (!editEnabled) return;
          form.hidden = !form.hidden;
          status.textContent = "";
          if (!form.hidden) {
            input.value = currentUrl;
            input.focus();
          }
        });

        cancelButton.addEventListener("click", function () {
          form.hidden = true;
          status.textContent = "";
        });

        function setBusy(busy) {
          saveButton.disabled = busy;
          resetButton.disabled = busy;
          cancelButton.disabled = busy;
          input.disabled = busy;
          passwordInput.disabled = busy;
        }

        function errorMessage(result, responseStatus) {
          if (responseStatus === 401) return "管理密码不正确。";
          if (responseStatus === 429) return "密码尝试次数过多，请十分钟后再试。";
          if (responseStatus === 503) return "当前服务器尚未配置 NotebookLM 编辑密码。";
          if (result && result.error === "invalid_notebooklm_url") return "请输入有效的 NotebookLM 笔记网址。";
          return "保存失败，请稍后重试。";
        }

        async function saveOverride(url, restoring) {
          var password = passwordInput.value;
          if (!password) {
            status.textContent = "请输入管理密码。";
            passwordInput.focus();
            return;
          }
          setBusy(true);
          try {
            var response = await fetch("/api/notebooklm-link", {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({chapter: chapter, url: url, password: password})
            });
            var result = await response.json();
            if (!response.ok || !result.ok) {
              status.textContent = errorMessage(result, response.status);
              return;
            }
            currentUrl = result.url || defaultUrl;
            hasOverride = Boolean(result.hasOverride);
            renderLink();
            form.hidden = true;
            passwordInput.value = "";
            status.textContent = restoring
              ? (defaultUrl ? "已恢复项目中的默认网址，所有设备已同步。" : "已移除服务器网址，所有设备已同步。")
              : "NotebookLM 笔记网址已保存到服务器，所有设备已同步。";
          } catch (error) {
            status.textContent = "无法连接服务器，请检查网络后重试。";
          } finally {
            setBusy(false);
          }
        }

        form.addEventListener("submit", function (event) {
          event.preventDefault();
          var normalized = normalizeNotebookUrl(input.value);
          if (!normalized) {
            status.textContent = "请输入以 https://notebooklm.google.com/notebook/ 开头的有效网址。";
            return;
          }
          saveOverride(normalized, false);
        });

        resetButton.addEventListener("click", function () {
          saveOverride("", true);
        });
      }());
    </script>
    """


def text_block(value):
    if value is None:
        return ""
    return escape(str(value)).replace("\n", "<br>")


def summarize_problem_question(value, limit=155):
    text = re.sub(r"\s+", " ", str(value or "")).strip()
    text = text.replace("**", "")
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip("，,；;。.") + "…"


def derive_notebooklm_notebook_url(chapter_items, guide):
    configured = guide.get("notebooklmUrl") if isinstance(guide, dict) else None
    candidates = [configured] if isinstance(configured, str) else []
    for _, problem in chapter_items:
        media = problem.get("notebooklm") if isinstance(problem.get("notebooklm"), list) else []
        candidates.extend(item.get("url") for item in media if isinstance(item, dict))
    for candidate in candidates:
        normalized = normalize_notebooklm_url(candidate)
        if normalized:
            return normalized
    return ""


def render_notebooklm_sidebar(kicker, title, links, current_href=None, footer=None):
    items = []
    for href, label in links:
        is_current = href == current_href
        current_class = " is-current" if is_current else ""
        current_attr = ' aria-current="page"' if is_current else ""
        items.append(
            f'<a class="{current_class.strip()}" href="{escape(href, quote=True)}"{current_attr}>'
            f'{escape(label)}</a>'
        )
    footer_html = ""
    footer_links = []
    if footer:
        footer_links = footer if isinstance(footer, list) else [footer]
    for footer_href, footer_label in footer_links:
        footer_html += (
            f'<a class="sidebar-footer" href="{escape(footer_href, quote=True)}">'
            f'{escape(footer_label)}</a>'
        )
    return (
        f'<aside class="notebook-sidebar"><p class="sidebar-kicker">{escape(kicker)}</p>'
        f'<h2>{escape(title)}</h2><nav class="notebook-directory" aria-label="{escape(title, quote=True)}">'
        f'{"".join(items)}</nav>{footer_html}</aside>'
    )


def render_problem_page(handler, problem_id, problem, previous_id=None, next_id=None, chapter_items=None):
    title = problem.get("title") or problem_id
    chapter = problem.get("chapter") or "未分类"
    canonical = f"{request_origin(handler)}/notebooklm/{quote(problem_id)}"
    options = problem.get("options") if isinstance(problem.get("options"), list) else []
    steps = problem.get("steps") if isinstance(problem.get("steps"), list) else []
    knowledge = problem.get("knowledge") if isinstance(problem.get("knowledge"), list) else []
    analysis = problem.get("analysis")
    analysis_text = analysis.get("content") if isinstance(analysis, dict) else problem.get("analysisText")
    practice = problem.get("practice") if isinstance(problem.get("practice"), dict) else None
    chapter_items = chapter_items or [(problem_id, problem)]
    sidebar_links = [
        (f"/notebooklm/{quote(item_id)}", item_problem.get("title") or item_id)
        for item_id, item_problem in chapter_items
    ]
    current_href = f"/notebooklm/{quote(problem_id)}"
    sidebar_html = render_notebooklm_sidebar(
        "本章目录",
        chapter,
        sidebar_links,
        current_href=current_href,
        footer=[
            (notebooklm_chapter_path(chapter), "本章概览与公式"),
            ("/notebooklm/", "查看全部章节"),
        ],
    )

    options_html = ""
    if options:
        options_html = "<h2>选项</h2><ol>" + "".join(f"<li>{text_block(option)}</li>" for option in options) + "</ol>"
    knowledge_html = ""
    if knowledge:
        knowledge_html = '<h2>核心知识点</h2><div class="knowledge">' + "".join(
            f'<span class="tag">{text_block(item)}</span>' for item in knowledge
        ) + "</div>"
    steps_html = ""
    if steps:
        cards = []
        for index, step in enumerate(steps, 1):
            step_title = step.get("title") or f"步骤 {index}"
            mistakes = step.get("commonMistakes") if isinstance(step.get("commonMistakes"), list) else []
            mistake_html = ""
            if mistakes:
                mistake_html = "<h3>易错点</h3><ul>" + "".join(
                    f"<li>{text_block(item)}</li>" for item in mistakes
                ) + "</ul>"
            cards.append(
                f'<section class="step"><h3>{index}. {text_block(step_title)}</h3>'
                f'<p>{text_block(step.get("content"))}</p>{mistake_html}</section>'
            )
        steps_html = "<h2>分步解析</h2>" + "".join(cards)
    analysis_html = f'<h2>整体解析</h2><div class="formula">{text_block(analysis_text)}</div>' if analysis_text else ""
    answer_html = f'<h2>参考答案</h2><div class="answer">{text_block(problem.get("answer"))}</div>' if problem.get("answer") else ""
    practice_html = ""
    if practice:
        practice_html = (
            '<h2>变式练习</h2><section class="practice">'
            f'<h3>{text_block(practice.get("title") or "变式题")}</h3>'
            f'<p>{text_block(practice.get("question"))}</p>'
            f'<h3>变式答案</h3><p>{text_block(practice.get("answer"))}</p>'
            f'<h3>思路提示</h3><p>{text_block(practice.get("thinking"))}</p></section>'
        )
    previous_link = f'<a rel="prev" href="/notebooklm/{quote(previous_id)}">← 上一课</a>' if previous_id else "<span></span>"
    next_link = f'<a rel="next" href="/notebooklm/{quote(next_id)}">下一课 →</a>' if next_id else "<span></span>"

    return f"""<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)}｜FanPhysics NotebookLM 讲义</title><meta name="description" content="{escape(chapter)}：{escape(title)}的题目、答案和分步解析。">
<link rel="canonical" href="{escape(canonical)}"><style>{notebooklm_styles()}</style>{notebooklm_math_head()}</head>
<body><div class="notebook-shell"><main><header><div class="eyebrow">FANPHYSICS · NOTEBOOKLM 讲义</div><h1>{escape(title)}</h1>
<div class="meta">章节：{escape(chapter)}　·　资料编号：{escape(problem_id)}</div></header>
<article><h2>题目</h2><p>{text_block(problem.get("question"))}</p>{options_html}{knowledge_html}{answer_html}{analysis_html}{steps_html}{practice_html}</article>
<nav class="lesson-pager">{previous_link}<a href="/notebooklm/">全部独立课例</a>{next_link}</nav></main>{sidebar_html}</div></body></html>"""


def render_notebooklm_chapter_page(handler, chapter, chapter_items, grouped, guide, notebook_override=""):
    canonical = f"{request_origin(handler)}{notebooklm_chapter_path(chapter)}"
    knowledge_counts = Counter()
    for _, problem in chapter_items:
        knowledge = problem.get("knowledge") if isinstance(problem.get("knowledge"), list) else []
        knowledge_counts.update(str(item) for item in knowledge if item)
    knowledge = [item for item, _ in knowledge_counts.most_common(18)]
    laws = guide.get("laws") if isinstance(guide.get("laws"), list) else []
    formulas = guide.get("formulas") if isinstance(guide.get("formulas"), list) else []

    problem_cards = []
    for problem_id, problem in chapter_items:
        title = problem.get("title") or problem_id
        summary = summarize_problem_question(problem.get("question"))
        problem_cards.append(
            '<li class="chapter-problem-card">'
            f'<a href="/notebooklm/{quote(problem_id)}">{escape(title)}</a>'
            f'<p>{text_block(summary)}</p></li>'
        )
    knowledge_html = "".join(f'<span class="tag">{escape(item)}</span>' for item in knowledge)
    laws_html = "".join(f'<li>{text_block(item)}</li>' for item in laws)
    formula_cards = []
    for formula in formulas:
        if not isinstance(formula, dict):
            continue
        formula_cards.append(
            '<section class="chapter-formula-card">'
            f'<h3>{escape(str(formula.get("title") or "公式"))}</h3>'
            f'<div>{text_block(formula.get("latex"))}</div>'
            f'<p>{text_block(formula.get("note"))}</p></section>'
        )

    default_notebook_url = derive_notebooklm_notebook_url(chapter_items, guide)
    notebook_override = normalize_notebooklm_url(notebook_override)
    has_notebook_override = bool(notebook_override)
    notebook_url = notebook_override or default_notebook_url
    if notebook_url:
        notebook_description = (
            "本章正在使用服务器保存的 NotebookLM 笔记网址，所有设备均可访问。"
            if has_notebook_override
            else "本章已经关联 NotebookLM 笔记，可继续查看音频、视频、问答和其他学习材料。"
        )
        notebook_link = (
            f'<a class="notebook-cta" href="{escape(notebook_url, quote=True)}" target="_blank" '
            f'rel="noopener noreferrer">打开 {escape(chapter)} NotebookLM 笔记</a>'
        )
        source_hidden = " hidden"
        edit_label = "修改笔记网址"
    else:
        notebook_description = "本章尚未关联 NotebookLM 笔记。下面的章节地址可以直接添加为 NotebookLM 网站来源。"
        notebook_link = ""
        source_hidden = ""
        edit_label = "添加笔记网址"
    edit_disabled = "" if NOTEBOOKLM_EDIT_ENABLED else " disabled"
    edit_status = "" if NOTEBOOKLM_EDIT_ENABLED else "当前环境没有配置管理密码，因此仅支持查看。"
    reset_hidden = "" if has_notebook_override else " hidden"
    notebook_content = (
        f'<p class="notebook-status-copy">{escape(notebook_description)}</p>'
        f'<div class="notebook-link-slot">{notebook_link}</div>'
        f'<code class="chapter-source-url"{source_hidden}>{escape(canonical)}</code>'
        '<div class="chapter-notebook-actions">'
        f'<button class="notebook-edit-button" type="button"{edit_disabled}>{edit_label}</button></div>'
        '<form class="notebook-edit-form" hidden>'
        '<label for="notebook-url-input">NotebookLM 笔记网址</label>'
        '<input class="notebook-url-input" id="notebook-url-input" type="url" inputmode="url" '
        'autocomplete="url" placeholder="https://notebooklm.google.com/notebook/..." required>'
        '<label for="notebook-edit-password">管理密码</label>'
        '<input class="notebook-password-input" id="notebook-edit-password" type="password" '
        'autocomplete="current-password" minlength="12" required>'
        '<div class="chapter-notebook-actions">'
        '<button class="notebook-save-button" type="submit">保存</button>'
        f'<button class="notebook-reset-button" type="button"{reset_hidden}>恢复默认</button>'
        '<button class="notebook-cancel-button" type="button">取消</button></div>'
        '<p class="notebook-edit-help">验证管理密码后保存到服务器，刷新、换浏览器或换设备都能看到。</p>'
        f'</form><p class="notebook-edit-status" role="status" aria-live="polite">{escape(edit_status)}</p>'
    )

    chapter_links = [(notebooklm_chapter_path(item), item) for item in grouped]
    current_href = notebooklm_chapter_path(chapter)
    sidebar_html = render_notebooklm_sidebar(
        "章节主页",
        "全部章节",
        chapter_links,
        current_href=current_href,
        footer=("/notebooklm/", "返回课例总目录"),
    )
    overview = guide.get("overview") or f"本章共收录 {len(chapter_items)} 道题。"

    return f"""<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(chapter)}｜FanPhysics 章节主页</title><meta name="description" content="{escape(chapter)}题目概括、核心定理、公式汇总与 NotebookLM 笔记入口。">
<link rel="canonical" href="{escape(canonical)}"><style>{notebooklm_styles()}</style>{notebooklm_math_head()}</head>
<body><div class="notebook-shell"><main><header><div class="eyebrow">FANPHYSICS · CHAPTER GUIDE</div><h1>{escape(chapter)}</h1>
<p>{text_block(overview)}</p><div class="chapter-meta-row"><span>{len(chapter_items)} 道题</span><span>{len(knowledge)} 个核心知识点</span><span>{len(formulas)} 组公式</span></div></header>
<article><h2>章节题目概括</h2><ol class="chapter-problem-list">{"".join(problem_cards)}</ol>
<h2>章节定理、规律与公式汇总</h2><div class="knowledge">{knowledge_html}</div>
<h3>核心定理与规律</h3><ol class="chapter-law-list">{laws_html}</ol>
<h3>常用公式</h3><div class="chapter-formula-grid">{"".join(formula_cards)}</div>
<h2>NotebookLM 笔记</h2><section class="chapter-notebook-card" data-chapter="{escape(chapter, quote=True)}" data-default-url="{escape(default_notebook_url, quote=True)}" data-current-url="{escape(notebook_url, quote=True)}" data-has-override="{1 if has_notebook_override else 0}" data-edit-enabled="{1 if NOTEBOOKLM_EDIT_ENABLED else 0}">{notebook_content}</section></article>
<nav class="lesson-pager"><a href="/notebooklm/">课例总目录</a><a href="/classical-mechanics-demo.html">返回动态模型库</a></nav>
</main>{sidebar_html}</div>{notebooklm_chapter_editor_script()}</body></html>"""


def render_notebooklm_index(handler, catalog):
    grouped = group_problem_catalog(catalog)
    sections = []
    sidebar_links = []
    for chapter_index, (chapter, items) in enumerate(grouped.items(), 1):
        anchor = f"chapter-{chapter_index}"
        chapter_href = notebooklm_chapter_path(chapter)
        links = "".join(
            f'<a href="/notebooklm/{quote(problem_id)}"><strong>{escape(problem.get("title") or problem_id)}</strong>'
            f'<br><span class="quiet">{escape(problem_id)}</span></a>'
            for problem_id, problem in items
        )
        sections.append(
            f'<section id="{anchor}" class="directory-section"><h2><a class="chapter-heading-link" '
            f'href="{escape(chapter_href, quote=True)}">{escape(chapter)}</a></h2><div class="directory">{links}</div></section>'
        )
        sidebar_links.append((chapter_href, chapter))
    sidebar_html = render_notebooklm_sidebar(
        "一级目录",
        "全部章节",
        sidebar_links,
        footer=("/classical-mechanics-demo.html", "返回动态模型库"),
    )
    canonical = f"{request_origin(handler)}/notebooklm/"
    return f"""<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FanPhysics 独立课例地址</title><meta name="description" content="供 NotebookLM 导入的 FanPhysics 单课讲义目录。">
<link rel="canonical" href="{escape(canonical)}"><style>{notebooklm_styles()}</style></head><body><div class="notebook-shell"><main>
<header><div class="eyebrow">NOTEBOOKLM SOURCE DIRECTORY</div><h1>独立课例地址</h1><p class="meta">每个链接都是服务端生成的完整讲义，可直接复制到 NotebookLM；浏览器端会增强公式排版。</p></header>
{''.join(sections)}</main>{sidebar_html}</div></body></html>"""


def json_response(handler, status, payload):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def handle_notebooklm_link_update(handler):
    if not NOTEBOOKLM_EDIT_ENABLED:
        json_response(handler, 503, {"ok": False, "error": "editing_not_configured"})
        return
    try:
        content_length = int(handler.headers.get("Content-Length", "0") or "0")
    except ValueError:
        content_length = 0
    if content_length <= 0 or content_length > MAX_NOTEBOOKLM_EDIT_BODY_BYTES:
        json_response(handler, 413, {"ok": False, "error": "invalid_body_size"})
        return
    try:
        payload = json.loads(handler.rfile.read(content_length).decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        json_response(handler, 400, {"ok": False, "error": "invalid_json"})
        return
    if not isinstance(payload, dict):
        json_response(handler, 400, {"ok": False, "error": "invalid_payload"})
        return

    client_ip = notebooklm_edit_client_ip(handler)
    if notebooklm_auth_is_limited(client_ip):
        json_response(handler, 429, {"ok": False, "error": "rate_limited"})
        return
    if not notebooklm_password_matches(payload.get("password")):
        record_notebooklm_auth_failure(client_ip)
        json_response(handler, 401, {"ok": False, "error": "authentication_failed"})
        return
    clear_notebooklm_auth_failures(client_ip)

    chapter = payload.get("chapter")
    raw_url = payload.get("url")
    if not isinstance(chapter, str) or not isinstance(raw_url, str):
        json_response(handler, 400, {"ok": False, "error": "invalid_payload"})
        return
    try:
        grouped = group_problem_catalog(load_problem_catalog())
    except (OSError, json.JSONDecodeError):
        json_response(handler, 500, {"ok": False, "error": "catalog_unavailable"})
        return
    if chapter not in grouped:
        json_response(handler, 404, {"ok": False, "error": "chapter_not_found"})
        return

    normalized_url = normalize_notebooklm_url(raw_url)
    if raw_url.strip() and not normalized_url:
        json_response(handler, 400, {"ok": False, "error": "invalid_notebooklm_url"})
        return
    try:
        save_notebooklm_link_override(chapter, normalized_url)
    except OSError:
        json_response(handler, 500, {"ok": False, "error": "storage_unavailable"})
        return
    json_response(
        handler,
        200,
        {
            "ok": True,
            "chapter": chapter,
            "url": normalized_url,
            "hasOverride": bool(normalized_url),
        },
    )


def normalize_conversation_history(payload):
    raw_history = payload.get("conversationHistory", [])
    if not isinstance(raw_history, list):
        return []
    history = []
    for item in raw_history[-MAX_CONVERSATION_MESSAGES:]:
        if not isinstance(item, dict):
            continue
        role = item.get("role")
        content = item.get("content")
        if role not in {"user", "assistant"} or not isinstance(content, str):
            continue
        content = content.strip()[:MAX_CONVERSATION_MESSAGE_CHARS]
        if content:
            history.append({"role": role, "content": content})
    while history and history[0]["role"] != "user":
        history.pop(0)
    return history


def build_step_ai_messages(payload):
    assistant_subject = payload.get("assistantSubject")
    context = {
        "assistantSubject": assistant_subject,
        "problemId": payload.get("problemId"),
        "problemTitle": payload.get("problemTitle"),
        "problemQuestion": payload.get("problemQuestion"),
        "referenceAnswer": payload.get("referenceAnswer"),
        "solutionSteps": payload.get("solutionSteps", []),
        "stepId": payload.get("stepId"),
        "stepTitle": payload.get("stepTitle"),
        "stepContent": payload.get("stepContent"),
        "previousSteps": payload.get("previousSteps", []),
        "knowledge": payload.get("knowledge", []),
        "commonMistakes": payload.get("commonMistakes", []),
        "animationState": payload.get("animationState") or {},
        "studentState": payload.get("studentState") or {},
        "intent": payload.get("intent"),
    }
    history = normalize_conversation_history(payload)
    user_question = payload.get("userQuestion")
    if not isinstance(user_question, str) or not user_question.strip():
        user_question = "请解释当前步骤。"
    user_question = user_question.strip()[:MAX_CONVERSATION_MESSAGE_CHARS]
    if assistant_subject == "math":
        system = (
            "你是 FanMath 的步骤级高中数学 AI 助教。"
            "只围绕当前数学题目、当前解析步骤和页面图形回答，不重写整题；用高中生容易理解的语言。"
            "如果提供了历史对话，要承接学生上一轮的问题和你的回答，直接回答新的追问。"
            "回答要具体、贴合当前图像状态、实时量和前置步骤，通常控制在 3 到 8 句话。"
            "所有数学公式都必须使用 LaTeX：行内公式用 \\(...\\)，独立公式用 \\[...\\]。"
            "不要把公式写成纯文本，例如要写 \\(a^2+b^2=c^2\\)，不要写 a^2+b^2=c^2。"
            "不要编造题目没有给出的数值；不确定时说明需要看图或参数。"
            "严格遵守 referenceAnswer 和 solutionSteps 中的定义、符号和结论。"
            "只输出文字 Markdown 和 LaTeX，不生成朗读稿或音频说明。"
            "\n\n当前题目和步骤上下文（JSON）：\n"
            + json.dumps(context, ensure_ascii=False)
        )
    else:
        system = (
            "你是 FanPhysics 的步骤级高中物理 AI 助教。"
            "只围绕当前题目和当前步骤回答，不重写整题；用高中生容易理解的语言。"
            "如果提供了历史对话，要承接学生上一轮的问题和你的回答，直接回答新的追问。"
            "回答要具体、贴合动画状态和前置步骤，通常控制在 3 到 8 句话。"
            "如果有 animationState，要引用这一帧的时间、速度、位置等信息解释。"
            "所有物理公式都必须使用 LaTeX：行内公式用 \\(...\\)，独立公式用 \\[...\\]。"
            "不要把公式写成纯文本，例如要写 \\(s=vt\\)，不要写 s=vt。"
            "不要编造题目没有给出的数值；不确定时说明需要看图或参数。"
            "严格遵守 referenceAnswer 和 solutionSteps 中的定义与符号约定，尤其要区分势能差的大小与"
            "势能变化量 \\(\\Delta E_p=E_{p,\\text{末}}-E_{p,\\text{初}}\\)。"
            "只输出文字 Markdown 和 LaTeX，不生成朗读稿或音频说明。"
            "\n\n当前题目和步骤上下文（JSON）：\n"
            + json.dumps(context, ensure_ascii=False)
        )
    messages = [{"role": "system", "content": system}]
    messages.extend(history)
    messages.append({"role": "user", "content": user_question})
    return messages


def call_deepseek(payload):
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        raise RuntimeError("Missing DEEPSEEK_API_KEY")

    body = {
        "model": DEEPSEEK_MODEL,
        "messages": build_step_ai_messages(payload),
        "stream": False,
        "temperature": 0.2,
        "max_tokens": 900,
        "thinking": {"type": DEEPSEEK_THINKING},
    }
    data = json.dumps(body, ensure_ascii=False).encode("utf-8")
    result = None
    for attempt in range(DEEPSEEK_MAX_RETRIES + 1):
        request = urllib.request.Request(
            DEEPSEEK_API_URL,
            data=data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=DEEPSEEK_TIMEOUT_SECONDS) as response:
                result = json.loads(response.read().decode("utf-8"))
            break
        except urllib.error.HTTPError as error:
            if error.code not in RETRYABLE_HTTP_STATUS or attempt >= DEEPSEEK_MAX_RETRIES:
                raise
            retry_after = error.headers.get("Retry-After")
            try:
                delay = min(10.0, max(0.0, float(retry_after)))
            except (TypeError, ValueError):
                delay = min(5.0, 2.0**attempt)
            error.close()
            time.sleep(delay)
        except urllib.error.URLError as error:
            if isinstance(error.reason, ssl.SSLCertVerificationError):
                result = call_deepseek_with_system_curl(data, api_key)
                break
            if attempt >= DEEPSEEK_MAX_RETRIES:
                raise
            time.sleep(min(5.0, 2.0**attempt))
        except (TimeoutError, socket.timeout):
            if attempt >= DEEPSEEK_MAX_RETRIES:
                raise
            time.sleep(min(5.0, 2.0**attempt))
    if result is None:
        raise urllib.error.URLError("DeepSeek request ended without a response")
    return result["choices"][0]["message"]["content"]


def call_deepseek_with_system_curl(data, api_key):
    command = [
        "curl",
        "--silent",
        "--show-error",
        "--fail-with-body",
        "--max-time",
        str(int(DEEPSEEK_TIMEOUT_SECONDS)),
        "--request",
        "POST",
        DEEPSEEK_API_URL,
        "--header",
        "Content-Type: application/json",
        "--header",
        f"Authorization: Bearer {api_key}",
        "--data-binary",
        "@-",
    ]
    completed = subprocess.run(command, input=data, capture_output=True, check=False)
    if completed.returncode != 0:
        detail = completed.stderr.decode("utf-8", errors="replace").strip()
        if not detail:
            detail = completed.stdout.decode("utf-8", errors="replace").strip()
        raise urllib.error.URLError(detail or f"curl exited with code {completed.returncode}")
    return json.loads(completed.stdout.decode("utf-8"))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store")
        elif APP_ENV != "production":
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        elif parsed.path.startswith("/assets/") and "v=" in parsed.query:
            self.send_header("Cache-Control", "public, max-age=31536000, immutable")
        elif parsed.path.startswith("/assets/"):
            self.send_header("Cache-Control", "public, max-age=3600")
        else:
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def translate_path(self, path):
        parsed = urlparse(path)
        if parsed.path == "/":
            path = "/classical-mechanics-demo.html"
        return super().translate_path(path)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            json_response(self, 200, {"ok": True})
            return
        if parsed.path in {"/notebooklm", "/notebooklm/"}:
            try:
                catalog = load_problem_catalog()
            except (OSError, json.JSONDecodeError):
                html_response(self, 500, "<!doctype html><meta charset='utf-8'><h1>课例目录暂不可用</h1>")
                return
            html_response(self, 200, render_notebooklm_index(self, catalog))
            return
        if parsed.path.startswith("/notebooklm/chapter/"):
            chapter = unquote(parsed.path.removeprefix("/notebooklm/chapter/")).strip("/")
            try:
                catalog = load_problem_catalog()
                guides = load_chapter_guides()
                notebook_overrides = load_notebooklm_link_overrides()
            except (OSError, json.JSONDecodeError):
                html_response(self, 500, "<!doctype html><meta charset='utf-8'><h1>章节主页暂不可用</h1>")
                return
            grouped = group_problem_catalog(catalog)
            chapter_items = grouped.get(chapter)
            if not chapter_items:
                html_response(self, 404, "<!doctype html><meta charset='utf-8'><h1>没有找到这个章节</h1><p><a href='/notebooklm/'>返回课例目录</a></p>")
                return
            html_response(
                self,
                200,
                render_notebooklm_chapter_page(
                    self,
                    chapter,
                    chapter_items,
                    grouped,
                    guides.get(chapter, {}),
                    notebook_overrides.get(chapter, ""),
                ),
            )
            return
        if parsed.path.startswith("/notebooklm/"):
            problem_id = unquote(parsed.path.removeprefix("/notebooklm/")).strip("/")
            if problem_id.endswith(".html"):
                problem_id = problem_id[:-5]
            try:
                catalog = load_problem_catalog()
            except (OSError, json.JSONDecodeError):
                html_response(self, 500, "<!doctype html><meta charset='utf-8'><h1>课例暂不可用</h1>")
                return
            problem_ids = [item_id for item_id, _ in catalog]
            try:
                index = problem_ids.index(problem_id)
            except ValueError:
                html_response(self, 404, "<!doctype html><meta charset='utf-8'><h1>没有找到这节课</h1><p><a href='/notebooklm/'>返回课例目录</a></p>")
                return
            previous_id = problem_ids[index - 1] if index > 0 else None
            next_id = problem_ids[index + 1] if index + 1 < len(problem_ids) else None
            current_problem = catalog[index][1]
            current_chapter = current_problem.get("chapter") or "未分类"
            chapter_items = [
                (item_id, item_problem)
                for item_id, item_problem in catalog
                if (item_problem.get("chapter") or "未分类") == current_chapter
            ]
            html_response(
                self,
                200,
                render_problem_page(
                    self,
                    problem_id,
                    current_problem,
                    previous_id,
                    next_id,
                    chapter_items,
                ),
            )
            return
        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/notebooklm-link":
            handle_notebooklm_link_update(self)
            return
        if parsed.path != "/api/step-ai":
            json_response(self, 404, {"ok": False, "error": "not_found"})
            return

        content_length = int(self.headers.get("Content-Length", "0") or "0")
        if content_length <= 0 or content_length > MAX_BODY_BYTES:
            json_response(self, 413, {"ok": False, "error": "invalid_body_size"})
            return

        try:
            raw = self.rfile.read(content_length)
            payload = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            json_response(self, 400, {"ok": False, "error": "invalid_json"})
            return

        try:
            answer = call_deepseek(payload)
        except RuntimeError as error:
            json_response(self, 500, {"ok": False, "error": str(error)})
            return
        except urllib.error.HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")
            json_response(self, error.code, {"ok": False, "error": "deepseek_http_error", "detail": detail})
            return
        except (urllib.error.URLError, TimeoutError) as error:
            json_response(self, 502, {"ok": False, "error": "deepseek_network_error", "detail": str(error)})
            return
        except (KeyError, IndexError, json.JSONDecodeError) as error:
            json_response(self, 502, {"ok": False, "error": "deepseek_bad_response", "detail": str(error)})
            return

        json_response(self, 200, {"ok": True, "answer": answer, "model": DEEPSEEK_MODEL})


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Serving http://{HOST}:{PORT}")
    print(f"Root {ROOT}")
    server.serve_forever()
