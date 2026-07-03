#!/usr/bin/env python3
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROBLEM_DIR = ROOT / "data" / "problems"
INDEX_PATH = PROBLEM_DIR / "index.json"
REQUIRED_PROBLEM_FIELDS = ["id", "chapter", "title", "question", "steps", "knowledge"]
REQUIRED_STEP_FIELDS = ["title", "content"]


def load_json(path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def validate_problem(path):
    problem = load_json(path)
    errors = []
    for field in REQUIRED_PROBLEM_FIELDS:
        if field not in problem:
            errors.append(f"{path.name}: missing field {field}")
    if not isinstance(problem.get("steps"), list) or not problem.get("steps"):
        errors.append(f"{path.name}: steps must be a non-empty list")
    else:
        for index, step in enumerate(problem["steps"], start=1):
            for field in REQUIRED_STEP_FIELDS:
                if field not in step:
                    errors.append(f"{path.name}: step {index} missing field {field}")
    if not isinstance(problem.get("knowledge"), list):
        errors.append(f"{path.name}: knowledge must be a list")
    return problem, errors


def main():
    index = load_json(INDEX_PATH)
    entries = index.get("problems", [])
    if not isinstance(entries, list):
        print("index.json: problems must be a list", file=sys.stderr)
        return 1

    seen_ids = set()
    all_errors = []
    for entry in entries:
      file_name = entry.get("file")
      if not file_name:
          all_errors.append("index.json: every entry needs file")
          continue
      path = PROBLEM_DIR / file_name
      if not path.exists():
          all_errors.append(f"index.json: missing file {file_name}")
          continue
      problem, errors = validate_problem(path)
      all_errors.extend(errors)
      problem_id = problem.get("id")
      if problem_id in seen_ids:
          all_errors.append(f"{file_name}: duplicate id {problem_id}")
      seen_ids.add(problem_id)
      if entry.get("id") and entry["id"] != problem_id:
          all_errors.append(f"index.json: id {entry['id']} does not match {file_name} id {problem_id}")

    if all_errors:
        for error in all_errors:
            print(error, file=sys.stderr)
        return 1
    print(f"OK: {len(entries)} problem file(s) validated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
