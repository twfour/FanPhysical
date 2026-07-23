#!/usr/bin/env python3
"""Backfill explicit model-family taxonomy into unclassified problem JSON files."""

import argparse
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROBLEM_DIR = ROOT / "data" / "problems"
INDEX_PATH = PROBLEM_DIR / "index.json"

MODELS = {
    "kinematics": "直线运动与追及",
    "force-equilibrium": "受力分析与平衡",
    "elastic-force": "弹簧与弹力",
    "accelerated-frame": "加速参考系与相对运动",
    "curve-kinematics": "曲线运动与矢量分析",
    "river-crossing": "运动合成与小船渡河",
    "projectile-motion": "抛体运动与功率",
    "constraint-system": "连接体与约束",
    "circular-motion": "圆周运动动力学",
    "gravitation": "万有引力与天体参数",
    "orbit-transfer": "卫星轨道与变轨",
    "multi-star-system": "双星与多星系统",
    "work-energy": "功率、动能与功能关系",
    "spring-energy": "弹簧与机械能",
    "track-transition": "轨道临界与抛体衔接",
    "conveyor-energy": "传送带功能关系",
    "collision-energy": "碰撞与能量转化",
}


def family(model_id, name, topic, skills, prerequisites, difficulty):
    return {
        "modelId": model_id,
        "familyName": name,
        "topic": topic,
        "skills": skills,
        "prerequisites": prerequisites,
        "difficulty": difficulty,
    }


