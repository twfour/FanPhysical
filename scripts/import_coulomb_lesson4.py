#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data/problems"
CHAPTER = "电荷守恒定律与库仑定律"

def q(slug, name, kind, text, options, answer, thinking, formula, derivation, judgments=None, image=None, family="coulomb", difficulty=3, level="L2"):
    return locals()

COURSE = [
q("coulomb_limits","库仑定律适用条件","multiple-choice","关于库仑定律公式，下列说法正确的是（ ）。",["A. 真空中两点电荷距离 r→∞ 时，静电力 F→0","B. 真空中两点电荷距离 r→0 时，静电力 F→∞","C. 两点电荷距离 r→∞ 时，库仑定律不再适用","D. 实际带电体距离 r→0 时不能再视为点电荷，库仑定律公式不再适用"],"ABD","区分理想点电荷模型的数学极限与实际带电体的模型适用范围。",r"\[F=k\frac{|q_1q_2|}{r^2}\]","对理想点电荷，r 增大时 F 趋于0，r 减小时公式值趋于无穷；实际带电体距离很小时尺寸不可忽略，不能继续套用点电荷公式。",["正确。","正确，指理想点电荷模型。","错误，距离很大仍可使用。","正确，实际带电体不再满足点电荷条件。"],family="concept",difficulty=2,level="L1"),
q("polarized_metal_spheres","异号金属球极化","single-choice","两个半径均为 R 的金属球分别带 +q₁、-q₂，球心距离为 3R，比较实际吸引力与把电荷集中在球心所得的库仑力。",[r"A. \(F=kq_1q_2/(3R)^2\)",r"B. \(F>kq_1q_2/(3R)^2\)",r"C. \(F<kq_1q_2/(3R)^2\)","D. 无法确定"],"B","异号金属球相互吸引，表面电荷向相对的一侧聚集，等效作用距离小于球心距。",r"\[F_{\rm point}=k\frac{q_1q_2}{(3R)^2}\]","导体上的电荷可以重新分布。异号电荷在相对侧更密集，使近距离电荷之间的吸引贡献增强，因此实际吸引力大于球心点电荷近似值。",["错误，忽略了极化。","正确。","错误。","错误，可判断大小关系。"],"course-02-metal-spheres.webp",family="conductor"),
q("repeated_contact_limit","三球反复接触极限","calculation","相同金属球 A、B 初始带等量同号电荷，作用力为 F₀。不带电同样金属球 C 依次与 A、B、A……反复接触无穷次后移走，求 A、B 间作用力。",None,r"\(F=\frac49F_0\)","每次接触后两相同金属球平分总电荷；反复过程的极限是三球电荷相等。",r"\[q'_A=q'_B=q'_C=\frac{2q}{3},\qquad F\propto q_Aq_B\]",r"三球总电荷为 \(2q\) 且守恒。反复平均后极限状态三球各带 \(2q/3\)，移走 C 后 \(F/F_0=(2/3)^2=4/9\)。",family="contact",difficulty=3),
q("opposite_contact_share","异号双球接触分配","single-choice","相同金属球 A、B 带等量异号电荷，原吸引力为 F。不带电同样金属球 C 先接触 A、再接触 B 后移开，求 A、B 间作用力。",["A. F/8","B. F/4","C. 3F/8","D. 3F/4"],"A","相同金属球接触后平分两球总电荷，按接触顺序追踪 A、B、C 的电荷。",r"\[q_A'=\frac q2,\qquad q_B'=\frac{-q+q/2}{2}=-\frac q4\]",r"第一次接触后 A、C 各为 \(q/2\)；第二次 C 与 B 接触后，B、C 各为 \(-q/4\)。故 \(F'=k|(q/2)(-q/4)|/r^2=F/8\)。",["正确。","错误。","错误。","错误。"],family="contact"),
q("offcenter_cavity_force","偏心球形空腔","calculation","半径 R 的绝缘介质球内均匀带总电荷 +Q。在右侧挖去半径 R/2、与外球面相切的球形空腔；点电荷 +q 位于球面外 R 处。求剩余带电体对 q 的作用力。",None,r"\(F=\frac{7kQq}{36R^2}\)，方向水平向右", "用“完整均匀带电球减去被挖小球”的叠加模型。",r"\[E=\frac{kQ}{(2R)^2}-\frac{k(Q/8)}{(3R/2)^2}\]",r"小球体积是原球的 \(1/8\)，被挖电荷为 \(Q/8\)。点电荷到大球心距离 \(2R\)，到空腔球心距离 \(3R/2\)，故 \(E=7kQ/(36R^2)\)，乘 q 得结论。",image="course-05-cavity-sphere.webp",family="superposition",difficulty=4,level="L3"),
q("asymmetric_double_pendulum","共点悬挂距离调节","single-choice","带电小球 A、B 用等长 L 的丝线悬于 O 点，平衡距离为 d。要使距离变为 d/2，可采用哪种方法？",["A. A、B 质量都变为2倍","B. B 的质量变为8倍","C. A、B 电荷量都减半","D. A、B 电荷量都减半且 B 质量变为4倍"],"B","由 B 球沿切线方向平衡，结合弦长与半角关系得到距离的三次方标度。",r"\[d^3\propto\frac{Q_AQ_B}{m_B}\]",r"要使 d 减半，右侧比例必须变为原来的 \(1/8\)。只有把参与切向平衡的 B 球质量增至8倍满足条件。",["错误，只使比例变为1/2。","正确。","错误，电荷乘积变为1/4。","错误，比例变为1/16。"],"course-06-double-pendulum.webp",family="equilibrium",difficulty=4),
q("three_charge_equilibrium","三电荷共线平衡","single-choice","光滑绝缘水平面上 A、B、C 三个带电小球沿直线排列并恰好平衡，哪组电荷可能实现？",["A. -9、+4、-36","B. +4、+9、+36","C. -3、+2、+8","D. +3、-2、+6"],"A","共线三球平衡要求两端同号、中间异号，并满足中间电荷量的特定关系。",r"\[|q_B|=\frac{|q_Aq_C|}{(\sqrt{|q_A|}+\sqrt{|q_C|})^2}\]",r"A 中两端同为负，中间为正，且 \(9\times36/(3+6)^2=4\)，满足平衡；其余选项违反电性或电荷量关系。",["正确。","错误，三球同号不能平衡。","错误，两端异号。","错误，电荷量关系不满足。"],"course-07-three-charge-balance.webp",family="equilibrium",difficulty=4),
q("box_cut_string","木盒内双球断绳","multiple-choice","木盒内异号小球 A、B 分别由两根竖直细绳约束。静止时地面压力为 F_N，B 绳张力为 F。剪断 B 绳，判断木盒压力。",["A. 刚剪断仍为 F_N","B. 刚剪断为 F_N+F","C. 刚剪断为 F_N-F","D. B 向上运动过程中木盒压力逐渐增大"],"BD","先分别写两球平衡，再比较剪断前后绳对木盒的竖直作用。",r"\[F_e=mg+F,\qquad T_A=mg+F_e\]","剪断前 B 绳对盒有向上的 F；剪断瞬间该作用消失，而 A 绳张力尚未改变，所以压力增大 F。B 上升时球间距减小、吸引力和 A 绳张力增大，压力继续增大。",["错误。","正确。","错误。","正确。"],"course-08-box-two-charges.webp",family="transient",difficulty=4),
q("incline_three_charge_spring","斜面三球与弹簧","multiple-choice","光滑绝缘斜面上 A、B、C 等质量、等间距静止，A 连弹簧，q_A=q_0>0、q_B=-q_0。判断 q_C、弹簧伸长量、A 受库仑力及间距。",[r"A. \(q_C=4q_0/7\)",r"B. 弹簧伸长量为 \(mg\sin\alpha/k_0\)","C. A 球所受库仑力大小为 2mg",r"D. 相邻球间距为 \(q_0\sqrt{3k/(7mg\sin\alpha)}\)"],"AD","先用不受弹簧的 B、C 两球沿斜面平衡，求电荷和间距，再回到 A 球。",r"\[\frac{kq_0^2}{l^2}=\frac73mg\sin\alpha\]",r"联立 B、C 平衡得 \(q_C=4q_0/7\)，并得题给间距。A 所受库仑合力沿斜面向下为 \(2mg\sin\alpha\)，弹簧还需平衡重力，故伸长量为 \(3mg\sin\alpha/k_0\)。",["正确。","错误，应为3倍。",r"错误，缺少 \(\sin\alpha\)。","正确。"],"course-09-incline-three-balls.webp",family="equilibrium",difficulty=5,level="L3"),
q("wall_floor_equilibrium","墙地双球再平衡","single-choice","同种电荷小球 A、B 分别位于光滑竖直墙面和水平地面。把 B 向左推动少许并重新平衡，与原来相比如何？",["A. 两球间距变大","B. B 所受推力变大","C. A 对墙压力变大","D. 地面对 B 支持力变大"],"A","A 球竖直方向始终由库仑力分量平衡重力，结合图示几何分支判断新位置。",r"\[F_e\frac{\Delta y}{r}=m_Ag\]","B 左移后，为保持 A 的竖直库仑分量不变，A 沿墙上移，题图所处分支上球间距增大；水平分量减小，墙压力和推力均减小，地面对 B 的支持力保持两球总重不变。",["正确。","错误。","错误。","错误。"],"course-10-wall-floor-balls.webp",family="equilibrium",difficulty=4),
]

