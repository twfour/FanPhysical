#!/usr/bin/env python3
"""Import one-page-per-problem scans from 物理学难题集萃（力学）.

The importer keeps the original printed page as the source of truth, adds OCR
text for searchability, and creates one JSON-backed FanPhysics page per scan.
"""

import argparse
import concurrent.futures
import html
import json
import re
import subprocess
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PROBLEM_DIR = ROOT / "data" / "problems"
IMAGE_DIR = ROOT / "assets" / "sources" / "mechanics-challenge"
INDEX_PATH = PROBLEM_DIR / "index.json"
HTML_PATH = ROOT / "classical-mechanics-demo.html"
CHAPTER_GUIDES_PATH = ROOT / "data" / "chapter-guides.json"
START_MARKER = "<!-- mechanics-challenge:start -->"
END_MARKER = "<!-- mechanics-challenge:end -->"
BLANK_PDF_PAGES = {113, 143, 162, 168, 171, 178}
CURATED_PROBLEM_IDS = {
    f"mechanics_challenge_page_{page:03d}"
    for page in range(4, 19)
}

CHAPTERS = [
    ("运动学", "kinematics", "运动学关系", "particle-motion", "质点运动与约束", ["运动分解", "边界条件"], ["位移、速度与加速度"]),
    ("牛顿运动定律", "newton", "牛顿运动定律", "force-motion", "受力与运动状态", ["受力分析", "动力学方程"], ["牛顿第二定律"]),
    ("功、能和动量", "energy", "功、能和动量", "energy-momentum", "守恒量与过程连接", ["过程分段", "守恒定律"], ["功和能", "动量"]),
    ("角动量、有心运动", "angular", "角动量与有心运动", "angular-momentum", "转动守恒与有心力", ["角动量判断", "径向关系"], ["圆周运动", "动量"]),
    ("静力平衡", "statics", "静力平衡", "static-equilibrium", "力与力矩平衡", ["隔离受力", "力矩平衡"], ["受力平衡"]),
    ("刚体动力学", "rigid", "刚体动力学", "rigid-body", "平动与转动耦合", ["质心运动", "转动方程"], ["牛顿第二定律", "力矩"]),
    ("振动与波动", "oscillation", "振动与波动", "oscillation-wave", "振动系统与波传播", ["平衡位置", "周期与相位"], ["简谐运动"]),
]


def clean_ocr(text):
    text = text.replace("\x0c", "").replace("|", "I")
    lines = [re.sub(r"\s+", " ", line).strip() for line in text.splitlines()]
    lines = [line for line in lines if line and not re.search(r"物理学.*难题集萃|第一部分|^\d{1,3}$", line)]
    return "\n".join(lines).strip()


def infer_chapter(text, previous):
    compact = text.replace(" ", "")
    aliases = {
        "运动学": "运动学",
        "牛顿运动定律": "牛顿运动定律",
        "功、能和动量": "功、能和动量",
        "功能和动量": "功、能和动量",
        "角动量、有心运动": "角动量、有心运动",
        "角动量有心运动": "角动量、有心运动",
        "静力平衡": "静力平衡",
        "刚体动力学": "刚体动力学",
        "振动与波动": "振动与波动",
    }
    for needle, chapter in aliases.items():
        if needle in compact:
            return chapter
    return previous


def problem_number(text, fallback):
    match = re.search(r"[【\[]?\s*题\s*(\d{1,3})\s*[】\]]?", text)
    return int(match.group(1)) if match else fallback


def problem_title(text, number):
    compact = re.sub(r"\s+", " ", text)
    match = re.search(r"(?:【|\[)?题\s*%d(?:】|\])?\s*(.{5,44}?)(?:。|，|,|试|求|如图)" % number, compact)
    if match:
        title = re.sub(r"[：:；;。]+$", "", match.group(1)).strip()
        if title:
            return title[:28]
    return "竞赛力学问题"


def chapter_meta(name):
    for item in CHAPTERS:
        if item[0] == name:
            return item
    return CHAPTERS[0]


def chapter_for_printed_page(printed_page):
    boundaries = [
        (131, "振动与波动"),
        (104, "刚体动力学"),
        (92, "静力平衡"),
        (76, "角动量、有心运动"),
        (37, "功、能和动量"),
        (17, "牛顿运动定律"),
        (2, "运动学"),
    ]
    for start, chapter in boundaries:
        if printed_page >= start:
            return chapter
    return "运动学"


def render_and_ocr(document_path, page_index):
    page_number = page_index + 1
    output = IMAGE_DIR / f"page-{page_number:03d}.webp"
    if not output.exists():
        document = pdfium.PdfDocument(str(document_path))
        page = document[page_index]
        image = page.render(scale=1.7).to_pil().convert("RGB")
        image.save(output, "WEBP", quality=88, method=5)
    else:
        Image.open(output).close()
    result = subprocess.run(
        ["tesseract", str(output), "stdout", "-l", "chi_sim+eng", "--psm", "6"],
        check=False,
        capture_output=True,
        text=True,
    )
    return page_index, clean_ocr(result.stdout)


