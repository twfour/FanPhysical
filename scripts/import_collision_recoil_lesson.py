#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "problems"
CHAPTER = "碰撞与反冲"

COURSE = [
    ("head_on_collision", "对心碰撞速度的可能值", r"质量为 \(m\) 的小球 \(A\) 以速度 \(v_0\) 在光滑水平面上运动，与质量为 \(2m\) 的静止小球 \(B\) 发生对心碰撞。碰撞后两球速度大小可能为（多选）。", [r"A. \(v_A=\frac13v_0,\ v_B=\frac23v_0\)", r"B. \(v_A=\frac25v_0,\ v_B=\frac7{10}v_0\)", r"C. \(v_A=\frac14v_0,\ v_B=\frac58v_0\)", r"D. \(v_A=\frac38v_0,\ v_B=\frac5{16}v_0\)"], "AC", r"先用动量守恒确定可能的方向组合，再检查碰后总动能不能超过碰前，同时要求碰后两球已经分离。A 对应弹性碰撞；C 可由 \(A\) 反弹得到且动能减少；B 会使碰后动能大于碰前；D 中 \(A\) 仍比前方的 \(B\) 快，两球继续接近，不能作为碰撞结束状态。", "collision", 3, "L2"),
    ("newton_cradle", "质量递减牛顿摆", r"用长均为 \(l\) 的细绳悬挂四个刚性小球，碰撞无机械能损失，质量满足 \(m_1\gg m_2\gg m_3\gg m_4\)。将第一个小球拉起 \(60^\circ\) 后释放，求最后一个小球开始运动时的速度。", None, r"第一球到最低点前由机械能守恒得 \(u_1=\sqrt{gl}\)。每次都是一维弹性碰撞，静止目标球获得速度 \(u_{i+1}=\frac{2m_i}{m_i+m_{i+1}}u_i\)。故 \[v_4=\frac{8m_1m_2m_3}{(m_1+m_2)(m_2+m_3)(m_3+m_4)}\sqrt{gl}.\]", "collision", 4, "L2"),
    ("sticky_spring", "粘连碰撞与弹簧储能", r"光滑水平面上有三个质量均为 \(m\) 的物块 \(A、B、C\)，开始时弹簧处于原长。物块 \(A\) 以速度 \(v_0\) 向右运动，与 \(B\) 相碰并粘连。求弹簧弹性势能最大值与 \(C\) 的最大速度。", None, r"粘连后 \(A、B\) 的速度为 \(v_0/2\)。弹簧最短时 \(AB\) 与 \(C\) 共速 \(v_0/3\)，由能量差得 \(E_{p\max}=mv_0^2/12\)。弹簧恢复原长时相当于质量 \(2m\) 与 \(m\) 的弹性作用，\(C\) 的最大速度为 \(2v_0/3\)。", "spring", 4, "L2"),
    ("person_boat", "人走船动", r"静止在水面上的小船长为 \(L\)、质量为 \(M\)，船最右端站有质量为 \(m\) 的人。忽略水的阻力，人从最右端走到最左端的过程中，小船移动的距离是多少？", None, r"水平方向外力冲量为零，系统质心水平位置不变。设船向右移动 \(x\)，人相对船向左走 \(L\)，则 \(Mx+m(x-L)=0\)，所以 \[x=\frac{mL}{M+m}.\]", "recoil", 2, "L1"),
    ("cannon_recoil", "炮车发射反冲", r"炮车质量为 \(M\)，炮弹质量为 \(m\)，发射前系统静止。炮弹射出炮口时相对地面速度为 \(v\)。忽略地面对炮车的摩擦，求水平发射时炮车速度；若炮身仰角为 \(\alpha\)，求炮身后退速度。", None, r"水平方向动量守恒。水平发射时 \(MV=mv\)，炮车反向速度大小 \(V=mv/M\)。斜向发射时只取炮弹水平动量，\[V=\frac{mv\cos\alpha}{M}.\]", "recoil", 2, "L1"),
    ("rocket_ejection", "火箭连续喷气", r"太空中火箭相对地球以 \(v_0\) 匀速飞行，总质量为 \(M\)。火箭每次以相对喷出前箭身速度 \(v\) 向后喷出质量为 \(m\) 的气体。忽略外力，求第二次喷气后的火箭速度。", None, r"第一次喷气由动量守恒得 \(v_1=v_0+\frac{mv}{M-m}\)。第二次喷气前箭身质量为 \(M-m\)，喷气后为 \(M-2m\)，故 \[v_2=v_1+\frac{mv}{M-2m}=v_0+\frac{mv}{M-m}+\frac{mv}{M-2m}.\]", "recoil", 3, "L2"),
    ("bullet_block", "子弹嵌入木块", r"质量为 \(m\)、速度为 \(v_0\) 的子弹水平打进质量为 \(M\)、静止在光滑水平面上的木块并留在其中。求木块共同速度；若子弹射入深度为 \(d\)，求子弹对木块的平均作用力。", None, r"碰撞阶段动量守恒，\(V=mv_0/(M+m)\)。系统损失的机械能等于内力在相对位移上的功：\(Fd=\frac12\frac{mM}{m+M}v_0^2\)，所以 \[F=\frac{mMv_0^2}{2(M+m)d}.\]", "inelastic", 3, "L2"),
    ("bullet_spring_blocks", "子弹木块弹簧系统", r"木块 \(A、B\) 由弹簧连接并静止在光滑水平面上，质量分别为 \(99m\) 和 \(100m\)。质量为 \(m\) 的子弹以速度 \(v_0\) 水平射入 \(A\) 并留在其中。求之后弹簧的最大弹性势能。", None, r"子弹嵌入后左侧组合质量为 \(100m\)，速度为 \(v_0/100\)。弹簧压缩最大时两端共速 \(v_0/200\)。碰后动能与共速动能之差转化为弹性势能，得 \[E_{p\max}=\frac{mv_0^2}{400}.\]", "spring", 4, "L2"),
    ("block_rider", "粘连木块推动上层滑块", r"物体 \(A、B、C\) 的质量分别为 \(2\,\mathrm{kg},3\,\mathrm{kg},1\,\mathrm{kg}\)。\(A\) 以 \(12\,\mathrm{m/s}\) 向右与静止的 \(B\) 碰撞并粘连，最终 \(A、B、C\) 一起运动。\(C\) 与 \(A、B\) 的动摩擦因数为 \(0.4\)，取 \(g=10\,\mathrm{m/s^2}\)，求 \(C\) 相对 \(A、B\) 的位移。", None, r"碰撞后 \(AB\) 速度为 \(24/5=4.8\,\mathrm{m/s}\)，最终三者共速 \(4\,\mathrm{m/s}\)。摩擦产生的热量为 \(Q=\frac12\times5\times4.8^2-\frac12\times6\times4^2=9.6\,\mathrm J\)。由 \(Q=\mu m_Cgs_{\rm rel}\) 得 \(s_{\rm rel}=2.4\,\mathrm m\)。", "inelastic", 4, "L2"),
    ("cart_pendulum", "碰撞后车载摆球", r"\(m_A=m_B=M\)，\(m_C=M/4\)，摆长 \(l=0.4\,\mathrm m\)。载有摆球 \(C\) 的 \(B\) 车以 \(3.6\,\mathrm{m/s}\) 向左撞上静止的 \(A\) 车并粘连。碰撞时间极短。求 \(C\) 摆到最高点时两车速度及悬线与竖直方向夹角。取 \(g=10\,\mathrm{m/s^2}\)。", None, r"碰后两车速度为 \(1.8\,\mathrm{m/s}\)，摆球瞬时仍为 \(3.6\,\mathrm{m/s}\)。最高点两车与球相对静止，由总动量守恒得共同速度 \(2.0\,\mathrm{m/s}\)。碰后到最高点机械能守恒，算得 \(1-\cos\theta=0.36\)，故 \(\theta=\arccos0.64\approx50.2^\circ\)。", "composite", 5, "L3"),
]

