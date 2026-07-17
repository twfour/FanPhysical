function rttVariant() {
  return ((problemDataMap[currentScene] || {}).animation || {}).variant || "";
}

function rttParam(key, fallback) {
  return getJsonParam(currentScene, key, fallback);
}

function rttTime() {
  return getJsonAnimationState(currentScene).time;
}

function rttDuration() {
  return Math.max(0.001, getJsonDuration(currentScene));
}

function rttProgress() {
  return constrain(rttTime() / rttDuration(), 0, 1);
}

function rttText(label, x, y, colorHex, size, alignMode) {
  noStroke();
  fill(colorHex || "#334155");
  textSize(size || 14);
  textAlign(alignMode || LEFT, CENTER);
  text(String(label), x, y);
}

function rttTitle(title, subtitle) {
  rttText(title, 26, 29, "#0f172a", 20, LEFT);
  rttText(subtitle, 26, 56, "#334155", 14, LEFT);
}

function rttArrow(x1, y1, x2, y2, colorHex, label) {
  var angle = Math.atan2(y2 - y1, x2 - x1);
  var head = 8;
  stroke(colorHex || "#dc2626");
  strokeWeight(2.2);
  line(x1, y1, x2, y2);
  line(x2, y2, x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
  line(x2, y2, x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
  if (label) rttText(label, x2 + 7, y2 - 9, colorHex || "#dc2626", 12, LEFT);
}

function rttBall(x, y, colorHex, label, diameter) {
  fill(colorHex || "#2563eb");
  stroke("#ffffff");
  strokeWeight(2);
  circle(x, y, diameter || 20);
  if (label) rttText(label, x, y - (diameter || 20) * 0.8 - 8, "#0f172a", 12, CENTER);
}

function rttBlock(x, y, widthValue, heightValue, colorHex, label) {
  fill(colorHex || "#f97316");
  stroke("#334155");
  strokeWeight(1.3);
  rect(x - widthValue / 2, y - heightValue / 2, widthValue, heightValue, 4);
  if (label) rttText(label, x, y, "#ffffff", 12, CENTER);
}

function rttSpring(x1, y1, x2, y2, colorHex) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  var lengthValue = Math.sqrt(dx * dx + dy * dy) || 1;
  var nx = -dy / lengthValue;
  var ny = dx / lengthValue;
  noFill();
  stroke(colorHex || "#2563eb");
  strokeWeight(2);
  beginShape();
  vertex(x1, y1);
  for (var index = 1; index < 18; index += 1) {
    var ratio = index / 18;
    var offset = (index % 2 ? 1 : -1) * 6;
    vertex(x1 + dx * ratio + nx * offset, y1 + dy * ratio + ny * offset);
  }
  vertex(x2, y2);
  endShape();
}

function rttGraphFrame(title, subtitle, xMin, xMax, yMin, yMax, xLabel, yLabel) {
  var frame = { left: 624, right: 968, top: 92, bottom: 414 };
  frame.xMin = xMin;
  frame.xMax = xMax;
  frame.yMin = yMin;
  frame.yMax = yMax;
  rttText(title, graphLeft + 24, 29, "#0f172a", 19, LEFT);
  rttText(subtitle, graphLeft + 24, 56, "#334155", 13, LEFT);
  fill("#ffffff");
  stroke("#cbd5e1");
  strokeWeight(1.2);
  rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  for (var index = 0; index <= 4; index += 1) {
    var x = map(index, 0, 4, frame.left, frame.right);
    var y = map(index, 0, 4, frame.bottom, frame.top);
    stroke("#e2e8f0");
    strokeWeight(1);
    line(x, frame.top, x, frame.bottom);
    line(frame.left, y, frame.right, y);
    rttText(rttNumber(map(index, 0, 4, xMin, xMax)), x, frame.bottom + 17, "#475569", 11, CENTER);
    rttText(rttNumber(map(index, 0, 4, yMin, yMax)), frame.left - 9, y, "#475569", 11, RIGHT);
  }
  rttText(xLabel || "x", (frame.left + frame.right) / 2, 462, "#334155", 12, CENTER);
  rttText(yLabel || "y", frame.left - 20, 73, "#334155", 12, CENTER);
  return frame;
}

function rttNumber(value) {
  if (Math.abs(value) >= 100) return value.toFixed(0);
  if (Math.abs(value) >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

function rttGX(frame, value) {
  return map(value, frame.xMin, frame.xMax, frame.left, frame.right);
}

function rttGY(frame, value) {
  return map(value, frame.yMin, frame.yMax, frame.bottom, frame.top);
}

function rttPlot(frame, colorHex, valueAt, startValue, endValue, dashed) {
  var low = startValue === undefined ? frame.xMin : startValue;
  var high = endValue === undefined ? frame.xMax : endValue;
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  drawingContext.clip();
  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  drawingContext.setLineDash(dashed ? [6, 5] : []);
  beginShape();
  for (var index = 0; index <= 180; index += 1) {
    var xValue = map(index, 0, 180, low, high);
    var yValue = valueAt(xValue);
    if (Number.isFinite(yValue)) vertex(rttGX(frame, xValue), rttGY(frame, yValue));
  }
  endShape();
  drawingContext.setLineDash([]);
  drawingContext.restore();
  pop();
}

function rttMarker(frame, xValue, yValue, colorHex, label) {
  var x = constrain(rttGX(frame, xValue), frame.left, frame.right);
  var y = constrain(rttGY(frame, yValue), frame.top, frame.bottom);
  push();
  stroke(colorHex || "#dc2626");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(x, frame.bottom, x, y);
  line(frame.left, y, x, y);
  drawingContext.setLineDash([]);
  noStroke();
  fill(colorHex || "#dc2626");
  circle(x, y, 9);
  pop();
  if (label) rttText(label, x + 7, y - 12, colorHex || "#dc2626", 11, LEFT);
}

function rttBar(frame, index, count, value, colorHex, label) {
  var slot = (frame.right - frame.left) / count;
  var widthValue = slot * 0.56;
  var left = frame.left + index * slot + (slot - widthValue) / 2;
  var top = constrain(rttGY(frame, value), frame.top, frame.bottom);
  noStroke();
  fill(colorHex);
  rect(left, top, widthValue, frame.bottom - top, 4, 4, 0, 0);
  rttText(label, left + widthValue / 2, frame.bottom + 17, "#334155", 11, CENTER);
  rttText(rttNumber(value), left + widthValue / 2, top - 12, colorHex, 11, CENTER);
}

function rttLegend(items, x, y) {
  for (var index = 0; index < items.length; index += 1) {
    noStroke();
    fill(items[index].color);
    circle(x, y + index * 20, 8);
    rttText(items[index].label, x + 10, y + index * 20, "#334155", 12, LEFT);
  }
}

var rttSceneDrawers = {
  required2_01_history: rttHistoryScene,
  required2_02_river_crossing: rttRiverScene,
  required2_03_rope_constraint: rttRopeScene,
  required2_04_ski_jump: rttSkiScene,
  required2_05_oblique_throw: rttObliqueScene,
  required2_06_ferris_wheel: rttFerrisScene,
  required2_07_double_conical_pendulum: rttDoubleConeScene,
  required2_08_planet_gravity: rttPlanetGravityScene,
  required2_09_solar_density: rttSolarDensityScene,
  required2_10_orbit_transfer: rttOrbitTransferScene,
  required2_11_force_vt: rttForceVtScene,
  required2_12_conveyor_energy: rttConveyorEnergyScene,
  required2_13_geostationary: rttGeostationaryScene,
  required2_14_cross_conveyor: rttCrossConveyorScene,
  required2_15_gear_turntable: rttGearTurntableScene,
  required2_16_counterweight_spring: rttCounterweightScene,
  required2_17_semicircle_tube: rttSemicircleTubeScene,
  required2_18_rope_ball: rttRopeBallScene,
  required2_19_toy_car_power: rttToyCarScene,
  required2_20_arc_incline: rttArcInclineScene
};

var rttGraphDrawers = {
  required2_01_history: rttHistoryGraph,
  required2_02_river_crossing: rttRiverGraph,
  required2_03_rope_constraint: rttRopeGraph,
  required2_04_ski_jump: rttSkiGraph,
  required2_05_oblique_throw: rttObliqueGraph,
  required2_06_ferris_wheel: rttFerrisGraph,
  required2_07_double_conical_pendulum: rttDoubleConeGraph,
  required2_08_planet_gravity: rttPlanetGravityGraph,
  required2_09_solar_density: rttSolarDensityGraph,
  required2_10_orbit_transfer: rttOrbitTransferGraph,
  required2_11_force_vt: rttForceVtGraph,
  required2_12_conveyor_energy: rttConveyorEnergyGraph,
  required2_13_geostationary: rttGeostationaryGraph,
  required2_14_cross_conveyor: rttCrossConveyorGraph,
  required2_15_gear_turntable: rttGearTurntableGraph,
  required2_16_counterweight_spring: rttCounterweightGraph,
  required2_17_semicircle_tube: rttSemicircleTubeGraph,
  required2_18_rope_ball: rttRopeBallGraph,
  required2_19_toy_car_power: rttToyCarGraph,
  required2_20_arc_incline: rttArcInclineGraph
};

function drawRequiredTwoTestScene() {
  var drawer = rttSceneDrawers[rttVariant()];
  if (drawer) drawer();
}

function drawRequiredTwoTestGraph() {
  var drawer = rttGraphDrawers[rttVariant()];
  if (drawer) drawer();
}

function rttHistoryScene() {
  var progress = rttProgress();
  var eccentricity = rttParam("orbitEccentricity", 0.35);
  var phase = progress * Math.PI * 2;
  var cx = 290;
  var cy = 250;
  var rx = 190;
  var ry = rx * Math.sqrt(Math.max(0.2, 1 - eccentricity * eccentricity)) * 0.58;
  var focus = eccentricity * rx;
  var px = cx + rx * Math.cos(phase);
  var py = cy + ry * Math.sin(phase);
  rttTitle("万有引力科学史", "观测数据、经验定律、统一理论与实验测量依次推进");
  noFill();
  stroke("#94a3b8");
  strokeWeight(2);
  ellipse(cx, cy, rx * 2, ry * 2);
  fill("#f59e0b");
  noStroke();
  circle(cx - focus, cy, 34);
  rttBall(px, py, "#2563eb", "行星", 20);
  rttArrow(px, py, cx - focus, cy, "#dc2626", "引力");
  rttText("太阳", cx - focus, cy + 28, "#92400e", 12, CENTER);
  rttText("开普勒：由轨道数据总结规律", 286, 410, "#0f172a", 15, CENTER);
  rttText("卡文迪什：扭秤测 G", 286, 438, "#334155", 14, CENTER);
}

function rttHistoryGraph() {
  var milestones = [
    { year: 1572, label: "第谷观测", color: "#64748b" },
    { year: 1609, label: "开普勒定律", color: "#2563eb" },
    { year: 1687, label: "牛顿引力", color: "#7c3aed" },
    { year: 1798, label: "卡文迪什测 G", color: "#dc2626" }
  ];
  var frame = rttGraphFrame("理论发展时间轴", "答案 A：开普勒使用第谷观测资料", 1550, 1810, 0, 1, "年份", "里程碑");
  stroke("#cbd5e1");
  strokeWeight(4);
  line(frame.left, 255, frame.right, 255);
  for (var index = 0; index < milestones.length; index += 1) {
    var x = rttGX(frame, milestones[index].year);
    var y = index % 2 ? 205 : 305;
    stroke(milestones[index].color);
    strokeWeight(2);
    line(x, 255, x, y);
    noStroke();
    fill(milestones[index].color);
    circle(x, 255, 11);
    rttText(milestones[index].label, x, y + (index % 2 ? -13 : 13), milestones[index].color, 11, CENTER);
  }
}

function rttRiverValues() {
  var water = rttParam("waterSpeed", 3);
  var boat = Math.max(water + 0.2, rttParam("boatSpeed", 5));
  var cross = Math.sqrt(Math.max(0.04, boat * boat - water * water));
  return { water: water, boat: boat, cross: cross, t1: 1 / boat, t2: 1 / cross };
}

function rttRiverScene() {
  var values = rttRiverValues();
  var maxTime = values.t2;
  var timeValue = rttProgress() * maxTime;
  var y1Ratio = constrain(timeValue / values.t1, 0, 1);
  var y2Ratio = constrain(timeValue / values.t2, 0, 1);
  var x1 = 165 + values.water * timeValue * 190;
  var x2 = 395;
  var y1 = 392 - 265 * y1Ratio;
  var y2 = 392 - 265 * y2Ratio;
  rttTitle("两种方式渡河", "橙船船头垂岸；蓝船合速度垂岸");
  noStroke();
  fill("#dbeafe");
  rect(38, 105, 494, 310);
  fill("#dcfce7");
  rect(38, 86, 494, 20);
  rect(38, 415, 494, 20);
  for (var y = 145; y < 390; y += 55) rttArrow(70, y, 115, y, "#60a5fa", "");
  stroke("#f97316");
  strokeWeight(2);
  drawingContext.setLineDash([5, 5]);
  line(165, 392, x1, y1);
  stroke("#2563eb");
  line(395, 392, x2, y2);
  drawingContext.setLineDash([]);
  rttBlock(x1, y1, 34, 18, "#f97316", "1");
  rttBlock(x2, y2, 34, 18, "#2563eb", "2");
  rttText("t1/t2 = " + (values.cross / values.boat).toFixed(3), 285, 464, "#0f172a", 15, CENTER);
}

function rttRiverGraph() {
  var values = rttRiverValues();
  var frame = rttGraphFrame("垂岸位移—时间", "第二次垂岸分速度更小，因此用时更长", 0, values.t2 * 1.05, 0, 1.05, "时间（归一）", "河宽比例");
  rttPlot(frame, "#f97316", function (timeValue) { return Math.min(1, timeValue / values.t1); });
  rttPlot(frame, "#2563eb", function (timeValue) { return Math.min(1, timeValue / values.t2); });
  rttMarker(frame, rttProgress() * values.t2, Math.min(1, rttProgress()), "#2563eb", "当前");
  rttLegend([{ color: "#f97316", label: "船头垂岸" }, { color: "#2563eb", label: "航迹垂岸" }], 744, 118);
}

function rttRopeGeometry(ratio) {
  var d = rttParam("distance", 4);
  var target = rttParam("dropRatio", 0.75) * d;
  var y = target * ratio;
  var slant = Math.sqrt(d * d + y * y);
  return { d: d, y: y, slant: slant, target: target, lifted: slant - d };
}

function rttRopeScene() {
  var geometry = rttRopeGeometry(rttProgress());
  var scaleValue = 55;
  var rodX = 120;
  var pulleyX = rodX + geometry.d * scaleValue;
  var pulleyY = 145;
  var ballY = pulleyY + geometry.y * scaleValue;
  var weightY = 235 - geometry.lifted * scaleValue;
  rttTitle("斜绳关联速度", "重物速度等于小球速度在斜绳方向的投影");
  stroke("#64748b");
  strokeWeight(4);
  line(rodX, 100, rodX, 430);
  noFill();
  stroke("#0f172a");
  strokeWeight(2);
  circle(pulleyX, pulleyY, 34);
  stroke("#2563eb");
  line(rodX, ballY, pulleyX, pulleyY);
  line(pulleyX + 17, pulleyY, pulleyX + 17, weightY);
  rttBall(rodX, ballY, "#f97316", "m1", 22);
  rttBlock(pulleyX + 17, weightY + 17, 42, 34, "#2563eb", "m2");
  rttText("v2/v1 = y/s = " + (geometry.y / geometry.slant).toFixed(3), 285, 460, "#0f172a", 15, CENTER);
}

function rttRopeGraph() {
  var targetRatio = rttParam("dropRatio", 0.75);
  var frame = rttGraphFrame("速度投影系数", "v2/v1 = y / sqrt(d²+y²)", 0, 1.25, 0, 0.85, "y / d", "v2 / v1");
  rttPlot(frame, "#2563eb", function (ratio) { return ratio / Math.sqrt(1 + ratio * ratio); });
  var x = targetRatio * rttProgress();
  rttMarker(frame, x, x / Math.sqrt(1 + x * x), "#dc2626", "当前");
}

function rttSkiValues() {
  var speed = rttParam("launchSpeed", 20);
  var theta = rttParam("slopeAngle", 30) * Math.PI / 180;
  var flight = 2 * speed * Math.tan(theta) / 10;
  return { speed: speed, theta: theta, flight: flight };
}

function rttSkiScene() {
  var values = rttSkiValues();
  var timeValue = rttProgress() * values.flight;
  var xMeters = values.speed * timeValue;
  var yMeters = 5 * timeValue * timeValue;
  var maxX = Math.max(1, values.speed * values.flight);
  var scaleValue = Math.min(6, 380 / maxX);
  var startX = 475;
  var startY = 125;
  var x = startX - xMeters * scaleValue;
  var y = startY + yMeters * scaleValue;
  rttTitle("跳台滑雪功率", "平抛轨迹与斜坡交点决定飞行时间");
  stroke("#64748b");
  strokeWeight(7);
  line(startX, startY, 75, startY + (startX - 75) * Math.tan(values.theta));
  noFill();
  stroke("#60a5fa");
  strokeWeight(2.4);
  beginShape();
  for (var index = 0; index <= 100; index += 1) {
    var t = values.flight * index / 100;
    vertex(startX - values.speed * t * scaleValue, startY + 5 * t * t * scaleValue);
  }
  endShape();
  rttBall(x, y, "#ef4444", "运动员", 22);
  rttArrow(x, y, x, y + 60, "#dc2626", "mg");
  rttText("t = " + timeValue.toFixed(2) + " s", 286, 456, "#0f172a", 15, CENTER);
}

function rttSkiGraph() {
  var values = rttSkiValues();
  var maxPower = 600 * 10 * values.flight;
  var frame = rttGraphFrame("重力瞬时功率", "P = mg²t；平均功率等于末功率的一半", 0, values.flight, 0, maxPower * 1.08, "t / s", "P / W");
  rttPlot(frame, "#dc2626", function (timeValue) { return 6000 * timeValue; });
  rttPlot(frame, "#2563eb", function () { return 3000 * values.flight; }, 0, values.flight, true);
  var t = rttProgress() * values.flight;
  rttMarker(frame, t, 6000 * t, "#dc2626", "瞬时");
  rttLegend([{ color: "#dc2626", label: "瞬时功率" }, { color: "#2563eb", label: "全程平均" }], 750, 116);
}

function rttObliqueValues() {
  var speed = rttParam("launchSpeed", 16);
  var theta = rttParam("launchAngle", 50) * Math.PI / 180;
  var heightValue = rttParam("launchHeight", 6);
  var vx = speed * Math.cos(theta);
  var vy = speed * Math.sin(theta);
  var flight = (vy + Math.sqrt(vy * vy + 20 * heightValue)) / 10;
  return { speed: speed, theta: theta, height: heightValue, vx: vx, vy: vy, flight: flight };
}

function rttObliqueScene() {
  var values = rttObliqueValues();
  var timeValue = rttProgress() * values.flight;
  var xMeters = values.vx * timeValue;
  var yMeters = values.height + values.vy * timeValue - 5 * timeValue * timeValue;
  var range = values.vx * values.flight;
  var maxHeight = values.height + values.vy * values.vy / 20;
  var scaleX = 430 / Math.max(1, range);
  var scaleY = 300 / Math.max(1, maxHeight);
  var startX = 70;
  var groundY = 405;
  var x = startX + xMeters * scaleX;
  var y = groundY - yMeters * scaleY;
  rttTitle("斜抛机械能", "参考面改变势能数值，不改变动能和守恒关系");
  stroke("#64748b");
  strokeWeight(3);
  line(45, groundY, 535, groundY);
  stroke("#94a3b8");
  strokeWeight(1);
  drawingContext.setLineDash([5, 5]);
  line(45, groundY - values.height * scaleY, 535, groundY - values.height * scaleY);
  drawingContext.setLineDash([]);
  rttText("势能零面", 470, groundY - values.height * scaleY - 12, "#64748b", 12, CENTER);
  noFill();
  stroke("#60a5fa");
  strokeWeight(2.4);
  beginShape();
  for (var index = 0; index <= 120; index += 1) {
    var t = values.flight * index / 120;
    vertex(startX + values.vx * t * scaleX, groundY - (values.height + values.vy * t - 5 * t * t) * scaleY);
  }
  endShape();
  rttBall(x, y, "#ef4444", "石块", 21);
  rttText("机械能保持不变", 285, 456, "#0f172a", 15, CENTER);
}

function rttObliqueGraph() {
  var values = rttObliqueValues();
  var mass = 1;
  var total = 0.5 * mass * values.speed * values.speed;
  var maxPotential = mass * 10 * values.vy * values.vy / 20;
  var minPotential = -mass * 10 * values.height;
  var frame = rttGraphFrame("相对抛出点的能量", "E = Ek + Ep 恒定", 0, values.flight, minPotential * 1.1, Math.max(total, maxPotential) * 1.18, "t / s", "能量 / J");
  rttPlot(frame, "#f59e0b", function (timeValue) { return 10 * (values.vy * timeValue - 5 * timeValue * timeValue); });
  rttPlot(frame, "#2563eb", function (timeValue) { return total - 10 * (values.vy * timeValue - 5 * timeValue * timeValue); });
  rttPlot(frame, "#16a34a", function () { return total; }, 0, values.flight, true);
  rttLegend([{ color: "#f59e0b", label: "势能" }, { color: "#2563eb", label: "动能" }, { color: "#16a34a", label: "机械能" }], 748, 112);
}

function rttFerrisScene() {
  var radius = rttParam("radius", 4);
  var omega = rttParam("omega", 0.8);
  var angle = Math.PI + Math.PI / 5 + rttProgress() * Math.PI * 2;
  var cx = 285;
  var cy = 250;
  var displayR = 155;
  var x = cx + displayR * Math.cos(angle);
  var y = cy + displayR * Math.sin(angle);
  rttTitle("摩天轮轿厢摩擦力", "轿厢水平，摩擦力只负责水平向心分量");
  noFill();
  stroke("#94a3b8");
  strokeWeight(5);
  circle(cx, cy, displayR * 2);
  stroke("#cbd5e1");
  strokeWeight(1.5);
  line(cx, cy, x, y);
  rttBlock(x, y, 58, 30, "#f97316", "轿厢");
  rttArrow(x, y - 20, cx, cy, "#7c3aed", "a_n");
  rttArrow(x, y + 20, x + (cx - x) * 0.55, y + 20, "#dc2626", "f");
  rttText("|f| = mω²R·|水平投影|", 285, 453, "#0f172a", 15, CENTER);
  rttText("ω²R = " + (omega * omega * radius).toFixed(2) + " m/s²", 285, 478, "#334155", 13, CENTER);
}

function rttFerrisGraph() {
  var radius = rttParam("radius", 4);
  var omega = rttParam("omega", 0.8);
  var maxForce = omega * omega * radius;
  var frame = rttGraphFrame("水平摩擦力分量", "取 m = 1 kg，横轴为半径相对水平线夹角", 0, 360, -maxForce * 1.15, maxForce * 1.15, "角位置 / deg", "f_x / N");
  rttPlot(frame, "#dc2626", function (degree) { return maxForce * Math.cos(degree * Math.PI / 180); });
  var degree = rttProgress() * 360;
  rttMarker(frame, degree, maxForce * Math.cos(degree * Math.PI / 180), "#dc2626", "当前");
}

function rttDoubleConeScene() {
  var progress = rttProgress();
  var phase = progress * Math.PI * 2;
  var top = { x: 285, y: 95 };
  var alpha = 28 * Math.PI / 180;
  var beta = 40 * Math.PI / 180;
  var lengthValue = 150;
  var projection = Math.cos(phase);
  var x1 = top.x + lengthValue * Math.sin(alpha) * projection;
  var y1 = top.y + lengthValue * Math.cos(alpha);
  var x2 = x1 + lengthValue * Math.sin(beta) * projection;
  var y2 = y1 + lengthValue * Math.cos(beta);
  rttTitle("双球圆锥摆构型", "稳定构型中下段绳倾角大于上段绳倾角");
  stroke("#94a3b8");
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 5]);
  line(top.x, top.y, top.x, 440);
  drawingContext.setLineDash([]);
  stroke("#334155");
  strokeWeight(3);
  line(top.x, top.y, x1, y1);
  line(x1, y1, x2, y2);
  fill("#0f172a");
  noStroke();
  circle(top.x, top.y, 12);
  rttBall(x1, y1, "#f97316", "上球", 23);
  rttBall(x2, y2, "#2563eb", "下球", 23);
  noFill();
  stroke("#fdba74");
  ellipse(top.x, y1, 2 * lengthValue * Math.sin(alpha), 30);
  stroke("#93c5fd");
  ellipse(top.x, y2, 2 * (lengthValue * Math.sin(alpha) + lengthValue * Math.sin(beta)), 42);
  rttText("α = 28°，β = 40°", 285, 462, "#0f172a", 15, CENTER);
}

function rttDoubleConeGraph() {
  var frame = rttGraphFrame("两段绳倾角比较", "示意稳定解：下段绳需要更大的水平偏角", 0, 2, 0, 50, "绳段", "倾角 / deg");
  rttBar(frame, 0, 2, 28, "#f97316", "上段 α");
  rttBar(frame, 1, 2, 40, "#2563eb", "下段 β");
}

function rttPlanetGravityValues() {
  var massRatio = rttParam("massRatio", 0.5);
  var radiusRatio = rttParam("radiusRatio", 0.5);
  return { mass: massRatio, radius: radiusRatio, gravity: massRatio / (radiusRatio * radiusRatio) };
}

function rttPlanetGravityScene() {
  var values = rttPlanetGravityValues();
  var progress = rttProgress();
  var earthRadius = 92;
  var planetRadius = constrain(earthRadius * values.radius, 35, 125);
  var dropEarth = Math.min(105, 52 * progress * progress);
  var dropPlanet = Math.min(105, 52 * values.gravity * progress * progress);
  rttTitle("星球表面重力比较", "g 与质量成正比，与半径平方成反比");
  fill("#60a5fa");
  stroke("#1d4ed8");
  strokeWeight(2);
  circle(165, 330, earthRadius * 2);
  fill("#a78bfa");
  stroke("#6d28d9");
  circle(405, 330, planetRadius * 2);
  rttBall(165, 150 + dropEarth, "#f97316", "地球落体", 18);
  rttBall(405, 150 + dropPlanet, "#ef4444", "目标星球", 18);
  rttText("地球", 165, 445, "#1e3a8a", 14, CENTER);
  rttText("M'=" + values.mass.toFixed(1) + "M，R'=" + values.radius.toFixed(1) + "R", 405, 445, "#5b21b6", 13, CENTER);
  rttText("g'/g0 = " + values.gravity.toFixed(2), 285, 474, "#0f172a", 15, CENTER);
}

function rttPlanetGravityGraph() {
  var values = rttPlanetGravityValues();
  var frame = rttGraphFrame("表面重力比例", "固定当前质量比，改变半径比", 0.3, 1.5, 0, Math.min(8, values.mass / 0.09) * 1.08, "R' / R地", "g' / g0");
  rttPlot(frame, "#7c3aed", function (radiusRatio) { return values.mass / (radiusRatio * radiusRatio); });
  rttMarker(frame, values.radius, values.gravity, "#dc2626", "当前");
}

function rttSolarDensityScene() {
  var imageDistance = rttParam("imageDistance", 1);
  var imageDiameter = rttParam("imageDiameter", 0.0093);
  var ratio = imageDiameter / imageDistance;
  var progress = rttProgress();
  var sunX = 95;
  var sunY = 250;
  var holeX = 345;
  var screenX = 500;
  var imageHalf = constrain(ratio * 7000, 18, 75);
  rttTitle("小孔成像估测太阳密度", "角直径给 R/r，公转周期给 M/r³");
  fill("#fbbf24");
  stroke("#f59e0b");
  strokeWeight(2);
  circle(sunX, sunY, 118);
  stroke("#334155");
  strokeWeight(4);
  line(holeX, 115, holeX, 385);
  noStroke();
  fill("#ffffff");
  circle(holeX, sunY, 7);
  stroke("#64748b");
  strokeWeight(4);
  line(screenX, 105, screenX, 395);
  stroke("#60a5fa");
  strokeWeight(1.8);
  line(sunX, sunY - 59, holeX, sunY);
  line(holeX, sunY, screenX, sunY + imageHalf);
  line(sunX, sunY + 59, holeX, sunY);
  line(holeX, sunY, screenX, sunY - imageHalf);
  fill("#f97316");
  noStroke();
  rect(screenX - 4, sunY - imageHalf * progress, 8, imageHalf * 2 * progress, 3);
  rttText("小孔", holeX, 410, "#334155", 12, CENTER);
  rttText("屏幕", screenX, 410, "#334155", 12, CENTER);
  rttText("d / D = " + ratio.toFixed(4), 285, 461, "#0f172a", 15, CENTER);
}

function rttSolarDensityGraph() {
  var imageDistance = rttParam("imageDistance", 1);
  var imageDiameter = rttParam("imageDiameter", 0.0093);
  var currentRatio = imageDistance / imageDiameter;
  var maxRatio = Math.max(250, currentRatio * 1.35);
  var frame = rttGraphFrame("密度尺度因子", "ρ 与 (D/d)³ 成正比", 40, maxRatio, 0, Math.pow(maxRatio, 3) / 1000000, "D / d", "(D/d)³ / 10⁶");
  rttPlot(frame, "#f97316", function (ratio) { return Math.pow(ratio, 3) / 1000000; });
  rttMarker(frame, currentRatio, Math.pow(currentRatio, 3) / 1000000, "#dc2626", "观测值");
}

function rttOrbitTransferScene() {
  var progress = rttProgress();
  var inner = rttParam("innerRadius", 1);
  var outer = Math.max(inner + 0.2, rttParam("outerRadius", 2));
  var cx = 285;
  var cy = 255;
  var r1 = 75;
  var r3 = r1 * outer / inner;
  var x;
  var y;
  var label;
  rttTitle("圆轨道与转移椭圆", "P 点第一次加速，Q 点第二次加速");
  fill("#60a5fa");
  noStroke();
  circle(cx, cy, 64);
  noFill();
  stroke("#94a3b8");
  strokeWeight(1.8);
  circle(cx, cy, r1 * 2);
  circle(cx, cy, r3 * 2);
  stroke("#7c3aed");
  ellipse(cx + (r3 - r1) / 2, cy, r1 + r3, 2 * Math.sqrt(r1 * r3));
  if (progress < 0.2) {
    var angle1 = Math.PI + progress / 0.2 * Math.PI * 2;
    x = cx + r1 * Math.cos(angle1);
    y = cy + r1 * Math.sin(angle1);
    label = "轨道1";
  } else if (progress < 0.75) {
    var ellipseAngle = Math.PI - (progress - 0.2) / 0.55 * Math.PI;
    var a = (r1 + r3) / 2;
    var b = Math.sqrt(r1 * r3);
    x = cx + (r3 - r1) / 2 + a * Math.cos(ellipseAngle);
    y = cy - b * Math.sin(ellipseAngle);
    label = "转移轨道2";
  } else {
    var angle3 = (progress - 0.75) / 0.25 * Math.PI * 2;
    x = cx + r3 * Math.cos(angle3);
    y = cy + r3 * Math.sin(angle3);
    label = "轨道3";
  }
  rttBall(x, y, "#ef4444", "航天器", 18);
  rttText("P", cx - r1 - 12, cy, "#0f172a", 13, CENTER);
  rttText("Q", cx + r3 + 12, cy, "#0f172a", 13, CENTER);
  rttText(label, 285, 463, "#0f172a", 15, CENTER);
}

function rttOrbitTransferGraph() {
  var inner = rttParam("innerRadius", 1);
  var outer = Math.max(inner + 0.2, rttParam("outerRadius", 2));
  var semi = (inner + outer) / 2;
  var frame = rttGraphFrame("轨道速度比较", "单位取 GM=1；椭圆速度用活力公式", inner, outer, 0, 1.3 / Math.sqrt(inner), "r", "v");
  rttPlot(frame, "#2563eb", function (radiusValue) { return Math.sqrt(1 / radiusValue); });
  rttPlot(frame, "#7c3aed", function (radiusValue) { return Math.sqrt(Math.max(0, 2 / radiusValue - 1 / semi)); });
  rttLegend([{ color: "#2563eb", label: "同半径圆轨道" }, { color: "#7c3aed", label: "转移椭圆" }], 742, 112);
}

function rttForceVelocity(which, tau, baseSpeed) {
  if (which === "A") {
    if (tau <= 1) return 2 * baseSpeed * tau;
    if (tau <= 3) return baseSpeed * (3 - tau);
    return 0;
  }
  if (tau <= 4) return baseSpeed * tau / 4;
  if (tau <= 5) return baseSpeed * (5 - tau);
  return 0;
}

function rttForcePosition(which, tau, baseSpeed, baseTime) {
  if (which === "A") {
    if (tau <= 1) return baseSpeed * baseTime * tau * tau;
    if (tau <= 3) return baseSpeed * baseTime * (3 * tau - 0.5 * tau * tau - 1.5);
    return 3 * baseSpeed * baseTime;
  }
  if (tau <= 4) return baseSpeed * baseTime * tau * tau / 8;
  if (tau <= 5) return baseSpeed * baseTime * (5 * tau - 0.5 * tau * tau - 10);
  return 2.5 * baseSpeed * baseTime;
}

function rttForceVtScene() {
  var baseSpeed = rttParam("baseSpeed", 4);
  var baseTime = rttParam("baseTime", 2);
  var tau = rttProgress() * 5;
  var positionA = rttForcePosition("A", tau, baseSpeed, baseTime);
  var positionB = rttForcePosition("B", tau, baseSpeed, baseTime);
  var maxPosition = 3 * baseSpeed * baseTime;
  var xA = 75 + 430 * positionA / maxPosition;
  var xB = 75 + 430 * positionB / maxPosition;
  rttTitle("恒力作用的速度图像", "图像斜率给加速度，面积给位移");
  stroke("#94a3b8");
  strokeWeight(4);
  line(55, 230, 525, 230);
  line(55, 355, 525, 355);
  rttBlock(xA, 205, 54, 32, "#f97316", "A");
  rttBlock(xB, 330, 54, 32, "#2563eb", "B");
  rttArrow(xA, 180, xA + rttForceVelocity("A", tau, baseSpeed) * 8, 180, "#f97316", "vA");
  rttArrow(xB, 305, xB + rttForceVelocity("B", tau, baseSpeed) * 8, 305, "#2563eb", "vB");
  rttText("t / t0 = " + tau.toFixed(2), 285, 425, "#0f172a", 15, CENTER);
  rttText("xA=" + positionA.toFixed(1) + " m，xB=" + positionB.toFixed(1) + " m", 285, 454, "#334155", 14, CENTER);
}

function rttForceVtGraph() {
  var baseSpeed = rttParam("baseSpeed", 4);
  var frame = rttGraphFrame("速度—时间图像", "A 在 3t0 停止，B 在 5t0 停止", 0, 5, 0, 2.2 * baseSpeed, "t / t0", "v / (m·s⁻¹)");
  rttPlot(frame, "#f97316", function (tau) { return rttForceVelocity("A", tau, baseSpeed); });
  rttPlot(frame, "#2563eb", function (tau) { return rttForceVelocity("B", tau, baseSpeed); });
  var tau = rttProgress() * 5;
  rttMarker(frame, tau, rttForceVelocity("A", tau, baseSpeed), "#f97316", "A");
  rttMarker(frame, tau, rttForceVelocity("B", tau, baseSpeed), "#2563eb", "B");
}

function rttConveyorValues() {
  var belt = rttParam("beltSpeed", 5);
  var start = rttParam("startSpeed", 1);
  var end = Math.min(belt - 0.1, Math.max(start + 0.1, rttParam("endSpeed", 3)));
  var delta = end - start;
  var kinetic = 0.5 * (end * end - start * start);
  var heat = Math.max(0, belt - 0.5 * (start + end)) * delta;
  var electric = belt * delta;
  return { belt: belt, start: start, end: end, delta: delta, kinetic: kinetic, heat: heat, electric: electric };
}

function rttConveyorEnergyScene() {
  var values = rttConveyorValues();
  var progress = rttProgress();
  var beltOffset = (progress * values.belt * 45) % 56;
  var blockSpeed = lerp(values.start, values.end, progress);
  var blockX = 110 + 350 * (values.start * progress + 0.5 * values.delta * progress * progress) / Math.max(0.1, values.end);
  rttTitle("传送带能量分配", "电动机功 = 物块动能增加 + 摩擦热");
  fill("#e2e8f0");
  stroke("#64748b");
  strokeWeight(2);
  rect(55, 240, 470, 90, 38);
  for (var x = 70 - beltOffset; x < 540; x += 56) {
    stroke("#94a3b8");
    line(x, 248, x + 22, 268);
  }
  rttBlock(blockX, 220, 48, 38, "#f97316", "物块");
  rttArrow(blockX, 180, blockX + blockSpeed * 13, 180, "#2563eb", "v物");
  rttArrow(110, 360, 110 + values.belt * 20, 360, "#16a34a", "v带");
  rttText("相对滑动仍在发生", 285, 409, "#334155", 14, CENTER);
  rttText("ΔK : Q : E = " + values.kinetic.toFixed(1) + " : " + values.heat.toFixed(1) + " : " + values.electric.toFixed(1), 285, 455, "#0f172a", 15, CENTER);
}

function rttConveyorEnergyGraph() {
  var values = rttConveyorValues();
  var maxValue = Math.max(values.kinetic, values.heat, values.electric) * 1.2;
  var frame = rttGraphFrame("三种能量", "单位质量取 1 kg", 0, 3, 0, maxValue, "能量项", "E / J");
  rttBar(frame, 0, 3, values.kinetic, "#2563eb", "ΔK");
  rttBar(frame, 1, 3, values.heat, "#f97316", "Q");
  rttBar(frame, 2, 3, values.electric, "#16a34a", "电能");
}

function rttGeostationaryScene() {
  var theta = rttParam("viewAngle", 8.7) * Math.PI / 180;
  var progress = rttProgress();
  var cx = 285;
  var cy = 255;
  var earthR = 82;
  var geoR = Math.min(225, earthR / Math.max(0.18, Math.sin(theta)) * 0.48);
  var geoX = cx - geoR;
  var leoR = earthR + 20;
  var leoAngle = progress * Math.PI * 2;
  var leoX = cx + leoR * Math.cos(leoAngle);
  var leoY = cy + leoR * Math.sin(leoAngle);
  var tangentOffset = Math.asin(Math.min(0.98, earthR / geoR));
  rttTitle("卫星张角与信号遮挡", "切线给出 R/r，近地卫星穿过地球背面时失去直视");
  fill("#60a5fa");
  stroke("#1d4ed8");
  strokeWeight(2);
  circle(cx, cy, earthR * 2);
  noFill();
  stroke("#cbd5e1");
  circle(cx, cy, leoR * 2);
  circle(cx, cy, geoR * 2);
  rttBall(geoX, cy, "#7c3aed", "I", 20);
  rttBall(leoX, leoY, "#f97316", "II", 18);
  stroke("#7c3aed");
  strokeWeight(1.5);
  line(geoX, cy, cx + earthR * Math.cos(Math.PI - tangentOffset), cy + earthR * Math.sin(Math.PI - tangentOffset));
  line(geoX, cy, cx + earthR * Math.cos(Math.PI + tangentOffset), cy + earthR * Math.sin(Math.PI + tangentOffset));
  var blocked = leoX > cx && Math.abs(leoY - cy) < earthR;
  rttText(blocked ? "地球遮挡：无法直视" : "卫星间可直视", 285, 458, blocked ? "#dc2626" : "#16a34a", 15, CENTER);
}

function rttGeostationaryGraph() {
  var theta = rttParam("viewAngle", 8.7) * Math.PI / 180;
  var periodRatio = Math.pow(Math.sin(theta), 1.5);
  var accelerationRatio = Math.pow(Math.sin(theta), 2);
  var blockedRatio = (Math.PI + 2 * theta) / (2 * Math.PI);
  var frame = rttGraphFrame("无量纲结果", "均由 sin θ 决定", 0, 3, 0, 1, "物理量", "比例");
  rttBar(frame, 0, 3, accelerationRatio, "#2563eb", "aI/aII");
  rttBar(frame, 1, 3, periodRatio, "#7c3aed", "TII/T0");
  rttBar(frame, 2, 3, blockedRatio, "#dc2626", "遮挡占比");
}

function rttCrossConveyorValues() {
  var belt = rttParam("beltSpeed", 1);
  var friction = rttParam("friction", 0.5);
  var across = 2;
  var relative = Math.sqrt(across * across + belt * belt);
  var stopTime = relative / Math.max(0.1, friction * 10);
  return { belt: belt, friction: friction, across: across, relative: relative, stopTime: stopTime };
}

function rttCrossConveyorPosition(progress) {
  var values = rttCrossConveyorValues();
  var timeValue = progress * values.stopTime;
  var factor = timeValue - timeValue * timeValue / (2 * values.stopTime);
  return {
    x: values.across * factor,
    y: values.belt * timeValue - values.belt * factor,
    time: timeValue,
    values: values
  };
}

function rttCrossConveyorScene() {
  var point = rttCrossConveyorPosition(rttProgress());
  var scaleValue = 520;
  var startX = 115;
  var startY = 365;
  var x = startX + point.y * scaleValue;
  var y = startY - point.x * scaleValue;
  rttTitle("垂直滑上传送带", "摩擦始终与物块相对传送带的速度反向");
  fill("#e0f2fe");
  stroke("#64748b");
  strokeWeight(2);
  quad(70, 390, 435, 95, 525, 170, 160, 465);
  rttArrow(240, 405, 340, 325, "#16a34a", "v带");
  noFill();
  stroke("#2563eb");
  strokeWeight(2.4);
  beginShape();
  for (var index = 0; index <= 100; index += 1) {
    var sample = rttCrossConveyorPosition(rttProgress() * index / 100);
    vertex(startX + sample.y * scaleValue, startY - sample.x * scaleValue);
  }
  endShape();
  rttBlock(x, y, 28, 24, "#f97316", "");
  rttText("横向位移 = " + point.x.toFixed(3) + " m", 285, 462, "#0f172a", 15, CENTER);
}

function rttCrossConveyorGraph() {
  var values = rttCrossConveyorValues();
  var frame = rttGraphFrame("相对速度衰减", "相对速度方向不变、大小线性减小", 0, values.stopTime, 0, values.relative * 1.1, "t / s", "速度 / (m·s⁻¹)");
  rttPlot(frame, "#dc2626", function (timeValue) { return Math.max(0, values.relative - values.friction * 10 * timeValue); });
  rttPlot(frame, "#2563eb", function (timeValue) { return Math.max(0, values.across * (1 - timeValue / values.stopTime)); });
  var timeValue = rttProgress() * values.stopTime;
  rttMarker(frame, timeValue, Math.max(0, values.relative - values.friction * 10 * timeValue), "#dc2626", "|vr|");
  rttLegend([{ color: "#dc2626", label: "相对速率" }, { color: "#2563eb", label: "横向分量" }], 748, 112);
}

function rttGearTurntableScene() {
  var ratio = rttParam("gearRatio", 2);
  var progress = rttProgress();
  var angleA = progress * Math.PI * 8;
  var angleB = -angleA / ratio;
  var ax = 170;
  var bx = 385;
  var cy = 260;
  var rA = 72;
  var rB = rA * ratio;
  rttTitle("齿轮转台拉力", "啮合点线速度相等，转台角速度由齿数比换算");
  noFill();
  stroke("#475569");
  strokeWeight(5);
  circle(ax, cy, rA * 2);
  circle(bx, cy, rB * 2);
  for (var index = 0; index < 12; index += 1) {
    var a1 = angleA + index * Math.PI * 2 / 12;
    line(ax + rA * 0.72 * Math.cos(a1), cy + rA * 0.72 * Math.sin(a1), ax + rA * Math.cos(a1), cy + rA * Math.sin(a1));
  }
  for (var tooth = 0; tooth < 18; tooth += 1) {
    var a2 = angleB + tooth * Math.PI * 2 / 18;
    line(bx + rB * 0.82 * Math.cos(a2), cy + rB * 0.82 * Math.sin(a2), bx + rB * Math.cos(a2), cy + rB * Math.sin(a2));
  }
  rttBall(bx + rB * 0.58 * Math.cos(angleB), cy + rB * 0.58 * Math.sin(angleB), "#f97316", "滑块", 20);
  stroke("#2563eb");
  strokeWeight(2);
  line(bx, cy, bx + rB * 0.58 * Math.cos(angleB), cy + rB * 0.58 * Math.sin(angleB));
  rttText("ωB = ωA / " + ratio.toFixed(2), 285, 457, "#0f172a", 15, CENTER);
}

function rttGearTurntableGraph() {
  var ratio = rttParam("gearRatio", 2);
  var friction = rttParam("friction", 0.3);
  var slope = 1 / (ratio * ratio);
  var intercept = friction * 10;
  var xIntercept = intercept / slope;
  var xMax = xIntercept * 2.1;
  var frame = rttGraphFrame("拉力—主动轮角速度平方", "单位取 m=L=1；负值区实际由摩擦独自供力", 0, xMax, -intercept * 1.15, intercept * 1.25, "ωA²", "F / N");
  rttPlot(frame, "#dc2626", function (omegaSquared) { return slope * omegaSquared - intercept; });
  rttMarker(frame, xIntercept, 0, "#2563eb", "a");
  rttMarker(frame, rttProgress() * xMax, slope * rttProgress() * xMax - intercept, "#dc2626", "当前");
}

function rttCounterweightScene() {
  var progress = rttProgress();
  var distanceValue = rttParam("distance", 3);
  var pulley = { x: 250, y: 115 };
  var rodX = 445;
  var scaleValue = 58;
  var initialDrop = 4 * distanceValue / 3;
  var currentDrop = initialDrop * (1 - progress);
  var slant = Math.sqrt(distanceValue * distanceValue + currentDrop * currentDrop);
  var initialSlant = 5 * distanceValue / 3;
  var basketDrop = initialSlant - slant;
  var ballY = pulley.y + currentDrop * scaleValue;
  var basketY = 175 + basketDrop * scaleValue;
  rttTitle("配重球与缓冲弹簧", "斜绳缩短量等于吊篮下降量");
  noFill();
  stroke("#0f172a");
  strokeWeight(2);
  circle(pulley.x, pulley.y, 38);
  stroke("#64748b");
  strokeWeight(4);
  line(rodX, 85, rodX, 435);
  stroke("#2563eb");
  strokeWeight(2.5);
  line(pulley.x, pulley.y, rodX, ballY);
  line(pulley.x - 19, pulley.y, pulley.x - 19, basketY);
  rttSpring(rodX, 445, rodX, ballY + 13, "#7c3aed");
  rttBall(rodX, ballY, "#f97316", "甲", 24);
  rttBlock(pulley.x - 19, basketY + 20, 55, 40, "#2563eb", "乙");
  rttText("甲上升 " + (initialDrop * progress).toFixed(2) + " m", 285, 462, "#0f172a", 15, CENTER);
}

function rttCounterweightGraph() {
  var frame = rttGraphFrame("弹簧能与两物体机械能", "纵轴以 P 点弹簧势能为 1", 0, 1, 0, 1.08, "甲上升进度", "归一能量");
  rttPlot(frame, "#7c3aed", function (progress) { return Math.pow(2 * progress - 1, 2); });
  rttPlot(frame, "#16a34a", function (progress) { return 1 - Math.pow(2 * progress - 1, 2); });
  var progress = rttProgress();
  rttMarker(frame, progress, Math.pow(2 * progress - 1, 2), "#7c3aed", "弹簧");
  rttLegend([{ color: "#7c3aed", label: "弹簧势能" }, { color: "#16a34a", label: "甲乙机械能增量" }], 738, 112);
}

function rttSemicircleTubeScene() {
  var progress = rttProgress();
  var cx = 350;
  var cy = 285;
  var radius = 118;
  var x;
  var y;
  var phaseLabel;
  rttTitle("半圆管道与斜面正碰", "A 点压力求半径，B-C 抛体方向求出口速度");
  noFill();
  stroke("#64748b");
  strokeWeight(10);
  arc(cx, cy, radius * 2, radius * 2, -Math.PI / 2, Math.PI / 2);
  stroke("#334155");
  strokeWeight(4);
  line(55, cy + radius, cx, cy + radius);
  line(70, 160, 235, 325);
  if (progress < 0.55) {
    var angle = Math.PI / 2 - progress / 0.55 * Math.PI;
    x = cx + radius * Math.cos(angle);
    y = cy + radius * Math.sin(angle);
    phaseLabel = "管内圆周运动";
  } else {
    var q = (progress - 0.55) / 0.45;
    var startX = cx;
    var startY = cy - radius;
    x = startX - 190 * q;
    y = startY + 95 * q * q;
    phaseLabel = "B 点水平抛出";
    noFill();
    stroke("#60a5fa");
    strokeWeight(2);
    beginShape();
    for (var index = 0; index <= 80; index += 1) {
      var s = q * index / 80;
      vertex(startX - 190 * s, startY + 95 * s * s);
    }
    endShape();
  }
  rttBall(x, y, "#f59e0b", "小球", 22);
  rttText("A", cx + 18, cy + radius + 17, "#0f172a", 13, CENTER);
  rttText("B", cx, cy - radius - 18, "#0f172a", 13, CENTER);
  rttText("C", 157, 301, "#0f172a", 13, CENTER);
  rttText(phaseLabel, 285, 459, "#0f172a", 15, CENTER);
}

function rttSemicircleTubeGraph() {
  var entrySpeed = rttParam("entrySpeed", 5);
  var pressure = rttParam("entryPressure", 29);
  var dropHeight = rttParam("dropHeight", 0.05);
  var mass = 0.4;
  var radius = mass * entrySpeed * entrySpeed / Math.max(0.1, pressure - mass * 10);
  var speedB = Math.sqrt(20 * dropHeight);
  var tubeForce = Math.abs(mass * 10 - mass * speedB * speedB / radius);
  var frame = rttGraphFrame("关键位置的力", "A 点支持力与 B 点管道作用力", 0, 2, 0, Math.max(pressure, tubeForce) * 1.18, "位置", "力 / N");
  rttBar(frame, 0, 2, pressure, "#2563eb", "A 点 N");
  rttBar(frame, 1, 2, tubeForce, "#dc2626", "B 点管力");
  rttText("R = " + radius.toFixed(2) + " m，vB = " + speedB.toFixed(2) + " m/s", 796, 448, "#334155", 12, CENTER);
}

function rttRopeBallScene() {
  var progress = rttProgress();
  var handHeight = rttParam("handHeight", 1.6);
  var stage = Math.min(2, Math.floor(progress * 3));
  var local = progress * 3 - stage;
  var hand = { x: 280, y: 170 };
  var x;
  var y;
  var label;
  rttTitle("圆锥摆、松绳与断绳", "三问对应三种不同约束状态");
  stroke("#64748b");
  strokeWeight(3);
  line(45, 430, 530, 430);
  fill("#0f172a");
  noStroke();
  circle(hand.x, hand.y, 13);
  if (stage === 0) {
    var angle = local * Math.PI * 2;
    x = hand.x + 150 * Math.sin(37 * Math.PI / 180) * Math.cos(angle);
    y = hand.y + 150 * Math.cos(37 * Math.PI / 180);
    stroke("#334155");
    strokeWeight(2.5);
    line(hand.x, hand.y, x, y);
    noFill();
    stroke("#93c5fd");
    ellipse(hand.x, y, 2 * 150 * Math.sin(37 * Math.PI / 180), 34);
    label = "阶段1：圆锥摆";
  } else if (stage === 1) {
    var l = 110;
    var timeValue = local * 0.4;
    x = hand.x + 220 * timeValue;
    y = hand.y - l + 1100 * timeValue * timeValue;
    stroke("#94a3b8");
    strokeWeight(1.5);
    drawingContext.setLineDash([5, 5]);
    line(hand.x, hand.y, x, y);
    drawingContext.setLineDash([]);
    label = "阶段2：松绳抛体";
  } else {
    var ropeLength = Math.min(handHeight / 2, 0.8);
    var startY = 430 - (handHeight - ropeLength) * 115;
    x = 170 + 300 * local;
    y = startY + (430 - startY) * local * local;
    rttArrow(170, startY, 260, startY, "#2563eb", "断绳速度");
    label = "阶段3：最低点断绳";
  }
  rttBall(x, y, "#f97316", "小球", 22);
  rttText(label, 285, 462, "#0f172a", 15, CENTER);
}

function rttRopeBallGraph() {
  var handHeight = rttParam("handHeight", 1.6);
  var maxTension = rttParam("maxTension", 12);
  var mass = 0.2;
  var coefficient = 2 * (maxTension - mass * 10) / (mass * 10);
  var xMax = Math.min(handHeight, Math.max(0.2, handHeight * 1.1));
  var frame = rttGraphFrame("断绳后射程平方", "x² = C·l(h-l)，峰值在 l=h/2", 0, xMax, 0, coefficient * handHeight * handHeight / 4 * 1.15, "绳长 l / m", "x² / m²");
  rttPlot(frame, "#7c3aed", function (ropeLength) { return Math.max(0, coefficient * ropeLength * (handHeight - ropeLength)); });
  var optimum = handHeight / 2;
  rttMarker(frame, optimum, coefficient * optimum * (handHeight - optimum), "#dc2626", "最大");
}

function rttToyValues() {
  var mass = rttParam("mass", 1);
  var cruise = rttParam("cruiseSpeed", 6);
  var coast = rttParam("coastTime", 4);
  var resistance = mass * cruise / coast;
  var power = resistance * cruise;
  var b = 2 * resistance / mass;
  var c = -2 * power / mass;
  var start = (-b + Math.sqrt(b * b - 4 * c)) / 2;
  return { mass: mass, cruise: cruise, coast: coast, resistance: resistance, power: power, start: start };
}

function rttToyVelocity(timeValue) {
  var values = rttToyValues();
  if (timeValue <= 2) return values.start * timeValue / 2;
  if (timeValue <= 10) {
    var local = (timeValue - 2) / 8;
    return values.start + (values.cruise - values.start) * (1 - Math.exp(-3.1 * local)) / (1 - Math.exp(-3.1));
  }
  if (timeValue <= 14) return values.cruise;
  if (timeValue <= 14 + values.coast) return values.cruise * (1 - (timeValue - 14) / values.coast);
  return 0;
}

function rttToyDistance(timeValue) {
  var sum = 0;
  var steps = 180;
  var dt = timeValue / steps;
  for (var index = 0; index < steps; index += 1) {
    sum += 0.5 * (rttToyVelocity(index * dt) + rttToyVelocity((index + 1) * dt)) * dt;
  }
  return sum;
}

function rttToyCarScene() {
  var values = rttToyValues();
  var endTime = 14 + values.coast;
  var timeValue = rttProgress() * endTime;
  var distanceValue = rttToyDistance(timeValue);
  var totalDistance = rttToyDistance(endTime);
  var x = 65 + 455 * distanceValue / Math.max(1, totalDistance);
  var speed = rttToyVelocity(timeValue);
  var stage = timeValue < 2 ? "恒力匀加速" : timeValue < 10 ? "恒功率加速" : timeValue < 14 ? "匀速" : "自由滑行";
  rttTitle("玩具车分阶段启动", "恒力、恒功率、匀速、自由滑行四阶段");
  stroke("#64748b");
  strokeWeight(4);
  line(45, 335, 535, 335);
  fill("#2563eb");
  stroke("#1e3a8a");
  rect(x - 30, 290, 60, 33, 6);
  fill("#0f172a");
  circle(x - 18, 327, 13);
  circle(x + 18, 327, 13);
  rttArrow(x, 260, x + speed * 12, 260, "#dc2626", "v");
  rttText(stage, 285, 405, "#0f172a", 16, CENTER);
  rttText("t=" + timeValue.toFixed(1) + " s，v=" + speed.toFixed(2) + " m/s", 285, 454, "#334155", 14, CENTER);
}

function rttToyCarGraph() {
  var values = rttToyValues();
  var endTime = 14 + values.coast;
  var frame = rttGraphFrame("玩具车速度—时间", "2 s 后恒功率阶段斜率逐渐减小", 0, endTime, 0, values.cruise * 1.15, "t / s", "v / (m·s⁻¹)");
  rttPlot(frame, "#2563eb", function (timeValue) { return rttToyVelocity(timeValue); });
  var timeValue = rttProgress() * endTime;
  rttMarker(frame, timeValue, rttToyVelocity(timeValue), "#dc2626", "当前");
}

function rttArcInclinePoint(progress) {
  var friction = rttParam("friction", 0.5);
  var cx = 265;
  var cy = 295;
  var radius = 90;
  var pointB = { x: cx - radius * Math.sin(37 * Math.PI / 180), y: cy + radius * Math.cos(37 * Math.PI / 180) };
  var pointD = { x: cx + radius, y: cy };
  var inclineLength = 245;
  var topA = { x: pointB.x - inclineLength * Math.cos(37 * Math.PI / 180), y: pointB.y - inclineLength * Math.sin(37 * Math.PI / 180) };
  var stopRatio = constrain(1 / (0.6 + 0.8 * friction), 0, 1);
  if (progress < 0.16) {
    var q1 = progress / 0.16;
    return { x: pointD.x, y: 85 + (pointD.y - 85) * q1 * q1, phase: "E→D 自由落体", b: pointB, d: pointD, a: topA, c: { x: cx, y: cy }, r: radius };
  }
  if (progress < 0.44) {
    var q2 = (progress - 0.16) / 0.28;
    var angle = q2 * (Math.PI / 2 + 37 * Math.PI / 180);
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle), phase: "D→C→B 光滑圆弧", b: pointB, d: pointD, a: topA, c: { x: cx, y: cy }, r: radius };
  }
  if (progress < 0.72) {
    var q3 = (progress - 0.44) / 0.28 * stopRatio;
    return { x: lerp(pointB.x, topA.x, q3), y: lerp(pointB.y, topA.y, q3), phase: "沿粗糙斜面上滑", b: pointB, d: pointD, a: topA, c: { x: cx, y: cy }, r: radius };
  }
  if (friction < 0.5) {
    var q4 = (progress - 0.72) / 0.28;
    return { x: topA.x - 110 * q4, y: topA.y - 65 * q4 + 120 * q4 * q4, phase: "越过 A 离开斜面", b: pointB, d: pointD, a: topA, c: { x: cx, y: cy }, r: radius };
  }
  if (friction < 0.75) {
    var q5 = (progress - 0.72) / 0.28;
    var stopX = lerp(pointB.x, topA.x, stopRatio);
    var stopY = lerp(pointB.y, topA.y, stopRatio);
    return { x: lerp(stopX, pointB.x, q5), y: lerp(stopY, pointB.y, q5), phase: "停止后返回 B，继续往复", b: pointB, d: pointD, a: topA, c: { x: cx, y: cy }, r: radius };
  }
  return { x: lerp(pointB.x, topA.x, stopRatio), y: lerp(pointB.y, topA.y, stopRatio), phase: "摩擦足够大，停后不下滑", b: pointB, d: pointD, a: topA, c: { x: cx, y: cy }, r: radius };
}

