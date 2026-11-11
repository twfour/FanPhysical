#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "problems"
INDEX = OUT / "index.json"
CHAPTER = "静电平衡与电容器"


def item(slug, name, kind, question, options, answer, thinking, formula, derivation, variant, family, difficulty=3, level="L2"):
    return {
        "slug": slug, "name": name, "type": kind, "question": question,
        "options": options, "answer": answer, "thinking": thinking,
        "formula": formula, "derivation": derivation, "variant": variant,
        "family": family, "difficulty": difficulty, "level": level,
    }


COURSE = [
    item("cavity_shielding", "空腔导体与静电屏蔽", "single-choice",
         "将悬在细线上的带正电小球 A 放在不带电的金属空心球 C 内且不接触球壁，另一个悬挂的带负电小球 B 从左侧向 C 靠近。判断 A、B 的偏转情况。",
         ["A. A 向左偏，B 向右偏", "B. A 的位置不变，B 向右偏", "C. A 向左偏，B 的位置不变", "D. A、B 的位置都不变"], "B",
         "把金属空心球分成内、外两个静电区域。先用静电屏蔽判断外部电荷是否影响空腔，再判断空腔内电荷在外表面引起的净电荷。",
         r"\[E_{\text{导体内部}}=0,\qquad q_{\text{内表面}}=-q_A,\qquad q_{\text{外表面}}=+q_A\]",
         "A 位于球形空腔的对称位置，内表面感应电荷对 A 的合力为零；外部 B 的电场不能穿过静电平衡导体影响空腔，所以 A 不偏转。A 为正电荷，使 C 的内表面感应出等量负电，外表面保留等量正电。带负电的 B 受到外表面正电荷吸引，向右偏转。因此选 B。",
         "cavity_shielding", "conductor-shielding", 2, "L1"),
    item("grounded_plate", "接地金属板感应", "multiple-choice",
         r"接地金属板右侧固定一点电荷 \(+Q\)。a、b 是右侧表面附近两点，且 a 到 \(+Q\) 更近。下列说法正确的是（多选）。",
         ["A. 右表面带负电、左表面带正电", "B. 右表面带负电、左表面不带电", "C. 整个金属板为零电势等势体", "D. a、b 场强方向相同且 a 点场强更大"], "BCD",
         "接地允许电子从大地进入金属板。静电平衡时导体内部场强为零、整体电势等于大地电势，表面外场垂直于表面。",
         r"\[\varphi_{\text{板}}=0,\qquad \vec E_{\text{内}}=0,\qquad E_n=\frac{|\sigma|}{\varepsilon_0}\]",
         r"正点电荷吸引大地中的电子，右表面出现负感应电荷；接地使左侧不必保留等量正电荷。金属板整体电势为零。板外紧邻表面的电场均垂直板面，a 更靠近 \(+Q\)，局部感应电荷面密度和场强更大。因此 B、C、D 正确。",
         "grounded_plate", "conductor-induction", 3, "L2"),
    item("capacitance_definition", "电容定义计算", "calculation",
         r"平行板电容器接在 \(6\,\mathrm V\) 电池两端，负极板带电量为 \(-9.0\times10^{-8}\,\mathrm C\)。求电容器带电量和电容；改接 \(12\,\mathrm V\) 电池后电容是多少？",
         None, r"\(Q=9.0\times10^{-8}\,\mathrm C\)，\(C=1.5\times10^{-8}\,\mathrm F=1.5\times10^4\,\mathrm{pF}\)；改接后仍为 \(1.5\times10^4\,\mathrm{pF}\)",
         "电容器带电量取任一极板电荷量的绝对值。电容是结构属性，不随工作电压改变。",
         r"\[C=\frac QU\]",
         r"由负极板电荷量得 \(Q=9.0\times10^{-8}\,\mathrm C\)。代入 \(C=Q/U\)，得 \(C=1.5\times10^{-8}\,\mathrm F=1.5\times10^4\,\mathrm{pF}\)。只更换电源而不改变极板结构和介质，电容不变；在 \(12\,\mathrm V\) 下仍为 \(1.5\times10^4\,\mathrm{pF}\)。",
         "capacitance_definition", "capacitor-definition", 1, "L0"),
    item("capacitive_sensors", "四类电容式传感器", "multiple-choice",
         "甲、乙、丙、丁分别为液位、角位移、直线位移和压力电容式传感器，均保持两极板电压不变。根据电荷量或电流方向判断被测量变化。下列说法正确的是（多选）。",
         ["A. 甲中电荷量减少说明液位 h 增大", "B. 乙中电荷量增加说明转角 θ 增大", "C. 丙中电流流向传感器负极说明 x 增大", "D. 丁中电流流向传感器正极说明压力 F 增大"], "CD",
         r"恒压传感器满足 \(Q=CU\)，因此电荷和电流变化先由几何量对电容的影响决定。",
         r"\[C=\frac{\varepsilon S}{d},\qquad Q=CU,\qquad i=U\frac{\mathrm dC}{\mathrm dt}\]",
         "甲中液位升高使高介电常数区域增大，C、Q 均增大，A 错。乙图转角增大使重叠面积减小，C、Q 减小，B 错。丙图 x 增大表示介质抽出，C、|Q| 减小，负极板上的电子流回外电路，常规电流流向负极，C 对。丁中压力增大使动片靠近固定片，C、Q 增大，正极板获得正电荷，D 对。",
         "capacitive_sensors", "capacitor-sensor", 4, "L2"),
    item("connected_plate_distance", "恒压电容器减小板距", "multiple-choice",
         r"平行板电容器充电后仍与电源相连。将两极板距离减小，判断 \(Q、C、E、U\) 的变化（多选）。",
         ["A. Q 变大", "B. C 变大", "C. E 不变", "D. U 变小"], "AB",
         r"与电源相连时首先锁定 \(U\) 不变，再由板距变化依次推出 C、Q、E。",
         r"\[C=\frac{\varepsilon S}{d},\qquad Q=CU,\qquad E=\frac Ud\]",
         "板距 d 减小使 C 增大；U 由电源保持不变，所以 Q=CU 增大，同时 E=U/d 增大。故 A、B 正确，C、D 错误。",
         "connected_plate_distance", "capacitor-geometry", 2, "L1"),
    item("isolated_plate_distance", "断电电容器减小板距", "multiple-choice",
         r"平行板电容器充电后与电源断开。将两极板距离减小，判断 \(Q、C、E、U\) 的变化（多选）。",
         ["A. Q 变大", "B. C 变大", "C. E 不变", "D. U 变小"], "BCD",
         "与电源断开后首先锁定极板电荷量 Q 不变，再由 d 的变化推出其余各量。",
         r"\[C=\frac{\varepsilon S}{d},\qquad U=\frac QC,\qquad E=\frac{Q}{\varepsilon S}\]",
         "断电后 Q 不变。d 减小使 C 增大，因此 U=Q/C 减小；忽略边缘效应时 E=Q/(εS)，与 d 无关。故 B、C、D 正确。",
         "isolated_plate_distance", "capacitor-geometry", 2, "L1"),
    item("rc_discharge", "电容器充放电图像", "calculation",
         r"按原图电路先将开关 S 接 1 充电，稳定后接 2 放电。放电 \(i-t\) 图像约围成 35 个小方格；每小格横向 \(0.4\,\mathrm s\)、纵向 \(0.2\,\mathrm{mA}\)，电源电压为 \(7\,\mathrm V\)。求极板电性、放电电荷量、电容，并判断改变放电电阻时面积和最大电阻对应曲线。",
         None, r"上极板带正电；\(Q\approx2.8\times10^{-3}\,\mathrm C\)；\(C\approx4.0\times10^{-4}\,\mathrm F\)；面积不变；最大电阻对应 c 曲线",
         "i-t 图像面积就是通过导线的总电荷量。改变 R 只改变放电快慢，不改变初始电荷量。",
         r"\[Q=\int_0^\infty i\,\mathrm dt,\qquad C=\frac QU,\qquad i=\frac UR e^{-t/(RC)}\]",
         r"接 1 时上极板连电源正极，故带正电。一个方格面积为 \(0.4\times0.2\,\mathrm{mA\cdot s}=8.0\times10^{-5}\,\mathrm C\)，35 格给出 \(Q\approx2.8\times10^{-3}\,\mathrm C\)。因此 \(C=Q/U\approx4.0\times10^{-4}\,\mathrm F\)。更换 R 不改变初始 Q，所以完整放电曲线面积不变。R 越大，初始电流越小、衰减越慢，对应 c 曲线。",
         "rc_discharge", "capacitor-rc", 4, "L2"),
]


