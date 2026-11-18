#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROBLEMS = ROOT / "data/problems"

DERIVATIONS = {
    "autumn9_course_01_plate_holes_return": r'''原状态从 P 到 N 的总高度为 \(2d\)，初末速度都为零，因此
\[2mgd+qU=0\quad\Rightarrow\quad qU=-2mgd.\]
移动 A 板时，P、N 的位置及电源电压 \(U\) 均不变，所以从 P 到 N 的重力功和电场功仍相互抵消，A 正确、B 错误。

B 板上移 \(d/2\) 后板距变为 \(d/2\)，场强变为原来的 2 倍。设质点进入板间后下降 \(x\) 时速度再次为零，则从 P 到该点由动能定理
\[mg(d+x)+q\frac{U}{d/2}x=0.\]
代入 \(qU=-2mgd\)，得到
\[mg(d+x)-4mgx=0\quad\Rightarrow\quad x=\frac d3,\]
故 C 正确。B 板下移后，到 N 的重力正功增加而电场总功仍为 \(qU\)，粒子到 N 时仍有动能并穿过小孔，D 正确。''',
    "autumn9_course_02_crt_deflection": r'''加速区由动能定理
\[eU_1=\frac12mv_0^2\quad\Rightarrow\quad v_0=\sqrt{\frac{2eU_1}{m}}.\]
板内电场强度 \(E=U_2/d\)，电子偏转加速度大小
\[a_y=\frac{eE}{m}=\frac{eU_2}{md},\qquad t_1=\frac{L_1}{v_0}.\]
因此板内侧移
\[y_1=\frac12a_yt_1^2=\frac12\frac{eU_2}{md}\frac{L_1^2}{v_0^2}=\frac{U_2L_1^2}{4dU_1}.\]
离板时 \(v_y=a_yt_1\)，板外飞行时间 \(t_2=L_2/v_0\)，故
\[y_P=y_1+v_yt_2=\frac{U_2L_1(L_1+2L_2)}{4dU_1}.\]''',
    "autumn9_course_03_projectile_energy": r'''设到最高点 O 的时间为 \(T\)，令 \(\tau=t/T\)。M 点竖直动能为 \(9\,\mathrm J\)，所以任意时刻竖直动能为 \(9(1-\tau)^2\)。水平电场力恒定，而 M 到 O 的电场功为 \(16\,\mathrm J\)，故水平动能为 \(16\tau^2\)。于是
\[E_k(\tau)=16\tau^2+9(1-\tau)^2=25\tau^2-18\tau+9.\]
在 \(\tau=18/(2\times25)=9/25\) 时取最小值
\[E_{k,\min}=9-\frac{18^2}{4\times25}=\frac{144}{25}=5.76\,\mathrm J,\]
所以 D 正确。M 到 N 用时 \(2T\)，水平位移及电场功是 M 到 O 的 \(2^2=4\) 倍，即 \(64\,\mathrm J\)。N 与 M 等高，故
\[E_{kN}=9+64=73\,\mathrm J,\]
B 正确。上升段与下降段电场功分别为 \(16\,\mathrm J\) 和 \(64-16=48\,\mathrm J\)，比为 \(1:3\)，C 错误。机械能增加量等于电场力做功，A 正确。''',
    "autumn9_hw_04_ion_deflection": r'''氢核满足 \(q_H=e,m_H=m_p\)，氦核满足 \(q_{He}=2e,m_{He}=4m_p\)。经同一电压加速后
\[v=\sqrt{\frac{2qU_1}{m}},\qquad \frac{v_H}{v_{He}}=\sqrt{\frac{e/m_p}{2e/(4m_p)}}=\sqrt2.\]
所以速度比既不是 \(1:1\)，也不是 \(1:2\)，A、B 错误。板内侧移为
\[y=\frac12\frac{qU_2}{md}\left(\frac L v\right)^2
=\frac12\frac{qU_2}{md}\frac{L^2m}{2qU_1}
=\frac{U_2L^2}{4dU_1}.\]
其中 \(q,m\) 完全消去，两粒子的侧移比为 \(1:1\)，C 正确、D 错误。''',
    "autumn9_hw_05_linear_accelerator": r'''质子只在缝隙中加速。跨过一次电压为 \(U\) 的缝隙后
\[\frac12mv_1^2-\frac12mv_0^2=eU
\quad\Rightarrow\quad v_1=\sqrt{v_0^2+\frac{2eU}{m}},\]
所以 D 正确。每根漂移管内飞行时间均为 \(T\)，故
\[L_n=v_nT,\]
管长与进入该管的速度成正比，B 正确。前两管长度比实际为
\[L_A:L_B=v_0:\sqrt{v_0^2+\frac{2eU}{m}},\]
只有在额外满足特定初速度条件时才可能等于 \(1:\sqrt2\)，并非恒定，故 C 是不正确说法。为保证每次过缝隙都受加速力，电源极性必须周期性反转，A 正确。''',
    "autumn9_hw_06_atmosphere_field": r'''图中电势由地面的 \(0\) 增至电离层附近约 \(300\,\mathrm{kV}\)，因此电场方向由高电势指向低电势，即竖直向下，A 错误。电容器两极带等量异号电荷，题给储存电荷量约为 \(5.0\times10^5\,\mathrm C\)，地面带电量的大小也是 \(5.0\times10^5\,\mathrm C\)，不是 \(2.5\times10^5\,\mathrm C\)，B 错误。

由 \(C=Q/U\)，
\[C\approx\frac{5.0\times10^5}{300\times10^3}\,\mathrm F
=\frac53\,\mathrm F\approx1.67\,\mathrm F,\]
不是 \(0.6\,\mathrm F\)，C 错误。又因
\[|E|=\left|\frac{\mathrm d\varphi}{\mathrm dh}\right|,\]
而图中横轴为 \(\varphi\)、纵轴为 \(h\)，随高度增大曲线的 \(\mathrm dh/\mathrm d\varphi\) 增大，其倒数 \(\mathrm d\varphi/\mathrm dh\) 减小，所以场强减小，D 正确。''',
    "autumn9_hw_07_effective_gravity_loop": r'''电场力大小为 \(|q|E=3mg/4\)，与重力垂直，故有效重力加速度
\[g'=\sqrt{g^2+\left(\frac{3g}{4}\right)^2}=\frac54g.\]
其方向与斜面平行。小球恰能完成圆周运动时，在有效重力方向的最高点满足临界条件；结合从 A 到该点的能量关系可得
\[v_A^2=3g'R.\]
小球从斜面释放点到 A 的过程中
\[2g's=v_A^2=3g'R\quad\Rightarrow\quad s=\frac{3R}{2}.\]
代入 \(R=0.8\,\mathrm m\)：
\[s=\frac32\times0.8\,\mathrm m=1.2\,\mathrm m,\]
对应 A。''',
    "autumn9_hw_09_crt_multiple": r'''电子经 \(10U\) 加速：
\[10eU=\frac12mv_0^2\Rightarrow v_0=\sqrt{\frac{20eU}{m}},\]
A 正确。偏转场再使电子动能增加 \(eU\)，故
\[\frac12mv^2=10eU+eU=11eU\Rightarrow v=\sqrt{\frac{22eU}{m}},\]
B 正确。板内加速度 \(a=eU/(md)\)，板内时间 \(t_1=l/v_0\)，板外时间 \(t_2=s/v_0\)，所以
\[x=\frac12at_1^2+(at_1)t_2
=\frac{l^2}{40d}+\frac{sl}{20d},\]
C 正确。水平速度始终为 \(v_0\)，总水平路程为 \(l+s\)，故
\[t=\frac{l+s}{v_0}=(l+s)\sqrt{\frac{m}{20eU}},\]
D 正确。''',
    "autumn9_hw_10_charge_plane": r'''等量异号电荷中垂面上各点到两电荷距离相等，故电势恒为零，电势能 \(E_p=q\varphi\) 不变，B 错误。电场垂直平面向左，要使物块受到压向平面的电场力，物块必须带负电，A 正确。

A、B 关于 O 对称，两半段的支持力及摩擦功大小相同。设 A 到 O 的摩擦功为 \(W_f\)，A、B 高度差对应的重力功分别为相反的等量。全程由初速 \(v_0\) 到 B 点静止：
\[0-\frac12mv_0^2=2W_f\quad\Rightarrow\quad W_f=-\frac14mv_0^2.\]
对 A 到 O 应用动能定理，结合对称高度关系可得
\[\frac12mv_O^2=\frac14mv_0^2\quad\Rightarrow\quad v_O=\frac{v_0}{\sqrt2}=\frac{\sqrt2}{2}v_0,\]
D 正确。C 给出的代数式未保证非负，不能直接称为加速度大小。''',
    "autumn9_hw_11_alternating_field": r'''由题设电场幅值可得纵向加速度大小
\[a=\frac{qE}{m}=\frac{v_0^2}{2d}.\]
从中线以零纵向初速度向极板运动，最短碰板过程满足
\[\frac d2=\frac12at_{\min}^2
\Rightarrow t_{\min}=\sqrt{\frac d a}=\frac{\sqrt2d}{v_0},\]
A 正确。碰板前纵向速度的最大允许值满足 \(v_y^2=2a(d/2)=v_0^2/2\)，所以总动能最大值
\[E_{k,\max}=\frac12m\left(v_0^2+\frac{v_0^2}{2}\right)=\frac34mv_0^2,\]
不是 \(5mv_0^2/4\)，B 错误。对 C、D 所给发射相位，必须按每段恒场分别使用
\[y_{n+1}=y_n+v_{yn}\Delta t+\frac12a_n\Delta t^2,\qquad
v_{y,n+1}=v_{yn}+a_n\Delta t.\]
逐段检查会先出现 \(|y|=d/2\)，即粒子先碰板，不能从 \(O'\) 射出，C、D 错误。''',
    "autumn9_hw_12_velocity_turn": r'''设全过程时间为 \(T\)，令 \(\lambda=t/T\)。恒加速度使速度矢量线性变化：
\[\vec v=(2\lambda v_0,(1-\lambda)v_0).\]
故
\[v^2=v_0^2\left[4\lambda^2+(1-\lambda)^2\right]
=v_0^2(5\lambda^2-2\lambda+1).\]
顶点在 \(\lambda=1/5\)，代入得
\[v_{\min}^2=\frac45v_0^2,qquad
E_{k,\min}=\frac12m v_{\min}^2=\frac25mv_0^2,\]
C 正确。末动能 \(2mv_0^2\) 大于初动能 \(mv_0^2/2\)，电场力做正功，电势能降低，B 正确。速度变化量 \(\Delta\vec v=(2v_0,-v_0)\)，故场力方向斜率为 \(-1/2\)，D 错；运动只能确定 \(q\vec E\)，不能单独确定电荷正负，A 错。''',
    "autumn9_hw_13_proton_field": r'''分解两端速度：
\[\vec v_A=\left(\frac32v,\frac{\sqrt3}{2}v\right),\qquad
\vec v_B=\left(\frac12v,-\frac{\sqrt3}{2}v\right).\]
水平平均速度为 \((3v/2+v/2)/2=v\)，所以
\[t=\frac{L}{v},\]
C 正确。加速度为
\[\vec a=\frac{\vec v_B-\vec v_A}{t}
=\left(-\frac{v^2}{L},-\frac{\sqrt3v^2}{L}\right),\]
故 \(|a|=2v^2/L\)，方向与水平成 \(60^\circ\) 斜向左下。质子带正电，电场与加速度同向，且
\[E=\frac{ma}{q}=\frac{2mv^2}{qL},\]
A、B 正确。速度矢量线段到原点的最短距离为
\[v_{\min}=\frac{|\vec v_A\times\Delta\vec v|}{|\Delta\vec v|}=\frac{\sqrt3}{2}v,\]
不是 \(v/2\)，D 错误。''',
    "autumn9_hw_14_rotating_cylinder": r'''偏转灵敏度公式为
\[y=\frac{uL(L+2D)}{4dU_0}.\]
代入 \(L=d=D=0.10\,\mathrm m\)、\(U_0=200\,\mathrm V\)、\(|u|_{\max}=200\,\mathrm V\)：
\[|y|_{\max}=\frac{200\times0.10\times(0.10+2\times0.10)}{4\times0.10\times200}
=0.075\,\mathrm m=7.5\,\mathrm{cm}.\]
信号 \(u=200\sin(2\pi t)\) 的周期为 \(T_u=1\,\mathrm s\)。圆筒转速为 \(2\,\mathrm{r/s}\)，故
\[T_{rot}=\frac12\,\mathrm s=\frac12T_u.\]
一周只记录半个正弦周期，下一周记录相反相位的另半周期；不同剪开线只改变展开图初相位，因此 A、C 正确，B、D 错误。''',
}

