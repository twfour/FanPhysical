#!/usr/bin/env python3
import argparse
import base64
import json
import mimetypes
import os
import re
import urllib.error
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
API_URL = os.environ.get("DEEPSEEK_API_URL", "https://api.deepseek.com/chat/completions")
MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-flash")
VISION_API_URL = os.environ.get("VISION_API_URL", "https://api.openai.com/v1/chat/completions")
VISION_MODEL = os.environ.get("VISION_MODEL", os.environ.get("OPENAI_VISION_MODEL", "gpt-4o"))
VISION_RAW_DIR = ROOT / "work" / "vision_raw"
QUESTION_SEGMENT_DIR = ROOT / "work" / "question_segments"


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
    """从 LLM 回复中提取 JSON，修复 LaTeX 反斜杠导致的 Invalid \\escape。"""
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise ValueError(f"No JSON object in response:\n{text[:300]}")

    raw = text[start:end + 1]

    # 先试直接解析
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    # 修复：扫描字符串值内的非法反斜杠，\\X → \\\\X（转义反斜杠本身）
    # JSON 只允许 \" \\ \/ \b \f \n \r \t \uXXXX
    VALID_ESCAPES = set('"\\/bfnrt')
    repaired = []
    i = 0
    in_string = False
    while i < len(raw):
        ch = raw[i]

        # 检测字符串边界（忽略转义的引号）
        if ch == '"':
            # 检查前面是不是奇数个反斜杠（即这个引号被转义了）
            backslash_count = 0
            j = i - 1
            while j >= 0 and raw[j] == '\\':
                backslash_count += 1
                j -= 1
            if backslash_count % 2 == 0:
                in_string = not in_string
            repaired.append(ch)
            i += 1
        elif ch == '\\' and in_string and i + 1 < len(raw):
            next_ch = raw[i + 1]
            if next_ch == 'u':
                # \uXXXX 合法转义，直接保留
                repaired.append(raw[i:i+6])  # \u + 4 hex
                i += 6
            elif next_ch in VALID_ESCAPES:
                # 合法转义，保留原样
                repaired.append(ch)
                repaired.append(next_ch)
                i += 2
            else:
                # 非法转义！LaTeX 命令如 \frac \alpha \Delta
                # 修复：把反斜杠转义成 \\，保留原字符
                repaired.append('\\\\')
                repaired.append(next_ch)
                i += 2
        else:
            repaired.append(ch)
            i += 1

    return json.loads("".join(repaired))



def problem_batch_schema():
    return {
        "problems": [
            {
                "slug": "short_ascii_slug_without_prefix",
                "originalNumber": "例1/第1题/题号，无法识别则留空",
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
                    "type": "projectile | spring_balance | force_diagram | bullet_cylinder | codex_scene | none",
                    "enabled": False,
                    "key": "Codex 手写动画模型 key，例如 bulletCylinder；没有则留空",
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
                "steps": [
                    {
                        "stepId": 1,
                        "title": "string",
                        "content": "string",
                        "knowledge": ["string"],
                        "commonMistakes": ["string"]
                    }
                ]
            }
        ]
    }


def question_segmentation_schema():
    return {
        "questions": [
            {
                "question_no": "2",
                "question_type": "single_choice | multiple_choice | fill_blank | calculation | experiment | unknown",
                "text": "题干正文，尽量保留原文，不要解题",
                "options": [
                    {"label": "A", "text": "选项内容"}
                ],
                "related_blocks": [
                    {
                        "type": "formula | table | note | condition | unknown",
                        "text": "公式、表格、补充条件或图中文字",
                        "position_hint": "题目下方/右侧/图中标注"
                    }
                ],
                "related_images": [
                    {
                        "image_id": "q2_img1",
                        "description": "示意图内容描述",
                        "position_hint": "第2题右侧",
                        "belongs_to": "question_body",
                        "bbox": {
                            "x": 0.52,
                            "y": 0.18,
                            "w": 0.30,
                            "h": 0.22
                        },
                        "crop_path": ""
                    }
                ],
                "confidence": 0.92,
                "uncertainty": ""
            }
        ]
    }