function rttArcInclineScene() {
  var point = rttArcInclinePoint(rttProgress());
  rttTitle("圆弧斜面往复", "光滑段保能，斜面每次往返按固定比例损失能量");
  stroke("#64748b");
  strokeWeight(8);
  noFill();
  arc(point.c.x, point.c.y, point.r * 2, point.r * 2, 0, Math.PI / 2 + 37 * Math.PI / 180);
  line(point.b.x, point.b.y, point.a.x, point.a.y);
  stroke("#94a3b8");
  strokeWeight(2);
  line(point.d.x, 70, point.d.x, point.d.y);
  rttBall(point.x, point.y, "#f97316", "物块", 22);
  rttText("A", point.a.x - 12, point.a.y - 10, "#0f172a", 13, CENTER);
  rttText("B", point.b.x - 8, point.b.y + 17, "#0f172a", 13, CENTER);
  rttText("C", point.c.x, point.c.y + point.r + 17, "#0f172a", 13, CENTER);
  rttText("D", point.d.x + 14, point.d.y, "#0f172a", 13, CENTER);
  rttText("E", point.d.x + 14, 75, "#0f172a", 13, CENTER);
  rttText(point.phase, 285, 459, "#0f172a", 15, CENTER);
}

function rttArcInclineDistance(friction) {
  if (friction < 0.5) return 4.8;
  if (friction < 0.75) return 6 / Math.max(0.001, friction);
  return 4.8 / (0.6 + 0.8 * friction);
}

function rttArcInclineGraph() {
  var friction = rttParam("friction", 0.5);
  var frame = rttGraphFrame("斜面总路程分段函数", "μ=0.50 与 μ=0.75 是运动阶段改变的边界", 0.1, 1, 0, 13.5, "μ", "x / m");
  rttPlot(frame, "#2563eb", function () { return 4.8; }, 0.1, 0.499, false);
  rttPlot(frame, "#f97316", function (mu) { return 6 / mu; }, 0.5, 0.749, false);
  rttPlot(frame, "#7c3aed", function (mu) { return 4.8 / (0.6 + 0.8 * mu); }, 0.75, 1, false);
  rttMarker(frame, friction, rttArcInclineDistance(friction), "#dc2626", "当前");
}
