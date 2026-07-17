function rotVariant() {
  return ((problemDataMap[currentScene] || {}).animation || {}).variant || "";
}

function rotParam(key, fallback) {
  return getJsonParam(currentScene, key, fallback);
}

function rotTime() {
  return getJsonAnimationState(currentScene).time;
}

function rotDuration() {
  return Math.max(0.001, getJsonDuration(currentScene));
}

function rotProgress() {
  return constrain(rotTime() / rotDuration(), 0, 1);
}

function rotText(label, x, y, colorHex, size, alignMode) {
  noStroke();
  fill(colorHex || "#334155");
  textSize(size || 14);
  textAlign(alignMode || LEFT, CENTER);
  text(String(label), x, y);
}

function rotTitle(title, subtitle) {
  rotText(title, 28, 30, "#0f172a", 20, LEFT);
  rotText(subtitle, 28, 57, "#334155", 14, LEFT);
}

function rotArrow(x1, y1, x2, y2, colorHex, label) {
  var angle = Math.atan2(y2 - y1, x2 - x1);
  var head = 9;
  stroke(colorHex || "#dc2626");
  strokeWeight(2.4);
  line(x1, y1, x2, y2);
  line(x2, y2, x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
  line(x2, y2, x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
  if (label) rotText(label, x2 + 7, y2 - 10, colorHex || "#dc2626", 13, LEFT);
}

function rotBall(x, y, colorHex, label, radius) {
  stroke("#ffffff");
  strokeWeight(2);
  fill(colorHex || "#2563eb");
  circle(x, y, radius || 22);
  if (label) rotText(label, x, y - 20, "#0f172a", 13, CENTER);
}

function rotBlock(x, y, width, height, colorHex, label, angle) {
  push();
  translate(x, y);
  rotate(angle || 0);
  stroke("#334155");
  strokeWeight(1.4);
  fill(colorHex || "#f97316");
  rect(-width / 2, -height / 2, width, height, 4);
  pop();
  if (label) rotText(label, x, y - height / 2 - 12, "#0f172a", 13, CENTER);
}

function rotSpring(x1, y1, x2, y2, colorHex) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  var length = Math.sqrt(dx * dx + dy * dy) || 1;
  var nx = -dy / length;
  var ny = dx / length;
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

function rotCar(x, y, angle, colorHex) {
  push();
  translate(x, y);
  rotate(angle || 0);
  fill(colorHex || "#2563eb");
  stroke("#1e3a8a");
  strokeWeight(1.4);
  rect(-27, -15, 54, 23, 5);
  fill("#bfdbfe");
  quad(-15, -15, -7, -28, 15, -28, 24, -15);
  fill("#0f172a");
  circle(-17, 11, 12);
  circle(18, 11, 12);
  pop();
}

function rotGraphFrame(title, subtitle, xMin, xMax, yMin, yMax, xLabel, yLabel) {
  var frame = { left: 624, right: 968, top: 92, bottom: 414 };
  frame.xMin = xMin;
  frame.xMax = xMax;
  frame.yMin = yMin;
  frame.yMax = yMax;
  rotText(title, graphLeft + 24, 30, "#0f172a", 19, LEFT);
  rotText(subtitle, graphLeft + 24, 57, "#334155", 13, LEFT);
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
    rotText(rotNumber(map(index, 0, 4, xMin, xMax)), x, frame.bottom + 17, "#475569", 11, CENTER);
    rotText(rotNumber(map(index, 0, 4, yMin, yMax)), frame.left - 9, y, "#475569", 11, RIGHT);
  }
  rotText(xLabel || "x", (frame.left + frame.right) / 2, 465, "#334155", 12, CENTER);
  rotText(yLabel || "y", frame.left - 20, 74, "#334155", 12, CENTER);
  return frame;
}

function rotNumber(value) {
  if (Math.abs(value) >= 100) return value.toFixed(0);
  if (Math.abs(value) >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

function rotGX(frame, value) {
  return map(value, frame.xMin, frame.xMax, frame.left, frame.right);
}

function rotGY(frame, value) {
  return map(value, frame.yMin, frame.yMax, frame.bottom, frame.top);
}

function rotPlot(frame, colorHex, valueAt, dashed) {
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
  for (var index = 0; index <= 160; index += 1) {
    var xValue = map(index, 0, 160, frame.xMin, frame.xMax);
    var yValue = valueAt(xValue);
    if (Number.isFinite(yValue)) vertex(rotGX(frame, xValue), rotGY(frame, yValue));
  }
  endShape();
  drawingContext.setLineDash([]);
  drawingContext.restore();
  pop();
}

function rotMarker(frame, xValue, yValue, colorHex) {
  var x = constrain(rotGX(frame, xValue), frame.left, frame.right);
  var y = constrain(rotGY(frame, yValue), frame.top, frame.bottom);
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
}

function rotLegend(items, x, y) {
  for (var index = 0; index < items.length; index += 1) {
    noStroke();
    fill(items[index].color);
    circle(x, y + index * 20, 8);
    rotText(items[index].label, x + 10, y + index * 20, "#334155", 12, LEFT);
  }
}

function rotGraphBar(frame, index, count, value, colorHex, label) {
  var slot = (frame.right - frame.left) / count;
  var width = slot * 0.56;
  var left = frame.left + index * slot + (slot - width) / 2;
  var top = constrain(rotGY(frame, value), frame.top, frame.bottom);
  noStroke();
  fill(colorHex);
  rect(left, top, width, frame.bottom - top, 4, 4, 0, 0);
  rotText(label, left + width / 2, frame.bottom + 17, "#334155", 11, CENTER);
}

function drawRequiredOneTestScene() {
  var variant = rotVariant();
  if (variant === "spring_test_01_marathon") rotMarathonScene();
  else if (variant === "spring_test_02_grid_slide") rotGridSlideScene();
  else if (variant === "spring_test_04_curved_slope") rotCurvedSlopeScene();
  else if (variant === "spring_test_05_light_chain") rotLightChainScene();
  else if (variant === "spring_test_06_nail_basket") rotNailBasketScene();
  else if (variant === "spring_test_07_incline_lift") rotInclineLiftScene();
  else if (variant === "spring_test_08_handcart") rotHandcartScene();
  else if (variant === "spring_test_09_circle_groove") rotCircleGrooveScene();
  else if (variant === "spring_test_10_steel_coil") rotSteelCoilScene();
  else if (variant === "spring_test_11_force_sensor") rotForceSensorScene();
  else if (variant === "spring_test_12_cable_car") rotCableCarScene();
  else if (variant === "spring_test_13_stacked_plates") rotStackedPlatesScene();
  else if (variant === "spring_test_14_spring_cases") rotSpringCasesScene();
  else if (variant === "spring_test_15_braking_graph") rotBrakingScene();
  else if (variant === "spring_test_16_police_chase") rotPoliceChaseScene();
  else if (variant === "spring_test_17_rocket") rotRocketScene();
  else if (variant === "spring_test_18_unloading") rotUnloadingScene();
}

function drawRequiredOneTestGraph() {
  var variant = rotVariant();
  if (variant === "spring_test_01_marathon") rotMarathonGraph();
  else if (variant === "spring_test_02_grid_slide") rotGridSlideGraph();
  else if (variant === "spring_test_04_curved_slope") rotCurvedSlopeGraph();
  else if (variant === "spring_test_05_light_chain") rotLightChainGraph();
  else if (variant === "spring_test_06_nail_basket") rotNailBasketGraph();
  else if (variant === "spring_test_07_incline_lift") rotInclineLiftGraph();
  else if (variant === "spring_test_08_handcart") rotHandcartGraph();
  else if (variant === "spring_test_09_circle_groove") rotCircleGrooveGraph();
  else if (variant === "spring_test_10_steel_coil") rotSteelCoilGraph();
  else if (variant === "spring_test_11_force_sensor") rotForceSensorGraph();
  else if (variant === "spring_test_12_cable_car") rotCableCarGraph();
  else if (variant === "spring_test_13_stacked_plates") rotStackedPlatesGraph();
  else if (variant === "spring_test_14_spring_cases") rotSpringCasesGraph();
  else if (variant === "spring_test_15_braking_graph") rotBrakingGraph();
  else if (variant === "spring_test_16_police_chase") rotPoliceChaseGraph();
  else if (variant === "spring_test_17_rocket") rotRocketGraph();
  else if (variant === "spring_test_18_unloading") rotUnloadingGraph();
}

function rotMarathonScene() {
  var progress = rotProgress();
  var distance = rotParam("distance", 21);
  var angle = -Math.PI / 2 + progress * Math.PI * 5;
  var x = 285 + 188 * Math.cos(angle);
  var y = 276 + 105 * Math.sin(angle);
  rotTitle("半程马拉松：路程与位移", "沿路线累计的是路程；位移只连接起点和当前位置");
  noFill();
  stroke("#cbd5e1");
  strokeWeight(22);
  ellipse(285, 276, 390, 230);
  stroke("#ffffff");
  strokeWeight(2);
  ellipse(285, 276, 390, 230);
  rotBall(x, y, "#ef4444", "运动员", 20);
  rotArrow(285, 171, x, y, "#2563eb", "位移");
  rotText("累计路程 " + (distance * progress).toFixed(1) + " km", 285, 438, "#0f172a", 16, CENTER);
}

function rotGridSlideScene() {
  var progress = rotProgress();
  var cells = Math.max(4, Math.round(rotParam("cells", 8)));
  var start = 60;
  var width = 470;
  var cellWidth = width / cells;
  var distanceRatio = 2 * progress - progress * progress;
  var x = start + width * distanceRatio;
  rotTitle("八格匀减速滑行", "等距格并不对应等时间；越接近终点速度越小");
  for (var index = 0; index < cells; index += 1) {
    fill(index % 2 ? "#f8fafc" : "#eef2ff");
    stroke("#94a3b8");
    rect(start + index * cellWidth, 260, cellWidth, 92);
    rotText(index + 1, start + (index + 0.5) * cellWidth, 330, "#475569", 13, CENTER);
  }
  rotBlock(x, 245, 34, 27, "#f97316", "石块", 0);
  rotArrow(x, 205, x + 90 * (1 - progress), 205, "#2563eb", "v");
  rotText("v / v0 = " + (1 - progress).toFixed(2), 285, 410, "#0f172a", 16, CENTER);
}

function rotCurvedSlopePoint(progress) {
  var x = 70 + 440 * progress;
  var y = 386 - 220 * Math.pow(progress, 1.65);
  var derivative = -220 * 1.65 * Math.pow(Math.max(0.001, progress), 0.65) / 440;
  return { x: x, y: y, angle: Math.atan2(derivative, 1) };
}

function rotCurvedSlopeScene() {
  var progress = rotProgress();
  var point = rotCurvedSlopePoint(1 - progress);
  rotTitle("弧形坡道局部受力", "每一点都用局部切线和法线分解接触力");
  noFill();
  stroke("#64748b");
  strokeWeight(8);
  beginShape();
  for (var index = 0; index <= 100; index += 1) {
    var sample = rotCurvedSlopePoint(index / 100);
    vertex(sample.x, sample.y);
  }
  endShape();
  rotText("B", 82, 407, "#0f172a", 14, CENTER);
  rotText("A", 505, 145, "#0f172a", 14, CENTER);
  rotCar(point.x, point.y - 19, point.angle, "#2563eb");
  var theta = Math.abs(point.angle);
  rotArrow(point.x, point.y - 35, point.x - 58 * Math.sin(theta), point.y - 35 - 58 * Math.cos(theta), "#2563eb", "N");
  rotArrow(point.x, point.y - 35, point.x - 62 * Math.cos(theta), point.y - 35 + 62 * Math.sin(theta), "#f97316", "f");
}

function rotLightChainScene() {
  var progress = rotProgress();
  var targetTheta = rotParam("theta", 30) * Math.PI / 180;
  var theta = targetTheta + Math.min(15 * Math.PI / 180, Math.PI / 2 - targetTheta - 0.08) * Math.sin(Math.PI * progress);
  var count = Math.max(3, Math.round(rotParam("count", 5)));
  var x = 120;
  var y = 78;
  var segment = Math.min(62, 330 / count);
  rotTitle("五彩灯绳系平衡", "整体法求水平外力，截取右端求任意绳段方向");
  stroke("#475569");
  strokeWeight(3);
  line(65, 72, 165, 72);
  for (var index = 0; index < count; index += 1) {
    var angle = lerp(Math.PI / 2 - theta, 0.08, index / Math.max(1, count - 1));
    var nextX = x + segment * Math.cos(angle);
    var nextY = y + segment * Math.sin(angle);
    stroke("#475569");
    strokeWeight(2.5);
    line(x, y, nextX, nextY);
    rotBall(nextX, nextY, ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"][index % 5], String(index + 1), 22);
    x = nextX;
    y = nextY;
  }
  rotArrow(x + 13, y, Math.min(535, x + 85), y, "#dc2626", "F");
  rotText("F / mg = n tan(theta) = " + (count * Math.tan(theta)).toFixed(2), 282, 448, "#0f172a", 15, CENTER);
}

function rotNailBasketGeometry(progress) {
  var pointA = { x: 150, y: 115 };
  var pointB = { x: 430, y: lerp(62, 115, progress) };
  var basket = { x: 290, y: lerp(350, 383, progress) };
  var dx = basket.x - pointA.x;
  var dy = basket.y - (pointA.y + pointB.y) / 2;
  var cosine = dy / Math.sqrt(dx * dx + dy * dy);
  return { a: pointA, b: pointB, basket: basket, tension: 1 / (2 * cosine) };
}

function rotNailBasketScene() {
  var geometry = rotNailBasketGeometry(rotProgress());
  rotTitle("双钉悬篮调节", "支点间绳段缩短，悬挂支路变长并更接近竖直");
  stroke("#cbd5e1");
  strokeWeight(2);
  drawingContext.setLineDash([5, 5]);
  line(150, 115, 430, 62);
  drawingContext.setLineDash([]);
  stroke("#2563eb");
  strokeWeight(3);
  line(geometry.a.x, geometry.a.y, geometry.b.x, geometry.b.y);
  line(geometry.a.x, geometry.a.y, geometry.basket.x, geometry.basket.y - 28);
  line(geometry.b.x, geometry.b.y, geometry.basket.x, geometry.basket.y - 28);
  fill("#0f172a");
  noStroke();
  circle(geometry.a.x, geometry.a.y, 12);
  circle(geometry.b.x, geometry.b.y, 12);
  rotText("A", geometry.a.x - 14, geometry.a.y - 14, "#0f172a", 13, CENTER);
  rotText(rotProgress() > 0.95 ? "C" : "B", geometry.b.x + 14, geometry.b.y - 14, "#0f172a", 13, CENTER);
  fill("#f97316");
  stroke("#9a3412");
  rect(geometry.basket.x - 42, geometry.basket.y - 28, 84, 55, 5);
  rotText("吊篮", geometry.basket.x, geometry.basket.y, "#ffffff", 15, CENTER);
  rotText("T / Mg = " + geometry.tension.toFixed(3), 290, 447, "#0f172a", 15, CENTER);
}

function rotInclineLiftGeometry(progress) {
  var theta = rotParam("angle", 25) * Math.PI / 180;
  var startX = 72;
  var startY = 405;
  var length = 470;
  var ratio = 0.10 + 0.67 * progress;
  var x = startX + length * ratio * Math.cos(theta);
  var y = startY - length * ratio * Math.sin(theta);
  var pulley = { x: 515, y: 82 };
  var ropeAngle = Math.atan2(y - pulley.y, pulley.x - x);
  var beta = Math.max(0, ropeAngle - theta);
  var normal = Math.max(0, Math.cos(theta) - Math.sin(theta) * Math.tan(beta));
  return { theta: theta, x: x, y: y, pulley: pulley, beta: beta, normal: normal };
}

function rotInclineLiftScene() {
  var geometry = rotInclineLiftGeometry(rotProgress());
  rotTitle("定滑轮缓慢提升", "重物接近滑轮时，绳的离面分量增大，支持力减小");
  stroke("#64748b");
  strokeWeight(5);
  line(72, 405, 72 + 470 * Math.cos(geometry.theta), 405 - 470 * Math.sin(geometry.theta));
  stroke("#0f172a");
  noFill();
  circle(geometry.pulley.x, geometry.pulley.y, 34);
  stroke("#2563eb");
  strokeWeight(2.5);
  line(geometry.x, geometry.y - 20, geometry.pulley.x, geometry.pulley.y);
  rotBlock(geometry.x, geometry.y - 17, 48, 31, "#f97316", "物块", -geometry.theta);
  rotArrow(geometry.x, geometry.y - 30, geometry.x - 55 * Math.sin(geometry.theta), geometry.y - 30 - 55 * Math.cos(geometry.theta), "#2563eb", "N");
  rotText("N / mg = " + geometry.normal.toFixed(2), 280, 448, "#0f172a", 15, CENTER);
}

function rotHandcartScene() {
  var alpha = rotParam("maxAngle", 60) * Math.PI / 180 * rotProgress();
  var pivotX = 145;
  var pivotY = 390;
  var baseLength = 310;
  rotTitle("倾斜推车双支持", "底板与支架互相垂直，两支持力正好分解重力");
  push();
  translate(pivotX, pivotY);
  rotate(-alpha);
  stroke("#334155");
  strokeWeight(8);
  line(0, 0, baseLength, 0);
  line(baseLength, 0, baseLength, -150);
  fill("#f97316");
  stroke("#9a3412");
  rect(188, -66, 68, 66, 5);
  pop();
  var boxX = pivotX + 222 * Math.cos(alpha) - 32 * Math.sin(alpha);
  var boxY = pivotY - 222 * Math.sin(alpha) - 32 * Math.cos(alpha);
  rotArrow(boxX, boxY, boxX, boxY + 78, "#64748b", "mg");
  rotArrow(boxX, boxY, boxX + 67 * Math.sin(alpha), boxY - 67 * Math.cos(alpha), "#2563eb", "N底");
  rotArrow(boxX, boxY, boxX - 67 * Math.cos(alpha), boxY - 67 * Math.sin(alpha), "#f97316", "N支");
  rotText("alpha = " + (alpha * 180 / Math.PI).toFixed(0) + " deg", 280, 448, "#0f172a", 15, CENTER);
}

function rotCircleGrooveScene() {
  var theta = rotParam("angle", 30) * Math.PI / 180;
  var progress = rotProgress();
  var centerX = 440 - 270 * progress * Math.cos(theta);
  var centerY = 185 + 270 * progress * Math.sin(theta);
  var radius = 70;
  rotTitle("斜面圆槽相对静止", "共同下滑后，等效重力垂直斜面，小球停在相对槽底");
  stroke("#64748b");
  strokeWeight(5);
  line(60, 420, 530, 420 - 470 * Math.tan(theta));
  noFill();
  stroke("#2563eb");
  strokeWeight(5);
  circle(centerX, centerY, 2 * radius);
  var ballX = centerX + radius * Math.sin(theta) * 0.72;
  var ballY = centerY + radius * Math.cos(theta) * 0.72;
  rotBall(ballX, ballY, "#f97316", "C", 23);
  rotArrow(centerX, centerY, centerX + 75 * Math.sin(theta), centerY + 75 * Math.cos(theta), "#dc2626", "g_eff");
  rotArrow(centerX, centerY, centerX - 92 * Math.cos(theta), centerY + 92 * Math.sin(theta), "#22c55e", "a");
}

function rotSteelCoilScene() {
  var progress = rotProgress();
  var radius = 102;
  var centerX = 292;
  var centerY = 245;
  var contactRatio = constrain(rotParam("contactHeight", 0.4), 0.08, 0.9);
  var contactY = centerY + radius * (1 - contactRatio);
  var offsetX = Math.sqrt(Math.max(0, radius * radius - Math.pow(contactY - centerY, 2)));
  rotTitle("钢卷刹车临界", "离地临界时，楔块支持力同时平衡重力与惯性力");
  fill("#f1f5f9");
  stroke("#334155");
  strokeWeight(3);
  rect(45, 382, 490, 55, 7);
  fill("#cbd5e1");
  stroke("#475569");
  circle(centerX, centerY, 2 * radius);
  fill("#94a3b8");
  triangle(centerX - offsetX - 28, 382, centerX - offsetX + 28, 382, centerX - offsetX, contactY);
  triangle(centerX + offsetX - 28, 382, centerX + offsetX + 28, 382, centerX + offsetX, contactY);
  rotArrow(centerX, centerY, centerX - 42 - 88 * progress, centerY, "#dc2626", "ma");
  rotArrow(centerX, centerY, centerX, centerY + 95, "#64748b", "mg");
  rotArrow(90, 355, 90 + 125 * progress, 355, "#2563eb", "刹车方向");
}

function rotJumpForceRatio(time) {
  if (time < 1) return 1;
  if (time < 2) return 1 + 1.2 * Math.sin((time - 1) * Math.PI / 2);
  if (time < 2.4) return 2.2 - 1.6 * (time - 2) / 0.4;
  if (time < 5) return 0;
  if (time < 5.6) return 1 + 1.7 * Math.sin((time - 5) * Math.PI / 0.6);
  return 1;
}

function rotForceSensorScene() {
  var time = rotTime();
  var jumpHeight = rotParam("jumpHeight", 0.45);
  var lift = 0;
  if (time >= 2.4 && time <= 5) {
    var flightProgress = (time - 2.4) / 2.6;
    lift = jumpHeight * 170 * 4 * flightProgress * (1 - flightProgress);
  }
  rotTitle("起跳压力图像", "离地阶段传感器示数为零；滞空时间决定起跳高度");
  stroke("#475569");
  strokeWeight(5);
  line(85, 390, 500, 390);
  fill("#e2e8f0");
  stroke("#64748b");
  rect(210, 365, 150, 24, 4);
  var centerX = 285;
  var footY = 362 - lift;
  stroke("#0f172a");
  strokeWeight(5);
  line(centerX, footY - 75, centerX, footY - 28);
  line(centerX, footY - 28, centerX - 25, footY);
  line(centerX, footY - 28, centerX + 25, footY);
  line(centerX, footY - 60, centerX - 28, footY - 35);
  line(centerX, footY - 60, centerX + 28, footY - 35);
  noStroke();
  fill("#f59e0b");
  circle(centerX, footY - 92, 34);
  var ratio = rotJumpForceRatio(time);
  rotArrow(centerX + 62, 365, centerX + 62, 365 - 55 * ratio, "#2563eb", "F");
  rotText("F / mg = " + ratio.toFixed(2), 285, 445, "#0f172a", 15, CENTER);
}

function rotCableCarScene() {
  var progress = rotProgress();
  var angle = 30 * Math.PI / 180;
  var accel = rotParam("accel", 2);
  var x = 95 + 340 * progress * Math.cos(angle);
  var y = 390 - 340 * progress * Math.sin(angle);
  var effectiveX = -accel * Math.cos(angle);
  var effectiveY = 10 + accel * Math.sin(angle);
  var planeAngle = Math.atan2(-effectiveX, effectiveY);
  rotTitle("缆车中摩擦力判零", "无摩擦时，接触面法线必须与等效重力反向共线");
  stroke("#64748b");
  strokeWeight(4);
  line(45, 420, 540, 420 - 495 * Math.tan(angle));
  push();
  translate(x, y);
  rotate(-angle);
  fill("#dbeafe");
  stroke("#1e3a8a");
  strokeWeight(2);
  rect(-70, -54, 140, 108, 7);
  pop();
  push();
  translate(x, y);
  rotate(planeAngle);
  stroke("#f97316");
  strokeWeight(5);
  line(-42, 15, 42, 15);
  rotBlock(-16, -2, 30, 30, "#2563eb", "P", 0);
  rotBlock(18, -2, 30, 30, "#22c55e", "Q", 0);
  pop();
  rotArrow(x, y, x + effectiveX * 15, y + effectiveY * 11, "#dc2626", "g_eff");
  rotArrow(x - 78, y + 70, x - 78 + 86 * Math.cos(angle), y + 70 - 86 * Math.sin(angle), "#2563eb", "a");
}

function rotStackedPlatesScene() {
  var progress = rotProgress();
  var brake = rotParam("brake", 4);
  var mu = rotParam("mu", 0.25);
  var slip = Math.max(0, brake - 10 * mu) * 12 * progress * progress;
  rotTitle("三层工件急刹", "同一临界 a = mu g；超过临界时上面两层可整体滑动");
  fill("#dbeafe");
  stroke("#1e3a8a");
  strokeWeight(2);
  rect(45, 330, 490, 90, 8);
  fill("#334155");
  circle(130, 428, 34);
  circle(450, 428, 34);
  var baseX = 275;
  rotBlock(baseX, 305, 190, 34, "#94a3b8", "固定层", 0);
  rotBlock(baseX + slip, 270, 190, 34, "#60a5fa", "中层", 0);
  rotBlock(baseX + slip, 235, 190, 34, "#f97316", "上层", 0);
  rotArrow(485, 175, 390, 175, "#dc2626", "制动 a");
  if (slip > 1) rotArrow(baseX, 205, baseX + slip, 205, "#f97316", "相对前滑");
}

function rotSpringCasesScene() {
  var progress = rotProgress();
  var extension = 13 + 18 * progress;
  var theta = rotParam("slopeAngle", 30) * Math.PI / 180;
  rotTitle("弹簧连接体三种放置", "共同重力分量改变整体加速度，但不改变弹簧伸长量");
  rotText("I 水平", 103, 112, "#0f172a", 14, CENTER);
  stroke("#64748b");
  strokeWeight(3);
  line(34, 210, 190, 210);
  rotBlock(68, 192, 38, 30, "#60a5fa", "b", 0);
  rotSpring(88, 192, 122 + extension, 192, "#2563eb");
  rotBlock(143 + extension, 192, 38, 30, "#f97316", "a", 0);
  rotArrow(165 + extension, 158, 205 + extension, 158, "#dc2626", "F");

  rotText("II 斜面", 286, 112, "#0f172a", 14, CENTER);
  stroke("#64748b");
  line(210, 250, 370, 250 - 160 * Math.tan(theta));
  var ux = Math.cos(theta);
  var uy = -Math.sin(theta);
  rotBlock(238 + 25 * ux, 236 + 25 * uy, 36, 28, "#60a5fa", "b", -theta);
  rotSpring(268, 218, 300 + extension * ux, 218 - extension * Math.sin(theta), "#2563eb");
  rotBlock(324 + extension * ux, 197 - extension * Math.sin(theta), 36, 28, "#f97316", "a", -theta);

  rotText("III 竖直", 458, 112, "#0f172a", 14, CENTER);
  stroke("#64748b");
  line(440, 130, 440, 380);
  rotBlock(440, 335, 38, 30, "#60a5fa", "b", 0);
  rotSpring(440, 315, 440, 250 - extension, "#2563eb");
  rotBlock(440, 225 - extension, 38, 30, "#f97316", "a", 0);
  rotArrow(478, 225 - extension, 478, 160 - extension, "#dc2626", "F");
}

function rotBrakingDistance(time) {
  var speed = rotParam("speed", 10);
  var decel = Math.max(0.1, rotParam("decel", 2));
  var reaction = rotParam("reaction", 0.2);
  if (time <= reaction) return speed * time;
  var brakingTime = Math.min(time - reaction, speed / decel);
  return speed * reaction + speed * brakingTime - 0.5 * decel * brakingTime * brakingTime;
}

function rotBrakingScene() {
  var physicalTime = 5.2 * rotProgress();
  var distance = rotBrakingDistance(physicalTime);
  var roadStart = 62;
  var scale = 14;
  var carX = roadStart + distance * scale;
  var animalX = roadStart + 30 * scale;
  rotTitle("刹车变换图像", "先走反应距离，再做匀减速；停车点应在障碍物之前");
  stroke("#64748b");
  strokeWeight(4);
  line(35, 365, 545, 365);
  rotCar(carX, 342, 0, "#2563eb");
  stroke("#78350f");
  strokeWeight(5);
  line(animalX, 328, animalX, 360);
  line(animalX, 335, animalX - 12, 320);
  line(animalX, 335, animalX + 12, 320);
  rotText("障碍物 30 m", animalX, 390, "#92400e", 13, CENTER);
  rotText("已行驶 " + distance.toFixed(1) + " m", 285, 445, "#0f172a", 15, CENTER);
}

function rotPolicePositions(time) {
  var policeSpeed = rotParam("policeSpeed", 30);
  var truckSpeed = rotParam("truckSpeed", 20);
  var initialGap = rotParam("initialGap", 60);
  var police;
  var truck;
  var box;
  if (time <= 1) {
    police = policeSpeed * time;
    truck = initialGap + truckSpeed * time;
    box = truck;
  } else {
    var tau = time - 1;
    police = policeSpeed + policeSpeed * tau - 2 * tau * tau;
    truck = initialGap + truckSpeed;
    if (tau <= 5) truck += truckSpeed * tau + tau * tau;
    else truck += 125 + 30 * (tau - 5);
    box = initialGap + truckSpeed + truckSpeed * tau - tau * tau;
  }
  return { police: police, truck: truck, box: box };
}

function rotVehicle(x, y, colorHex, label) {
  fill(colorHex);
  stroke("#334155");
  strokeWeight(1.5);
  rect(x - 28, y - 20, 56, 30, 5);
  fill("#0f172a");
  circle(x - 17, y + 12, 12);
  circle(x + 18, y + 12, 12);
  rotText(label, x, y - 33, "#0f172a", 13, CENTER);
}

function rotPoliceChaseScene() {
  var positions = rotPolicePositions(rotTime());
  var maxPosition = Math.max(280, positions.truck + 20);
  var scale = 440 / maxPosition;
  rotTitle("警车、货车与脱落箱子", "每次状态改变都重新计时；相对位移决定是否相撞");
  for (var lane = 0; lane < 3; lane += 1) {
    stroke("#cbd5e1");
    strokeWeight(2);
    line(55, 205 + lane * 90, 525, 205 + lane * 90);
  }
  rotVehicle(60 + positions.truck * scale, 190, "#f97316", "货车 B");
  rotVehicle(60 + positions.police * scale, 280, "#2563eb", "警车 A");
  rotBlock(60 + positions.box * scale, 365, 30, 25, "#a16207", "箱子 C", 0);
  rotText("A-C 间距 " + Math.max(0, positions.box - positions.police).toFixed(1) + " m", 285, 455, "#0f172a", 15, CENTER);
}

function rotRocketHeight(time) {
  if (time <= 3) return 5 * time * time;
  if (time <= 5.4) {
    var coast = time - 3;
    return 45 + 30 * coast - 6.25 * coast * coast;
  }
  var fall = time - 5.4;
  return Math.max(0, 81 - 0.25 * fall * fall);
}

function rotRocketScene() {
  var time = rotTime();
  var height = rotRocketHeight(time);
  var x = 275;
  var groundY = 430;
  var y = groundY - height * 3.9;
  rotTitle("火箭多阶段升降", "动力上升、熄火上升、最高点开伞、匀加速下降");
  stroke("#64748b");
  strokeWeight(4);
  line(45, groundY, 530, groundY);
  if (time > 5.4) {
    fill("#ef4444");
    stroke("#991b1b");
    arc(x, y - 42, 105, 62, Math.PI, 2 * Math.PI, CHORD);
    stroke("#64748b");
    line(x - 45, y - 40, x - 15, y);
    line(x + 45, y - 40, x + 15, y);
  }
  fill("#2563eb");
  stroke("#1e3a8a");
  triangle(x, y - 30, x - 15, y + 22, x + 15, y + 22);
  if (time < 3) {
    noStroke();
    fill("#f97316");
    triangle(x - 10, y + 20, x + 10, y + 20, x, y + 55);
  }
  var phase = time < 3 ? "发动机工作" : (time < 5.4 ? "熄火上升" : "开伞下降");
  rotText(phase + "  h = " + height.toFixed(1) + " m", 35, 88, "#0f172a", 15, LEFT);
}

function rotUnloadingVelocity(time) {
  if (time <= 2) return 2.5 * time;
  if (time <= 3) return 5 + 3 * (time - 2);
  if (time <= 3.5) return 8;
  return 8 - 4 * (time - 3.5);
}

function rotUnloadingScene() {
  var time = rotTime();
  var x;
  var y;
  rotTitle("斜面、传送带、平板车卸货", "三个接触区间依次判断摩擦方向、共速时刻和相对位移");
  stroke("#64748b");
  strokeWeight(5);
  line(45, 230, 185, 350);
  line(185, 350, 405, 350);
  fill("#dbeafe");
  stroke("#1e3a8a");
  rect(405, 320, 135, 45, 5);
  fill("#334155");
  circle(435, 370, 24);
  circle(510, 370, 24);
  if (time <= 2) {
    var ratio = time / 2;
    x = lerp(55, 180, ratio * ratio);
    y = lerp(225, 335, ratio * ratio);
  } else if (time <= 3.5) {
    x = lerp(190, 397, (time - 2) / 1.5);
    y = 328;
  } else {
    x = lerp(420, 500, (time - 3.5) / 0.5);
    y = 298;
  }
  rotBlock(x, y, 42, 34, "#f97316", "货物", 0);
  for (var belt = 0; belt < 8; belt += 1) {
    rotArrow(195 + belt * 26, 374, 210 + belt * 26, 374, "#94a3b8", "");
  }
  rotText("v = " + rotUnloadingVelocity(time).toFixed(1) + " m/s", 285, 448, "#0f172a", 15, CENTER);
}

function rotMarathonGraph() {
  var distance = rotParam("distance", 21);
  var minutes = rotParam("duration", 62.5);
  var progress = rotProgress();
  var frame = rotGraphFrame("路程-时间图", "终点只给出累计路程，不直接给位移", 0, minutes, 0, distance, "t / min", "s / km");
  rotPlot(frame, "#2563eb", function (time) { return distance * time / minutes; }, false);
  rotMarker(frame, minutes * progress, distance * progress, "#ef4444");
}

function rotGridSlideGraph() {
  var progress = rotProgress();
  var frame = rotGraphFrame("速度-时间图", "匀减速至零，分格时刻不等间隔", 0, 1, 0, 1, "t / t0", "v / v0");
  rotPlot(frame, "#2563eb", function (time) { return 1 - time; }, false);
  rotMarker(frame, progress, 1 - progress, "#f97316");
}

function rotCurvedSlopeGraph() {
  var maxAngle = rotParam("maxAngle", 38);
  var theta = maxAngle * (1 - rotProgress());
  var frame = rotGraphFrame("接触力分量-坡角", "蓝：N/mg；橙：f/mg；虚线：总作用力/mg", 0, maxAngle, 0, 1.05, "theta / deg", "归一化力");
  rotPlot(frame, "#2563eb", function (angle) { return Math.cos(angle * Math.PI / 180); }, false);
  rotPlot(frame, "#f97316", function (angle) { return Math.sin(angle * Math.PI / 180); }, false);
  rotPlot(frame, "#64748b", function () { return 1; }, true);
  rotMarker(frame, theta, Math.cos(theta * Math.PI / 180), "#2563eb");
}

function rotLightChainGraph() {
  var count = Math.max(3, Math.round(rotParam("count", 5)));
  var target = rotParam("theta", 30);
  var peak = Math.min(85, target + 15);
  var theta = target + (peak - target) * Math.sin(Math.PI * rotProgress());
  var maxValue = count * Math.tan(peak * Math.PI / 180) * 1.08;
  var frame = rotGraphFrame("水平外力-顶部夹角", "F/(mg) = n tan(theta)", 0, peak, 0, maxValue, "theta / deg", "F / mg");
  rotPlot(frame, "#dc2626", function (angle) { return count * Math.tan(angle * Math.PI / 180); }, false);
  rotMarker(frame, theta, count * Math.tan(theta * Math.PI / 180), "#dc2626");
}

function rotNailBasketGraph() {
  var progress = rotProgress();
  var frame = rotGraphFrame("绳张力-调节进度", "B 下移到 C，支路角度减小，张力降低", 0, 1, 0.45, 0.75, "调节进度", "T / Mg");
  rotPlot(frame, "#2563eb", function (ratio) { return rotNailBasketGeometry(ratio).tension; }, false);
  rotMarker(frame, progress, rotNailBasketGeometry(progress).tension, "#f97316");
}

function rotInclineLiftGraph() {
  var progress = rotProgress();
  var frame = rotGraphFrame("支持力-上移进度", "绳与斜面夹角增大，N 单调减小", 0, 1, 0, 1, "上移进度", "N / mg");
  rotPlot(frame, "#2563eb", function (ratio) { return rotInclineLiftGeometry(ratio).normal; }, false);
  rotMarker(frame, progress, rotInclineLiftGeometry(progress).normal, "#f97316");
}

function rotHandcartGraph() {
  var maxAngle = rotParam("maxAngle", 60);
  var angle = maxAngle * rotProgress();
  var frame = rotGraphFrame("双支持力-倾角", "蓝：底板支持力；橙：支架支持力", 0, maxAngle, 0, 1.05, "alpha / deg", "N / mg");
  rotPlot(frame, "#2563eb", function (value) { return Math.cos(value * Math.PI / 180); }, false);
  rotPlot(frame, "#f97316", function (value) { return Math.sin(value * Math.PI / 180); }, false);
  rotMarker(frame, angle, Math.sin(angle * Math.PI / 180), "#f97316");
  rotLegend([{ color: "#2563eb", label: "N底" }, { color: "#f97316", label: "N支" }], 840, 112);
}

function rotCircleGrooveGraph() {
  var maxAngle = Math.max(45, rotParam("angle", 30));
  var angle = rotParam("angle", 30);
  var frame = rotGraphFrame("共同加速度与等效重力", "蓝：a/g；橙：g_eff/g", 0, maxAngle, 0, 1.05, "theta / deg", "归一化量");
  rotPlot(frame, "#2563eb", function (value) { return Math.sin(value * Math.PI / 180); }, false);
  rotPlot(frame, "#f97316", function (value) { return Math.cos(value * Math.PI / 180); }, false);
  rotMarker(frame, angle, Math.sin(angle * Math.PI / 180), "#2563eb");
}

function rotSteelLimit(ratio) {
  return Math.sqrt(Math.max(0, 2 * ratio - ratio * ratio)) / Math.max(0.02, 1 - ratio);
}

function rotSteelCoilGraph() {
  var ratio = constrain(rotParam("contactHeight", 0.4), 0.05, 0.85);
  var frame = rotGraphFrame("允许减速度-接触高度", "a_max/g = sqrt(2h/R-(h/R)^2)/(1-h/R)", 0.05, 0.85, 0, 4, "h / R", "a_max / g");
  rotPlot(frame, "#2563eb", function (value) { return rotSteelLimit(value); }, false);
  rotMarker(frame, ratio, Math.min(4, rotSteelLimit(ratio)), "#dc2626");
}

function rotForceSensorGraph() {
  var duration = rotDuration();
  var time = rotTime();
  var frame = rotGraphFrame("压力传感器 F-t 图", "离地阶段 F = 0，落地时出现峰值", 0, duration, 0, 3, "t / s", "F / mg");
  rotPlot(frame, "#2563eb", function (value) { return rotJumpForceRatio(value); }, false);
  rotMarker(frame, time, rotJumpForceRatio(time), "#ef4444");
}

function rotCableCarZeroAngle() {
  var cableAngle = rotParam("cableAngle", 30) * Math.PI / 180;
  var accel = rotParam("accel", 2);
  return Math.atan2(accel * Math.cos(cableAngle), 10 + accel * Math.sin(cableAngle)) * 180 / Math.PI;
}

function rotCableCarGraph() {
  var zeroAngle = rotCableCarZeroAngle();
  var frame = rotGraphFrame("所需摩擦-接触面角度", "接触面法线对准 -g_eff 时，摩擦降为零", 0, 60, 0, 0.9, "接触面角 / deg", "|f| / mg");
  rotPlot(frame, "#f97316", function (angle) { return Math.abs(Math.sin((angle - zeroAngle) * Math.PI / 180)); }, false);
  rotMarker(frame, zeroAngle, 0, "#22c55e");
}

function rotStackedPlatesGraph() {
  var brake = rotParam("brake", 4);
  var mu = rotParam("mu", 0.25);
  var xMax = Math.max(6, brake * 1.25);
  var frame = rotGraphFrame("摩擦需求-制动加速度", "蓝：a/g；红虚线：mu；交点为共同临界", 0, xMax, 0, Math.max(0.6, mu * 1.5), "a / (m/s^2)", "f / N");
  rotPlot(frame, "#2563eb", function (accel) { return accel / 10; }, false);
  rotPlot(frame, "#dc2626", function () { return mu; }, true);
  rotMarker(frame, Math.min(brake, xMax), Math.min(brake / 10, frame.yMax), "#f97316");
}

function rotSpringCasesGraph() {
  var force = rotParam("force", 30);
  var angle = rotParam("slopeAngle", 30) * Math.PI / 180;
  var first = force / 2;
  var second = first - 10 * Math.sin(angle);
  var third = first - 10;
  var maxValue = Math.max(18, first * 1.15);
  var frame = rotGraphFrame("三种放置的整体加速度", "弹簧伸长量相同；a1 > a2 > a3", 0, 3, 0, maxValue, "情形", "a / (m/s^2)");
  rotGraphBar(frame, 0, 3, first, "#2563eb", "a1");
  rotGraphBar(frame, 1, 3, Math.max(0, second), "#60a5fa", "a2");
  rotGraphBar(frame, 2, 3, Math.max(0, third), "#f97316", "a3");
  rotText("x1 = x2 = x3", 798, 122, "#dc2626", 14, CENTER);
}

function rotBrakingGraph() {
  var speed = rotParam("speed", 10);
  var decel = Math.max(0.1, rotParam("decel", 2));
  var intercept = decel / 2;
  var xIntercept = intercept / speed;
  var frame = rotGraphFrame("x/t^2 - 1/t 图", "直线斜率为 v0，纵截距为 a/2", 0, 0.14, -1.2, 0.5, "1/t / s^-1", "x/t^2");
  rotPlot(frame, "#2563eb", function (inverseTime) { return speed * inverseTime - intercept; }, false);
  rotMarker(frame, xIntercept, 0, "#dc2626");
  rotText("横截距 " + xIntercept.toFixed(2) + " s^-1", 802, 116, "#334155", 12, CENTER);
}

function rotPoliceChaseGraph() {
  var duration = rotDuration();
  var time = rotTime();
  var frame = rotGraphFrame("间距-时间图", "蓝：警车-箱子；橙：货车-警车", 0, duration, 0, 160, "t / s", "间距 / m");
  rotPlot(frame, "#2563eb", function (value) {
    var positions = rotPolicePositions(value);
    return Math.max(0, positions.box - positions.police);
  }, false);
  rotPlot(frame, "#f97316", function (value) {
    var positions = rotPolicePositions(value);
    return Math.max(0, positions.truck - positions.police);
  }, false);
  var current = rotPolicePositions(time);
  rotMarker(frame, time, Math.max(0, current.box - current.police), "#2563eb");
  rotLegend([{ color: "#2563eb", label: "A-C" }, { color: "#f97316", label: "A-B" }], 845, 112);
}

function rotRocketGraph() {
  var duration = rotDuration();
  var time = rotTime();
  var frame = rotGraphFrame("火箭高度-时间图", "3 s 熄火，5.4 s 到最高点，23.4 s 落地", 0, duration, 0, 85, "t / s", "h / m");
  rotPlot(frame, "#2563eb", function (value) { return rotRocketHeight(value); }, false);
  rotMarker(frame, time, rotRocketHeight(time), "#ef4444");
  rotText("Hmax = 81 m", 850, 112, "#334155", 12, CENTER);
}

function rotUnloadingGraph() {
  var time = rotTime();
  var frame = rotGraphFrame("货物与平板车速度-时间图", "蓝：货物；橙：平板车（上车后）", 0, 4, 0, 10, "t / s", "v / (m/s)");
  rotPlot(frame, "#2563eb", function (value) { return rotUnloadingVelocity(value); }, false);
  rotPlot(frame, "#f97316", function (value) {
    if (value < 3.5) return NaN;
    return 12 * (value - 3.5);
  }, false);
  rotMarker(frame, time, rotUnloadingVelocity(time), "#2563eb");
  rotLegend([{ color: "#2563eb", label: "货物" }, { color: "#f97316", label: "平板车" }], 845, 112);
}
