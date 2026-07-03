#!/usr/bin/env python3
import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from deepseek_ocr_to_problem import ROOT, call_deepseek_batch, call_vision_batch, load_env_file


STATE_PATH = ROOT / "work" / "problem_pipeline_state.json"
PROBLEMS_DIR = ROOT / "data" / "problems"
INDEX_PATH = PROBLEMS_DIR / "index.json"
SKIP_REPORT_DIR = ROOT / "work" / "problem_skips"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif", ".tif", ".tiff"}
TEXT_EXTENSIONS = {".txt", ".md", ".markdown"}
OCR_CLEAN_DIR = ROOT / "work" / "ocr_clean"
IMAGE_SEGMENT_DIR = ROOT / "work" / "image_segments"
OCR_CLEAN_VERSION = 3
VISION_LLM_VERSION = 2
CHAPTER_TITLE_PREFIXES = {
    "平抛运动": "Projectile Motion",
    "运动": "Motion",
    "直线运动": "Linear Motion",
    "匀变速直线运动": "Uniformly Accelerated Motion",
    "相互作用": "Forces",
    "力": "Forces",
    "牛顿运动定律": "Newton's Laws",
    "牛顿定律": "Newton's Laws",
    "圆周运动": "Circular Motion",
    "曲线运动": "Curvilinear Motion",
    "机械能": "Mechanical Energy",
    "功和能": "Work and Energy",
    "动量": "Momentum",
    "电场": "Electric Field",
    "电路": "Electric Circuits",
    "磁场": "Magnetic Field",
    "电磁感应": "Electromagnetic Induction",
    "光学": "Optics",
    "热学": "Thermal Physics",
    "浮力": "Buoyancy",
    "压强": "Pressure",
}
SLUG_KEYWORDS = [
    ("等效", "equivalent"),
    ("劲度", "stiffness"),
    ("弹性系数", "stiffness"),
    ("串联", "series"),
    ("弹簧", "spring"),
    ("伸长", "extension"),
    ("最长", "max"),
    ("弹力方向", "elastic_force_direction"),
    ("弹力", "elastic_force"),
    ("磁性", "magnetic"),
    ("磁力", "magnetic_force"),
    ("盒子", "box"),
    ("吸附", "adsorption"),
    ("摩擦", "friction"),
    ("静摩擦", "static_friction"),
    ("平衡", "equilibrium"),
    ("毛笔", "brush"),
    ("笔架", "brush_stand"),
    ("支持力", "normal_force"),
    ("重心", "center_of_gravity"),
    ("二力平衡", "two_force_balance"),
    ("形变", "deformation"),
    ("斜面", "inclined_plane"),
    ("绳", "string"),
    ("受力分析", "force_analysis"),
    ("共点力", "concurrent_forces"),
]
QUESTION_START_PATTERNS = (
    "如图所示",
    "在绕",
    "一位同学",
    "一个大轮",
    "有一辆",
    "某种变速",
)
KEEP_NOISY_LINE_KEYWORDS = (
    "例",
    "A.",
    "A．",
    "B.",
    "B．",
    "C.",
    "C．",
    "D.",
    "D．",
    "如图",
    "已知",
    "求",
    "名称",
    "齿数",
    "链轮",
    "飞轮",
    "半径",
    "角速度",
    "线速度",
    "向心",
    "圆周",
)


def sha256_file(path):
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def slugify(value, fallback):
    value = Path(str(value)).stem
    value = re.sub(r"[^0-9A-Za-z]+", "_", value).strip("_").lower()
    return value or fallback


def is_weak_slug(value):
    value = str(value or "").strip().lower()
    return not value or value.isdigit() or re.fullmatch(r"(problem|question|q|ti|题)?_?\d+", value)


def semantic_slug(problem, fallback):
    raw_slug = str(problem.get("slug") or "").strip()
    if raw_slug and not is_weak_slug(raw_slug):
        return slugify(raw_slug, fallback)

    text = " ".join(str(problem.get(key) or "") for key in ("model", "title", "question"))
    parts = []
    for keyword, slug in SLUG_KEYWORDS:
        if keyword in text and slug not in parts:
            parts.append(slug)
    if parts:
        return "_".join(parts[:4])
    return fallback


def chapter_title_prefix(chapter):
    return CHAPTER_TITLE_PREFIXES.get(chapter.strip(), "")


