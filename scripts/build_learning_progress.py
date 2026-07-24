#!/usr/bin/env python3
import argparse
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROBLEM_DIR = ROOT / "data" / "problems"
INDEX_PATH = PROBLEM_DIR / "index.json"
OUTPUT_PATH = ROOT / "data" / "learning-progress.json"
HTML_PATH = ROOT / "classical-mechanics-demo.html"


def load_json(path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def clean_string_list(items):
    cleaned = []
    for item in items if isinstance(items, list) else []:
        value = str(item).strip()
        if value and value not in cleaned:
            cleaned.append(value)
    return cleaned


def load_visible_problem_ids():
    html = HTML_PATH.read_text(encoding="utf-8")
    return {
        scene_id
        for scene_id in re.findall(r'data-scene="([^"]+)"', html)
        if scene_id != "summerExam"
    }


def build_progress_catalog():
    index = load_json(INDEX_PATH)
    visible_problem_ids = load_visible_problem_ids()
    problems = []
    for entry in index.get("problems", []):
        if not isinstance(entry, dict) or not entry.get("file"):
            continue
        if entry.get("id") not in visible_problem_ids:
            continue
        problem = load_json(PROBLEM_DIR / entry["file"])
        exploration = problem.get("studentExploration")
        stages = exploration.get("stages", []) if isinstance(exploration, dict) else []
        real_life = problem.get("realLifeCase")
        has_transfer = bool(isinstance(real_life, dict) and str(real_life.get("question", "")).strip())
        rubric = real_life.get("rubric", []) if isinstance(real_life, dict) else []
        if not stages and not has_transfer:
            continue
        problems.append(
            {
                "id": problem.get("id"),
                "chapter": problem.get("chapter") or "未分类",
                "title": problem.get("title") or problem.get("id"),
                "knowledge": clean_string_list(problem.get("knowledge")),
                "explorationStages": len(stages),
                "hasTransfer": has_transfer,
                "rubricPoints": min(3, len(rubric)) if has_transfer and isinstance(rubric, list) else 0,
            }
        )
    return {"version": 1, "problems": problems}


def main():
    parser = argparse.ArgumentParser(description="Build the compact homepage learning-progress catalog.")
    parser.add_argument("--check", action="store_true", help="Fail when the committed catalog is stale.")
    args = parser.parse_args()
    catalog = build_progress_catalog()

    if args.check:
        try:
            existing = load_json(OUTPUT_PATH)
        except (OSError, json.JSONDecodeError):
            print("data/learning-progress.json is missing or invalid", file=sys.stderr)
            return 1
        if existing != catalog:
            print(
                "data/learning-progress.json is stale; run python3 -B scripts/build_learning_progress.py",
                file=sys.stderr,
            )
            return 1
        print(f"OK: learning progress catalog contains {len(catalog['problems'])} problem(s)")
        return 0

    OUTPUT_PATH.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT_PATH.relative_to(ROOT)} with {len(catalog['problems'])} problem(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
