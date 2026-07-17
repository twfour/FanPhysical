#!/usr/bin/env python3
import json
import os
import socket
import ssl
import subprocess
import time
import urllib.error
import urllib.request
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
    header{border-bottom:1px solid var(--line);padding-bottom:24px;margin-bottom:34px}.eyebrow{color:var(--accent);font-family:"Kaiti SC","STKaiti",serif;letter-spacing:.16em}
    h1{font-size:clamp(2rem,6vw,3.7rem);line-height:1.12;margin:.35em 0 .2em}h2{font-size:1.35rem;margin:2.2em 0 .7em;border-left:4px solid var(--accent);padding-left:.7em}
    h3{font-size:1.05rem;margin:1.5em 0 .35em}.meta,.quiet{color:var(--muted)}.formula,.answer,.step,.practice{border:1px solid var(--line);padding:16px 20px;margin:12px 0;background:#fffdf7}
    .answer{border-color:#c69b70}.knowledge{display:flex;gap:8px;flex-wrap:wrap}.tag{border:1px solid var(--line);padding:2px 10px;border-radius:999px;font-size:.88rem}
    mjx-container{color:var(--ink);font-size:1.04em}mjx-container[display="true"]{max-width:100%;margin:1em 0!important;padding:.25em 0 .4em;overflow-x:auto;overflow-y:hidden;text-align:left!important}
    ol,ul{padding-left:1.5em}a{color:#7b2f24;text-decoration-thickness:1px;text-underline-offset:3px}.directory{display:grid;gap:12px}.directory a{display:block;padding:14px 16px;border:1px solid var(--line);background:#fffdf7;text-decoration:none}.directory a:hover{border-color:var(--accent)}
    .lesson-pager{display:flex;justify-content:space-between;gap:16px;margin-top:42px;padding-top:22px;border-top:1px solid var(--line)}.directory-section{scroll-margin-top:20px}
    @media(max-width:900px){.notebook-shell{width:min(900px,calc(100% - 28px));grid-template-columns:1fr}.notebook-shell>main{grid-column:1;grid-row:2}.notebook-sidebar{grid-column:1;grid-row:1;position:static;max-height:280px}.notebook-directory{grid-template-columns:repeat(auto-fit,minmax(210px,1fr))}}
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


def text_block(value):
    if value is None:
        return ""
    return escape(str(value)).replace("\n", "<br>")


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
    if footer:
        footer_html = (
            f'<a class="sidebar-footer" href="{escape(footer[0], quote=True)}">'
            f'{escape(footer[1])}</a>'
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
        footer=("/notebooklm/", "查看全部章节"),
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


def render_notebooklm_index(handler, catalog):
    grouped = {}
    for problem_id, problem in catalog:
        grouped.setdefault(problem.get("chapter") or "未分类", []).append((problem_id, problem))
    sections = []
    sidebar_links = []
    for chapter_index, (chapter, items) in enumerate(grouped.items(), 1):
        anchor = f"chapter-{chapter_index}"
        links = "".join(
            f'<a href="/notebooklm/{quote(problem_id)}"><strong>{escape(problem.get("title") or problem_id)}</strong>'
            f'<br><span class="quiet">{escape(problem_id)}</span></a>'
            for problem_id, problem in items
        )
        sections.append(f'<section id="{anchor}" class="directory-section"><h2>{escape(chapter)}</h2><div class="directory">{links}</div></section>')
        sidebar_links.append((f"#{anchor}", chapter))
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