def default_id_prefix_for_chapter(chapter):
    prefix = chapter_title_prefix(chapter)
    if prefix:
        return slugify(prefix, "problem") + "_"
    return slugify(chapter, "problem") + "_"


def iter_images(path):
    if path.is_file():
        return [path]
    return sorted(item for item in path.iterdir() if item.suffix.lower() in IMAGE_EXTENSIONS)


def find_ocr_text(image_path, args):
    if args.ocr_file:
        ocr_path = Path(args.ocr_file)
        if not ocr_path.exists():
            raise RuntimeError(f"OCR file not found: {ocr_path}")
        return ocr_path

    candidates = []
    for extension in TEXT_EXTENSIONS:
        candidates.append(image_path.with_suffix(extension))
        candidates.append(ROOT / args.ocr_dir / f"{image_path.stem}{extension}")

    for candidate in candidates:
        if candidate.exists():
            return candidate

    tried = "\n".join(str(path) for path in candidates)
    raise RuntimeError(
        "OCR text not found for image. Create a same-name .txt/.md first, or pass --ocr-file.\n"
        f"Image: {image_path}\n"
        f"Tried:\n{tried}"
    )


def looks_like_handwritten_noise(line):
    stripped = line.strip()
    if not stripped:
        return True
    if any(keyword in stripped for keyword in KEEP_NOISY_LINE_KEYWORDS):
        return False
    chinese_count = len(re.findall(r"[\u4e00-\u9fff]", stripped))
    ascii_count = len(re.findall(r"[A-Za-z0-9]", stripped))
    odd_count = len(re.findall(r"[^A-Za-z0-9\u4e00-\u9fff\s，。、“”‘’（）()：:；;,.+\-*/=<>≤≥πμωΩ^_]", stripped))
    if len(stripped) <= 4 and chinese_count <= 1:
        return True
    if len(stripped) <= 18 and odd_count >= 2 and chinese_count <= 3:
        return True
    if len(stripped) <= 28 and ascii_count >= 2 and chinese_count <= 2 and odd_count >= 1:
        return True
    return False


def repair_question_marker(line, expected_number):
    stripped = line.strip()
    if re.match(r"^例\s*\d+", stripped):
        return stripped
    if expected_number <= 0:
        return stripped

    for marker in QUESTION_START_PATTERNS:
        marker_index = stripped.find(marker)
        if marker_index == -1:
            continue
        if marker_index == 0:
            return f"例{expected_number}.{stripped}"
        prefix = stripped[:marker_index]
        if len(prefix) <= 4 and not re.search(r"[A-Za-z0-9\u4e00-\u9fff]{3,}", prefix):
            return f"例{expected_number}.{stripped[marker_index:]}"
        if re.fullmatch(r".{1,4}[）).．。]", prefix):
            return f"例{expected_number}.{stripped[marker_index:]}"
    return stripped


def clean_ocr_text_for_model(text):
    cleaned_lines = []
    last_question_number = 0
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        match = re.match(r"^例\s*(\d+)", line)
        if match:
            last_question_number = int(match.group(1))
        else:
            line = repair_question_marker(line, last_question_number + 1)
            repaired_match = re.match(r"^例\s*(\d+)", line)
            if repaired_match:
                last_question_number = int(repaired_match.group(1))

        if looks_like_handwritten_noise(line):
            continue
        cleaned_lines.append(line)

    return "\n".join(cleaned_lines).strip()


def write_clean_ocr_text(image_path, text):
    cleaned = clean_ocr_text_for_model(text)
    if not cleaned:
        return text, None
    OCR_CLEAN_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OCR_CLEAN_DIR / f"{image_path.stem}.txt"
    output_path.write_text(cleaned + "\n", encoding="utf-8")
    return cleaned, output_path


def run_vision_ocr(image_path, args):
    output_path = ROOT / args.ocr_dir / f"{image_path.stem}.txt"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    script_path = ROOT / "scripts" / "ocr_vision.swift"
    subprocess.run(
        ["swift", str(script_path), str(image_path), str(output_path)],
        check=True,
    )
    return output_path


