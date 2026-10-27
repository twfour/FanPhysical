#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "problems"
CHAPTER = "电场强度与电势能"

COURSE = [
    {"slug":"field_definition","name":"电场强度的定义","type":"single-choice","question":r"在电场中的某点放一个电荷量为 \(q\) 的试探电荷，受到的静电力为 \(F\)，该点电场强度为 \(E=F/q\)。下列说法正确的是（　）。","options":["A. 移去试探电荷后，该点电场强度为 0","B. 试探电荷电荷量变为 \(4q\) 后，该点场强变为 \(4E\)","C. 试探电荷变为 \(-2q\) 后，该点场强大小不变、方向相反","D. 试探电荷变为 \(-2q\) 后，该点场强大小和方向均不变"],"answer":"D","explanation":r"电场强度是源电荷产生的电场本身的性质，定义式 \(\vec E=\vec F/q\) 中试探电荷只用于测量。改变或移去试探电荷不会改变该点的 \(\vec E\)；负试探电荷所受电场力方向与 \(\vec E\) 相反。","family":"definition","difficulty":1,"level":"L0"},
    {"slug":"dipole_field_lines","name":"等量异种电荷的场强比较","type":"multiple-choice","question":r"图甲为等量异种点电荷的电场线，图乙中 \(O\) 为两电荷连线中点，\(E、F\) 关于 \(O\) 对称且位于中垂线上，\(A、D\) 与 \(B、C\) 也分别关于 \(O\) 对称。下列说法正确的是（多选）。","options":["A. B、C 两点场强大小和方向都相同","B. A、D 两点场强大小相等、方向相反","C. E、O、F 三点中 O 点场强最大","D. B、O、C 三点中 O 点场强最大"],"answer":"AC","explanation":r"等量异号电荷的电场关于连线中点中心对称。\(B、C\) 处合场强均由正电荷指向负电荷且大小相等；\(A、D\) 处方向也相同。中垂线上离 \(O\) 越远，两个场强的水平分量越小，因此 \(O\) 大于 \(E、F\)；在两电荷之间越靠近电荷场强越大，所以 \(O\) 不是 \(B、O、C\) 中最大。","family":"superposition","difficulty":2,"level":"L1"},
    {"slug":"charged_ring_three_points","name":"圆环三点电荷场强约束","type":"multiple-choice","question":r"绝缘圆环固定在竖直平面内，点电荷固定在 \(A、B、C\) 三点，\(AC\) 过圆心 \(O\)，\(\angle CAB=60^\circ\)，\(B\) 点电荷为 \(+Q\)。测得 \(O\) 点合场强平行于 \(BC\)。下列判断正确的是（多选）。","options":["A. O 点场强沿 BC 由 B 指向 C","B. O 点场强沿 BC 由 C 指向 B",r"C. A、C 处电荷可以分别为 \(+\frac12Q、-\frac12Q\)","D. A、C 处电荷可以分别为 \(-Q、-2Q\)"],"answer":"ACD","explanation":r"三点到圆心距离相等，把各场强沿水平、竖直方向分解。合场强平行 \(BC\) 要求竖直分量抵消，得到 \(q_A-q_C=Q\)；此时水平合场强恒沿 \(B\to C\)。选项 C、D 的两组电荷都满足该约束。","family":"superposition","difficulty":4,"level":"L2"},
    {"slug":"charged_pendulum","name":"带电小球斜悬平衡","type":"single-choice","question":r"在水平方向匀强电场中，质量为 \(m\)、电荷量为 \(-q\) 的小球由绝缘丝线悬挂并静止，丝线与竖直方向夹角为 \(60^\circ\)，重力加速度为 \(g\)。匀强电场的大小和方向为（　）。","options":[r"A. \(\dfrac{mg\tan60^\circ}{q}\)，水平向左",r"B. \(\dfrac{mg\tan60^\circ}{q}\)，水平向右",r"C. \(\dfrac{mg\sin60^\circ}{q}\)，水平向左",r"D. \(\dfrac{mg\sin60^\circ}{q}\)，水平向右"],"answer":"A","explanation":r"平衡时 \(qE=mg\tan60^\circ\)。小球向右偏，所受电场力向右；因小球带负电，电场方向与电场力相反，即水平向左。","family":"equilibrium","difficulty":2,"level":"L1"},
    {"slug":"two_ball_strings","name":"串联带电小球平衡","type":"single-choice","question":r"质量均为 \(m\) 的甲、乙小球带电量分别为 \(3q\) 和 \(-q\)，两球用等长绝缘细线串联，甲球再悬于天花板。空间存在水平向左的匀强电场，忽略两球间相互作用。平衡位置可能是图中的（　）。","options":["A. 图 A","B. 图 B","C. 图 C","D. 图 D"],"answer":"C","explanation":r"把两球看成整体，总电荷为 \(+2q\)，整体电场力向左，所以上段细线应向左下方倾斜。对乙球单独分析，负电荷所受电场力向右，下段细线对乙球的拉力必须含向左分量，因此乙球位于甲球右下方。只有图 C 同时满足。","family":"equilibrium","difficulty":3,"level":"L2"},
    {"slug":"charged_ring_axis","name":"均匀带电圆环轴线场强","type":"single-choice","question":r"半径为 \(R\) 的圆环均匀带电，总电荷量为 \(Q\)。轴线上点 \(P\) 到环心 \(O\) 的距离为 \(L\)，静电力常量为 \(k\)。\(P\) 点场强为（　）。","options":[r"A. \(\dfrac{kQ}{L^2}\)",r"B. \(\dfrac{kQ}{R^2}\)",r"C. \(\dfrac{kLQ}{(R^2+L^2)^{3/2}}\)",r"D. \(\dfrac{kRQ}{(R^2+L^2)^{3/2}}\)"],"answer":"C","explanation":r"把圆环分成成对对称的电荷元，垂直轴线的场强分量相互抵消，轴向分量相加。由 \(r=\sqrt{R^2+L^2}\)、\(\cos\alpha=L/r\)，积分得 \(E=kQL/(R^2+L^2)^{3/2}\)。","family":"continuous-charge","difficulty":3,"level":"L2"},
    {"slug":"charged_hemisphere","name":"均匀带电半球面场强","type":"calculation","question":r"均匀带电半球面总电荷量为 \(Q\)。球心 \(O\) 到轴线上 \(M、N\) 两点的距离均为 \(L\)，在 \(N\) 点的场强大小为 \(E\)。求 \(M\) 点的场强大小。","options":None,"answer":r"\(E_M=\dfrac{2kQ}{L^2}-E\)","explanation":r"补上关于球心对称的另一个半球可组成总电荷量为 \(2Q\) 的均匀球壳。轴外点距球心为 \(L\)，完整球壳产生的场强为 \(2kQ/L^2\)。由镜像半球在 \(N\) 点的场强大小等于原半球在 \(M\) 点的场强，且两者与已知场强同向叠加，故 \(E+E_M=2kQ/L^2\)。","family":"continuous-charge","difficulty":4,"level":"L2"},
    {"slug":"field_line_trajectory","name":"场线与带电粒子轨迹","type":"single-choice","question":r"实线 \(a、b、c\) 是方向未知的三条电场线，虚线是一带正电质点仅在电场力作用下的运动轨迹，\(P、Q\) 为轨迹上的点。下列判断正确的是（　）。","options":["A. P 点电场线方向斜向左上方","B. 粒子一定从 Q 运动到 P","C. 粒子通过 Q 点时速度较小","D. 粒子通过 Q 点时加速度较大"],"answer":"D","explanation":r"轨迹在某点的切线给速度方向，弯曲的凹侧给加速度方向，但不能据此唯一判定运动先后。电场线在 \(Q\) 附近更密，因此 \(E_Q>E_P\)，同一粒子有 \(a_Q>a_P\)。","family":"trajectory","difficulty":3,"level":"L2"},
    {"slug":"negative_work_potential","name":"电场力负功与电势能","type":"multiple-choice","question":r"在静电场中，将一正电荷从 \(a\) 点移到 \(b\) 点，电场力做负功。下列说法正确的是（多选）。","options":["A. b 点场强一定比 a 点大","B. 电场线方向一定从 b 指向 a","C. 电荷在 b 点的电势能一定比在 a 点大","D. 电荷的动能可能增加"],"answer":"CD","explanation":r"由 \(W_{ab}=-\Delta E_p\)，电场力做负功意味着 \(E_{pb}>E_{pa}\)。功只决定电势差，不能确定两点场强大小或电场线具体方向。若另有外力做更多正功，电荷动能仍可能增加。","family":"potential-energy","difficulty":2,"level":"L1"},
    {"slug":"potential_energy_curve","name":"点电荷电势能图像","type":"multiple-choice","question":r"在 \(x\) 轴上 \(O、P\) 两点放置电荷量为 \(q_1、q_2\) 的点电荷，正试探电荷的电势能 \(E_p\) 随 \(x\) 的关系如图。\(A、B\) 两点电势能为零，\(BD\) 段中 \(C\) 点电势能最大。下列判断正确的是（多选）。","options":[r"A. \(q_1、q_2\) 均为正且 \(q_1>q_2\)","B. B、C 间场强沿 x 轴负方向","C. C 点场强大于 A 点场强","D. 负电荷从 B 移到 D，电场力先做正功后做负功"],"answer":"BD","explanation":r"对正试探电荷有 \(E_x=-\frac1q\frac{dE_p}{dx}\)。\(B\to C\) 曲线上升，故场强沿负方向；\(C\) 为极值点，场强为零。负电荷的势能曲线与图示相反，所以从 B 到 C 势能降低、电场力做正功，从 C 到 D 势能升高、电场力做负功。","family":"potential-graph","difficulty":4,"level":"L2"},
]