def batch_requirements(input_kind):
    target = "图片" if input_kind == "image" else "OCR 文本"
    return [
        f"输入来自一张包含多道题的{target}时，必须拆成多个 problems。",
        "拆题时先识别所有题号边界，例如“例1、例2、例3”；如果某个题号后的信息不足，也要输出一个 skip=true 的 problem，并写明 originalNumber 和 skipReason，不能静默漏掉。",
        "忽略手写笔迹、手写答案、手写推导、涂改、圈画和页边批注；不要把这些内容混入题干、选项、解析或答案。",
        "不要因为题干包含“如图”“图中”“图像”等字样就跳过；只要已经足以还原题干、已知条件、选项/答案和解析思路，就必须生成 JSON。",
        "如果题号、基本题型和大部分题干可识别，但少量公式、表格或选项因手写遮挡而不确定，也不要 skip；生成 JSON，并在不确定处写“【待校对】”，analysis 和 steps 也写成待校对版。",
        "只有当印刷题目主体几乎无法识别，连题型和主要条件都无法确定时，才返回该题 {\"skip\": true, \"skipReason\": \"信息不足以构成完整题目\"}，不要硬编题干。",
        "slug 使用简短英文或拼音小写，只含 a-z、0-9、下划线；slug 必须表达物理模型或题目特征，禁止使用原题号、纯数字、q1、problem_1 这类无语义名称。",
        "当前阶段只做题目录入和解析展示，默认不生成动画。所有题的 animation.enabled 必须为 false，animation.level/type 用 none，key 留空，params 用空对象。",
        "只有人工后续决定要做动画时，才会由 Codex 手写动画模型并手工改 animation.enabled=true；OCR/视觉模型不要擅自填写 codex_scene、projectile、force_diagram 等动画类型。",
        "不要生成 source、summary 或一句话总结字段；原题序号直接写入 originalNumber 和题目标题。",
        "title 由题目内容和物理模型自动生成，适合显示在网站卡片上。",
        "analysis.content 必须有可展示文字，不要留空；可以写简短总览。",
        "steps 用于页面分步骤解析和 AI 上下文，必须按解题步骤拆分；每题至少 2 步，除非题目本身只有一步。",
        "每题至少给出 1 个 knowledge。"
    ]


def parse_problems_response(content, source_label):
    payload = extract_json(content)
    if isinstance(payload, dict) and isinstance(payload.get("problems"), list):
        return payload["problems"]
    # Some vision models echo the request object and fill the example schema
    # under outputSchema.problems instead of returning a top-level problems list.
    output_schema = payload.get("outputSchema") if isinstance(payload, dict) else None
    if isinstance(output_schema, dict) and isinstance(output_schema.get("problems"), list):
        return output_schema["problems"]
    if isinstance(payload, dict) and payload.get("question"):
        return [payload]
    raise ValueError(f"{source_label} response did not contain problems")


def parse_questions_response(content, source_label):
    payload = extract_json(content)
    if isinstance(payload, dict) and isinstance(payload.get("questions"), list):
        return payload["questions"]
    if isinstance(payload, dict) and isinstance(payload.get("question_no"), (str, int)):
        return [payload]
    output_schema = payload.get("outputSchema") if isinstance(payload, dict) else None
    if isinstance(output_schema, dict) and isinstance(output_schema.get("questions"), list):
        return output_schema["questions"]
    raise ValueError(f"{source_label} response did not contain questions")


def save_raw_vision_response(image_path, content):
    VISION_RAW_DIR.mkdir(parents=True, exist_ok=True)
    output_path = VISION_RAW_DIR / f"{Path(image_path).stem}.txt"
    output_path.write_text(content, encoding="utf-8")
    return output_path


def save_question_segments(image_path, questions):
    QUESTION_SEGMENT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = QUESTION_SEGMENT_DIR / f"{Path(image_path).stem}.json"
    payload = {
        "sourceImage": Path(image_path).name,
        "questions": questions
    }
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return output_path


def repair_json_with_deepseek(content):
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        raise RuntimeError("Missing DEEPSEEK_API_KEY for JSON repair")
    system = (
        "你是 JSON 修复器。只修复用户提供内容中的 JSON 语法错误，"
        "不要改写字段含义，不要补题，不要解释，只输出合法 JSON。"
    )
    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": content}
        ],
        "temperature": 0,
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
    with urllib.request.urlopen(request, timeout=120) as response:
        result = json.loads(response.read().decode("utf-8"))
    return result["choices"][0]["message"]["content"]