OPTION_JUDGMENTS = {
    "autumn9_course_01_plate_holes_return": r'''A：正确。A 板移动只改变板间场强和作用距离，电源仍保持电压 \(U\) 不变，电场总功仍为 \(qU\)。

B：错误。A 板下移同样不改变 P 到 N 的总重力功与电场总功，质点仍在 N 点速度为零。

C：正确。B 板上移 \(d/2\) 后板距变为 \(d/2\)，由 \(mg(d+x)-4mgx=0\) 得最低点距 A 点 \(x=d/3\)。

D：正确。B 板下移使 P 到 N 的重力正功增大，而电场总功仍为 \(qU\)，质点将以非零速度穿过 N。''',
    "autumn9_course_03_projectile_energy": r'''A：正确。机械能 \(E_k+E_{pg}\) 的增加量等于电场力做功 \(16\,\mathrm J\)。

B：正确。到 N 点时重力势能恢复，电场功为 \(4\times16=64\,\mathrm J\)，所以 \(E_{kN}=9+64=73\,\mathrm J\)。

C：错误。上升段与下降段的电场功分别为 \(16\,\mathrm J\) 和 \(48\,\mathrm J\)，比为 \(1:3\)。

D：正确。最小化 \(E_k(\tau)=16\tau^2+9(1-\tau)^2\)，得到 \(E_{k,\min}=144/25\,\mathrm J=5.76\,\mathrm J\)。''',
    "autumn9_hw_01_liquid_capacitor": r'''A：错误。液面升高使有效正对面积 \(S\) 增大，因此 \(C=\varepsilon S/d\) 增大。

B：错误。电容器始终连接恒压电源，电压 \(U\) 不变。

C：正确。刮去部分涂层使 \(S\) 和 \(C\) 减小，由 \(Q=CU\) 可知电荷量减小。

D：错误。电压由恒压电源固定，不随涂层面积改变。''',
    "autumn9_hw_02_crt_quadrant": r'''A：错误。电子束的水平偏转方向向左，横坐标不是正值。

B：正确。亮斑同时向左、向上偏转，位于第二象限。

C：错误。亮斑向上偏转，纵坐标不是负值。

D：错误。水平和竖直偏转方向均与第四象限不符。''',
    "autumn9_hw_03_oscilloscope_waveform": r'''A：错误。该图的纵向相位与水平扫描端点不匹配。

B：错误。该图把快速回扫过程误画成了可见的主轨迹。

C：正确。按照同一时刻配对 \(x(t)=k_xU_x(t)\) 与 \(y(t)=k_yU_y(t)\)，得到图 C。

D：错误。图中波形上下变化的时间次序与原信号不符。''',
    "autumn9_hw_04_ion_deflection": r'''A：错误。速度由 \(v=\sqrt{2qU_1/m}\) 决定，两者速度比不是 \(1:1\)。

B：错误。代入 \(q_H=e,m_H=m_p\) 与 \(q_{He}=2e,m_{He}=4m_p\)，得到 \(v_H:v_{He}=\sqrt2:1\)，不是 \(1:2\)。

C：正确。侧移 \(y=U_2L^2/(4dU_1)\) 中 \(q,m\) 完全消去，故位移比为 \(1:1\)。

D：错误。两种粒子的板内侧移相等，不是 \(1:2\)。''',
    "autumn9_hw_05_linear_accelerator": r'''A：正确。为使质子每次跨越缝隙时都加速，电源极性必须周期性换向。

B：正确。各管内飞行时间均为 \(T\)，故 \(L_n=v_nT\)，管长与进入该管的速度成正比。

C：错误。实际有 \(L_A:L_B=v_0:\sqrt{v_0^2+2eU/m}\)，并不恒为 \(1:\sqrt2\)。

D：正确。由 \(eU=\tfrac12m(v^2-v_0^2)\) 得 \(v=\sqrt{v_0^2+2eU/m}\)。''',
    "autumn9_hw_06_atmosphere_field": r'''A：错误。电势随高度升高，电场由高电势指向低电势，因此方向竖直向下。

B：错误。题给电容器储存电荷量约为 \(5.0\times10^5\,\mathrm C\)，地面带电量大小不是 \(2.5\times10^5\,\mathrm C\)。

C：错误。\(C=Q/U\approx(5.0\times10^5)/(300\times10^3)\,\mathrm F\approx1.67\,\mathrm F\)，不是 \(0.6\,\mathrm F\)。

D：正确。\(|E|=|\mathrm d\varphi/\mathrm dh|\)，随高度增加该导数的绝对值减小。''',
    "autumn9_hw_07_effective_gravity_loop": r'''A：正确。由 \(2g's=3g'R\) 得 \(s=3R/2=3\times0.8/2\,\mathrm m=1.2\,\mathrm m\)。

B：错误。\(2.2\,\mathrm m\) 大于临界释放距离。

C：错误。\(2.0\,\mathrm m\) 不满足临界能量关系。

D：错误。\(2.1\,\mathrm m\) 不满足临界能量关系。''',
    "autumn9_hw_08_electric_circle_energy": r'''A：错误。动能最小点需要由重力势能与电势能组成的有效势能共同判断，不能直接认定为 E 点。

B：错误。电势能极值由 \(E_p=q\varphi\) 和电场力方向决定，B 点不是最大值位置。

C：正确。由 \(\Delta(E_k+E_{pg})=W_E\)，C 点沿电场力方向的位移最大，机械能最大。

D：错误。E 点不是机械能最小位置。''',
    "autumn9_hw_09_crt_multiple": r'''A：正确。由 \(10eU=mv_0^2/2\) 得 \(v_0=\sqrt{20eU/m}\)。

B：正确。偏转电场再做功 \(eU\)，总动能为 \(11eU\)，故 \(v=\sqrt{22eU/m}\)。

C：正确。板内与板外侧移相加得 \(x=l^2/(40d)+sl/(20d)\)。

D：正确。水平速度始终为 \(v_0\)，故 \(t=(l+s)/v_0=(l+s)\sqrt{m/(20eU)}\)。''',
    "autumn9_hw_10_charge_plane": r'''A：正确。图示场强向左，要产生压向平面的电场力，物块电荷量必须满足 \(q<0\)。

B：错误。该平面上 \(\varphi=0\)，所以电势能 \(E_p=q\varphi\) 恒定。

C：错误。题给代数式可能为负，不能不取绝对值就称为加速度大小。

D：正确。由对称摩擦功和动能定理得到 \(v_O=v_0/\sqrt2=(\sqrt2/2)v_0\)。''',
    "autumn9_hw_11_alternating_field": r'''A：正确。由 \(d/2=at_{\min}^2/2\) 及 \(a=v_0^2/(2d)\)，得 \(t_{\min}=\sqrt2d/v_0\)。

B：错误。碰板前最大动能为 \(E_{k,\max}=3mv_0^2/4\)，不是 \(5mv_0^2/4\)。

C：错误。在 \(t=d/(2v_0)\) 发射的粒子到达 \(O'\) 前先碰板。

D：错误。在 \(t=3d/(2v_0)\) 发射的粒子同样先碰板。''',
    "autumn9_hw_12_velocity_turn": r'''A：错误。轨迹只能确定电场力 \(q\vec E\) 的方向，不能单独确定 \(q\) 的正负。

B：正确。末动能大于初动能，电场力做正功，因此 A 点电势能比 O 点小。

C：正确。\(v_{\min}^2=4v_0^2/5\)，所以 \(E_{k,\min}=mv_{\min}^2/2=2mv_0^2/5\)。

D：错误。\(\Delta\vec v=(2v_0,-v_0)\)，电场力方向斜率为 \(-1/2\)，不是 \(2\)。''',
    "autumn9_hw_13_proton_field": r'''A：正确。由 \(\vec a=(-v^2/L,-\sqrt3v^2/L)\) 可知电场斜向左下，与水平线成 \(60^\circ\)。

B：正确。\(|a|=2v^2/L\)，由 \(qE=ma\) 得 \(E=2mv^2/(qL)\)。

C：正确。水平平均速度为 \(v\)，所以运动时间 \(t=L/v\)。

D：错误。速度矢量线段到原点的最短距离为 \(v_{\min}=\sqrt3v/2\)，不是 \(v/2\)。''',
    "autumn9_hw_14_rotating_cylinder": r'''A：正确。该图可对应从信号零相位位置剪开圆筒记录纸。

B：错误。圆筒一周为 \(0.5\,\mathrm s\)，只记录电压信号的半个周期，不会形成单条完整正弦周期。

C：正确。改变剪开位置等价于改变展开图初相位，可以得到交叉的互补轨迹。

D：错误。最大偏移为 \(7.5\,\mathrm{cm}\)，不是 \(15\,\mathrm{cm}\)。''',
}

