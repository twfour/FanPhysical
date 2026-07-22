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
REQUIRED_EXPLORATION_STAGE_FIELDS = ["title", "prompt", "thought", "check", "correction", "takeaway"]
REQUIRED_REAL_LIFE_FIELDS = ["title", "scene", "mapping", "sharedModel", "question", "answer"]
REQUIRED_REAL_LIFE_VIDEO_FIELDS = ["platform", "title", "url", "watchFor", "matchReason"]
REQUIRED_REAL_LIFE_RESOURCE_FIELDS = ["platform", "title", "url", "useFor", "matchReason"]
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


def is_non_empty_string(value):
    return isinstance(value, str) and bool(value.strip())


def validate_student_exploration(path, problem):
    exploration = problem.get("studentExploration")
    if exploration is None:
        return []
    errors = []
    if not isinstance(exploration, dict):
        return [f"{path.name}: studentExploration must be an object"]
    for field in ("title", "opening"):
        if not is_non_empty_string(exploration.get(field)):
            errors.append(f"{path.name}: studentExploration needs {field}")
    stages = exploration.get("stages")
    if not isinstance(stages, list) or not stages:
        errors.append(f"{path.name}: studentExploration stages must be a non-empty list")
        return errors
    animation_params = set(problem.get("animation", {}).get("params", {}))
    for index, stage in enumerate(stages, start=1):
        if not isinstance(stage, dict):
            errors.append(f"{path.name}: studentExploration stage {index} must be an object")
            continue
        for field in REQUIRED_EXPLORATION_STAGE_FIELDS:
            if not is_non_empty_string(stage.get(field)):
                errors.append(f"{path.name}: studentExploration stage {index} needs {field}")
        preset = stage.get("animationPreset")
        if preset is None:
            animation = problem.get("animation", {})
            if animation.get("enabled") is not False and animation.get("type") not in {None, "none"}:
                errors.append(f"{path.name}: studentExploration stage {index} needs animationPreset")
            continue
        if not isinstance(preset, dict):
            errors.append(f"{path.name}: studentExploration stage {index} animationPreset must be an object")
            continue
        params = preset.get("params", {})
        if not isinstance(params, dict):
            errors.append(f"{path.name}: studentExploration stage {index} animationPreset params must be an object")
        else:
            for key, value in params.items():
                if key not in animation_params:
                    errors.append(
                        f"{path.name}: studentExploration stage {index} animationPreset has unknown param {key}"
                    )
                if isinstance(value, bool) or not isinstance(value, (int, float)):
                    errors.append(
                        f"{path.name}: studentExploration stage {index} animationPreset param {key} must be numeric"
                    )
        if "progress" in preset:
            progress = preset["progress"]
            if isinstance(progress, bool) or not isinstance(progress, (int, float)) or not 0 <= progress <= 1:
                errors.append(
                    f"{path.name}: studentExploration stage {index} animationPreset progress must be between 0 and 1"
                )
        if "time" in preset and (
            isinstance(preset["time"], bool) or not isinstance(preset["time"], (int, float)) or preset["time"] < 0
        ):
            errors.append(f"{path.name}: studentExploration stage {index} animationPreset time must be non-negative")
        if "play" in preset and not isinstance(preset["play"], bool):
            errors.append(f"{path.name}: studentExploration stage {index} animationPreset play must be boolean")
        if "play" not in preset:
            errors.append(f"{path.name}: studentExploration stage {index} animationPreset needs play")
        if not any(field in preset for field in ("progress", "time")):
            errors.append(f"{path.name}: studentExploration stage {index} animationPreset needs progress or time")
        if not is_non_empty_string(preset.get("caption")):
            errors.append(f"{path.name}: studentExploration stage {index} animationPreset needs caption")
    return errors


