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
REQUIRED_EXAM_CONNECTION_FIELDS = [
    "type",
    "title",
    "source",
    "year",
    "number",
    "matchLevel",
    "matchReason",
    "url",
]
SUPPORTED_EXAM_CONNECTION_TYPES = {"gaokao", "competition"}
SUPPORTED_EXAM_MATCH_LEVELS = {"高度同构", "同一考点", "综合迁移"}
SUPPORTED_COMPETITION_TIERS = {"竞赛入门", "竞赛进阶", "国际挑战"}
TAXONOMY_REQUIRED_CHAPTERS = {"机械能守恒定律", "必修二结业测试"}
REQUIRED_TAXONOMY_FIELDS = [
    "module",
    "topic",
    "modelId",
    "modelName",
    "familyId",
    "familyName",
    "role",
    "difficulty",
    "variantLevel",
    "skills",
    "prerequisites",
]
SUPPORTED_TAXONOMY_ROLES = {
    "概念辨析",
    "母题",
    "基础变式",
    "条件变式",
    "综合题",
    "高考真题",
    "竞赛拓展",
}
SUPPORTED_VARIANT_LEVELS = {"L0", "L1", "L2", "L3"}
TAXONOMY_ID_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
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


def validate_exam_connections(path, problem):
    connections = problem.get("examConnections")
    if connections is None:
        if problem.get("chapter") == "必修二结业测试":
            return [f"{path.name}: 必修二结业测试 problem needs examConnections"]
        return []
    errors = []
    if not isinstance(connections, list) or not connections:
        return [f"{path.name}: examConnections must be a non-empty list"]
    if len(connections) > 4:
        errors.append(f"{path.name}: examConnections may contain at most four items")
    seen = set()
    connection_types = set()
    for index, item in enumerate(connections, start=1):
        if not isinstance(item, dict):
            errors.append(f"{path.name}: examConnections item {index} must be an object")
            continue
        for field in REQUIRED_EXAM_CONNECTION_FIELDS:
            value = item.get(field)
            if field == "year":
                if isinstance(value, bool) or not isinstance(value, int) or not 1950 <= value <= 2100:
                    errors.append(f"{path.name}: examConnections item {index} needs a valid integer year")
            elif not is_non_empty_string(value):
                errors.append(f"{path.name}: examConnections item {index} needs {field}")
        connection_type = item.get("type")
        if connection_type not in SUPPORTED_EXAM_CONNECTION_TYPES:
            errors.append(f"{path.name}: examConnections item {index} has unsupported type")
        else:
            connection_types.add(connection_type)
        if item.get("matchLevel") not in SUPPORTED_EXAM_MATCH_LEVELS:
            errors.append(f"{path.name}: examConnections item {index} has unsupported matchLevel")
        if not re.match(r"^https://", str(item.get("url", ""))):
            errors.append(f"{path.name}: examConnections item {index} needs an HTTPS URL")
        identity = (connection_type, item.get("source"), item.get("number"))
        if identity in seen:
            errors.append(f"{path.name}: examConnections item {index} duplicates an earlier source")
        seen.add(identity)
        prerequisites = item.get("prerequisites")
        if prerequisites is not None and (
            not isinstance(prerequisites, list)
            or not prerequisites
            or not all(is_non_empty_string(value) for value in prerequisites)
        ):
            errors.append(f"{path.name}: examConnections item {index} prerequisites must be a non-empty string list")
        tier = item.get("tier")
        if connection_type == "competition":
            if tier not in SUPPORTED_COMPETITION_TIERS:
                errors.append(f"{path.name}: examConnections item {index} needs a supported competition tier")
        elif tier is not None:
            errors.append(f"{path.name}: examConnections item {index} gaokao item must not define tier")
    if problem.get("chapter") == "必修二结业测试" and "gaokao" not in connection_types:
        errors.append(f"{path.name}: 必修二结业测试 problem needs a gaokao exam connection")
    return errors


def validate_taxonomy(path, problem):
    taxonomy = problem.get("taxonomy")
    chapter = problem.get("chapter")
    if taxonomy is None:
        if chapter in TAXONOMY_REQUIRED_CHAPTERS:
            return [f"{path.name}: {chapter} problem needs taxonomy"]
        return []
    if not isinstance(taxonomy, dict):
        return [f"{path.name}: taxonomy must be an object"]
    errors = []
    for field in REQUIRED_TAXONOMY_FIELDS:
        if field not in taxonomy:
            errors.append(f"{path.name}: taxonomy needs {field}")
    for field in ("module", "topic", "modelId", "modelName", "familyId", "familyName"):
        if field in taxonomy and not is_non_empty_string(taxonomy.get(field)):
            errors.append(f"{path.name}: taxonomy {field} must be a non-empty string")
    for field in ("modelId", "familyId"):
        value = taxonomy.get(field)
        if is_non_empty_string(value) and not TAXONOMY_ID_PATTERN.fullmatch(value):
            errors.append(f"{path.name}: taxonomy {field} must be a lowercase kebab-case id")
    if taxonomy.get("role") not in SUPPORTED_TAXONOMY_ROLES:
        errors.append(f"{path.name}: taxonomy has unsupported role")
    difficulty = taxonomy.get("difficulty")
    if isinstance(difficulty, bool) or not isinstance(difficulty, int) or not 1 <= difficulty <= 5:
        errors.append(f"{path.name}: taxonomy difficulty must be an integer from 1 to 5")
    if taxonomy.get("variantLevel") not in SUPPORTED_VARIANT_LEVELS:
        errors.append(f"{path.name}: taxonomy has unsupported variantLevel")
    for field, minimum in (("skills", 2), ("prerequisites", 1)):
        values = taxonomy.get(field)
        if (
            not isinstance(values, list)
            or len(values) < minimum
            or not all(is_non_empty_string(value) for value in values)
        ):
            errors.append(
                f"{path.name}: taxonomy {field} must contain at least {minimum} non-empty string(s)"
            )
        elif len(values) != len(set(values)):
            errors.append(f"{path.name}: taxonomy {field} must not contain duplicates")
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
    errors.extend(validate_exam_connections(path, problem))
    errors.extend(validate_taxonomy(path, problem))
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
    taxonomy_models = {}
    taxonomy_families = {}
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
        taxonomy = problem.get("taxonomy")
        if isinstance(taxonomy, dict):
            model_id = taxonomy.get("modelId")
            model_signature = (taxonomy.get("modelName"), taxonomy.get("module"))
            if model_id in taxonomy_models and taxonomy_models[model_id] != model_signature:
                all_errors.append(f"{file_name}: taxonomy modelId {model_id} has inconsistent naming")
            else:
                taxonomy_models[model_id] = model_signature
            family_id = taxonomy.get("familyId")
            family_signature = (model_id, taxonomy.get("familyName"))
            if family_id in taxonomy_families and taxonomy_families[family_id] != family_signature:
                all_errors.append(f"{file_name}: taxonomy familyId {family_id} has inconsistent ownership")
            else:
                taxonomy_families[family_id] = family_signature
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
    print(f"Taxonomy: {len(taxonomy_models)} model(s), {len(taxonomy_families)} family/families")
    if hidden_index_entries:
        print(f"Index-only historical problems retained: {len(hidden_index_entries)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