HOMEWORK = [
    item("lightning_rod", "避雷针尖端放电", "single-choice", "避雷针能够避免建筑物被雷击的主要原因是（　）。", ["A. 云层电荷经避雷针直接导入大地", "B. 避雷针尖端向云层放电，中和部分云层电荷", "C. 云层与避雷针摩擦起电", "D. 以上均不正确"], "B", "尖锐导体附近面电荷密度和场强很大，空气容易电离并发生尖端放电。", r"\[E_{\text{尖端}}\gg E_{\text{平缓处}}\]", "避雷针尖端曲率半径小，附近场强很强，空气被电离后形成持续的尖端放电，可中和或泄放部分云层电荷，从而降低发生强烈雷击的概率。选 B。", "lightning_rod", "conductor-application", 1, "L0"),
    item("grounded_sphere_center", "接地金属球球心附加场", "single-choice", "半径为 R 的接地金属球外有点电荷 Q，点电荷到球心 O 的距离为 r。感应电荷在球心产生的场强大小为（　）。", [r"A. \(kQ/R^2-kQ/r^2\)", r"B. \(kQ/R^2+kQ/r^2\)", "C. 0", r"D. \(kQ/r^2\)"], "D", "静电平衡导体内部总场为零，附加场必须恰好抵消外部点电荷在球心的场。", r"\[\vec E_Q(O)+\vec E_{\text{感应}}(O)=0\]", r"点电荷 Q 在 O 点产生的场强大小为 \(kQ/r^2\)。金属内部总场必须为零，因此感应电荷在 O 点产生等大反向的附加场，大小为 \(kQ/r^2\)。选 D。", "grounded_sphere_center", "conductor-induction", 2, "L1"),
    item("induced_field_vectors", "金属球内外附加场方向", "single-choice", r"在点电荷 \(-Q\) 的电场中，金属球处于静电平衡。A 为球内一点，B 为球外表面附近一点。判断感应电荷在 A、B 两点产生的附加场强方向，选择与原图相符的选项。", ["A. 图 A", "B. 图 B", "C. 图 C", "D. 图 D"], "C", "A 点位于导体内部，附加场与外电荷场严格反向；B 点需同时满足表面切向场为零。", r"\[\vec E_{\text{感应}}=-\vec E_{-Q}\quad(\text{导体内部})\]", r"在 A 点，外部负电荷产生的电场指向 \(-Q\)，感应电荷的附加场必须反向，指向右上。B 靠近左下表面，附加场既要抵消外场的切向分量，又受近端正感应电荷影响，方向指向右下。与这两个方向同时相符的是图 C。", "induced_field_vectors", "conductor-induction", 4, "L2"),
    item("cavity_electroscope", "空腔导体与验电器", "single-choice", "绝缘板上有不带电金箔验电器 A 和带正电的空腔导体 B。下列方法中不能使验电器箔片张开的是（　）。", ["A. 取电棒先接触 B 内壁，再接触 A", "B. 取电棒先接触 B 外壁，再接触 A", "C. A 经导线连取电棒，再让取电棒接触 B 内壁", "D. 使验电器 A 靠近 B"], "A", "空腔内没有电荷时，净电荷只分布在导体外表面；区分先取电再转移与保持导线连接的整体静电平衡。", r"\[\sigma_{\text{空腔内壁}}=0\quad(\text{空腔内无电荷})\]", "取电棒单独接触内壁时，内壁没有净电荷可带走，随后接触验电器不能使其带电，A 符合题意。接触外壁可以取到正电荷；保持导线连接再接触内壁时，验电器与 B 成为同一导体，电荷可分布到验电器外表面；靠近也会使验电器发生静电感应。选 A。", "cavity_electroscope", "conductor-shielding", 3, "L2"),
    item("oil_drop_switch", "油滴与变距电容器", "single-choice", "水平平行板电容器接电源，带电油滴在板间静止。依次断开开关、把下极板 N 向上移动、再闭合开关。下列说法正确的是（　）。", ["A. 第二步后场强减小", "B. 第二步中油滴电势能不变", "C. 第三步后 R 中有向左电流", "D. 第三步后油滴向下运动"], "C", "分三阶段处理：断电后 Q 不变；移动板时 E 不变；重新接电源后 U 恢复而 E 增大。", r"\[E_{\text{断开}}=\frac Q{\varepsilon S},\qquad E_{\text{接通}}=\frac Ud\]", "断开后移动 N，极板电荷量不变，理想板间场强 E 不变，A 错。N 接地且上移，油滴相对 N 的电势改变，电势能并非不变，B 错。板距减小使断开状态下电压降低，重新接电源时电容器继续充电，常规电流经 R 向左，C 对。接通后 E 增大，负油滴所受向上电场力增大，应向上运动，D 错。", "oil_drop_switch", "capacitor-dynamics", 4, "L3"),
    item("diode_capacitor", "二极管限制的变距电容器", "single-choice", "理想二极管只允许电流从 a 流向 b。平行板间电荷在 P 点静止。保持 A 不动，将 B 稍向下移动，判断 E、U、电势能和电荷运动。", ["A. E 变小", "B. U 不变", "C. 电荷在 P 点电势能变大", "D. 电荷仍保持静止"], "D", "先判断若维持恒压所需电流方向，再与二极管导通方向比较。二极管截止后电容器等效为隔离状态。", r"\[Q=\text{常量},\qquad E=\frac Q{\varepsilon S},\qquad U=Ed\]", "B 下移使 d 增大。若仍保持恒压，C 减小要求正电荷从 A 板流回电源，即电流应从 b 到 a，但二极管禁止该方向，故截止。于是 Q、E 不变，U 增大；电荷受到的电场力仍与重力平衡，继续静止。选 D。", "diode_capacitor", "capacitor-dynamics", 4, "L3"),
    item("fingerprint_sensor", "指纹电容传感器", "multiple-choice", "指纹凹点、凸点到采集器小极板的距离不同，各小电容器正对面积相同。下列说法正确的是（多选）。", ["A. 同电压时凹点对应电容器带电量较大", "B. 同电压时凸点对应电容器带电量较大", "C. 同电荷量时凹点对应电压较小", "D. 同电荷量时凸点对应电压较小"], "BD", "凸点离极板更近，板距更小、电容更大。分别在 U 恒定和 Q 恒定条件下比较。", r"\[C=\frac{\varepsilon S}{d},\qquad Q=CU,\qquad U=\frac QC\]", "凸点对应 d 小、C 大。同电压时 Q=CU，所以凸点带电量更大，B 对；同电荷量时 U=Q/C，所以凸点电压更小，D 对。A、C 均把凹凸关系反置。", "fingerprint_sensor", "capacitor-sensor", 2, "L1"),
    item("cola_straw", "可乐吸管电容触发", "multiple-choice", "铜箔包在塑料吸管外形成电极，可乐流过附近时改变电容并触发音乐。下列判断正确的是（多选）。", ["A. 空吸管对应的电容较小", "B. 塑料吸管还充当电介质", "C. 换其他饮料一定不能发声", "D. 插入小木条一定不能发声"], "AB", "识别电容器的两个导体和中间介质；触发条件是电容变化，不局限于可乐。", r"\[C\propto\varepsilon_r\]", "可乐可视为内电极，铜箔是外电极，塑料管壁位于两导体之间并充当电介质。空吸管没有可乐内电极且等效介电环境较弱，电容较小，A、B 正确。其他导电饮料或能显著改变介电常数的物体也可能触发，所以 C、D 的绝对表述错误。", "cola_straw", "capacitor-sensor", 2, "L1"),
    item("dielectric_polarization", "电介质极化与电容", "multiple-choice", "把均匀电介质插入带电平行板电容器，极板电荷量保持不变。图中电介质左表面出现正束缚电荷、右表面出现负束缚电荷。下列说法正确的是（多选）。", ["A. 左极板 A 带正电", "B. 插入后板间场强减小", "C. 插入后电容增大", "D. 插入过程中静电力对电介质不做功"], "BC", "束缚电荷产生的极化场与原场反向。Q 固定时，极化使总场和电压降低，因此电容增大。", r"\[\vec E=\vec E_0+\vec E_{\text p},\qquad C=\frac QU\]", "图中电介质左正右负，极化方向向左，说明外电场向左，因此右极板 B 为正、A 为负，A 错。极化场削弱原场，E 和 U 均减小；Q 不变时 C=Q/U 增大，B、C 对。电介质会被吸入电场较强区域，静电力做正功，D 错。", "dielectric_polarization", "capacitor-dielectric", 3, "L2"),
    item("insulated_conductor", "绝缘导体静电感应", "multiple-choice", "原来不带电的绝缘导体缓慢靠近带负电小球 P，M 靠近 P、N 远离 P。下列说法正确的是（多选）。", ["A. 远端 B 的感应电荷越来越多", "B. 导体内部场强越来越大", "C. 感应电荷在 M 点产生的场强恒大于在 N 点产生的场强", "D. 感应电荷在 M、N 点产生的场强相等"], "AC", "静电平衡过程中导体内部总场始终为零，所以感应场逐点等于外场的反向量，而外点电荷场随距离变化。", r"\[\vec E_{\text{感应}}(x)=-\vec E_P(x)\]", "导体越靠近 P，电荷分离越明显，远端 B 的负感应电荷增多，A 对。导体内部总场始终为零而不是越来越大，B 错。M 比 N 更靠近 P，外电场更强，因此为抵消外场，感应电荷在 M 产生的场强也更大，C 对、D 错。", "insulated_conductor", "conductor-induction", 3, "L2"),
    item("electrostatic_dust", "静电除尘装置", "multiple-choice", "静电除尘装置由金属管 A 和管中金属丝 B 组成。下列说法正确的是（多选）。", ["A. A 接高压正极，B 接高压负极", "B. 烟尘吸附电子后被吸在 B 上", "C. B 附近场强大，空气被电离成正离子和电子", "D. 烟尘自身电离成正负离子并分别吸附"], "AC", "细金属丝曲率半径小，附近场强最大并发生电晕放电；烟尘获得电子后向正集尘极运动。", r"\[F=qE\]", "B 为负的放电极，A 为正的集尘极，A 对。B 附近强场使空气电离，C 对。烟尘吸附电子后带负电，应被吸到正极 A，而不是 B，故 B 错；电离的是空气，D 的描述错误。", "electrostatic_dust", "conductor-application", 2, "L1"),
    item("electrometer_overlap", "静电计判断电容变化", "multiple-choice", "平行板电容器 A 接静电计、B 接地。B 稍向上移动使正对面积减小。由静电计指针变化判断电容变小的依据是（多选）。", ["A. U 不变、Q 减小", "B. U 不变、Q 增大", "C. Q 几乎不变、U 增大", "D. Q 几乎不变、E 增大"], "CD", "静电计近似不取电荷，因此极板 Q 不变；正对面积减小使 C 减小，U 与平均场强均增大。", r"\[C=\frac{\varepsilon S}{d},\qquad U=\frac QC,\qquad E=\frac Ud=\frac{Q}{\varepsilon S}\]", "B 上移使有效正对面积 S 减小，所以 C 减小。静电计内阻很大，极板电荷量几乎不变，于是 U=Q/C 增大，指针偏角增大，C 正确。板距 d 不变，因此平均场强 E=U/d 也增大；也可由 E=Q/(εS) 判断，D 正确。A、B 均错误。", "electrometer_overlap", "capacitor-measurement", 2, "L1"),
    item("millikan_oil", "密立根油滴与平行板", "multiple-choice", "平行板 M、N 接恒压电源 U，板距 d，质量 m 的带电油滴在板间平衡。下列说法正确的是（多选）。", [r"A. 油滴电荷量大小 \(q=mgd/U\)", "B. N 板向下移动后油滴向上运动", "C. N 板向下移动后 M 板电荷量减小", "D. 插入电介质后 M 板电荷量减小"], "AC", "恒压条件下 E=U/d。先由平衡求电荷量，再比较板距或介质改变后的 C、Q 和 E。", r"\[|q|E=mg,\qquad E=\frac Ud,\qquad Q=CU\]", r"平衡给出 \(|q|=mg/E=mgd/U\)，A 对。N 下移使 d 增大、E 减小，电场力不足，油滴向下而非向上，B 错。C=εS/d 减小，恒压下 M 板电荷量 Q=CU 减小，C 对。插入电介质使 C、Q 增大，D 错。", "millikan_oil", "capacitor-dynamics", 3, "L2"),
    item("capacitor_microphone", "电容式麦克风", "multiple-choice", "电容式麦克风的振动膜与基板构成恒压电容器，振动膜随声波左右振动。下列说法正确的是（多选）。", ["A. 振动膜向右时电容减小", "B. 振动膜向右时电阻中电流从 a 到 b", "C. 振动膜向左时电阻中电流从 a 到 b", "D. 振动膜向左时振动膜电荷量减小"], "BD", "向右表示板距减小、C 增大；向左表示板距增大、C 减小。结合图中电池极性判断充放电电流。", r"\[C=\frac{\varepsilon S}{d},\qquad i=U\frac{\mathrm dC}{\mathrm dt}\]", "振动膜向右靠近基板，C 增大而不是减小。恒压下电容器充电，基板一侧经电阻获得负电荷，常规电流从 a 流向 b，B 对。振动膜向左时 C、|Q| 减小，电流方向反转，所以 C 错；振动膜所带电荷量减小，D 对。",
         "capacitor_microphone", "capacitor-sensor", 3, "L2"),
    item("meltblown_sensor", "熔喷布厚度传感器", "multiple-choice", "恒压平行板传感器监测熔喷布厚度。熔喷布变厚使等效介电常数增大时，下列说法正确的是（多选）。", ["A. 极板间场强不变", "B. 极板电荷量减少", "C. 电容变小", "D. 灵敏电流计中有从 b 向 a 的电流"], "A", "板距和恒定电压均不变，场强不变；介电常数增大使 C、Q 增大。原卷列在多选题部分，但逐项核验后只有 A 成立。", r"\[E=\frac Ud,\qquad C=\frac{\varepsilon S}{d},\qquad Q=CU\]", "U、d 固定，所以 E=U/d 不变，A 对。等效介电常数增大使 C 增大，恒压下 Q 增大，B、C 错。充电电流按图从电源正极经电流计 a 流向 b，D 所述方向相反。因此原卷虽标作多选，本题按印刷条件只有 A 正确。", "meltblown_sensor", "capacitor-sensor", 2, "L1"),
]

