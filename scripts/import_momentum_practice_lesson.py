#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "problems"
CHAPTER = "动量守恒定律习题课"

PROBLEMS = [
    ("football_header", "足球头球冲量", r"足球由静止下落，被运动员用头竖直顶起，离开头部后仍回到原下落点，空气阻力不可忽略。判断重力冲量、头部做功、动量变化和头部冲量（单选）。", ["A. 足球下落和上升过程重力的冲量相等", "B. 头向上顶球的过程中，头部对足球做正功", "C. 头向上顶球的过程中，足球的动量变化量大小为 0", "D. 头向上顶球的过程中，头对足球的冲量等于足球动量的变化量"], "B", r"受空气阻力时上升和下降过程不对称，重力冲量不相等。接触时头部作用力向上且球发生向上位移，头部做正功。接触阶段还有重力冲量，因此头部冲量不单独等于总动量变化。", "impulse", 2, "L1"),
    ("pressure_washer", "高压水枪冲洗汽车", r"高压水枪喷水柱直径为 \(D\)，水流速度为 \(v\)，水柱垂直汽车表面且冲击后速度为零，水密度为 \(\rho\)。判断质量流率、冲力和速度加倍后的压强（单选）。", [r"A. 单位时间喷水质量为 \(\rho\pi vD^2\)", r"B. 单位时间喷水质量为 \(\frac14\rho\pi vD^2\)", r"C. 水柱对汽车平均冲力为 \(\frac14\rho\pi D^2v^2\)", "D. 出水速度变为 2 倍时，水对汽车的压强变为 4 倍"], "BCD", r"截面积 \(S=\pi D^2/4\)，质量流率 \(\dot m=\rho Sv\)，冲力 \(F=\dot m v=\rho Sv^2\)。平均压强 \(p=F/S=\rho v^2\)，故速度加倍时变为 4 倍。", "flow", 2, "L1"),
    ("wind_tunnel", "娱乐风洞悬浮", r"质量为 \(m\) 的游客静止在半径为 \(R\) 的圆柱形竖直风洞内，受风投影面积为 \(S\)，空气密度为 \(\rho\)，气流向上且撞击人体后速度变为零。判断悬浮风速及风速改变后的加速度（单选）。", ["A. 风速不变时，受风面积改变仍能静止", r"B. 气流速度为 \(\sqrt{mg/(\pi\rho R^2)}\)", r"C. 风速变为原来一半时，向下加速度为 \(g/2\)", r"D. 风速变为原来 2 倍时，向上加速度为 \(3g\)"], "D", r"风力为 \(F=\rho Sv^2\)，悬浮时等于 \(mg\)。风速减半时风力为 \(mg/4\)，向下加速度为 \(3g/4\)；风速加倍时风力为 \(4mg\)，净力为 \(3mg\)，向上加速度为 \(3g\)。", "flow", 3, "L2"),
    ("linear_drag_throw", "线性阻力竖直上抛", r"从地面以初速度 \(v_0\) 竖直向上抛出质量为 \(m\) 的球，空气阻力与速率成正比。球在 \(t_1\) 时到达最高点，落地速率为 \(v_1\)，且落地前已做匀速运动。求速率—时间图像、最大高度和总飞行时间。", None, None, r"设阻力系数为 \(k\)，记 \(b=k/m\)。上升段 \(v=(v_0+g/b)e^{-bt}-g/b\)，故 \(t_1=b^{-1}\ln(1+bv_0/g)\)，最大高度 \[H=\frac{v_0}{b}-\frac{g}{b^2}\ln\!\left(1+\frac{bv_0}{g}\right).\] 下降段由静止趋近终端速率 \(g/b\)。若以落地速率 \(v_1\) 表示下降时间，则 \(t_2=-b^{-1}\ln(1-bv_1/g)\)，总时间为 \(t_1+t_2\)。", "drag", 5, "L3"),
    ("moving_bowl", "小球在可动半圆槽中", r"物体 \(A、B\) 质量分别为 \(m、2m\)，\(B\) 置于光滑水平面，顶部有半径为 \(R\) 的半圆槽。将质点 \(A\) 从圆槽右侧顶端由静止释放，忽略摩擦，判断系统动量、槽的最大位移和最低点速度（单选）。", ["A. A、B 组成系统的总动量守恒", r"B. B 向右运动的最大位移为 \(2R/3\)", r"C. A 到最低点时速率为 \(\sqrt{gR/3}\)", r"D. A 到最低点时 B 的速率为 \(\sqrt{4gR/3}\)"], "B", r"系统只有水平方向动量守恒。A 从右端运动到左端时相对槽水平位移为 \(-2R\)，由质心水平位置不变得槽向右最大位移 \(2R/3\)。最低点由 \(mv_A+2mv_B=0\) 和机械能守恒可得 \(|v_A|=\sqrt{4gR/3}\)、\(|v_B|=\sqrt{gR/3}\)。", "constraint", 4, "L2"),
    ("two_planks_slider", "双平板车上的滑块", r"两长平板车 \(A、B\) 各长 \(1.5\,\mathrm m\)、质量均为 \(2\,\mathrm{kg}\)，开始紧靠并以 \(6\,\mathrm{m/s}\) 向右运动。质量也为 \(2\,\mathrm{kg}\) 的物块 \(C\) 轻放在 \(B\) 右端，\(C\) 与两车间动摩擦因数均为 \(0.6\)。求最终速度及 \(C\) 的最终位置。", None, None, r"车 A 会通过接触推动车 B，使两车在滑动阶段保持同速。两车整体加速度为 \(-\mu g/2=-3\,\mathrm{m/s^2}\)，C 的加速度为 \(\mu g=6\,\mathrm{m/s^2}\)。相对加速度为 \(9\,\mathrm{m/s^2}\)，经过 \(2/3\,\mathrm s\) 三者共速 \(4\,\mathrm{m/s}\)。C 相对车向左移动 \(2\,\mathrm m\)，最终停在 A 上距其左端 \(1.0\,\mathrm m\) 处。", "friction", 4, "L2"),
    ("possible_pendulum_height", "等质量摆球碰撞的可能高度", r"两个完全相同的小球 \(A、B\) 用等长 \(L\) 的细线悬于同一点。将 \(A\) 从与竖直方向成 \(60^\circ\) 的位置静止释放。A 与静止的 B 碰撞后，B 第一次速度为零时上升高度可能是（多选）。", [r"A. \(3L/4\)", r"B. \(L/4\)", r"C. \(L/8\)", r"D. \(L/10\)"], "BC", r"碰前 A 的速率满足 \(u^2=gL\)。设碰后 B 速率为 \(xu\)，由动量守恒、动能不增加和碰后分离条件得到 \(1/2\le x\le1\)。因此 \(h_B=x^2L/2\) 的范围为 \(L/8\le h_B\le L/2\)，选项中 \(L/4、L/8\) 均可能。", "collision", 4, "L2"),
    ("wall_ball_chain", "挡板与十球连续碰撞", r"光滑水平面左侧固定竖直弹性挡板，右侧依次放置 10 个质量均为 \(3m\) 的弹性白球。质量为 \(m\) 的黑球以速度 \(v_0\) 与 1 号球弹性正碰，黑球与挡板也发生弹性碰撞，白球之间均为弹性正碰。判断最终速度和碰撞次数（多选）。", [r"A. 黑球最终速度大小为 \((1/2)^{10}v_0\)", r"B. 黑球最终速度大小为 \((3/4)^{10}v_0\)", "C. 小球之间总共发生 55 次碰撞", r"D. 10 号球最终速度为 \(v_0/4\)"], "AC", r"每轮中黑球与当前静止的 \(3m\) 白球碰撞后反弹，速率减半，再经挡板反弹继续追赶；白球间等质量碰撞把速度向右传递。第 \(k\) 轮需发生 \(11-k\) 次球间碰撞，因此总数为 \(10+9+\cdots+1=55\)。黑球最终速率为 \((1/2)^{10}v_0\)，10 号球最终速率为 \(v_0/2\)。", "collision", 5, "L3"),
    ("mobile_curved_tube", "可动车载弯管再探", r"质量为 \(2m\) 的小车上固定光滑弯曲圆管，整体静止在光滑水平面。质量为 \(m\) 的小球以速度 \(v\) 从左端滑入，恰能到达管道最高点并从右端滑离。判断小车位置、离车相对速度、最高点高度及小车动量变化（单选）。", ["A. 小球滑离小车时，小车回到原来位置", r"B. 小球滑离时相对小车速度大小为 \(v/3\)", r"C. 管道中心线最高点距车上表面的竖直高度为 \(v^2/(3g)\)", r"D. 从滑入到最高点，小车动量变化大小为 \(mv/3\)"], "AC", r"始末小球相对小车位置相同，质心水平位置不变使小车回到原位。临界最高点球与车共速 \(v/3\)，由能量守恒得高度 \(v^2/(3g)\)。滑离时相对速率恢复为 \(v\)；最高点小车动量为 \(2mv/3\)。", "constraint", 4, "L2"),
    ("gravity_assist", "行星引力弹弓", r"以太阳为参考系，探测器以速率 \(v_0\) 正面迎向以速率 \(u\) 反向运动的行星。把引力助推看作探测器相对行星的一维弹性反射，探测器绕过行星后反向远离。求其离开时速率（单选）。", [r"A. \(v_1=v_0\)", r"B. \(v_1=v_0+u\)", r"C. \(v_1=2v_0+u\)", r"D. \(v_1=v_0+2u\)"], "D", r"在行星参考系中，探测器接近速度为 \(v_0+u\)，弹性反射后大小不变、方向反向。换回太阳参考系还要叠加行星速度 \(-u\)，故离开速率为 \(v_0+2u\)。", "collision", 3, "L2"),
    ("sticky_carts_spring", "粘连小车压缩弹簧", r"光滑水平面上三辆小车 A、B、C 共线，\(m_A=m_B=m\)，\(m_C=2m\)，C 固定一水平轻弹簧。A 以速度 \(v\) 向左与 B 碰撞后粘连，再压缩弹簧。判断全过程守恒量、碰后速度、最大弹性势能和弹簧恢复原长时 C 的速度（多选）。", ["A. 整个相互作用过程中系统动量和机械能均守恒", r"B. A、B 碰撞后的速度为 \(v/2\)", r"C. 弹簧最大弹性势能为 \(mv^2/2\)", r"D. 弹簧再次恢复原长时，C 的速度为 \(v/2\)"], "BD", r"A、B 粘连使机械能减少，但动量守恒，碰后 AB 速度为 \(v/2\)。随后 AB 与 C 质量都为 \(2m\)，通过理想弹簧交换速度；弹簧恢复原长时 C 获得 \(v/2\)。最大弹性势能为碰后动能与共速动能之差，即 \(mv^2/8\)。", "spring", 4, "L2"),
    ("spring_velocity_graph", "弹簧双块速度图像复习", r"轻弹簧连接质量为 \(m_1、m_2\) 的两物块并静止在光滑水平面。令 \(m_1\) 瞬时获得向右 \(3\,\mathrm{m/s}\) 的速度，图示为两物块速度—时间关系。判断弹簧状态、位置、质量比和能量比（单选）。", ["A. t1、t3 时弹簧均压缩且势能最大", "B. t4 时弹簧恢复原长，两物块回到出发位置", r"C. \(m_1:m_2=2:1\)", r"D. t3 时 \(E_k:E_p=1:2\)"], "D", r"由图中 \(t_2\) 时 \(v_1=-1\,\mathrm{m/s},v_2=2\,\mathrm{m/s}\) 与初态动量守恒得 \(3m_1=-m_1+2m_2\)，即 \(m_1:m_2=1:2\)。t3 两物块同速 \(1\,\mathrm{m/s}\)，总能量为 \(9m_1/2\)，动能为 \(3m_1/2\)，故 \(E_k:E_p=1:2\)。", "spring", 4, "L2"),
    ("pendulum_plank_step", "摆球切线滑板碰台阶", r"木板 A 质量为 \(2m\)，静止在光滑水平面上，左端距固定台阶 \(x\)。质量为 \(m\) 的滑块 B 由长为 \(L\) 的细线连接，先在水平位置获得竖直向下初速度 \(v_0\)，到最低点时细线恰好被拉断，随后从 A 右端滑入。A、B 间动摩擦因数为 \(\mu\)，细线最大拉力为 \(5mg\)，A 足够长。求 \(v_0、v_1\)，使 A 与台阶只碰一次的 \(x\) 条件，并讨论碰台阶前瞬间速度。", None, None, r"最低点前机械能守恒：\(v_1^2=v_0^2+2gL\)。最低点张力 \(T=mg+mv_1^2/L\le5mg\)，故 \(v_1\le2\sqrt{gL}\)、\(v_0\le\sqrt{2gL}\)。滑动时 A 向左加速度为 \(\mu g/2\)，B 向右加速度为 \(\mu g\)。令 \(q=\sqrt{\mu gx}\)，碰台阶前 \(v_A=-q\)，\(v_B=-v_1+2q\)。为在相对滑动结束前碰台阶且碰后整体不再返回台阶，应满足 \[\frac{v_1^2}{16\mu g}\le x\lt\frac{v_1^2}{9\mu g}.\]", "composite", 5, "L3"),
    ("bullet_bag_cart", "子弹砂袋悬挂小车", r"光滑水平轨道上小车质量为 \(M_2\)，车下用长为 \(L\) 的绳悬挂质量为 \(M_1\) 的砂袋。质量为 \(m\) 的子弹水平射入砂袋并不穿出，砂袋与子弹一起摆过角度 \(\theta\)。求子弹速度 \(v_0\)、小车最大速度和悬线最大拉力。", None, None, r"碰撞瞬间砂袋与子弹速度 \(u=mv_0/(M_1+m)\)。摆到最大角时各部分水平共速 \(V=mv_0/(M_1+M_2+m)\)。由碰后到最高点机械能守恒，\[v_0=\frac{M_1+m}{m}\sqrt{\frac{2(M_1+M_2+m)gL(1-\cos\theta)}{M_2}}.\] 第一摆程中小车最大速度为 \(V\)。最低点刚碰后悬线拉力最大：\[T_{\max}=(M_1+m)\left(g+\frac{u^2}{L}\right).\]", "composite", 5, "L3"),
]

