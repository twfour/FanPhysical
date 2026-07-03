#!/usr/bin/env python3
import argparse
import json
import os
import re
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
API_URL = os.environ.get("DEEPSEEK_API_URL", "https://api.deepseek.com/chat/completions")
MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-flash")


def load_env_file(path):
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def extract_json(text):
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("DeepSeek response did not contain a JSON object")
    json_text = text[start:end + 1]
    try:
        return json.loads(json_text)
    except json.JSONDecodeError:
        # DeepSeek sometimes returns LaTeX like \( ... \) inside JSON strings.
        # In JSON, backslashes must be escaped unless they introduce a JSON escape.
        repaired = re.sub(r'\\(?!["\\/bfnrtu])', r"\\\\", json_text)
        return json.loads(repaired)


def call_deepseek(ocr_text, problem_id, chapter, title):
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        raise RuntimeError("Missing DEEPSEEK_API_KEY")

    system = (
        "你是 FanPhysics 的题目录入助手。"
        "把 OCR 文本整理成标准 JSON，只输出 JSON，不要输出解释。"
        "保留题干、选项、答案、分步解析、知识点和易错点。"
        "公式必须使用 LaTeX，行内公式用 \\(...\\)。"
        "如果 OCR 内容缺失，用空字符串或空数组，不要编造。"
    )
    user = {
        "id": problem_id,
        "chapter": chapter,
        "title": title,
        "schema": {
            "id": "string",
            "chapter": "string",
            "title": "string",
            "question": "string",
            "options": ["string"],
            "answer": "string",
            "knowledge": ["string"],
            "steps": [
                {
                    "stepId": 1,
                    "title": "string",
                    "content": "string",
                    "knowledge": ["string"],
                    "commonMistakes": ["string"]
                }
            ],
            "summary": {
                "title": "string",
                "content": "string"
            }
        },
        "ocrText": ocr_text
    }
    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": json.dumps(user, ensure_ascii=False)}
        ],
        "temperature": 0.1,
        "stream": False
    }
    request = urllib.request.Request(
        API_URL,
        data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        result = json.loads(response.read().decode("utf-8"))
    return extract_json(result["choices"][0]["message"]["content"])


def call_deepseek_batch(ocr_text, chapter, id_prefix, source_name):
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        raise RuntimeError("Missing DEEPSEEK_API_KEY")

    system = (
        "你是 FanPhysics 的批量题目录入助手。"
        "OCR 文本可能来自一张包含多道题的图片。"
        "请先拆分出每一道独立题目，再为每题识别物理模型、生成标题和标准 JSON。"
        "只输出 JSON，不要输出解释。"
        "公式必须使用 LaTeX，行内公式用 \\(...\\)。"
        "如果 OCR 内容缺失，用空字符串或空数组，不要编造题目条件。"
    )
    user = {
        "chapter": chapter,
        "idPrefix": id_prefix,
        "sourceName": source_name,
        "outputSchema": {
            "problems": [
                {
                    "slug": "short_ascii_slug_without_prefix",
                    "skip": False,
                    "skipReason": "",
                    "model": "物理模型名称，例如 平抛运动相遇模型",
                    "id": "string",
                    "chapter": "string",
                    "title": "string",
                    "question": "string",
                    "options": ["string"],
                    "answer": "string",
                    "analysis": {
                        "title": "string",
                        "content": "string"
                    },
                    "animation": {
                        "level": "animated | interactive_diagram | static_diagram | none",
                        "type": "projectile | spring_balance | force_diagram | none",
                        "playable": True,
                        "interactive": True,
                        "confidence": 0.8,
                        "notes": "为什么选择这个动画模型",
                        "params": {
                            "vx": {
                                "label": "水平速度",
                                "value": 5,
                                "min": 1,
                                "max": 20,
                                "step": 0.5,
                                "unit": "m/s"
                            }
                        },
                        "timeline": {
                            "duration": 3,
                            "loop": False
                        },
                        "forces": [
                            {
                                "label": "G",
                                "direction": "down",
                                "color": "#dc2626"
                            }
                        ]
                    },
                    "knowledge": ["string"],
                    "source": {
                        "title": "课程/讲义/章节名称，若 OCR 中没有则用 chapter",
                        "text": "具体来源，例如 课上第 3 题、A组第 5 题、课后作业第 2 题；不要写图片路径",
                        "page": "题号或页码，若无法识别则留空"
                    },
                    "steps": [
                        {
                            "stepId": 1,
                            "title": "string",
                            "content": "string",
                            "knowledge": ["string"],
                            "commonMistakes": ["string"]
                        }
                    ],
                    "summary": {
                        "title": "string",
                        "content": "string"
                    }
                }
            ]
        },
        "requirements": [
            "一张图片中有多道题时，必须拆成多个 problems。",
            "不要因为题干包含“如图”“图中”“图像”等字样就跳过；只要 OCR 文字已经足以还原题干、已知条件、选项/答案和解析思路，就必须生成 JSON。",
            "只有当 OCR 文字缺失关键信息，导致无法构成一道完整题目时，才返回该题 {\"skip\": true, \"skipReason\": \"OCR 文字不足以构成完整题目\"}，不要硬编题干。",
            "slug 使用简短英文或拼音小写，只含 a-z、0-9、下划线；slug 必须表达物理模型或题目特征，禁止使用原题号、纯数字、q1、problem_1 这类无语义名称。",
            "animation 用于网页自动绘图，不要引用原图片。能用运动过程表达的题用 animated；只能展示受力/结构的题用 interactive_diagram；信息不足则 type=none。",
            "animation.type 只能从 projectile、spring_balance、force_diagram、none 中选。level=animated 时 type 不能是 none。projectile 的 params 建议包含 vx、height、g；spring_balance 建议包含 k、mass、g；force_diagram 建议包含 angle，并在 forces 中列 G、N、f、T 等力。",
            "animation.params 的每个变量必须包含 label、value、min、max、step、unit，网页会据此生成滑块。",
            "source 必须描述真实题目来源，例如那一课、哪一讲、哪一组、哪一题；严禁把 source 写成图片文件名、OCR 文件名或本地路径。如果 OCR 无法识别来源，source.title 用 chapter，source.text 写“来源待校对”。",
            "title 由题目内容和物理模型自动生成，适合显示在网站卡片上。",
            "analysis.content 必须有可展示文字，不要留空；可以写简短总览。",
            "steps 用于页面分步骤解析和 AI 上下文，必须按解题步骤拆分；每题至少 2 步，除非题目本身只有一步。",
            "每题至少给出 1 个 knowledge。"
        ],
        "ocrText": ocr_text
    }
    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": json.dumps(user, ensure_ascii=False)}
        ],
        "temperature": 0.1,
        "stream": False
    }
    request = urllib.request.Request(
        API_URL,
        data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=90) as response:
        result = json.loads(response.read().decode("utf-8"))
    payload = extract_json(result["choices"][0]["message"]["content"])
    if isinstance(payload, dict) and isinstance(payload.get("problems"), list):
        return payload["problems"]
    if isinstance(payload, dict) and payload.get("question"):
        return [payload]
    raise ValueError("DeepSeek response did not contain problems")


def main():
    parser = argparse.ArgumentParser(description="Use DeepSeek to convert OCR text into FanPhysics problem JSON.")
    parser.add_argument("ocr_text", help="Path to OCR text file")
    parser.add_argument("--id", required=True, dest="problem_id", help="Problem id, e.g. motion_001")
    parser.add_argument("--chapter", required=True, help="Chapter name")
    parser.add_argument("--title", required=True, help="Problem title")
    parser.add_argument("--out", help="Output JSON path")
    args = parser.parse_args()

    load_env_file(ROOT / ".env")
    ocr_text = Path(args.ocr_text).read_text(encoding="utf-8")
    problem = call_deepseek(ocr_text, args.problem_id, args.chapter, args.title)
    problem["id"] = args.problem_id
    problem["chapter"] = args.chapter
    problem["title"] = args.title

    output_path = Path(args.out) if args.out else ROOT / "data" / "problems" / f"{args.problem_id}.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(problem, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(output_path)


if __name__ == "__main__":
    main()
