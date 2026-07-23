#!/usr/bin/env python3
"""Server-rendered model map and problem-family progression pages."""

from collections import Counter
from html import escape
from urllib.parse import quote


ROLE_ORDER = {
    "概念辨析": 0,
    "母题": 1,
    "基础变式": 2,
    "条件变式": 3,
    "综合题": 4,
    "高考真题": 5,
    "竞赛拓展": 6,
}


def problem_taxonomy(problem):
    taxonomy = problem.get("taxonomy")
    return taxonomy if isinstance(taxonomy, dict) else None


def model_system_path(model_id=""):
    if not model_id:
        return "/models/"
    return f"/models/{quote(model_id, safe='')}"


def group_model_catalog(catalog):
    models = {}
    for position, (problem_id, problem) in enumerate(catalog):
        taxonomy = problem_taxonomy(problem)
        if not taxonomy:
            continue
        model_id = taxonomy.get("modelId")
        family_id = taxonomy.get("familyId")
        if not isinstance(model_id, str) or not model_id or not isinstance(family_id, str) or not family_id:
            continue
        model = models.setdefault(
            model_id,
            {
                "id": model_id,
                "name": taxonomy.get("modelName") or model_id,
                "module": taxonomy.get("module") or "物理",
                "topics": [],
                "knowledge": Counter(),
                "chapters": [],
                "families": {},
                "firstPosition": position,
            },
        )
        topic = taxonomy.get("topic")
        chapter = problem.get("chapter") or "未分类"
        if topic and topic not in model["topics"]:
            model["topics"].append(topic)
        if chapter not in model["chapters"]:
            model["chapters"].append(chapter)
        model["knowledge"].update(str(item) for item in problem.get("knowledge", []) if item)
        family = model["families"].setdefault(
            family_id,
            {
                "id": family_id,
                "name": taxonomy.get("familyName") or family_id,
                "items": [],
                "firstPosition": position,
            },
        )
        family["items"].append(
            {
                "id": problem_id,
                "problem": problem,
                "taxonomy": taxonomy,
                "position": position,
            }
        )
    for model in models.values():
        for family in model["families"].values():
            family["items"].sort(
                key=lambda item: (
                    ROLE_ORDER.get(item["taxonomy"].get("role"), 99),
                    item["taxonomy"].get("difficulty", 99),
                    item["position"],
                )
            )
    return models


