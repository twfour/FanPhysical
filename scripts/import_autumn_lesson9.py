#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data/problems'
CHAPTER = '带电粒子在电场中的运动和示波器原理'

ITEMS = [
('course_01_plate_holes_return','例1：平行板小孔往返','multiple-choice','ACD','plate_holes_return','course-01-plate-holes',
'A、B 为相距 \(d\) 的水平平行金属板，中央分别有小孔 M、N。一带电质点从 A 板上方距 A 为 \(h\) 的 P 点静止下落，穿过 M 后到 N 孔速度恰为零并原路返回。保持极板接电源，判断移动极板后的结论。',
['A. A 板上移少许，质点仍能返回','B. A 板下移少许，质点将穿过 N 孔','C. B 板上移 \(d/2\)，质点返回后的最高点在 A 板下方 \(h/3\)','D. B 板下移少许，质点将穿过 N 孔'],
'由初态得 \(qU=-2mgd\)。移动 A 板不改变极板电压及 P 到 N 的总重力势能差，故 A 对、B 错；B 板上移后由能量方程求得返回转折点，C 对；B 板下移使重力做功增加而电场功不变，D 对。'),
('course_02_crt_deflection','例2：示波管加速与偏转','calculation','\(v_0=\sqrt{2eU_1/m}\)，\(y_1=U_2L_1^2/(4dU_1)\)，\(y_P=U_2L_1(L_1+2L_2)/(4dU_1)\)','crt_deflection','course-02-crt',
'真空示波管中电子由静止经加速电压 \(U_1\) 后，垂直进入板长 \(L_1\)、间距 \(d\)、电压 \(U_2\) 的偏转电场，板端到荧光屏距离为 \(L_2\)。求入射速度、离开偏转场的侧移量和屏上偏移量。',None,
'加速区用 \(eU_1=mv_0^2/2\)。偏转区横向匀速、纵向匀加速，飞出后沿切线匀速运动；把板内侧移和板外侧移相加即可。'),
('course_03_projectile_energy','例3：复合场抛体能量','multiple-choice','ABD','projectile_energy','course-03-projectile-energy',
'带电小球从竖直平行板间 M 点竖直上抛，M、N 等高，O 为最高点。M 点动能为 \(9\,\mathrm J\)，M 到 O 电场力做功 \(16\,\mathrm J\)，忽略阻力，判断能量结论。',
['A. M 点机械能比 O 点少 \(16\,\mathrm J\)','B. 到 N 点动能为 \(73\,\mathrm J\)','C. 上升和下降过程电场力功之比为 \(1:4\)','D. M 到 N 过程中最小动能为 \(5.76\,\mathrm J\)'],
'电场力只改变水平分速度，重力只改变竖直分速度。设到最高点的时间比例为 \(\tau\)，有 \(E_k=16\tau^2+9(1-\tau)^2\)，最小值为 \(144/25=5.76\,\mathrm J\)；由水平位移的时间平方关系可得 N 点电场功 \(64\,\mathrm J\)。'),
('hw_01_liquid_capacitor','单1：液体电容器','single-choice','C','liquid_capacitor','homework-01-liquid-capacitor','绝缘塑料桶外有导电涂层，桶内装导电溶液，二者接恒压电源构成电容器。判断液面高度或涂层面积变化时的电容、电压与电荷量变化。',['A. 液面升高，电容减小','B. 液面降低，电压减小','C. 刮去部分涂层，电荷量减小','D. 刮去部分涂层，电压增大'],'恒压连接使 \(U\) 不变；有效正对面积减小时 \(C\) 减小，由 \(Q=CU\) 得电荷量减小。'),
('hw_02_crt_quadrant','单2：示波器亮斑象限','single-choice','B','crt_quadrant','homework-02-crt-quadrant','示波管电子束原来打在中心 O。给 XX\' 加 \(U_{XX\'}=-U_0\)，给 YY\' 加 \(U_{YY\'}=U_0\)，\(U_0>0\)，亮斑位于哪个象限？',['A. I','B. II','C. III','D. IV'],'电子带负电，受力方向与电场方向相反。分别判断水平和竖直偏转：亮斑向左、向上，位于第二象限。'),
('hw_03_oscilloscope_waveform','单3：示波器扫描波形','single-choice','C','oscilloscope_waveform','homework-03-oscilloscope-waveform','示波管的竖直偏转电压为周期交变信号，水平偏转电压为周期性锯齿扫描电压。判断荧光屏上的稳定图形。',['A. 图 A','B. 图 B','C. 图 C','D. 图 D'],'锯齿电压每周期使光点从左向右匀速扫描，竖直电压决定同期纵坐标；按同一时刻配对 \(x(t),y(t)\)，得到 C。'),
('hw_04_ion_deflection','单4：氢氦离子偏转','single-choice','C','ion_deflection','homework-04-ion-deflection','氢核和 \(^4\mathrm{He}\) 核分别从静止经同一加速电压，再进入同一偏转电场。比较离开加速场速度和板内竖直位移。',['A. 速度比 \(1:1\)','B. 速度比 \(1:2\)','C. 竖直位移比 \(1:1\)','D. 竖直位移比 \(1:2\)'],'由 \(v^2=2qU_1/m\) 可知速度不同；但 \(y=\frac12(qU_2/md)(L/v)^2=U_2L^2/(4dU_1)\)，质量和电荷量消去，位移比为 \(1:1\)。'),
('hw_05_linear_accelerator','单5：直线加速器漂移管','single-choice','C','linear_accelerator','homework-05-linear-accelerator','质子以初速度 \(v_0\) 进入直线加速器，在各漂移管内匀速且时间均为 \(T\)，每次跨越缝隙均由相同电压 \(U\) 加速。选出不正确说法。',['A. 电源极性应周期性变化','B. 漂移管长度与进入时速度成正比','C. A、B 管长度比恒为 \(1:\sqrt2\)','D. 从 B 管射出速度为 \(\sqrt{v_0^2+2eU/m}\)'],'同步加速要求极性周期反转且 \(L_n=v_nT\)。由于存在初速度，长度比不能固定写成 \(1:\sqrt2\)，C 错；跨过一次缝隙后满足动能定理，D 对。'),
('hw_06_atmosphere_field','单6：大气电场电势图','single-choice','D','atmosphere_field','homework-06-atmosphere-field','地球表面与大气电离层构成大电容器，大地电势为零，给出高度 \(h\) 与电势 \(\varphi\) 的关系图。判断电场方向、电荷量、电容和场强变化。',['A. 大气电场竖直向上','B. 地面带电量约为 \(2.5\times10^5\,\mathrm C\)','C. 电容约为 \(0.6\,\mathrm F\)','D. 高度越大，场强越小'],'横轴为电势、纵轴为高度，\(E=|d\varphi/dh|\) 是图线斜率的倒数。随高度增加，倒数减小，故场强减小。'),
('hw_07_effective_gravity_loop','单7：电场中的竖直圆周','single-choice','A','effective_gravity_loop','homework-07-effective-gravity-loop','带负电小球从光滑斜面静止释放，经相切点 A 进入光滑竖直圆轨道。水平电场使电场力与重力合成为恒定有效重力，若恰好完成圆周运动，求释放点到 A 的斜面距离。',['A. \(1.2\,\mathrm m\)','B. \(2.2\,\mathrm m\)','C. \(2.0\,\mathrm m\)','D. \(2.1\,\mathrm m\)'],'合力方向恰沿斜面，大小对应 \(g\'=5g/4\)。临界圆周由有效重力最高点条件得 \(v_A^2=3g\'R\)，再用 \(2g\'s=v_A^2\)，得 \(s=3R/2=1.2\,\mathrm m\)。'),
('hw_08_electric_circle_energy','单8：匀强场圆轨道能量','single-choice','C','electric_circle_energy','homework-08-electric-circle-energy','带电小球在竖直圆轨道内运动，匀强电场平行于直径 GC。由 A 点静止释放恰能到 C；再给 A 点水平向右冲量使其完成圆周，判断动能、电势能和机械能的极值位置。',['A. E 点动能最小','B. B 点电势能最大','C. C 点机械能最大','D. E 点机械能最小'],'机械能的变化只由电场力功决定。沿电场力方向机械能增大，故在电场方向坐标最大的 C 点机械能最大。'),
('hw_09_crt_multiple','多9：示波管偏转计算','multiple-choice','ABCD','crt_multiple','homework-09-crt-multiple','电子由静止经加速电压 \(10U\)，进入长 \(l\)、间距 \(d\)、电压 \(U\) 的 XX\' 偏转板，板端至屏距离为 \(s\)。判断入射速度、出射速度、屏上偏移和总时间。',['A. 入射速度 \(v_0=\sqrt{20eU/m}\)','B. 离开偏转板速度 \(v=\sqrt{22eU/m}\)','C. 屏上偏移 \(x=l^2/(40d)+sl/(20d)\)','D. 从进入偏转板到屏的时间 \(t=(l+s)\sqrt{m/(20eU)}\)'],'加速区先求 \(v_0\)。偏转方向加速度为 \(eU/(md)\)，板内时间 \(l/v_0\)，板后水平速度不变；逐项代入可得四项均成立。'),
('hw_10_charge_plane','多10：异号电荷与竖直粗糙面','multiple-choice','AD','charge_plane','homework-10-charge-plane','两异号点电荷关于绝缘竖直平面对称。带电小物块沿平面由 A 经 O 滑到 B，A、B 关于 O 对称，到 B 恰停，判断电性、势能、A 点加速度和 O 点速度。',['A. 物块带负电','B. A 到 O 电势能不断减小','C. A 点加速度大小为题给表达式','D. 通过 O 点速度为 \(\sqrt2v_0/2\)'],'平面上电势处处为零，故势能不变，B 错。电场水平向左，要把物块压在平面上必须带负电，A 对。上下两段摩擦功关于 O 对称，结合到 B 停止可得 \(v_O=v_0/\sqrt2\)，D 对；C 的式子未保证为正却称“大小”，不成立。'),
('hw_11_alternating_field','多11：交变电场粒子源','multiple-choice','A','alternating_field','homework-11-alternating-field','长 \(8d\)、间距 \(d\) 的水平平行板间存在周期反向的匀强电场。O 点粒子源持续以水平速度 \(v_0\) 发射正粒子，忽略重力及碰板后的运动，判断最短飞行时间、最大动能及不同时刻发射粒子的去向。',['A. 最短运动时间为 \(\sqrt2d/v_0\)','B. 最大动能为 \(5mv_0^2/4\)','C. \(t=d/(2v_0)\) 发射者从 O\' 射出','D. \(t=3d/(2v_0)\) 发射者从 O\' 射出'],'按电场每段恒定分段积分纵向位移和速度。最短碰板时间为 \(\sqrt2d/v_0\)；最大动能为 \(3mv_0^2/4\)。C、D 两个相位发射的粒子都会先碰板，因此只有 A。'),
('hw_12_velocity_turn','多12：匀强场速度转向','multiple-choice','BC','velocity_turn','homework-12-velocity-turn','带电粒子仅受匀强电场力，从 O 到 A：初速度沿 \(+y\) 大小 \(v_0\)，末速度沿 \(+x\) 大小 \(2v_0\)。判断电荷符号、势能、最小动能和场力方向。',['A. 粒子带正电','B. A 点电势能比 O 点小','C. 最小动能为 \(2mv_0^2/5\)','D. 电场力方向与 x 正方向夹角正切为 2'],'匀强电场使速度矢量沿恒定加速度方向线性变化，\(\Delta\vec v=(2,-1)v_0\)。总动能增大故电势能降低；求速度线段到原点的最短距离，得 \(v_{min}^2=4v_0^2/5\)，即 \(E_{k,min}=2mv_0^2/5\)。'),
('hw_13_proton_field','多13：质子速度矢量变化','multiple-choice','ABC','proton_field','homework-13-proton-field','质子在匀强电场中先后经过同一水平线上的 A、B，速度分别为 \(\sqrt3v\)、\(v\)，方向与 AB 成 \(30^\circ\) 斜向上、\(60^\circ\) 斜向下，且 \(AB=L\)。判断电场方向、场强、时间和最小速度。',['A. 电场方向与水平线成 \(60^\circ\) 斜向左下','B. \(E=2mv^2/(qL)\)','C. 运动时间为 \(L/v\)','D. 最小速度为 \(v/2\)'],'分解两端速度，水平平均速度为 \(v\)，故 \(t=L/v\)。由 \(\Delta\vec v/t\) 得加速度方向和大小，进而得到 A、B；速度矢量线段到原点的最短距离为 \(\sqrt3v/2\)，D 错。'),
('hw_14_rotating_cylinder','多14：旋转圆筒记录波形','multiple-choice','AC','rotating_cylinder','homework-14-rotating-cylinder','电子经 \(U_0=200\,\mathrm V\) 加速后通过长、间距均为 \(10\,\mathrm{cm}\) 的偏转板，板电压 \(u=200\sin(2\pi t)\,\mathrm V\)。记录纸圆筒以 \(2\,\mathrm{r/s}\) 转动，沿不同轴线剪开后判断展开图。',['A. 图 A','B. 图 B','C. 图 C','D. 图 D'],'最大偏转为 \(7.5\,\mathrm{cm}\)。圆筒一周 \(0.5\,\mathrm s\)，恰为电压半周期，因此相邻两周留下互为相反相位的轨迹；不同剪开相位可得到 A 或 C。'),
]