PRACTICE = {
    "impulse": ("进阶近似题：接触冲量分解", r"球以已知速度斜向撞击运动挡板，已知接触时间和恢复系数。求挡板冲量及重力冲量占总动量变化的比例。", r"在法向—切向坐标中写 \(\vec I_G+\vec I_N=\Delta\vec p\)。", "先统一参考系，再逐分量作末动量减初动量。"),
    "flow": ("进阶近似题：弯管射流受力", r"稳定水流以速度 \(v_1\) 进入弯管，以速度 \(v_2\) 沿另一方向射出，质量流率为 \(\dot m\)。求管壁受力。", r"\(\vec F_{\rm fluid}=\dot m(\vec v_2-\vec v_1)\)，管壁受力反向。", "连续流问题按单位时间通过控制体的动量变化处理。"),
    "drag": ("进阶近似题：线性阻力分段反演", r"给出上抛物体的最高点时刻和终端速度，反求阻力系数、初速度与落地时间。", r"分别使用 \(m\dot v=-mg-kv\) 与 \(m\dot v=-mg+kv\) 的指数解。", "上升与下降的阻力方向不同，必须分段建立微分方程。"),
    "constraint": ("进阶近似题：可动曲面质心位移", r"质点沿可水平移动的非对称光滑曲面运动，给出相对位移和高度差，求载体位移及关键点速度。", "水平质心位置不变处理位移，水平动量和机械能联立处理速度。", "位移约束与速度守恒是两个不同层面的方程。"),
    "friction": ("进阶近似题：多板相对滑动", r"多个相邻平板与滑块质量、摩擦因数不同，判断板间是否分离并求最终停留位置。", "先比较各物体自由加速度，确定接触力和共同运动阶段，再积分相对运动。", "不能默认相邻板始终同速，接触力只能推不能拉。"),
    "collision": ("进阶近似题：碰撞可行域", r"给定质量比和碰前速度，求所有满足动量守恒、动能不增加及碰后分离的末速度范围。", "用动量守恒消去一个末速度，再叠加能量不等式和分离不等式。", "物理解必须同时满足守恒、耗散和碰撞结束条件。"),
    "spring": ("进阶近似题：粘连后弹簧交换", r"物体先发生完全非弹性碰撞，再与另一物体通过弹簧作用。求最大弹性势能和再次原长时速度。", "碰撞阶段只用动量；弹簧阶段再用动量与机械能。", "两阶段的系统相同但守恒量不同。"),
    "composite": ("进阶近似题：碰撞—摆动—载体综合", r"子弹射入摆块后带动可动载体，摆至某角度再与限位器碰撞。求各阶段速度、能量损失和约束力。", "依次处理短碰撞、可动摆、限位碰撞，并在每阶段重选初末状态。", "用时间顺序组织方程，避免跨越非弹性碰撞使用机械能守恒。"),
}