def validate_real_life_case(path, problem):
    real_life = problem.get("realLifeCase")
    if real_life is None:
        return []
    errors = []
    if not isinstance(real_life, dict):
        return [f"{path.name}: realLifeCase must be an object"]
    for field in REQUIRED_REAL_LIFE_FIELDS:
        if not is_non_empty_string(real_life.get(field)):
            errors.append(f"{path.name}: realLifeCase needs {field}")
    for field in ("realityFactors", "rubric"):
        items = real_life.get(field)
        if not isinstance(items, list) or not items or not all(is_non_empty_string(item) for item in items):
            errors.append(f"{path.name}: realLifeCase {field} must be a non-empty string list")
    if isinstance(real_life.get("rubric"), list) and len(real_life["rubric"]) != 3:
        errors.append(f"{path.name}: realLifeCase rubric must contain exactly three scoring points")
    videos = real_life.get("videos")
    if videos is not None:
        if not isinstance(videos, list) or not videos:
            errors.append(f"{path.name}: realLifeCase videos must be a non-empty list")
        else:
            if len(videos) > 3:
                errors.append(f"{path.name}: realLifeCase videos may contain at most three items")
            for index, video in enumerate(videos, start=1):
                if not isinstance(video, dict):
                    errors.append(f"{path.name}: realLifeCase video {index} must be an object")
                    continue
                for field in REQUIRED_REAL_LIFE_VIDEO_FIELDS:
                    if not is_non_empty_string(video.get(field)):
                        errors.append(f"{path.name}: realLifeCase video {index} needs {field}")
                if not re.match(r"^https://", str(video.get("url", ""))):
                    errors.append(f"{path.name}: realLifeCase video {index} needs an HTTPS URL")
                duration = video.get("duration")
                if duration is not None and not is_non_empty_string(duration):
                    errors.append(f"{path.name}: realLifeCase video {index} duration must be a string")
                start_at = video.get("startAt")
                if start_at is not None and (
                    isinstance(start_at, bool) or not isinstance(start_at, (int, float)) or start_at < 0
                ):
                    errors.append(f"{path.name}: realLifeCase video {index} startAt must be non-negative")
    resources = real_life.get("authoritativeResources")
    if resources is not None:
        if not isinstance(resources, list) or not resources:
            errors.append(f"{path.name}: realLifeCase authoritativeResources must be a non-empty list")
        else:
            if len(resources) > 3:
                errors.append(f"{path.name}: realLifeCase authoritativeResources may contain at most three items")
            for index, resource in enumerate(resources, start=1):
                if not isinstance(resource, dict):
                    errors.append(f"{path.name}: realLifeCase authoritative resource {index} must be an object")
                    continue
                for field in REQUIRED_REAL_LIFE_RESOURCE_FIELDS:
                    if not is_non_empty_string(resource.get(field)):
                        errors.append(
                            f"{path.name}: realLifeCase authoritative resource {index} needs {field}"
                        )
                if not re.match(r"^https://", str(resource.get("url", ""))):
                    errors.append(
                        f"{path.name}: realLifeCase authoritative resource {index} needs an HTTPS URL"
                    )
                kind = resource.get("kind")
                if kind is not None and not is_non_empty_string(kind):
                    errors.append(
                        f"{path.name}: realLifeCase authoritative resource {index} kind must be a string"
                    )
    return errors


def validate_learning_cycle(path, problem):
    cycle = problem.get("learningCycle")
    if cycle is None:
        return []
    errors = []
    if not isinstance(cycle, dict):
        return [f"{path.name}: learningCycle must be an object"]
    animation = problem.get("animation", {})
    if animation.get("enabled") is not True or animation.get("playable") is not True:
        errors.append(f"{path.name}: learningCycle prediction gate requires a playable animation")
    intervals = cycle.get("intervalDays")
    if not isinstance(intervals, list) or not intervals:
        errors.append(f"{path.name}: learningCycle intervalDays must be a non-empty list")
    elif any(isinstance(item, bool) or not isinstance(item, (int, float)) or item <= 0 for item in intervals):
        errors.append(f"{path.name}: learningCycle intervalDays must contain positive numbers")
    for section_name in ("prediction", "review"):
        section = cycle.get(section_name)
        if not isinstance(section, dict):
            errors.append(f"{path.name}: learningCycle needs {section_name}")
            continue
        for field in ("title", "prompt", "answer", "explanation"):
            if not is_non_empty_string(section.get(field)):
                errors.append(f"{path.name}: learningCycle {section_name} needs {field}")
        options = section.get("options")
        if not isinstance(options, list) or len(options) < 2:
            errors.append(f"{path.name}: learningCycle {section_name} options need at least two items")
            continue
        values = []
        for index, option in enumerate(options, start=1):
            if not isinstance(option, dict):
                errors.append(f"{path.name}: learningCycle {section_name} option {index} must be an object")
                continue
            value = option.get("value")
            if not is_non_empty_string(value) or not is_non_empty_string(option.get("text")):
                errors.append(f"{path.name}: learningCycle {section_name} option {index} needs value and text")
                continue
            values.append(value)
            if value == section.get("answer"):
                continue
            diagnosis = option.get("diagnosis")
            if not isinstance(diagnosis, dict):
                errors.append(
                    f"{path.name}: learningCycle {section_name} wrong option {value} needs diagnosis"
                )
                continue
            for field in ("tag", "feedback"):
                if not is_non_empty_string(diagnosis.get(field)):
                    errors.append(
                        f"{path.name}: learningCycle {section_name} wrong option {value} diagnosis needs {field}"
                    )
            if section_name == "prediction" and not is_non_empty_string(diagnosis.get("prompt")):
                errors.append(
                    f"{path.name}: learningCycle prediction wrong option {value} diagnosis needs prompt"
                )
        if len(values) != len(set(values)):
            errors.append(f"{path.name}: learningCycle {section_name} option values must be unique")
        if section.get("answer") not in values:
            errors.append(f"{path.name}: learningCycle {section_name} answer must match an option")
    return errors


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
    errors.extend(validate_student_exploration(path, problem))
    errors.extend(validate_real_life_case(path, problem))
    errors.extend(validate_learning_cycle(path, problem))
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
