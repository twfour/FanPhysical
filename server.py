#!/usr/bin/env python3
import json
import os
import threading
import time
import urllib.error
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

from learning_sync import LearningSyncService, MAX_STATE_BODY_BYTES


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

from notebooklm_service import (
    NOTEBOOKLM_EDIT_ENABLED,
    NOTEBOOKLM_LINKS_PATH,
    group_problem_catalog,
    load_chapter_guides,
    load_notebooklm_link_overrides,
    load_problem_catalog,
    normalize_notebooklm_url,
    notebooklm_chapter_path,
    notebooklm_password_matches,
    render_notebooklm_chapter_page,
    render_notebooklm_index,
    render_problem_page,
    save_notebooklm_link_override,
)
from model_system_service import (
    render_model_system_detail,
    render_model_system_index,
)
from step_ai_service import DEEPSEEK_MODEL, MAX_BODY_BYTES, call_deepseek


HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8001"))
LEARNING_SYNC_PASSWORD = os.environ.get("LEARNING_SYNC_PASSWORD", "")
AUTH_FAILURES_LOCK = threading.RLock()
NOTEBOOKLM_AUTH_FAILURES = {}
LEARNING_AUTH_FAILURES = {}
AUTH_WINDOW_SECONDS = 10 * 60
AUTH_MAX_FAILURES = 6
MAX_NOTEBOOKLM_EDIT_BODY_BYTES = 8_000
LEARNING_STATE_PATH = Path(
    os.environ.get("LEARNING_STATE_PATH", str(NOTEBOOKLM_LINKS_PATH.with_name("learning-state.json")))
).expanduser()
if not LEARNING_STATE_PATH.is_absolute():
    LEARNING_STATE_PATH = ROOT / LEARNING_STATE_PATH
LEARNING_SYNC = LearningSyncService(
    password=LEARNING_SYNC_PASSWORD,
    state_path=LEARNING_STATE_PATH,
    app_env=APP_ENV,
)


def html_response(handler, status, html):
    body = html.encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "text/html; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def request_client_ip(handler):
    forwarded = handler.headers.get("X-Real-IP", "").strip()
    return forwarded or handler.client_address[0]


def auth_is_limited(failures, client_ip):
    now = time.monotonic()
    with AUTH_FAILURES_LOCK:
        attempts = [
            timestamp
            for timestamp in failures.get(client_ip, [])
            if now - timestamp < AUTH_WINDOW_SECONDS
        ]
        failures[client_ip] = attempts
        return len(attempts) >= AUTH_MAX_FAILURES


def record_auth_failure(failures, client_ip):
    with AUTH_FAILURES_LOCK:
        failures.setdefault(client_ip, []).append(time.monotonic())


def clear_auth_failures(failures, client_ip):
    with AUTH_FAILURES_LOCK:
        failures.pop(client_ip, None)

def json_response(handler, status, payload, headers=None):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    for key, value in (headers or {}).items():
        handler.send_header(key, value)
    handler.end_headers()
    handler.wfile.write(body)


