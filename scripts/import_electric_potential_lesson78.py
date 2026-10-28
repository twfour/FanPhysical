#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "problems"
CHAPTER = "电势、电势差与等势面"

def item(slug, name, kind, question, options, answer, thinking, formula, explanation, judgments=None, image=None, family="potential", difficulty=3, level="L2"):
    return locals()

COURSE = [
 item("electron_potential_work","电子移动与电势", "calculation",
      r"将一电子从电场外一点 \(P\) 移至电场中某点 \(A\)，电场力做功 \(40\,\mathrm{eV}\)。求 \(A\) 点电势；若将等量正电荷从 \(A\) 移到电势为 \(10\,\mathrm V\) 的 \(B\) 点，求电场力做功。",None,
      r"\(\varphi_A=40\,\mathrm V\)，\(W_{AB}=30\,\mathrm{eV}=4.8\times10^{-18}\,\mathrm J\)",
      "先以电场外 P 点为零电势点，用电场力功求 A 点电势，再更换为正电荷计算 A 到 B 的功。",
      r"\[W_{PA}=q(\varphi_P-\varphi_A),\qquad W_{AB}=q(\varphi_A-\varphi_B)\]",
      r"电子电荷量为 \(-e\)，故 \(40\,\mathrm{eV}=(-e)(0-\varphi_A)\)，得到 \(\varphi_A=40\,\mathrm V\)。等量正电荷为 \(+e\)，所以 \(W_{AB}=e(40-10)\,\mathrm V=30\,\mathrm{eV}=4.8\times10^{-18}\,\mathrm J\)。",family="work",difficulty=2,level="L1"),
 item("oil_drop_energy","匀强场油滴能量", "multiple-choice",
      "带电油滴在方向竖直向下的匀强电场中沿图示虚线从 a 运动到 b，不计空气阻力。判断能量变化。",
      ["A. 动能减小","B. 电势能增加","C. 动能和电势能之和减小","D. 电势升高","E. 动能与重力势能之和变大"],"CDE",
      "由轨迹凹向判断电场力必须有向上分量，再分别使用重力势能、电势能和机械能守恒。",
      r"\[\Delta(E_k+E_{pg}+E_p)=0,\qquad W_E=-\Delta E_p\]",
      "油滴上升且轨迹向上弯曲，合力与竖直速度分量同向，故动能增加；重力势能增加。电场方向向下而电场力需向上，油滴带负电。b 点电势高于 a 点，负电荷电势能降低。因此动能与电势能之和减少，而动能与重力势能之和增加。",
      ["错误，合力向上且竖直速度分量向上，动能增加。","错误，负电荷到高电势处电势能降低。","正确，由总机械能守恒，重力势能增加使该和减少。","正确，逆电场方向移动，电势升高。","正确，电势能降低使该和增大。"],"course-02-oil-drop.webp",family="energy"),
 item("dipole_zero_potential","等量异种电荷对称点", "single-choice",
      r"等量异种点电荷 \(+q、-q\) 位于 \(M、N\)，a、c 关于中点 O 对称，b、d 位于中垂线上。判断各点电势、场强和电势能。",
      ["A. 中垂线上 O 点电势最高","B. 正电荷从 b 到 d 受力先减小后增大","C. 正电荷在 c 点电势能大于在 a 点","D. 负试探电荷从 a 到 b，电势能增大"],"D",
      "等量异种电荷连线中垂线为零电势面；连线上电势由正电荷一侧向负电荷一侧降低。",
      r"\[\varphi=k\left(\frac{q}{r_+}-\frac{q}{r_-}\right),\qquad E_p=q_0\varphi\]",
      "b、O、d 电势均为零。a 靠近正电荷而电势为正，c 靠近负电荷而电势为负。负试探电荷从 a 到 b 时，电势由正值降到零，其电势能反而增加。",
      ["错误，中垂线上各点电势都为零。","错误，场强从 b 到 O 增大、再从 O 到 d 减小。","错误，正电荷在 c 点电势能更小。","正确。"],"course-03-dipole-points.webp",family="equipotential"),
 item("electron_vt_field","电子速度图与场强", "single-choice",
      "负电荷从电场线上的 A 点静止释放，仅受静电力运动到 B，速度随时间增加但斜率逐渐减小。判断 A、B 点场强、电势和电势能关系。",
      [r"A. \(E_A>E_B,\ \varphi_A>\varphi_B\)",r"B. \(E_A<E_B,\ \varphi_A<\varphi_B\)",r"C. \(E_A>E_B,\ E_{pA}>E_{pB}\)",r"D. \(E_A<E_B,\ E_{pA}<E_{pB}\)"],"C",
      "v-t 图斜率给加速度，电子受力方向与场强方向相反；只有电场力做功时动能增加等于电势能减少。",
      r"\[a=\frac{dv}{dt}=\frac{eE}{m},\qquad \Delta E_k=-\Delta E_p\]",
      r"图像斜率逐渐减小，故 \(E_A>E_B\)。电子从 A 到 B 动能增加，所以电势能降低，即 \(E_{pA}>E_{pB}\)。电子沿受力方向、逆电场方向运动，故 \(\varphi_A<\varphi_B\)。",
      ["场强正确，电势关系错误。","场强关系错误。","两项均正确。","场强和电势能关系均错误。"],"course-04-electron-vt.webp",family="graph"),
 item("electron_fieldline_trajectory","电子轨迹与点电荷", "multiple-choice",
      "点电荷 Q 的一条电场线为 MN，虚线 AB 是电子仅受静电力的轨迹。比较 A、B 的加速度、电势和电势能。",
      ["A. 电子一定从 A 向 B 运动","B. 若 aA>aB，则 Q 靠近 M 端且为正电荷","C. 无论 Q 正负均有 EpA<EpB","D. B 点电势可能高于 A 点"],"BC",
      "轨迹切线不能确定运动先后；轨迹凹侧确定电子受力，再结合电子电性确定点电荷位置和符号。",
      r"\[a=\frac{eE}{m},\qquad E_p=-e\varphi\]",
      r"电子可沿同一轨迹双向运动。若 Q 在 M 端则为正且 A 更近；若 Q 在 N 端则为负。两种可能中均有 \(\varphi_A>\varphi_B\)，所以电子有 \(E_{pA}<E_{pB}\)。",
      ["错误，轨迹不标明时间方向。","正确。","正确。","错误，两种可能均有 B 点电势低于 A 点。"],"course-05-electron-trajectory.webp",family="trajectory",difficulty=4),
 item("positive_charge_line","正点电荷等距三点", "multiple-choice",
      "正点电荷的同一径向电场线上有等距的 A、B、C 三点，A 离场源最近。比较电势、场强与负电荷电势能。",
      ["A. 同一负电荷在 C 点电势能最大",r"B. \(\varphi_A>\varphi_B>\varphi_C\)",r"C. \(E_A>E_B>E_C\)",r"D. \(\varphi_A-\varphi_B=\varphi_B-\varphi_C\)"],"ABC",
      "点电荷电势按 1/r 变化、场强按 1/r² 变化；等距离不代表等电势差。",
      r"\[\varphi=\frac{kQ}{r},\qquad E=\frac{kQ}{r^2},\qquad E_p=q\varphi\]",
      "沿远离正点电荷方向，电势和场强均减小。负电荷的电势能随电势降低而增大。由于函数 1/r 非线性，相等距离上的电势差不相等。",
      ["正确。","正确。","正确。","错误，AB 段电势降落更大。"],"course-06-point-charge-line.webp",family="point-charge"),
 item("central_charge_orbits","点电荷场中的两条轨迹", "multiple-choice",
      "正点电荷固定于 O，两虚线圆为等势线，M、N 为两带电粒子的轨迹，a、b、c、d、e 为交点。",
      ["A. M 带负电，N 带正电","B. M 在 b 点动能小于在 a 点动能","C. N 在 d 点电势能等于在 e 点电势能","D. N 从 c 到 d 克服电场力做功"],"ABC",
      "由轨迹凹向判断电性；同一虚线圆上的点电势相等，再用能量守恒比较动能。",
      r"\[E_k+E_p=\text{常量},\qquad E_p=q\frac{kQ}{r}\]",
      "M 轨迹向 O 弯曲故带负电，N 轨迹背离 O 弯曲故带正电。a 比 b 更靠近 O，M 在 a 的电势能更低、动能更大。d、e 在同一等势圆上，N 的电势能相等；正电 N 从 c 到 d 向外运动，电场力做正功。",
      ["正确。","正确。","正确。","错误，不是克服电场力做功。"],"course-07-orbit-equipotential.webp",family="trajectory",difficulty=4),
 item("curved_equipotential","曲线等势面判读", "multiple-choice",
      "一簇关于 x 轴对称的等势面标为 0.2V、0.4V、0.6V，A、B 位于 x 轴。判断场强与电势能。",
      ["A. A 点场强小于 B 点场强","B. A 点场强方向指向 x 轴负方向",r"C. \(10^{-10}\,C\) 正电荷从 0.2V 到 0.6V，电场力做功 \(4\times10^{-11}J\)","D. 电子从 A 到 B，电势能增大"],"AD",
      "等差等势面越密处场强越大，场强从高电势指向低电势；功要保留电势差符号。",
      r"\[E\approx\frac{|\Delta\varphi|}{\Delta x},\qquad W=q(\varphi_i-\varphi_f)\]",
      "B 附近等势面更密，因此场强更大。电势从左侧 0.6V 向右侧 0.2V 降低，场强沿 x 正向。正电荷从 0.2V 到 0.6V 做负功；电子从高电势 A 到低电势 B，电势能增大。",
      ["正确。","错误，方向沿 x 正方向。","错误，应为负功。","正确。"],"course-08-curved-equipotential.webp",family="equipotential"),
 item("parallel_plate_calculation","平行板电势与功", "calculation",
      r"平行板间距 \(d=1.2\,cm\)，电压 \(U=240\,V\)，M 板接地。A 距 M 板 0.2cm，B 距 N 板 0.5cm，\(q=-3\times10^{-4}C\)。求 A 点受力、电势与电势能、A 到 B 的电场力功，并判断 M 板上移 0.1cm 后 A 点电势变化。",None,
      r"\(F=6.0\,N\)，\(\varphi_A=40V\)，\(E_{pA}=-1.2\times10^{-2}J\)，\(W_{AB}=3.0\times10^{-2}J\)；A 点电势降低",
      "把板间视为匀强电场，电势沿板间距离线性变化；移动接地板后重新计算板间距离和 A 到接地板距离。",
      r"\[E=\frac Ud,\quad \varphi=Ex,\quad W_{AB}=q(\varphi_A-\varphi_B)\]",
      r"\(E=2.0\times10^4V/m\)，故 \(F=|q|E=6.0N\)。\(\varphi_A=E\times0.002=40V\)，\(E_{pA}=q\varphi_A=-1.2\times10^{-2}J\)。B 距 M 为 0.7cm，\(\varphi_B=140V\)，所以 \(W_{AB}=3.0\times10^{-2}J\)。M 上移后 A 到 M 的距离缩小且总板距也缩小，A 点电势降为约 \(21.8V\)。",image="course-09-parallel-plates.webp",family="uniform",difficulty=4),
 item("equal_potential_planes","等距等势面与电子", "multiple-choice",
      "匀强电场中等距等势面依次为 d、c、b、a。电子经过 d 时动能20eV，经过 c 时电势能-10eV，到 b 时速度为零。判断不正确项。",
      ["A. a 的电势为 -20V","B. 场强大小为 200V/m","C. 电子经过 a 时电势能为 10eV","D. 电子动能为26eV时，电势能为-26eV"],"A",
      "用总能量守恒和等距等势面的等电势差关系，先求相邻电势差，再逐项判断。",
      r"\[E_k+E_p=\text{常量},\qquad E=\frac{|\Delta\varphi|}{\Delta x}\]",
      "设相邻等势面电势差为 Δφ。联立 d、c、b 三个状态得 Δφ=-10V，总能量为0。于是 φa=-10V而非-20V，场强为200V/m，a 点电子电势能10eV，且任意时刻 Ep=-Ek。本题原卷虽标为多选，但按题干“不正确的是”逐项核算后只有 A 不正确。",
      ["不正确，a 的电势为 -10V。","正确。","正确。","正确。"],"course-10-equal-potential-planes.webp",family="uniform"),
 item("coordinate_uniform_field","坐标系三点电势", "multiple-choice",
      "匀强电场平行 xOy 平面，a(0,6cm)、b(8cm,0)、c(8cm,6cm) 电势分别为10V、17V、26V。",
      ["A. 场强大小为2.5V/cm","B. 原点电势为1V","C. 电子在a点电势能比b点低7eV","D. 电子从b到c，电场力做功9eV"],"ABD",
      "匀强电场电势是坐标的一次函数，由三个点求电势梯度，再由电子电荷符号判断功和势能。",
      r"\[\varphi(x,y)=\alpha x+\beta y+\varphi_O,\qquad \vec E=-\nabla\varphi\]",
      r"由 c-b 得 \(6\beta=9\)，由 c-a 得 \(8\alpha=16\)，所以 \(\alpha=2,\beta=1.5\,V/cm\)，\(E=2.5V/cm\)，\(\varphi_O=1V\)。电子在 a 的势能为-10eV，在 b 为-17eV，a 比 b 高7eV；b 到 c 的电场力功为 \((-e)(17-26)=9eV\)。",
      ["正确。","正确。","错误，应高7eV。","正确。"],"course-11-coordinate-potential.webp",family="uniform",difficulty=4),
 item("two_charge_potential_curve","双点电荷电势曲线", "multiple-choice",
      "x轴上 a、b 两点放置 q1、q2，a、b 间电势曲线开口向上并在 p 点取最小值，且 ap>pb。",
      ["A. a、b均为负电荷且q1一定大于q2","B. 关于p对称的c、d两点，Ec<Ed","C. 负检验电荷从d到p，电场力做负功","D. a、p间电场方向都指向a"],"BC",
      "由源电荷位置处电势趋于正无穷判断符号；曲线斜率的绝对值给场强，斜率符号给场强方向。",
      r"\[E_x=-\frac{d\varphi}{dx},\qquad E_p=q_0\varphi\]",
      "a、b 均为正电荷。p 是场强为零点且更靠近 b，说明 q1>q2。图中对称点 d 的曲线更陡，故 Ed>Ec。负电荷从较高电势 d 到最低电势 p 时电势能增加，电场力做负功；a到p之间曲线下降，场强沿x正向。",
      ["错误，均为正电荷。","正确。","正确。","错误，方向指向x正向。"],"course-12-two-charge-potential.webp",family="graph",difficulty=4),
]