def run_paddle_ocr(image_path, args):
    output_path = ROOT / args.ocr_dir / f"{image_path.stem}.txt"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    script_path = ROOT / "scripts" / "ocr_paddle.py"
    python_path = ROOT / ".venv" / "bin" / "python"
    if not python_path.exists():
        python_path = Path(sys.executable)
    env = dict(**__import__("os").environ)
    env["HOME"] = str(ROOT / "work" / "paddle_home")
    env["PADDLE_HOME"] = str(ROOT / "work" / "paddle_home")
    env["PADDLEX_HOME"] = str(ROOT / "work" / "paddle_home")
    subprocess.run(
        [
            str(python_path),
            str(script_path),
            str(image_path),
            str(output_path),
            "--lang",
            args.ocr_lang,
            "--ocr-version",
            args.ocr_version,
            "--max-side",
            str(args.ocr_max_side),
        ],
        env=env,
        check=True,
    )
    return output_path


def get_or_create_ocr_text(image_path, args):
    if args.ocr_engine == "sidecar" or args.ocr_file:
        return find_ocr_text(image_path, args)
    if args.ocr_engine == "paddle":
        return run_paddle_ocr(image_path, args)
    if args.ocr_engine == "vision":
        return run_vision_ocr(image_path, args)
    raise RuntimeError(f"Unsupported OCR engine: {args.ocr_engine}")