HOMEWORK = [
q("point_charge_elementary_charge","点电荷与元电荷","single-choice","下列关于点电荷、元电荷和起电现象的说法正确的是（ ）。",["A. 只有体积很小的带电体才能看作点电荷","B. 元电荷是与电子电荷量绝对值相等的电荷量","C. 感应起电说明电荷能够创生且连续变化","D. 摩擦起电说明做功可以创造电荷"],"B","点电荷取决于尺寸相对研究距离是否可忽略；起电只转移电荷。",r"\[q=ne,\qquad e=1.602\times10^{-19}\,C\]","A 忽略了相对尺度；B 是元电荷定义；感应和摩擦起电均遵守电荷守恒，电荷量量子化。",["错误。","正确。","错误。","错误。"],family="concept",difficulty=1,level="L0"),
q("hanging_opposite_charge_angles","悬球电性与偏角","single-choice","固定球 A 带 +Q。等质量小球 B 带 +q、C 带 -q，分别用不同长度细绳悬挂，平衡时均与 A 等高，偏角为 α、β。比较两角。",["A. α=β","B. α<β","C. α>β>0","D. β=0"],"B","把悬点到 A 的水平距离记为 x、竖直高度记为 h。B 受斥力向右偏，C 受引力向左偏，因此 C 到 A 的距离更小。",r"\[r_B=x+h\tan\alpha,\quad r_C=x-h\tan\beta,\quad \tan\theta=\frac{kQq}{mgr^2}\]",r"由几何关系有 \(r_C<r_B\)，所以 \(F_C=kQq/r_C^2>F_B=kQq/r_B^2\)。两球质量相同，平衡时 \(\tan\beta=F_C/(mg)>F_B/(mg)=\tan\alpha\)，故 \(\alpha<\beta\)。",["错误，两球到 A 的距离不同。","正确，异号球更靠近 A，偏角更大。","错误，大小关系相反。","错误，C 受水平库仑引力，偏角不为零。"],"homework-a2-hanging-charge.webp",family="equilibrium"),
q("three_charge_arrangement","三球平衡摆放方法","single-choice","三个可自由移动带电小球 A、B、C 在光滑水平面上沿直线静止，判断电性、电荷量、摆放方法和距离关系。",["A. A、C 可能带异种电荷","B. 可能有 Q_A>Q_B>Q_C","C. 可先固定 C，摆好 A、B 平衡后再释放 C","D. r₁/r₂=Q_A/Q_C"],"C","完整平衡构型中两端同号、中间异号；若按最终构型摆放，先固定一球不会改变另两球的受力平衡。",r"\[\frac{r_1}{r_2}=\sqrt{\frac{|Q_A|}{|Q_C|}}\]","A 电性错误；中间电荷绝对值小于任一端球，B 不可能；按最终平衡位置先固定 C 再摆 A、B 可行；D 缺少平方根。",["错误。","错误。","正确。","错误。"],"homework-a3-three-charge-line.webp",family="equilibrium",difficulty=4),
q("induction_foil_sequence","接触导体感应与分离","multiple-choice","相互接触的中性导体 A、B 下部贴有金属箔片，带正电小球 C 移近 A。判断箔片、电荷分布和操作顺序。",["A. A、B 的金属箔片都张开","B. A 左端带负电，B 右端带正电","C. 先移走 C 再分开 A、B，箔片仍张开","D. 先分开 A、B 再移走 C，箔片仍张开"],"ABD","感应时近端聚集异号电荷、远端聚集同号电荷；是否保留电荷取决于先分离还是先移走感应源。",r"\[Q_A+Q_B=0\]","C 靠近时 A、B 两端异号分离，两侧箔片均因同号排斥张开。先移走 C 会复原中性；先分开则异号净电荷被锁定，移走 C 后仍张开。",["正确。","正确。","错误。","正确。"],"homework-a4-induction-foils.webp",family="induction"),
q("incline_floor_rebalance","斜面与水平面双球","multiple-choice","带电小球 A、B 分别在光滑斜面和水平面。将 B 向左移动，A 沿斜面上移后重新平衡，比较支持力、推力和距离。",["A. 斜面对 A 的弹力增大","B. 水平面对 B 的弹力增大","C. 推力 F 变小","D. 两球距离变小"],"BC","用 A 的三力平衡矢量三角形判断库仑力与斜面支持力，再对整体列竖直平衡。",r"\[F=F_e\cos\theta_e,\qquad N_B+N_A\cos\alpha=(m_A+m_B)g\]","A 上移后库仑力与斜面支持力均减小，故球距增大；A 支持力竖直分量减小，使 B 支持力增大；库仑力减小且方向更偏离水平，推力减小。",["错误，应减小。","正确。","正确。","错误，应增大。"],"homework-a5-incline-floor.webp",family="equilibrium",difficulty=4),
q("grounded_induction_switches","双导体接地顺序","single-choice","接触的中性导体 M、N 两端可经 S₁、S₂ 接地，正电小球 P 位于 M 左侧。判断不同开关与分离顺序的结果。",["A. 两开关断开时 M 左端正、N 右端负","B. 两开关闭合时 M、N 均不带电","C. 只闭合 S₁，分开 MN 后移走 P，N 不带电","D. 只闭合 S₂，先移走 P 再分开 MN，M 带负电"],"C","正电荷靠近时近端感应负电；接地允许电子与大地交换，操作顺序决定净电荷是否保留。",r"\[Q_{\rm conductor}+Q_{\rm earth}=\text{守恒}\]","A 电性颠倒；两端接地时近端仍有感应负电；只接 M 端接地可中和 N 端正电，先分开后 N 保持中性；D 的顺序先移走 P，接地状态下电荷复原。",["错误。","错误。","正确。","错误。"],"homework-b6-induction-switches.webp",family="induction",difficulty=4),
q("two_cavity_spheres","双球空腔叠加","single-choice","两个半径 R、均匀带电 Q 的绝缘球相切，在连心线方向各挖去直径 R 的球形空腔。求两剩余部分间静电力。",[r"A. \(15kQ^2/(64R^2)\)",r"B. \(49kQ^2/(256R^2)\)",r"C. \(89kQ^2/(576R^2)\)",r"D. \(5kQ^2/(36R^2)\)"],"C","每个剩余球等效为球心 +Q 与空腔中心 -Q/8 的叠加，计算四对作用力。",r"\[F=\frac{kQ^2}{(2R)^2}-2\frac{kQ(Q/8)}{(3R/2)^2}+\frac{k(Q/8)^2}{R^2}\]",r"通分得 \(F=(144-64+9)kQ^2/(576R^2)=89kQ^2/(576R^2)\)，方向为斥力。",["错误。","错误。","正确。","错误。"],"homework-b7-two-cavity-spheres.webp",family="superposition",difficulty=5,level="L3"),
q("pulley_charge_locus","定滑轮带电球轨迹","multiple-choice","O 正下方 h 处固定电荷 Q，带电球 B 经定滑轮牵引静止，AB=R。缓慢向下拉绳使 B 移动，判断重力、张力、距离与轨迹。",[r"A. \(mg=kQqh/R^3\)","B. 绳张力先增大后减小","C. A、B 距离不变","D. B 的轨迹是一段圆弧"],"ACD","对 B 水平、竖直分量消去张力，可得 AB 距离恒定；轨迹因此是以 A 为圆心的圆弧。",r"\[mg=\frac{kQq}{r^2}\frac{h}{r}=\frac{kQqh}{r^3}\]",r"初态 r=R，得到 A。平衡过程中参数均不变，故 r 始终为 R，C、D 正确。张力 \(T=mg\,OB/h\)，拉动时 OB 缩短，张力单调减小，B 错。",["正确。","错误。","正确。","正确。"],"homework-b8-pulley-charge.webp",family="locus",difficulty=5,level="L3"),
q("three_stars_orbit","三星拱月","multiple-choice","a、b、c 三个 +q 小球在半径 R 的圆周上等分并匀速转动；-6q 小球 d 位于圆心上方 h=√2R 处并由外力静止。判断速度、角速度、向心加速度和外力。",[r"A. \(v=\sqrt{kq^2/(3Rm)}\)",r"B. \(\omega=\sqrt{\sqrt3kq^2/(3R^3m)}\)",r"C. \(a_c=\sqrt3kq^2/(3mR^2)\)",r"D. \(F=2\sqrt6kq^2/R^2\)，竖直向上"],"BC","分别求同圆三球的径向斥力与 d 球提供的径向吸引力，再处理 d 的竖直平衡。",r"\[F_{\rm in}=\frac{kq^2}{\sqrt3R^2}=m\omega^2R\]",r"由净向心力得 B、C。线速度应为 \(\sqrt{kq^2/(\sqrt3mR)}\)，A 分母错误。d 还受重力，外力应为 \(mg+2\sqrt6kq^2/R^2\)，D 漏掉 mg。",["错误。","正确。","正确。","错误。"],"homework-b9-three-stars.webp",family="orbit",difficulty=5,level="L3"),
q("square_three_strings","正方形三球悬挂","single-choice","质量均为 m 的正带电小球 A、B、C 由三绳系于 O，OABC 构成边长 a 的正方形，绳2竖直，且 mg=kq₁²/a²。判断电荷与张力。",["A. q₁与q₃可以不相等","B. 绳1与绳2张力之比为1:√2","C. 绳2张力为2mg","D. q₁:q₂=2:1"],"B","由左右对称先得 q₁=q₃，再对 A、B 分别作水平和竖直平衡。",r"\[T_1=\frac{3\sqrt2}{4}mg,\qquad T_2=\frac32mg\]",r"正方形平衡要求 q₁=q₃。联立 A 球两方向平衡得 \(q_2/q_1=1/(2\sqrt2)\) 及 T₁；B 球得 T₂，故 \(T_1:T_2=1:\sqrt2\)。",["错误。","正确。","错误。","错误，应为2√2:1。"],"homework-b10-square-strings.webp",family="equilibrium",difficulty=5,level="L3"),
]