HOMEWORK = [
    {"slug":"arc_cut_field","name":"带电圆弧裁切","type":"single-choice","question":r"粗细均匀的绝缘 \(3/4\) 圆环均匀带电，在圆心产生场强 \(E\)。裁掉 \(1/3\) 后成为半圆环，线电荷密度不变。半圆环在圆心的场强为（　）。","options":[r"A. \(\frac23E\)",r"B. \(\frac12E\)",r"C. \(\sqrt2E\)",r"D. \(\frac{\sqrt2}{2}E\)"],"answer":"C","explanation":r"\(3/4\) 圆环的场强等于被缺去的 \(1/4\) 圆弧场强的反向量，其大小为 \(\sqrt2k\lambda/R\)。半圆弧场强为 \(2k\lambda/R\)，故比值为 \(\sqrt2\)。","family":"continuous-charge","difficulty":3,"level":"L2"},
    {"slug":"two_charges_uniform_field","name":"匀强电场中的双球悬挂","type":"single-choice","question":r"水平向右的匀强电场中，带电小球 \(P、Q\) 用相同绝缘细绳悬挂，细绳均竖直。\(N\) 是 \(PQ\) 中点，\(M\) 在 \(N\) 正上方且 \(MPQ\) 为等边三角形。下列说法正确的是（　）。","options":["A. P 带负电、Q 带正电，且电量大小相等","B. P、Q 质量一定相等","C. 叠加场中 N 点场强为零","D. 叠加场中 M 点场强不为零"],"answer":"A","explanation":r"两绳竖直说明每球水平方向合力为零，故两球异号且左负右正；分别列平衡式可知电量大小相等。质量只影响绳的拉力。由几何与叠加可得 \(N\) 点场强不为零，而 \(M\) 点两电荷场强的水平合量恰与匀强电场抵消。","family":"superposition","difficulty":4,"level":"L2"},
    {"slug":"electrostatic_smoke","name":"静电除烟演示","type":"single-choice","question":r"塑料瓶中，铁锯条接静电起电机负极，金属片接正极。点燃蚊香后摇动起电机，瓶内烟雾很快消失。下列说法正确的是（　）。","options":["A. 瓶内是匀强电场","B. 锯条附近场强较小","C. 烟尘最终吸附到金属片上","D. 烟尘被吸附过程中电势能增大"],"answer":"C","explanation":r"尖锐锯齿附近场强很强，空气电离后烟尘通常获得负电并在电场力作用下迁移到正极金属片。该过程中电场力做正功，烟尘电势能降低。","family":"application","difficulty":2,"level":"L1"},
    {"slug":"double_pendulum_field","name":"串联异号小球平衡","type":"single-choice","question":r"两段等长细线串接两个等质量小球 \(a、b\)，悬于 \(O\) 点。\(a\) 带 \(+2q\)，\(b\) 带 \(-q\)，空间加水平向右匀强电场。平衡位置可能是图中的（　）。","options":["A. 图 A","B. 图 B","C. 图 C","D. 图 D"],"answer":"C","explanation":r"整体总电荷为 \(+q\)，所受电场力向右，因此上段线向右下方倾斜。对 \(b\) 球，电场力向左，故下段线必须给出向右的拉力分量，\(b\) 位于 \(a\) 的左下方。由 \(\tan\beta=2\tan\alpha\) 可知下段偏角更大，只有图 C 符合。","family":"equilibrium","difficulty":3,"level":"L2"},
    {"slug":"electrostatic_precipitator","name":"静电除尘器轨迹","type":"single-choice","question":r"静电除尘装置由机械过滤网、负放电极和正集尘板组成，虚线是忽略重力的带电烟尘轨迹，\(A、B\) 为轨迹上的点。下列说法正确的是（　）。","options":["A. 烟尘颗粒带正电","B. 颗粒做匀变速曲线运动","C. A 点场强小于 B 点场强","D. 从 A 到 B 电场力先做负功后做正功"],"answer":"C","explanation":r"烟尘受电离后通常带负电，最终被正集尘板吸附。放电极附近场线更密，图中 \(B\) 更靠近放电极，故 \(E_B>E_A\)。电场非匀强，所以加速度并非常量。","family":"application","difficulty":3,"level":"L2"},
    {"slug":"potential_curve_force","name":"电势能曲线与电场力","type":"single-choice","question":r"两个点电荷 \(Q_1、Q_2\) 固定在 \(x\) 轴上，正试探电荷 \(q\) 的电势能分布如图。下列说法正确的是（　）。","options":[r"A. \(Q_1、Q_2\) 的位置都在 \(x_1\) 左侧",r"B. \(q\) 在 \(x_2\) 处受到的电场力最大",r"C. \(q\) 从 \(x_1\) 到 \(x_3\) 时电场力先做正功后做负功",r"D. 从 \(x_1\) 到 \(x_3\) 场强先增大后减小"],"answer":"A","explanation":r"曲线在 \(x_1\) 右侧连续且无发散点，说明两个源电荷均位于 \(x_1\) 左侧。\(x_2\) 为势能极值，\(dE_p/dx=0\)，故电场力为零。\(x_1\to x_2\) 势能增加、电场力做负功；随后势能降低、电场力做正功。","family":"potential-graph","difficulty":4,"level":"L2"},
    {"slug":"image_charge_plane","name":"导体平面的镜像电荷","type":"single-choice","question":r"无穷大导体占据 \(z<0\) 空间，点电荷 \(q\) 位于 \(z=h\)。静电平衡时导体内部场强为零。求 \(z=h/2\) 处场强大小。","options":[r"A. \(\dfrac{4kq}{h^2}\)",r"B. \(\dfrac{4kq}{9h^2}\)",r"C. \(\dfrac{32kq}{9h^2}\)",r"D. \(\dfrac{40kq}{9h^2}\)"],"answer":"D","explanation":r"用镜像法把导体替换为位于 \(z=-h\) 的像电荷 \(-q\)。在 \(z=h/2\) 处，真电荷与像电荷产生的场强都向下，大小分别为 \(4kq/h^2\) 与 \(4kq/(9h^2)\)，相加得 \(40kq/(9h^2)\)。","family":"conductor","difficulty":4,"level":"L2"},
    {"slug":"unequal_charge_field_lines","name":"不等量异号电荷场线","type":"multiple-choice","question":r"图示为甲、乙两个点电荷的部分电场线。下列说法正确的是（多选）。","options":["A. 甲带负电、乙带正电","B. 甲的电荷量大于乙的电荷量","C. 正粒子从 P 点静止释放后会沿弯曲场线运动到 Q 点","D. P 点场强大于 Q 点场强"],"answer":"BD","explanation":r"场线由甲发出并终止于乙，故甲正乙负；甲连接的场线更多，电荷量更大。曲线场线只给出各点场强方向，静止粒子的轨迹一般不与弯曲场线重合。\(P\) 附近场线更密，故 \(E_P>E_Q\)。","family":"field-lines","difficulty":3,"level":"L2"},
    {"slug":"square_four_charges","name":"正方形四电荷叠加","type":"multiple-choice","question":r"两对等量异号点电荷固定在正方形四个顶点，\(L、N\) 是两条对角线与内切圆的交点，\(O\) 为圆心，\(M\) 为下方切点。下列说法正确的是（多选）。","options":["A. L、N 两点场强方向相互垂直","B. M 点场强沿切线向左","C. 正电荷从 M 移到 O，电场力做正功","D. 正电荷从 L 移到 N，电场力做功为零"],"answer":"BD","explanation":r"由对称叠加，\(L、N\) 两点场强沿同一对角线反向，并非垂直；\(M\) 点竖直分量抵消，水平合场强沿切线向左。\(M、O\) 电势均为零，移动正电荷电场力不做功；\(L、N\) 电势相等，所以从 L 到 N 电场力做功为零。","family":"superposition","difficulty":4,"level":"L2"},
    {"slug":"electric_field_curve","name":"场强图像与能量变化","type":"multiple-choice","question":r"静电场在 \(x\) 轴上的场强 \(E\) 随 \(x\) 变化如图，\(x\) 轴正方向为场强正方向，带正电的点电荷沿 \(x\) 轴运动。下列说法正确的是（多选）。","options":["A. 在 x2、x4 处电势能相等","B. 从 x1 到 x3 电势能增大","C. 从 x1 到 x4 电场力先增大后减小","D. 从 x1 到 x4 速度先增大后减小"],"answer":"BC","explanation":r"图示区间 \(E<0\)，对正电荷有 \(dE_p/dx=-qE>0\)，所以从 \(x_1\) 到 \(x_3\) 电势能增加。电场力大小为 \(q|E|\)，随曲线先远离零轴后靠近零轴，故先增大后减小。速度变化还取决于初速度方向和是否发生转向，不能直接判为先增后减。","family":"field-graph","difficulty":4,"level":"L2"},
]