def read_image_data_url(image_path):
    mime_type = mimetypes.guess_type(str(image_path))[0] or "image/jpeg"
    encoded = base64.b64encode(Path(image_path).read_bytes()).decode("ascii")
    return f"data:{mime_type};base64,{encoded}"


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
            ]
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
        "请先在内部清理 OCR：忽略手写笔迹、圈画答案、草稿算式、批注和明显乱码，只保留印刷题目主体。"
        "请先拆分出每一道独立题目，再为每题识别物理模型、生成标题和标准 JSON。"
        "只输出 JSON，不要输出解释。"
        "公式必须使用 LaTeX，行内公式用 \\(...\\)。"
        "如果 OCR 内容缺失，用空字符串或空数组，不要编造题目条件。"
    )
    user = {
        "chapter": chapter,
        "idPrefix": id_prefix,
        "sourceName": source_name,
        "outputSchema": problem_batch_schema(),
        "requirements": batch_requirements("ocr"),
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
    return parse_problems_response(result["choices"][0]["message"]["content"], "DeepSeek")


def call_deepseek_from_questions(questions, chapter, id_prefix, source_name):
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        raise RuntimeError("Missing DEEPSEEK_API_KEY")

    system = (
        "你是 FanPhysics 的题目 JSON 规范化助手。"
        "用户会给你 Question Segmentation Agent 已经切好的独立题目。"
        "你的任务是把每道题转成 FanPhysics problem JSON。"
        "不要重新切题，不要漏题，不要合并题目。"
        "公式必须使用 LaTeX，行内公式用 \\(...\\)。"
        "如果切题内容里有 related_blocks、related_images，要把其中有效信息合并进 question 或 steps；"
        "如果图像只被描述而没有具体数值，保留描述并标记“【待校对】”。"
        "只输出 JSON，不要输出解释。"
    )
    user = {
        "chapter": chapter,
        "idPrefix": id_prefix,
        "sourceName": source_name,
        "outputSchema": problem_batch_schema(),
        "requirements": [
            "输入 questions 已经按题号切好；输出 problems 数量应与可解析 questions 数量一致。",
            "question_no 写入 originalNumber，并把原题序号保留在题目标题中。",
            "选项必须来自 options，不能丢失 A/B/C/D。",
            "不要解读手写痕迹；uncertainty 中的不确定信息用“【待校对】”保留。",
            "如果某题 text 太少，无法构成完整题目，输出 skip=true 并写明 skipReason。",
            "当前阶段只做题目录入和解析展示，默认不生成动画。所有题的 animation.enabled 必须为 false，animation.level/type 用 none，key 留空，params 用空对象。",
            "analysis.content 必须有可展示文字，不要留空；可以写简短总览。",
            "steps 必须按解题步骤拆分；每题至少 2 步，除非题目本身只有一步。",
            "每题至少给出 1 个 knowledge。"
        ],
        "questions": questions
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
    with urllib.request.urlopen(request, timeout=120) as response:
        result = json.loads(response.read().decode("utf-8"))
    return parse_problems_response(result["choices"][0]["message"]["content"], "DeepSeek questions")


def call_question_segmentation(image_path, chapter, source_name):
    api_key = (
        os.environ.get("VISION_API_KEY")
        or os.environ.get("OPENAI_API_KEY")
    )
    if not api_key:
        raise RuntimeError(
            "Missing VISION_API_KEY or OPENAI_API_KEY. "
            "Configure an OpenAI-compatible vision endpoint for image segmentation."
        )

    system = (
        "你是 Question Segmentation Agent。"
        "你的任务是把试卷图片按题号切分成独立题目，不要解题。"
        "你必须忽略手写笔迹、圈画答案、草稿、批注和涂改。"
        "每道题必须独立完整，图片、表格、公式、选项必须绑定到对应题号。"
        "每个 related_images 项必须尽量给出 bbox，用归一化坐标表示原图区域：x,y,w,h 都是 0 到 1 的小数。"
        "不确定时写 uncertainty，不要硬猜。"
        "只输出 JSON，不要输出解释文字。"
    )
    user = {
        "chapter": chapter,
        "sourceName": source_name,
        "outputSchema": question_segmentation_schema(),
        "requirements": [
            "每道题必须独立完整，不能把上一题条件漏到下一题。",
            "图片、表格、公式、选项必须绑定到对应题号。",
            "related_images 中必须尽量填写 bbox；bbox 是围住题图的最小矩形，不要包含整道题文字。",
            "bbox 使用归一化坐标：左上角 x/y、宽 w、高 h，取值范围 0 到 1。",
            "如果某题没有独立图像，related_images 用空数组。",
            "如果图像位置能看出但边界不确定，仍给出大致 bbox，并在 uncertainty 说明。",
            "如果某个图像或文字归属不确定，写入 uncertainty。",
            "不要解题，不要生成解析。",
            "不要改写题意，尽量保留原文。",
            "如果一页中有多个题号，必须全部输出。",
            "如果看到手写笔迹、批注、答案痕迹，忽略它们，不要放入题干。",
            "只有印刷题目主体几乎无法识别时，才输出 text 为空并在 uncertainty 说明原因。"
        ]
    }
    body = {
        "model": os.environ.get("VISION_MODEL", VISION_MODEL),
        "messages": [
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": json.dumps(user, ensure_ascii=False)},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": read_image_data_url(image_path),
                            "detail": os.environ.get("VISION_IMAGE_DETAIL", "high")
                        }
                    }
                ]
            }
        ],
        "temperature": 0,
        "stream": False
    }
    request = urllib.request.Request(
        os.environ.get("VISION_API_URL", VISION_API_URL),
        data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        },
        method="POST",
    )
    timeout = int(os.environ.get("VISION_TIMEOUT_SECONDS", "300"))
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            result = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Vision API HTTP {error.code}: {body}") from error
    content = result["choices"][0]["message"]["content"]
    raw_path = save_raw_vision_response(image_path, content)
    try:
        return parse_questions_response(content, "Question segmentation")
    except json.JSONDecodeError as error:
        print(f"Question segmentation JSON parse failed; raw response saved to {raw_path.relative_to(ROOT)}. Trying DeepSeek JSON repair...")
        repaired = repair_json_with_deepseek(content)
        repaired_path = raw_path.with_suffix(".segments.repaired.txt")
        repaired_path.write_text(repaired, encoding="utf-8")
        try:
            return parse_questions_response(repaired, "Question segmentation repaired")
        except json.JSONDecodeError as repaired_error:
            raise RuntimeError(
                f"Question segmentation JSON parse failed after repair. Raw: {raw_path.relative_to(ROOT)}, "
                f"repaired: {repaired_path.relative_to(ROOT)}"
            ) from repaired_error