DETAILS = {
'plate_holes_return': {'process':'质点先在 P、M 间自由落体，再在 M、N 间同时受重力和电场力。原情形从 P 静止出发、到 N 恰好静止，是建立能量基准的关键。','formula':r'\[mgh+mgd+qU=0\]','check':'移动极板时分别检查三件事：电源是否仍连接、极板电压是否改变、P 到目标点的重力势能差是否改变。不能只凭板间场强变化判断。','observe':'观察质点穿过 M 后的减速过程以及返回转折点；右图中动能在 P、N 两端均为零。','options':['A：正确。A 板上移只改变板间场强和作用距离，电场总功仍为 qU，P 到 N 的高度差也不变。','B：错误。A 板下移同样不改变 P 到 N 的总重力功和电场总功，质点仍在 N 点速度为零。','C：正确。B 板上移后重新列能量方程，返回转折点位于 A 板下方 h/3。','D：正确。B 板下移使 P 到 N 的重力正功增大，而电场负功仍为 qU，质点到 N 时仍有动能。']},
'crt_deflection': {'process':'分成加速区、板内偏转区、离开极板后的匀速区。加速区求水平入射速度；板内作类平抛；板外沿出射切线飞向屏。','formula':r'\[eU_1=\frac12mv_0^2,\quad a_y=\frac{eU_2}{md},\quad t_1=\frac{L_1}{v_0}\]\[y_1=\frac12a_yt_1^2,\quad v_y=a_yt_1,\quad y_P=y_1+v_y\frac{L_2}{v_0}\]','check':'令 U_2=0 时两个偏移量都应为零；偏移与 U_2 成正比、与 U_1 成反比，量纲均为长度。','observe':'观察板内轨迹为抛物线、离板后变成直线；右图在板端处斜率连续。'},
'projectile_energy': {'process':'重力只改变竖直速度，水平电场力只改变水平速度。以到最高点 O 的时间为 T，则到等高点 N 的时间为 2T。','formula':r'\[v_x=a_xt,\quad v_y=v_0-gt,\quad E_k(t)=\frac12m(a_xt)^2+\frac12m(v_0-gt)^2\]','check':'M 到 O 的水平位移与 M 到 N 的水平位移之比为 1:4，所以电场功也为 1:4；最小动能应在两个分速度都不为零的中间时刻。','observe':'观察最高点只满足竖直速度为零，并不代表总速度或动能为零；右图最低点早于 O。','options':['A：正确。机械能 E_k+E_pg 的增加量等于电场力做功 16 J。','B：正确。到 N 时重力势能恢复，电场功为 64 J，所以动能为 9+64=73 J。','C：错误。上升、下降两段水平位移之比为 1:3，电场功之比也是 1:3。','D：正确。令时间比例为 τ，最小化 16τ²+9(1-τ)²，得 5.76 J。']},
'liquid_capacitor': {'process':'导电溶液和外涂层相当于两极，塑料桶壁是介质；与恒压电源相连意味着 U 始终不变。','formula':r'\[C=\varepsilon\frac{S}{d},\qquad Q=CU\]','check':'凡是改变液面或刮去涂层，本质都在改变有效正对面积 S；恒压条件下不能把 Q 不变当作前提。','observe':'观察液面升高时有效面积、C 和 Q 同步增大。','options':['A：错误。液面升高使有效面积增大，电容增大。','B：错误。恒压电源保持电压不变。','C：正确。刮去涂层使 C 减小，因此 Q=CU 减小。','D：错误。电压由电源固定。']},
'crt_quadrant': {'process':'先由电势高低确定每组极板间的电场方向，再利用电子带负电，受力方向与电场方向相反。','formula':r'\[\vec F=-e\vec E,\qquad x\propto U_{XX\prime},\quad y\propto U_{YY\prime}\]','check':'水平、竖直偏转必须分别判断，最后再合成象限；不要把电子受力方向直接当成电场方向。','observe':'观察水平偏转向左、竖直偏转向上，亮斑进入第二象限。','options':['A：错误，水平坐标不是正值。','B：正确，亮斑左移且上移，位于第二象限。','C：错误，竖直坐标不是负值。','D：错误，水平、竖直方向均与第四象限不符。']},
'oscilloscope_waveform': {'process':'水平锯齿电压把每个周期的时间从左到右展开，竖直信号电压给出同一时刻的纵坐标，屏幕轨迹是参数曲线 (x(t),y(t))。','formula':r'\[x(t)=k_xU_x(t),\qquad y(t)=k_yU_y(t)\]','check':'锯齿回扫时亮点迅速回到左端；相邻扫描周期的起点和终点必须与信号的周期相位一致。','observe':'观察光点每周期从左向右扫描，而不是沿曲线来回运动。','options':['A：错误，纵向相位与扫描端点不符。','B：错误，把回扫过程误画成可见主轨迹。','C：正确，同一时刻配对两偏转电压得到该图形。','D：错误，波形的上下变化次序与原信号不符。']},
'ion_deflection': {'process':'两种粒子先经同一电压加速，再在相同几何和电压的偏转板中运动。分别写出入射速度和板内侧移后，q/m 会消去。','formula':r'\[v=\sqrt{\frac{2qU_1}{m}},\qquad y=\frac12\frac{qU_2}{md}\left(\frac{L}{v}\right)^2=\frac{U_2L^2}{4dU_1}\]','check':'速度依赖 q/m，偏移却不依赖 q/m；这是“同一加速电压后再偏转”的特有消去关系。','observe':'观察两粒子入射速度不同，但在板端到达同一竖直位置。','options':['A：错误，速度比由 q/m 决定。','B：错误，代入氢核与氦核的 q/m 后不为 1:2。','C：正确，侧移表达式中 q、m 完全消去。','D：错误，两种粒子的侧移相等。']},
'linear_accelerator': {'process':'质子只在缝隙中被加速，在金属管内无电场而匀速。为使每次到达缝隙时电场方向都加速质子，交流电源需同步换向。','formula':r'\[\frac12mv_{n+1}^2-\frac12mv_n^2=eU,\qquad L_n=v_nT\]','check':'当 v_0 不为零时，速度序列是平方递增而非速度等差递增，因此相邻管长比不能直接套 1:\sqrt2。','observe':'观察每次过缝隙速度跳增、管内保持不变；右图呈开方增长。','options':['A：正确，电源极性需周期换向。','B：正确，同一管内飞行时间 T 要求 L_n=v_nT。','C：错误，存在初速度 v_0 时 A、B 管长比不是固定的 1:\sqrt2。','D：正确，跨过一次加速缝隙后 v=\sqrt{v_0^2+2eU/m}。']},
'atmosphere_field': {'process':'图中纵轴为高度 h、横轴为电势 φ。场强不是图线的普通斜率，而是 dφ/dh，即所画曲线斜率 dh/dφ 的倒数。','formula':r'\[E_h=-\frac{d\varphi}{dh},\qquad C=\frac{Q}{U}\]','check':'先认清坐标轴再读斜率；电势随高度升高说明电场方向向下。题给电荷量和总电势差还要统一数量级后才能求 C。','observe':'观察等高度增量对应的电势增量逐渐减小，说明 |E| 随高度减小。','options':['A：错误，电势向上升高，所以电场竖直向下。','B：错误，与题给储存电荷量不符。','C：错误，由 Q/U 计算的数量级不为 0.6 F。','D：正确，dφ/dh 随高度减小。']},
'effective_gravity_loop': {'process':'重力与水平电场力均为恒力，可合成为恒定的“有效重力” mg\prime。圆周临界点是有效重力方向的最高点，而不一定是几何最高点。','formula':r'\[g\prime=\sqrt{g^2+(|q|E/m)^2}=\frac54g,\quad v_A^2=3g\prime R,\quad 2g\prime s=v_A^2\]','check':'由最后两式立即得到 s=3R/2，与 g\prime 的具体数值无关；代 R=0.8 m 得 1.2 m。','observe':'观察有效重力方向与斜面一致，临界点位于该方向的圆周最高处。','options':['A：正确，s=3R/2=1.2 m。','B：错误，大于临界所需距离。','C：错误，不满足临界能量式。','D：错误，不满足临界能量式。']},
'electric_circle_energy': {'process':'通常机械能定义为动能加重力势能，电场力属于外力，因此机械能变化等于电场力做功。','formula':r'\[\Delta(E_k+E_{pg})=W_E=q\vec E\cdot\Delta\vec r\]','check':'机械能极值只由沿电场力方向的位置坐标决定；动能极值还要同时考虑重力势能，不能混为一谈。','observe':'观察小球沿圆周运动时机械能随电场方向投影变化，在 C 点达到最大。','options':['A：错误，动能最小点需由有效势能最高点判断，不是简单认定 E 点。','B：错误，电势能极值位置由 qE 方向决定，B 不是最大点。','C：正确，C 点沿电场力方向位移最大，电场做功最多。','D：错误，E 点不是机械能最小位置。']},
'crt_multiple': {'process':'电子经 10U 加速获得水平速度，在 XX\prime 板间产生垂直加速度。板外保持出射速度分量不变，直到屏幕。','formula':r'\[v_0=\sqrt{\frac{20eU}{m}},\quad a=\frac{eU}{md},\quad t_1=\frac l{v_0},\quad y=\frac12at_1^2+at_1\frac s{v_0}\]','check':'离开偏转板时总动能比入射多 eU，因此 v=\sqrt{22eU/m}；总水平路程为 l+s，水平速度始终为 v_0。','observe':'观察板内抛物线与板外切线在出口处平滑相接。','options':['A：正确，由 e(10U)=mv_0²/2。','B：正确，偏转电场再做功 eU，总动能对应 11eU。','C：正确，板内与板外侧移相加得 l²/(40d)+sl/(20d)。','D：正确，水平速度不变，总时间为 (l+s)/v_0。']},
'charge_plane': {'process':'等量异号电荷的中垂面上任一点到两电荷等距，电势代数和为零；但场强不为零且垂直平面。电场力只改变支持力和摩擦力。','formula':r'\[\varphi=0,\quad E_p=q\varphi=0,\quad f=\mu N,\quad \Delta E_k=W_g+W_f\]','check':'A、B 关于 O 对称，电场强度大小和支持力关于 O 对称，因而两半段摩擦功相等；用全程末速为零反推中点动能。','observe':'观察电场力始终垂直于运动方向，电势能不变，但摩擦力随位置改变。','options':['A：正确。图示场强向左，要产生压向平面的电场力，q 必须为负。','B：错误。整个平面电势为零，电势能恒定。','C：错误。题给式可能为负，不能直接称为加速度大小。','D：正确。对称摩擦功结合全程动能变化得 v_O=v_0/\sqrt2。']},
'alternating_field': {'process':'水平速度恒为 v_0，横坐标可当作时间尺；纵向运动按电场换向时刻逐段使用匀变速公式，碰板后该粒子运动结束。','formula':r'\[x=v_0t,\qquad y_{n+1}=y_n+v_{yn}\Delta t+\frac12a_n\Delta t^2,\quad v_{y,n+1}=v_{yn}+a_n\Delta t\]','check':'判断能否从 O\prime 射出前，必须先检查任一时刻是否达到 y=\pm d/2；不能只计算 t=8d/v_0 时的纵坐标。','observe':'观察不同发射相位的轨迹；C、D 对应粒子在到达 O\prime 前先碰板。','options':['A：正确，首段抛物运动到最近极板的时间为 \sqrt2d/v_0。','B：错误，碰板前最大动能为 3mv_0²/4。','C：错误，该相位发射的粒子先碰板。','D：错误，该相位发射的粒子同样先碰板。']},
'velocity_turn': {'process':'恒力意味着速度矢量端点随时间沿直线从 (0,v_0) 移到 (2v_0,0)。最小速度就是这条线段到速度空间原点的最短距离。','formula':r'\[\Delta\vec v=(2v_0,-v_0),\quad \vec v(t)=\vec v_O+\lambda\Delta\vec v,\quad E_k=\frac12mv^2\]','check':'末动能大于初动能，电场力总功为正，所以电势能降低；电荷正负仅凭运动轨迹无法单独确定。','observe':'观察速度端点先靠近原点再远离，右图动能先减小后增大。','options':['A：错误，只能确定 qE 的方向，不能单独确定 q 的正负。','B：正确，动能增加说明电场力做正功，电势能降低。','C：正确，线段到原点的最短距离给出 v_min²=4v_0²/5。','D：错误，加速度方向斜率为 -1/2，不是 2。']},
'proton_field': {'process':'把 A、B 两点速度分解到水平和竖直方向。匀强电场下加速度恒定，平均水平速度乘时间等于 L。','formula':r'\[\vec v_A=(\tfrac32v,\tfrac{\sqrt3}{2}v),\quad \vec v_B=(\tfrac12v,-\tfrac{\sqrt3}{2}v)\]\[t=\frac{L}{v},\qquad \vec a=\frac{\vec v_B-\vec v_A}{t}\]','check':'由速度差得 |a|=2v²/L；质子带正电，因此 E 与 a 同向。最小速度仍用速度线段到原点的距离求。','observe':'观察速度矢量端点沿直线向左下移动，最接近原点时速度为 \sqrt3v/2。','options':['A：正确，加速度和电场均斜向左下，与水平成 60°。','B：正确，由 qE=ma 得 E=2mv²/(qL)。','C：正确，水平平均速度为 v，所以 t=L/v。','D：错误，最小速度为 \sqrt3v/2。']},
'rotating_cylinder': {'process':'电子纵向偏移正比于进入偏转板瞬间的电压；圆筒转动把不同时刻的落点沿周向记录。剪开位置只改变展开图的初相位。','formula':r'\[y=\frac{uL(L+2D)}{4dU_0},\qquad u=200\sin(2\pi t),\qquad T_{rot}=\frac1n=0.5\,\mathrm s\]','check':'电压周期为 1 s，圆筒一周为 0.5 s，故相邻两周相差半周期、轨迹互为相反相位；最大偏移代数值为 7.5 cm。','observe':'观察圆筒转一周时正弦信号只完成半周期，第二圈留下关于中线对称的轨迹。','options':['A：正确，可对应从零相位处剪开。','B：错误，一周不可能记录完整的单条正弦周期。','C：正确，改变剪开初相位可得到交叉的互补轨迹。','D：错误，最大偏移应为 7.5 cm，不是 15 cm。']}
}