def make_problem(page_index, text, chapter, number, title):
    chapter_name, variant, topic, family_id, family_name, skills, prerequisites = chapter_meta(chapter)
    page_number = page_index + 1
    problem_id = f"mechanics_challenge_page_{page_number:03d}"
    source_text = text or "本页题面请以所附原书扫描页为准。"
    return {
        "id": problem_id,
        "originalNumber": f"题{number}",
        "chapter": chapter_name,
        "title": f"第{number}题：{title}",
        "taxonomy": {
            "module": "力学竞赛",
            "topic": topic,
            "modelId": family_id,
            "modelName": family_name,
            "familyId": family_id,
            "familyName": family_name,
            "role": "竞赛拓展",
            "difficulty": 5,
            "variantLevel": "L3",
            "skills": skills,
            "prerequisites": prerequisites,
        },
        "question": source_text,
        "images": [{
            "src": f"assets/sources/mechanics-challenge/page-{page_number:03d}.webp",
            "alt": f"《物理学难题集萃（力学）》{chapter_name}第{number}题原页",
            "caption": f"原书第{page_number - 2}页；题面与图示以此印刷页为准。",
        }],
        "animation": {
            "enabled": True,
            "level": "animated",
            "type": "mechanics_challenge_model",
            "variant": variant,
            "playable": True,
            "interactive": True,
            "notes": f"以{family_name}的通用状态量展示本题所属模型；原题细节以题面图示为准。",
            "params": {
                "amplitude": {"label": "状态尺度", "value": 1, "min": 0.5, "max": 2, "step": 0.1, "unit": "倍"},
                "rate": {"label": "演化速率", "value": 1, "min": 0.4, "max": 2, "step": 0.1, "unit": "倍"},
            },
            "timeline": {"duration": 6, "loop": False},
        },
        "knowledge": [topic, family_name],
        "steps": [
            {
                "stepId": 1,
                "title": "条件提取",
                "content": "先依据原题图逐一标出研究对象、参考系、几何约束、初末状态与待求量；OCR 仅用于检索，公式和图中标注以原页为准。",
                "knowledge": ["读图", "条件整理"],
                "commonMistakes": ["忽略图示中的方向、接触或几何约束"],
            },
            {
                "stepId": 2,
                "title": "建模",
                "content": f"本题归入“{family_name}”。先写出该题族的基本关系，再判断是否需要分段、选取守恒量或增加约束方程。",
                "knowledge": skills,
                "commonMistakes": ["看到熟悉物体便直接套公式，没有检查模型前提"],
            },
            {
                "stepId": 3,
                "title": "验证",
                "content": "完成推导后检查量纲、极限情形、方向符号和题设边界。原书未附本页答案，因此本导入页不虚构最终数值结论。",
                "knowledge": ["量纲检查", "极限检验"],
                "commonMistakes": [],
            },
        ],
        "practice": {
            "title": "近似题：同模型参数迁移",
            "question": "保持原题物理结构不变，只改变一个关键参数。先预测结果的变化方向，再重新列出控制方程，并说明哪些关系保持不变。",
            "answer": "答案取决于所选参数。合格答案应包含：变化前后的控制方程、模型不变量、重新计算的量以及边界条件检查。",
            "thinking": f"先识别“{family_name}”中的不变量，再区分参数变化引起的数值变化与模型结构变化。",
            "difficulty": "equal-or-higher",
            "upgradeType": "same-concept-parameter-critical",
        },
        "analysisPresentation": {
            "collapseEachStep": False if chapter == "运动学" else True,
            "defaultExpanded": chapter == "运动学",
            "hideStepConversation": chapter == "运动学",
        },
        "presentation": {"coreOnly": True} if chapter == "运动学" else {},
    }


def make_sidebar(groups):
    lines = [START_MARKER, '<details class="tree-node">', '  <summary class="tree-subfolder">力学难题集萃</summary>', '  <div class="tree-children">']
    for chapter, problems in groups:
        lines.extend(['    <details class="tree-node">', f'      <summary class="tree-subfolder">{html.escape(chapter)}</summary>', '      <div class="tree-children">'])
        for problem in problems:
            label = f"题{problem['originalNumber'][1:]}-{problem['title'].split('：', 1)[-1]}"
            lines.append(f'        <button class="tree-item indent" data-scene="{problem["id"]}" onclick="switchScene(\'{problem["id"]}\')">{html.escape(label)}</button>')
        lines.extend(['      </div>', '    </details>'])
    lines.extend(['  </div>', '</details>', END_MARKER])
    return "\n".join(lines)