FAMILY={"concept":"点电荷与电荷守恒","conductor":"导体极化","contact":"接触起电与电荷分配","superposition":"均匀带电体叠加","equilibrium":"库仑力平衡","transient":"静电系统瞬时变化","induction":"静电感应与接地","locus":"库仑力约束轨迹","orbit":"库仑力圆周运动","coulomb":"库仑定律"}

def build(source, number, group):
    prefix="course" if group=="course" else "hw"
    pid=f"coulomb_lesson4_{prefix}_{number:02d}_{source['slug']}"
    label=f"例{number}" if group=="course" else (("A" if number<=5 else "B")+str(number))
    problem={"id":pid,"chapter":CHAPTER,"title":f"{label}：{source['name']}","type":source['kind'],"question":source['text'],"options":source['options'],"answer":source['answer'],
      "analysis":{"title":"解析","sharedThinking":source['thinking'],"sharedFormula":source['formula']},"analysisPresentation":{"collapseEachStep":True,"optionMode":"independent-statements" if source['options'] else "shared-solution"},
      "steps":[{"stepId":1,"title":"条件提取","content":source['thinking']},{"stepId":2,"title":"对应公式","content":source['formula']},{"stepId":3,"title":"推导过程","content":source['derivation']},{"stepId":4,"title":"结论","content":f"答案为 **{source['answer']}**。"}],
      "knowledge":["电荷守恒","库仑定律",source['name']],
      "practice":{"title":"进阶近似题：同考点迁移","question":f"在“{source['name']}”模型中改变电荷符号、几何尺度或操作顺序，判断平衡条件与库仑力如何变化。","answer":"先确认电荷守恒与电性，再按新几何关系列库仑力和平衡方程。","thinking":"保持核心物理约束不变，重点检查距离平方、电荷分配和力的方向。","difficulty":"equal-or-higher","upgradeType":"same-concept-structural-transfer"},
      "animation":{"enabled":True,"level":"animated","type":"coulomb_law_model","variant":source['slug'],"playable":True,"interactive":True,"notes":f"按原题演示{source['name']}。","params":{"charge":{"label":"电荷系数","value":1,"min":0.5,"max":2,"step":0.1,"unit":"q"},"distance":{"label":"距离系数","value":1,"min":0.6,"max":1.8,"step":0.1,"unit":"r"}},"timeline":{"duration":7,"loop":False}},
      "taxonomy":{"module":"电磁学","topic":CHAPTER,"modelId":"electric-field-potential","modelName":"电场强度与电势能","familyId":f"coulomb-lesson4-{source['family']}","familyName":FAMILY[source['family']],"role":"母题" if group=="course" else "条件变式","difficulty":source['difficulty'],"variantLevel":source['level'],"skills":["电荷守恒","库仑力受力分析"],"prerequisites":["力的平衡","牛顿第二定律"]}}
    if source['options']:
        problem['optionAnalyses']=[{"option":chr(65+i),"title":opt.split('. ',1)[-1],"judgment":source['judgments'][i]} for i,opt in enumerate(source['options'])]
    if source['image']:
        problem['images']=[{"src":f"assets/problem-images/coulomb-lesson4/{source['image']}","alt":f"{source['name']}原题配图"}]
    return problem

def main():
    created=[]
    for group,items in (("course",COURSE),("homework",HOMEWORK)):
        for number,source in enumerate(items,1):
            problem=build(source,number,group); path=OUT/f"{problem['id']}.json"
            if path.exists():
                old=json.loads(path.read_text(encoding="utf-8")); old.update(problem); problem=old
            path.write_text(json.dumps(problem,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
            created.append((problem['id'],path.name))
    index_path=OUT/'index.json'; index=json.loads(index_path.read_text(encoding='utf-8')); known={x['id'] for x in index['problems']}
    index['problems'].extend({"id":pid,"file":name} for pid,name in created if pid not in known)
    index_path.write_text(json.dumps(index,ensure_ascii=False,indent=2)+"\n",encoding='utf-8')
    print(f"created {len(created)} coulomb lesson problems")

if __name__=='__main__': main()