FAMILIES = {
    "motion-quantity-concepts": family(
        "kinematics", "运动学基本量辨析", "运动学",
        ["物理量辨析", "单位与参考系判断"], ["时刻与时间", "位移与路程"], 1,
    ),
    "uniform-motion-graphs": family(
        "kinematics", "匀变速运动与图像", "直线运动",
        ["运动图像转换", "制动过程建模"], ["匀变速公式", "平均速度"], 2,
    ),
    "pursuit-braking": family(
        "kinematics", "追及、刹车与安全距离", "直线运动",
        ["分阶段追及", "临界条件识别"], ["匀变速运动", "相对运动"], 3,
    ),
    "vertical-multistage": family(
        "kinematics", "竖直多阶段运动", "直线运动",
        ["过程划分", "方向与符号管理"], ["牛顿第二定律", "匀变速运动"], 3,
    ),
    "same-acceleration-relative": family(
        "kinematics", "同加速度相对运动", "直线运动",
        ["相对运动降维", "相遇条件判断"], ["竖直上抛", "自由落体"], 3,
    ),
    "incline-equal-time": family(
        "kinematics", "斜面运动与等时性", "直线运动",
        ["几何长度建模", "加速度分解"], ["斜面运动", "圆的几何"], 3,
    ),
    "contact-force-equilibrium": family(
        "force-equilibrium", "接触力与静态平衡", "相互作用与平衡",
        ["受力对象选择", "接触力方向判断"], ["重力", "共点力平衡"], 2,
    ),
    "multi-rope-equilibrium": family(
        "force-equilibrium", "多绳多接触平衡", "相互作用与平衡",
        ["整体法与隔离法", "几何约束转化"], ["力的合成", "共点力平衡"], 3,
    ),
    "quasistatic-equilibrium": family(
        "force-equilibrium", "缓慢变化中的动态平衡", "相互作用与平衡",
        ["准静态过程判断", "受力随位置变化分析"], ["共点力平衡", "摩擦力"], 3,
    ),
    "force-experiment-methods": family(
        "force-equilibrium", "力学实验与方法", "实验方法",
        ["实验方法辨析", "微小量放大"], ["弹力产生条件", "力的示意图"], 1,
    ),
    "spring-force-reading": family(
        "elastic-force", "弹簧测力计读数", "弹力",
        ["测力计受力分析", "读数对象判断"], ["胡克定律", "平衡条件"], 2,
    ),
    "spring-series-equilibrium": family(
        "elastic-force", "串联弹簧与连接体平衡", "弹力",
        ["弹簧连接关系建模", "整体与隔离切换"], ["胡克定律", "作用力与反作用力"], 3,
    ),
    "equivalent-gravity": family(
        "accelerated-frame", "等效重力与随体参考系", "牛顿运动定律",
        ["非惯性系建模", "临界状态判断"], ["牛顿第二定律", "共点力平衡"], 4,
    ),
    "friction-relative-motion": family(
        "accelerated-frame", "多物体摩擦与相对运动", "牛顿运动定律",
        ["多对象过程划分", "相对位移计算"], ["静摩擦临界", "牛顿第二定律"], 4,
    ),
    "overweight-force-graph": family(
        "accelerated-frame", "超重失重与力传感器图像", "牛顿运动定律",
        ["力图像读取", "冲量与速度关联"], ["牛顿第二定律", "冲量"], 3,
    ),
    "curve-concepts": family(
        "curve-kinematics", "曲线运动方向与受力", "曲线运动",
        ["速度切线判断", "力与轨迹关系判断"], ["速度矢量", "牛顿第二定律"], 1,
    ),
    "vector-motion-composition": family(
        "curve-kinematics", "二维运动的矢量合成", "曲线运动",
        ["分运动选择", "矢量图像转换"], ["运动独立性", "速度合成"], 3,
    ),
    "relative-velocity": family(
        "curve-kinematics", "参考系与相对速度", "曲线运动",
        ["参考系切换", "速度矢量分解"], ["相对速度", "运动合成"], 3,
    ),
    "river-basic": family(
        "river-crossing", "渡河时间与轨迹", "曲线运动",
        ["垂直河岸分量提取", "相遇条件判断"], ["速度合成", "三角函数"], 2,
    ),
    "river-optimal": family(
        "river-crossing", "最短航程与临界渡河", "曲线运动",
        ["速度圆分析", "极值与临界判断"], ["矢量合成", "最短距离"], 4,
    ),
    "constraint-velocity": family(
        "constraint-system", "绳杆约束速度", "关联速度",
        ["约束方程建立", "速度投影"], ["不可伸长约束", "瞬时速度"], 4,
    ),
    "projectile-basics": family(
        "projectile-motion", "平抛运动基本规律", "平抛运动",
        ["运动分解", "时间与位移反演"], ["匀速直线运动", "自由落体"], 2,
    ),
    "moving-platform-projectile": family(
        "projectile-motion", "运动载体投弹", "平抛运动",
        ["参考系转换", "事件间隔分析"], ["平抛运动", "相对运动"], 3,
    ),
    "projectile-incline": family(
        "projectile-motion", "平抛与斜面相交", "平抛运动",
        ["轨迹几何联立", "末速度方向判断"], ["平抛方程", "斜面几何"], 3,
    ),
    "projectile-circle": family(
        "projectile-motion", "平抛与圆弧相交", "平抛运动",
        ["圆坐标约束", "速度方向反演"], ["平抛方程", "圆的几何"], 4,
    ),
    "projectile-window": family(
        "projectile-motion", "平抛穿越有限区域", "平抛运动",
        ["区间边界判断", "临界初速度求解"], ["平抛方程", "不等式"], 3,
    ),
    "projectile-barrier-target": family(
        "projectile-motion", "越障与靶面命中", "平抛运动",
        ["临界过障判断", "落点反演"], ["平抛轨迹", "速度方向"], 3,
    ),
    "oblique-projectile-target": family(
        "projectile-motion", "斜抛命中与射程", "斜抛运动",
        ["初速度分解", "命中条件联立"], ["斜抛运动", "三角函数"], 4,
    ),
    "projectile-fluid-jet": family(
        "projectile-motion", "液体射流的抛体模型", "平抛运动",
        ["跨模型公式连接", "射程极值分析"], ["平抛运动", "流速公式"], 4,
    ),
    "projectile-bounce": family(
        "projectile-motion", "碰撞反弹后的分段抛体", "平抛运动",
        ["碰撞前后状态连接", "分段轨迹建模"], ["平抛运动", "碰撞反弹"], 4,
    ),
    "circle-projectile-transition": family(
        "projectile-motion", "圆周运动断约束后的抛体", "圆周与抛体",
        ["约束切换判断", "多阶段最值求解"], ["圆周运动", "平抛运动"], 4,
    ),
    "circular-transmission": family(
        "circular-motion", "同轴、皮带与齿轮传动", "圆周运动",
        ["传动约束识别", "角速度线速度换算"], ["周期与角速度", "线速度"], 2,
    ),
    "rotating-target-timing": family(
        "circular-motion", "旋转目标与穿越计时", "圆周运动",
        ["直线与转动时间匹配", "周期性条件判断"], ["匀速圆周运动", "匀速直线运动"], 3,
    ),
    "circular-force": family(
        "circular-motion", "圆周运动受力分解", "圆周运动",
        ["向心方向确定", "径向受力方程"], ["牛顿第二定律", "向心加速度"], 3,
    ),
    "horizontal-circle-critical": family(
        "circular-motion", "水平圆周运动临界", "圆周运动",
        ["静摩擦临界判断", "参数范围求解"], ["向心力", "最大静摩擦力"], 4,
    ),
    "vertical-circle-critical": family(
        "circular-motion", "竖直圆周运动临界", "圆周运动",
        ["最高最低点受力", "不断约束条件判断"], ["机械能守恒", "向心力"], 4,
    ),
    "conical-pendulum": family(
        "circular-motion", "圆锥摆构型与参数", "圆周运动",
        ["空间受力分解", "角速度与几何关联"], ["向心力", "力的合成"], 3,
    ),
    "centrifuge-density": family(
        "circular-motion", "离心现象与密度分层", "圆周运动",
        ["等效重力判断", "现实装置建模"], ["向心加速度", "密度"], 3,
    ),
    "kepler-orbit-law": family(
        "gravitation", "开普勒定律与椭圆轨道", "万有引力",
        ["轨道位置比较", "面积速度推理"], ["开普勒定律", "万有引力"], 3,
    ),
    "shell-gravity-field": family(
        "gravitation", "球壳与均匀球体引力场", "万有引力",
        ["等效叠加", "分区引力判断"], ["万有引力定律", "球壳定理"], 4,
    ),
    "rotation-surface-gravity": family(
        "gravitation", "天体自转与视重临界", "万有引力",
        ["引力与向心力分配", "解体临界判断"], ["表面重力", "圆周运动"], 3,
    ),
    "surface-gravity-throw": family(
        "gravitation", "星球表面重力与竖直运动", "万有引力",
        ["天体参数换算", "局部重力运动建模"], ["万有引力", "竖直运动"], 3,
    ),
    "orbit-parameter-inference": family(
        "gravitation", "观测数据反演天体参数", "万有引力",
        ["多源数据提取", "天体质量密度推导"], ["开普勒第三定律", "圆周运动"], 4,
    ),
    "satellite-comparison": family(
        "gravitation", "卫星类型与轨道参数比较", "卫星运动",
        ["轨道量比较", "模型真假辨析"], ["圆轨道速度", "同步卫星"], 3,
    ),
    "satellite-coverage": family(
        "gravitation", "卫星覆盖、追及与地面轨迹", "卫星运动",
        ["空间几何建模", "相对角速度分析"], ["开普勒第三定律", "圆周运动"], 4,
    ),
    "hohmann-transfer": family(
        "orbit-transfer", "圆轨道与转移椭圆", "卫星变轨",
        ["变轨前后状态比较", "转移时间与相位判断"], ["轨道机械能", "开普勒第三定律"], 4,
    ),
    "elliptic-orbit-energy": family(
        "orbit-transfer", "椭圆轨道速度与能量", "卫星变轨",
        ["近日远日状态比较", "角动量与能量联合"], ["角动量守恒", "轨道机械能"], 4,
    ),
    "multi-star-dynamics": family(
        "multi-star-system", "双星与多星圆周运动", "万有引力",
        ["质心约束分析", "多体引力合成"], ["万有引力", "匀速圆周运动"], 4,
    ),
    "compact-object-critical": family(
        "gravitation", "致密天体逃逸与自转临界", "万有引力",
        ["极限条件建模", "量纲与比例推导"], ["逃逸速度", "向心力"], 5,
    ),
    "constant-force-work": family(
        "work-energy", "恒力做功与过程判断", "功和功率",
        ["功的正负判断", "力位移夹角处理"], ["功的定义", "牛顿第二定律"], 2,
    ),
    "moving-support-work": family(
        "work-energy", "运动接触面对物体做功", "功和功率",
        ["参考系位移判断", "分力做功计算"], ["功的定义", "受力平衡"], 3,
    ),
    "variable-direction-work": family(
        "work-energy", "变方向力做功", "功和功率",
        ["路径微元分析", "几何约束转化"], ["功的定义", "弧长与位移"], 4,
    ),
    "variable-force-work": family(
        "work-energy", "变力做功与图像面积", "功和功率",
        ["力位移图像读取", "面积求功"], ["功的定义", "函数图像"], 3,
    ),
    "power-velocity": family(
        "work-energy", "速度方向与瞬时功率", "功和功率",
        ["瞬时速度确定", "功率正负判断"], ["瞬时功率", "速度分解"], 3,
    ),
    "vehicle-power": family(
        "work-energy", "机车恒功率与分段启动", "功和功率",
        ["牵引力速度关系", "分阶段运动建模"], ["功率公式", "动能定理"], 4,
    ),
    "kinetic-theorem-basic": family(
        "work-energy", "动能定理与力位移图像", "动能定理",
        ["合功表达", "图像斜率读取"], ["功的计算", "动能"], 2,
    ),
    "work-friction-roundtrip": family(
        "work-energy", "往返运动与摩擦耗能", "动能定理",
        ["全过程动能定理", "路程位移区分"], ["摩擦功", "动能定理"], 3,
    ),
    "dissipative-energy-graph": family(
        "work-energy", "阻力作用与能量图像", "功能关系",
        ["能量图像斜率分析", "耗散功反演"], ["机械能变化", "阻力做功"], 4,
    ),
    "friction-system-energy": family(
        "work-energy", "板块系统的摩擦功", "功能关系",
        ["系统与单体能量区分", "相对位移求热量"], ["摩擦做功", "功能关系"], 4,
    ),
    "spring-work-energy": family(
        "spring-energy", "弹簧功与动能变化", "动能定理",
        ["弹簧状态划分", "变力功处理"], ["弹性势能", "动能定理"], 3,
    ),
    "spring-dissipation": family(
        "spring-energy", "弹簧系统与摩擦耗能", "功能关系",
        ["往返状态比较", "弹性势能与热量分配"], ["弹性势能", "摩擦生热"], 4,
    ),
    "conveyor-work": family(
        "conveyor-energy", "传送带摩擦功", "功和功率",
        ["物体与传送带位移区分", "摩擦功计算"], ["摩擦力", "相对运动"], 3,
    ),
    "conveyor-energy-cycle": family(
        "conveyor-energy", "传送带能量与往返过程", "功能关系",
        ["分阶段相对运动", "电功热量动能分配"], ["相对位移", "功能关系"], 4,
    ),
    "cross-conveyor": family(
        "conveyor-energy", "垂直传送带与相对运动", "功能关系",
        ["二维相对运动", "摩擦功与热量分配"], ["动能定理", "相对位移"], 5,
    ),
    "track-energy-projectile": family(
        "track-transition", "轨道、临界与抛体综合", "动能定理",
        ["多过程状态连接", "轨道临界判断"], ["动能定理", "圆周运动", "平抛运动"], 4,
    ),
    "road-power-optimization": family(
        "work-energy", "弯道与功率优化", "功能关系",
        ["几何路径比较", "功率与安全条件联合"], ["圆周运动", "功率"], 4,
    ),
    "collision-composite": family(
        "collision-energy", "碰撞前后的多过程能量", "功能关系",
        ["碰撞前后分段", "动量与能量联合"], ["动量守恒", "动能定理"], 5,
    ),
}


