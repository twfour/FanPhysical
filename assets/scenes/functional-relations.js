function frVariant() {
  return ((problemDataMap[currentScene] || {}).animation || {}).variant || "";
}

function frParam(key, fallback) {
  return getJsonParam(currentScene, key, fallback);
}

function frTime() {
  return getJsonAnimationState(currentScene).time;
}

function frDuration() {
  return getJsonDuration(currentScene);
}

function frProgress() {
  return constrain(frTime() / Math.max(0.001, frDuration()), 0, 1);
}

function frNumber(value) {
  var absolute = Math.abs(value);
  if (absolute >= 1000) return (value / 1000).toFixed(1) + "k";
  if (absolute >= 100) return value.toFixed(0);
  if (absolute >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

function frText(label, x, y, colorHex, size, alignMode) {
  noStroke();
  fill(colorHex || "#334155");
  textSize(size || 14);
  textAlign(alignMode || LEFT, CENTER);
  text(label, x, y);
}

function frArrow(x1, y1, x2, y2, colorHex, label) {
  var angle = Math.atan2(y2 - y1, x2 - x1);
  var head = 8;
  push();
  stroke(colorHex || "#dc2626");
  strokeWeight(2.3);
  line(x1, y1, x2, y2);
  line(x2, y2, x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
  line(x2, y2, x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
  pop();
  if (label) frText(label, x2 + 7, y2 - 8, colorHex, 13, LEFT);
}

function frGround(y, x1, x2) {
  var left = typeof x1 === "number" ? x1 : 28;
  var right = typeof x2 === "number" ? x2 : 542;
  stroke("#64748b");
  strokeWeight(2);
  line(left, y, right, y);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (var x = left + 8; x < right; x += 18) line(x, y, x - 8, y + 8);
}

function frDrawBelt(x, y, widthValue, heightValue, offset, colorHex) {
  fill(colorHex || "#e2e8f0");
  stroke("#64748b");
  strokeWeight(1.8);
  rect(x, y, widthValue, heightValue, heightValue / 2);
  noFill();
  stroke("#334155");
  circle(x + heightValue / 2, y + heightValue / 2, heightValue * 0.72);
  circle(x + widthValue - heightValue / 2, y + heightValue / 2, heightValue * 0.72);
  for (var i = 0; i < 9; i += 1) {
    var marker = x + 18 + ((i * 52 + offset) % Math.max(20, widthValue - 36));
    stroke("#94a3b8");
    line(marker, y + 6, marker + 16, y + 6);
  }
}

function frAxes(title, xLabel, yLabel, xMin, xMax, yMin, yMax) {
  var frame = { left: 624, right: 970, top: 82, bottom: 430 };
  fill("#ffffff");
  stroke("#cbd5e1");
  strokeWeight(1.2);
  rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  frText(title, 797, 35, "#0f172a", 17, CENTER);
  frText(yLabel, 596, 64, "#475569", 12, CENTER);
  frText(xLabel, 797, 468, "#475569", 12, CENTER);
  stroke("#e2e8f0");
  strokeWeight(1);
  for (var i = 0; i <= 4; i += 1) {
    var px = map(i, 0, 4, frame.left, frame.right);
    var py = map(i, 0, 4, frame.bottom, frame.top);
    line(px, frame.top, px, frame.bottom);
    line(frame.left, py, frame.right, py);
    frText(frNumber(map(i, 0, 4, xMin, xMax)), px, frame.bottom + 18, "#64748b", 11, CENTER);
    frText(frNumber(map(i, 0, 4, yMin, yMax)), frame.left - 10, py, "#64748b", 11, RIGHT);
  }
  frame.xMin = xMin;
  frame.xMax = xMax;
  frame.yMin = yMin;
  frame.yMax = yMax;
  return frame;
}

function frGX(frame, value) {
  return map(value, frame.xMin, frame.xMax, frame.left, frame.right);
}

function frGY(frame, value) {
  return map(value, frame.yMin, frame.yMax, frame.bottom, frame.top);
}

function frPlot(frame, colorHex, valueAt, segments) {
  var count = segments || 140;
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  drawingContext.clip();
  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  beginShape();
  for (var i = 0; i <= count; i += 1) {
    var xValue = map(i, 0, count, frame.xMin, frame.xMax);
    var yValue = valueAt(xValue);
    if (Number.isFinite(yValue)) vertex(frGX(frame, xValue), frGY(frame, yValue));
  }
  endShape();
  drawingContext.restore();
  pop();
}

function frPlotPoints(frame, colorHex, points) {
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  drawingContext.clip();
  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  beginShape();
  for (var i = 0; i < points.length; i += 1) vertex(frGX(frame, points[i][0]), frGY(frame, points[i][1]));
  endShape();
  drawingContext.restore();
  pop();
}

function frMarker(frame, xValue, yValue, colorHex) {
  var x = frGX(frame, constrain(xValue, frame.xMin, frame.xMax));
  var y = frGY(frame, constrain(yValue, frame.yMin, frame.yMax));
  push();
  stroke(colorHex || "#dc2626");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(x, frame.bottom, x, y);
  drawingContext.setLineDash([]);
  noStroke();
  fill(colorHex || "#dc2626");
  circle(x, y, 9);
  pop();
}

function frLegend(items, x, y) {
  for (var i = 0; i < items.length; i += 1) {
    noStroke();
    fill(items[i].color);
    circle(x, y + i * 21, 8);
    frText(items[i].label, x + 10, y + i * 21, "#475569", 12, LEFT);
  }
}

function frEase(value) {
  var p = constrain(value, 0, 1);
  return p * p * (3 - 2 * p);
}

function drawFunctionalRelationModelScene() {
  var variant = frVariant();
  if (variant === "lesson13_conveyor_energy") drawFrConveyorEnergyScene(false);
  else if (variant === "lesson13_skydiving_graph") drawFrSkydivingScene();
  else if (variant === "lesson13_mechanical_energy_graph") drawFrMechanicalGraphScene();
  else if (variant === "lesson13_incline_conveyor_heat") drawFrInclineConveyorScene();
  else if (variant === "lesson13_spring_track_plank") drawFrSpringTrackScene();
  else if (variant === "lesson13_pulley_arc_collision") drawFrPulleyCollisionScene();
  else if (variant === "lesson13_s_curve_road") drawFrSCurveScene();
  else if (variant === "lesson13_spring_pendulum") drawFrSpringPendulumScene();
  else if (variant === "lesson13_block_cart_work") drawFrBlockCartScene();
  else if (variant === "lesson13_conveyor_motor") drawFrConveyorEnergyScene(true);
  else if (variant === "lesson13_vertical_throw_energy_graph") drawFrVerticalThrowScene();
  else if (variant === "lesson13_cross_conveyor_heat") drawFrCrossConveyorScene();
  else if (variant === "lesson13_spring_ring_rod") drawFrSpringRingScene();
  else if (variant === "lesson13_incline_round_trip") drawFrInclineRoundTripScene();
  else if (variant === "lesson13_incline_conveyor_scratch") drawFrInclineScratchScene();
  else if (variant === "lesson13_game_track_range") drawFrGameTrackScene();
}

function drawFunctionalRelationModelGraph() {
  var variant = frVariant();
  if (variant === "lesson13_conveyor_energy") drawFrConveyorEnergyGraph(false);
  else if (variant === "lesson13_skydiving_graph") drawFrSkydivingGraph();
  else if (variant === "lesson13_mechanical_energy_graph") drawFrMechanicalGraphGraph();
  else if (variant === "lesson13_incline_conveyor_heat") drawFrInclineConveyorGraph();
  else if (variant === "lesson13_spring_track_plank") drawFrSpringTrackGraph();
  else if (variant === "lesson13_pulley_arc_collision") drawFrPulleyCollisionGraph();
  else if (variant === "lesson13_s_curve_road") drawFrSCurveGraph();
  else if (variant === "lesson13_spring_pendulum") drawFrSpringPendulumGraph();
  else if (variant === "lesson13_block_cart_work") drawFrBlockCartGraph();
  else if (variant === "lesson13_conveyor_motor") drawFrConveyorEnergyGraph(true);
  else if (variant === "lesson13_vertical_throw_energy_graph") drawFrVerticalThrowGraph();
  else if (variant === "lesson13_cross_conveyor_heat") drawFrCrossConveyorGraph();
  else if (variant === "lesson13_spring_ring_rod") drawFrSpringRingGraph();
  else if (variant === "lesson13_incline_round_trip") drawFrInclineRoundTripGraph();
  else if (variant === "lesson13_incline_conveyor_scratch") drawFrInclineScratchGraph();
  else if (variant === "lesson13_game_track_range") drawFrGameTrackGraph();
}

function drawFrConveyorEnergyScene(showPower) {
  var mass = frParam("mass", 2);
  var mu = frParam("mu", 0.2);
  var beltSpeed = frParam("beltSpeed", 4);
  var g = frParam("g", 10);
  var accel = mu * g;
  var matchTime = beltSpeed / Math.max(0.01, accel);
  var t = frProgress() * matchTime;
  var objectSpeed = accel * t;
  var objectDistance = 0.5 * accel * t * t;
  var endDistance = 0.5 * accel * matchTime * matchTime;
  var blockX = 86 + 345 * objectDistance / Math.max(0.01, endDistance);
  frText(showPower ? "水平传送带：电动机做功" : "水平传送带：能量分配", 28, 30, "#0f172a", 18, LEFT);
  frDrawBelt(48, 300, 482, 62, beltSpeed * t * 55, "#dbeafe");
  fill("#f97316");
  stroke("#c2410c");
  strokeWeight(1.8);
  rect(blockX, 242, 72, 58, 5);
  frArrow(blockX + 35, 232, blockX + 92, 232, "#2563eb", "f");
  frArrow(160, 400, 258, 400, "#0f766e", "v带");
  frGround(420);
  frText("v物 = " + objectSpeed.toFixed(2) + " m/s", 28, 468, "#2563eb", 14, LEFT);
  frText("v带 = " + beltSpeed.toFixed(2) + " m/s", 235, 468, "#0f766e", 14, LEFT);
  frText("f = " + (mu * mass * g).toFixed(1) + " N", 510, 468, "#475569", 13, RIGHT);
}

function drawFrConveyorEnergyGraph(showPower) {
  var mass = frParam("mass", 2);
  var mu = frParam("mu", 0.2);
  var beltSpeed = frParam("beltSpeed", 4);
  var g = frParam("g", 10);
  var accel = mu * g;
  var force = mu * mass * g;
  var matchTime = beltSpeed / Math.max(0.01, accel);
  var maxEnergy = mass * beltSpeed * beltSpeed;
  var frame = frAxes(showPower ? "功与功率随时间" : "电动机功的分配", "t / s", showPower ? "W / J" : "E / J", 0, matchTime, 0, maxEnergy * 1.08);
  frPlot(frame, "#2563eb", function (t) { return 0.5 * mass * Math.pow(accel * t, 2); });
  frPlot(frame, "#dc2626", function (t) { return force * beltSpeed * t; });
  frPlot(frame, "#f59e0b", function (t) { return force * (beltSpeed * t - 0.5 * accel * t * t); });
  frLegend([
    { color: "#dc2626", label: "电动机额外功" },
    { color: "#2563eb", label: "物块动能" },
    { color: "#f59e0b", label: "摩擦生热" }
  ], 790, 112);
  var now = frProgress() * matchTime;
  frMarker(frame, now, force * beltSpeed * now, "#dc2626");
  if (showPower) frText("滑动阶段 P增 = " + (force * beltSpeed).toFixed(1) + " W", 797, 452, "#0f766e", 12, CENTER);
}

function frSkydiverSpeedAtHeight(height, openHeight, terminalSpeed, g) {
  var openSpeed = Math.sqrt(2 * g * openHeight);
  if (height <= openHeight) return Math.sqrt(Math.max(0, 2 * g * height));
  return terminalSpeed + (openSpeed - terminalSpeed) * Math.exp(-(height - openHeight) / Math.max(1, openHeight * 0.32));
}

function drawFrSkydivingScene() {
  var openHeight = frParam("openHeight", 40);
  var terminalSpeed = frParam("terminalSpeed", 8);
  var g = frParam("g", 10);
  var maxHeight = openHeight * 2.1;
  var h = maxHeight * frProgress();
  var y = 72 + 332 * h / maxHeight;
  var speed = frSkydiverSpeedAtHeight(h, openHeight, terminalSpeed, g);
  frText("极限跳伞：开伞前后", 28, 30, "#0f172a", 18, LEFT);
  fill("#eff6ff");
  noStroke();
  rect(60, 58, 430, 368, 8);
  stroke("#94a3b8");
  strokeWeight(1.2);
  drawingContext.setLineDash([4, 4]);
  var openY = 72 + 332 * openHeight / maxHeight;
  line(70, openY, 480, openY);
  drawingContext.setLineDash([]);
  frText("开伞位置", 78, openY - 13, "#64748b", 12, LEFT);
  if (h > openHeight) {
    fill("#dc2626");
    stroke("#991b1b");
    arc(275, y - 46, 94, 55, Math.PI, Math.PI * 2, CHORD);
    stroke("#64748b");
    line(236, y - 43, 266, y - 8);
    line(314, y - 43, 284, y - 8);
  }
  fill("#2563eb");
  stroke("#1d4ed8");
  circle(275, y, 22);
  stroke("#334155");
  line(275, y + 10, 275, y + 38);
  line(275, y + 20, 258, y + 34);
  line(275, y + 20, 292, y + 34);
  line(275, y + 38, 262, y + 57);
  line(275, y + 38, 288, y + 57);
  frArrow(350, y - 8, 350, y + 62, "#2563eb", "v");
  frGround(438, 50, 505);
  frText("h = " + h.toFixed(1) + " m", 28, 470, "#334155", 14, LEFT);
  frText("v = " + speed.toFixed(1) + " m/s", 260, 470, "#2563eb", 14, LEFT);
}

function drawFrSkydivingGraph() {
  var mass = frParam("mass", 70);
  var openHeight = frParam("openHeight", 40);
  var terminalSpeed = frParam("terminalSpeed", 8);
  var g = frParam("g", 10);
  var maxHeight = openHeight * 2.1;
  var maxEk = mass * g * openHeight;
  var frame = frAxes("动能随下落高度变化", "h / m", "Ek / J", 0, maxHeight, 0, maxEk * 1.08);
  frPlot(frame, "#2563eb", function (h) {
    var speed = frSkydiverSpeedAtHeight(h, openHeight, terminalSpeed, g);
    return 0.5 * mass * speed * speed;
  });
  var nowH = maxHeight * frProgress();
  var nowV = frSkydiverSpeedAtHeight(nowH, openHeight, terminalSpeed, g);
  frMarker(frame, nowH, 0.5 * mass * nowV * nowV, "#dc2626");
  frText("开伞", frGX(frame, openHeight), frame.top - 14, "#dc2626", 12, CENTER);
}

function drawFrMechanicalGraphScene() {
  var h0 = frParam("h0", 2);
  var E0 = frParam("E0", 20);
  var h = 2 * h0 * frProgress();
  var y = 420 - 300 * h / (2 * h0);
  frText("竖直恒力上提后撤力", 28, 30, "#0f172a", 18, LEFT);
  frGround(430, 72, 496);
  stroke("#94a3b8");
  strokeWeight(2);
  line(285, 414, 285, 78);
  fill("#f97316");
  stroke("#c2410c");
  rect(250, y - 30, 70, 58, 5);
  frArrow(334, y, 334, y - 72, h <= h0 ? "#2563eb" : "#cbd5e1", h <= h0 ? "F" : "已撤力");
  frArrow(235, y, 235, y + 58, "#dc2626", "mg");
  frText(h <= h0 ? "恒力作用阶段" : "撤力上升阶段", 28, 82, h <= h0 ? "#2563eb" : "#7c3aed", 14, LEFT);
  frText("h = " + h.toFixed(2) + " m", 28, 470, "#334155", 14, LEFT);
  frText("E = " + (h <= h0 ? 5 * E0 * h / h0 : 5 * E0 - E0 * (h - h0) / h0).toFixed(1) + " J", 258, 470, "#dc2626", 14, LEFT);
}

function drawFrMechanicalGraphGraph() {
  var h0 = frParam("h0", 2);
  var E0 = frParam("E0", 20);
  var frame = frAxes("题给机械能—高度图", "h", "E", 0, 2 * h0, 0, 5.5 * E0);
  frPlotPoints(frame, "#ec4899", [[0, 0], [h0, 5 * E0], [2 * h0, 4 * E0]]);
  var h = 2 * h0 * frProgress();
  var energy = h <= h0 ? 5 * E0 * h / h0 : 5 * E0 - E0 * (h - h0) / h0;
  frMarker(frame, h, energy, "#dc2626");
  frText("斜率 F-f", 690, 116, "#2563eb", 12, LEFT);
  frText("斜率 -f", 856, 116, "#7c3aed", 12, LEFT);
}

function drawFrInclineConveyorScene() {
  var lengthValue = frParam("length", 6);
  var beltSpeed = frParam("beltSpeed", 5);
  var travelTime = frParam("travelTime", 2);
  var angle = frParam("angle", 30) * Math.PI / 180;
  var t = travelTime * frProgress();
  var objectDistance = lengthValue * Math.pow(t / Math.max(0.01, travelTime), 2);
  var x1 = 74;
  var y1 = 410;
  var lineLength = 455;
  var x2 = x1 + lineLength * Math.cos(angle);
  var y2 = y1 - lineLength * Math.sin(angle);
  var q = objectDistance / lengthValue;
  var bx = x1 + (x2 - x1) * q;
  var by = y1 + (y2 - y1) * q;
  frText("倾斜传送带：热量与电功", 28, 30, "#0f172a", 18, LEFT);
  stroke("#64748b");
  strokeWeight(20);
  line(x1, y1, x2, y2);
  stroke("#cbd5e1");
  strokeWeight(3);
  for (var i = 0; i < 11; i += 1) {
    var beltQ = ((i / 10) + beltSpeed * t * 0.08) % 1;
    var mx = x1 + (x2 - x1) * beltQ;
    var my = y1 + (y2 - y1) * beltQ;
    line(mx - 6 * Math.sin(angle), my - 6 * Math.cos(angle), mx + 6 * Math.sin(angle), my + 6 * Math.cos(angle));
  }
  push();
  translate(bx, by);
  rotate(-angle);
  fill("#f97316");
  stroke("#c2410c");
  rect(-25, -44, 50, 38, 5);
  pop();
  frArrow(bx, by - 48, bx + 58 * Math.cos(angle), by - 48 - 58 * Math.sin(angle), "#2563eb", "f");
  frText("A", x1 - 18, y1 + 8, "#334155", 13, CENTER);
  frText("B", x2 + 14, y2 - 4, "#334155", 13, CENTER);
  var relative = Math.max(0, beltSpeed * t - objectDistance);
  frText("物块位移 = " + objectDistance.toFixed(2) + " m", 28, 468, "#2563eb", 14, LEFT);
  frText("相对路程 = " + relative.toFixed(2) + " m", 292, 468, "#f59e0b", 14, LEFT);
}

function drawFrInclineConveyorGraph() {
  var force = frParam("friction", 6);
  var lengthValue = frParam("length", 6);
  var beltSpeed = frParam("beltSpeed", 5);
  var travelTime = frParam("travelTime", 2);
  var maxWork = force * beltSpeed * travelTime;
  var frame = frAxes("带面位移、热量与电功", "t / s", "W / J", 0, travelTime, 0, maxWork * 1.08);
  frPlot(frame, "#dc2626", function (t) { return force * beltSpeed * t; });
  frPlot(frame, "#f59e0b", function (t) {
    var objectDistance = lengthValue * Math.pow(t / Math.max(0.01, travelTime), 2);
    return force * Math.max(0, beltSpeed * t - objectDistance);
  });
  frLegend([{ color: "#dc2626", label: "电动机额外功" }, { color: "#f59e0b", label: "摩擦生热" }], 790, 112);
  var now = travelTime * frProgress();
  frMarker(frame, now, force * beltSpeed * now, "#dc2626");
}

function frSpringLine(x1, y1, x2, y2, turns, colorHex) {
  var count = turns || 9;
  var dx = x2 - x1;
  var dy = y2 - y1;
  var lengthValue = Math.sqrt(dx * dx + dy * dy);
  var ux = dx / Math.max(0.001, lengthValue);
  var uy = dy / Math.max(0.001, lengthValue);
  var nx = -uy;
  var ny = ux;
  push();
  noFill();
  stroke(colorHex || "#0f766e");
  strokeWeight(2.2);
  beginShape();
  vertex(x1, y1);
  for (var i = 1; i < count * 2; i += 1) {
    var q = i / (count * 2);
    var amp = i % 2 === 0 ? -7 : 7;
    vertex(x1 + dx * q + nx * amp, y1 + dy * q + ny * amp);
  }
  vertex(x2, y2);
  endShape();
  pop();
}

function frSpringTrackPosition(progress) {
  var p = constrain(progress, 0, 1);
  if (p < 0.14) return { x: map(p, 0, 0.14, 72, 158), y: 362 };
  if (p < 0.34) return { x: map(p, 0.14, 0.34, 158, 300), y: 362 };
  if (p < 0.58) {
    var theta = map(p, 0.34, 0.58, Math.PI / 2, -Math.PI / 2);
    return { x: 322 + 66 * Math.cos(theta), y: 296 + 66 * Math.sin(theta) };
  }
  if (p < 0.72) {
    var thetaSmall = map(p, 0.58, 0.72, -Math.PI / 2, -Math.PI * 3 / 2);
    return { x: 322 + 34 * Math.cos(thetaSmall), y: 264 + 34 * Math.sin(thetaSmall) };
  }
  return { x: map(p, 0.72, 1, 322, 498), y: 298 };
}

function drawFrSpringTrackScene() {
  var p = frProgress();
  var beltSpeed = frParam("beltSpeed", 3.9);
  var ball = frSpringTrackPosition(p);
  frText("弹簧—传送带—双半圆—木板", 20, 28, "#0f172a", 17, LEFT);
  frGround(392, 28, 535);
  stroke("#64748b");
  strokeWeight(3);
  line(45, 362, 158, 362);
  frSpringLine(45, 362, p < 0.14 ? ball.x - 12 : 72, 362, 7, "#0f766e");
  frDrawBelt(150, 344, 156, 36, beltSpeed * frTime() * 28, "#dbeafe");
  noFill();
  stroke("#475569");
  strokeWeight(4);
  arc(322, 296, 132, 132, -Math.PI / 2, Math.PI / 2);
  arc(322, 264, 68, 68, Math.PI / 2, Math.PI * 3 / 2);
  stroke("#64748b");
  line(322, 298, 528, 298);
  fill("#fef3c7");
  stroke("#d97706");
  rect(352, 278, 150, 20, 3);
  fill("#f97316");
  stroke("#c2410c");
  circle(ball.x, ball.y - 10, 22);
  frText("B", 152, 414, "#475569", 12, CENTER);
  frText("C", 300, 414, "#475569", 12, CENTER);
  frText("E", 324, 214, "#475569", 12, CENTER);
  frText("G/H", 320, 318, "#475569", 12, RIGHT);
  frText("u带 = " + beltSpeed.toFixed(2) + " m/s", 26, 466, "#0f766e", 14, LEFT);
  frText(p < 0.34 ? "弹簧与传送带阶段" : (p < 0.72 ? "竖直圆轨道阶段" : "滑上长木板"), 286, 466, "#2563eb", 14, LEFT);
}

function frSpringTrackValues() {
  var energy = frParam("springEnergy", 4.5);
  var beltSpeed = frParam("beltSpeed", 3.9);
  var g = frParam("g", 10);
  var vB = Math.sqrt(Math.max(0, 2 * energy));
  var vC = Math.min(4, Math.max(beltSpeed, Math.sqrt(Math.max(0, vB * vB - 7))));
  var kB = energy;
  var kC = 0.5 * vC * vC;
  var kE = 0.5 * Math.max(0, vC * vC - 4 * g * 0.3);
  var kH = 0.5 * Math.max(0, vC * vC - 4 * g * 0.15);
  var kFinal = Math.max(0, vC * vC - 4 * g * 0.15) / 4;
  return [kB, kC, kE, kH, kFinal];
}

function drawFrSpringTrackGraph() {
  var values = frSpringTrackValues();
  var maxEnergy = Math.max(5, values[0], values[1]) * 1.18;
  var frame = frAxes("各关键点动能", "过程节点", "Ek / J", 0, 4, 0, maxEnergy);
  frPlotPoints(frame, "#2563eb", [[0, values[0]], [1, values[1]], [2, values[2]], [3, values[3]], [4, values[4]]]);
  var labels = ["B", "C", "E", "H", "共速"];
  for (var i = 0; i < labels.length; i += 1) frText(labels[i], frGX(frame, i), frame.bottom + 38, "#475569", 11, CENTER);
  var stage = 4 * frProgress();
  var index = Math.min(3, Math.floor(stage));
  var local = stage - index;
  var value = values[index] + (values[index + 1] - values[index]) * local;
  frMarker(frame, stage, value, "#dc2626");
}

function frPulleyBallPosition(progress) {
  var p = constrain(progress, 0, 1);
  var E = { x: 430, y: 374 };
  var D = { x: 372, y: 350 };
  var C = { x: 174, y: 260 };
  if (p < 0.25) return { x: map(p, 0, 0.25, 530, E.x), y: E.y };
  if (p < 0.5) {
    var theta = map(p, 0.25, 0.5, Math.PI / 2, Math.PI / 2 + 37 * Math.PI / 180);
    return { x: 430 + 95 * Math.cos(theta), y: 279 + 95 * Math.sin(theta) };
  }
  if (p < 0.7) {
    var q = map(p, 0.5, 0.7, 0, 1);
    return { x: D.x + (C.x - D.x) * q, y: D.y - (D.y - C.y) * (2 * q - q * q) };
  }
  var rise = frEase(map(p, 0.7, 1, 0, 1));
  return { x: C.x + (92 - C.x) * rise, y: C.y + (230 - C.y) * rise };
}

function drawFrPulleyCollisionScene() {
  var p = frProgress();
  var moving = frPulleyBallPosition(p);
  var pulleyX = p < 0.7 ? 174 : moving.x;
  var pulleyY = p < 0.7 ? 260 : moving.y;
  frText("动滑轮、圆弧、斜抛与碰撞", 20, 28, "#0f172a", 17, LEFT);
  fill("#334155");
  noStroke();
  rect(70, 62, 38, 12);
  rect(244, 92, 38, 12);
  frText("A", 88, 52, "#334155", 12, CENTER);
  frText("B", 262, 82, "#334155", 12, CENTER);
  stroke("#475569");
  strokeWeight(2);
  line(89, 74, pulleyX, pulleyY);
  line(263, 104, pulleyX, pulleyY);
  fill("#dbeafe");
  stroke("#2563eb");
  circle(pulleyX, pulleyY, 22);
  rect(pulleyX - 18, pulleyY + 11, 36, 32, 4);
  noFill();
  stroke("#475569");
  strokeWeight(4);
  arc(430, 279, 190, 190, Math.PI / 2, Math.PI / 2 + 37 * Math.PI / 180);
  frGround(374, 340, 545);
  stroke("#94a3b8");
  strokeWeight(1.2);
  drawingContext.setLineDash([4, 4]);
  beginShape();
  for (var i = 0; i <= 24; i += 1) {
    var q = i / 24;
    vertex(372 + (174 - 372) * q, 350 - (350 - 260) * (2 * q - q * q));
  }
  endShape();
  drawingContext.setLineDash([]);
  fill(p >= 0.7 ? "#7c3aed" : "#f97316");
  stroke(p >= 0.7 ? "#5b21b6" : "#c2410c");
  circle(moving.x, moving.y, 20);
  frText("D", 361, 338, "#475569", 12, CENTER);
  frText("E", 430, 394, "#475569", 12, CENTER);
  frText(p < 0.25 ? "粗糙水平面减速" : (p < 0.5 ? "光滑圆弧上升" : (p < 0.7 ? "斜抛到最高点 C" : "碰后滑轮上移")), 24, 465, "#2563eb", 14, LEFT);
}

function drawFrPulleyCollisionGraph() {
  var initialSpeed = frParam("initialSpeed", 13);
  var mass = 2;
  var initialK = 0.5 * mass * initialSpeed * initialSpeed;
  var scale = initialK / 169;
  var points = [[0, initialK], [1, 144 * scale], [2, 100 * scale], [3, 64 * scale], [4, 32 * scale], [5, 0]];
  var frame = frAxes("关键阶段动能", "阶段", "Ek / J", 0, 5, 0, initialK * 1.08);
  frPlotPoints(frame, "#2563eb", points);
  var labels = ["初始", "E", "D", "最高点", "碰后", "停止"];
  for (var i = 0; i < labels.length; i += 1) frText(labels[i], frGX(frame, i), frame.bottom + 37, "#475569", 10, CENTER);
  var stage = 5 * frProgress();
  var index = Math.min(4, Math.floor(stage));
  var local = stage - index;
  var value = points[index][1] + (points[index + 1][1] - points[index][1]) * local;
  frMarker(frame, stage, value, "#dc2626");
}

function frSCurvePosition(progress) {
  var p = constrain(progress, 0, 1);
  if (p < 0.34) {
    var q1 = p / 0.34;
    return { x: bezierPoint(74, 42, 148, 210, q1), y: bezierPoint(360, 260, 242, 300, q1), angle: -0.25 };
  }
  if (p < 0.66) {
    var q2 = (p - 0.34) / 0.32;
    return { x: 210 + (356 - 210) * q2, y: 300 + (180 - 300) * q2, angle: -0.69 };
  }
  var q3 = (p - 0.66) / 0.34;
  return { x: bezierPoint(356, 424, 520, 492, q3), y: bezierPoint(180, 116, 128, 196, q3), angle: 0.25 };
}

function drawFrSCurveScene() {
  var car = frSCurvePosition(frProgress());
  frText("S 形盘山公路", 26, 28, "#0f172a", 18, LEFT);
  noFill();
  stroke("#cbd5e1");
  strokeWeight(32);
  bezier(74, 360, 42, 260, 148, 242, 210, 300);
  line(210, 300, 356, 180);
  bezier(356, 180, 424, 116, 520, 128, 492, 196);
  stroke("#64748b");
  strokeWeight(2);
  drawingContext.setLineDash([8, 7]);
  bezier(74, 360, 42, 260, 148, 242, 210, 300);
  line(210, 300, 356, 180);
  bezier(356, 180, 424, 116, 520, 128, 492, 196);
  drawingContext.setLineDash([]);
  push();
  translate(car.x, car.y);
  rotate(car.angle);
  fill("#2563eb");
  stroke("#1d4ed8");
  rect(-22, -12, 44, 24, 5);
  fill("#0f172a");
  noStroke();
  circle(-14, 14, 8);
  circle(14, 14, 8);
  pop();
  frText("弯道 1", 62, 416, "#475569", 13, LEFT);
  frText("上坡直道", 244, 254, "#475569", 13, LEFT);
  frText("弯道 2", 438, 82, "#475569", 13, LEFT);
  var r1 = frParam("radius1", 10);
  var r2 = frParam("radius2", 20);
  var ratio = frParam("frictionRatio", 1.25);
  var g = frParam("g", 10);
  frText("v1,max = " + Math.sqrt(ratio * g * r1).toFixed(2) + " m/s", 24, 466, "#2563eb", 14, LEFT);
  frText("v2,max = " + Math.sqrt(ratio * g * r2).toFixed(2) + " m/s", 284, 466, "#7c3aed", 14, LEFT);
}

function drawFrSCurveGraph() {
  var r1 = frParam("radius1", 10);
  var r2 = frParam("radius2", 20);
  var ratio = frParam("frictionRatio", 1.25);
  var g = frParam("g", 10);
  var maxR = Math.max(30, r2 * 1.25);
  var maxV = Math.sqrt(ratio * g * maxR);
  var frame = frAxes("水平弯道允许速度", "r / m", "vmax / (m/s)", 0, maxR, 0, maxV * 1.08);
  frPlot(frame, "#2563eb", function (r) { return Math.sqrt(Math.max(0, ratio * g * r)); });
  var nowR = r1 + (r2 - r1) * frProgress();
  frMarker(frame, nowR, Math.sqrt(ratio * g * nowR), "#dc2626");
  frText("vmax = √(1.25gr)", 797, 112, "#0f766e", 12, CENTER);
}

function drawFrSpringPendulumScene() {
  var p = frEase(frProgress());
  var theta = p * Math.PI / 2;
  var ox = 174;
  var oy = 112;
  var radius = 154 + 35 * Math.sin(theta);
  var bx = ox + radius * Math.cos(theta);
  var by = oy + radius * Math.sin(theta);
  frText("弹簧摆：重力势能的分流", 26, 28, "#0f172a", 18, LEFT);
  fill("#334155");
  noStroke();
  rect(140, 72, 68, 16);
  frSpringLine(ox, oy, bx, by, 11, "#0f766e");
  stroke("#94a3b8");
  strokeWeight(1.2);
  drawingContext.setLineDash([4, 4]);
  noFill();
  arc(ox, oy, 330, 330, 0, Math.PI / 2);
  drawingContext.setLineDash([]);
  fill("#f97316");
  stroke("#c2410c");
  circle(bx, by, 28);
  frArrow(bx, by + 18, bx, by + 78, "#dc2626", "mg");
  frText("A", ox + 175, oy - 15, "#475569", 13, CENTER);
  frText("B", ox - 18, oy + 202, "#475569", 13, CENTER);
  frGround(430, 42, 520);
  frText("下降比例 = " + (100 * p).toFixed(0) + "%", 26, 468, "#334155", 14, LEFT);
  frText("弹簧伸长，弹性势能增加", 278, 468, "#0f766e", 14, LEFT);
}

function frSpringPendulumEnergies(q) {
  var mass = frParam("mass", 1);
  var lengthValue = frParam("naturalLength", 1.2);
  var k = frParam("k", 18);
  var g = frParam("g", 10);
  var gravitational = mass * g * lengthValue * q;
  var extension = 0.28 * lengthValue * q;
  var elastic = Math.min(gravitational * 0.82, 0.5 * k * extension * extension);
  return { gravitational: gravitational, elastic: elastic, kinetic: Math.max(0, gravitational - elastic) };
}

function drawFrSpringPendulumGraph() {
  var maxValues = frSpringPendulumEnergies(1);
  var maxEnergy = Math.max(1, maxValues.gravitational) * 1.08;
  var frame = frAxes("A 到 B 的能量转化", "过程", "E / J", 0, 1, 0, maxEnergy);
  frPlot(frame, "#dc2626", function (q) { return frSpringPendulumEnergies(q).gravitational; });
  frPlot(frame, "#0f766e", function (q) { return frSpringPendulumEnergies(q).elastic; });
  frPlot(frame, "#2563eb", function (q) { return frSpringPendulumEnergies(q).kinetic; });
  frLegend([
    { color: "#dc2626", label: "重力势能减少" },
    { color: "#0f766e", label: "弹性势能" },
    { color: "#2563eb", label: "动能" }
  ], 790, 112);
  var now = frEase(frProgress());
  frMarker(frame, now, frSpringPendulumEnergies(now).gravitational, "#dc2626");
}

function frBlockCartValues() {
  var mass = frParam("mass", 1);
  var mu = frParam("mu", 0.25);
  var force = frParam("force", 8);
  var g = frParam("g", 10);
  var friction = mu * mass * g;
  var blockAccel = Math.max(0.2, (force - friction) / mass);
  var cartAccel = friction / (2 * mass);
  var relativeAccel = Math.max(0.1, blockAccel - cartAccel);
  return { mass: mass, friction: friction, blockAccel: blockAccel, cartAccel: cartAccel, relativeAccel: relativeAccel };
}

function drawFrBlockCartScene() {
  var lengthValue = frParam("length", 4);
  var values = frBlockCartValues();
  var endTime = Math.sqrt(2 * lengthValue / values.relativeAccel);
  var t = endTime * frProgress();
  var cartDistance = 0.5 * values.cartAccel * t * t;
  var relativeDistance = 0.5 * values.relativeAccel * t * t;
  var cartX = 54 + 80 * cartDistance / Math.max(0.01, 0.5 * values.cartAccel * endTime * endTime);
  var widthValue = 390;
  var blockX = cartX + 10 + (widthValue - 76) * relativeDistance / lengthValue;
  frText("滑块—小车：对地与相对位移", 24, 28, "#0f172a", 17, LEFT);
  frGround(398, 30, 535);
  fill("#e2e8f0");
  stroke("#64748b");
  rect(cartX, 310, widthValue, 65, 5);
  fill("#334155");
  noStroke();
  circle(cartX + 75, 386, 26);
  circle(cartX + widthValue - 75, 386, 26);
  fill("#f97316");
  stroke("#c2410c");
  rect(blockX, 258, 62, 52, 5);
  frArrow(blockX + 30, 246, blockX + 100, 246, "#dc2626", "F");
  frArrow(blockX + 20, 324, blockX - 35, 324, "#2563eb", "f");
  frText("车位移 x = " + cartDistance.toFixed(2) + " m", 24, 468, "#0f766e", 14, LEFT);
  frText("相对位移 = " + relativeDistance.toFixed(2) + " m", 280, 468, "#2563eb", 14, LEFT);
}

function drawFrBlockCartGraph() {
  var lengthValue = frParam("length", 4);
  var force = frParam("force", 8);
  var values = frBlockCartValues();
  var endTime = Math.sqrt(2 * lengthValue / values.relativeAccel);
  var endCart = 0.5 * values.cartAccel * endTime * endTime;
  var maxEnergy = force * (lengthValue + endCart);
  var frame = frAxes("功与相对位移", "s相 / m", "W / J", 0, lengthValue, 0, maxEnergy * 1.08);
  frPlot(frame, "#dc2626", function (s) {
    var xCart = values.cartAccel / values.relativeAccel * s;
    return force * (s + xCart);
  });
  frPlot(frame, "#f59e0b", function (s) { return values.friction * s; });
  frPlot(frame, "#0f766e", function (s) {
    var xCart = values.cartAccel / values.relativeAccel * s;
    return values.friction * xCart;
  });
  frLegend([
    { color: "#dc2626", label: "外力做功" },
    { color: "#f59e0b", label: "摩擦生热" },
    { color: "#0f766e", label: "小车动能" }
  ], 790, 112);
  var now = lengthValue * frProgress() * frProgress();
  var nowCart = values.cartAccel / values.relativeAccel * now;
  frMarker(frame, now, force * (now + nowCart), "#dc2626");
}

function frVerticalThrowValues() {
  var initialEnergy = frParam("initialEnergy", 100);
  var mass = frParam("mass", 2);
  var drag = frParam("drag", 5);
  var g = frParam("g", 10);
  var initialSpeed = Math.sqrt(2 * initialEnergy / mass);
  var maxHeight = initialEnergy / Math.max(0.1, mass * g + drag);
  return { initialEnergy: initialEnergy, mass: mass, drag: drag, g: g, initialSpeed: initialSpeed, maxHeight: maxHeight };
}

function drawFrVerticalThrowScene() {
  var values = frVerticalThrowValues();
  var p = frProgress();
  var h = values.maxHeight * (2 * p - p * p);
  var speed = values.initialSpeed * (1 - p);
  var y = 418 - 300 * h / Math.max(0.1, values.maxHeight);
  frText("有恒定空气阻力的竖直上抛", 24, 28, "#0f172a", 17, LEFT);
  frGround(430, 60, 505);
  stroke("#cbd5e1");
  strokeWeight(2);
  line(278, 414, 278, 78);
  fill("#f97316");
  stroke("#c2410c");
  circle(278, y, 30);
  frArrow(278, y - 22, 278, y - 86, "#2563eb", "v");
  frArrow(240, y + 8, 240, y + 68, "#dc2626", "mg+f");
  frText("h = " + h.toFixed(2) + " m", 24, 468, "#334155", 14, LEFT);
  frText("v = " + speed.toFixed(2) + " m/s", 226, 468, "#2563eb", 14, LEFT);
  frText("f = " + values.drag.toFixed(1) + " N", 480, 468, "#dc2626", 14, RIGHT);
}

function drawFrVerticalThrowGraph() {
  var values = frVerticalThrowValues();
  var frame = frAxes("机械能、势能与动能", "h / m", "E / J", 0, values.maxHeight, 0, values.initialEnergy * 1.08);
  frPlot(frame, "#dc2626", function (h) { return values.initialEnergy - values.drag * h; });
  frPlot(frame, "#0f766e", function (h) { return values.mass * values.g * h; });
  frPlot(frame, "#2563eb", function (h) { return values.initialEnergy - (values.mass * values.g + values.drag) * h; });
  frLegend([
    { color: "#dc2626", label: "机械能" },
    { color: "#0f766e", label: "重力势能" },
    { color: "#2563eb", label: "动能" }
  ], 790, 112);
  var p = frProgress();
  var h = values.maxHeight * (2 * p - p * p);
  frMarker(frame, h, values.initialEnergy - values.drag * h, "#dc2626");
}

function frCrossValues() {
  var vx = frParam("vx", 0.6);
  var beltSpeed = frParam("beltSpeed", 0.8);
  var mu = frParam("mu", 0.2);
  var g = frParam("g", 10);
  var relativeSpeed = Math.sqrt(vx * vx + beltSpeed * beltSpeed);
  var accel = mu * g;
  var stopTime = relativeSpeed / Math.max(0.01, accel);
  return { vx: vx, beltSpeed: beltSpeed, relativeSpeed: relativeSpeed, accel: accel, stopTime: stopTime };
}

function frCrossPositionAt(timeValue) {
  var values = frCrossValues();
  var t = constrain(timeValue, 0, values.stopTime);
  var factor = t - 0.5 * values.accel * t * t / Math.max(0.01, values.relativeSpeed);
  return { x: values.vx * factor, y: values.beltSpeed * t - values.beltSpeed * factor };
}

function drawFrCrossConveyorScene() {
  var values = frCrossValues();
  var t = values.stopTime * frProgress();
  var pos = frCrossPositionAt(t);
  var maxRelative = values.relativeSpeed * values.relativeSpeed / (2 * values.accel);
  var scale = 155 / Math.max(0.1, maxRelative);
  var startX = 320;
  var startY = 392;
  frText("垂直传送带：相对速度矢量", 24, 28, "#0f172a", 17, LEFT);
  fill("#dbeafe");
  stroke("#64748b");
  strokeWeight(2);
  rect(224, 68, 212, 350, 12);
  for (var i = 0; i < 9; i += 1) {
    var markerY = 92 + ((i * 44 - values.beltSpeed * t * 80 + 350) % 350);
    stroke("#94a3b8");
    line(240, markerY, 266, markerY);
  }
  noFill();
  stroke("#f59e0b");
  strokeWeight(2.3);
  beginShape();
  for (var j = 0; j <= 40; j += 1) {
    var sample = t * j / 40;
    var point = frCrossPositionAt(sample);
    vertex(startX + point.x * scale, startY - point.y * scale);
  }
  endShape();
  fill("#111827");
  stroke("#0f172a");
  circle(startX + pos.x * scale, startY - pos.y * scale, 22);
  frArrow(458, 350, 458, 270, "#0f766e", "v带");
  frArrow(startX, startY + 38, startX + 76, startY + 38, "#2563eb", "vM");
  frText("相对速度 = " + Math.max(0, values.relativeSpeed - values.accel * t).toFixed(2) + " m/s", 24, 468, "#2563eb", 14, LEFT);
  frText("划痕为直线", 374, 468, "#f59e0b", 14, LEFT);
}

function drawFrCrossConveyorGraph() {
  var values = frCrossValues();
  var maxRelative = values.relativeSpeed * values.relativeSpeed / (2 * values.accel);
  var maxY = Math.max(values.relativeSpeed, maxRelative) * 1.12;
  var frame = frAxes("相对速度与相对路程", "t / s", "相对量", 0, values.stopTime, 0, maxY);
  frPlot(frame, "#2563eb", function (t) { return Math.max(0, values.relativeSpeed - values.accel * t); });
  frPlot(frame, "#f59e0b", function (t) { return values.relativeSpeed * t - 0.5 * values.accel * t * t; });
  frLegend([{ color: "#2563eb", label: "相对速度 / (m/s)" }, { color: "#f59e0b", label: "相对路程 / m" }], 790, 112);
  var now = values.stopTime * frProgress();
  frMarker(frame, now, Math.max(0, values.relativeSpeed - values.accel * now), "#dc2626");
}

function drawFrSpringRingScene() {
  var p = frProgress();
  var down = p <= 0.5;
  var q = down ? frEase(p * 2) : 1 - frEase((p - 0.5) * 2);
  var rodX = 342;
  var yA = 112;
  var yC = 400;
  var y = yA + (yC - yA) * q;
  frText("粗糙竖杆上的弹簧圆环", 24, 28, "#0f172a", 18, LEFT);
  stroke("#475569");
  strokeWeight(5);
  line(rodX, 72, rodX, 430);
  fill("#334155");
  noStroke();
  rect(58, 86, 24, 54);
  frSpringLine(82, 112, rodX - 16, y, 12, "#0f766e");
  noFill();
  stroke("#f97316");
  strokeWeight(7);
  circle(rodX, y, 28);
  frArrow(390, y - 4, 390, y + 62, "#dc2626", "mg");
  frText("A", rodX + 22, yA, "#475569", 13, LEFT);
  frText("B", rodX + 22, 255, "#475569", 13, LEFT);
  frText("C", rodX + 22, yC, "#475569", 13, LEFT);
  var mass = frParam("mass", 1);
  var launchSpeed = frParam("launchSpeed", 6);
  var singleHeat = 0.25 * mass * launchSpeed * launchSpeed;
  frText(down ? "A → C 下滑" : "C → A 上滑", 24, 468, down ? "#2563eb" : "#7c3aed", 14, LEFT);
  frText("单程热量 = " + singleHeat.toFixed(2) + " J", 292, 468, "#f59e0b", 14, LEFT);
}

function drawFrSpringRingGraph() {
  var mass = frParam("mass", 1);
  var launchSpeed = frParam("launchSpeed", 6);
  var heat = 0.25 * mass * launchSpeed * launchSpeed;
  var frame = frAxes("同一位置上下行机械能", "下移比例", "E / J", 0, 1, -heat * 1.25, heat * 1.25);
  frPlot(frame, "#2563eb", function (q) { return -heat * q; });
  frPlot(frame, "#7c3aed", function (q) { return heat * q; });
  frLegend([{ color: "#2563eb", label: "下滑" }, { color: "#7c3aed", label: "上滑" }], 790, 112);
  var p = frProgress();
  var down = p <= 0.5;
  var q = down ? frEase(p * 2) : 1 - frEase((p - 0.5) * 2);
  frMarker(frame, q, (down ? -1 : 1) * heat * q, down ? "#2563eb" : "#7c3aed");
}

function frInclineRoundValues() {
  var initialSpeed = frParam("initialSpeed", 20);
  var mu = frParam("mu", 0.5);
  var angle = frParam("angle", 36.87) * Math.PI / 180;
  var g = frParam("g", 10);
  var upAccel = g * (Math.sin(angle) + mu * Math.cos(angle));
  var downAccel = Math.max(0.1, g * (Math.sin(angle) - mu * Math.cos(angle)));
  var upTime = initialSpeed / upAccel;
  var upDistance = initialSpeed * initialSpeed / (2 * upAccel);
  var downTime = Math.sqrt(2 * upDistance / downAccel);
  return { initialSpeed: initialSpeed, mu: mu, angle: angle, g: g, upAccel: upAccel, downAccel: downAccel, upTime: upTime, upDistance: upDistance, downTime: downTime, totalTime: upTime + downTime };
}

function frInclineRoundState(timeValue) {
  var values = frInclineRoundValues();
  var t = constrain(timeValue, 0, values.totalTime);
  if (t <= values.upTime) {
    return { s: values.initialSpeed * t - 0.5 * values.upAccel * t * t, v: values.initialSpeed - values.upAccel * t, path: values.initialSpeed * t - 0.5 * values.upAccel * t * t };
  }
  var td = t - values.upTime;
  var downDistance = 0.5 * values.downAccel * td * td;
  return { s: Math.max(0, values.upDistance - downDistance), v: -values.downAccel * td, path: values.upDistance + downDistance };
}

function drawFrInclineRoundTripScene() {
  var values = frInclineRoundValues();
  var physicalTime = values.totalTime * frProgress();
  var state = frInclineRoundState(physicalTime);
  var x1 = 76;
  var y1 = 412;
  var lengthPx = 455;
  var x2 = x1 + lengthPx * Math.cos(values.angle);
  var y2 = y1 - lengthPx * Math.sin(values.angle);
  var q = state.s / Math.max(0.1, values.upDistance);
  var bx = x1 + (x2 - x1) * q;
  var by = y1 + (y2 - y1) * q;
  frText("粗糙斜面往返", 26, 28, "#0f172a", 18, LEFT);
  fill("#eff6ff");
  stroke("#64748b");
  strokeWeight(2);
  triangle(x1, y1, x2, y2, x2, y1);
  push();
  translate(bx, by);
  rotate(-values.angle);
  fill("#f97316");
  stroke("#c2410c");
  rect(-24, -42, 48, 38, 5);
  pop();
  frArrow(bx, by - 50, bx + (state.v >= 0 ? 60 : -60) * Math.cos(values.angle), by - 50 - (state.v >= 0 ? 60 : -60) * Math.sin(values.angle), "#2563eb", "v");
  frText("t = " + physicalTime.toFixed(2) + " s", 26, 468, "#334155", 14, LEFT);
  frText("斜面位置 = " + state.s.toFixed(2) + " m", 226, 468, "#2563eb", 14, LEFT);
}

function drawFrInclineRoundTripGraph() {
  var values = frInclineRoundValues();
  var mass = 1;
  var friction = values.mu * mass * values.g * Math.cos(values.angle);
  var maxEnergy = 0.5 * mass * values.initialSpeed * values.initialSpeed;
  var frame = frAxes("往返过程能量", "t / s", "E / J", 0, values.totalTime, 0, maxEnergy * 1.08);
  frPlot(frame, "#2563eb", function (t) { var s = frInclineRoundState(t); return 0.5 * mass * s.v * s.v; });
  frPlot(frame, "#0f766e", function (t) { var s = frInclineRoundState(t); return mass * values.g * Math.sin(values.angle) * s.s; });
  frPlot(frame, "#f59e0b", function (t) { var s = frInclineRoundState(t); return friction * s.path; });
  frLegend([
    { color: "#2563eb", label: "动能" },
    { color: "#0f766e", label: "重力势能" },
    { color: "#f59e0b", label: "累计热量" }
  ], 790, 112);
  var now = values.totalTime * frProgress();
  var state = frInclineRoundState(now);
  frMarker(frame, now, 0.5 * mass * state.v * state.v, "#dc2626");
}

function frInclineScratchValues(speedValue) {
  var beltSpeed = typeof speedValue === "number" ? speedValue : frParam("beltSpeed", 10);
  var lengthValue = frParam("length", 16);
  var mu = frParam("mu", 0.5);
  var angle = frParam("angle", 36.87) * Math.PI / 180;
  var g = frParam("g", 10);
  var accel = g * (Math.sin(angle) + mu * Math.cos(angle));
  var reachTime = beltSpeed / Math.max(0.01, accel);
  var reachDistance = beltSpeed * beltSpeed / (2 * Math.max(0.01, accel));
  var totalTime;
  if (reachDistance >= lengthValue) totalTime = Math.sqrt(2 * lengthValue / accel);
  else totalTime = reachTime + (lengthValue - reachDistance) / Math.max(0.01, beltSpeed);
  return { beltSpeed: beltSpeed, length: lengthValue, angle: angle, accel: accel, reachTime: reachTime, reachDistance: reachDistance, totalTime: totalTime };
}

function drawFrInclineScratchScene() {
  var values = frInclineScratchValues();
  var t = values.totalTime * frProgress();
  var objectDistance = t <= values.reachTime ? 0.5 * values.accel * t * t : values.reachDistance + values.beltSpeed * (t - values.reachTime);
  objectDistance = Math.min(values.length, objectDistance);
  var relative = Math.max(0, values.beltSpeed * Math.min(t, values.reachTime) - Math.min(objectDistance, values.reachDistance));
  var x1 = 72;
  var y1 = 420;
  var lineLength = 450;
  var x2 = x1 + lineLength * Math.cos(values.angle);
  var y2 = y1 - lineLength * Math.sin(values.angle);
  var q = objectDistance / values.length;
  var bx = x2 + (x1 - x2) * q;
  var by = y2 + (y1 - y2) * q;
  frText("倾斜传送带煤块划痕", 24, 28, "#0f172a", 18, LEFT);
  stroke("#64748b");
  strokeWeight(20);
  line(x1, y1, x2, y2);
  stroke("#111827");
  strokeWeight(3);
  var traceEndQ = Math.min(q, values.reachDistance / values.length);
  line(x2, y2, x2 + (x1 - x2) * traceEndQ, y2 + (y1 - y2) * traceEndQ);
  push();
  translate(bx, by);
  rotate(-values.angle);
  fill("#111827");
  stroke("#0f172a");
  rect(-22, -40, 44, 36, 4);
  pop();
  frArrow(410, 118, 342, 160, "#0f766e", "v带");
  frText("时间 = " + t.toFixed(2) + " s", 24, 468, "#334155", 14, LEFT);
  frText("相对划痕 = " + relative.toFixed(2) + " m", 258, 468, "#f59e0b", 14, LEFT);
}

function drawFrInclineScratchGraph() {
  var selected = frInclineScratchValues();
  var maxSpeed = Math.max(22, selected.beltSpeed * 1.3);
  var maxTime = frInclineScratchValues(1).totalTime;
  var frame = frAxes("总用时随带速变化", "u / (m/s)", "T / s", 1, maxSpeed, 0, maxTime * 1.05);
  frPlot(frame, "#2563eb", function (u) { return frInclineScratchValues(u).totalTime; });
  frMarker(frame, selected.beltSpeed, selected.totalTime, "#dc2626");
  var optimal = Math.sqrt(2 * selected.accel * selected.length);
  frText("最优带速 ≈ " + optimal.toFixed(2) + " m/s", 797, 112, "#0f766e", 12, CENTER);
}

function frGameRange(heightValue) {
  var beltSpeed = frParam("beltSpeed", 4);
  var radius = frParam("radius", 0.9);
  var topHeight = frParam("topHeight", 3.05);
  var g = frParam("g", 10);
  var beltLength = 4;
  var beltAccel = 0.1 * g;
  var vB2 = 20 * heightValue / 3;
  var belt2 = beltSpeed * beltSpeed;
  var vC2;
  if (vB2 <= belt2) {
    var accelDistance = (belt2 - vB2) / (2 * beltAccel);
    vC2 = accelDistance <= beltLength ? belt2 : vB2 + 2 * beltAccel * beltLength;
  } else {
    var decelDistance = (vB2 - belt2) / (2 * beltAccel);
    vC2 = decelDistance <= beltLength ? belt2 : Math.max(0, vB2 - 2 * beltAccel * beltLength);
  }
  var vE2 = vC2 + 4 * g * radius;
  var flightHeight = Math.max(0.05, topHeight - 2 * radius);
  return Math.sqrt(vE2) * Math.sqrt(2 * flightHeight / g);
}

function frGameTrackPosition(progress) {
  var p = constrain(progress, 0, 1);
  var rangeValue = frGameRange(frParam("releaseHeight", 2.4));
  if (p < 0.25) {
    var q1 = p / 0.25;
    return { x: 76 + (190 - 76) * q1, y: 132 + (250 - 132) * q1 };
  }
  if (p < 0.48) {
    var q2 = (p - 0.25) / 0.23;
    return { x: 190 + (356 - 190) * q2, y: 250 };
  }
  if (p < 0.72) {
    var theta = map(p, 0.48, 0.72, -Math.PI / 2, Math.PI / 2);
    return { x: 356 + 70 * Math.cos(theta), y: 320 + 70 * Math.sin(theta) };
  }
  var q3 = (p - 0.72) / 0.28;
  return { x: 356 - 56 * rangeValue * q3, y: 390 + 40 * q3 * q3 };
}

function drawFrGameTrackScene() {
  var ball = frGameTrackPosition(frProgress());
  var releaseHeight = frParam("releaseHeight", 2.4);
  frText("斜轨—传送带—半圆—平抛", 22, 28, "#0f172a", 17, LEFT);
  stroke("#64748b");
  strokeWeight(4);
  line(76, 132, 190, 250);
  frDrawBelt(180, 232, 186, 38, frParam("beltSpeed", 4) * frTime() * 28, "#dbeafe");
  noFill();
  stroke("#475569");
  strokeWeight(4);
  arc(356, 320, 140, 140, -Math.PI / 2, Math.PI / 2);
  stroke("#94a3b8");
  strokeWeight(1.2);
  drawingContext.setLineDash([4, 4]);
  beginShape();
  var rangeValue = frGameRange(releaseHeight);
  for (var i = 0; i <= 24; i += 1) {
    var q = i / 24;
    vertex(356 - 56 * rangeValue * q, 390 + 40 * q * q);
  }
  endShape();
  drawingContext.setLineDash([]);
  frGround(432, 54, 528);
  fill("#f97316");
  stroke("#c2410c");
  circle(ball.x, ball.y, 22);
  frText("A", 66, 118, "#475569", 12, CENTER);
  frText("B", 190, 278, "#475569", 12, CENTER);
  frText("C/D", 356, 224, "#475569", 12, CENTER);
  frText("E", 356, 410, "#475569", 12, CENTER);
  frText("h = " + releaseHeight.toFixed(2) + " m", 24, 468, "#334155", 14, LEFT);
  frText("x = " + rangeValue.toFixed(2) + " m", 274, 468, "#2563eb", 14, LEFT);
}

function drawFrGameTrackGraph() {
  var maxHeight = 3.6;
  var maxRange = Math.max(frGameRange(0), frGameRange(maxHeight)) * 1.12;
  var frame = frAxes("平抛距离随释放高度变化", "h / m", "x / m", 0, maxHeight, 0, maxRange);
  frPlot(frame, "#2563eb", function (h) { return frGameRange(h); });
  var h = frParam("releaseHeight", 2.4);
  frMarker(frame, h, frGameRange(h), "#dc2626");
  frText("达到带速后射程进入平台", 797, 112, "#0f766e", 12, CENTER);
}

registerSceneRenderer("functional_relation_model", drawFunctionalRelationModelScene, drawFunctionalRelationModelGraph);