HOMEWORK = [
 item("field_work_calculation","场强电势与电势能计算", "calculation",
      r"点电荷 \(q=1.0\times10^{-8}C\) 在 A 点受力 \(2.0\times10^{-5}N\)。从 A 移到零电势 O 点，电场力做功 \(2.0\times10^{-6}J\)。求 A 点场强、\(U_{AO}\)、A 点电势和电势能。",None,
      r"\(E_A=2.0\times10^3N/C\)，\(U_{AO}=\varphi_A=200V\)，\(E_{pA}=2.0\times10^{-6}J\)",
      "依次使用场强定义、电场力功和电势能定义。",r"\[E=F/q,\quad W=qU_{AO},\quad E_p=q\varphi\]",
      "代入可得 E=2000N/C；U_AO=W/q=200V。O为零电势，故φA=200V，EpA=qφA=2.0×10^-6J。",family="work",difficulty=2,level="L1"),
 item("rough_plane_energy","粗糙面带电块往返", "single-choice",
      "正电小金属块以初动能 Ek 从 A 向左运动到 B 停止，损失动能的3/4转化为电势能，A点电势为零。",
      ["A. 摩擦力是电场力的1/4","B. B点电势能为3Ek/4","C. 再回A点动能为3Ek/4","D. B点电势为-3Ek/(4q)"],"B",
      "把初动能损失分成电势能增加和摩擦生热，再分析返回过程。",
      r"\[qEL=\frac34E_k,\qquad fL=\frac14E_k\]",
      "故f/(qE)=1/3，B点电势能为3Ek/4且电势为正。返回时电场做功3Ek/4、摩擦耗散Ek/4，所以回A动能为Ek/2。",
      ["错误，应为1/3。","正确。","错误，应为Ek/2。","错误，电势为正。"],"homework-02-rough-plane.webp",family="energy"),
 item("cell_membrane_ion","细胞膜钠离子减速", "single-choice",
      "初速度 v0 的正一价钠离子仅受膜内匀强电场力，从膜外 A 点刚好运动到膜内 B 点。A点电势φA，质量m，电荷e，膜厚d。",
      [r"A. \(a=v_0^2/d\)",r"B. \(E=mv_0^2/(ed)\)",r"C. \(\varphi_B=\varphi_A+mv_0^2/e\)",r"D. \(E_{pB}=e\varphi_A+mv_0^2/2\)"],"D",
      "由末速度为零的匀减速运动求加速度，再用动能定理和能量守恒求场强与电势。",
      r"\[0-v_0^2=-2ad,\qquad e(\varphi_A-\varphi_B)=-\frac12mv_0^2\]",
      r"得到 \(a=v_0^2/(2d)\)、\(E=mv_0^2/(2ed)\)、\(\varphi_B=\varphi_A+mv_0^2/(2e)\)，从而 \(E_{pB}=e\varphi_A+mv_0^2/2\)。",
      ["错误，应为 v₀²/(2d)。","错误，缺少因子2。","错误，缺少因子2。","正确。"],"homework-03-cell-membrane.webp",family="uniform"),
 item("potential_landscape","四电荷电势地形", "single-choice",
      "四个等量点电荷位于正方形顶点，给出xOy平面电势地形图，OA=OB=OC。判断场强与沿路径电势变化。",
      ["A. A、B场强相同","B. O点场强和电势均为零","C. A到B电势先升高后降低","D. 正电荷从O到C，电势能先增大后减小"],"C",
      "把地形高度视为电势，坡度方向和大小对应电场方向及大小；沿给定直线读取高度变化。",
      r"\[\vec E=-\nabla\varphi,\qquad E_p=q\varphi\]",
      "A、B处地形坡度方向不同，场强不相同；O虽处零电势附近但坡度不为零。沿A到B的剖面先越过电势高处再下降，因此C正确；O到C的电势并非先升后降。",
      ["错误。","错误。","正确。","错误。"],"homework-04-potential-landscape.webp",family="graph",difficulty=4),
 item("lightning_field","积雨云与避雷针电场", "single-choice",
      "积雨云上正下负，地面感应正电。图示P、M、N在同一弯曲场线上且PM=MN。",
      ["A. EP<EM<EN","B. UPM>UMN","C. 电子在P点电势能大于在N点","D. 放电电流由云层指向建筑物"],"B",
      "由场线疏密比较场强；等长线段上的电势差是场强沿路径积分；区分电子流与约定电流。",
      r"\[U_{AB}=\int_A^B\vec E\cdot d\vec l\]",
      "越靠近建筑物尖端场线越密，故EP>EM>EN。PM与MN等长但前段平均场强更大，所以UPM>UMN。P电势高于N，电子在P势能更低；约定电流方向与电子运动相反。",
      ["错误，次序相反。","正确。","错误。","错误。"],"homework-05-lightning-field.webp",family="application"),
 item("two_charge_potential_minimum","两电荷电势最低点", "single-choice",
      "点电荷M固定在x=-20cm、N在原点，x正半轴电势曲线过x0并在x=20cm取最小值。正电荷q从x0静止释放。",
      ["A. M正、N负","B. x0处场强为0","C. |qM|:|qN|=4:1","D. q向右运动时电势能先增大后减小"],"C",
      "电势曲线斜率为负场强；极小点斜率为零，并用两点电荷场强抵消求电荷量比。",
      r"\[E_x=-\frac{d\varphi}{dx},\qquad \frac{k|q_N|}{(0.20)^2}=\frac{k|q_M|}{(0.40)^2}\]",
      "N处曲线趋正无穷，N为正；远处电势从负侧趋零，M为负且量值更大。x0只是零电势点而非零场强点。x=20cm场强为零，得到|qM|:|qN|=4:1。",
      ["错误，符号相反。","错误，零场强在20cm。","正确。","错误，先减小后增大。"],"homework-06-two-charge-curve.webp",family="graph"),
 item("lightning_electron_equipotential","避雷针等势面与电子", "single-choice",
      "乌云经过建筑物上空，a、b、c、d为等差等势面，电子轨迹经过A、B。判断云层电性、场强及能量。",
      ["A. 云层带正电","B. A点场强比B点大","C. 电子在A点电势能比B点大","D. 电子在A点速度比B点小"],"B",
      "由轨迹凹向确定电子受力，再反推电场方向和云层电性；等势面疏密比较场强。",
      r"\[\vec F=-e\vec E,\qquad E\approx\frac{|\Delta\varphi|}{\Delta n}\]",
      "电子受力与电场反向，结合轨迹可知电场指向负云层，因此云层带负电。A附近等势面更密，EA>EB。A电势更高，电子势能更低；只有电场力做功时A点动能更大。",
      ["错误。","正确。","错误。","错误。"],"homework-07-lightning-equipotential.webp",family="trajectory"),
 item("electric_pendulum_release","匀强场电摆释放", "single-choice",
      r"长1.4m、质量 \(1.0\times10^{-2}kg\)、电荷量 \(2.0\times10^{-8}C\) 的正电小球在水平向右匀强电场中平衡，绳与竖直成37°。从左侧水平位置静止释放。",
      [r"A. \(E=3.75\times10^7N/C\)","B. 平衡拉力0.17N","C. 0.5s时速度6.25m/s","D. 首次通过O正下方速度7m/s"],"D",
      "先由平衡求qE和合恒力，再以重力势能与电势能共同守恒求指定位置速度。",
      r"\[qE=mg\tan37^\circ,\quad T=mg/\cos37^\circ,\quad \Delta E_k=W_g+W_E\]",
      "E=3.75×10^6N/C，平衡拉力0.125N。由左侧水平位置到O正下方，重力做功mgl，电场力做功qEl，合功0.245J，得v=7m/s。0.5s速度不等于6.25m/s。",
      ["错误，指数应为10^6。","错误。","错误。","正确。"],"homework-08-electric-pendulum.webp",family="energy",difficulty=4),
 item("hydrogen_atom_energy","氢原子经典模型", "multiple-choice",
      "电子绕氢原子核做半径r的匀速圆周运动，核电荷+e、电子-e，取无穷远电势为零。",
      [r"A. \(v=e\sqrt{k/(mr)}\)",r"B. \(I=\frac{e^2}{2\pi r}\sqrt{\frac{k}{mr}}\)",r"C. 一周库仑力做功 \(2\pi ke^2/r\)",r"D. 总能量 \(-ke^2/(2r)\)"],"ABD",
      "库仑力提供向心力；等效电流为电荷量除以周期；圆周运动中向心力不做功。",
      r"\[\frac{ke^2}{r^2}=\frac{mv^2}{r},\quad I=\frac eT=\frac{ev}{2\pi r},\quad E=\frac12mv^2-\frac{ke^2}{r}\]",
      "由向心方程得A；代入周期得B。库仑力始终垂直速度，一周做功为零。动能ke²/(2r)，势能-ke²/r，总能量为-ke²/(2r)。",
      ["正确。","正确。","错误，做功为零。","正确。"],"homework-09-hydrogen-atom.webp",family="point-charge",difficulty=4),
 item("grid_uniform_field","九宫格匀强电场", "multiple-choice",
      "边长4cm的九宫格中，B点粒子源发射初动能10eV的α粒子。A点动能14eV，C点动能6eV，φB=0。",
      ["A. φA=-4V，φC=4V","B. 16格点最高电势6V且α粒子不能到达","C. E=50√2V/m","D. 电子从B到C电势能增加2eV"],"BC",
      "由α粒子电荷+2e把动能变化换算为电势，再用相邻格点电势梯度求场强。",
      r"\[E_k+q\varphi=\text{常量},\qquad \vec E=-\nabla\varphi\]",
      "总能量10eV，故φA=-2V、φC=2V。水平和竖直每格电势均变化2V，场强分量各为50V/m，合场强50√2V/m。16格点最高6V，对α粒子势能12eV，超过总能量而不可达。电子从B到C势能降低2eV。",
      ["错误，电势应为-2V和2V。","正确。","正确。","错误，应降低2eV。"],"homework-10-grid-field.webp",family="uniform",difficulty=4),
]