DETAILS['crt_deflection']['derivation'] = r'''加速区由 \(eU_1=\frac12mv_0^2\)，得
\[v_0=\sqrt{\frac{2eU_1}{m}}.\]
电子在偏转板内的飞行时间为 \(t_1=L_1/v_0\)，偏转加速度大小为 \(a_y=eU_2/(md)\)，所以
\[y_1=\frac12a_yt_1^2=\frac{U_2L_1^2}{4dU_1},\qquad v_y=a_yt_1.\]
离开极板后，电子以水平速度 \(v_0\)、竖直速度 \(v_y\) 匀速飞行 \(t_2=L_2/v_0\)，故
\[y_P=y_1+v_yt_2=\frac{U_2L_1(L_1+2L_2)}{4dU_1}.\]'''
DETAILS['crt_multiple']['derivation'] = r'''由加速电压 \(10U\) 得
\[10eU=\frac12mv_0^2,\qquad v_0=\sqrt{\frac{20eU}{m}}.\]
板内纵向加速度 \(a=eU/(md)\)，飞行时间 \(t_1=l/v_0\)。离板时纵向速度 \(v_y=at_1\)，而水平速度仍为 \(v_0\)。电场再做功 \(eU\)，于是
\[\frac12mv^2=11eU,\qquad v=\sqrt{\frac{22eU}{m}}.\]
总偏移为板内偏移与板外漂移之和：
\[x=\frac12a\left(\frac l{v_0}\right)^2+a\frac l{v_0}\frac s{v_0}=\frac{l^2}{40d}+\frac{sl}{20d}.\]'''
DETAILS['alternating_field']['derivation'] = r'''电场幅值满足 \(qE=mv_0^2/(2d)\)，故纵向加速度大小 \(a=v_0^2/(2d)\)。从中线静止开始向某极板加速，最短碰板满足
\[\frac d2=\frac12at_{\min}^2,\qquad t_{\min}=\frac{\sqrt2d}{v_0}.\]
对任意发射相位，把每个持续 \(2d/v_0\) 的恒场区间依次代入 \(y=y_0+v_{y0}\Delta t+\frac12a\Delta t^2\)。逐段检查 \(|y|<d/2\) 可知 C、D 对应粒子都先碰板。碰板前纵向速度的最大允许值给出
\[E_{k,\max}=\frac12m(v_0^2+v_y^2)=\frac34mv_0^2.\]'''
DETAILS['velocity_turn']['derivation'] = r'''设 \(\lambda=t/T\)，则速度矢量为
\[\vec v=(2\lambda v_0,(1-\lambda)v_0).\]
于是
\[v^2=v_0^2\left[4\lambda^2+(1-\lambda)^2\right]=v_0^2(5\lambda^2-2\lambda+1).\]
令二次函数在 \(\lambda=1/5\) 处取最小值，得 \(v_{\min}^2=4v_0^2/5\)，因此
\[E_{k,\min}=\frac12mv_{\min}^2=\frac25mv_0^2.\]
又因末动能 \(2mv_0^2\) 大于初动能 \(mv_0^2/2\)，电场力总功为正，A 点电势能更小。'''
DETAILS['proton_field']['derivation'] = r'''分解两端速度：
\[\vec v_A=\left(\frac32v,\frac{\sqrt3}{2}v\right),\qquad \vec v_B=\left(\frac12v,-\frac{\sqrt3}{2}v\right).\]
水平方向平均速度为 \(v\)，故 \(t=L/v\)。再由
\[\vec a=\frac{\vec v_B-\vec v_A}{t}=\left(-\frac{v^2}{L},-\frac{\sqrt3v^2}{L}\right)\]
可得 \(|a|=2v^2/L\)，方向斜向左下，与水平成 \(60^\circ\)。质子带正电，所以 \(E=ma/q=2mv^2/(qL)\)。速度线段到原点的最短距离为 \(\sqrt3v/2\)。'''
DETAILS['rotating_cylinder']['derivation'] = r'''偏转灵敏度公式给出
\[y=\frac{uL(L+2D)}{4dU_0}.\]
代入 \(L=d=D=0.10\,\mathrm m\)、\(U_0=200\,\mathrm V\)、\(|u|_{\max}=200\,\mathrm V\)，得 \(|y|_{\max}=0.075\,\mathrm m=7.5\,\mathrm{cm}\)。电压周期 \(T_u=1\,\mathrm s\)，圆筒转动周期
\[T_{rot}=\frac1n=0.5\,\mathrm s=\frac12T_u.\]
因此相邻两圈记录的纵坐标相反，展开后得到两条关于中线对称的半周期轨迹；剪开相位不同，对应 A 或 C。'''

