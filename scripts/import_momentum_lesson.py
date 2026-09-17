#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "problems"
CHAPTER = "动量定理与动量守恒定律"

COURSE = [
    ("01_arc_fall", "圆弧与自由落体", "如图，质量均为 \(m\) 的小物块 \(a\)、\(b\) 同时从 \(O\)、\(P\) 出发，\(a\) 自由下落，\(b\) 沿固定光滑四分之一圆弧由 \(P\) 滑至最低点 \(S\)。判断到达先后及两物块在 \(S\) 点的动量关系。", ["A. \(a\) 先到达，动量不同", "B. 同时到达，动量不同", "C. \(a\) 先到达，动量相同", "D. \(b\) 先到达，动量相同"], "C", "两物块下降高度均为 \(R\)，故到达 \(S\) 时速率均为 \(\sqrt{2gR}\)，方向均竖直向下，动量相同；圆弧路程更长且切向加速度并非恒为 \(g\)，所以 \(a\) 先到。", "impulse", 2, "L1"),
    ("02_steel_ball_rebound", "钢球反弹的动量变化", "质量为 \(0.1\,\mathrm{kg}\) 的钢球以 \(6\,\mathrm{m/s}\) 向右运动，撞墙后以 \(6\,\mathrm{m/s}\) 向左弹回。求碰撞前后动量及动量变化。", None, "取向右为正：\(p_1=0.6\,\mathrm{kg\cdot m/s}\)，\(p_2=-0.6\,\mathrm{kg\cdot m/s}\)，\(\Delta p=-1.2\,\mathrm{kg\cdot m/s}\)，大小为 \(1.2\,\mathrm{N\cdot s}\)。", "速度反向时动量变化不是零，而是末动量减初动量：\(\Delta p=m(-v)-mv=-2mv\)。", "impulse", 2, "L1"),
    ("03_projectile_momentum", "平抛动量变化", "质量为 \(m\) 的物体以初速度 \(v_0\) 做平抛运动，经过时间 \(t\)，下降高度 \(h\)，速度变为 \(v\)。这段时间内动量变化量大小为（多选）。", ["A. \(m(v-v_0)\)", "B. \(mgt\)", "C. \(m\sqrt{v^2-v_0^2}\)", "D. \(m\sqrt{2gh}\)"], "BCD", "水平方向动量不变，竖直方向增加 \(mgt\)。又有 \(v_y=gt=\sqrt{v^2-v_0^2}=\sqrt{2gh}\)，故 B、C、D 等价。", "impulse", 2, "L1"),
    ("04_chord_slide", "圆弦下滑的动量与冲量", "圆的竖直直径为 \(AB\)，质量为 \(m\) 的小环分别从 \(A\) 沿光滑弦 \(AC\)、\(AD\) 下滑。比较到达端点时的动能、动量、重力冲量和重力瞬时功率（多选）。", ["A. 到 \(C\) 的小环动能更大", "B. 从 \(A\) 到 \(C\) 重力冲量更大", "C. 到 \(C\) 的小环动量更大", "D. 到 \(C\) 时重力瞬时功率更大"], "ACD", "同圆上从最高点沿任意弦下滑的时间相同，因此重力冲量相同；\(C\) 点更低，速度、动能、动量及竖直速度分量均更大。", "impulse", 3, "L2"),
    ("05_basketball_rebound", "篮球落地反弹冲量", "质量 \(0.5\,\mathrm{kg}\) 的篮球由静止释放，重心下降 \(0.8\,\mathrm m\) 后碰地，反弹后上升 \(0.2\,\mathrm m\)。取 \(g=10\,\mathrm{m/s^2}\)，求地面作用过程中篮球所受合力的冲量大小。", ["A. \(0.5\,\mathrm{N\cdot s}\)", "B. \(1\,\mathrm{N\cdot s}\)", "C. \(2\,\mathrm{N\cdot s}\)", "D. \(3\,\mathrm{N\cdot s}\)"], "D", "碰前速度向下 \(4\,\mathrm{m/s}\)，碰后速度向上 \(2\,\mathrm{m/s}\)。取向上为正，\(I=\Delta p=0.5[2-(-4)]=3\,\mathrm{N\cdot s}\)。", "impulse", 2, "L1"),
    ("06_pendulum_impulse", "摆球下摆的分力冲量", "摆球从最大偏角 \(\theta\) 处由静止第一次摆到最低点，历时 \(t\)，摆长 \(l\)、质量 \(m\)。求重力冲量、合力冲量、拉力冲量和拉力做功。", None, "\(\vec I_G=mg t\) 竖直向下；末速 \(v=\sqrt{2gl(1-\cos\theta)}\)，\(\vec I_{合}=m\vec v\) 水平；\(\vec I_T=\vec I_{合}-\vec I_G\)；拉力始终垂直瞬时位移，\(W_T=0\)。", "先分别用定义和动量定理求重力、合力冲量，再由冲量的矢量叠加求拉力冲量，不能把拉力冲量写成平均拉力乘摆动时间而忽略方向变化。", "impulse", 3, "L2"),
    ("07_water_jet", "水柱连续冲击煤层", "直径 \(d=30\,\mathrm{cm}\) 的水柱以 \(v=50\,\mathrm{m/s}\) 垂直冲击煤层后速度变为零，水密度 \(\rho=1.0\times10^3\,\mathrm{kg/m^3}\)。求平均冲击力。", None, "\(F=\rho Sv^2=\rho\dfrac{\pi d^2}{4}v^2\approx1.77\times10^5\,\mathrm N\)。", "在 \(\Delta t\) 内参与碰撞的水质量为 \(\Delta m=\rho Sv\Delta t\)，其动量改变量为 \(\Delta m\,v\)，再除以 \(\Delta t\)。", "flow", 3, "L1"),
    ("08_ring_friction", "变支持力圆环滑动", "质量为 \(m\) 的圆环套在水平杆上，以 \(v_0\) 向右运动，同时受竖直向上的力 \(F=kv\)，动摩擦因数为 \(\mu\)，且 \(kv_0>mg\)。到 \(t_1\) 时开始匀速，求 \(0\sim t_1\) 内位移。", None, "\(x=\dfrac{v_0-mg/k}{\mu k/m}+\dfrac{mg}{\mu k^2}\ln\dfrac{kv_0-mg}{0^+}\) 的形式提示临界处渐近；严格按题设若以 \(F=kv\) 连续变化，达到 \(kv=mg\) 需要无限时间，有限 \(t_1\) 的表述需理解为进入无压力匀速状态的理想化切换。", "竖直方向支持力大小为 \(N=|kv-mg|\)，摩擦力随速度变化。先确认接触侧和临界 \(kv=mg\)，再分段建立 \(m\dot v=-\mu N\)，该题的关键是识别临界的渐近性质。", "force", 5, "L3"),
    ("09_charged_collision", "带电球碰撞守恒", "带电金属球 \(A(-q)\)、\(B(+2q)\) 在绝缘光滑水平面上相向运动并碰撞。判断电势能、总动量和机械能的变化。", ["A. 碰前系统电势能逐渐增加", "B. 碰前系统总动量逐渐增大", "C. 碰后系统机械能保持不变", "D. 碰后总动量等于碰前总动量"], "D", "异号电荷靠近时电势能降低；系统水平方向无外力，总动量始终守恒；碰撞是否弹性未知，机械能不能断言守恒。", "conservation", 2, "L1"),
    ("10_spring_wall", "墙边双块弹簧系统", "光滑水平面上，相同物块 \(A、B\) 由轻弹簧连接，\(A\) 靠墙。压缩弹簧后撤去外力，判断机械能、动量和离墙后的共速状态（多选）。", ["A. \(A、B\) 与弹簧系统机械能守恒", "B. \(A、B\) 与弹簧系统动量守恒", "C. 离墙后第一次共速时弹簧伸长量最大", "D. 弹簧第二次恢复原长时 \(A\) 速度最大"], "ACD", "墙的支持力不做功，系统机械能守恒；但离墙前墙对系统有外冲量，整体动量不守恒。离墙后质心匀速，相对速度为零对应弹簧形变量极值，第二次恢复原长时弹性势能再次全转为动能。", "spring", 4, "L2"),
    ("11_box_slider", "滑块在方盒内往返", "质量相同的方盒与滑块位于光滑水平面，滑块以速度 \(v\) 向左运动，内底面动摩擦因数为 \(\mu\)，与左右壁碰撞无机械能损失。判断最终速度及相对路程（多选）。", ["A. 最终共同速度大小为 \(v/2\)", "B. 某次碰右壁后系统总动量可能向右", "C. 相对盒运动路程为 \(v^2/(2\mu g)\)", "D. 相对盒运动路程为 \(v^2/(4\mu g)\)"], "AD", "系统水平动量守恒，最终共同速度为 \(v/2\)，方向保持初始总动量方向。摩擦耗散等于初末动能差：\(\mu mg s_{相}=\frac12mv^2-\frac12(2m)(v/2)^2=\frac14mv^2\)，故 \(s_{相}=v^2/(4\mu g)\)，对应 D；因此正确为 A、D。", "conservation", 4, "L2"),
    ("12_cart_track", "小球滑上可动曲轨", "质量均为 \(m\) 的小球和小车位于光滑水平面，小球以 \(v_0\) 滑上车载光滑曲轨，升至最高点后最终从左端滑离。判断系统动量、最高点车速、最大高度及离车后的运动。", ["A. 小球与小车系统动量守恒", "B. 最高点小车速度为零", "C. 最大高度为 \(v_0^2/(2g)\)", "D. 离车后做自由落体"], "A", "仅水平方向动量守恒。最高点两者水平共速 \(v_0/2\)，由能量守恒得 \(mgh=mv_0^2/4\)，即 \(h=v_0^2/(4g)\)。离车后小球仍有水平速度，做平抛运动。", "conservation", 3, "L2"),
]

