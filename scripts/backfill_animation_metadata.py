#!/usr/bin/env python3
"""Persist animation metadata for legacy JSON problems that still use `none`."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROBLEM_DIR = ROOT / "data" / "problems"


def slider(label, value, minimum, maximum, step, unit=""):
    return {
        "label": label,
        "value": value,
        "min": minimum,
        "max": maximum,
        "step": step,
        "unit": unit,
    }


def circular_animation(variant, notes, params):
    return {
        "enabled": True,
        "level": "animated",
        "type": "circular_concept",
        "variant": variant,
        "playable": True,
        "interactive": True,
        "notes": notes,
        "params": params,
        "timeline": {"duration": 6, "loop": False},
    }


def infer_circular(problem):
    text = " ".join(
        str(value)
        for value in (
            problem.get("id"),
            problem.get("model"),
            problem.get("title"),
            problem.get("question"),
            " ".join(problem.get("knowledge", [])),
        )
        if value
    )
    if re.search(r"子弹|纸筒|圆筒|弹孔|bullet", text, re.I):
        return {
            "enabled": True,
            "level": "animated",
            "type": "bullet_cylinder",
            "variant": "bullet_cylinder",
            "playable": True,
            "interactive": True,
            "notes": "用同一时间连接子弹直线运动与圆筒转角。",
            "params": {
                "d": slider("圆筒直径", 0.30, 0.10, 1.00, 0.01, "m"),
                "omega": slider("角速度", 6.0, 1.0, 12.0, 0.1, "rad/s"),
                "phi": slider("弹孔夹角", 60, 10, 160, 1, "deg"),
            },
            "timeline": {"duration": 1, "loop": False},
        }
    if re.search(r"飞镖|击中|转盘游戏", text):
        return circular_animation(
            "dart_disk",
            "飞镖飞行时间与圆盘转角条件同步。",
            {
                "omega": slider("圆盘角速度", 3.14, 0.5, 8, 0.01, "rad/s"),
                "radius": slider("圆盘半径", 1.0, 0.4, 2.0, 0.1, "m"),
                "flight": slider("飞行时间", 1.0, 0.4, 2.5, 0.05, "s"),
            },
        )
    if re.search(r"皮带|齿轮|传动|链轮|飞轮|自行车|gear|belt|pulley", text, re.I):
        return circular_animation(
            "transmission",
            "同轴点角速度相同，皮带或啮合处线速度相同。",
            {
                "omega": slider("主动轮角速度", 2.4, 0.5, 6, 0.1, "rad/s"),
                "ratio": slider("半径比", 2.0, 1.0, 5.0, 0.1),
            },
        )
    if re.search(r"蛋糕|奶油|泼水|水珠|圆盘点|圆盘绕中心", text):
        return circular_animation(
            "rotating_disk",
            "圆盘转动时速度沿切线，向心加速度指向圆心。",
            {
                "omega": slider("角速度", 1.57, 0.3, 5, 0.01, "rad/s"),
                "radius": slider("半径", 1.0, 0.3, 2.0, 0.1, "m"),
            },
        )
    if re.search(r"圆锥摆|飞椅|漏斗|圆锥面|同高|双绳|转盘连接小球|水平圆周运动", text):
        variant = "funnel_balls" if "漏斗" in text else (
            "rope_cone_limit" if re.search(r"双绳|圆锥面", text) else "conical_pendulum"
        )
        return circular_animation(
            variant,
            "重力与约束力的合力提供水平向心力。",
            {
                "theta": slider("夹角", 37, 10, 65, 1, "deg"),
                "radius": slider("半径", 1.0, 0.3, 2.0, 0.1, "m"),
                "g": slider("重力加速度", 10, 5, 15, 0.1, "m/s²"),
            },
        )
    if re.search(r"碰钉|突然停止|绕钉|拉力图像|竖直平面|竖直圆周|打夯机", text):
        return circular_animation(
            "vertical_circle",
            "同步显示竖直圆周位置、速度与径向受力。",
            {
                "omega": slider("角速度", 2.8, 0.5, 7, 0.1, "rad/s"),
                "radius": slider("半径", 1.0, 0.3, 2.0, 0.1, "m"),
                "g": slider("重力加速度", 10, 5, 15, 0.1, "m/s²"),
            },
        )
    if re.search(r"摩擦|临界|侧滑|转台|木块|滑动", text):
        return circular_animation(
            "friction_limit",
            "比较所需向心力与最大静摩擦力，显示临界滑动。",
            {
                "omega": slider("角速度", 2.0, 0.5, 6.0, 0.1, "rad/s"),
                "mu": slider("摩擦因数", 0.40, 0.10, 1.00, 0.01),
                "radius": slider("半径", 1.0, 0.3, 2.0, 0.1, "m"),
            },
        )
    if re.search(r"双人|溜冰|弹簧秤|面对面", text):
        return circular_animation(
            "two_body_orbit",
            "内力相等、角速度相同，半径按质量反比分配。",
            {
                "omega": slider("角速度", 0.62, 0.2, 2.0, 0.01, "rad/s"),
                "massRatio": slider("质量比", 2.0, 0.5, 4.0, 0.1),
            },
        )
    return circular_animation(
        "uniform_circle",
        "速度沿切线，向心加速度指向圆心。",
        {
            "omega": slider("角速度", 2.4, 0.5, 6, 0.1, "rad/s"),
            "radius": slider("半径", 1.0, 0.3, 2.0, 0.1, "m"),
        },
    )


FOUNDATION_VARIANTS = {
    "mechanics_spring_length_maximization": "spring_arrangement",
    "mechanics_magnetic_box_static": "magnetic_box",
    "mechanics_brush_pen_equilibrium": "brush_pen",
    "mechanics_spring_balance_reading": "spring_balance_reading",
    "mechanics_elastic_force_direction": "elastic_direction",
    "mechanics_incline_suspended_ball": "incline_suspended_ball",
    "mechanics_two_body_spring_equilibrium": "two_body_spring",
    "mechanics_desk_deformation_experiment": "desk_deformation",
    "mechanics_tightrope_center_of_gravity": "tightrope",
    "mechanics_series_spring_equivalent_k": "series_springs",
    "mechanics_spring_displacement": "spring_displacement",
    "mechanics_three_stacked_bodies": "stacked_bodies",
    "mechanics_ball_wall_incline": "ball_wall_incline",
    "mechanics_force_experiment_methods": "experiment_methods",
}


def infer_foundation(problem):
    variant = FOUNDATION_VARIANTS.get(problem.get("id"))
    if not variant:
        return None
    return {
        "enabled": True,
        "level": "animated",
        "type": "foundation_mechanics_model",
        "variant": variant,
        "playable": True,
        "interactive": True,
        "notes": "按本题装置显示受力、形变或实验放大过程，右侧图表同步显示控制关系。",
        "params": {
            "load": slider("载荷系数", 1.0, 0.2, 2.0, 0.1),
            "angle": slider("装置角度", 35, 10, 65, 1, "deg"),
            "stiffness": slider("相对劲度", 1.0, 0.4, 2.0, 0.1),
        },
        "timeline": {"duration": 6, "loop": False},
    }


def infer_animation(problem):
    animation = problem.get("animation", {})
    if animation.get("enabled") is True and animation.get("type") not in {None, "none"}:
        return None
    if problem.get("chapter") == "圆周运动":
        return infer_circular(problem)
    if problem.get("chapter") == "力学基础":
        return infer_foundation(problem)
    return None


def render_json(problem):
    return json.dumps(problem, ensure_ascii=False, indent=2) + "\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()
    pending = []
    for path in sorted(PROBLEM_DIR.glob("*.json")):
        if path.name == "index.json":
            continue
        problem = json.loads(path.read_text(encoding="utf-8"))
        animation = infer_animation(problem)
        if animation is None:
            continue
        pending.append(path)
        if args.write:
            problem["animation"] = animation
            path.write_text(render_json(problem), encoding="utf-8")
    action = "updated" if args.write else "pending"
    print(f"{len(pending)} animation metadata file(s) {action}")
    if pending and not args.write:
        for path in pending:
            print(f"  {path.relative_to(ROOT)}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
