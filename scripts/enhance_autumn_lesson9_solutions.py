#!/usr/bin/env python3
import json
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
        replace_step(problem.get("steps"), "完整推导", derivation)
        replace_step(problem.get("analysisLeadSteps"), "完整推导", derivation)
    conclusion = latex_answer(problem)
    replace_step(problem.get("steps"), "结论", conclusion)
    replace_step(problem.get("analysisSupplementSteps"), "结论", conclusion)
    path.write_text(json.dumps(problem, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print(f"enhanced {len(list(PROBLEMS.glob('autumn9_*.json')))} problems; detailed {len(DERIVATIONS)} numeric/formula problems")