IMAGE_MAP = {
    "dipole_field_lines":"course-02-dipole-field-lines.webp","charged_ring_three_points":"course-03-ring-three-charges.webp","charged_pendulum":"course-04-charged-pendulum.webp","two_ball_strings":"course-05-two-ball-strings.webp","charged_ring_axis":"course-06-ring-axis.webp","charged_hemisphere":"course-07-charged-hemisphere.webp","field_line_trajectory":"course-08-field-line-trajectory.webp","potential_energy_curve":"course-10-potential-energy-curve.webp",
    "arc_cut_field":"homework-01-arc-cut.webp","two_charges_uniform_field":"homework-02-two-charges-field.webp","electrostatic_smoke":"homework-03-smoke.webp","double_pendulum_field":"homework-04-double-pendulum.webp","electrostatic_precipitator":"homework-05-precipitator.webp","potential_curve_force":"homework-06-potential-curve.webp","image_charge_plane":"homework-07-image-charge.webp","unequal_charge_field_lines":"homework-08-field-lines.webp","square_four_charges":"homework-09-square-charges.webp","electric_field_curve":"homework-10-field-curve.webp"
}

FAMILY_NAMES = {"definition":"电场定义与方向","superposition":"点电荷场强叠加","equilibrium":"带电体受力平衡","continuous-charge":"连续带电体场强","trajectory":"场线与粒子轨迹","potential-energy":"电场功与电势能","potential-graph":"电势能图像","application":"静电技术应用","conductor":"导体与镜像法","field-lines":"电场线判读","field-graph":"场强图像"}