INLINE_REPLACEMENTS = [
    (r"XX\prime", r"\(XX'\)"),
    (r"O\prime", r"\(O'\)"),
    (r"10U", r"\(10U\)"),
    (r"C、D", r"\(C\)、\(D\)"),
    (r"1:\sqrt2", r"\(1:\sqrt{2}\)"),
    (r"v=\sqrt{22eU/m}", r"\(v=\sqrt{22eU/m}\)"),
    (r"\sqrt3v/2", r"\(\sqrt{3}v/2\)"),
    (r"y=\pm d/2", r"\(y=\pm d/2\)"),
    (r"t=8d/v_0", r"\(t=8d/v_0\)"),
    (r"s=3R/2", r"\(s=3R/2\)"),
    (r"R=0.8 m", r"\(R=0.8\,\mathrm m\)"),
    (r"1.2 m", r"\(1.2\,\mathrm m\)"),
    (r"7.5 cm", r"\(7.5\,\mathrm{cm}\)"),
    (r"0.5 s", r"\(0.5\,\mathrm s\)"),
    (r"1 s", r"\(1\,\mathrm s\)"),
    (r"|a|=2v²/L", r"\(|a|=2v^2/L\)"),
    (r"dφ/dh", r"\(\mathrm d\varphi/\mathrm dh\)"),
    (r"dh/dφ", r"\(\mathrm dh/\mathrm d\varphi\)"),
    (r"|E|", r"\(|E|\)"),
    (r"mg\prime", r"\(mg'\)"),
    (r"g\prime", r"\(g'\)"),
    (r"E_k+E_pg", r"\(E_k+E_{pg}\)"),
    (r"Q=CU", r"\(Q=CU\)"),
    (r"q/m", r"\(q/m\)"),
    (r"qU", r"\(qU\)"),
    (r"qE", r"\(qE\)"),
    (r"eU", r"\(eU\)"),
    (r"l+s", r"\(l+s\)"),
    (r"v_0", r"\(v_0\)"),
    (r"U_2=0", r"\(U_2=0\)"),
    (r"U_2", r"\(U_2\)"),
    (r"U_1", r"\(U_1\)"),
    (r"L_n=v_nT", r"\(L_n=v_nT\)"),
    (r"L_n", r"\(L_n\)"),
    (r"v_n", r"\(v_n\)"),
    (r"(0,\(v_0\))", r"\((0,v_0)\)"),
    (r"(2\(v_0\),0)", r"\((2v_0,0)\)"),
    (r"(x(t),y(t))", r"\((x(t),y(t))\)"),
    (r"1:4", r"\(1:4\)"),
    (r"2T", r"\(2T\)"),
]