FAMILY_NAMES = {
    "conductor-shielding": "静电屏蔽与空腔导体", "conductor-induction": "导体静电感应",
    "conductor-application": "静电技术应用", "capacitor-definition": "电容定义",
    "capacitor-geometry": "平行板几何变化", "capacitor-sensor": "电容式传感器",
    "capacitor-rc": "电容器充放电", "capacitor-dynamics": "电容器与带电体动力学",
    "capacitor-dielectric": "电介质极化", "capacitor-measurement": "电容测量",
}

IMAGE_MAP = {
    "cavity_shielding": "course-01-cavity-shielding.webp",
    "grounded_plate": "course-02-grounded-plate.webp",
    "capacitance_definition": "course-03-capacitance-definition.webp",
    "capacitive_sensors": "course-04-capacitive-sensors.webp",
    "rc_discharge": "course-07-rc-discharge.webp",
    "grounded_sphere_center": "homework-02-grounded-sphere.webp",
    "induced_field_vectors": "homework-03-induced-vectors.webp",
    "cavity_electroscope": "homework-04-electroscope.webp",
    "oil_drop_switch": "homework-05-oil-switch.webp",
    "diode_capacitor": "homework-06-diode.webp",
    "fingerprint_sensor": "homework-07-fingerprint.webp",
    "cola_straw": "homework-08-cola-straw.webp",
    "dielectric_polarization": "homework-09-dielectric.webp",
    "insulated_conductor": "homework-10-insulated-conductor.webp",
    "electrostatic_dust": "homework-11-dust.webp",
    "electrometer_overlap": "homework-12-electrometer.webp",
    "millikan_oil": "homework-13-millikan.webp",
    "capacitor_microphone": "homework-14-microphone.webp",
    "meltblown_sensor": "homework-15-meltblown.webp",
}


