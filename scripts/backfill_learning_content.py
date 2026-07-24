#!/usr/bin/env python3
"""Backfill the shared learning loop for JSON-backed physics problems.

The script deliberately derives content from each problem's taxonomy, skills,
existing solution, and animation parameters. It does not replace hand-written
content. Existing exploration, real-life, exam, and review blocks are kept.
"""

from __future__ import annotations

import argparse
import copy
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROBLEM_DIR = ROOT / "data" / "problems"
EXCLUDED_CHAPTERS = {"必修二结业测试"}
HANDCRAFTED_LEARNING_CYCLE_IDS = {
    "lesson12_course_01_reference_plane",
    "lesson12_course_02_well_throw",
}
GENERATOR_ID = "backfill_learning_content_v1"


MODEL_PROFILES = {
    "accelerated-frame": {
        "first": "先统一参考系，再写相对位置、相对速度和相对加速度",
        "principle": r"\[\vec a_{\mathrm{rel}}=\vec a_A-\vec a_B\]",
        "misconception": "把不同参考系中的速度或加速度直接放进同一个方程",
        "invariant": "参考系一旦选定，同一阶段内所有位置、速度和加速度都必须相对该参考系定义",
        "reality": "车厢中的观察与制动安全",
        "scene": "在加速列车、制动车厢或电梯中观察物体时，人会自然地以车厢为参照描述运动。车辆安全系统也会持续计算目标相对本车的位置和速度。",
        "mapping": "题目中的运动物体对应车辆或乘客，参考物对应车厢，题设的追及或偏移条件对应现实中的相对距离边界。",
        "factors": ["真实车辆的加速度可能随时间变化。", "传感器延迟和测距误差会改变安全余量。"],
        "resource": "vector",
    },
    "circular-motion": {
        "first": "先标出圆心方向，再判断哪些实际力提供径向合力",
        "principle": r"\[\sum F_r=m\frac{v^2}{r}=m\omega^2r\]",
        "misconception": "把向心力当成物体额外受到的一种力",
        "invariant": "无论装置怎样变化，径向合力都必须等于质量与向心加速度的乘积",
        "reality": "弯道、转盘与旋转设备",
        "scene": "车辆转弯、离心机、游乐设施和工业转盘都需要由接触力或约束力持续改变速度方向。",
        "mapping": "题目中的圆心、半径和转速对应设备的旋转轴、工作半径和运行转速；支持力、摩擦力或拉力对应现实中的结构载荷。",
        "factors": ["现实接触面的摩擦系数会随材料和温度变化。", "高速转动还要考虑振动、形变和安全系数。"],
        "resource": "circular",
    },
    "collision-energy": {
        "first": "先确定碰撞系统和碰撞前后两个瞬间，再分别检查动量与能量条件",
        "principle": r"\[\sum\vec p_{\mathrm i}=\sum\vec p_{\mathrm f}\]",
        "misconception": "默认所有碰撞都同时满足机械能守恒",
        "invariant": "短时碰撞先检查系统外力冲量；动能是否守恒需要由碰撞性质另行判断",
        "reality": "车辆碰撞与防护结构",
        "scene": "汽车吸能区、头盔和缓冲包装都通过延长碰撞时间、控制形变和重新分配能量来降低峰值载荷。",
        "mapping": "题目中的碰撞物体对应车辆或防护部件，速度变化对应事故前后状态，损失的机械能对应形变、热和声等内能。",
        "factors": ["真实碰撞通常包含转动和多次接触。", "材料的非线性形变会改变恢复系数。"],
        "resource": "work",
    },
    "constraint-system": {
        "first": "先写长度、接触或几何约束，再把各物体速度投影到共同约束方向",
        "principle": r"\[v_A\cos\alpha=v_B\cos\beta\]",
        "misconception": "把两个端点的速度大小直接判为相等",
        "invariant": "约束只要求沿有效约束方向的速度分量满足同一个几何关系",
        "reality": "起重滑轮与机械连杆",
        "scene": "起重机钢索、健身器械滑轮和机械连杆通过固定长度或固定接触关系，把一个部件的运动传递给另一个部件。",
        "mapping": "题目中的轻绳或轻杆对应现实中的钢索与连杆，端点速度对应执行器和负载的运动速度。",
        "factors": ["真实绳索会伸长并具有质量。", "滑轮轴承摩擦会使两侧张力不再严格相等。"],
        "resource": "vector",
    },
    "conveyor-energy": {
        "first": "先分清物体对地位移、传送带位移和接触面的相对滑动路程",
        "principle": r"\[Q=f_k s_{\mathrm{rel}}\]",
        "misconception": "把摩擦生热直接写成摩擦力乘物体对地位移",
        "invariant": "摩擦生热由接触面的相对路程决定，机械能变化由研究系统所受外力功决定",
        "reality": "物流传送带与分拣线",
        "scene": "物流中心的传送带需要让货物加速、减速或转向，同时控制打滑、磨损和电机能耗。",
        "mapping": "题目中的物块对应货物，传送带速度对应输送速度，摩擦做功和热量对应电机输出、货物机械能变化与接触损耗。",
        "factors": ["真实摩擦系数会随包装材料变化。", "电机和传动机构自身也存在能量损耗。"],
        "resource": "mechanical",
    },
    "curve-kinematics": {
        "first": "先在轨迹上标出速度切线方向，再由速度变化判断加速度方向",
        "principle": r"\[\vec v=\frac{\mathrm d\vec r}{\mathrm dt},\qquad \vec a=\frac{\mathrm d\vec v}{\mathrm dt}\]",
        "misconception": "认为速度方向总与合力或加速度方向相同",
        "invariant": "曲线运动中瞬时速度沿轨迹切线，加速度指向速度矢量变化的方向",
        "reality": "道路轨迹规划与运动追踪",
        "scene": "无人机、运动相机和导航软件会从连续位置数据重建速度方向与转弯趋势，用于轨迹控制和风险预测。",
        "mapping": "题目中的轨迹与速度箭头对应定位数据和瞬时运动方向，加速度对应控制系统改变速度矢量的效果。",
        "factors": ["采样频率会影响速度和曲率估计。", "风、路面和控制延迟会使实际轨迹偏离理想曲线。"],
        "resource": "vector",
    },
    "elastic-force": {
        "first": "先确定弹簧原长和形变量，再判断弹力方向及连接关系",
        "principle": r"\[F=kx\]",
        "misconception": "把弹簧当前长度直接当作形变量",
        "invariant": "弹性限度内，弹力大小由相对原长的形变量决定，方向总指向恢复形变",
        "reality": "测力计、减振器与弹性支承",
        "scene": "弹簧测力计、车辆悬架和设备减振支座都利用弹性元件把形变转化为可预测的恢复力。",
        "mapping": "题目中的弹簧对应弹性元件，形变量对应传感器位移，弹力对应载荷或恢复力。",
        "factors": ["真实弹簧可能存在滞后和内耗。", "超过弹性限度后胡克定律不再适用。"],
        "resource": "spring",
    },
    "energy-conservation": {
        "first": "先选系统并检查是否只有保守力做功，再比较初末机械能",
        "principle": r"\[E_{k1}+E_{p1}=E_{k2}+E_{p2}\]",
        "misconception": "看到速度和高度变化就直接使用机械能守恒",
        "invariant": "机械能是否守恒取决于系统边界和非保守力做功，而不是取决于轨迹形状",
        "reality": "过山车与储能装置",
        "scene": "过山车、抽水蓄能和弹簧储能装置都在动能与势能之间转换，并通过摩擦和驱动补偿能量损失。",
        "mapping": "题目中的高度、速度和弹性形变对应设备的重力势能、动能和弹性势能状态。",
        "factors": ["空气阻力和滚动摩擦会造成机械能损失。", "真实设备还要满足结构强度和舒适性约束。"],
        "resource": "mechanical",
    },
    "force-equilibrium": {
        "first": "先隔离研究对象，只画它实际受到的力，再按方向列平衡方程",
        "principle": r"\[\sum F_x=0,\qquad \sum F_y=0\]",
        "misconception": "把相互作用力同时画在同一个研究对象上",
        "invariant": "平衡条件要求同一研究对象所受全部外力的矢量和为零",
        "reality": "支架、吊装与建筑静力",
        "scene": "吊灯支架、起重吊索和建筑节点都需要在静止状态下让各方向载荷彼此平衡。",
        "mapping": "题目中的物体对应结构节点，绳、杆和接触面对应现实支承，弹力与重力对应结构内力和外载荷。",
        "factors": ["真实结构的连接点并非完全光滑或刚性。", "载荷波动会使静力问题转化为动力问题。"],
        "resource": "vector",
    },
    "gravitation": {
        "first": "先确定中心天体、距离是球心距还是高度，再写万有引力关系",
        "principle": r"\[F=G\frac{Mm}{r^2}\]",
        "misconception": "把距地面高度直接代入万有引力公式中的球心距",
        "invariant": "球对称天体外部的引力由中心距离和中心天体质量决定",
        "reality": "卫星测轨与行星参数反演",
        "scene": "航天测控通过卫星轨道周期、距离和速度反推出中心天体的引力参数，并用于轨道预报。",
        "mapping": "题目中的中心天体和卫星对应真实行星与航天器，轨道半径和周期对应测轨数据。",
        "factors": ["真实天体并非完全球对称。", "多天体摄动会使轨道缓慢偏离理想二体模型。"],
        "resource": "gravity",
    },
    "kinematics": {
        "first": "先统一正方向、初始时刻和各阶段边界，再写分段运动方程",
        "principle": r"\[v=v_0+at,\qquad x=v_0t+\frac12at^2\]",
        "misconception": "跨越加速度变化的阶段仍使用同一个匀变速公式",
        "invariant": "每个匀变速阶段都由该阶段的初始状态和加速度唯一确定，并在边界处保持位置连续",
        "reality": "车辆制动与追及预警",
        "scene": "汽车防碰系统利用相对距离、速度和制动加速度预测最小间距，并在达到危险边界前报警。",
        "mapping": "题目中的运动物体对应车辆，相遇或停止条件对应现实中的碰撞边界和停车位置。",
        "factors": ["驾驶员反应时间会增加制动距离。", "路面附着条件会改变可实现的减速度。"],
        "resource": "vector",
    },
    "multi-star-system": {
        "first": "先确定共同质心，再对每个天体分别写质心关系和向心动力学",
        "principle": r"\[m_1r_1=m_2r_2,\qquad \omega_1=\omega_2\]",
        "misconception": "认为质量不同的双星具有不同角速度",
        "invariant": "稳定双星绕共同质心转动，角速度相同而轨道半径与质量成反比",
        "reality": "双星观测与恒星质量测量",
        "scene": "天文学家通过双星的周期、轨道尺度和质心位置估算两颗恒星的质量。",
        "mapping": "题目中的两颗或多颗星对应观测天体，轨道半径和周期对应天文测量数据。",
        "factors": ["真实轨道常为椭圆而非圆。", "观测到的是轨道在天空平面的投影。"],
        "resource": "gravity",
    },
    "orbit-transfer": {
        "first": "先标出点火位置和点火前后轨道，再判断速度突变方向与新轨道形状",
        "principle": r"\[v^2=GM\left(\frac2r-\frac1a\right)\]",
        "misconception": "认为加速点火后航天器会立刻移动到更高圆轨道",
        "invariant": "瞬时点火改变速度而不改变当时位置，新轨道必须通过点火点",
        "reality": "卫星变轨与深空任务设计",
        "scene": "卫星升轨、交会对接和行星探测都通过短时点火改变轨道能量和远近地点。",
        "mapping": "题目中的点火点、圆轨道和转移椭圆对应真实任务的机动时刻与轨道段。",
        "factors": ["真实点火持续一定时间而非瞬时。", "任务设计还要考虑相位、燃料和摄动。"],
        "resource": "orbit",
    },
    "projectile-motion": {
        "first": "先选坐标轴，把运动分解为互相独立且等时的水平、竖直分运动",
        "principle": r"\[x=v_{0x}t,\qquad y=v_{0y}t+\frac12gt^2\]",
        "misconception": "把轨迹方向误当成恒定的受力方向",
        "invariant": "忽略空气阻力时，水平和竖直分运动共享同一时间，竖直加速度始终为重力加速度",
        "reality": "球类轨迹与抛投定位",
        "scene": "篮球投篮、消防水流和物资抛投都需要由初速度、方向和落差预测轨迹。",
        "mapping": "题目中的抛体对应球、水滴或物资，初速度和落点约束对应现实中的发射条件与目标区域。",
        "factors": ["空气阻力会缩短射程并改变轨迹。", "物体自旋可能产生额外升力。"],
        "resource": "vector",
    },
    "river-crossing": {
        "first": "先区分船相对水、水相对岸和船相对岸的速度",
        "principle": r"\[\vec v_{\mathrm{船/岸}}=\vec v_{\mathrm{船/水}}+\vec v_{\mathrm{水/岸}}\]",
        "misconception": "把船头方向直接当成船相对岸的航迹方向",
        "invariant": "三种速度始终满足矢量和，渡河时间由对岸方向的速度分量决定",
        "reality": "渡船航线与侧风修正",
        "scene": "渡船、无人机和飞机都需要用自身相对介质的速度抵消水流或侧风，才能到达预定位置。",
        "mapping": "题目中的船速和水速对应载具相对介质速度与介质漂移速度，河宽对应必须跨越的横向距离。",
        "factors": ["真实流速会随位置和时间变化。", "载具速度存在功率上限和操纵延迟。"],
        "resource": "vector",
    },
    "spring-energy": {
        "first": "先把弹簧纳入系统，确定原长、形变量和初末状态",
        "principle": r"\[E_{p,s}=\frac12kx^2\]",
        "misconception": "用弹簧弹力的末值直接乘位移计算变力功",
        "invariant": "理想弹簧的弹性势能只由形变量决定，弹力做功等于弹性势能减少量",
        "reality": "弹簧发射器与缓冲机构",
        "scene": "弹簧发射器、车辆缓冲器和机械储能装置利用弹性形变暂存能量，再把能量释放给运动部件。",
        "mapping": "题目中的弹簧和物块对应储能元件与负载，压缩量和速度对应储能状态和释放效果。",
        "factors": ["真实弹簧存在质量和内耗。", "碰撞、摩擦和限位结构会带来额外能量损失。"],
        "resource": "spring",
    },
    "track-transition": {
        "first": "先按轨道接触、脱离和抛体阶段分段，并在连接点使用共同状态量",
        "principle": r"\[E_1+W_{\mathrm{nc}}=E_2,\qquad \sum F_r=m\frac{v^2}{r}\]",
        "misconception": "只用能量求速度而不检查支持力或脱离条件",
        "invariant": "能量关系决定速度大小，径向动力学和几何条件决定能否继续沿轨道运动",
        "reality": "过山车轨道与跳台设计",
        "scene": "过山车、滑雪跳台和测试轨道需要同时满足能量、接触力和离轨后抛体轨迹的约束。",
        "mapping": "题目中的圆弧、斜面和离轨点对应真实轨道几何，支持力和速度对应结构载荷与安全边界。",
        "factors": ["真实轨道存在滚动阻力和空气阻力。", "乘员舒适性还限制加速度及其变化率。"],
        "resource": "track",
    },
    "work-energy": {
        "first": "先确定研究对象和过程，再逐一判断各力做功的正负",
        "principle": r"\[\sum W=\Delta E_k\]",
        "misconception": "把某一个力的功直接等同于动能变化",
        "invariant": "合力总功等于动能变化；某种能量的变化必须与对应做功过程匹配",
        "reality": "车辆动力、制动与能耗",
        "scene": "车辆加速、制动、起重和工业驱动都需要把功率输入与速度变化、阻力损耗和工作时间联系起来。",
        "mapping": "题目中的力、位移、速度和功率对应现实设备的驱动力、行程、运行状态和能源输出。",
        "factors": ["真实驱动系统存在效率损失。", "阻力和输出功率通常随速度变化。"],
        "resource": "work",
    },
}