FAMILY_NAMES={"potential":"电势基本概念","work":"电场功与电势差","energy":"电场功与电势能","equipotential":"等势面判读","graph":"电势能图像","trajectory":"等势线与粒子轨迹","point-charge":"点电荷电势","uniform":"匀强电场与电势差","application":"现实电场应用"}

def build(source, number, group):
    prefix="course" if group=="course" else "hw"
    pid=f"electric_potential_lesson78_{prefix}_{number:02d}_{source['slug']}"
    label=f"例{number}" if group=="course" else ("解1" if number==1 else (f"单{number}" if number<=8 else f"多{number}"))
    image=source.get("image")
    problem={
      "id":pid,"chapter":CHAPTER,"title":f"{label}：{source['name']}","type":source["kind"],"question":source["question"],"options":source["options"],"answer":source["answer"],
      "analysis":{"title":"解析","sharedThinking":source["thinking"],"sharedFormula":source["formula"]},
      "analysisPresentation":{"collapseEachStep":True,"optionMode":"independent-statements" if source["options"] else "shared-solution"},
      "steps":[{"stepId":1,"title":"条件提取","content":source["thinking"]},{"stepId":2,"title":"对应公式","content":source["formula"]},{"stepId":3,"title":"推导过程","content":source["explanation"]},{"stepId":4,"title":"结论","content":f"答案为 **{source['answer']}**。"}],
      "knowledge":["电势","电势差","等势面",source["name"]],
      "practice":{"title":"进阶近似题：同考点迁移","question":f"保持“{source['name']}”的核心考点，改变电荷符号、空间位置或初始能量后，重新判断场强、电势与能量关系。","answer":"先确定电势差和电场方向，再用功与能量关系完成计算；答案随新条件确定。","thinking":"先找不变量，再处理电荷正负引起的方向和符号变化。","difficulty":"equal-or-higher","upgradeType":"same-concept-structural-transfer"},
      "animation":{"enabled":True,"level":"animated","type":"electric_potential_model","variant":source["slug"],"playable":True,"interactive":True,"notes":f"按原题演示“{source['name']}”的电势、受力和能量变化。","params":{"charge":{"label":"电荷量系数","value":1,"min":-2,"max":2,"step":0.25,"unit":"q"},"field":{"label":"场强系数","value":1,"min":0.5,"max":2,"step":0.1,"unit":"E"}},"timeline":{"duration":7,"loop":False}},
      "taxonomy":{"module":"电磁学","topic":CHAPTER,"modelId":"electric-field-potential","modelName":"电场强度与电势能","familyId":f"electric-potential-lesson78-{source['family']}","familyName":FAMILY_NAMES[source["family"]],"role":"母题" if group=="course" else "条件变式","difficulty":source["difficulty"],"variantLevel":source["level"],"skills":["电势高低判断","电场力功与能量关系"],"prerequisites":["电场强度","功与能量"]}
    }
    if source["options"]:
        problem["optionAnalyses"]=[{"option":chr(65+i),"title":opt.split(". ",1)[-1],"judgment":source["judgments"][i]} for i,opt in enumerate(source["options"])]
    if image: problem["images"]=[{"src":f"assets/problem-images/electric-potential-lesson78/{image}","alt":f"{source['name']}原题配图"}]
    return problem

def main():
    created=[]
    for group,items in (("course",COURSE),("homework",HOMEWORK)):
        for number,source in enumerate(items,1):
            problem=build(source,number,group); path=OUT/f"{problem['id']}.json"
            if path.exists():
                old=json.loads(path.read_text(encoding="utf-8")); old.update(problem); problem=old
            path.write_text(json.dumps(problem,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
            created.append((problem["id"],path.name))
    index_path=OUT/"index.json"; index=json.loads(index_path.read_text(encoding="utf-8")); known={x["id"] for x in index["problems"]}
    index["problems"].extend({"id":pid,"file":name} for pid,name in created if pid not in known)
    index_path.write_text(json.dumps(index,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(f"created {len(created)} electric-potential lesson problems")

if __name__=="__main__": main()