HOMEWORK = [
    ("skateboard_jump", "滑板间往返跳跃", r"质量 \(45\,\mathrm{kg}\) 的同学站在质量均为 \(2.5\,\mathrm{kg}\) 的滑板 \(A\) 上，二者以 \(20\,\mathrm{m/s}\) 运动。该同学跳上滑板 \(B\)，再跳回 \(A\)，最终两滑板以相同速度运动且不碰撞。判断全过程的动量和冲量（单选）。", ["A. 同学与两滑板组成的系统动量守恒", "B. 同学跳离滑板 B 时，B 的速度减小", r"C. 最终同学与滑板 A 的共同速度为 \(19\,\mathrm{m/s}\)", r"D. 同学跳离 B 的过程中对 B 的冲量大小为 \(47.5\,\mathrm{N\cdot s}\)"], "AC", r"整体水平方向无外力，动量守恒。最终所有部分速度相同，\(v=47.5\times20/50=19\,\mathrm{m/s}\)。滑板 \(B\) 从 \(20\) 变为 \(19\,\mathrm{m/s}\)，其冲量大小只有 \(2.5\,\mathrm{N\cdot s}\)。", "recoil", 3, "L2"),
    ("collision_possible", "正碰末速度判定", r"两小球 \(A、B\) 在光滑水平面相向运动，\(m_A=6\,\mathrm{kg}\)，\(m_B=3\,\mathrm{kg}\)，\(v_A=6\,\mathrm{m/s}\)，\(v_B=-6\,\mathrm{m/s}\)。下列碰后速度可能的是（单选）。", [r"A. \(v'_A=4\,\mathrm{m/s},\ v'_B=-2\,\mathrm{m/s}\)", r"B. \(v'_A=-4\,\mathrm{m/s},\ v'_B=15\,\mathrm{m/s}\)", r"C. \(v'_A=-2\,\mathrm{m/s},\ v'_B=10\,\mathrm{m/s}\)", r"D. \(v'_A=-3\,\mathrm{m/s},\ v'_B=12\,\mathrm{m/s}\)"], "C", r"碰前总动量为 \(18\,\mathrm{kg\cdot m/s}\)，总动能为 \(162\,\mathrm J\)。C 满足动量守恒、碰后动能不增加，且 \(v'_B>v'_A\)，两球已经分离。A 中两球仍相向接近；B 不满足动量守恒；D 虽满足动量守恒，但碰后动能增大。", "collision", 3, "L2"),
    ("mobile_u_tube", "可动U形管中的小球", r"水平面上固定两根足够长的平行导槽，质量为 \(m\) 的 U 形管可在导槽间自由滑动。一质量也为 \(m\) 的小球以速度 \(v_0\) 从管的一端射入，从另一端射出。忽略摩擦，判断机械能、动量、速度和冲量（单选）。", ["A. 小球与 U 形管组成的系统机械能和水平动量均守恒", r"B. 小球射出时速度大小为 \(v_0/2\)", r"C. 小球到圆弧最左端时速度大小为 \(v_0/2\)", r"D. 从射入到最左端，U 形管所受冲量大小为 \(\sqrt2mv_0/2\)，方向竖直向上"], "A", r"系统无耗散，机械能守恒；导槽只给竖直约束，水平动量守恒。最左端时由水平动量与能量联立，管速为 \(-v_0/2\)，小球仍有竖直分速度，故其速率不等于 \(v_0/2\)，管的冲量也沿水平方向。", "composite", 4, "L2"),
    ("cart_jump", "相向小车间跳跃", r"质量均为 \(m\) 的小车 \(A、B\) 以相同速率 \(v_0\) 相向运动。\(A\) 车上质量为 \(2m\) 的人从 \(A\) 跳到 \(B\)。为避免两车相撞，他跳离 \(A\) 时相对地面的最小速度为（单选）。", [r"A. \(v_0\)", r"B. \(\frac54v_0\)", r"C. \(\frac52v_0\)", r"D. \(3v_0\)"], "B", r"设人向右速度为 \(u\)。跳离后 \(A\) 车速度 \(v_A=3v_0-2u\)，人落上 \(B\) 后共同速度 \(v_B=(2u-v_0)/3\)。临界不相撞满足 \(v_B=v_A\)，解得 \(u=5v_0/4\)。", "recoil", 4, "L2"),
    ("billiard_chain", "白球连续撞击红球", r"光滑直线上依次放置 4 个质量均为 \(m\) 的弹性红球。质量为 \(2m\) 的白球以速度 \(v_0\) 撞击 4 号红球，所有碰撞均为弹性正碰。多次碰撞后，白球最终速度大小为（单选）。", ["A. 0", r"B. \(v_0/3\)", r"C. \((1/3)^4v_0\)", r"D. \((1/3)^5v_0\)"], "C", r"质量 \(2m\) 的白球每次撞上一个静止的 \(m\) 球后，自身速度变为原来的 \(1/3\)。红球间等质量碰撞把速度依次传走，使白球先后与 4 个静止红球发生有效碰撞，故最终为 \((1/3)^4v_0\)。", "collision", 4, "L2"),
    ("spring_velocity_graph", "弹簧双块速度图像", r"轻弹簧两端连接质量为 \(m_1、m_2\) 的物块，静止在光滑水平面。令 \(m_1\) 瞬时获得向右 \(3\,\mathrm{m/s}\) 的速度，图示给出两物块速度随时间变化。根据图像判断弹簧状态、质量比和能量比（单选）。", [r"A. \(t_1、t_3\) 时弹簧均处于压缩状态且势能最大", r"B. \(t_4\) 时弹簧恢复原长，两物块回到出发位置", r"C. \(m_1:m_2=2:3\)", r"D. \(t_3\) 时 \(E_k:E_p=1:2\)"], "C", r"由 \(t_2\) 时 \(v_1=0,v_2=2\) 与初态动量守恒得 \(3m_1=2m_2\)，故质量比 \(2:3\)。\(t_4\) 时弹簧恢复原长且速度状态回到初态，但质心一直向右运动，两物块不会回到原出发位置。\(t_1、t_3\) 分别是最大压缩与最大伸长；按总能量计算 \(t_3\) 时能量比不是 \(1:2\)。", "spring", 4, "L2"),
    ("pendulum_collision", "摆球与静止球弹性碰撞", r"质量分别为 \(m、2m\) 的小球 \(A、B\)。\(B\) 静置于光滑水平面，\(A\) 从高 \(h\) 处由静止下摆，在最低点与 \(B\) 弹性碰撞。求碰后 \(A\) 可能摆起的最大高度（多选）。", [r"A. \(h/10\)", r"B. \(h/9\)", r"C. \(4h/9\)", r"D. \(h\)"], "B", r"碰前 \(A\) 速度为 \(u=\sqrt{2gh}\)。一维弹性碰撞后 \(A\) 反弹，速度大小为 \(u/3\)，故由机械能守恒 \(h'=u^2/(18g)=h/9\)。", "collision", 3, "L2"),
    ("bounce_big_ball", "小球叠放反弹", r"半径均可忽略的弹性小球与大球质量满足 \(M\gg m\)。小球从高度 \(h_1\) 处随大球一起自由下落，大球与地面碰撞后，小球反弹到高度 \(h_2\)。比较坚硬地面与弹性地面两种情况（多选）。", [r"A. 坚硬地面上 \(h_2\approx3h_1\)", r"B. 坚硬地面上 \(h_2\approx9h_1\)", r"C. 弹性地面上 \(h_2\gg h_1\)", r"D. 弹性地面上 \(h_2\approx h_1\)"], "BD", r"坚硬地面使大球近似以原速反弹向上，小球仍向下，二者弹性碰撞后小球速度约为落地速度的 3 倍，所以高度约为 9 倍。若地面自身可自由反冲，能量会在大球与地面间重新分配，小球不获得这种速度叠加，近似回到原高度。", "collision", 4, "L2"),
    ("acrobat_cart", "杂技演员跳笼", r"质量为 \(M=5m\) 的平板车静止在光滑水平面。质量为 \(m\) 的杂技演员从车右端笼子的左边缘水平向左跳出，落在车左边缘 \(P\) 点时相对车静止。车长 \(L=4\,\mathrm m\)，笼长 \(l=1\,\mathrm m\)，高 \(h=1.25\,\mathrm m\)，取 \(g=10\,\mathrm{m/s^2}\)。判断车和人的运动（多选）。", [r"A. 平板车最终速度大小为 \(0.5\,\mathrm{m/s}\)", r"B. 演员水平方向移动距离为 \(3\,\mathrm m\)", r"C. 平板车位移大小为 \(0.5\,\mathrm m\)", r"D. 演员起跳时相对车速度大小为 \(5\,\mathrm{m/s}\)"], "C", r"演员相对车向左移动 \(L-l=3\,\mathrm m\)。质心水平位置不变，\(5m x+m(x-3)=0\)，故车向右移动 \(0.5\,\mathrm m\)。下落时间为 \(0.5\,\mathrm s\)，相对车速度应为 \(6\,\mathrm{m/s}\)。落地后系统重新静止。", "recoil", 4, "L2"),
    ("mobile_curved_tube", "可动车载弯管", r"质量为 \(2m\) 的小车上固定光滑弯曲圆管，整体静止在光滑水平面。质量为 \(m\) 的小球以速度 \(v\) 从左端滑入，能到达管道最高点并从右端滑离。判断小车位置、相对速度、最高点和动量变化（多选）。", ["A. 小球滑离小车时，小车回到原来位置", r"B. 小球滑离时相对小车速度大小为 \(v\)", r"C. 管道中心线最高点的竖直距离为 \(v^2/(3g)\)", r"D. 从滑入到最高点，小车动量变化大小为 \(mv/3\)"], "ABC", r"始末小球相对小车位置相同，质心不变使小车回到原位；能量和水平动量守恒使滑离时相对速率恢复为 \(v\)。临界到达最高点时球与车相对静止，共速 \(v/3\)，由能量守恒得 \(h=v^2/(3g)\)。此时小车动量为 \(2mv/3\)，故 D 错。", "composite", 5, "L3"),
    ("ring_bullet_pendulum", "滑环悬挂弹道摆", r"固定水平杆上套有质量为 \(m\) 的光滑圆环，环下用轻绳悬挂质量为 \(m\) 的木块。质量为 \(m_0\) 的子弹以速度 \(v_0\) 水平射入木块并留在其中。判断系统动量、碰后速度和最大上升高度（多选）。", ["A. 子弹射入后的运动过程中，圆环、木块和子弹系统水平动量守恒", r"B. 碰后瞬间木块和子弹共同速度为 \(m_0v_0/(m_0+m)\)", r"C. 最大上升高度为 \(\frac{mm_0^2v_0^2}{2g(m_0+m)^2(m_0+2m)}\)", r"D. 最大上升高度为 \(\frac{mm_0v_0^2}{2g(m_0+m)^2(m_0+2m)}\)"], "ABC", r"碰撞瞬间对子弹和木块用动量守恒得 B。之后整个系统只受竖直外力，水平动量守恒。摆至最高点时各部分水平共速，再用机械能守恒，得到 \[h=\frac{mm_0^2v_0^2}{2g(m_0+m)^2(m_0+2m)}.\]", "composite", 5, "L3"),
    ("plank_collision", "粗糙木板碰撞后相对滑动", r"光滑水平轨道上有足够长的粗糙木板 \(A\) 和滑块 \(C\)，滑块 \(B\) 位于 \(A\) 左端。\(A、B\) 以 \(5\,\mathrm{m/s}\) 向右匀速运动，\(C\) 静止。\(m_A=2\,\mathrm{kg},m_B=1\,\mathrm{kg},m_C=2\,\mathrm{kg}\)，\(\mu=0.5\)。\(A\) 与 \(C\) 短时碰撞后立即粘连，取 \(g=10\,\mathrm{m/s^2}\)，判断后续运动（多选）。", [r"A. 碰后瞬间 A 的速度为 \(3\,\mathrm{m/s}\)", r"B. 碰后瞬间 A 的速度为 \(2.5\,\mathrm{m/s}\)", r"C. A、B 间摩擦产生热量 \(15\,\mathrm J\)", r"D. 若 A 长 \(0.6\,\mathrm m\)，B 不会滑离 A"], "BD", r"短碰撞时 \(B\) 所受摩擦冲量可忽略，速度仍为 \(5\,\mathrm{m/s}\)；\(A、C\) 粘连后速度为 \(2.5\,\mathrm{m/s}\)。随后三者最终共速 \(3\,\mathrm{m/s}\)，摩擦热为 \(2.5\,\mathrm J\)，相对位移 \(0.5\,\mathrm m\)，小于板长 \(0.6\,\mathrm m\)。", "inelastic", 5, "L3"),
]