RESOURCES = {
    "vector": {
        "platform": "PhET",
        "kind": "交互模拟",
        "title": "向量相加",
        "url": "https://phet.colorado.edu/zh_CN/simulations/vector-addition",
    },
    "circular": {
        "platform": "OpenStax",
        "kind": "开放教材（英文）",
        "title": "向心力与牛顿第二定律",
        "url": "https://openstax.org/books/university-physics-volume-1/pages/6-3-centripetal-force",
    },
    "work": {
        "platform": "OpenStax",
        "kind": "开放教材（英文）",
        "title": "功率、功与动能定理",
        "url": "https://openstax.org/books/physics/pages/9-1-work-power-and-the-work-energy-theorem",
    },
    "mechanical": {
        "platform": "OpenStax",
        "kind": "开放教材（英文）",
        "title": "机械能、摩擦与能量转化",
        "url": "https://openstax.org/books/physics/pages/9-2-mechanical-energy-and-conservation-of-energy",
    },
    "spring": {
        "platform": "PhET",
        "kind": "交互模拟",
        "title": "质量和弹簧",
        "url": "https://phet.colorado.edu/zh_CN/simulations/masses-and-springs",
    },
    "gravity": {
        "platform": "PhET",
        "kind": "交互模拟",
        "title": "万有引力实验",
        "url": "https://phet.colorado.edu/zh_CN/simulations/gravity-force-lab",
    },
    "orbit": {
        "platform": "OpenStax",
        "kind": "开放教材（英文）",
        "title": "卫星轨道与机械能",
        "url": "https://openstax.org/books/university-physics-volume-1/pages/13-4-satellite-orbits-and-energy",
    },
    "track": {
        "platform": "The Physics Classroom",
        "kind": "交互模型（英文）",
        "title": "过山车模型：圆弧、能量与摩擦",
        "url": "https://www.physicsclassroom.com/interactive/work-and-energy/roller-coaster-model",
    },
}