FAMILY_PROBLEMS = {
    "motion-quantity-concepts": """
        spring_test_single_01_marathon
    """.split(),
    "uniform-motion-graphs": """
        spring_test_single_02_grid_slide spring_test_single_15_braking_graph
    """.split(),
    "pursuit-braking": """
        spring_test_solution_16_police_chase threeCar
    """.split(),
    "vertical-multistage": """
        spring_test_solution_17_rocket
    """.split(),
    "same-acceleration-relative": """
        doubleThrow pipeDrop
    """.split(),
    "incline-equal-time": """
        inclineSlot
    """.split(),
    "contact-force-equilibrium": """
        mechanics_three_stacked_bodies mechanics_ball_wall_incline
        mechanics_tightrope_center_of_gravity mechanics_incline_suspended_ball
        mechanics_elastic_force_direction mechanics_magnetic_box_static
        mechanics_brush_pen_equilibrium
    """.split(),
    "multi-rope-equilibrium": """
        spring_test_single_05_light_chain spring_test_single_06_nail_basket
        spring_test_single_07_incline_lift spring_test_single_08_handcart
    """.split(),
    "quasistatic-equilibrium": """
        spring_test_single_04_curved_slope
    """.split(),
    "force-experiment-methods": """
        mechanics_desk_deformation_experiment mechanics_force_experiment_methods
    """.split(),
    "spring-force-reading": """
        mechanics_spring_balance_reading
    """.split(),
    "spring-series-equilibrium": """
        mechanics_spring_displacement mechanics_two_body_spring_equilibrium
        mechanics_spring_length_maximization mechanics_series_spring_equivalent_k
        spring_test_single_14_spring_cases
    """.split(),
    "equivalent-gravity": """
        spring_test_single_09_circle_groove spring_test_single_10_steel_coil
        spring_test_single_12_cable_car
    """.split(),
    "friction-relative-motion": """
        spring_test_single_13_stacked_plates spring_test_solution_18_unloading
    """.split(),
    "overweight-force-graph": """
        spring_test_single_11_force_sensor
    """.split(),
    "curve-concepts": """
        curve_training_01_concepts curveForce
    """.split(),
    "vector-motion-composition": """
        motionCompose curve_training_05_velocity_graphs curve_training_09_wind_tunnel_force
    """.split(),
    "relative-velocity": """
        rainWindow
    """.split(),
    "river-basic": """
        riverCrossing curve_training_02_nonuniform_river curve_training_11_two_boats
    """.split(),
    "river-optimal": """
        riverAdvanced waterfallCrossing
    """.split(),
    "constraint-velocity": """
        rodConstraint curve_training_12_pulley_linkage
    """.split(),
    "projectile-basics": """
        projectileBasic projectile_lesson_04_wall_marks
    """.split(),
    "moving-platform-projectile": """
        curve_training_03_accelerating_bomber curve_training_08_bombs_on_slope
    """.split(),
    "projectile-incline": """
        curve_training_06_projectile_incline_scale curve_training_07_projectile_wall_angles
        projectileSlope projectileNormal projectile_lesson_09_plane_comparison
        projectile_a_02_dam_slope projectile_a_07_semicircle_incline
        projectile_a_08_two_balls_incline projectile_b_11_ski_slope
    """.split(),
    "projectile-circle": """
        semiCircleThrow projectile_b_10_arc_game
    """.split(),
    "projectile-window": """
        projectileWindow
    """.split(),
    "projectile-barrier-target": """
        volleyballServe projectile_a_01_dart_wall
    """.split(),
    "oblique-projectile-target": """
        dartTarget projectile_a_03_fountain projectile_a_04_fire_hose
    """.split(),
    "projectile-fluid-jet": """
        projectile_a_06_bottle_holes
    """.split(),
    "projectile-bounce": """
        projectileBounce
    """.split(),
    "circle-projectile-transition": """
        handRopeBreak lesson11_b_10_trebuchet
    """.split(),
    "circular-transmission": """
        curve_training_04_formation_turn circular_motion_bicycle_gear
        circular_motion_cake_decoration_rotation circular_motion_problem_06
        circular_motion_example6 circular_motion_belt_pulley_1
        circular_motion_pour_water_ice_2 circular_motion_gear_ratio
        circular_daily_a1_car_turn_passengers bikeGear
    """.split(),
    "rotating-target-timing": """
        circular_motion_bullet_through_cylinder circular_motion_example5
        circular_motion_bullet_cylinder bulletCylinder
    """.split(),
    "circular-force": """
        curve_training_13_banked_railway circular_motion_friction
        circular_motion_example8 circular_motion_example9
        circular_daily_ex1_banked_curve circular_daily_ex5_bicycle_turn
        circular_daily_a2_airplane_turn
    """.split(),
    "horizontal-circle-critical": """
        curve_training_10_tangent_rope_circle curve_training_15_two_blocks_disk
        dualConstraintCircle circular_motion_example10
        circular_motion_elastic_force_friction_static_friction_string
        circular_daily_ex2_conical_cylinder circular_daily_ex10_turntable_sensor
        circular_daily_b6_stacked_turntable circular_daily_b8_inclined_disk_sand
        circular_daily_b9_carrier_turn
    """.split(),
    "vertical-circle-critical": """
        curve_training_14_valve_light curve_training_16_rope_wrap_prism
        circular_motion_problem_01 circular_motion_ex11 circular_motion_ex12
        circular_motion_pendulum_hitting_nail circular_motion_friction_static_friction
        circular_daily_ex3_hilly_road circular_daily_ex6_semicircular_tube
        circular_daily_ex7_horizontal_bar circular_daily_ex8_rod_two_balls
        circular_daily_a3_bicycle_mud circular_daily_a4_box_vertical_circle
        circular_daily_a5_string_tension_graph circular_daily_b7_valve_light
        pileDriver lesson11_b_08_pendulum_tension
    """.split(),
    "conical-pendulum": """
        circular_motion_problem_02 circular_motion_example13 circular_motion_example14
        circular_motion_example15 circular_motion_string circular_daily_ex9_rattle_drum
        bowlDoubleBall
    """.split(),
    "centrifuge-density": """
        circular_daily_ex4_centrifuge
    """.split(),
    "kepler-orbit-law": """
        gravitation_course_01_perihelion_speed gravitation_a1_saturn_moons
        gravitation_a2_solar_terms gravitation_a3_halley_comet
        gravitation_b10_elliptic_force_graph
    """.split(),
    "shell-gravity-field": """
        gravitation_course_03_spherical_cavity gravitation_course_04_hollow_shells
        gravitation_course_09_earth_tunnel gravitation_course_extension_gravity
    """.split(),
    "rotation-surface-gravity": """
        gravitation_course_05_earth_density_rotation gravitation_course_07_planet_breakup
        gravitation_a4_scale_weight
    """.split(),
    "surface-gravity-throw": """
        gravitation_course_08_lunar_throw gravitation_a5_unknown_body_throw
        gravitation_b7_photogate_tension lesson9_hw_01_change4_speed
        lesson9_hw_08_rod_graph_planet
    """.split(),
    "orbit-parameter-inference": """
        gravitation_course_06_orbit_known_quantities gravitation_b6_orbit_arc_angle
        gravitation_b8_solar_eclipse gravitation_b9_astronomy_photo
        lesson9_course_02_exoplanet_mass
    """.split(),
    "satellite-comparison": """
        lesson9_course_01_satellite_comparison lesson9_course_03_three_orbit_comparison
        lesson9_course_04_saturn_ring_identity lesson9_course_09_change3_lunar_orbits
        lesson9_hw_02_space_elevator
    """.split(),
    "satellite-coverage": """
        lesson9_course_05_sync_satellite_min_period lesson9_course_06_eclipse_orbit_geometry
        lesson9_course_07_horizon_flash_period lesson9_hw_03_monitor_window
        lesson9_hw_04_satellite_distance_graph lesson9_hw_06_ground_track
    """.split(),
    "hohmann-transfer": """
        gravitation_course_02_ellipse_return lesson9_course_08_sync_transfer
        lesson9_course_10_earth_mars_transfer lesson9_hw_05_tianzhou_transfer
    """.split(),
    "elliptic-orbit-energy": """
        lesson9_hw_10_ellipse_energy
    """.split(),
    "multi-star-dynamics": """
        lesson9_course_11_binary_star lesson9_course_12_binary_mass_transfer
        lesson9_course_13_triple_star lesson9_hw_09_pulsar_binary_satellite
    """.split(),
    "compact-object-critical": """
        lesson9_hw_07_black_hole_period
    """.split(),
    "constant-force-work": """
        lesson10_course_01_crane_work lesson10_hw_01_tilting_truck
        lesson10_hw_03_walking_power
    """.split(),
    "moving-support-work": """
        lesson10_course_02_moving_wedge lesson10_hw_06_elevator_work
    """.split(),
    "variable-direction-work": """
        lesson10_course_04_tangent_disk_work lesson10_course_06_pulley_person_work
        lesson10_course_07_three_paths_friction lesson10_hw_02_vertical_slider
    """.split(),
    "variable-force-work": """
        lesson10_course_05_submerged_cube
    """.split(),
    "power-velocity": """
        lesson10_course_08_reverse_force_power lesson10_course_09_horizontal_pull_ball
        lesson10_hw_08_sled_circle lesson10_hw_09_gravity_power
    """.split(),
    "vehicle-power": """
        lesson10_course_10_rated_power_car lesson10_course_11_two_stage_car
        lesson10_course_12_force_reciprocal lesson10_hw_04_ev_power_graph
        lesson10_hw_05_accel_reciprocal lesson10_hw_07_car_inverse_force
        lesson11_course_07_hydrogen_car lesson11_b_06_hoist_shortest_time
    """.split(),
    "kinetic-theorem-basic": """
        lesson11_course_01_jet_takeoff lesson11_course_04_kinetic_graph
        lesson11_a_04_vertical_drag_force
    """.split(),
    "work-friction-roundtrip": """
        lesson11_course_03_round_trip_incline lesson11_course_06_rough_semicircle
        lesson11_a_03_incline_round_trip
    """.split(),
    "dissipative-energy-graph": """
        lesson11_b_09_linear_drag_throw lesson13_course_02_skydiving_graph
        lesson13_course_03_mechanical_energy_graph
        lesson13_a_04_vertical_throw_energy_graph lesson13_b_07_incline_round_trip
    """.split(),
    "friction-system-energy": """
        lesson13_a_02_block_cart_work
    """.split(),
    "spring-work-energy": """
        lesson11_course_02_spring_incline lesson11_a_01_spring_compression
        lesson11_b_07_car_rope_spring
    """.split(),
    "spring-dissipation": """
        lesson13_a_01_spring_pendulum lesson13_b_06_spring_ring_rod
    """.split(),
    "conveyor-work": """
        lesson10_course_03_conveyor_work
    """.split(),
    "conveyor-energy-cycle": """
        lesson11_course_09_conveyor_return lesson11_a_02_incline_conveyor
        lesson13_course_01_conveyor_energy lesson13_course_04_incline_conveyor_heat
        lesson13_a_03_conveyor_motor lesson13_b_08_incline_conveyor_scratch
    """.split(),
    "cross-conveyor": """
        projectile_b_09_conveyor lesson11_a_05_cross_conveyor
        lesson13_a_05_cross_conveyor_heat
    """.split(),
    "track-energy-projectile": """
        lesson11_course_05_incline_loop lesson11_course_08_arc_plank
        lesson11_course_10_arc_projectile lesson13_course_05_spring_track_plank
        lesson13_b_09_game_track_range
    """.split(),
    "road-power-optimization": """
        lesson13_course_07_s_curve_road
    """.split(),
    "collision-composite": """
        lesson13_course_06_pulley_arc_collision
    """.split(),
}