def model_system_styles():
    return """
    :root{--ink:#1f2933;--muted:#64707d;--paper:#fff;--page:#eef1f4;--line:#d9dfe5;--accent:#9d2f2f;--blue:#235b8f;--soft:#f5f7f9}
    *{box-sizing:border-box}body{margin:0;background:var(--page);color:var(--ink);font-family:"Noto Sans SC","Microsoft YaHei",sans-serif;line-height:1.7}
    a{color:inherit}.system-shell{width:min(1180px,calc(100% - 28px));margin:20px auto 60px}
    .system-nav{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px;padding:13px 16px;background:var(--paper);border:1px solid var(--line);border-radius:8px}
    .brand{font-size:1.05rem;font-weight:850;text-decoration:none}.nav-links{display:flex;flex-wrap:wrap;gap:8px}.nav-links a{padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--muted);font-size:.88rem;font-weight:700;text-decoration:none}.nav-links a:hover{border-color:var(--accent);color:var(--accent)}
    header{background:var(--paper);border:1px solid var(--line);border-top:5px solid var(--accent);border-radius:8px;padding:clamp(24px,4vw,46px)}
    .eyebrow{color:var(--accent);font-size:.78rem;font-weight:850;letter-spacing:.12em}h1{margin:.25em 0 .35em;font-size:clamp(1.9rem,4vw,3.2rem);line-height:1.2;letter-spacing:0}header p{max-width:800px;margin:.5em 0;color:var(--muted)}
    .stats{display:flex;flex-wrap:wrap;gap:9px;margin-top:22px}.stat{min-width:112px;padding:9px 12px;background:var(--soft);border:1px solid var(--line);border-radius:6px}.stat strong{display:block;font-size:1.15rem}.stat span{color:var(--muted);font-size:.78rem}
    .model-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:14px;margin-top:16px}.model-card,.family-section{background:var(--paper);border:1px solid var(--line);border-radius:8px}
    .model-card{padding:20px}.model-card h2{margin:0 0 4px;font-size:1.2rem}.model-card h2 a{text-decoration:none}.model-card h2 a:hover{color:var(--accent)}.model-meta{color:var(--muted);font-size:.84rem}
    .tag-row{display:flex;flex-wrap:wrap;gap:6px;margin-top:13px}.tag{display:inline-flex;align-items:center;padding:3px 8px;border:1px solid #cfd7df;border-radius:999px;background:#f8fafb;color:#4d5a66;font-size:.76rem}
    .family-links{display:grid;gap:6px;margin-top:15px}.family-links a{display:flex;justify-content:space-between;gap:12px;padding:8px 10px;background:var(--soft);border-left:3px solid var(--blue);text-decoration:none;font-size:.86rem;font-weight:700}.family-links span{color:var(--muted);font-weight:600}
    .model-summary{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;color:var(--muted);font-size:.86rem}.model-summary span{padding-right:9px;border-right:1px solid var(--line)}.model-summary span:last-child{border-right:0}
    .family-list{display:grid;gap:16px;margin-top:16px}.family-section{padding:22px;scroll-margin-top:20px}.family-heading{display:flex;justify-content:space-between;align-items:start;gap:14px;border-bottom:1px solid var(--line);padding-bottom:13px}.family-heading h2{margin:0;font-size:1.3rem}.family-heading p{margin:3px 0 0;color:var(--muted);font-size:.86rem}
    .progression{list-style:none;margin:18px 0 0;padding:0;display:grid;gap:11px}.problem-step{position:relative;padding:16px 16px 16px 22px;border:1px solid var(--line);border-left:5px solid var(--blue);border-radius:7px;background:#fff}.problem-step:before{content:"";position:absolute;left:-10px;top:23px;width:7px;height:7px;border:4px solid var(--page);border-radius:50%;background:var(--blue)}
    .problem-topline{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.problem-title{font-size:1rem;font-weight:800}.badges{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:5px}.badge{padding:2px 7px;border-radius:999px;background:#edf3f8;color:#315b7a;font-size:.72rem;font-weight:800;white-space:nowrap}.badge.role{background:#f8ecea;color:#8a3026}.badge.level{background:#eef5ed;color:#3f7046}
    .problem-meta{margin-top:7px;color:var(--muted);font-size:.82rem}.problem-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.problem-actions a{padding:6px 10px;border-radius:5px;background:var(--ink);color:#fff;font-size:.8rem;font-weight:750;text-decoration:none}.problem-actions a.secondary{border:1px solid var(--line);background:#fff;color:var(--ink)}
    .connections{margin:12px 0 0;padding:10px 12px;background:#faf7f2;border-left:3px solid #b2742c;color:#5c5145;font-size:.8rem}.connections strong{color:#7b4c16}
    .empty{margin-top:16px;padding:30px;background:var(--paper);border:1px solid var(--line);border-radius:8px;color:var(--muted)}
    @media(max-width:720px){.system-nav,.family-heading,.problem-topline{align-items:stretch;flex-direction:column}.badges{justify-content:flex-start}.model-grid{grid-template-columns:1fr}.family-section{padding:17px}}
    """


def render_shell(title, eyebrow, intro, body, stats):
    stats_html = "".join(
        f'<div class="stat"><strong>{escape(str(value))}</strong><span>{escape(label)}</span></div>'
        for value, label in stats
    )
    return f"""<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)}｜FanPhysics 模型体系</title><style>{model_system_styles()}</style></head>
<body><div class="system-shell"><nav class="system-nav"><a class="brand" href="/models/">FanPhysics 模型体系</a>
<div class="nav-links"><a href="/classical-mechanics-demo.html">动态模型库</a><a href="/notebooklm/">NotebookLM 课例</a></div></nav>
<header><div class="eyebrow">{escape(eyebrow)}</div><h1>{escape(title)}</h1><p>{escape(intro)}</p>
<div class="stats">{stats_html}</div></header>{body}</div></body></html>"""


def render_model_system_index(catalog):
    models = group_model_catalog(catalog)
    classified_count = sum(
        len(family["items"])
        for model in models.values()
        for family in model["families"].values()
    )
    family_count = sum(len(model["families"]) for model in models.values())
    cards = []
    for model in sorted(models.values(), key=lambda item: item["firstPosition"]):
        model_id = model["id"]
        family_links = []
        for family in sorted(model["families"].values(), key=lambda item: item["firstPosition"]):
            family_links.append(
                f'<a href="{model_system_path(model_id)}#family-{escape(family["id"], quote=True)}">'
                f'{escape(family["name"])}<span>{len(family["items"])} 题</span></a>'
            )
        knowledge = [item for item, _ in model["knowledge"].most_common(6)]
        tags = "".join(f'<span class="tag">{escape(item)}</span>' for item in knowledge)
        problem_count = sum(len(family["items"]) for family in model["families"].values())
        cards.append(
            '<section class="model-card">'
            f'<h2><a href="{model_system_path(model_id)}">{escape(model["name"])}</a></h2>'
            f'<div class="model-meta">{escape(" / ".join(model["topics"]))} · {problem_count} 道题 · '
            f'{len(model["families"])} 个题族</div><div class="tag-row">{tags}</div>'
            f'<div class="family-links">{"".join(family_links)}</div></section>'
        )
    body = (
        f'<main class="model-grid">{"".join(cards)}</main>'
        if cards
        else '<main class="empty">目前还没有完成分类的题目。</main>'
    )
    return render_shell(
        "物理模型图谱",
        "KNOWLEDGE · MODEL · PROBLEM FAMILY",
        "同一道题同时连接知识点、物理模型、题族层级和能力训练。课程目录回答学到哪里，模型图谱回答这些题之间为什么相通。",
        body,
        [
            (classified_count, "已分类题目"),
            (len(models), "物理模型"),
            (family_count, "题族"),
        ],
    )


