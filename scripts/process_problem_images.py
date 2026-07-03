#!/usr/bin/env python3
import argparse
import hashlib
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from deepseek_ocr_to_problem import ROOT, call_deepseek_batch, load_env_file


STATE_PATH = ROOT / "work" / "problem_pipeline_state.json"
PROBLEMS_DIR = ROOT / "data" / "problems"
INDEX_PATH = PROBLEMS_DIR / "index.json"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif", ".tif", ".tiff"}
TEXT_EXTENSIONS = {".txt", ".md", ".markdown"}
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
    problem.setdefault("animation", {
        "level": "none",
        "type": "none",
        "playable": False,
        "interactive": False,
        "params": {}
    })
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


def process_image(image_path, args, state):
    image_hash = sha256_file(image_path)
    image_base = slugify(image_path.stem, "problem_" + image_hash[:8])
    state_key = str(image_path.resolve())
    previous = state.get("items", {}).get(state_key, {})
    previous_files = previous.get("jsonPaths", [])

    if (
        not args.force
        and previous.get("sha256") == image_hash
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
        print(f"WOULD OCR {image_path.name} with {args.ocr_engine} -> one or more data/problems/*.json")
        return {"status": "planned", "count": 0}

    print(f"OCR  {image_path.name} via {args.ocr_engine}")
    ocr_path = get_or_create_ocr_text(image_path, args)
    ocr_hash = sha256_file(ocr_path)
    text = ocr_path.read_text(encoding="utf-8").strip()
    if not text:
        raise RuntimeError(f"OCR text is empty: {ocr_path}")

    print(f"JSON {image_path.name} <- {ocr_path}")
    api_id_prefix = args.id_prefix if args.id_prefix is not None else default_id_prefix_for_chapter(args.chapter)
    problems = call_deepseek_batch(text, args.chapter, api_id_prefix, image_path.name)
    used_ids = set()
    json_paths = []
    for index, problem in enumerate(problems, start=1):
        if should_skip_problem(problem):
            print(f"  -> SKIP problem {index}: {problem.get('skipReason') or 'OCR 文字不足以构成完整题目'}")
            continue
        problem_id = unique_problem_id(choose_problem_id(problem, image_path, args, index), used_ids)
        json_path = PROBLEMS_DIR / f"{problem_id}.json"
        normalize_problem(problem, problem_id, args.chapter, image_path, index)
        save_json(json_path, problem)
        update_index(problem_id, json_path.name)
        json_paths.append(json_path)
        print(f"  -> {json_path.relative_to(ROOT)}")

    if not json_paths:
        state.setdefault("items", {})[state_key] = {
            "sha256": image_hash,
            "ocrSha256": ocr_hash,
            "imagePath": str(image_path),
            "ocrPath": str(ocr_path),
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
        "ocrPath": str(ocr_path),
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
    parser.add_argument("--ocr-engine", choices=["paddle", "vision", "sidecar"], default="vision", help="OCR engine. vision uses local macOS Vision; paddle uses local PaddleOCR; sidecar reads existing OCR text.")
    parser.add_argument("--ocr-lang", default="ch", help="PaddleOCR language code, default: ch")
    parser.add_argument("--ocr-version", default="PP-OCRv5", help="PaddleOCR version, default: PP-OCRv5")
    parser.add_argument("--ocr-max-side", type=int, default=1800, help="Resize image longest side before OCR, default: 1800")
    parser.add_argument("--ocr-file", help="Explicit OCR .txt/.md for a single image")
    parser.add_argument("--ocr-dir", default="work/ocr", help="OCR output/search directory")
    parser.add_argument("--state", default=str(STATE_PATH), help="Incremental state file")
    parser.add_argument("--force", action="store_true", help="Reprocess images even if unchanged")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be processed without API calls")
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