def option_analyses(row):
    if not row["options"]:
        return []
    correct = set(row["answer"])
    result = []
    for index, option in enumerate(row["options"]):
        letter = chr(65 + index)
        result.append({
            "option": letter,
            "title": option[2:] if option.startswith(letter + ".") else option,
            "judgment": ("正确。" if letter in correct else "错误。") + "请对照完整分析中的条件链和公式核验。",
        })
    return result


def make_problem(row, number, group):
    prefix = "course" if group == "course" else "hw"
    pid = f"electrostatics_capacitor_{prefix}_{number:02d}_{row['slug']}"
    label = f"例{number}" if group == "course" else (f"单选第{number}题" if number <= 6 else f"多选第{number}题")
    return {
        "id": pid, "chapter": CHAPTER, "title": f"{label}：{row['name']}",
        "type": row["type"], "question": row["question"], "options": row["options"], "answer": row["answer"],
        "analysis": {"title": "解析", "sharedThinking": row["thinking"], "sharedFormula": row["formula"]},
        "analysisPresentation": {"collapseEachStep": True, "optionMode": "independent-statements" if row["type"] == "multiple-choice" else "shared-solution"},
        "analysisLeadSteps": [
            {"stepId": 1, "title": "物理过程与条件", "content": row["thinking"]},
            {"stepId": 2, "title": "建模与专用公式", "content": row["formula"]},
            {"stepId": 3, "title": "完整分析与推导", "content": row["derivation"]},
        ] if row["type"] == "multiple-choice" else None,
        "optionAnalyses": option_analyses(row) if row["type"] == "multiple-choice" else [],
        "analysisSupplementSteps": [
            {"stepId": 5, "title": "答案复核", "content": "最后检查恒压/恒荷条件、导体是否接地、二极管导通方向以及场强和电势能的方向性。"},
            {"stepId": 6, "title": "动画观察点", "content": "播放动画，观察感应电荷、极板距离、电介质、电流或带电体状态随时间的对应变化，并与右侧图像同步核验。"},
            {"stepId": 7, "title": "结论", "content": f"答案为 **{row['answer']}**。"},
        ] if row["type"] == "multiple-choice" else None,
        "steps": [
            {"stepId": 1, "title": "物理过程与条件", "content": row["thinking"]},
            {"stepId": 2, "title": "建模与专用公式", "content": row["formula"]},
            {"stepId": 3, "title": "完整分析与推导", "content": row["derivation"]},
            {"stepId": 5, "title": "答案复核", "content": "检查边界条件、方向、单位及恒压或恒荷条件。"},
            {"stepId": 6, "title": "动画观察点", "content": "观察动画与图像中的电荷、电场、电容、电压或电流是否同步满足推导。"},
            {"stepId": 7, "title": "结论", "content": f"答案为 **{row['answer']}**。"},
        ],
        "knowledge": ["静电平衡", "电容器", row["name"]],
        "images": ([{
            "src": "assets/problem-images/autumn-electrostatics-capacitor/" + IMAGE_MAP[row["slug"]],
            "alt": row["name"] + "原题印刷示意图",
        }] if row["slug"] in IMAGE_MAP else []),
        "practice": {
            "title": f"进阶近似题：{row['name']}的条件迁移",
            "question": f"保持“{row['name']}”的核心物理结构，改变接地状态、电源连接方式、几何尺寸或介质条件，重新判断各物理量并说明临界条件。",
            "answer": "先锁定不变量，再按新边界条件重新列式；答案取决于改变后的连接和几何条件。",
            "thinking": "这不是只换数字。先判断系统属于恒压、恒荷还是二极管限制状态，再处理场强、电势、电容、电荷量和能量。",
            "difficulty": "equal-or-higher", "upgradeType": "same-concept-structural-transfer",
        },
        "animation": {
            "enabled": True, "level": "animated", "type": "electrostatics_capacitor_model", "variant": row["variant"],
            "playable": True, "interactive": True, "notes": f"按“{row['name']}”原题独立显示静电或电容变化。",
            "params": {
                "geometry": {"label": "几何变化", "value": 1, "min": 0.6, "max": 1.4, "step": 0.1, "unit": "倍"},
                "voltage": {"label": "电压", "value": 6, "min": 2, "max": 12, "step": 1, "unit": "V"},
            },
            "timeline": {"duration": 7, "loop": False},
        },
        "taxonomy": {
            "module": "电磁学", "topic": CHAPTER, "modelId": "electrostatics-capacitor", "modelName": "静电平衡与电容器",
            "familyId": row["family"], "familyName": FAMILY_NAMES[row["family"]],
            "role": "母题" if number == 1 else "条件变式", "difficulty": row["difficulty"], "variantLevel": row["level"],
            "skills": ["边界条件识别", "静电与电容关系"], "prerequisites": ["电场强度", "电势与电势差"],
        },
    }


def compact(value):
    if isinstance(value, dict):
        return {key: compact(item) for key, item in value.items() if item is not None and item != []}
    if isinstance(value, list):
        return [compact(item) for item in value]
    return value


def main():
    generated = []
    for group, rows in (("course", COURSE), ("hw", HOMEWORK)):
        for number, row in enumerate(rows, 1):
            problem = compact(make_problem(row, number, group))
            path = OUT / f"{problem['id']}.json"
            if path.exists():
                existing = json.loads(path.read_text(encoding="utf-8"))
                existing.update(problem)
                problem = existing
            path.write_text(json.dumps(problem, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            generated.append({"id": problem["id"], "file": path.name})

    index = json.loads(INDEX.read_text(encoding="utf-8"))
    entries = index if isinstance(index, list) else index["problems"]
    ids = {entry["id"] for entry in entries}
    for entry in generated:
        if entry["id"] not in ids:
            entries.append(entry)
    INDEX.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(generated)} {CHAPTER} problems")


if __name__ == "__main__":
    main()
