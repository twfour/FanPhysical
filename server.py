#!/usr/bin/env python3
import json
import os
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent


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
MAX_BODY_BYTES = 120_000


def json_response(handler, status, payload):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def build_step_ai_messages(payload):
    context = {
        "problemId": payload.get("problemId"),
        "problemTitle": payload.get("problemTitle"),
        "stepId": payload.get("stepId"),
        "stepTitle": payload.get("stepTitle"),
        "stepContent": payload.get("stepContent"),
        "previousSteps": payload.get("previousSteps", []),
        "knowledge": payload.get("knowledge", []),
        "commonMistakes": payload.get("commonMistakes", []),
        "animationState": payload.get("animationState") or {},
        "studentState": payload.get("studentState") or {},
        "intent": payload.get("intent"),
        "userQuestion": payload.get("userQuestion"),
    }
    system = (
        "你是 FanPhysics 的步骤级初中物理 AI 助教。"
        "只解释当前步骤，不重写整题；优先用初中生能懂的话。"
        "回答要短、具体、贴合动画状态和前置步骤，通常控制在 3 到 6 句话。"
        "如果有 animationState，要引用这一帧的时间、速度、位置等信息解释。"
        "所有物理公式都必须使用 LaTeX：行内公式用 \\(...\\)，独立公式用 \\[...\\]。"
        "不要把公式写成纯文本，例如要写 \\(s=vt\\)，不要写 s=vt。"
        "不要编造题目没有给出的数值；不确定时说明需要看图或参数。"
    )
    user = (
        "请基于下面 JSON 上下文回答学生问题。"
        "输出 Markdown，建议包含：核心解释、为什么不是别的做法、下一步该看什么。"
        "涉及公式时必须使用 LaTeX。\n\n"
        + json.dumps(context, ensure_ascii=False)
    )
    return [
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ]


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
    }
    data = json.dumps(body, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        DEEPSEEK_API_URL,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        result = json.loads(response.read().decode("utf-8"))
    return result["choices"][0]["message"]["content"]


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

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