DIFFICULTY_OVERRIDES = {
    "spring_test_solution_18_unloading": 5,
    "curve_training_16_rope_wrap_prism": 5,
    "dualConstraintCircle": 5,
    "projectile_b_10_arc_game": 5,
    "projectile_b_11_ski_slope": 5,
    "circular_motion_ex12": 5,
    "circular_daily_b8_inclined_disk_sand": 5,
    "gravitation_b8_solar_eclipse": 5,
    "gravitation_b9_astronomy_photo": 5,
    "lesson9_course_13_triple_star": 5,
    "lesson9_hw_09_pulsar_binary_satellite": 5,
    "lesson11_b_10_trebuchet": 5,
    "lesson13_course_05_spring_track_plank": 5,
    "lesson13_course_06_pulley_arc_collision": 5,
    "lesson13_b_09_game_track_range": 5,
}

ROLE_LEVEL = {
    "概念辨析": "L0",
    "母题": "L1",
    "基础变式": "L1",
    "条件变式": "L2",
    "综合题": "L3",
}


def infer_role(problem):
    problem_id = problem["id"]
    title = problem.get("title", "")
    source = f"{problem_id} {problem.get('originalNumber', '')} {title}"
    if any(word in title for word in ("概念辨析", "实验方法", "弹力的存在及方向")):
        return "概念辨析"
    if problem_id.startswith("spring_test_single_") or problem_id.startswith("spring_test_solution_"):
        return "综合题"
    if re.search(r"(^|_)b_?\d|B组|B 组|^B\d|：B\d", source, re.IGNORECASE):
        return "综合题"
    if re.search(r"(^|_)a_?\d|A组|A 组|^A\d|：A\d", source, re.IGNORECASE):
        return "基础变式"
    if "_hw_" in problem_id or "课后" in title or "作业" in title:
        return "条件变式"
    if problem_id.startswith("curve_training_"):
        return "条件变式"
    if any(marker in title for marker in ("例", "课上", "拓展")) or "_course_" in problem_id:
        return "母题"
    if problem_id in {"doubleThrow", "pipeDrop", "threeCar", "inclineSlot"}:
        return "条件变式"
    return "母题"