PRACTICE = {
    "definition":(r"在空间某点分别放入 \(+q\) 与 \(-2q\) 试探电荷，测得受力。由两次测量判断数据是否相容，并求场强矢量。",r"分别计算 \(\vec F/q\)，两次结果应完全一致。"),
    "superposition":(r"正方体若干顶点放置等量点电荷，改变一个电荷的符号后，求中心场强方向与大小。",r"先利用完整对称结构场强为零，再只计算被改变电荷造成的增量。"),
    "equilibrium":(r"两个异号带电小球由轻绳串联，置于斜向匀强电场中。给出两段绳偏角，反求电荷量之比和场强。",r"先对整体列平衡，再隔离下方小球；水平、竖直分量分别列式。"),
    "continuous-charge":(r"均匀带电圆环缺去一小段，求轴线上某点的场强，并讨论近轴与远场极限。",r"完整圆环场强减去缺口圆弧场强，并检查 \(L\ll R\) 与 \(L\gg R\) 极限。"),
    "trajectory":(r"给出非匀强电场中的场线和两条可能轨迹，判断粒子电性、速度变化与加速度比较。",r"用轨迹凹侧判断力方向，用场线疏密比较加速度，再由功判断速度。"),
    "potential-energy":(r"带电粒子在电场与外力共同作用下由 A 到 B，已知电势差和外力功，求动能变化。",r"联立 \(W_E=-\Delta E_p\) 与动能定理 \(\Delta E_k=W_E+W_{\rm ext}\)。"),
    "potential-graph":(r"给出试探电荷的 \(E_p-x\) 曲线，判断平衡点稳定性、场强方向及可达区间。",r"斜率给场强，极值点给平衡位置，再结合总能量水平线判断可达区。"),
    "application":(r"设计板间距可调的静电除尘模型，比较电压、颗粒电荷量与气流速度对收集效率的影响。",r"由 \(F=qE\) 和横向偏移时间建立收集条件，并考虑非匀强电场修正。"),
    "conductor":(r"点电荷位于接地导体球外，选取像电荷模型求轴线上场强并验证导体表面等势。",r"先确定像电荷位置与电量，再叠加场强并检查边界电势。"),
    "field-lines":(r"根据两点电荷的场线条数与方向反推电荷符号和比值，再比较三个指定点的场强。",r"箭头判符号、场线条数判电量比、局部疏密判场强。"),
    "field-graph":(r"给定分段 \(E-x\) 图像，求两点电势差、粒子电势能变化并判断转向位置。",r"电势差等于 \(-E-x\) 图下有向面积，再结合能量守恒。"),
}