PRACTICE = {
    "collision": ("进阶近似题：含恢复系数的正碰", r"质量为 \(m\) 与 \(2m\) 的两球相向运动，碰前速度分别为 \(u\) 和 \(-u/2\)，恢复系数为 \(e\)。求碰后速度，并讨论何时发生二次碰撞。", r"联立动量守恒与 \(v_2-v_1=e(u_1-u_2)\)，再按碰后相对速度判断是否再次接近。", "先规定统一正方向；恢复系数约束的是分离相对速度与接近相对速度之比。"),
    "spring": ("进阶近似题：非等质量弹簧碰撞", r"质量 \(m_1\) 的物块以 \(v_0\) 撞上与弹簧相连的质量 \(m_2\) 物块并粘连，弹簧另一端连接质量 \(m_3\)。求最大压缩量和 \(m_3\) 的最大速度。", "先处理短时粘连，再对弹簧作用阶段联立总动量与机械能。", "碰撞阶段与弹簧缓慢作用阶段必须分开选系统，机械能不能跨越粘连碰撞直接守恒。"),
    "recoil": ("进阶近似题：多级反冲", r"初始静止的载体质量为 \(M\)，依次向相反方向抛出质量 \(m_1、m_2\) 的物体，给定两次抛出物相对载体的速度。求载体最终速度。", "逐次以每次抛出前的剩余系统为研究对象写动量守恒。", "相对速度必须先换成同一参考系中的速度；每次抛出后载体质量都会改变。"),
    "inelastic": ("进阶近似题：粘连与相对滑动", r"滑块碰撞并粘上可动木板，板上另有可滑动物体。已知摩擦因数和板长，判断最终是否掉落并求总热量。", "短碰撞用动量守恒，随后滑动阶段再用总动量和摩擦生热关系。", "先求碰后瞬间各部分速度，再由最终共速和能量损失反推相对位移。"),
    "composite": ("进阶近似题：可动约束中的碰撞", r"小球进入可水平移动的曲管，在最高点发生完全非弹性碰撞后沿另一侧滑下。求载体位移、碰撞损失和最终速度。", "全过程分为入管、上升、碰撞、下滑四段，每段分别检查水平动量和机械能。", "可动约束题优先用质心位置处理位移，用水平动量处理共速，再用能量处理高度与损失。"),
}