def call_vision_batch(image_path, chapter, id_prefix, source_name):
    api_key = (
        os.environ.get("VISION_API_KEY")
        or os.environ.get("OPENAI_API_KEY")
    )
    if not api_key:
        raise RuntimeError(
            "Missing VISION_API_KEY or OPENAI_API_KEY. "
            "DeepSeek text API cannot read images directly; configure an OpenAI-compatible vision endpoint."
        )

    system = (
        "你是 FanPhysics 的视觉题目录入助手。"
        "你会直接阅读图片中的印刷题目，忽略手写笔迹、圈画、草稿和批注。"
        "请拆分图片中的每一道独立题目，为每题生成标准 JSON。"
        "只输出 JSON，不要输出解释。"
        "公式必须使用 LaTeX，行内公式用 \\(...\\)。"
        "如果少量内容被手写遮挡但题型和大部分条件可见，用“【待校对】”标记不确定处，不要静默漏题。"
    )
    user = {
        "chapter": chapter,
        "idPrefix": id_prefix,
        "sourceName": source_name,
        "outputSchema": problem_batch_schema(),
        "requirements": batch_requirements("image")
    }
    body = {
        "model": os.environ.get("VISION_MODEL", VISION_MODEL),
        "messages": [
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": json.dumps(user, ensure_ascii=False)},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": read_image_data_url(image_path),
                            "detail": os.environ.get("VISION_IMAGE_DETAIL", "high")
                        }
                    }
                ]
            }
        ],
        "temperature": 0.1,
        "stream": False
    }
    request = urllib.request.Request(
        os.environ.get("VISION_API_URL", VISION_API_URL),
        data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        },
        method="POST",
    )
    timeout = int(os.environ.get("VISION_TIMEOUT_SECONDS", "300"))
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            result = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Vision API HTTP {error.code}: {body}") from error
    content = result["choices"][0]["message"]["content"]
    raw_path = save_raw_vision_response(image_path, content)
    try:
        return parse_problems_response(content, "Vision")
    except json.JSONDecodeError as error:
        print(f"Vision JSON parse failed; raw response saved to {raw_path.relative_to(ROOT)}. Trying DeepSeek JSON repair...")
        repaired = repair_json_with_deepseek(content)
        repaired_path = raw_path.with_suffix(".repaired.txt")
        repaired_path.write_text(repaired, encoding="utf-8")
        try:
            return parse_problems_response(repaired, "Vision repaired")
        except json.JSONDecodeError as repaired_error:
            raise RuntimeError(
                f"Vision JSON parse failed after repair. Raw: {raw_path.relative_to(ROOT)}, "
                f"repaired: {repaired_path.relative_to(ROOT)}"
            ) from repaired_error


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