HOMEWORK = [
    ("01_river_bend", "弯曲河道侧向压强", "半径为 \(R\) 的弯道宽 \(d\)、水深 \(h\)，水速 \(v\)、密度 \(\rho\)，且 \(d\ll R\)。判断短时间内速度变化、动量变化及外侧河堤压强。", ["A. 速度改变量沿切线", "B. \(|\Delta v|=v^2\Delta t/R\)", "C. \(|\Delta p|=\rho dh\,v^2\Delta t^2/R\)", "D. 外侧压强 \(p=\rho dv^2/R\)"], "BD", "流体微元做近似圆周运动，\(a=v^2/R\)，所以 \(|\Delta v|=a\Delta t\) 指向圆心。单位时间过截面的质量流率为 \(\rho dhv\)，维持转弯所需侧向力给出压强差量级 \(\rho dv^2/R\)。", "flow", 4, "L2"),
    ("02_spring_groove", "弧槽小球碰弹簧", "质量均为 \(m\) 的光滑弧形槽和小球位于光滑水平面，槽底与水平面相切，右侧固定弹簧。小球从高 \(h\) 处下滑、碰弹簧后返回，判断动量与能量过程。", ["A. 小球与槽动量始终守恒", "B. 下滑时小球对槽做正功", "C. 弹簧反弹前后小球动量不变", "D. 反弹后小球能再次回到槽上"], "BD", "小球与槽单独组成的系统在接触弹簧阶段受外力，动量不始终守恒；下滑时槽获得动能，小球对槽做正功；反弹使小球动量改变；理想无耗散下能返回原高度。", "conservation", 4, "L2"),
    ("03_force_time", "变力拉动物块", "物块受水平拉力 \(F(t)\)，最大静摩擦力等于滑动摩擦力 \(F_m\)。由给定 \(F-t\) 图像判断动量、动能、功和冲量的变化。", ["A. \(t_3\) 时动能最大", "B. \(t_2\) 时动量最大", "C. \(0\sim t_3\) 拉力一直做正功", "D. \(0\sim t_3\) 合力冲量先增后减"], "A", "\(F\le F_m\) 时物块静止；启动后只要 \(F>F_m\)，合力为正，速度持续增加。到 \(t_3\) 合力降为零，动量和动能达到最大；合力冲量是动量增量，在该段单调增加。", "force", 3, "L2"),
    ("04_wind_tunnel", "风洞悬浮与动量流", "质量为 \(m\) 的游客恰好悬浮，受风面积 \(S\)，空气密度 \(\rho\)，气流竖直向上且撞人后速度变零。判断作用冲量、风速改变后的加速度和悬浮风速。", ["A. 风对人冲量大于人对风冲量", "B. 风速变为一半时向下加速度为 \(g/2\)", "C. 风速变为三倍时向上加速度为 \(8g\)", "D. 悬浮风速 \(v=\sqrt{mg/(\rho S)}\)"], "CD", "风力由动量流率给出：\(F=\rho Sv^2\)。悬浮时 \(F=mg\)。风速变为 \(3v\) 时风力变为 \(9mg\)，合力 \(8mg\)，加速度 \(8g\)。作用力与反作用力冲量等大反向。", "flow", 3, "L2"),
    ("05_collision_xt", "碰撞位移时间图像", "两物体在光滑水平面正碰，位移—时间图像如图：\(m_1=0.4\,\mathrm{kg}\)，碰撞发生在 \(t=1.0\,\mathrm s,x=1.0\,\mathrm m\)，碰后两图线在 \(t=2.5\,\mathrm s\) 分别到 \(1.5\,\mathrm m\) 和 \(0\)。判断图线归属、冲量、质量和碰前速度。", ["A. 图线1为碰后 \(m_1\)", "B. \(m_2\) 对 \(m_1\) 冲量为 \(2/3\,\mathrm{N\cdot s}\)", "C. \(m_2=1.5\,\mathrm{kg}\)", "D. 碰前 \(m_2\) 速度大小为 \(1\,\mathrm{m/s}\)"], "B", "由斜率读速度：碰前 \(v_1=1\,\mathrm{m/s}\)、\(v_2=0\)；碰后两速度为 \(1/3\) 与 \(-2/3\,\mathrm{m/s}\)。连续轨迹表明 \(m_1\) 对应图线2，冲量大小 \(0.4\times5/3=2/3\,\mathrm{N\cdot s}\)。动量守恒得 \(m_2=0.6\,\mathrm{kg}\)。", "collision", 4, "L2"),
    ("06_blocks_cart", "弹簧双块与平板车", "光滑地面上的平板车承载质量不同的甲、乙，两物体间压缩弹簧释放。判断不同摩擦条件下甲乙系统和甲乙车系统的动量守恒（多选）。", ["A. 甲乙摩擦力等大时，甲乙系统动量守恒", "B. 甲乙摩擦力等大时，甲乙车系统动量守恒", "C. 动摩擦因数相同时，甲乙系统动量守恒", "D. 动摩擦因数相同时，甲乙车系统动量守恒"], "ABD", "甲乙车整体始终不受水平外力，故 B、D 正确。甲乙所受摩擦力若等大反向，其合外力为零，A 正确；动摩擦因数相同但质量不同，摩擦力通常不等，C 不成立。", "spring", 3, "L2"),
    ("07_hall_thruster", "霍尔推进器动量流", "单台霍尔推进器每秒喷出 \(n=1.8\times10^{19}\) 个一价氙离子，喷速 \(v=2\times10^4\,\mathrm{m/s}\)，单离子质量 \(2.2\times10^{-25}\,\mathrm{kg}\)，电荷量 \(e=1.6\times10^{-19}\,\mathrm C\)。判断加速电压、推力和离子电流（多选）。", ["A. 加速电压 \(275\,\mathrm V\)", "B. 加速电压 \(375\,\mathrm V\)", "C. 推力约 \(0.08\,\mathrm N\)", "D. 离子电流约 \(29\,\mathrm A\)"], "AC", "由 \(eU=mv^2/2\) 得 \(U=275\,\mathrm V\)；质量流率 \(\dot m=nm\)，推力 \(F=\dot m v\approx0.079\,\mathrm N\)；电流 \(I=ne=2.88\,\mathrm A\)，因此按所给数据 D 应为约 \(2.9\,\mathrm A\)，原选项印为 \(29\,\mathrm A\) 时不成立，正确为 A、C。", "flow", 4, "L2"),
    ("08_pendulum_blocks", "摆球推动双木块", "质量均为 \(m\) 的木块 \(A、B\) 并排置于光滑面，\(A\) 上轻杆顶端悬挂质量 \(m_0\)、摆长 \(L\) 的球 \(C\)。球从水平位置静止释放，判断系统动量、分离速度、木块位移和左侧最高点（多选）。", ["A. \(A、B、C\) 系统总动量守恒", "B. \(A、B\) 刚分离时 \(v_C=2\sqrt{mgL/(2m+m_0)}\)", "C. 球首次到最低点时木块右移 \(m_0L/(2m+m_0)\)", "D. 球首次到左侧最高点相对 \(O\) 的高度为 \(mL/(m_0+m)\)"], "BC", "系统水平方向动量守恒而总动量矢量不守恒。最低点用水平动量守恒和机械能守恒联立求速度；质心水平位置不变可直接求木块位移。分离后只剩 \(A+C\) 参与后续耦合，需重新选系统。", "conservation", 5, "L3"),
    ("09_plank_arc", "长木板与圆弧组合体", "光滑水平面上，物块 \(A\) 以 \(8\,\mathrm{m/s}\) 滑上粗糙长木板 \(B\)，随后进入光滑圆弧轨道 \(C\)。三者质量均为 \(2\,\mathrm{kg}\)，\(R=1.8\,\mathrm m\)。当 \(A\) 刚离开 \(B\) 时 \(B\) 速度为 \(2\,\mathrm{m/s}\)。求此时 \(A\) 速度、在 \(C\) 上最大高度及最终 \(C\) 速度。", None, "（1）\(v_A=6\,\mathrm{m/s}\)；（2）进入 \(C\) 后由 \(A+C\) 水平动量及机械能守恒，最高点共同速度 \(3\,\mathrm{m/s}\)，得 \(h=0.9\,\mathrm m\)；（3）返回并分离后等质量弹性过程交换速度，\(C\) 最终速度为 \(6\,\mathrm{m/s}\)。", "第一阶段对 \(A+B\) 用动量守恒；进入圆弧后 \(B\) 脱离，改选 \(A+C\) 系统。系统边界变化是本题核心，每一阶段分别列水平动量和机械能关系。", "composite", 5, "L3"),
    ("10_game_track", "螺旋轨道与长木板综合", "物块以 \(v_0=8\,\mathrm{m/s}\) 从高处水平抛出，无碰撞进入 \(37^\circ\) 粗糙斜轨，经过半径 \(R=2\,\mathrm m\) 的光滑螺旋圆轨和斜轨后滑上质量 \(4\,\mathrm{kg}\) 的长木板。已知物块质量 \(2\,\mathrm{kg}\)、\(h_1=6.6\,\mathrm m\)、\(\mu_1=0.5\)。求抛出高度、最低点支持力、板块生热，并讨论速度正比阻力下不滑出的最小 \(k\)。", None, "（1）由无碰撞条件 \(v_y/v_0=\tan37^\circ\)，得 \(v_y=6\,\mathrm{m/s}\)，\(h_0=v_y^2/(2g)=1.8\,\mathrm m\)。（2）先用分段能量求最低点速度，再由 \(N-mg=mv_D^2/R\) 求支持力。（3）板块阶段由水平动量守恒求共同速度，\(Q=E_{k0}-E_{k共}\)。（4）固定木板上 \(m\dot v=-kv\)，结合 \(v\,dv/dx=-(k/m)v\) 得停止距离 \(x=mv_{入}/k\)，令其不超过板长。", "先按平抛、粗糙斜面、圆轨、板块四阶段拆分。无碰撞条件确定平抛末速度方向；斜面用功能关系，圆轨用机械能与向心力，板块用动量守恒和能量损失，速度阻力段用微分关系积分。", "composite", 5, "L3"),
]

