#!/usr/bin/env python3
import json
import os
import socket
import ssl
import subprocess
import time
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


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
