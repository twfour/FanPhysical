#!/usr/bin/env python3
"""Import the verified 2026 autumn lesson 11 electric-field/momentum test."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "problems"
INDEX = OUT / "index.json"
GUIDES = ROOT / "data" / "chapter-guides.json"
CHAPTER = "秋季课时11：电场和动量（高考）测试题"


def choice(number, title, kind, answer, question, options, thinking, formula, derivation, judgments):
    return {
        "number": number, "title": title, "type": kind, "answer": answer,
        "question": question, "options": options, "thinking": thinking,
        "formula": formula, "derivation": derivation, "judgments": judgments,
    }


ITEMS = [
choice(1, "摩擦起电", "single-choice", "B",
"梳过头发的梳子常能吸引轻小物体，这属于摩擦起电。关于摩擦起电现象，下列说法正确的是（　　）",
["A. 摩擦起电使本来没有电子和质子的物体中产生电子和质子", "B. 头发和梳子相互摩擦后，分别带上等量异种电荷", "C. 若梳子带正电，是头发中的质子转移到梳子上形成的", "D. 头发和梳子相互摩擦后带的电量可以是任意数"],
"抓住电荷守恒与微观载流子：摩擦只转移电子，不会创造电荷，固体中的质子也不会在物体间迁移。", "\\[Q_{\\text{总}}=0,\\qquad Q_{\\text{头发}}=-Q_{\\text{梳子}}\\]", "两物体原来均不带电，摩擦后电子从一种材料转移到另一种材料，因此两者电荷量等大、符号相反；带电量还必须是元电荷的整数倍。", ["A 错误：电子和质子没有被创造。", "B 正确：封闭系统电荷守恒。", "C 错误：转移的是电子，不是质子。", "D 错误：电荷量满足量子化。"]),
choice(2, "熔喷布静电过滤", "single-choice", "C",
"熔喷布是口罩的中间过滤层，是用绝缘材料制成的带有静电的超细纤维布。它能阻隔几微米的病毒，这种静电阻隔作用属于（　　）",
["A. 尖端放电", "B. 静电屏蔽", "C. 静电吸附", "D. 静电平衡"],
"带电纤维使附近微粒极化或直接吸引带电微粒，从而把微粒吸附在纤维上。", "\\[\\vec F=q\\vec E\\quad\\text{或由静电感应产生吸引力}\\]", "这里的关键不是阻断外电场，也不是导体达到静电平衡，而是静电力把微粒吸附在滤材上。", ["A 错误：没有利用尖端处的电离放电。", "B 错误：并非用导体屏蔽外电场。", "C 正确：利用静电力吸附微粒。", "D 错误：静电平衡是状态，不是过滤机制。"]),
choice(3, "导体静电平衡", "single-choice", "D",
"把一个导体放入水平向右的匀强电场中，静电平衡时，下列说法正确的是（　　）",
["A. 导体内感应电荷的电场为零", "B. 三点场强满足 \\(E_A=E_B>E_C\\)", "C. 三点电势满足 \\(\\varphi_B>\\varphi_A>\\varphi_C\\)", "D. 把一个负电荷从 A 移动到 B，电场力不做功"],
"静电平衡导体内部合场强为零，整个导体是等势体；感应电荷产生的附加场恰好抵消外场。", "\\[\\vec E_{\\text{感}}=-\\vec E_0,\\qquad E_{\\text{内}}=0,\\qquad \\varphi_A=\\varphi_B\\]", "\\(A\\)、\\(B\\) 位于导体内部，二者间电势差为零，所以移动任意电荷时电场功均为零。\\(C\\) 在导体外，不能据图直接与内部场强作题设中的比较。", ["A 错误：为零的是合场，感应电荷场不为零。", "B 错误：\\(A\\)、\\(B\\) 内部场强均为零。", "C 错误：\\(A\\)、\\(B\\) 同电势。", "D 正确：\\(W_{AB}=qU_{AB}=0\\)。"]),
choice(4, "静电除烟", "single-choice", "D",
"锯条接静电起电机负极、金属片接正极，透明塑料瓶中点燃蚊香。摇动起电机后烟雾很快消失。下列说法正确的是（　　）",
["A. 室内空气湿度越大，实验效果越好", "B. 起电机摇动时，塑料瓶内存在匀强电场", "C. 起电机摇动前，烟尘颗粒带上电荷才能做成功", "D. 带电烟雾颗粒向金属片运动时，电势能减少"],
"锯条尖端放电使烟尘带电，烟尘随后在非匀强电场中向异号电极运动，电场力做正功。", "\\[W_E=-\\Delta E_p>0\\]", "空气湿度增大会加快漏电；尖端附近场强显著更大，场不均匀；烟尘是在装置工作后被电离、带电。颗粒自发向金属片运动时电场力做正功，电势能降低。", ["A 错误：湿度大会削弱静电积累。", "B 错误：锯齿尖端使电场明显不均匀。", "C 错误：烟尘可在摇动后被电离带电。", "D 正确：电场力做正功，电势能减少。"]),
choice(5, "带电球缓慢牵引", "single-choice", "B",
"正电小球 A 系在不可伸长绝缘细线一端，细线绕过定滑轮，另一端受拉力 \\(F\\)。正电小球 B 固定在滑轮正下方的绝缘座上。初始 \\(AB\\) 小于滑轮到 B 的距离。缓慢拉动细绳，使 A 缓慢移动到滑轮处，B 始终静止。下列判断正确的是（　　）",
["A. B 球受到的库仑力先增大后减小", "B. 拉力 \\(F\\) 先减小后增大", "C. 地面对绝缘座的支持力一直减小", "D. A 球的电势能一直不变"],
"全过程为准静态平衡。设滑轮为 \\(O\\)、\\(OB=h\\)、\\(OA=l\\)、\\(AB=r\\)。小球 \\(A\\) 到达 \\(O\\) 的正下方前，重力、绳张力和库仑力的力三角形与几何三角形 \\(OAB\\) 相似。", "\\[\\frac{mg}{h}=\\frac{F}{l}=\\frac{F_e}{r},\\qquad F_e=k\\frac{q_Aq_B}{r^2}\\]", "由 \\(F_e/r=mg/h\\) 与库仑定律联立，得 \\(r^3=kq_Aq_Bh/(mg)\\)，所以第一阶段 \\(AB=r\\) 不变，小球 \\(A\\) 沿以 \\(B\\) 为圆心的圆弧运动；同时 \\(F=mgl/h\\)，随 \\(l\\) 减小而减小。小球 \\(A\\) 到达 \\(O\\) 的正下方后继续竖直上移，\\(r\\) 增大、\\(F_e\\) 减小，由竖直平衡 \\(F+F_e=mg\\) 可知 \\(F\\) 增大。因此拉力先减小后增大。小球 \\(B\\) 所受库仑力的竖直分量在第一阶段增大、第二阶段减小，支持力并非一直减小；电势能先不变后减小。", ["A 错误：库仑力先保持不变，随后减小。", "B 正确：第一阶段 \\(F=mgl/h\\) 减小，第二阶段由 \\(F=mg-F_e\\) 可知 \\(F\\) 增大。", "C 错误：支持力先增大后减小。", "D 错误：电势能先不变，随后因 \\(r\\) 增大而减小。"]),
choice(6, "心脏等势面", "single-choice", "C",
"人体表面的瞬时电势分布可等效为两个等量电荷产生的电场。图中实线为等差等势面，a、b 为两电荷连线上对称点，c、d 为中垂线上对称点。下列说法正确的是（　　）",
["A. 两等量电荷为同种电荷", "B. d、a 两点的电势差 \\(U_{da}=1.5\\,\\mathrm{mV}\\)", "C. 从 c 到 d 的直线上电场强度先变大后变小", "D. a、b 两点的电场强度方向相反"],
"由等势线正负分布识别等量异种电荷；等势线越密，场强越大。", "\\[\\vec E=-\\nabla\\varphi,\\qquad E\\text{ 的大小由等势线疏密反映}\\]", "点 \\(a\\) 在 \\(+1.5\\,\\mathrm{mV}\\) 等势线上；点 \\(c\\)、\\(d\\) 位于等量异号电荷连线的中垂线上，到两电荷距离相等，电势均为零。因此 \\(U_{da}=\\varphi_d-\\varphi_a=-1.5\\,\\mathrm{mV}\\)。从 \\(c\\) 沿中垂线到 \\(d\\)，先接近电荷中点再远离，场强先增后减。", ["A 错误：正负电势分居两侧，场源为异种电荷。", "B 错误：\\(U_{da}=-1.5\\,\\mathrm{mV}\\)，符号与题述不符。", "C 正确：沿中垂线接近中点时场强增大，越过中点后减小。", "D 错误：\\(a\\)、\\(b\\) 两点场强方向相同。"]),
choice(7, "人车质心位移", "single-choice", "B",
"质量 \\(m=50\\,\\mathrm{kg}\\) 的人站在质量 \\(M=200\\,\\mathrm{kg}\\)、长 \\(L=3\\,\\mathrm m\\) 的小车一端。地面光滑，人走到另一端的过程中，人将前进（　　）",
["A. \\(2.0\\,\\mathrm m\\)", "B. \\(2.4\\,\\mathrm m\\)", "C. \\(2.5\\,\\mathrm m\\)", "D. \\(3.0\\,\\mathrm m\\)"],
"人与车组成的系统水平方向无外力，质心位置不变。", "\\[m x=M(L-x)\\]", "设人相对地前进 \\(x\\)，则车向后退 \\(L-x\\)。由质心不动得 \\(50x=200(3-x)\\)，解得 \\(x=2.4\\,\\mathrm m\\)。", ["A 错误。", "B 正确：\\(x=2.4\\,\\mathrm m\\)。", "C 错误。", "D 错误：车会反向移动，人对地位移小于车长。"]),
choice(8, "两球动量碰撞", "single-choice", "C",
"光滑水平面上大小相同的 A、B 两球在同一直线上运动，\\(m_B=6m_A\\)，规定向右为正。碰前两球动量均为 \\(3\\,\\mathrm{kg\\cdot m/s}\\)，碰撞前后 A 球动量变化量为 \\(-4\\,\\mathrm{kg\\cdot m/s}\\)。下列说法正确的是（　　）",
["A. 右方是 A 球，碰前两球均向右运动", "B. 左方是 A 球，碰后两球均向右运动", "C. 碰后 A、B 两球速度大小之比为 \\(6:7\\)", "D. 两球发生的是弹性碰撞"],
"先由冲量求碰后动量，再用总动量守恒；最后检查空间追及条件与动能是否守恒。", "\\[p_A' =3-4=-1,\\quad p_B'=6-(-1)=7\\]", "碰前 \\(A\\) 更快，必须在左侧追上 \\(B\\)。碰后 \\(A\\) 向左、\\(B\\) 向右。速度大小比为 \\(1/m_A:7/(6m_A)=6:7\\)。碰前后总动能不相等，因此不是弹性碰撞。", ["A 错误：\\(A\\) 应在左方。", "B 错误：碰后 \\(A\\) 向左。", "C 正确：速度大小比为 \\(6:7\\)。", "D 错误：碰撞前后总动能不守恒。"]),
choice(9, "四轴无人机悬停", "single-choice", "A",
"质量为 \\(m\\) 的四轴无人机有四个相同螺旋桨，每个螺旋桨扫掠面积为 \\(S\\)。空气密度为 \\(\\rho\\)，四个螺旋桨产生速率为 \\(v\\) 的竖直向下气流。无人机悬停时 \\(v\\) 为（　　）",
["A. \\(\\dfrac12\\sqrt{\\dfrac{mg}{S\\rho}}\\)", "B. \\(2\\sqrt{\\dfrac{S\\rho}{mg}}\\)", "C. \\(\\dfrac12\\sqrt{\\dfrac{mS}{\\rho g}}\\)", "D. \\(2\\sqrt{\\dfrac{mg}{S\\rho}}\\)"],
"单位时间通过四个桨盘的空气质量乘速度变化，给出向下动量流率；其反作用力平衡重力。", "\\[\\dot m=4\\rho Sv,\\qquad mg=\\dot m v=4\\rho Sv^2\\]", "解得 \\(v=\\frac12\\sqrt{mg/(S\\rho)}\\)。量纲为速度，也可排除 B、C。", ["A 正确。", "B 错误：量纲不是速度。", "C 错误：面积出现在错误位置。", "D 错误：系数应为 \\(1/2\\)。"]),
choice(10, "弹簧双块速度图", "single-choice", "D",
"光滑水平面上的 A、B 由轻弹簧连接，初始弹簧原长。A 获得向右瞬时速度后，两物块速度随时间如图。已知 \\(m_A=1\\,\\mathrm{kg}\\)，下列说法正确的是（　　）",
["A. \\(t_1\\) 时刻弹簧处于原长", "B. \\(t_2\\) 时刻 A、B 相距最近", "C. \\(m_B=3\\,\\mathrm{kg}\\)", "D. \\(t_3\\) 时刻弹簧弹性势能为 \\(3\\,\\mathrm J\\)"],
"由速度相等判断弹簧形变量极值，由相对速度最大且换向判断原长位置，再用动量守恒求质量、能量守恒求弹性势能。", "\\[m_Av_A+m_Bv_B=3\\,\\mathrm{kg\\cdot m/s},\\qquad E=\\frac12m_Av_0^2=4.5\\,\\mathrm J\\]", "图示 \\(t_2\\) 时 \\(v_A=-1\\,\\mathrm{m/s}\\)、\\(v_B=2\\,\\mathrm{m/s}\\)，由动量守恒 \\(3\\,\\mathrm{kg\\cdot m/s}=m_Av_A+m_Bv_B\\)，得 \\(m_B=2\\,\\mathrm{kg}\\)。在 \\(t_1\\)、\\(t_3\\) 时两物体同速，分别对应最大伸长与最大压缩；\\(t_3\\) 时共同速度为 \\(1\\,\\mathrm{m/s}\\)，系统动能为 \\(1.5\\,\\mathrm J\\)，故弹性势能为 \\(E_p=4.5\\,\\mathrm J-1.5\\,\\mathrm J=3.0\\,\\mathrm J\\)。", ["A 错误：\\(t_1\\) 为最大伸长。", "B 错误：\\(t_2\\) 为弹簧恢复原长的时刻，不是两物体相距最近的时刻。", "C 错误：\\(m_B=2\\,\\mathrm{kg}\\)。", "D 正确：\\(E_p=4.5\\,\\mathrm J-1.5\\,\\mathrm J=3.0\\,\\mathrm J\\)。"]),
choice(11, "动量守恒条件", "multiple-choice", "CD",
"对题图所示四种情景，下列说法正确的是（　　）",
["A. 子弹打进与固定弹簧相连的木块后一起运动，子弹和木块系统动量守恒", "B. 两同学在地面上传接篮球，两同学和篮球系统动量守恒", "C. 绑有磁铁的两小车在光滑水平地面上相向运动，两车系统动量守恒", "D. 小球从光滑水平面上的可动斜槽顶端释放，离槽前小球和斜槽系统水平方向动量守恒"],
"先明确系统，再判断所考方向的外力冲量是否为零。", "\\[\\Delta\\vec p_{\\text{系统}}=\\vec I_{\\text{外}}\\]", "A 中固定弹簧给系统外力冲量；B 中地面对人的摩擦是外力；C 中磁力是系统内力且水平外力为零；D 中地面支持力竖直，系统水平方向外力为零。", ["A 错误：有弹簧外力冲量。", "B 错误：有地面摩擦外力。", "C 正确：系统水平动量守恒。", "D 正确：系统水平方向动量守恒。"]),
choice(12, "点电荷电势曲线", "multiple-choice", "BD",
"静止于原点 \\(O\\) 的正点电荷电场中，电势 \\(\\varphi\\) 与距离 \\(x\\) 的关系如图。\\(A\\)、\\(B\\)、\\(C\\) 是 \\(x\\) 轴上等距三点。下列说法正确的是（　　）",
["A. \\(U_{AB}<U_{BC}\\)", "B. \\(\\varphi_A>\\varphi_B>\\varphi_C\\)", "C. \\(E_A<E_B<E_C\\)", "D. 负电荷的电势能满足 \\(E_{pA}<E_{pB}<E_{pC}\\)"],
"正点电荷满足 \\(\\varphi=kQ/x\\)、\\(E=kQ/x^2\\)，函数随距离增大而递减，且近处变化更快。", "\\[\\varphi=\\frac{kQ}{x},\\quad E=\\frac{kQ}{x^2},\\quad E_p=q\\varphi\\]", "等距区间上近处电势降落更大，因此 \\(U_{AB}>U_{BC}\\)。场强随距离增大而减小。负电荷乘以递减的正电势后，电势能反而递增。", ["A 错误：\\(U_{AB}>U_{BC}\\)。", "B 正确。", "C 错误：\\(E_A>E_B>E_C\\)。", "D 正确：负电荷使势能次序反向。"]),
choice(13, "多物块连续弹性碰撞", "multiple-choice", "CD",
"质量为 \\(m\\) 的 0 号物块从光滑曲面高 \\(h\\) 处释放，与水平面上依次排列的 2026 个质量均为 \\(2m\\) 的弹性物块发生连续弹性正碰；质量相等的 \\(2m\\) 物块碰撞时交换速度。下列说法正确的是（　　）",
["A. 2026 号物块最终速度为 \\(\\dfrac{2025}{2026}\\sqrt{2gh}\\)", "B. 2023 号物块最终速度为 \\(\\dfrac{8}{81}\\sqrt{2gh}\\)", "C. 0 号物块最终动量大小为 \\(\\left(\\dfrac13\\right)^{2026}m\\sqrt{2gh}\\)", "D. 最终所有物块的总动能为 \\(mgh\\)"],
"一次 \\(m\\) 与静止 \\(2m\\) 的弹性碰撞后，轻块反弹速度为原来的 \\(-1/3\\)，重块获得 \\(2/3\\)；等质量重块之间只交换速度。", "\\[v_m'=-\\frac13v,\\qquad v_{2m}'=\\frac23v\\]", "0 号每次返回曲面后再以原速率的 \\(1/3\\) 回来，连续 2026 次后动量大小为选项 C。依次传出的速度脉冲为 \\(2u/3,2u/9,2u/27,\\ldots\\)，故 2023 号对应 \\(2u/81\\)，不是 \\(8u/81\\)。所有接触均为弹性碰撞、轨道光滑，故总机械能最终全为动能 \\(mgh\\)。", ["A 错误：最终速度由几何级数脉冲决定。", "B 错误：应为 \\(2\\sqrt{2gh}/81\\)。", "C 正确。", "D 正确：全过程机械能守恒。"]),
]


NON_CHOICE = [
{
"number":14,"title":"电容器充放电实验","type":"fill-in","answer":"(1) 向右；(2) \\(0.15\\,\\mathrm F\\)；(3) \\(R_1<R_2\\)",
"answerLatex":"\\[(1)\\quad\\boxed{\\text{向右}}\\]\n\n\\[(2)\\quad\\boxed{C\\approx0.15\\,\\mathrm F}\\]\n\n\\[(3)\\quad\\boxed{R_1<R_2}\\]",
"question":"图甲电源电动势 \\(E=8\\,\\mathrm V\\)。先将开关接 1 给初始不带电的电容器充电，充满后接 2 放电，电流—时间曲线如图乙。回答：(1) 接 2 时，通过 \\(R_0\\) 的电流方向；(2) 已知充电曲线面积 \\(S_1=1233\\,\\mathrm{mA\\cdot s}\\)，求电容；(3) 比较 \\(R_1,R_2\\)。",
"thinking":"电流—时间图像面积等于转移电荷量；初始电流由总串联电阻决定。充电和放电时电容器电流方向相反。", "formula":"\\[Q=\\int I\\,\\mathrm dt=S_1,\\qquad C=Q/E,\\qquad I_0=E/R_{\\text{总}}\\]", "derivation":"接 1 充电时曲线为正，接 2 放电时曲线为负，因此通过 \\(R_0\\) 的放电电流向右。\\(Q=1233\\,\\mathrm{mA\\cdot s}=1.233\\,\\mathrm C\\)，所以 \\(C=1.233/8=0.154125\\,\\mathrm F\\approx0.15\\,\\mathrm F\\)。充电初值约 \\(7\\,\\mathrm{mA}\\)，放电初值约 \\(5\\,\\mathrm{mA}\\)，两过程都经过 \\(R_0\\)，故充电支路总电阻更小，即 \\(R_0+R_1<R_0+R_2\\)，所以 \\(R_1<R_2\\)。"},
{
"number":15,"title":"示波器扫描波形","type":"fill-in","answer":"(1) 负极；(2) 水平；(3) A",
"answerLatex":"\\[\\boxed{\\begin{aligned}(1)&\\ \\text{负极}\\\\(2)&\\ \\text{水平}\\\\(3)&\\ \\mathrm A\\end{aligned}}\\]",
"question":"示波管中电子经 \\(M\\)、\\(N\\) 间电压加速。偏转板 \\(XX'\\)、\\(YY'\\) 分别加图乙所示的同周期锯齿电压和正弦电压。回答：(1) \\(M\\) 端应接电源哪一极；(2) 仅加 \\(U_{XX'}\\) 时屏上亮线方向；(3) 两偏转电压同时施加时，从右向左看屏上可能的波形。",
"thinking":"电子带负电，要向右加速，电场应向左；锯齿电压把时间均匀展开到水平方向，正弦电压给出同一时刻的竖直坐标。", "formula":"\\[x(t)\\propto U_{XX'}(t),\\qquad y(t)\\propto U_{YY'}(t)\\]", "derivation":"\\(M\\) 端接负极、\\(N\\) 端接正极，电场向左而电子受力向右。只加水平偏转锯齿电压时，视觉暂留形成水平亮线。每个周期内光点从左向右匀速扫描，而竖直坐标依次经历零、正最大、零、负最大、零，得到一完整正弦周期，对应选项 A。"},
{
"number":16,"title":"匀强电场中的功与电势","type":"calculation","answer":"(1) \\(E=50\\,\\mathrm{V/m}\\)；(2) \\(U_{bc}=3.0\\,\\mathrm V\\)；(3) \\(E_{pc}=-4.0\\times10^{-4}\\,\\mathrm J\\)",
"answerLatex":"\\[\\boxed{\\begin{aligned}(1)&\\ E=50\\,\\mathrm{V/m}\\\\(2)&\\ U_{bc}=3.0\\,\\mathrm V\\\\(3)&\\ E_{pc}=-4.0\\times10^{-4}\\,\\mathrm J\\end{aligned}}\\]",
"question":"水平向右的匀强电场中，\\(ab\\) 与场强平行，\\(bc\\) 与场强成 \\(60^\\circ\\)，\\(ab=6\\,\\mathrm{cm}\\)，\\(bc=12\\,\\mathrm{cm}\\)。将 \\(q=4\\times10^{-4}\\,\\mathrm C\\) 的正电荷从 \\(a\\) 移到 \\(b\\)，静电力做功 \\(1.2\\times10^{-3}\\,\\mathrm J\\)。(1) 求场强；(2) 求 \\(U_{bc}\\)；(3) 若 \\(\\varphi_b=2\\,\\mathrm V\\)，求电荷在 \\(c\\) 点的电势能。",
"thinking":"匀强电场做功只取位移沿场强方向的投影，且 \\(U_{xy}=\\varphi_x-\\varphi_y\\)。", "formula":"\\[W_{ab}=qEab,\\qquad U_{bc}=Ebc\\cos60^\\circ,\\qquad E_p=q\\varphi\\]", "derivation":"由 \\(1.2\\times10^{-3}=4\\times10^{-4}\\times E\\times0.06\\)，得 \\(E=50\\,\\mathrm{V/m}\\)。于是 \\(U_{bc}=50\\times0.12\\times\\frac12=3.0\\,\\mathrm V\\)。由 \\(U_{bc}=\\varphi_b-\\varphi_c\\)，得 \\(\\varphi_c=2-3=-1\\,\\mathrm V\\)，所以 \\(E_{pc}=q\\varphi_c=-4.0\\times10^{-4}\\,\\mathrm J\\)。"},
{
"number":17,"title":"摆球推动双木块","type":"calculation","answer":"(1) \\(v_C=2\\sqrt{gl/3}\\)；(2) \\(h_{\\max}=3l/4\\)",
"answerLatex":"\\[\\boxed{\\begin{aligned}(1)&\\ v_C=2\\sqrt{gl/3}\\\\(2)&\\ h_{\\max}=3l/4\\end{aligned}}\\]",
"question":"质量均为 \\(m\\) 的木块 \\(A\\)、\\(B\\) 并排置于光滑水平面。\\(A\\) 上固定轻杆，杆顶 \\(O\\) 以长 \\(l\\) 的细线悬挂质量也为 \\(m\\) 的球 \\(C\\)。把细线拉到水平后由静止释放。(1) 求 \\(C\\) 第一次到最低点的速度；(2) 求此后 \\(C\\) 相对摆动中距最低点向左上升的最大高度。",
"thinking":"到最低点前 \\(A\\)、\\(B\\) 保持接触，三物体水平动量守恒；过最低点后 \\(A\\) 不能拉住 \\(B\\)，\\(A\\)、\\(B\\) 分离，再对 \\(A+C\\) 系统使用水平动量和机械能守恒。", "formula":"\\[mv_C+2mV=0,\\quad mgl=\\frac12mv_C^2+\\frac12(2m)V^2\\]", "derivation":"最低点前联立上式得 \\(V=\\sqrt{gl/3}\\)、\\(v_C=-2V\\)，故球速大小 \\(2\\sqrt{gl/3}\\)。过最低点后 \\(B\\) 以 \\(V\\) 匀速离开，\\(A+C\\) 的水平动量为 \\(-mV\\)。球相对 \\(A\\) 到最高点时二者同速，故共同速度 \\(-V/2\\)。\\(A+C\\) 在最低点的动能为 \\(5mV^2/2=5mgl/6\\)，最高点平动动能为 \\(mV^2/4=mgl/12\\)，二者之差转化为重力势能：\\(mgh=5mgl/6-mgl/12=3mgl/4\\)，所以 \\(h=3l/4\\)。"},
{
"number":18,"title":"X 射线管电子偏转","type":"calculation","answer":"(1) \\(v_0=8.0\\times10^7\\,\\mathrm{m/s}\\)；(2) \\(x_C=0.50\\,\\mathrm m\\)；(3) \\(2.0\\times10^4\\,\\mathrm V\\le U\\le2.4\\times10^4\\,\\mathrm V\\)",
"answerLatex":"\\[\\boxed{\\begin{aligned}(1)&\\ v_0=8.0\\times10^7\\,\\mathrm{m/s}\\\\(2)&\\ x_C=0.50\\,\\mathrm m\\\\(3)&\\ 2.0\\times10^4\\,\\mathrm V\\le U\\le2.4\\times10^4\\,\\mathrm V\\end{aligned}}\\]",
"question":"X 射线管中电子由静止经 \\(U_0=1.82\\times10^4\\,\\mathrm V\\) 加速，再沿中线进入长 \\(L=20\\,\\mathrm{cm}\\)、间距 \\(d=16\\,\\mathrm{cm}\\) 的偏转板，板间电压初值 \\(U=2.184\\times10^4\\,\\mathrm V\\)。中线距靶台竖直高度 \\(h=45\\,\\mathrm{cm}\\)，靶台长度 \\(AB=10\\,\\mathrm{cm}\\)，中心为 \\(C\\)。电子质量 \\(m=9.1\\times10^{-31}\\,\\mathrm{kg}\\)，电荷量大小 \\(e=1.6\\times10^{-19}\\,\\mathrm C\\)。(1) 求入射速度；(2) 求 \\(C\\) 到 \\(N\\) 板右端的水平距离；(3) 求电子能打在靶台 \\(ACB\\) 上时的板间电压范围。",
"thinking":"加速区用动能定理；偏转板内是类平抛，离板后沿切线匀速。把板内位移与板外位移相加，并用靶台左右边缘给电压上下限。", "formula":"\\[eU_0=\\frac12mv_0^2,\\quad a=\\frac{eU}{md},\\quad y_1=\\frac{UL^2}{4dU_0},\\quad \\tan\\theta=\\frac{UL}{2dU_0}\\]", "derivation":"由动能定理得 \\(v_0=\\sqrt{2eU_0/m}=8.0\\times10^7\\,\\mathrm{m/s}\\)。初始偏转电压下，\\(y_1=UL^2/(4dU_0)=0.075\\,\\mathrm m\\)，且 \\(\\tan\\theta=UL/(2dU_0)=0.75\\)。离板后还需下降 \\(h-y_1=0.375\\,\\mathrm m\\)，故 \\(x_C=(h-y_1)/\\tan\\theta=0.50\\,\\mathrm m\\)。一般地，若落点距 N 板右端为 \\(x\\)，则 \\(h=UL(L+2x)/(4dU_0)\\)。靶台两端对应 \\(x=0.45\\,\\mathrm m\\) 与 \\(0.55\\,\\mathrm m\\)，代入得 \\(U_{\\max}=2.38\\times10^4\\,\\mathrm V\\)、\\(U_{\\min}=2.02\\times10^4\\,\\mathrm V\\)，保留两位有效数字即 \\(2.0\\times10^4\\le U\\le2.4\\times10^4\\,\\mathrm V\\)。"},
]


def make_problem(row):
    n = row["number"]
    pid = f"autumn11_test_{n:02d}"
    is_choice = row["type"] in {"single-choice", "multiple-choice"}
    steps = [
        {"stepId": 1, "title": "条件提取与物理模型", "content": row["thinking"]},
        {"stepId": 2, "title": "对应公式", "content": row["formula"]},
        {"stepId": 3, "title": "完整推导", "content": row["derivation"]},
        {"stepId": 4, "title": "答案", "content": "\\[\\boxed{\\text{" + row["answer"] + "}}\\]" if is_choice else row.get("answerLatex", row["answer"])},
    ]
    analysis = {"title": "解析", "sharedThinking": row["thinking"], "sharedFormula": row["formula"]}
    presentation = {"collapseEachStep": True, "optionMode": "shared-solution"}
    if is_choice:
        independent = any(key in row["question"] for key in ("说法正确", "判断正确"))
        if independent:
            presentation["optionMode"] = "independent-statements"
            analysis["optionAnalyses"] = [
                {"label": chr(65 + i), "judgment": text} for i, text in enumerate(row["judgments"])
            ]
    animation_type = "electric_field_model" if n <= 6 or n in (12, 14, 15, 16, 18) else "momentum_model"
    variant = ("electrostatic_test" if animation_type == "electric_field_model" else "momentum_test") + f"_{n:02d}"
    electric = animation_type == "electric_field_model"
    model_id = "electric-field-potential" if electric else "momentum-impulse"
    model_name = "电场强度与电势能" if electric else "动量与冲量"
    module = "电磁学" if electric else "力学"
    problem = {
        "id": pid, "chapter": CHAPTER, "title": f"第{n}题：{row['title']}",
        "type": row["type"], "question": row["question"], "answer": row["answer"],
        "analysis": analysis, "analysisPresentation": presentation, "steps": steps,
        "knowledge": ["电场与动量综合测试", row["title"]],
        "practice": {
            "title": "进阶近似题：同考点迁移",
            "question": f"保留“{row['title']}”的核心物理模型，改变一个关键约束或增加一个相邻过程，重新判断结论并写出必要的临界条件。",
            "answer": "答案应由改变后的条件重新列式确定，不能只替换原题数字。",
            "thinking": "先识别原题不变量，再判断新增条件改变了受力、系统边界、能量转化还是运动阶段。"
        },
        "animation": {"enabled": True, "level": "animated", "type": animation_type, "variant": variant,
                      "playable": True, "interactive": True, "notes": "按原题模型展示关键状态变化。",
                      "params": {"rate": {"label": "过程速率", "value": 1, "min": 0.5, "max": 2, "step": 0.1}}},
        "images": [{"src": f"assets/problem-images/autumn-lesson11/question-{n:02d}.webp", "alt": f"第{n}题原题印刷配图"}],
        "taxonomy": {"module": module, "topic": CHAPTER, "modelId": model_id,
                     "modelName": model_name, "familyId": f"autumn11-test-{n:02d}", "familyName": row["title"],
                     "role": "综合题" if n >= 13 else "条件变式", "difficulty": 4 if n >= 13 else 3,
                     "variantLevel": "L3" if n >= 13 else "L2", "skills": ["物理模型识别", "分阶段推导"],
                     "prerequisites": ["电场基础", "动量与能量"]},
    }
    if is_choice:
        problem["options"] = row["options"]
    return problem


def main():
    rows = [dict(zip(("number", "title", "type", "answer", "question", "options", "thinking", "formula", "derivation", "judgments"), row)) if isinstance(row, tuple) else row for row in ITEMS]
    # choice() already returns dictionaries; keep this guard for readable source edits.
    rows = ITEMS + NON_CHOICE
    entries = json.loads(INDEX.read_text(encoding="utf-8"))["problems"]
    entries = [entry for entry in entries if not entry["id"].startswith("autumn11_test_")]
    for row in rows:
        problem = make_problem(row)
        name = problem["id"] + ".json"
        existing_path = OUT / name
        if existing_path.exists():
            existing = json.loads(existing_path.read_text(encoding="utf-8"))
            for field in ("learningPath", "studentExploration", "realLifeCase", "learningCycle",
                          "studyTracks", "examConnections", "notebooklm", "virtualExperiment"):
                if field in existing:
                    problem[field] = existing[field]
        existing_path.write_text(json.dumps(problem, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        entries.append({"id": problem["id"], "file": name})
    INDEX.write_text(json.dumps({"problems": entries}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    guide_payload = json.loads(GUIDES.read_text(encoding="utf-8"))
    guide_payload["chapters"][CHAPTER] = {
        "overview": "本测试综合考查静电现象、静电平衡、电势与电场、电容器充放电、示波器，以及质心、动量守恒、碰撞和多物体系统。",
        "laws": [
            "电场题先区分场强、电势和电势能，并明确电势差下标顺序。",
            "动量题先选系统和方向，检查外力冲量，再判断是否还满足机械能守恒。",
            "图像与实验题要把斜率、面积、峰值和方向分别对应到物理量。"
        ],
        "formulas": [
            {"title": "电场功与电势", "latex": "\\[W_{AB}=qU_{AB}=q(\\varphi_A-\\varphi_B)\\]", "note": "下标顺序决定电势差符号。"},
            {"title": "系统动量定理", "latex": "\\[\\Delta\\vec p_{\\mathrm{系统}}=\\vec I_{\\mathrm{外}}\\]", "note": "某方向外冲量为零时，该方向动量守恒。"},
            {"title": "电容充放电", "latex": "\\[Q=CU=\\int i\\,\\mathrm dt\\]", "note": "电流—时间图像的代数面积表示转移电荷量。"},
            {"title": "电子加速与偏转", "latex": "\\[eU_0=\\frac12mv_0^2,\\qquad a=\\frac{eU}{md}\\]", "note": "板内类平抛，离板后沿切线匀速。"}
        ]
    }
    GUIDES.write_text(json.dumps(guide_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(rows)} verified problems for {CHAPTER}")


if __name__ == "__main__":
    main()