PRACTICE = {
    "impulse": ("进阶近似题：二维冲量反演", "质量 \(m\) 的小球以速度 \(v_0\) 斜向撞击光滑竖直墙，碰后速率变为 \(ev_0\)，法向速度反向、切向速度不变。求墙的冲量矢量，并由接触时间 \(\tau\) 求平均力。", "分解法向与切向动量，\(\vec I=\Delta\vec p\)，平均力为 \(\vec I/\tau\)。", "只比较速度大小会漏掉方向；先建立法—切坐标，再逐分量作末减初。"),
    "flow": ("进阶近似题：变截面射流推力", "密度 \(\rho\) 的稳定射流以速度 \(v_1\) 进入弯管，以速度 \(v_2\) 沿与原方向夹角 \(\alpha\) 射出，质量流率为 \(\dot m\)。求管壁受力。", "流体受力 \(\vec F=\dot m(\vec v_2-\vec v_1)\)，管壁受力为其反作用力。", "选取单位时间流过的流体为控制体，分别写两个方向的动量流率。"),
    "force": ("进阶近似题：冲量相同的变力比较", "两个不同形状的 \(F-t\) 脉冲面积相同，分别作用于有相同恒定阻力的物体。讨论何时末动量相同，以及运动位移是否相同。", "若作用时间也相同，则合冲量相同、末动量相同；位移仍与力的时间分布有关，通常不同。", "动量只看合力时间积分，位移还取决于速度随时间的全过程。"),
    "conservation": ("进阶近似题：可动载体上的内运动", "质量 \(M\) 的小车上质量 \(m\) 的物体沿给定轨道运动。系统水平无外力，物体相对车水平位移为 \(s\)。求小车位移并讨论竖直动量是否守恒。", "由质心水平位置不变，\(x_M=-ms/(M+m)\)；竖直方向存在地面支持力，竖直动量不守恒。", "先按方向判断外力冲量，再用质心位置关系处理位移。"),
    "spring": ("进阶近似题：弹簧系统的质心与相对运动", "两物块质量 \(m_1,m_2\) 由弹簧连接，在光滑面上释放。给定初始压缩量和质心速度，求首次恢复原长时两物块速度。", "质心速度保持不变；在质心系中弹性势能转化为相对动能，再与总动量联立。", "把整体平动与相对运动分开，避免只写机械能而方程不足。"),
    "collision": ("进阶近似题：由图像识别碰撞类型", "给出两物体碰撞前后的 \(x-t\) 折线，要求反演质量比、冲量和恢复系数，并判断是否为弹性碰撞。", "斜率给速度，动量守恒求质量比，\(e=|v_2'-v_1'|/|v_1-v_2|\)，再比较总动能。", "先保证每条轨迹在碰撞点连续，再读取四个速度。"),
    "composite": ("进阶近似题：板块—轨道分段系统", "物块依次经过粗糙板、可动光滑曲轨和固定斜面。要求列出每次系统边界切换时的守恒量，并求最终速度。", "粗糙板阶段用动量守恒与摩擦耗散；可动曲轨阶段用水平动量和机械能；固定斜面阶段用机械能或动能定理。", "每进入一个新接触阶段先重画系统边界，再判断外力冲量和非保守功。"),
}

