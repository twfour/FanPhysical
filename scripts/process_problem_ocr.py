#!/usr/bin/env python3
import argparse
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path

from deepseek_ocr_to_problem import ROOT, call_deepseek_batch, load_env_file
from process_problem_images import chapter_title_prefix, semantic_slug


STATE_PATH = ROOT / "work" / "problem_ocr_state.json"
PROBLEMS_DIR = ROOT / "data" / "problems"
INDEX_PATH = PROBLEMS_DIR / "index.json"
TEXT_EXTENSIONS = {".txt", ".md", ".markdown"}


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


def iter_ocr_files(path):
    if path.is_file():
        if path.suffix.lower() not in TEXT_EXTENSIONS:
            raise RuntimeError("Input must be .txt, .md, or .markdown when Mathpix is disabled")
        return [path]
    return sorted(item for item in path.iterdir() if item.suffix.lower() in TEXT_EXTENSIONS)


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


def normalize_problem(problem, problem_id, chapter, source_file, source_index):
    problem.pop("source", None)
    problem.pop("summary", None)
    problem["id"] = problem_id
    problem["chapter"] = problem.get("chapter") or chapter
    problem["title"] = problem.get("title") or f"{source_file.stem} 第 {source_index} 题"
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
    return problem


def choose_problem_id(problem, source_file, args, index):
    if args.problem_id:
        return args.problem_id if index == 1 else f"{args.problem_id}_{index:02d}"
    slug = semantic_slug(problem, f"problem_{index:02d}")
    prefix = args.id_prefix or slugify(source_file.stem, "ocr") + "_"
    return prefix + slug


def unique_problem_id(problem_id, used_ids):
    candidate = problem_id
    counter = 2
    while candidate in used_ids:
        candidate = f"{problem_id}_{counter}"
        counter += 1
    used_ids.add(candidate)
    return candidate


def process_ocr_file(ocr_path, args, state):
    text_hash = sha256_file(ocr_path)
    state_key = str(ocr_path.resolve())
    previous = state.get("items", {}).get(state_key, {})
    previous_files = previous.get("jsonPaths", [])

    if (
        not args.force
        and previous.get("sha256") == text_hash
        and previous_files
        and all((ROOT / item).exists() for item in previous_files)
    ):
        print(f"SKIP unchanged {ocr_path.name} -> {len(previous_files)} JSON file(s)")
        return {"status": "skipped", "count": len(previous_files)}

    if args.dry_run:
        print(f"WOULD process {ocr_path.name} -> one or more data/problems/*.json")
        return {"status": "planned", "count": 0}

    text = ocr_path.read_text(encoding="utf-8").strip()
    if not text:
        raise RuntimeError(f"OCR text is empty: {ocr_path}")

    print(f"JSON {ocr_path.name}")
    problems = call_deepseek_batch(text, args.chapter, args.id_prefix, ocr_path.name)
    used_ids = set()
    json_paths = []
    for index, problem in enumerate(problems, start=1):
        problem_id = unique_problem_id(choose_problem_id(problem, ocr_path, args, index), used_ids)
        json_path = PROBLEMS_DIR / f"{problem_id}.json"
        normalize_problem(problem, problem_id, args.chapter, ocr_path, index)
        save_json(json_path, problem)
        update_index(problem_id, json_path.name)
        json_paths.append(json_path)
        print(f"  -> {json_path.relative_to(ROOT)}")

    state.setdefault("items", {})[state_key] = {
        "sha256": text_hash,
        "problemIds": [path.stem for path in json_paths],
        "ocrPath": str(ocr_path),
        "jsonPaths": [str(path.relative_to(ROOT)) for path in json_paths],
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    return {"status": "processed", "count": len(json_paths)}


def main():
    parser = argparse.ArgumentParser(description="Split OCR text files into one or more FanPhysics JSON problems.")
    parser.add_argument("input", help="OCR .txt/.md file or directory")
    parser.add_argument("--chapter", required=True, help="Default chapter name for generated problems")
    parser.add_argument("--id", dest="problem_id", help="Optional base id. Multiple problems get _02, _03 suffixes.")
    parser.add_argument("--id-prefix", default="", help="Optional id prefix, e.g. projectile_")
    parser.add_argument("--state", default=str(STATE_PATH), help="Incremental state file")
    parser.add_argument("--force", action="store_true", help="Reprocess OCR files even if unchanged")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be processed without API calls")
    args = parser.parse_args()

    load_env_file(ROOT / ".env")
    input_path = Path(args.input)
    ocr_files = iter_ocr_files(input_path)
    if not ocr_files:
        raise RuntimeError(f"No OCR text files found: {input_path}")
    if len(ocr_files) > 1 and args.problem_id:
        raise RuntimeError("--id can only be used with a single OCR file")

    state_path = Path(args.state)
    state = load_json(state_path, {"version": 1, "items": {}})
    results = [process_ocr_file(ocr_file, args, state) for ocr_file in ocr_files]
    if not args.dry_run:
        save_json(state_path, state)

    processed_files = sum(1 for item in results if item["status"] == "processed")
    skipped_files = sum(1 for item in results if item["status"] == "skipped")
    planned_files = sum(1 for item in results if item["status"] == "planned")
    problem_count = sum(item["count"] for item in results if item["status"] == "processed")
    print(
        f"DONE processed_files={processed_files} skipped_files={skipped_files} "
        f"planned_files={planned_files} problems={problem_count}"
    )


if __name__ == "__main__":
    main()