VIDEO_BACKFILL_CHAPTERS = {
    "力学基础",
    "功和功率",
    "必修一结业测试",
    "竖直上抛运动",
    "曲线运动",
    "万有引力与宇宙航行",
    "动能定理",
    "平抛运动",
    "功能关系",
    "机械能守恒定律",
    "行星运动与变轨等问题",
    "圆周运动日常",
    "圆周运动",
}

VIDEOS_BY_FAMILY = {
    "spring-force-reading": {
        "title": "探究弹力和弹簧伸长之间的关系：胡克定律实验",
        "url": "https://www.bilibili.com/video/BV165411G7Vr/",
        "watchFor": "观察弹簧形变量如何转化为测力计读数，并辨认弹性限度。",
    },
    "spring-series-equilibrium": {
        "title": "探究弹力和弹簧伸长之间的关系：胡克定律实验",
        "url": "https://www.bilibili.com/video/BV165411G7Vr/",
        "watchFor": "先确认单根弹簧的劲度系数，再思考串联时各弹簧弹力和形变量的关系。",
    },
    "contact-force-equilibrium": {
        "title": "动态平衡：动态三角形",
        "url": "https://www.bilibili.com/video/BV1yt41197oE/",
        "watchFor": "暂停画出同一研究对象的受力图，观察约束方向变化时平衡力如何改变。",
    },
    "force-experiment-methods": {
        "title": "高中物理实验系统课",
        "url": "https://www.bilibili.com/video/BV1yx4y1a7Wh/",
        "watchFor": "重点辨认放大、转换、控制变量和理想化等实验方法分别解决什么测量困难。",
    },
    "constant-force-work": {
        "title": "功的概念、功率与机车启动",
        "url": "https://www.bilibili.com/video/BV1J4411i76E/",
        "watchFor": "判断力与位移的夹角，并核对正功、负功和不做功的条件。",
    },
    "moving-support-work": {
        "title": "功和功率",
        "url": "https://www.bilibili.com/video/BV1uE421w7u1/",
        "watchFor": "研究对象改变时重新确认作用点的对地位移，不把相对位移误作做功位移。",
    },
    "conveyor-work": {
        "title": "传送带摩擦力分析：动画演示",
        "url": "https://www.bilibili.com/video/BV1LL411j7r7/",
        "watchFor": "区分物体对地位移、传送带位移和接触面的相对滑动路程。",
    },
    "variable-direction-work": {
        "title": "功和功率",
        "url": "https://www.bilibili.com/video/BV1uE421w7u1/",
        "watchFor": "把过程分成足够小的位移段，观察力与瞬时位移夹角变化对功的影响。",
    },
    "variable-force-work": {
        "title": "功和功率",
        "url": "https://www.bilibili.com/video/BV1uE421w7u1/",
        "watchFor": "关注变力功为何不能直接用末态力乘总位移，以及图像面积的物理意义。",
    },
    "power-velocity": {
        "title": "功率",
        "url": "https://www.bilibili.com/video/BV1XhkzYVEZ5/",
        "watchFor": "从瞬时功率关系出发，比较力、速度与夹角改变时功率怎样变化。",
    },
    "vehicle-power": {
        "title": "机车启动：恒定功率与恒定加速度",
        "url": "https://www.bilibili.com/video/BV1LBGRzFE5g/",
        "watchFor": "对照恒加速度和恒功率两个阶段，找出牵引力、速度与加速度的转折点。",
    },
    "motion-quantity-concepts": {
        "title": "质点与参考系",
        "url": "https://www.bilibili.com/video/BV1Lz42197T1/",
        "watchFor": "结合实际运动情境区分质点、路程、位移、平均速度和瞬时速度。",
    },
    "uniform-motion-graphs": {
        "title": "三种运动图像的比较",
        "url": "https://www.bilibili.com/video/BV1nr4y1p7yN/",
        "watchFor": "分别读出横纵轴、斜率和面积含义，不把轨迹形状与运动图像形状混淆。",
    },
    "quasistatic-equilibrium": {
        "title": "动态平衡：动态三角形",
        "url": "https://www.bilibili.com/video/BV1yt41197oE/",
        "watchFor": "把缓慢变化过程看成连续平衡状态，追踪各力方向和大小的变化。",
    },
    "multi-rope-equilibrium": {
        "title": "轻绳模型：活结与死结",
        "url": "https://www.bilibili.com/video/BV1kt4y1i7YD/",
        "watchFor": "先判断绳结类型和同绳张力关系，再用力的矢量平衡分析结点。",
    },
    "equivalent-gravity": {
        "title": "超重和失重实验",
        "url": "https://www.bilibili.com/video/BV1vp4y1e7Lq?p=1",
        "watchFor": "比较不同加速度状态下的视重变化，并尝试用非惯性系中的等效重力方向解释。",
    },
    "overweight-force-graph": {
        "title": "超重和失重实验",
        "url": "https://www.bilibili.com/video/BV1vp4y1e7Lq?p=1",
        "watchFor": "把测力传感器读数的变化与人体加速度方向逐段对应。",
    },
    "friction-relative-motion": {
        "title": "传送带摩擦力分析：动画演示",
        "url": "https://www.bilibili.com/video/BV1LL411j7r7/",
        "watchFor": "先判断接触面间的相对运动趋势，再确定摩擦力方向和相对位移。",
    },
    "incline-equal-time": {
        "title": "光滑斜面与等时圆",
        "url": "https://www.bilibili.com/video/BV1LiHvzwEDv/",
        "watchFor": "从圆的弦长和沿斜面加速度同时入手，观察倾角为何会在时间表达式中抵消。",
    },
    "pursuit-braking": {
        "title": "追击相遇问题",
        "url": "https://www.bilibili.com/video/BV1aK4y1Y7Tb/",
        "watchFor": "统一时间轴，画出相对距离随时间的变化并检查最小间距或相遇条件。",
    },
    "vertical-multistage": {
        "title": "火箭运动",
        "url": "https://www.bilibili.com/video/BV1ob411z7UZ/",
        "watchFor": "按动力、惯性上升和下落等阶段切分时间，并在阶段边界传递位置与速度。",
    },
    "same-acceleration-relative": {
        "title": "竖直上抛：基础篇",
        "url": "https://www.bilibili.com/video/BV1Ge411L7hQ/",
        "watchFor": "比较两个物体具有相同重力加速度时，相对加速度和相对速度怎样变化。",
    },
    "curve-concepts": {
        "title": "曲线运动、运动的合成与分解",
        "url": "https://www.bilibili.com/video/BV1Mh4y1y7sW/",
        "watchFor": "观察瞬时速度的切线方向，并根据速度方向或大小的变化判断加速度。",
    },
    "vector-motion-composition": {
        "title": "运动的合成与分解",
        "url": "https://www.bilibili.com/video/BV1Mh4y1y7sW/",
        "watchFor": "统一参考系和时间，把二维运动拆成两个方向的分运动后再进行矢量合成。",
    },
    "relative-velocity": {
        "title": "变换参考系与相对速度",
        "url": "https://www.bilibili.com/video/BV1Mh4y1y7sW/",
        "watchFor": "明确观察者和研究对象，检查相对速度的矢量减法方向。",
    },
    "constraint-velocity": {
        "title": "绳、杆末端的关联速度",
        "url": "https://www.bilibili.com/video/BV1Mh4y1y7sW/",
        "watchFor": "把端点速度投影到绳长或杆长约束方向，找出必须相等的速度分量。",
    },
    "river-basic": {
        "title": "小船渡河：时间最短与距离最短",
        "url": "https://www.bilibili.com/video/BV1Mh4y1y7sW/",
        "watchFor": "区分船对水、水对岸和船对岸三种速度，观察航向与航迹的差别。",
    },
    "river-optimal": {
        "title": "小船渡河：时间最短与距离最短",
        "url": "https://www.bilibili.com/video/BV1Mh4y1y7sW/",
        "watchFor": "分别建立最短时间和最短航程的目标，检查船速与水速的临界关系。",
    },
    "circular-force": {
        "title": "圆周运动受力与转弯模型",
        "url": "https://www.bilibili.com/video/BV1cz421B78U/",
        "watchFor": "沿半径方向列合力，不把向心力画成独立的新作用力。",
    },
    "circular-transmission": {
        "title": "圆周运动的传动问题",
        "url": "https://www.bilibili.com/video/BV1cz421B78U/",
        "watchFor": "区分同轴角速度相同与皮带接触点线速度相同两类约束。",
    },
    "horizontal-circle-critical": {
        "title": "圆盘、转弯与圆周运动临界",
        "url": "https://www.bilibili.com/video/BV1cz421B78U/",
        "watchFor": "先找径向合力的最大值，再由静摩擦或绳力边界确定临界速度。",
    },
    "vertical-circle-critical": {
        "title": "竖直圆周运动",
        "url": "https://www.bilibili.com/video/BV1cz421B78U/",
        "watchFor": "在最高点、最低点分别列径向方程，并检查绳、杆或轨道的约束差异。",
    },
    "moving-platform-projectile": {
        "title": "平抛运动与运动载体投弹",
        "url": "https://www.bilibili.com/video/BV1xz411i78C/",
        "watchFor": "保留释放瞬间的水平速度，比较不同释放时刻的共同运动时间。",
    },
    "circle-projectile-transition": {
        "title": "圆周运动断约束后的抛体",
        "url": "https://www.bilibili.com/video/BV1k44y1V73n/",
        "watchFor": "先由圆周阶段求脱离点速度，再把该速度作为抛体阶段的初速度。",
    },
    "projectile-basics": {
        "title": "平抛运动基础与研究方法",
        "url": "https://www.bilibili.com/video/BV1724y1E7CT/",
        "watchFor": "用同一时间连接水平匀速和竖直自由落体两个分运动。",
    },
    "projectile-incline": {
        "title": "与斜面、圆弧面有关的平抛",
        "url": "https://www.bilibili.com/video/BV1cz421B78U/",
        "watchFor": "把落点坐标同时代入平抛方程和斜面几何方程，辨认位移角与速度角。",
    },
    "projectile-circle": {
        "title": "与斜面、圆弧面有关的平抛",
        "url": "https://www.bilibili.com/video/BV1cz421B78U/",
        "watchFor": "用圆的几何方程约束落点，再结合平抛参数方程消去时间。",
    },
    "projectile-barrier-target": {
        "title": "平抛临界、越障与靶面命中",
        "url": "https://www.bilibili.com/video/BV1cz421B78U/",
        "watchFor": "把障碍物边缘转化为轨迹刚好通过的临界点，并继续检查最终落点。",
    },
    "projectile-window": {
        "title": "平抛临界与有限区域穿越",
        "url": "https://www.bilibili.com/video/BV1cz421B78U/",
        "watchFor": "分别计算进入和离开窗口边界的时刻，用不等式确定允许的初速度范围。",
    },
    "projectile-bounce": {
        "title": "平抛运动的分段建模",
        "url": "https://www.bilibili.com/video/BV1724y1E7CT/",
        "watchFor": "在碰撞时刻结束第一段运动，再按碰撞后的速度分量建立下一段抛体方程。",
    },
    "projectile-fluid-jet": {
        "title": "平抛运动基础与生活中的水平射流",
        "url": "https://www.bilibili.com/video/BV1724y1E7CT/",
        "watchFor": "把流出小孔的液滴视为连续平抛质点，联系出口速度、落差与水平射程。",
    },
    "oblique-projectile-target": {
        "title": "斜抛运动",
        "url": "https://www.bilibili.com/video/BV1oB42167Au/",
        "watchFor": "把初速度分解为水平和竖直分量，用到达目标的同一时刻联立坐标条件。",
    },
    "kepler-orbit-law": {
        "title": "开普勒三定律",
        "url": "https://www.bilibili.com/video/BV1vv411e7QZ/",
        "watchFor": "区分椭圆焦点、面积定律和周期半长轴关系，并判断近日点与远日点速度。",
    },
    "orbit-parameter-inference": {
        "title": "万有引力与天体参数反演",
        "url": "https://www.bilibili.com/video/BV1XJZrYWEQQ/",
        "watchFor": "从轨道半径和周期建立向心力方程，判断能反推出中心天体的哪些参数。",
    },
    "rotation-surface-gravity": {
        "title": "万有引力与自转条件下的视重",
        "url": "https://www.bilibili.com/video/BV1vv411e7QZ/",
        "watchFor": "把引力分成支持力与自转向心力，检查赤道处临界失重条件。",
    },
    "shell-gravity-field": {
        "title": "球壳的万有引力",
        "url": "https://www.bilibili.com/video/BV19t411k72n/",
        "watchFor": "比较球壳内、球壳外和均匀球体内部的引力规律，不直接套用质点反平方公式。",
    },
    "surface-gravity-throw": {
        "title": "万有引力、星球重力与黄金代换",
        "url": "https://www.bilibili.com/video/BV1XJZrYWEQQ/",
        "watchFor": "先由星球参数确定表面重力加速度，再分析近地竖直抛体运动。",
    },
    "hohmann-transfer": {
        "title": "卫星变轨与转移椭圆",
        "url": "https://www.bilibili.com/video/BV1vv411e7QZ/",
        "watchFor": "在点火点比较变轨前后速度，确认新椭圆轨道必须经过点火位置。",
    },
    "conveyor-energy-cycle": {
        "title": "传送带问题与能量分析",
        "url": "https://www.bilibili.com/video/BV1w6QVYyEiX/",
        "watchFor": "逐段判断相对运动和摩擦方向，再分别统计机械能变化与摩擦生热。",
    },
    "cross-conveyor": {
        "title": "传送带问题与相对运动",
        "url": "https://www.bilibili.com/video/BV1w6QVYyEiX/",
        "watchFor": "分方向处理速度变化，先判断相对速度再确定摩擦加速度。",
    },
    "spring-work-energy": {
        "title": "动能定理、变力做功与弹簧能量",
        "url": "https://www.bilibili.com/video/BV1k44y1V73n/",
        "watchFor": "用弹力功或弹性势能变化处理变力，不用末态弹力直接乘位移。",
    },
    "track-energy-projectile": {
        "title": "动能定理与竖直圆、多过程问题",
        "url": "https://www.bilibili.com/video/BV1k44y1V73n/",
        "watchFor": "分开处理轨道、临界和离轨后抛体阶段，并在连接点传递速度。",
    },
    "dissipative-energy-graph": {
        "title": "动能定理处理变力与能量图像",
        "url": "https://www.bilibili.com/video/BV1k44y1V73n/",
        "watchFor": "由图像斜率或面积识别变力做功，再连接到动能随位移的变化。",
    },
    "kinetic-theorem-basic": {
        "title": "动能与动能定理",
        "url": "https://www.bilibili.com/video/BV1k44y1V73n/",
        "watchFor": "先逐一判断各力做功，再用合力总功连接初末动能。",
    },
    "work-friction-roundtrip": {
        "title": "动能定理：往返运动解题思路",
        "url": "https://www.bilibili.com/video/BV1D4411i7Ya/",
        "watchFor": "分清重力功的路径无关性和摩擦功的路程相关性，完整统计往返总路程。",
    },
    "collision-composite": {
        "title": "碰撞、多过程运动与能量转化",
        "url": "https://www.bilibili.com/video/BV1D4411i7Ya/",
        "watchFor": "把碰撞前、碰撞瞬间和碰撞后分段，分别判断动量与机械能的适用条件。",
    },
    "spring-dissipation": {
        "title": "弹簧系统、摩擦与能量守恒",
        "url": "https://www.bilibili.com/video/BV1k44y1V73n/",
        "watchFor": "把弹簧纳入系统，用弹性势能变化和摩擦生热共同核对能量去向。",
    },
    "friction-system-energy": {
        "title": "摩擦力做功与系统能量",
        "url": "https://www.bilibili.com/video/BV1w6QVYyEiX/",
        "watchFor": "分别统计摩擦力对各物体的功，并用相对路程计算系统增加的内能。",
    },
    "road-power-optimization": {
        "title": "功率、速度与圆周运动约束",
        "url": "https://www.bilibili.com/video/BV1XhkzYVEZ5/",
        "watchFor": "把功率关系与弯道速度上限同时列出，区分动力约束和转弯安全约束。",
    },
    "rigid-body-rotation": {
        "title": "系统机械能守恒与刚性连接体",
        "url": "https://www.bilibili.com/video/BV1cCQVYkEgA/",
        "watchFor": "先用刚体约束确定各点角速度关系，再把所有物体的动能和势能纳入同一系统。",
    },
    "rod-sliders": {
        "title": "轻杆连接体的关联速度与系统机械能",
        "url": "https://www.bilibili.com/video/BV1984y1d7sc/",
        "watchFor": "沿杆方向投影两端速度，先满足长度约束，再列系统机械能关系。",
    },
    "rope-slider": {
        "title": "轻绳连接体的关联速度与系统机械能",
        "url": "https://www.bilibili.com/video/BV1984y1d7sc/",
        "watchFor": "由绳长不变确定两物体速度关系，并检查绳是否始终绷紧。",
    },
    "rope-spring-linkage": {
        "title": "绳、弹簧连接系统的机械能",
        "url": "https://www.bilibili.com/video/BV1cCQVYkEgA/",
        "watchFor": "同时追踪绳长约束和弹簧形变量，把弹性势能计入系统总机械能。",
    },
    "conservation-condition": {
        "title": "机械能守恒的条件与全部考点",
        "url": "https://www.bilibili.com/video/BV1YTLRzcEMu/",
        "watchFor": "先选系统，再检查是否只有重力或弹力等保守力做功。",
    },
    "continuous-body": {
        "title": "系统机械能守恒",
        "url": "https://www.bilibili.com/video/BV1cCQVYkEgA/",
        "watchFor": "用整体质心高度表示连续体重力势能，并保持质量分布与速度约束一致。",
    },
    "vertical-energy": {
        "title": "机械能守恒：重力势能与动能转化",
        "url": "https://www.bilibili.com/video/BV1Gp4y1b7KM/",
        "watchFor": "选定参考面后比较初末动能和重力势能，不让参考面选择影响势能差。",
    },
    "spring-compression": {
        "title": "机械能守恒：动能与弹性势能转化",
        "url": "https://www.bilibili.com/video/BV1Gp4y1b7KM/",
        "watchFor": "在接触弹簧前后分段，找出最大压缩时速度或支持力的条件。",
    },
    "spring-friction-buffer": {
        "title": "弹簧缓冲、摩擦与能量分析",
        "url": "https://www.bilibili.com/video/BV1k44y1V73n/",
        "watchFor": "把初始机械能分配到弹性势能和摩擦生热，检查停止位置是否唯一。",
    },
    "spring-launch": {
        "title": "弹簧弹射与系统机械能守恒",
        "url": "https://www.bilibili.com/video/BV1cCQVYkEgA/",
        "watchFor": "在分离条件出现前使用共同运动约束，分离后分别处理各物体。",
    },
    "spring-separation-graph": {
        "title": "弹簧能量与分离图像",
        "url": "https://www.bilibili.com/video/BV1YTLRzcEMu/",
        "watchFor": "把图像上的动能、势能极值与弹簧原长、最大形变和分离时刻对应。",
    },
    "track-projectile": {
        "title": "机械能守恒、圆弧轨道与离轨抛体",
        "url": "https://www.bilibili.com/video/BV1YTLRzcEMu/",
        "watchFor": "先用机械能求离轨速度，再检查支持力条件并进入抛体阶段。",
    },
    "mechanical-energy-change": {
        "title": "非保守力做功与机械能变化",
        "url": "https://www.bilibili.com/video/BV1YTLRzcEMu/",
        "watchFor": "明确系统边界，用非保守力总功判断机械能增加或减少。",
    },
    "power-energy": {
        "title": "功率与机械能变化",
        "url": "https://www.bilibili.com/video/BV1XhkzYVEZ5/",
        "watchFor": "把功率对时间的积累转化为功，再与机械能变化和阻力耗散平衡。",
    },
    "compact-object-critical": {
        "title": "万有引力、逃逸速度与致密天体",
        "url": "https://www.bilibili.com/video/BV1XJZrYWEQQ/",
        "watchFor": "从引力提供向心力或逃逸能量出发，检查致密天体半径与临界速度。",
    },
    "satellite-comparison": {
        "title": "高低轨卫星与轨道参数比较",
        "url": "https://www.bilibili.com/video/BV19t411k72n/",
        "watchFor": "随轨道半径变化依次比较线速度、角速度、周期和机械能。",
    },
    "satellite-coverage": {
        "title": "卫星追及、覆盖与地面观测",
        "url": "https://www.bilibili.com/video/BV1vv411e7QZ/",
        "watchFor": "把卫星角速度与天体自转角速度作差，再结合视线几何确定窗口或覆盖范围。",
    },
    "multi-star-dynamics": {
        "title": "双星与多星圆周运动",
        "url": "https://www.bilibili.com/video/BV1XJZrYWEQQ/",
        "watchFor": "先确定共同质心和相同角速度，再分别对每颗星列万有引力与向心力关系。",
    },
    "elliptic-orbit-energy": {
        "title": "椭圆轨道、速度与机械能",
        "url": "https://www.bilibili.com/video/BV1vv411e7QZ/",
        "watchFor": "比较近日点和远日点的速度、引力势能与总机械能，区分轨道内变化和轨道间比较。",
    },
    "centrifuge-density": {
        "title": "圆周运动与离心机模型",
        "url": "https://www.bilibili.com/video/BV1GY411n7BX/",
        "watchFor": "在旋转参考下比较不同密度物质所需的向心力及其径向分层趋势。",
    },
    "rotating-target-timing": {
        "title": "圆周运动中的旋转目标与周期计时",
        "url": "https://www.bilibili.com/video/av92502098/",
        "watchFor": "把直线穿越时间与转动物体的角位移、周期和孔位重复条件联立。",
    },
}