def make_problem(item, number, kind):
    slug, name, question, options, answer, explanation, family, difficulty, level = item
    prefix = "course" if kind == "course" else "hw"
    problem_id = f"momentum_lesson1_{prefix}_{number:02d}_{slug}"
    ptitle, pq, pa, pt = PRACTICE[family]
    label = f"例{number}" if kind == "course" else (f"第{number}题")
    role = "综合题" if difficulty >= 5 else ("母题" if number == 1 and kind == "course" else "条件变式")
    return {
        "id": problem_id, "chapter": CHAPTER, "title": f"{label}：{name}", "question": question,
        "options": options, "answer": answer,
        "analysisPresentation": {"collapseEachStep": True, "optionMode": "shared-solution"},
        "steps": [
            {"title": "条件提取", "content": "先规定正方向并选择研究对象或系统，区分外力冲量与系统内力。"},
            {"title": "建模与计算", "content": explanation},
            {"title": "结论与检查", "content": f"答案为 **{answer}**。检查动量的方向、单位以及所选系统在对应方向上是否满足守恒条件。"},
        ],
        "knowledge": ["动量定理", "动量守恒", name],
        "practice": {"title": ptitle, "question": pq, "answer": pa, "thinking": pt, "difficulty": "equal-or-higher", "upgradeType": "same-concept-structural-transfer"},
        "animation": {
            "enabled": True, "level": "animated", "type": "momentum_model", "variant": slug,
            "playable": True, "interactive": True, "notes": f"按“{name}”原题过程显示运动、系统边界和动量变化。",
            "params": {
                "mass": {"label": "质量", "value": 1, "min": 0.2, "max": 5, "step": 0.1, "unit": "kg"},
                "speed": {"label": "特征速度", "value": 6, "min": 1, "max": 12, "step": 0.5, "unit": "m/s"},
                "factor": {"label": "条件系数", "value": 0.5, "min": 0.1, "max": 1.5, "step": 0.1, "unit": ""},
            },
            "timeline": {"duration": 6 if family != "composite" else 10, "loop": False},
        },
        "taxonomy": {
            "module": "力学", "topic": CHAPTER, "modelId": "momentum-impulse", "modelName": "动量与冲量",
            "familyId": f"momentum-{family}", "familyName": {"impulse":"动量变化与冲量","flow":"连续介质动量流","force":"变力冲量与图像","conservation":"系统动量守恒","spring":"弹簧系统动量与能量","collision":"碰撞图像反演","composite":"多阶段动量能量综合"}[family],
            "role": role, "difficulty": difficulty, "variantLevel": level,
            "skills": ["系统与正方向选择", "冲量动量关系"], "prerequisites": ["牛顿第二定律", "机械能与功"],
        },
    }

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
    print(f"created {len(created)} momentum problems")

if __name__ == "__main__":
    main()