def render_model_system_detail(model_id, catalog):
    model = group_model_catalog(catalog).get(model_id)
    if not model:
        return None
    family_sections = []
    exam_count = 0
    difficulty_values = []
    for family in sorted(model["families"].values(), key=lambda item: item["firstPosition"]):
        problem_items = []
        for item in family["items"]:
            problem = item["problem"]
            taxonomy = item["taxonomy"]
            difficulty = taxonomy.get("difficulty", 0)
            difficulty_values.append(difficulty)
            connections = problem.get("examConnections")
            connections = connections if isinstance(connections, list) else []
            exam_count += len(connections)
            connection_html = ""
            if connections:
                labels = "；".join(
                    f'{connection.get("source", "真题")} {connection.get("number", "")}'.strip()
                    for connection in connections[:3]
                )
                connection_html = f'<p class="connections"><strong>真题连接：</strong>{escape(labels)}</p>'
            skills = taxonomy.get("skills") if isinstance(taxonomy.get("skills"), list) else []
            prerequisites = taxonomy.get("prerequisites") if isinstance(taxonomy.get("prerequisites"), list) else []
            skill_text = "、".join(str(value) for value in skills)
            prerequisite_text = "、".join(str(value) for value in prerequisites)
            problem_items.append(
                '<li class="problem-step">'
                '<div class="problem-topline">'
                f'<div><div class="problem-title">{escape(problem.get("title") or item["id"])}</div>'
                f'<div class="problem-meta">章节：{escape(problem.get("chapter") or "未分类")} · '
                f'训练：{escape(skill_text)}<br>前置：{escape(prerequisite_text)}</div></div>'
                '<div class="badges">'
                f'<span class="badge role">{escape(taxonomy.get("role") or "未标记")}</span>'
                f'<span class="badge level">{escape(taxonomy.get("variantLevel") or "")}</span>'
                f'<span class="badge">难度 {escape(str(difficulty))}/5</span></div></div>'
                f'{connection_html}<div class="problem-actions">'
                f'<a href="/classical-mechanics-demo.html?scene={quote(item["id"], safe="")}">打开动画题目</a>'
                f'<a class="secondary" href="/notebooklm/{quote(item["id"], safe="")}">阅读完整讲义</a>'
                '</div></li>'
            )
        family_sections.append(
            f'<section class="family-section" id="family-{escape(family["id"], quote=True)}">'
            '<div class="family-heading"><div>'
            f'<h2>{escape(family["name"])}</h2><p>按概念、母题、变式和综合应用自动排序</p>'
            f'</div><span class="tag">{len(family["items"])} 道题</span></div>'
            f'<ol class="progression">{"".join(problem_items)}</ol></section>'
        )
    problem_count = sum(len(family["items"]) for family in model["families"].values())
    average_difficulty = (
        f"{sum(difficulty_values) / len(difficulty_values):.1f}/5"
        if difficulty_values
        else "未标记"
    )
    body = (
        '<div class="model-summary">'
        f'<span>章节：{escape("、".join(model["chapters"]))}</span>'
        f'<span>主题：{escape("、".join(model["topics"]))}</span>'
        f'<span>核心知识：{escape("、".join(item for item, _ in model["knowledge"].most_common(8)))}</span>'
        f'</div><main class="family-list">{"".join(family_sections)}</main>'
    )
    return render_shell(
        model["name"],
        f'{model["module"]} · MODEL FAMILY',
        "从母题理解结构，再沿条件变化和综合应用逐步迁移。难度不是做题顺序的唯一依据，题族中的结构关系更重要。",
        body,
        [
            (problem_count, "题目"),
            (len(model["families"]), "题族"),
            (average_difficulty, "平均难度"),
            (exam_count, "真题连接"),
        ],
    )