def update_index(problems):
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    index["problems"] = [item for item in index["problems"] if not item["id"].startswith("mechanics_challenge_")]
    index["problems"].extend({"id": item["id"], "file": item["id"] + ".json"} for item in problems)
    INDEX_PATH.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def update_chapter_guides():
    data = json.loads(CHAPTER_GUIDES_PATH.read_text(encoding="utf-8"))
    guides = data.setdefault("chapters", {})
    guide_content = {
        "运动学": ("从轨迹、速度和加速度关系出发，处理约束运动、抛体与变力运动方程。", "\\[\\vec v=\\frac{d\\vec r}{dt},\\qquad \\vec a=\\frac{d\\vec v}{dt}\\]"),
        "牛顿运动定律": ("以受力图和参考系为核心，建立单体、多体及非惯性系中的动力学关系。", "\\[\\sum\\vec F=m\\vec a\\]"),
        "功、能和动量": ("选择合适系统和过程边界，用功能关系、冲量与动量守恒连接状态。", "\\[W_{合}=\\Delta E_k,\\qquad \\vec I=\\Delta\\vec p\\]"),
        "角动量、有心运动": ("围绕力矩、角动量和径向运动，研究碰撞、轨道与有心力系统。", "\\[\\vec\\tau=\\frac{d\\vec L}{dt}\\]"),
        "静力平衡": ("对连续体、绳链和组合结构同时检查合力平衡与合力矩平衡。", "\\[\\sum\\vec F=0,\\qquad \\sum\\tau=0\\]"),
        "刚体动力学": ("把质心平动与绕质心转动联立，结合滚动约束和能量关系。", "\\[\\sum\\vec F=M\\vec a_C,\\qquad \\sum\\tau_C=I_C\\alpha\\]"),
        "振动与波动": ("从平衡位置、回复力与相位出发，研究多自由度振动和波的传播。", "\\[\\ddot x+\\omega^2x=0\\]"),
    }
    for chapter, (overview, formula) in guide_content.items():
        guides[chapter] = {
            "overview": overview,
            "laws": [
                "先明确研究对象、参考系、约束和过程边界，再选择方程。",
                "竞赛题应在求解后进行量纲、方向、极限与临界条件检查。",
            ],
            "formulas": [{"title": "章节主关系", "latex": formula, "note": "具体题目还需结合原题约束补充方程。"}],
        }
    CHAPTER_GUIDES_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def update_html(fragment):
    source = HTML_PATH.read_text(encoding="utf-8")
    if START_MARKER in source and END_MARKER in source:
        source = re.sub(re.escape(START_MARKER) + r"[\s\S]*?" + re.escape(END_MARKER), fragment, source)
    else:
        anchor = '<details class="tree-node">\n              <summary class="tree-subfolder">2026暑假班</summary>'
        if anchor not in source:
            raise RuntimeError("2026暑假班 sidebar anchor not found")
        source = source.replace(anchor, fragment + "\n            " + anchor, 1)
    HTML_PATH.write_text(source, encoding="utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--workers", type=int, default=6)
    args = parser.parse_args()
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    document = pdfium.PdfDocument(str(args.pdf))
    page_indexes = [page for page in range(3, len(document)) if page + 1 not in BLANK_PDF_PAGES]
    cached_text = {}
    for existing_path in PROBLEM_DIR.glob("mechanics_challenge_page_*.json"):
        try:
            existing = json.loads(existing_path.read_text(encoding="utf-8"))
            match = re.search(r"page_(\d{3})$", str(existing.get("id", "")))
            pdf_page = int(match.group(1)) if match else 0
            if pdf_page:
                cached_text[pdf_page - 1] = existing.get("question", "")
        except (ValueError, json.JSONDecodeError):
            pass
    for stale_path in PROBLEM_DIR.glob("mechanics_challenge_*.json"):
        if stale_path.stem not in CURATED_PROBLEM_IDS:
            stale_path.unlink()
    missing_indexes = [page for page in page_indexes if page not in cached_text]
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        fresh_results = dict(pool.map(lambda page: render_and_ocr(args.pdf, page), missing_indexes))
    results = dict(cached_text)
    results.update(fresh_results)

    problems = []
    groups = []
    current_chapter = CHAPTERS[0][0]
    chapter_problems = []
    fallback_number = 1
    for page_index in page_indexes:
        text = results.get(page_index, "")
        chapter = chapter_for_printed_page(page_index - 1)
        if chapter != current_chapter:
            groups.append((current_chapter, chapter_problems))
            chapter_problems = []
            fallback_number = 1
            current_chapter = chapter
        number = problem_number(text, fallback_number)
        fallback_number = number + 1
        title = problem_title(text, number)
        problem = make_problem(page_index, text, chapter, number, title)
        path = PROBLEM_DIR / f"{problem['id']}.json"
        if problem["id"] in CURATED_PROBLEM_IDS and path.exists():
            problem = json.loads(path.read_text(encoding="utf-8"))
        else:
            path.write_text(json.dumps(problem, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        problems.append(problem)
        chapter_problems.append(problem)
    groups.append((current_chapter, chapter_problems))
    update_index(problems)
    update_chapter_guides()
    update_html(make_sidebar(groups))
    print(json.dumps({"pages": len(problems), "chapters": [(name, len(items)) for name, items in groups]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
