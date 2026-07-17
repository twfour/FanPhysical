#!/usr/bin/env python3
import json
import re
import sys
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROBLEM_DIR = ROOT / "data" / "problems"
INDEX_PATH = PROBLEM_DIR / "index.json"
HTML_PATH = ROOT / "classical-mechanics-demo.html"
CHAPTER_GUIDES_PATH = ROOT / "data" / "chapter-guides.json"
REQUIRED_PROBLEM_FIELDS = ["id", "chapter", "title", "question", "steps", "knowledge"]
REQUIRED_STEP_FIELDS = ["title", "content"]
SUPPORTED_ANIMATION_TYPES = {
    "none",
    "fanphysics_model",
    "curve_training_model",
    "projectile_training_model",
    "circular_concept",
    "gravitation_model",
    "gravitation_lunar_throw",
    "gravitation_eclipse",
    "work_power_model",
    "kinetic_energy_model",
    "mechanical_energy_model",
    "functional_relation_model",
    "required_one_test_model",
    "required_two_test_model",
}


def load_json(path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def validate_problem(path):
    problem = load_json(path)
    errors = []
    if problem.get("notesHtml"):
        errors.append(f"{path.name}: legacy notesHtml is not allowed")
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
    notebooklm = problem.get("notebooklm")
    if notebooklm is not None:
        if not isinstance(notebooklm, list):
            errors.append(f"{path.name}: notebooklm must be a list")
        else:
            for index, item in enumerate(notebooklm, start=1):
                if not isinstance(item, dict):
                    errors.append(f"{path.name}: notebooklm item {index} must be an object")
                    continue
                if item.get("type") not in {"audio", "video"}:
                    errors.append(f"{path.name}: notebooklm item {index} has unsupported type")
                if not re.match(r"^https://notebooklm\.google\.com/", str(item.get("url", ""))):
                    errors.append(f"{path.name}: notebooklm item {index} needs a NotebookLM URL")
    animation_type = problem.get("animation", {}).get("type", "none")
    if animation_type not in SUPPORTED_ANIMATION_TYPES:
        errors.append(f"{path.name}: unsupported animation type {animation_type}")
    return problem, animation_type, errors


def validate_chapter_guides(problem_chapters):
    errors = []
    try:
        payload = load_json(CHAPTER_GUIDES_PATH)
    except (json.JSONDecodeError, OSError) as error:
        return [f"chapter-guides.json: {error}"]
    guides = payload.get("chapters")
    if not isinstance(guides, dict):
        return ["chapter-guides.json: chapters must be an object"]
    guide_chapters = set(guides)
    for chapter in sorted(problem_chapters.difference(guide_chapters)):
        errors.append(f"chapter-guides.json: missing chapter {chapter}")
    for chapter in sorted(guide_chapters.difference(problem_chapters)):
        errors.append(f"chapter-guides.json: unknown chapter {chapter}")
    for chapter, guide in guides.items():
        if not isinstance(guide, dict):
            errors.append(f"chapter-guides.json: {chapter} must be an object")
            continue
        if not isinstance(guide.get("overview"), str) or not guide["overview"].strip():
            errors.append(f"chapter-guides.json: {chapter} needs overview")
        laws = guide.get("laws")
        if not isinstance(laws, list) or not laws or not all(isinstance(item, str) and item.strip() for item in laws):
            errors.append(f"chapter-guides.json: {chapter} needs non-empty laws")
        formulas = guide.get("formulas")
        if not isinstance(formulas, list) or not formulas:
            errors.append(f"chapter-guides.json: {chapter} needs formulas")
        else:
            for index, formula in enumerate(formulas, start=1):
                if not isinstance(formula, dict):
                    errors.append(f"chapter-guides.json: {chapter} formula {index} must be an object")
                    continue
                for field in ("title", "latex", "note"):
                    if not isinstance(formula.get(field), str) or not formula[field].strip():
                        errors.append(f"chapter-guides.json: {chapter} formula {index} needs {field}")
                latex = formula.get("latex", "")
                if "\\[" not in latex and "\\(" not in latex:
                    errors.append(f"chapter-guides.json: {chapter} formula {index} needs LaTeX delimiters")
        notebook_url = guide.get("notebooklmUrl")
        if notebook_url is not None and not re.match(
            r"^https://notebooklm\.google\.com/notebook/[^/?#]+$",
            str(notebook_url),
        ):
            errors.append(f"chapter-guides.json: {chapter} has invalid notebooklmUrl")
    return errors


def main():
    index = load_json(INDEX_PATH)
    entries = index.get("problems", [])
    if not isinstance(entries, list):
        print("index.json: problems must be a list", file=sys.stderr)
        return 1

    seen_ids = set()
    seen_files = set()
    seen_chapters = set()
    animation_type_counts = Counter()
    all_errors = []
    for position, entry in enumerate(entries, start=1):
        if not isinstance(entry, dict):
            all_errors.append(f"index.json: item {position} must be an object")
            continue
        file_name = entry.get("file")
        if not file_name:
            all_errors.append(f"index.json: item {position} needs file")
            continue
        if file_name in seen_files:
            all_errors.append(f"index.json: duplicate file {file_name}")
        seen_files.add(file_name)
        path = PROBLEM_DIR / file_name
        if not path.exists():
            all_errors.append(f"index.json: missing file {file_name}")
            continue
        try:
            problem, animation_type, errors = validate_problem(path)
        except (json.JSONDecodeError, OSError) as error:
            all_errors.append(f"{file_name}: {error}")
            continue
        all_errors.extend(errors)
        animation_type_counts[animation_type] += 1
        problem_id = problem.get("id")
        if problem_id in seen_ids:
            all_errors.append(f"{file_name}: duplicate id {problem_id}")
        seen_ids.add(problem_id)
        seen_chapters.add(problem.get("chapter") or "未分类")
        if entry.get("id") != problem_id:
            all_errors.append(
                f"index.json: id {entry.get('id')} does not match {file_name} id {problem_id}"
            )

    all_errors.extend(validate_chapter_guides(seen_chapters))

    html = HTML_PATH.read_text(encoding="utf-8")
    tree_scene_ids = [
        scene_id
        for scene_id in re.findall(r'data-scene="([^"]+)"', html)
        if scene_id != "summerExam"
    ]
    for scene_id in tree_scene_ids:
        if scene_id not in seen_ids:
            all_errors.append(f"tree scene missing from problem index: {scene_id}")

    if all_errors:
        for error in all_errors:
            print(error, file=sys.stderr)
        return 1

    hidden_index_entries = seen_ids.difference(tree_scene_ids)
    print(f"OK: {len(entries)} problem file(s) and {len(tree_scene_ids)} tree scene(s) validated")
    print(f"Animation types: {dict(sorted(animation_type_counts.items()))}")
    if hidden_index_entries:
        print(f"Index-only historical problems retained: {len(hidden_index_entries)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