def make_problem(item, number, kind):
    slug=item["slug"]; prefix="course" if kind=="course" else "hw"; pid=f"electric_lesson5_{prefix}_{number:02d}_{slug}"
    label=f"例{number}" if kind=="course" else f"{'单选' if number<=7 else '多选'}第{number}题"
    pq,pt=PRACTICE[item["family"]]
    problem={"id":pid,"chapter":CHAPTER,"title":f"{label}：{item['name']}","question":item["question"],"options":item["options"],"answer":item["answer"],
      "analysis":{"title":"解析","sharedThinking":"先明确源电荷、试探电荷和研究点，再选择场强叠加、受力平衡或电势能关系。","sharedFormula":r"\[\vec E=\frac{\vec F}{q},\qquad \vec E=\sum_i\vec E_i,\qquad W_{AB}=-\Delta E_p\]"},
      "analysisPresentation":{"collapseEachStep":True,"optionMode":"shared-solution"},
      "steps":[{"title":"条件提取","content":"标出电荷正负、几何对称性、场线方向和题目所比较的物理量。"},{"title":"模型与公式","content":"按题意使用矢量叠加、平衡条件或场强/势能图像的斜率与面积关系。"},{"title":"推导与判断","content":item["explanation"]},{"title":"结论","content":f"答案为 **{item['answer']}**。最后检查场强方向、矢量分量和电场力做功符号。"}],
      "knowledge":["电场强度","电势能",item["name"]],"practice":{"title":"进阶近似题：同考点结构迁移","question":pq,"answer":pt,"thinking":"先保留本题的物理不变量，再改变几何、符号或过程条件建立新方程。","difficulty":"equal-or-higher","upgradeType":"same-concept-structural-transfer"},
      "animation":{"enabled":True,"level":"animated","type":"electric_field_model","variant":slug,"playable":True,"interactive":True,"notes":f"按“{item['name']}”显示电荷、场强、运动或能量图像的关键变化。","params":{"charge":{"label":"电荷量","value":1,"min":-3,"max":3,"step":0.25,"unit":"q"},"field":{"label":"场强系数","value":1,"min":0.2,"max":2,"step":0.1,"unit":"E"},"distance":{"label":"距离系数","value":1,"min":0.5,"max":2,"step":0.1,"unit":"R"}},"timeline":{"duration":7,"loop":False}},
      "taxonomy":{"module":"电磁学","topic":CHAPTER,"modelId":"electric-field-potential","modelName":"电场强度与电势能","familyId":f"electric-{item['family']}","familyName":FAMILY_NAMES[item["family"]],"role":"母题" if kind=="course" and number==1 else ("综合题" if item["difficulty"]>=4 else "条件变式"),"difficulty":item["difficulty"],"variantLevel":item["level"],"skills":["场强矢量叠加","电场功与能量判断"],"prerequisites":["库仑定律","力的合成与分解"]}}
    if slug in IMAGE_MAP: problem["images"]=[{"src":f"assets/problem-images/electric-lesson5/{IMAGE_MAP[slug]}","alt":f"{item['name']}原题配图"}]
    return problem

def main():
    created=[]
    for kind,items in (("course",COURSE),("homework",HOMEWORK)):
        for number,item in enumerate(items,1):
            problem=make_problem(item,number,kind); path=OUT/f"{problem['id']}.json"
            if path.exists():
                old=json.loads(path.read_text(encoding="utf-8")); old.update(problem); problem=old
            path.write_text(json.dumps(problem,ensure_ascii=False,indent=2)+"\n",encoding="utf-8"); created.append((problem["id"],path.name))
    index_path=OUT/"index.json"; index=json.loads(index_path.read_text(encoding="utf-8")); known={x["id"] for x in index["problems"]}
    index["problems"].extend({"id":pid,"file":name} for pid,name in created if pid not in known)
    index_path.write_text(json.dumps(index,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(f"created {len(created)} electric-field lesson problems")

if __name__=="__main__": main()