def restore_latex(value):
    if isinstance(value, str):
        return (value.replace('\x0bec', r'\vec')
                     .replace('\x0barphi', r'\varphi')
                     .replace('\x0crac', r'\frac')
                     .replace('\tau', r'\tau')
                     .replace('\tfrac', r'\tfrac')
                     .replace('\times', r'\times')
                     .replace('\rmathrm', r'\mathrm'))
    if isinstance(value, list):
        return [restore_latex(item) for item in value]
    if isinstance(value, dict):
        return {key: restore_latex(item) for key, item in value.items()}
    return value

def problem(row):
    slug,title,kind,answer,variant,image,question,options,reason=row
    pid='autumn9_'+slug
    detail=DETAILS[variant]
    thinking=detail['process']
    formula=detail['formula']
    option_text='\n\n'.join(detail.get('options',[]))
    steps=[
      {'stepId':1,'title':'物理过程与条件','content':thinking},
      {'stepId':2,'title':'建模与专用公式','content':formula},
      {'stepId':3,'title':'完整推导','content':detail.get('derivation',reason)},
    ]
    if option_text:
      steps.append({'stepId':4,'title':'逐项判断','content':option_text})
    steps.extend([
      {'stepId':5,'title':'答案复核','content':detail['check']},
      {'stepId':6,'title':'动画观察点','content':detail['observe']},
      {'stepId':7,'title':'结论','content':f'答案为 **{answer}**。'}])
    return restore_latex({
      'id':pid,'chapter':CHAPTER,'title':title,'type':kind,'question':question,'options':options,'answer':answer,
      'analysis':{'title':'解析','sharedThinking':thinking,'sharedFormula':formula},
      'analysisPresentation':{'collapseEachStep':True,'optionMode':'shared-solution'},
      'steps':steps,
      'knowledge':['带电粒子在电场中的运动','示波器原理',title.split('：')[-1]],
      'practice':{'title':'进阶近似题：同考点迁移','question':f'保持“{title.split("：")[-1]}”的核心模型，改变电场方向、初始速度或几何尺度后，重新求解并说明临界条件。','answer':'先画受力与速度矢量图，分阶段列式；最终答案由改变后的参数确定。','thinking':'不只替换数字：先判断哪些量保持不变，再检查运动是否仍能到达原题所述边界。','difficulty':'equal-or-higher','upgradeType':'same-concept-structural-transfer'},
      'animation':{'enabled':True,'level':'animated','type':'electric_particle_model','variant':variant,'playable':True,'interactive':True,'notes':'按原题独立建模。','params':{'field':{'label':'场强系数','value':1,'min':0.5,'max':1.8,'step':0.1,'unit':'E'},'speed':{'label':'初速度系数','value':1,'min':0.5,'max':1.8,'step':0.1,'unit':'v'}},'timeline':{'duration':8,'loop':False}},
      'images':[{'src':f'assets/problem-images/autumn-lesson9/{image}.webp','alt':title+'原题印刷配图'}],
      'taxonomy':{'module':'电磁学','topic':CHAPTER,'modelId':'charged-particle-electric-field','modelName':'带电粒子电场运动','familyId':'autumn9-'+variant.replace('_','-'),'familyName':title.split('：')[-1],'role':'母题' if slug.startswith('course') else '条件变式','difficulty':3 if slug.startswith('course') else 4,'variantLevel':'L2','skills':['受力与运动分解','功与能量关系'],'prerequisites':['匀强电场','运动学','动能定理']}
    })

index_path=OUT/'index.json'
index=json.loads(index_path.read_text(encoding='utf-8'))
existing={item['id'] for item in index['problems']}
for row in ITEMS:
    data=problem(row)
    (OUT/f"{data['id']}.json").write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    if data['id'] not in existing:
        index['problems'].append({'id':data['id'],'file':f"{data['id']}.json"})
index_path.write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('wrote',len(ITEMS),'problems')