def read_json_request(handler, max_body_bytes):
    try:
        content_length = int(handler.headers.get("Content-Length", "0") or "0")
    except ValueError:
        content_length = 0
    if content_length <= 0 or content_length > max_body_bytes:
        return None, "invalid_body_size"
    try:
        payload = json.loads(handler.rfile.read(content_length).decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return None, "invalid_json"
    if not isinstance(payload, dict):
        return None, "invalid_payload"
    return payload, None


def handle_learning_auth(handler):
    if not LEARNING_SYNC.enabled:
        json_response(handler, 503, {"ok": False, "error": "sync_not_configured"})
        return
    payload, error = read_json_request(handler, MAX_NOTEBOOKLM_EDIT_BODY_BYTES)
    if error:
        status = 413 if error == "invalid_body_size" else 400
        json_response(handler, status, {"ok": False, "error": error})
        return
    client_ip = request_client_ip(handler)
    if auth_is_limited(LEARNING_AUTH_FAILURES, client_ip):
        json_response(handler, 429, {"ok": False, "error": "rate_limited"})
        return
    if not LEARNING_SYNC.password_matches(payload.get("password")):
        record_auth_failure(LEARNING_AUTH_FAILURES, client_ip)
        json_response(handler, 401, {"ok": False, "error": "authentication_failed"})
        return
    clear_auth_failures(LEARNING_AUTH_FAILURES, client_ip)
    token = LEARNING_SYNC.create_session_token()
    state = LEARNING_SYNC.load_state()
    json_response(
        handler,
        200,
        {"ok": True, "state": state},
        {"Set-Cookie": LEARNING_SYNC.session_cookie(handler.headers, token)},
    )


def handle_learning_state_get(handler):
    if not LEARNING_SYNC.session_is_valid(handler.headers):
        json_response(handler, 401, {"ok": False, "error": "authentication_required"})
        return
    state = LEARNING_SYNC.load_state()
    json_response(handler, 200, {"ok": True, "state": state})


def handle_learning_state_update(handler):
    if not LEARNING_SYNC.session_is_valid(handler.headers):
        json_response(handler, 401, {"ok": False, "error": "authentication_required"})
        return
    payload, error = read_json_request(handler, MAX_STATE_BODY_BYTES)
    if error:
        status = 413 if error == "invalid_body_size" else 400
        json_response(handler, status, {"ok": False, "error": error})
        return
    if not isinstance(payload.get("state"), dict):
        json_response(handler, 400, {"ok": False, "error": "invalid_payload"})
        return
    try:
        state = LEARNING_SYNC.save_state(payload["state"])
    except OSError:
        json_response(handler, 500, {"ok": False, "error": "storage_unavailable"})
        return
    json_response(handler, 200, {"ok": True, "state": state})


def handle_learning_logout(handler):
    json_response(
        handler,
        200,
        {"ok": True},
        {"Set-Cookie": LEARNING_SYNC.session_cookie(handler.headers, "", max_age=0)},
    )


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

    client_ip = request_client_ip(handler)
    if auth_is_limited(NOTEBOOKLM_AUTH_FAILURES, client_ip):
        json_response(handler, 429, {"ok": False, "error": "rate_limited"})
        return
    if not notebooklm_password_matches(payload.get("password")):
        record_auth_failure(NOTEBOOKLM_AUTH_FAILURES, client_ip)
        json_response(handler, 401, {"ok": False, "error": "authentication_failed"})
        return
    clear_auth_failures(NOTEBOOKLM_AUTH_FAILURES, client_ip)

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


def handle_notebooklm_links_get(handler):
    try:
        catalog = load_problem_catalog()
        guides = load_chapter_guides()
        overrides = load_notebooklm_link_overrides()
    except (OSError, json.JSONDecodeError):
        json_response(handler, 500, {"ok": False, "error": "catalog_unavailable"})
        return

    chapters = []
    for chapter in group_problem_catalog(catalog):
        guide = guides.get(chapter, {})
        default_url = normalize_notebooklm_url(guide.get("notebooklmUrl", ""))
        url = overrides.get(chapter, "") or default_url
        if url:
            chapters.append(
                {
                    "chapter": chapter,
                    "url": url,
                    "chapterPath": notebooklm_chapter_path(chapter),
                }
            )
    json_response(handler, 200, {"ok": True, "chapters": chapters})



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
        if parsed.path == "/api/learning-state":
            handle_learning_state_get(self)
            return
        if parsed.path == "/api/notebooklm-links":
            handle_notebooklm_links_get(self)
            return
        if parsed.path in {"/models", "/models/"}:
            try:
                catalog = load_problem_catalog()
            except (OSError, json.JSONDecodeError):
                html_response(self, 500, "<!doctype html><meta charset='utf-8'><h1>模型图谱暂不可用</h1>")
                return
            html_response(self, 200, render_model_system_index(catalog))
            return
        if parsed.path.startswith("/models/"):
            model_id = unquote(parsed.path.removeprefix("/models/")).strip("/")
            try:
                catalog = load_problem_catalog()
            except (OSError, json.JSONDecodeError):
                html_response(self, 500, "<!doctype html><meta charset='utf-8'><h1>模型题族暂不可用</h1>")
                return
            page = render_model_system_detail(model_id, catalog)
            if page is None:
                html_response(self, 404, "<!doctype html><meta charset='utf-8'><h1>没有找到这个物理模型</h1><p><a href='/models/'>返回模型图谱</a></p>")
                return
            html_response(self, 200, page)
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
        if parsed.path == "/api/learning-auth":
            handle_learning_auth(self)
            return
        if parsed.path == "/api/learning-state":
            handle_learning_state_update(self)
            return
        if parsed.path == "/api/learning-logout":
            handle_learning_logout(self)
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