def normalize_analysis_text(text):
    text = (text.replace(r"\(v=\sqrt{22\(eU\)/m}\)", r"\(v=\sqrt{22eU/m}\)")
                .replace(r"\(t=8d/\(v_0\)\)", r"\(t=8d/v_0\)"))
    parts = re.split(r"(\\\(.*?\\\)|\\\[.*?\\\])", text, flags=re.S)
    for index in range(0, len(parts), 2):
        outside = parts[index]
        protected = []
        for old, new in INLINE_REPLACEMENTS:
            if old not in outside:
                continue
            marker = f"@@MATH{len(protected)}@@"
            outside = outside.replace(old, marker)
            protected.append((marker, new))
        # Point and plate labels are mathematical symbols too, but option labels
        # such as “A：正确” are left untouched in the dedicated option block.
        outside = re.sub(r"(?<![A-Za-z0-9_\\])([A-Z])(?=[、，。；与和点板管到间两端处为])", r"\\(\1\\)", outside)
        outside = outside.replace("高度 h", r"高度 \(h\)").replace("电势 φ", r"电势 \(\varphi\)")
        outside = outside.replace("面积 S", r"面积 \(S\)").replace("电压 U", r"电压 \(U\)")
        outside = outside.replace("把 Q 不变", r"把 \(Q\) 不变").replace("、C 和 Q", r"、\(C\) 和 \(Q\)")
        for marker, value in protected:
            outside = outside.replace(marker, value)
        parts[index] = outside
    return "".join(parts)