def inferred_difficulty(problem, family_definition, role):
    difficulty = family_definition["difficulty"]
    if role == "基础变式":
        difficulty = max(difficulty, 3)
    elif role == "条件变式":
        difficulty = max(difficulty, 3)
    elif role == "综合题":
        difficulty = max(difficulty, 4)
    if "多选" in problem.get("title", ""):
        difficulty = max(difficulty, 4)
    return DIFFICULTY_OVERRIDES.get(problem["id"], min(difficulty, 5))


def build_assignment_map():
    assignments = {}
    duplicates = []
    for family_id, problem_ids in FAMILY_PROBLEMS.items():
        if family_id not in FAMILIES:
            raise ValueError(f"Unknown family definition: {family_id}")
        for problem_id in problem_ids:
            if problem_id in assignments:
                duplicates.append(problem_id)
            assignments[problem_id] = family_id
    if duplicates:
        raise ValueError(f"Duplicate taxonomy assignments: {sorted(set(duplicates))}")
    return assignments


def taxonomy_for(problem, family_id):
    definition = FAMILIES[family_id]
    model_id = definition["modelId"]
    role = infer_role(problem)
    return {
        "module": "力学",
        "topic": definition["topic"],
        "modelId": model_id,
        "modelName": MODELS[model_id],
        "familyId": family_id,
        "familyName": definition["familyName"],
        "role": role,
        "difficulty": inferred_difficulty(problem, definition, role),
        "variantLevel": ROLE_LEVEL[role],
        "skills": definition["skills"],
        "prerequisites": definition["prerequisites"],
    }