def load_json(path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_skip_report(image_path, skipped_problems):
    if not skipped_problems:
        return None
    SKIP_REPORT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = SKIP_REPORT_DIR / f"{image_path.stem}.json"
    save_json(output_path, {"image": str(image_path), "skippedProblems": skipped_problems})
    return output_path


def update_index(problem_id, json_filename):
    index = load_json(INDEX_PATH, {"version": 1, "problems": []})
    problems = index.setdefault("problems", [])
    for item in problems:
        if item.get("id") == problem_id:
            item["file"] = json_filename
            break
    else:
        problems.append({"id": problem_id, "file": json_filename})
    save_json(INDEX_PATH, index)


def normalize_problem(problem, problem_id, chapter, source_image, source_index):
    problem["id"] = problem_id
    problem["chapter"] = problem.get("chapter") or chapter
    problem["title"] = problem.get("title") or f"{source_image.stem} 第 {source_index} 题"
    prefix = chapter_title_prefix(problem["chapter"])
    if prefix and not problem["title"].startswith(prefix + " - "):
        problem["title"] = f"{prefix} - {problem['title']}"
    problem.setdefault("question", "")
    problem.setdefault("options", [])
    problem.setdefault("answer", "")
    problem.setdefault("knowledge", [])
    problem["animation"] = {
        "enabled": False,
        "level": "none",
        "type": "none",
        "playable": False,
        "interactive": False,
        "params": {}
    }
    problem.setdefault("steps", [
        {
            "stepId": 1,
            "title": "待校对步骤",
            "content": "请根据 OCR 文本校对并补充解析。",
            "knowledge": [],
            "commonMistakes": []
        }
    ])
    problem.setdefault("summary", {"title": "待总结", "content": ""})
    source = problem.get("source") if isinstance(problem.get("source"), dict) else {}
    source.setdefault("title", problem["chapter"])
    source.setdefault("text", "来源待校对")
    source.setdefault("page", f"第 {source_index} 题")
    if str(source.get("text", "")).endswith((".jpg", ".jpeg", ".png", ".webp", ".txt", ".md")):
        source["text"] = source.get("page") or "来源待校对"
    problem["source"] = source
    return problem


def choose_problem_id(problem, image_path, args, index):
    if args.problem_id:
        base = args.problem_id
        return base if index == 1 else f"{base}_{index:02d}"
    slug = semantic_slug(problem, f"problem_{index:02d}")
    prefix = args.id_prefix if args.id_prefix is not None else default_id_prefix_for_chapter(args.chapter)
    return prefix + slug


def should_skip_problem(problem):
    if problem.get("skip") is True:
        return True
    reason = str(problem.get("skipReason") or "")
    return bool(reason)


def unique_problem_id(problem_id, used_ids):
    candidate = problem_id
    counter = 2
    while candidate in used_ids:
        candidate = f"{problem_id}_{counter}"
        counter += 1
    used_ids.add(candidate)
    return candidate


def current_vision_model():
    return os.environ.get("VISION_MODEL", os.environ.get("OPENAI_VISION_MODEL", "gpt-4o"))


def split_image_vertical(image_path, segments, overlap_ratio):
    if segments <= 1:
        return [image_path]
    try:
        from PIL import Image
    except ImportError as error:
        raise RuntimeError("Pillow is required for --split-vertical. Install pillow or set --split-vertical 1.") from error

    overlap_ratio = max(0, min(overlap_ratio, 0.45))
    output_dir = IMAGE_SEGMENT_DIR / image_path.stem
    output_dir.mkdir(parents=True, exist_ok=True)

    with Image.open(image_path) as image:
        width, height = image.size
        base_height = height / segments
        overlap = int(base_height * overlap_ratio)
        paths = []
        for index in range(segments):
            top = int(index * base_height)
            bottom = int((index + 1) * base_height)
            if index > 0:
                top = max(0, top - overlap)
            if index < segments - 1:
                bottom = min(height, bottom + overlap)
            crop = image.crop((0, top, width, bottom))
            suffix = image_path.suffix.lower()
            if suffix not in {".jpg", ".jpeg", ".png", ".webp"}:
                suffix = ".jpg"
            output_path = output_dir / f"{image_path.stem}_part{index + 1:02d}{suffix}"
            crop.save(output_path)
            paths.append(output_path)
    return paths


def problem_dedupe_key(problem):
    original_number = str(problem.get("originalNumber") or "").strip()
    if original_number:
        return "number:" + re.sub(r"\s+", "", original_number)
    source = problem.get("source") if isinstance(problem.get("source"), dict) else {}
    source_text = str(source.get("text") or "").strip()
    if re.search(r"(例|第)\s*\d+", source_text):
        return "source:" + re.sub(r"\s+", "", source_text)
    slug = str(problem.get("slug") or "").strip()
    if slug:
        return "slug:" + slugify(slug, "problem")
    title = str(problem.get("title") or "").strip()
    return "title:" + title[:80]


def problem_quality_score(problem):
    if should_skip_problem(problem):
        return -1000
    score = 0
    if problem.get("question"):
        score += len(str(problem.get("question")))
    if problem.get("answer"):
        score += 50
    if problem.get("analysis"):
        score += 50
    steps = problem.get("steps")
    if isinstance(steps, list):
        score += 40 * len(steps)
    if "【待校对】" in json.dumps(problem, ensure_ascii=False):
        score -= 20
    return score


def merge_segment_problems(problem_batches):
    best_by_key = {}
    order = []
    for batch in problem_batches:
        for problem in batch:
            key = problem_dedupe_key(problem)
            if key not in best_by_key:
                best_by_key[key] = problem
                order.append(key)
                continue
            if problem_quality_score(problem) > problem_quality_score(best_by_key[key]):
                best_by_key[key] = problem
    return [best_by_key[key] for key in order]


def process_image(image_path, args, state):
    image_hash = sha256_file(image_path)
    state_key = str(image_path.resolve())
    previous = state.get("items", {}).get(state_key, {})
    previous_files = previous.get("jsonPaths", [])
    current_engine = args.ocr_engine
    current_model = current_vision_model() if args.ocr_engine == "vision-llm" else ""
    current_split_vertical = args.split_vertical if args.ocr_engine == "vision-llm" else 1
    current_split_overlap = args.split_overlap if args.ocr_engine == "vision-llm" else 0
    clean_version_matches = (
        args.ocr_engine == "vision-llm"
        or (not args.clean_ocr and not previous.get("cleanOcrVersion"))
        or (args.clean_ocr and previous.get("cleanOcrVersion") == OCR_CLEAN_VERSION)
    )
    engine_matches = (
        previous.get("ocrEngine", "vision") == current_engine
        and previous.get("visionLlmVersion", None) == (VISION_LLM_VERSION if current_engine == "vision-llm" else None)
        and previous.get("visionModel", "") == current_model
        and previous.get("splitVertical", 1) == current_split_vertical
        and previous.get("splitOverlap", 0) == current_split_overlap
    )

    if (
        not args.force
        and previous.get("sha256") == image_hash
        and clean_version_matches
        and engine_matches
        and (
            previous.get("skipped") is True
            or (previous_files and all((ROOT / item).exists() for item in previous_files))
        )
    ):
        if previous.get("skipped") is True:
            print(f"SKIP unchanged {image_path.name} -> previously skipped")
            return {"status": "skipped", "count": 0}
        print(f"SKIP unchanged {image_path.name} -> {len(previous_files)} JSON file(s)")
        return {"status": "skipped", "count": len(previous_files)}

    if args.dry_run:
        action = (
            f"read image with vision LLM in {args.split_vertical} segment(s)"
            if args.ocr_engine == "vision-llm"
            else f"OCR with {args.ocr_engine}"
        )
        print(f"WOULD {action} {image_path.name} -> one or more data/problems/*.json")
        return {"status": "planned", "count": 0}

    api_id_prefix = args.id_prefix if args.id_prefix is not None else default_id_prefix_for_chapter(args.chapter)
    ocr_path = None
    ocr_hash = ""
    clean_path = None
    if args.ocr_engine == "vision-llm":
        segment_paths = split_image_vertical(image_path, args.split_vertical, args.split_overlap)
        print(f"VISION {image_path.name} via {current_vision_model()} segments={len(segment_paths)}")
        batches = []
        for segment_index, segment_path in enumerate(segment_paths, start=1):
            print(f"  -> segment {segment_index}/{len(segment_paths)} {segment_path.relative_to(ROOT)}")
            segment_source = f"{image_path.name} 第 {segment_index}/{len(segment_paths)} 段"
            batches.append(call_vision_batch(segment_path, args.chapter, api_id_prefix, segment_source))
        problems = merge_segment_problems(batches)
    else:
        print(f"OCR  {image_path.name} via {args.ocr_engine}")
        ocr_path = get_or_create_ocr_text(image_path, args)
        ocr_hash = sha256_file(ocr_path)
        raw_text = ocr_path.read_text(encoding="utf-8").strip()
        if not raw_text:
            raise RuntimeError(f"OCR text is empty: {ocr_path}")
        text = raw_text
        if args.clean_ocr:
            text, clean_path = write_clean_ocr_text(image_path, text)
        model_text = text
        if clean_path and raw_text and raw_text != text:
            model_text = (
                "【清理后OCR，优先使用】\n"
                f"{text}\n\n"
                "【原始OCR，遇到题号/公式/表格缺失时仅作备查；其中可能包含手写笔迹】\n"
                f"{raw_text}"
            )

        if clean_path:
            print(f"CLEAN {image_path.name} -> {clean_path.relative_to(ROOT)}")
        print(f"JSON {image_path.name} <- {clean_path or ocr_path}")
        problems = call_deepseek_batch(model_text, args.chapter, api_id_prefix, image_path.name)
    used_ids = set()
    json_paths = []
    skipped_problems = []
    for index, problem in enumerate(problems, start=1):
        if should_skip_problem(problem):
            skipped_problem = {
                "index": index,
                "originalNumber": problem.get("originalNumber", ""),
                "title": problem.get("title", ""),
                "question": problem.get("question", ""),
                "skipReason": problem.get("skipReason") or "OCR 文字不足以构成完整题目",
            }
            skipped_problems.append(skipped_problem)
            label = skipped_problem["originalNumber"] or f"problem {index}"
            print(f"  -> SKIP {label}: {skipped_problem['skipReason']}")
            continue
        problem_id = unique_problem_id(choose_problem_id(problem, image_path, args, index), used_ids)
        json_path = PROBLEMS_DIR / f"{problem_id}.json"
        normalize_problem(problem, problem_id, args.chapter, image_path, index)
        save_json(json_path, problem)
        update_index(problem_id, json_path.name)
        json_paths.append(json_path)
        print(f"  -> {json_path.relative_to(ROOT)}")
    skip_report_path = write_skip_report(image_path, skipped_problems)
    if skip_report_path:
        print(f"  -> skip report {skip_report_path.relative_to(ROOT)}")

    if not json_paths:
        state.setdefault("items", {})[state_key] = {
            "sha256": image_hash,
            "ocrSha256": ocr_hash,
            "imagePath": str(image_path),
            "ocrEngine": args.ocr_engine,
            "visionLlmVersion": VISION_LLM_VERSION if args.ocr_engine == "vision-llm" else None,
            "visionModel": current_vision_model() if args.ocr_engine == "vision-llm" else "",
            "splitVertical": current_split_vertical,
            "splitOverlap": current_split_overlap,
            "ocrPath": str(ocr_path) if ocr_path else "",
            "cleanOcrPath": str(clean_path) if clean_path else "",
            "cleanOcrVersion": OCR_CLEAN_VERSION if args.clean_ocr and args.ocr_engine != "vision-llm" else None,
            "skipReportPath": str(skip_report_path.relative_to(ROOT)) if skip_report_path else "",
            "jsonPaths": [],
            "skipped": True,
            "skipReason": "No parseable complete problem found from OCR text",
            "updatedAt": datetime.now(timezone.utc).isoformat(),
        }
        return {"status": "skipped", "count": 0}

    state.setdefault("items", {})[state_key] = {
        "sha256": image_hash,
        "ocrSha256": ocr_hash,
        "problemIds": [path.stem for path in json_paths],
        "imagePath": str(image_path),
        "ocrEngine": args.ocr_engine,
        "visionLlmVersion": VISION_LLM_VERSION if args.ocr_engine == "vision-llm" else None,
        "visionModel": current_vision_model() if args.ocr_engine == "vision-llm" else "",
        "splitVertical": current_split_vertical,
        "splitOverlap": current_split_overlap,
        "ocrPath": str(ocr_path) if ocr_path else "",
        "cleanOcrPath": str(clean_path) if clean_path else "",
        "cleanOcrVersion": OCR_CLEAN_VERSION if args.clean_ocr and args.ocr_engine != "vision-llm" else None,
        "skipReportPath": str(skip_report_path.relative_to(ROOT)) if skip_report_path else "",
        "jsonPaths": [str(path.relative_to(ROOT)) for path in json_paths],
        "skipped": False,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    return {"status": "processed", "count": len(json_paths)}


def main():
    parser = argparse.ArgumentParser(description="Use sidecar OCR text to split problem images into JSON files.")
    parser.add_argument("input", help="Image file or directory")
    parser.add_argument("--chapter", required=True, help="Default chapter name for generated problems")
    parser.add_argument("--id", dest="problem_id", help="Optional base problem id. Multiple problems get _02, _03 suffixes.")
    parser.add_argument("--id-prefix", default=None, help="Optional id prefix, e.g. projectile_. Defaults to chapter English prefix.")
    parser.add_argument("--ocr-engine", choices=["paddle", "vision", "sidecar", "vision-llm"], default="vision", help="OCR engine. vision uses local macOS Vision; vision-llm sends the image directly to an OpenAI-compatible vision model.")
    parser.add_argument("--split-vertical", type=int, default=1, help="For vision-llm, split each page into N vertical segments before reading. Use 3 for dense photographed exercise pages.")
    parser.add_argument("--split-overlap", type=float, default=0.12, help="Overlap ratio between vertical segments, default: 0.12")
    parser.add_argument("--ocr-lang", default="ch", help="PaddleOCR language code, default: ch")
    parser.add_argument("--ocr-version", default="PP-OCRv5", help="PaddleOCR version, default: PP-OCRv5")
    parser.add_argument("--ocr-max-side", type=int, default=1800, help="Resize image longest side before OCR, default: 1800")
    parser.add_argument("--ocr-file", help="Explicit OCR .txt/.md for a single image")
    parser.add_argument("--ocr-dir", default="work/ocr", help="OCR output/search directory")
    parser.add_argument("--no-clean-ocr", dest="clean_ocr", action="store_false", help="Send raw OCR text to DeepSeek without local handwriting/noise cleanup")
    parser.add_argument("--state", default=str(STATE_PATH), help="Incremental state file")
    parser.add_argument("--force", action="store_true", help="Reprocess images even if unchanged")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be processed without API calls")
    parser.set_defaults(clean_ocr=True)
    args = parser.parse_args()

    load_env_file(ROOT / ".env")
    input_path = Path(args.input)
    images = iter_images(input_path)
    if not images:
        raise RuntimeError(f"No image files found: {input_path}")
    if len(images) > 1 and args.problem_id:
        raise RuntimeError("--id can only be used with a single image file")
    if len(images) > 1 and args.ocr_file:
        raise RuntimeError("--ocr-file can only be used with a single image file")
    if args.ocr_engine != "vision-llm" and args.split_vertical != 1:
        raise RuntimeError("--split-vertical only works with --ocr-engine vision-llm")
    if args.split_vertical < 1:
        raise RuntimeError("--split-vertical must be >= 1")

    state_path = Path(args.state)
    state = load_json(state_path, {"version": 1, "items": {}})
    results = [process_image(image_path, args, state) for image_path in images]
    if not args.dry_run:
        save_json(state_path, state)

    processed_images = sum(1 for item in results if item["status"] == "processed")
    skipped_images = sum(1 for item in results if item["status"] == "skipped")
    planned_images = sum(1 for item in results if item["status"] == "planned")
    problem_count = sum(item["count"] for item in results if item["status"] == "processed")
    print(
        f"DONE processed_images={processed_images} skipped_images={skipped_images} "
        f"planned_images={planned_images} problems={problem_count}"
    )


if __name__ == "__main__":
    main()