def latex_answer(problem):
    answer = problem["answer"]
    if problem["type"] in {"single-choice", "multiple-choice"}:
        return rf"答案为 \(\boxed{{\mathrm{{{answer}}}}}\)。"
    return f"答案为 {answer}。"


def replace_step(blocks, title, content):
    for step in blocks or []:
        if step.get("title") == title:
            step["content"] = content


for path in sorted(PROBLEMS.glob("autumn9_*.json")):
    problem = json.loads(path.read_text(encoding="utf-8"))
    if problem["id"] == "autumn9_course_01_plate_holes_return":
        problem["question"] = problem["question"].replace("距 A 为 \\(h\\)", "距 A 为 \\(d\\)")
        problem["options"] = [option.replace("返回后的最高点在 A 板下方 \\(h/3\\)", "返回后的最低点距 A 点 \\(d/3\\)") for option in problem["options"]]
    derivation = DERIVATIONS.get(problem["id"])
    if derivation:
        derivation = derivation.replace(r"\sqrt2", r"\sqrt{2}").replace(r"\sqrt3", r"\sqrt{3}")
        replace_step(problem.get("steps"), "完整推导", derivation)
        replace_step(problem.get("analysisLeadSteps"), "完整推导", derivation)
    option_judgment = OPTION_JUDGMENTS.get(problem["id"])
    if option_judgment:
        option_judgment = option_judgment.replace(r"\sqrt2", r"\sqrt{2}").replace(r"\sqrt3", r"\sqrt{3}")
        replace_step(problem.get("steps"), "逐项判断", option_judgment)
    conclusion = latex_answer(problem)
    replace_step(problem.get("steps"), "结论", conclusion)
    replace_step(problem.get("analysisSupplementSteps"), "结论", conclusion)
    if isinstance(problem.get("analysis"), dict) and problem["analysis"].get("sharedThinking"):
        problem["analysis"]["sharedThinking"] = normalize_analysis_text(problem["analysis"]["sharedThinking"])
    for collection_name in ("steps", "analysisLeadSteps", "analysisSupplementSteps"):
        for step in problem.get(collection_name) or []:
            if step.get("title") not in {"建模与专用公式", "逐项判断", "结论"}:
                step["content"] = normalize_analysis_text(step.get("content", ""))
    path.write_text(json.dumps(problem, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print(f"enhanced {len(list(PROBLEMS.glob('autumn9_*.json')))} problems; detailed {len(DERIVATIONS)} numeric/formula problems")