def make_problem(item, number, kind):
    if len(item) == 8:
        slug, name, question, answer, explanation, family, difficulty, level = item
        options = None
    else:
        slug, name, question, options, answer, explanation, family, difficulty, level = item
    prefix = "course" if kind == "course" else "hw"
    problem_id = f"collision_lesson2_{prefix}_{number:02d}_{slug}"
    ptitle, pq, pa, pt = PRACTICE[family]
    label = f"例{number}" if kind == "course" else f"第{number}题"
    option_mode = "independent-statements" if options and any(word in question for word in ("判断", "说法")) else "shared-solution"
    problem = {
        "id": problem_id, "chapter": CHAPTER, "title": f"{label}：{name}", "question": question,
        "options": options, "answer": answer,
        "analysis": {
            "title": "解析",
            "sharedThinking": "先按碰撞、相互作用或反冲阶段划分过程，统一正方向并明确每一阶段的系统边界。",
            "sharedFormula": r"\[\vec I_{\rm ext}=\Delta\vec p,\qquad \sum\vec p_{\rm i}=\sum\vec p_{\rm f}\]",
        },
        "analysisPresentation": {"collapseEachStep": True, "optionMode": option_mode},
        "steps": [
            {"title": "条件提取", "content": "标出碰前与碰后状态，规定正方向；短时碰撞先判断外力冲量能否忽略。"},
            {"title": "系统与方程", "content": "按阶段选择研究系统，动量守恒与机械能守恒分别检查，不能因动量守恒就默认动能不变。"},
            {"title": "计算与判断", "content": explanation},
            {"title": "结论", "content": (f"答案为 **{answer}**。" if answer else "计算结果见上一步。") + "最后检查速度方向、总动量和碰后动能是否符合碰撞类型。"},
        ],
        "knowledge": ["动量守恒", "碰撞与反冲", name],
        "practice": {"title": ptitle, "question": pq, "answer": pa, "thinking": pt, "difficulty": "equal-or-higher", "upgradeType": "same-concept-structural-transfer"},
        "animation": {
            "enabled": True, "level": "animated", "type": "collision_recoil_model", "variant": slug,
            "playable": True, "interactive": True, "notes": f"按“{name}”原题过程显示物体运动、动量交换和关键阶段。",
            "params": {
                "mass": {"label": "基准质量", "value": 1, "min": 0.2, "max": 5, "step": 0.1, "unit": "kg"},
                "speed": {"label": "初速度", "value": 6, "min": 1, "max": 12, "step": 0.5, "unit": "m/s"},
                "factor": {"label": "质量比/条件", "value": 0.5, "min": 0.1, "max": 1.5, "step": 0.1, "unit": ""},
            },
            "timeline": {"duration": 8 if difficulty >= 4 else 6, "loop": False},
        },
        "taxonomy": {
            "module": "力学", "topic": CHAPTER, "modelId": "collision-recoil", "modelName": "碰撞与反冲",
            "familyId": f"collision-recoil-{family}", "familyName": {"collision":"弹性碰撞与可行性","spring":"碰撞与弹簧耦合","recoil":"反冲与质心运动","inelastic":"完全非弹性碰撞","composite":"可动约束综合"}[family],
            "role": "综合题" if difficulty >= 5 else ("母题" if number == 1 and kind == "course" else "条件变式"),
            "difficulty": difficulty, "variantLevel": level,
            "skills": ["分阶段选择系统", "动量与能量联合"], "prerequisites": ["动量定理", "机械能守恒"],
        },
    }
    return problem

def main():
    created = []
    for number, item in enumerate(COURSE, 1):
        problem = make_problem(item, number, "course")
        path = OUT / f"{problem['id']}.json"
        path.write_text(json.dumps(problem, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        created.append((problem["id"], path.name))
    for number, item in enumerate(HOMEWORK, 1):
        problem = make_problem(item, number, "homework")
        path = OUT / f"{problem['id']}.json"
        path.write_text(json.dumps(problem, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        created.append((problem["id"], path.name))
    index_path = OUT / "index.json"
    index = json.loads(index_path.read_text(encoding="utf-8"))
    known = {item["id"] for item in index["problems"]}
    index["problems"].extend({"id": pid, "file": file_name} for pid, file_name in created if pid not in known)
    index_path.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"created {len(created)} collision/recoil problems")

if __name__ == "__main__":
    main()