def curated_video(problem: dict) -> dict | None:
    if problem.get("chapter") not in VIDEO_BACKFILL_CHAPTERS:
        return None
    family_id = problem.get("taxonomy", {}).get("familyId")
    video = VIDEOS_BY_FAMILY.get(family_id)
    if not video:
        return None
    result = {
        "platform": "哔哩哔哩",
        **copy.deepcopy(video),
        "matchReason": (
            f"视频直接覆盖“{problem['taxonomy']['familyName']}”题族的核心建模关系，"
            "观看时可把演示中的研究对象、受力或运动阶段逐一对应到当前题目。"
        ),
    }
    return result


def load_problem(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def problem_paths() -> list[Path]:
    return sorted(
        path for path in PROBLEM_DIR.glob("*.json")
        if path.name != "index.json"
    )


def animation_preset(problem: dict, progress: float, use_high_value: bool) -> dict | None:
    animation = problem.get("animation", {})
    if animation.get("enabled") is not True or animation.get("type") in {None, "none"}:
        return None
    params = animation.get("params", {})
    selected = {}
    for key, definition in params.items():
        if not isinstance(definition, dict):
            continue
        value = definition.get("max") if use_high_value else definition.get("value")
        if isinstance(value, (int, float)) and not isinstance(value, bool):
            selected[key] = value
            break
    taxonomy = problem["taxonomy"]
    return {
        "params": selected,
        "progress": progress,
        "play": progress < 0.5,
        "caption": (
            f"已切换到“{taxonomy['familyName']}”的"
            f"{'条件变化' if use_high_value else '起始观察'}状态，请核对动画与图表中的关键量。"
        ),
    }


def problem_formula(problem: dict, profile: dict) -> str:
    analysis = problem.get("analysis", {})
    candidates = []
    if isinstance(analysis, dict):
        candidates.append(str(analysis.get("sharedFormula") or ""))
        candidates.append(str(analysis.get("content") or ""))
    for step in problem.get("steps", [])[:4]:
        if isinstance(step, dict):
            candidates.append(str(step.get("content") or ""))
    formulas = []
    for candidate in candidates:
        formulas.extend(re.findall(r"\\\[[\s\S]*?\\\]", candidate))
    return formulas[-1] if formulas else profile["principle"]


def build_student_exploration(problem: dict, profile: dict) -> dict:
    taxonomy = problem["taxonomy"]
    skills = taxonomy.get("skills", [])
    skill_text = "、".join(skills[:2]) or taxonomy["familyName"]
    formula = problem_formula(problem, profile)
    stages = [
        {
            "title": f"先识别“{taxonomy['familyName']}”",
            "prompt": (
                f"暂不代入数据。阅读“{problem['title']}”后，写出研究对象、过程边界，"
                f"并说明“{skill_text}”中哪一个条件最先控制后续列式。"
            ),
            "thought": f"我可能会看到熟悉的数值就直接套公式，忽略本题属于“{taxonomy['familyName']}”题族。",
            "check": f"先执行：{profile['first']}。再检查题设中的方向、接触、阶段或临界条件是否已经进入模型。",
            "correction": f"本题解析中的关键关系为：\n\n{formula}\n\n先建立关系，再决定哪些数值需要代入。",
            "takeaway": f"遇到同题族的新题，先复用模型结构，不复用表面数字。需要特别避免：{profile['misconception']}。",
        },
        {
            "title": "改变条件，检查结论是否仍成立",
            "prompt": (
                f"若只改变动画中的一个参数或题设中的一个条件，哪些关系保持不变，"
                f"哪些临界值、图像斜率或最终结论必须重新判断？"
            ),
            "thought": "我可能会认为动画外观相似，就说明原来的数值结论仍然成立。",
            "check": f"把变化前后都放回关系：\n\n{formula}\n\n逐项区分模型不变量与由参数决定的结果。",
            "correction": f"真正保持的是：{profile['invariant']}。数值结论需要在新条件下重新计算并检查边界。",
            "takeaway": "迁移题的关键不是换数，而是确认控制关系、系统边界和适用条件是否改变。",
        },
    ]
    for index, stage in enumerate(stages):
        preset = animation_preset(problem, 0.0 if index == 0 else 0.72, index == 1)
        if preset:
            stage["animationPreset"] = preset
    return {
        "generatedBy": GENERATOR_ID,
        "title": f"从“{taxonomy['familyName']}”开始探索",
        "opening": (
            f"先把“{problem['title']}”还原成可复用的物理模型。"
            "下面两步先要求预测和解释，再展开检验。"
        ),
        "stages": stages,
    }


def build_real_life_case(problem: dict, profile: dict, exact_family_source: dict | None) -> dict:
    taxonomy = problem["taxonomy"]
    skills = "、".join(taxonomy.get("skills", [])[:2]) or taxonomy["familyName"]
    formula = problem_formula(problem, profile)
    resource = copy.deepcopy(RESOURCES[profile["resource"]])
    resource["useFor"] = (
        f"用交互或教材内容复核本题涉及的“{skills}”，"
        "并把资源中的变量对应回题目的动画与图表。"
    )
    resource["matchReason"] = (
        f"该资源覆盖“{taxonomy['modelName']}”的核心关系，"
        f"可用于检验本题所属“{taxonomy['familyName']}”题族的建模步骤。"
    )
    result = {
        "generatedBy": GENERATOR_ID,
        "title": f"{profile['reality']}：现实中的“{taxonomy['familyName']}”",
        "scene": profile["scene"],
        "mapping": (
            f"{profile['mapping']} 当前题目“{problem['title']}”训练的"
            f"“{skills}”正是完成这种映射时需要识别的量。"
        ),
        "sharedModel": (
            f"本题可使用关系：\n\n{formula}\n\n"
            f"更一般的模型关系是：\n\n{profile['principle']}\n\n"
            f"{profile['invariant']}，因而动画与现实案例共享同一控制结构。"
        ),
        "realityFactors": profile["factors"],
        "authoritativeResources": [resource],
        "question": (
            f"把“{problem['title']}”改写成上述现实场景后，"
            "应测量哪三个物理量，怎样用同一主关系判断结果是否满足安全或运行边界？"
        ),
        "answer": (
            f"先测量题目所对应的状态量、控制参数和边界量，再按"
            f"“{profile['first']}”建立模型。可先使用：\n\n{formula}\n\n"
            "把测量值代入后，还必须检查方向、接触、阶段或临界条件；"
            "只有主方程和边界条件同时满足，现实结论才成立。"
        ),
        "rubric": [
            "指出现实对象与题目研究对象、过程边界的对应关系。",
            f"写出或说明关系 {formula}，并解释关键变量。",
            "说明至少一个现实修正因素，并完成安全或临界条件检查。",
        ],
    }
    if exact_family_source:
        videos = exact_family_source.get("realLifeCase", {}).get("videos", [])
        if videos:
            result["videos"] = copy.deepcopy(videos[:1])
    if "videos" not in result:
        video = curated_video(problem)
        if video:
            result["videos"] = [video]
    return result


def wrong_option(value: str, text: str, tag: str, feedback: str, prompt: str | None = None) -> dict:
    diagnosis = {"tag": tag, "feedback": feedback}
    if prompt:
        diagnosis["prompt"] = prompt
    return {"value": value, "text": text, "diagnosis": diagnosis}


def build_learning_cycle(problem: dict, profile: dict) -> dict:
    taxonomy = problem["taxonomy"]
    formula = problem_formula(problem, profile)
    prediction = {
        "title": f"播放前预测：{taxonomy['familyName']}",
        "prompt": (
            f"观察动画前，解决“{problem['title']}”时最合理的第一步是什么？"
        ),
        "answer": "B",
        "explanation": (
            f"正确起点是“{profile['first']}”。本题关系 {formula} "
            "只有在研究对象、方向、过程和边界确定后才有明确含义。"
        ),
        "options": [
            wrong_option(
                "A",
                "先把题目中的所有数值代入最熟悉的公式",
                "先算后建模",
                f"这样容易出现“{profile['misconception']}”的问题。",
                "先圈出研究对象、过程边界和方向，再写出不含数值的主方程。",
            ),
            {"value": "B", "text": profile["first"]},
            wrong_option(
                "C",
                "只根据动画轨迹外形直接判断答案",
                "把示意图当成定量证据",
                "动画用于呈现关系，比例和参数仍须由题设与方程确定。",
                "指出动画中哪一个量由参数控制，哪一个量必须通过公式计算。",
            ),
            wrong_option(
                "D",
                "先记住原题答案，再寻找能得到该答案的计算",
                "结论倒推动机",
                "先有结论会掩盖模型适用条件，条件改变后尤其容易误判。",
                "暂时遮住答案，只写模型、主关系和边界检查。",
            ),
        ],
    }
    review = {
        "title": f"延时复习：迁移“{taxonomy['familyName']}”",
        "prompt": "隔一段时间后再看同题族变式，下列处理方式正确的是（ ）。",
        "answer": "B",
        "explanation": (
            f"同题族迁移时应保留“{profile['invariant']}”这一模型不变量，"
            "同时根据新条件重算参数结果并重新检查边界。"
        ),
        "options": [
            wrong_option(
                "A",
                "题目名称相似，原题的数值答案可以直接沿用",
                "只看表面情境",
                "同一模型不等于同一参数，数值答案通常不能直接迁移。",
            ),
            {
                "value": "B",
                "text": "保留核心模型，重新代入条件并检查适用范围与临界边界",
            },
            wrong_option(
                "C",
                "只要公式相同，就不需要重新判断研究对象和过程",
                "忽略模型前提",
                "公式的物理量定义依赖研究对象、方向和过程边界。",
            ),
            wrong_option(
                "D",
                "动画看起来连续，就说明整个过程只能使用一个方程",
                "忽略分段",
                "接触、受力或运动性质改变时，即使画面连续也必须分段。",
            ),
        ],
    }
    return {
        "generatedBy": GENERATOR_ID,
        "intervalDays": [1, 3, 7, 14, 30],
        "prediction": prediction,
        "review": review,
    }


def normalize_option_analysis(problem: dict, profile: dict) -> None:
    analyses = problem.get("optionAnalyses")
    if not isinstance(analyses, list) or not analyses:
        return
    thinking = next(
        (item.get("thinking") for item in analyses if isinstance(item, dict) and item.get("thinking")),
        profile["first"],
    )
    formula = next(
        (item.get("formula") for item in analyses if isinstance(item, dict) and item.get("formula")),
        profile["principle"],
    )
    analysis = problem.get("analysis")
    if not isinstance(analysis, dict):
        analysis = {"title": "解析"}
        problem["analysis"] = analysis
    analysis.setdefault("sharedThinking", thinking)
    analysis.setdefault("sharedFormula", formula)
    for item in analyses:
        if isinstance(item, dict):
            item.pop("thinking", None)
            item.pop("formula", None)
    presentation = problem.setdefault("analysisPresentation", {})
    presentation["collapseEachStep"] = True
    presentation["optionMode"] = infer_option_mode(problem)


def option_text(option: object) -> str:
    if isinstance(option, dict):
        return str(option.get("text") or option.get("label") or option.get("title") or "")
    return str(option or "")


def infer_option_mode(problem: dict) -> str:
    question = str(problem.get("question") or "")
    independent_stem = re.compile(
        r"下列(?:说法|叙述|判断|选项)|(?:说法|叙述)中|"
        r"关于[^。；]{0,40}(?:说法|叙述)|判断下列"
    )
    if independent_stem.search(question):
        return "independent-statements"
    options = problem.get("options", [])
    compact = 0
    for option in options:
        text = re.sub(r"^\s*[A-H][.．、:：]?\s*", "", option_text(option), flags=re.I)
        if len(re.findall(r"[\u3400-\u9fff]", text)) <= 6:
            compact += 1
    if options and compact / len(options) >= 0.75:
        return "shared-solution"
    direct_answer_stem = re.compile(
        r"(?:求|计算|确定)[^。；]{0,80}"
        r"(?:值|大小|比值|范围|表达式|速度|时间|高度|距离|功率|功|加速度|角速度)|"
        r"(?:判断|确定)[^。；]{0,100}(?:之间的关系|方向及关系)|"
        r"(?:分别为|关系为|关系是)\s*[？?]?\s*$|"
        r"(?:为|是|等于|不能超过|至少为|至多为|可能为)\s*[（(][^）)]*[）)]"
    )
    if direct_answer_stem.search(question):
        return "shared-solution"
    return "independent-statements"


def required_two_sources(problems: list[dict]) -> tuple[dict[str, dict], dict[str, dict]]:
    by_family = {}
    by_model = {}
    for problem in problems:
        if problem.get("chapter") != "必修二结业测试":
            continue
        taxonomy = problem.get("taxonomy", {})
        by_family.setdefault(taxonomy.get("familyId"), problem)
        by_model.setdefault(taxonomy.get("modelId"), problem)
    return by_family, by_model


def enrich_problem(problem: dict, by_family: dict[str, dict]) -> None:
    if problem.get("chapter") in EXCLUDED_CHAPTERS:
        return
    taxonomy = problem.get("taxonomy", {})
    model_id = taxonomy.get("modelId")
    profile = MODEL_PROFILES.get(model_id)
    if not profile:
        raise ValueError(f"{problem.get('id')}: missing learning profile for {model_id}")
    normalize_option_analysis(problem, profile)
    exact_family_source = by_family.get(taxonomy.get("familyId"))
    exploration = problem.get("studentExploration")
    if not exploration or exploration.get("generatedBy") == GENERATOR_ID:
        problem["studentExploration"] = build_student_exploration(problem, profile)
    real_life = problem.get("realLifeCase")
    if not real_life or real_life.get("generatedBy") == GENERATOR_ID:
        problem["realLifeCase"] = build_real_life_case(problem, profile, exact_family_source)
    animation = problem.get("animation", {})
    if (
        animation.get("enabled") is True
        and animation.get("playable") is True
        and problem.get("id") not in HANDCRAFTED_LEARNING_CYCLE_IDS
    ):
        cycle = problem.get("learningCycle")
        if not cycle or cycle.get("generatedBy") == GENERATOR_ID:
            problem["learningCycle"] = build_learning_cycle(problem, profile)
    if exact_family_source and exact_family_source.get("examConnections"):
        connections = copy.deepcopy(exact_family_source["examConnections"])
        for item in connections:
            item["matchReason"] = (
                f"该真题与当前题同属“{taxonomy['familyName']}”题族，"
                "核心约束、主方程和边界检查一致；差别主要在情境、数据或设问层级。"
            )
        problem.setdefault("examConnections", connections)


def render_json(problem: dict) -> str:
    return json.dumps(problem, ensure_ascii=False, indent=2) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true", help="write missing learning content")
    args = parser.parse_args()

    paths = problem_paths()
    loaded = [(path, load_problem(path)) for path in paths]
    by_family, _ = required_two_sources([problem for _, problem in loaded])
    pending = []
    for path, problem in loaded:
        original = render_json(problem)
        enrich_problem(problem, by_family)
        updated = render_json(problem)
        if updated == original:
            continue
        pending.append(path)
        if args.write:
            path.write_text(updated, encoding="utf-8")

    action = "updated" if args.write else "pending"
    print(f"{len(pending)} problem file(s) {action}")
    if pending and not args.write:
        for path in pending[:20]:
            print(f"  {path.relative_to(ROOT)}")
        if len(pending) > 20:
            print(f"  ... and {len(pending) - 20} more")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