def insert_taxonomy(path, taxonomy):
    text = path.read_text(encoding="utf-8")
    parsed = json.loads(text)
    if parsed.get("taxonomy"):
        return False
    lines = text.splitlines(keepends=True)
    title_indexes = [
        index for index, line in enumerate(lines)
        if re.match(r'^  "title":\s*.+,\s*$', line.rstrip("\r\n"))
    ]
    if len(title_indexes) != 1:
        raise ValueError(f"{path.name}: expected exactly one top-level title line")
    serialized = json.dumps(taxonomy, ensure_ascii=False, indent=2).splitlines()
    block = [f'  "taxonomy": {serialized[0]}\n']
    block.extend(f"  {line}\n" for line in serialized[1:])
    block[-1] = block[-1].rstrip("\n") + ",\n"
    lines[title_indexes[0] + 1:title_indexes[0] + 1] = block
    updated = "".join(lines)
    json.loads(updated)
    path.write_text(updated, encoding="utf-8")
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true", help="write missing taxonomy blocks")
    args = parser.parse_args()
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    catalog = {}
    paths = {}
    for entry in index.get("problems", []):
        path = PROBLEM_DIR / entry["file"]
        problem = json.loads(path.read_text(encoding="utf-8"))
        catalog[problem["id"]] = problem
        paths[problem["id"]] = path

    assignments = build_assignment_map()
    unclassified = {problem_id for problem_id, problem in catalog.items() if not problem.get("taxonomy")}
    assigned = set(assignments)
    missing = sorted(unclassified.difference(assigned))
    unknown = sorted(assigned.difference(catalog))
    mismatched = []
    for problem_id in sorted(assigned.intersection(catalog)):
        current = catalog[problem_id].get("taxonomy")
        if current and current != taxonomy_for(catalog[problem_id], assignments[problem_id]):
            mismatched.append(problem_id)
    if missing or unknown or mismatched:
        if missing:
            print("Missing assignments:")
            print("\n".join(missing))
        if unknown:
            print("Assignments for unknown problem ids:")
            print("\n".join(unknown))
        if mismatched:
            print("Managed taxonomy differs from the explicit mapping:")
            print("\n".join(mismatched))
        return 1

    if not args.write:
        print(
            f"OK: {len(assignments)} managed taxonomy assignment(s); "
            f"{len(unclassified)} problem(s) pending write"
        )
        return 0

    changed = 0
    for problem_id in sorted(unclassified):
        if insert_taxonomy(paths[problem_id], taxonomy_for(catalog[problem_id], assignments[problem_id])):
            changed += 1
    print(f"Updated taxonomy in {changed} problem file(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