def make_problem(item, number):
    slug, name, question, options, answer, explanation, family, difficulty, level = item
    ptitle, pq, pa, pt = PRACTICE[family]
    problem_id = f"momentum_practice_lesson3_course_{number:02d}_{slug}"
    return {
        "id": problem_id, "chapter": CHAPTER, "title": f"例{number}：{name}", "question": question,
        "options": options, "answer": answer,
        "analysis": {"title": "解析", "sharedThinking": "先划分过程并明确研究系统，再检查外力冲量、机械能变化和约束条件。", "sharedFormula": r"\[\vec I_{\rm ext}=\Delta\vec p,\qquad \sum\vec p_{\rm i}=\sum\vec p_{\rm f}\]"},
        "analysisPresentation": {"collapseEachStep": True, "optionMode": "independent-statements" if options and any(x in question for x in ("判断", "说法")) else "shared-solution"},
        "steps": [
            {"title": "条件提取", "content": "标出关键时刻、速度方向、相互作用阶段及题目给出的临界条件。"},
            {"title": "系统与规律", "content": "逐阶段选择研究系统；动量、机械能和质心关系只在各自适用条件下使用。"},
            {"title": "计算与判断", "content": explanation},
            {"title": "结论", "content": (f"答案为 **{answer}**。" if answer else "计算结果见上一步。") + "检查方向、量纲、能量范围及碰后分离条件。"},
        ],
        "knowledge": ["动量守恒", "动量综合", name],
        "practice": {"title": ptitle, "question": pq, "answer": pa, "thinking": pt, "difficulty": "equal-or-higher", "upgradeType": "same-concept-structural-transfer"},
        "animation": {"enabled": True, "level": "animated", "type": "momentum_practice_model", "variant": slug, "playable": True, "interactive": True, "notes": f"按“{name}”原题过程显示运动、动量交换和关键临界状态。", "params": {"mass": {"label":"基准质量","value":1,"min":0.2,"max":5,"step":0.1,"unit":"kg"}, "speed": {"label":"特征速度","value":6,"min":1,"max":12,"step":0.5,"unit":"m/s"}, "factor": {"label":"条件系数","value":0.5,"min":0.1,"max":1.5,"step":0.1,"unit":""}}, "timeline": {"duration": 9 if difficulty >= 5 else 7, "loop": False}},
        "taxonomy": {"module":"力学","topic":CHAPTER,"modelId":"momentum-practice","modelName":"动量守恒综合","familyId":f"momentum-practice-{family}","familyName":{"impulse":"冲量辨析","flow":"连续介质动量流","drag":"阻力动量综合","constraint":"可动约束与质心","friction":"多物体摩擦动量","collision":"碰撞可行性与传递","spring":"弹簧动量能量","composite":"多阶段动量综合"}[family],"role":"综合题" if difficulty>=5 else ("母题" if number==1 else "条件变式"),"difficulty":difficulty,"variantLevel":level,"skills":["分阶段选择系统","动量能量联合"],"prerequisites":["动量定理","机械能与牛顿定律"]},
    }

def main():
    created=[]
    for number,item in enumerate(PROBLEMS,1):
        problem=make_problem(item,number); path=OUT/f"{problem['id']}.json"; path.write_text(json.dumps(problem,ensure_ascii=False,indent=2)+"\n",encoding="utf-8"); created.append((problem["id"],path.name))
    index_path=OUT/"index.json"; index=json.loads(index_path.read_text(encoding="utf-8")); known={item["id"] for item in index["problems"]}; index["problems"].extend({"id":pid,"file":name} for pid,name in created if pid not in known); index_path.write_text(json.dumps(index,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(f"created {len(created)} momentum practice problems")

if __name__ == "__main__": main()
