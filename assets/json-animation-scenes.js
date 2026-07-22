// General JSON animation scene and graph renderers.

function drawCodexSceneBadge(label) {
  push();
  noStroke();
  fill("#0f172a");
  rect(24, 22, 214, 30, 7);
  fill("#ffffff");
  textAlign(LEFT, CENTER);
  textSize(14);
  text(label, 36, 37);
  pop();
}

function syncCodexBulletCylinderScene(sceneName) {
  var state = getJsonAnimationState(sceneName);
  var d = Math.max(0.01, getJsonParam(sceneName, "d", 0.2));
  bulletD = d <= 2 ? constrain(d * 750, 80, 220) : constrain(d, 80, 220);
  bulletOmega = Math.max(0.1, getJsonParam(sceneName, "omega", 3));
  bulletPhi = constrain(getJsonBulletPhi(sceneName) * 180 / Math.PI, 10, 160);
  bulletT = Math.min(state.time, bulletTransitTime());
}

function drawJsonPlaceholderScene() {
  var problem = problemDataMap[currentScene] || {};
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("暂未生成动画模型", 28, 30);
  fill("#334155");
  textSize(15);
  text("这道题已经有题干和分步解析，但 animation.type 还不是可绘制模型。", 28, 62);
  fill("#eff6ff");
  stroke("#bfdbfe");
  strokeWeight(2);
  rect(92, 138, 390, 190, 12);
  noStroke();
  fill("#2563eb");
  textAlign(CENTER, CENTER);
  textSize(20);
  text(problem.model || "待补充模型", 287, 218);
  fill("#475569");
  textSize(15);
  text((problem.knowledge || []).slice(0, 4).join(" / ") || "请校对 animation 字段", 287, 252);
}

function drawJsonPlaceholderGraph() {
  drawGraphFrame("模型信息", "右图会在 animation.type 可识别后自动绘制");
  var problem = problemDataMap[currentScene] || {};
  var x = graphLeft + 30;
  var y = 100;
  noStroke();
  textAlign(LEFT, TOP);
  fill("#111827");
  textSize(14);
  text("当前类型：" + (((problem.animation || {}).type) || "none"), x, y);
  fill("#64748b");
  textSize(15);
  text("建议类型：projectile / spring_balance / force_diagram / codex_scene", x, y + 34);
}

function drawJsonProjectileScene() {
  var vx = getJsonParam(currentScene, "vx", 8);
  var height = getJsonParam(currentScene, "height", 20);
  var g = Math.max(0.1, getJsonParam(currentScene, "g", 9.8));
  var state = getJsonAnimationState(currentScene);
  var duration = getJsonDuration(currentScene);
  var tNow = Math.min(state.time, duration);
  var range = vx * duration;
  var groundY = 430;
  var startX = 85;
  var startY = 80;
  var sx = Math.min(8, 440 / Math.max(1, range));
  var sy = (groundY - startY) / Math.max(1, height);
  var x = vx * tNow;
  var y = Math.max(0, height - 0.5 * g * tNow * tNow);
  var ballX = startX + x * sx;
  var ballY = groundY - y * sy;
  var vy = g * tNow;

  stroke("#111827");
  strokeWeight(3);
  line(45, groundY, 545, groundY);
  stroke("#94a3b8");
  strokeWeight(2);
  line(startX, groundY, startX, 60);
  drawArrow(startX, groundY, startX, 64, "#64748b");

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (var i = 0; i <= 120; i++) {
    var t = i * duration / 120;
    vertex(startX + vx * t * sx, groundY - Math.max(0, height - 0.5 * g * t * t) * sy);
  }
  endShape();

  stroke("#cbd5e1");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(startX, startY, ballX, startY);
  line(ballX, startY, ballX, ballY);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#f97316");
  circle(ballX, ballY, 24);
  fill("#ffedd5");
  circle(ballX - 5, ballY - 5, 7);
  drawVectorArrow(ballX, ballY, vx * 5, 0, "#2563eb", "vx");
  drawVectorArrow(ballX, ballY, 0, vy * 5, "#dc2626", "vy");

  noStroke();
  fill("#111827");
  textSize(20);
  textAlign(LEFT, TOP);
  text("JSON 平抛动画", 24, 28);
  fill("#334155");
  textSize(14);
  text("t = " + tNow.toFixed(2) + "s，x = " + x.toFixed(1) + "m，y = " + y.toFixed(1) + "m", 24, 52);
}

function drawJsonProjectileGraph() {
  var vx = getJsonParam(currentScene, "vx", 8);
  var height = getJsonParam(currentScene, "height", 20);
  var g = Math.max(0.1, getJsonParam(currentScene, "g", 9.8));
  var state = getJsonAnimationState(currentScene);
  var tMax = getJsonDuration(currentScene);
  drawGraphFrame("分运动图像", "蓝线：x(t)；红线：下落高度");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var maxValue = Math.max(vx * tMax, height);
  drawSimpleCurve(gx, gy, gw, gh, tMax, maxValue, "#2563eb", function (t) { return vx * t; });
  drawSimpleCurve(gx, gy, gw, gh, tMax, maxValue, "#dc2626", function (t) { return 0.5 * g * t * t; });
  var currentX = map(Math.min(state.time, tMax), 0, tMax, gx, gx + gw);
  stroke("#111827");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(currentX, gy, currentX, gy + gh);
  drawingContext.setLineDash([]);
}

function drawJsonSpringScene() {
  var values = getJsonSpringValues();
  var k = values.k;
  var mass = values.mass;
  var g = values.g;
  var state = getJsonAnimationState(currentScene);
  var extension = mass * g / k;
  var pxExtension = constrain(extension * 900, 30, 210);
  var wave = Math.sin(state.time * 5) * 10 * Math.exp(-state.time * 0.5);
  var topX = 285;
  var topY = 70;
  var bottomY = topY + 125 + pxExtension + wave;
  var massY = bottomY + 40;

  stroke("#111827");
  strokeWeight(5);
  line(160, topY, 410, topY);
  drawSpringCoil(topX, topY, bottomY, 28, 12, "#14b8a6");
  noStroke();
  fill("#2563eb");
  rect(topX - 42, massY - 28, 84, 56, 8);
  fill("#fff");
  textAlign(CENTER, CENTER);
  textSize(14);
  text("m", topX, massY);
  drawVectorArrow(topX, massY + 34, 0, 70, "#dc2626", "G");
  drawVectorArrow(topX, bottomY - 8, 0, -70, "#2563eb", "F");

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("JSON 弹簧动画", 24, 28);
  fill("#334155");
  textSize(14);
  text("平衡伸长量 Δx = mg/k = " + extension.toFixed(3) + " m", 24, 52);
}

function drawJsonSpringGraph() {
  var values = getJsonSpringValues();
  var k = values.k;
  var mass = values.mass;
  var g = values.g;
  var extension = mass * g / k;
  drawGraphFrame("弹簧平衡关系", "蓝线：F = kx；橙点：当前平衡位置");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var xMax = Math.max(0.05, extension * 2.2);
  var fMax = k * xMax;
  drawSimpleCurve(gx, gy, gw, gh, xMax, fMax, "#2563eb", function (x) { return k * x; });
  noStroke();
  fill("#f97316");
  circle(map(extension, 0, xMax, gx, gx + gw), map(mass * g, 0, fMax, gy + gh, gy), 12);
}

function getJsonSpringValues() {
  var g = Math.max(0.1, getJsonParam(currentScene, "g", 9.8));
  var m1 = getJsonParam(currentScene, "m1", NaN);
  var m2 = getJsonParam(currentScene, "m2", NaN);
  var mass = getJsonParam(currentScene, "mass", NaN);
  if (!Number.isFinite(mass)) {
    mass = (Number.isFinite(m1) ? m1 : 0) + (Number.isFinite(m2) ? m2 : 0);
  }
  if (!Number.isFinite(mass) || mass <= 0) {
    mass = 0.5;
  }

  var k = getJsonParam(currentScene, "k", NaN);
  var k1 = getJsonParam(currentScene, "k1", NaN);
  var k2 = getJsonParam(currentScene, "k2", NaN);
  if (!Number.isFinite(k) && Number.isFinite(k1) && Number.isFinite(k2) && k1 > 0 && k2 > 0) {
    k = (k1 * k2) / (k1 + k2);
  }
  if (!Number.isFinite(k) || k <= 0) {
    k = 100;
  }
  return { k: Math.max(1, k), mass: Math.max(0.01, mass), g: g };
}

function drawJsonForceDiagramScene() {
  var animation = problemDataMap[currentScene].animation;
  var angle = getJsonParam(currentScene, "angle", 25) * Math.PI / 180;
  var cx = 285;
  var cy = 275;
  var planeLen = 360;
  var dx = Math.cos(angle) * planeLen / 2;
  var dy = Math.sin(angle) * planeLen / 2;

  stroke("#111827");
  strokeWeight(3);
  line(cx - dx, cy + dy, cx + dx, cy - dy);
  push();
  translate(cx, cy - 34);
  rotate(-angle);
  fill("#e0f2fe");
  stroke("#2563eb");
  strokeWeight(2);
  rectMode(CENTER);
  rect(0, 0, 90, 54, 8);
  pop();

  (animation.forces || []).forEach(function (force) {
    var vector = forceDirectionVector(force.direction, angle);
    var scale = forceVectorScale(force, animation);
    drawVectorArrow(cx, cy - 34, vector.x * scale, vector.y * scale, force.color || "#2563eb", force.label || "");
  });

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("JSON 受力图", 24, 28);
  fill("#334155");
  textSize(14);
  text("调节接触面角度，观察弹力/摩擦力方向如何随接触面变化。", 24, 52);
}

function drawJsonForceDiagramGraph() {
  var animation = problemDataMap[currentScene].animation;
  drawGraphFrame("当前受力上下文", "方向由 animation.forces 结构化描述");
  var x = graphLeft + 28;
  var y = 95;
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  fill("#111827");
  text("力的方向", x, y);
  (animation.forces || []).forEach(function (force, index) {
    fill(force.color || "#2563eb");
    circle(x + 8, y + 42 + index * 34, 10);
    fill("#334155");
    text((force.label || "F") + "：" + force.direction, x + 24, y + 34 + index * 34);
  });
}

function getJsonBulletPhi(sceneName) {
  var raw = getJsonParam(sceneName, "phi", Math.PI / 3);
  if (raw > Math.PI + 0.01) {
    return raw * Math.PI / 180;
  }
  return raw;
}

function getJsonBulletValues(sceneName) {
  var d = Math.max(0.01, getJsonParam(sceneName, "d", 0.2));
  var omega = Math.max(0.1, getJsonParam(sceneName, "omega", 3));
  var phi = constrain(getJsonBulletPhi(sceneName), 0.05, Math.PI - 0.05);
  var delta = Math.PI - phi;
  var time = delta / omega;
  var speed = d / time;
  return { d: d, omega: omega, phi: phi, delta: delta, time: time, speed: speed };
}

function drawJsonBulletCylinderScene() {
  var values = getJsonBulletValues(currentScene);
  var state = getJsonAnimationState(currentScene);
  var cx = 280;
  var cy = 245;
  var r = 142;
  var tMax = getJsonDuration(currentScene);
  var tNow = Math.min(state.time, tMax);
  var progress = tNow / Math.max(0.001, tMax);
  var bulletX = cx - r - 85 + (2 * r + 170) * progress;
  var bulletY = cy;
  var rotateNow = values.omega * tNow;
  var aAng = Math.PI + rotateNow;
  var bAng = values.phi + rotateNow;
  var aX = cx + r * Math.cos(aAng);
  var aY = cy + r * Math.sin(aAng);
  var bX = cx + r * Math.cos(bAng);
  var bY = cy + r * Math.sin(bAng);

  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);

  stroke("#cbd5e1");
  strokeWeight(1);
  for (var i = 0; i < 12; i++) {
    var spoke = rotateNow + i * Math.PI / 6;
    line(cx, cy, cx + r * Math.cos(spoke), cy + r * Math.sin(spoke));
  }

  stroke("#94a3b8");
  strokeWeight(2);
  drawingContext.setLineDash([4, 4]);
  line(cx - r - 96, cy, cx + r + 96, cy);
  drawingContext.setLineDash([]);

  stroke("#2563eb");
  strokeWeight(4);
  line(cx - r, cy, cx + r, cy);
  drawArrow(cx - r - 70, cy, cx - r - 18, cy, "#2563eb");

  noStroke();
  fill("#111827");
  circle(cx, cy, 7);
  fill("#2563eb");
  circle(aX, aY, 11);
  fill("#dc2626");
  circle(bX, bY, 11);
  fill("#f97316");
  circle(bulletX, bulletY, 20);
  fill("#ffedd5");
  circle(bulletX - 5, bulletY - 5, 6);

  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("O", cx + 10, cy - 8);
  text("a", aX + 10, aY - 14);
  text("b", bX + 10, bY - 14);
  text("圆筒转角 Δθ = π - φ", 88, 64);
  text("子弹路程 = d", 88, 86);
  text("v = ωd/(π-φ) = " + values.speed.toFixed(2) + " m/s", 88, 108);

  stroke("#16a34a");
  strokeWeight(2);
  noFill();
  arc(cx, cy, 64, 64, values.phi, Math.PI);
  drawArrow(
    cx + 32 * Math.cos((values.phi + Math.PI) / 2),
    cy + 32 * Math.sin((values.phi + Math.PI) / 2),
    cx + 32 * Math.cos(Math.PI - 0.15),
    cy + 32 * Math.sin(Math.PI - 0.15),
    "#16a34a"
  );
}

function drawJsonBulletCylinderGraph() {
  var values = getJsonBulletValues(currentScene);
  var state = getJsonAnimationState(currentScene);
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var tMax = getJsonDuration(currentScene);
  var angleMax = Math.PI;

  drawGraphFrame("转角-时间图像", "圆筒转到 π-φ 时，子弹刚穿过直径 d");

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (var i = 0; i <= 120; i++) {
    var t = i * tMax / 120;
    vertex(map(t, 0, tMax, gx, gx + gw), map(values.omega * t, 0, angleMax, gy + gh, gy));
  }
  endShape();

  var targetY = map(values.delta, 0, angleMax, gy + gh, gy);
  stroke("#16a34a");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(gx, targetY, gx + gw, targetY);
  drawingContext.setLineDash([]);

  drawTimeMarker(gx, gy, gw, gh, Math.min(state.time, tMax), tMax);

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(14);
  text("t = (π-φ)/ω = " + values.time.toFixed(2) + "s", gx + 14, gy + 12);
  text("v = ωd/(π-φ) = " + values.speed.toFixed(2) + "m/s", gx + 14, gy + 34);
}

function getJsonCircularVariant() {
  return ((problemDataMap[currentScene] || {}).animation || {}).variant || "uniform_circle";
}

function getJsonCircularValues() {
  var omega = Math.max(0.05, getJsonParam(currentScene, "omega", 2.4));
  var radius = Math.max(0.1, getJsonParam(currentScene, "radius", 1.0));
  var theta = getJsonParam(currentScene, "theta", 37) * Math.PI / 180;
  var mu = Math.max(0.01, getJsonParam(currentScene, "mu", 0.4));
  var g = Math.max(0.1, getJsonParam(currentScene, "g", 10));
  var ratio = Math.max(0.2, getJsonParam(currentScene, "ratio", 2.0));
  var massRatio = Math.max(0.2, getJsonParam(currentScene, "massRatio", 2.0));
  var time = getJsonAnimationState(currentScene).time;
  return {
    omega: omega,
    radius: radius,
    theta: theta,
    mu: mu,
    g: g,
    ratio: ratio,
    massRatio: massRatio,
    time: time,
    speed: omega * radius,
    acc: omega * omega * radius
  };
}

function drawJsonCircularConceptScene() {
  var variant = getJsonCircularVariant();
  if (variant === "transmission") {
    drawJsonCircularTransmissionScene();
  } else if (variant === "dart_disk") {
    drawJsonCircularDartDiskScene();
  } else if (variant === "rotating_disk") {
    drawJsonCircularDiskScene();
  } else if (variant === "conical_pendulum" || variant === "funnel_balls" || variant === "rope_cone_limit") {
    drawJsonCircularConicalScene(variant);
  } else if (variant === "friction_limit") {
    drawJsonCircularFrictionScene();
  } else if (variant === "vertical_circle") {
    drawJsonCircularVerticalScene();
  } else if (variant === "two_body_orbit") {
    drawJsonCircularTwoBodyScene();
  } else if (variant === "daily_banked_curve") {
    drawDailyBankedCurveScene();
  } else if (variant === "daily_conical_cylinder") {
    drawDailyConicalCylinderScene();
  } else if (variant === "daily_hilly_road") {
    drawDailyHillyRoadScene();
  } else if (variant === "daily_centrifuge") {
    drawDailyCentrifugeScene();
  } else if (variant === "daily_airplane_turn") {
    drawDailyAirplaneTurnScene();
  } else if (variant === "daily_bicycle_turn") {
    drawDailyBicycleTurnScene();
  } else if (variant === "daily_tube_projectile") {
    drawDailyTubeProjectileScene();
  } else if (variant === "daily_horizontal_bar") {
    drawDailyHorizontalBarScene();
  } else if (variant === "daily_rod_two_balls") {
    drawDailyRodTwoBallsScene();
  } else if (variant === "daily_rattle_drum") {
    drawDailyRattleDrumScene();
  } else if (variant === "daily_turntable_sensor") {
    drawDailyTurntableSensorScene();
  } else if (variant === "daily_car_passengers") {
    drawDailyCarPassengersScene();
  } else if (variant === "daily_bicycle_mud") {
    drawDailyBicycleMudScene();
  } else if (variant === "daily_box_vertical_circle") {
    drawDailyBoxVerticalCircleScene();
  } else if (variant === "daily_string_tension_graph") {
    drawDailyStringTensionScene();
  } else if (variant === "daily_stacked_turntable") {
    drawDailyStackedTurntableScene();
  } else if (variant === "daily_inclined_sand") {
    drawDailyInclinedSandScene();
  } else if (variant === "daily_valve_light") {
    drawDailyValveLightScene();
  } else if (variant === "daily_carrier_turn") {
    drawDailyCarrierTurnScene();
  } else {
    drawJsonCircularDiskScene();
  }
}

function drawJsonCircularConceptGraph() {
  var variant = getJsonCircularVariant();
  if (variant === "transmission") {
    drawJsonCircularTransmissionGraph();
  } else if (variant === "dart_disk") {
    drawJsonCircularDartDiskGraph();
  } else if (variant === "friction_limit") {
    drawJsonCircularFrictionGraph();
  } else if (variant === "conical_pendulum" || variant === "funnel_balls" || variant === "rope_cone_limit") {
    drawJsonCircularConicalGraph(variant);
  } else if (variant === "vertical_circle") {
    drawJsonCircularVerticalGraph();
  } else if (variant === "two_body_orbit") {
    drawJsonCircularTwoBodyGraph();
  } else if (variant === "daily_banked_curve") {
    drawDailyBankedCurveGraph();
  } else if (variant === "daily_conical_cylinder") {
    drawDailyConicalCylinderGraph();
  } else if (variant === "daily_hilly_road") {
    drawDailyHillyRoadGraph();
  } else if (variant === "daily_centrifuge") {
    drawDailyCentrifugeGraph();
  } else if (variant === "daily_airplane_turn") {
    drawDailyAirplaneTurnGraph();
  } else if (variant === "daily_bicycle_turn") {
    drawDailyBicycleTurnGraph();
  } else if (variant === "daily_tube_projectile") {
    drawDailyTubeProjectileGraph();
  } else if (variant === "daily_horizontal_bar") {
    drawDailyHorizontalBarGraph();
  } else if (variant === "daily_rod_two_balls") {
    drawDailyRodTwoBallsGraph();
  } else if (variant === "daily_rattle_drum") {
    drawDailyRattleDrumGraph();
  } else if (variant === "daily_turntable_sensor") {
    drawDailyTurntableSensorGraph();
  } else if (variant === "daily_car_passengers") {
    drawDailyCarPassengersGraph();
  } else if (variant === "daily_bicycle_mud") {
    drawDailyBicycleMudGraph();
  } else if (variant === "daily_box_vertical_circle") {
    drawDailyBoxVerticalCircleGraph();
  } else if (variant === "daily_string_tension_graph") {
    drawDailyStringTensionGraph();
  } else if (variant === "daily_stacked_turntable") {
    drawDailyStackedTurntableGraph();
  } else if (variant === "daily_inclined_sand") {
    drawDailyInclinedSandGraph();
  } else if (variant === "daily_valve_light") {
    drawDailyValveLightGraph();
  } else if (variant === "daily_carrier_turn") {
    drawDailyCarrierTurnGraph();
  } else {
    drawJsonCircularDiskGraph();
  }
}

function drawJsonCircleBody(cx, cy, r, angle, colorHex, labelText) {
  var x = cx + r * Math.cos(angle);
  var y = cy + r * Math.sin(angle);
  noStroke();
  fill(colorHex);
  circle(x, y, 22);
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(14);
  text(labelText || "", x, y);
  return { x: x, y: y };
}

function drawJsonCircularDiskScene() {
  var values = getJsonCircularValues();
  var cx = 285;
  var cy = 245;
  var r = 132;
  var angle = values.omega * values.time - Math.PI / 3;
  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (var i = 0; i < 12; i++) {
    var a = angle + i * Math.PI / 6;
    line(cx, cy, cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  var p = drawJsonCircleBody(cx, cy, r, angle, "#f97316", "P");
  drawVectorArrow(p.x, p.y, -Math.sin(angle) * 62, Math.cos(angle) * 62, "#2563eb", "v");
  drawVectorArrow(p.x, p.y, (cx - p.x) * 0.42, (cy - p.y) * 0.42, "#dc2626", "a");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("匀速圆周运动", 26, 28);
  fill("#334155");
  textSize(14);
  text("速度沿切线，向心加速度始终指向圆心", 26, 54);
  text("v=ωr=" + values.speed.toFixed(2) + "，a=ω²r=" + values.acc.toFixed(2), 26, 78);
}

function drawJsonCircularDiskGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("线速度/向心加速度", "随角速度变化：v=ωr，a=ω²r");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var maxOmega = 6;
  var maxValue = Math.max(maxOmega * values.radius, maxOmega * maxOmega * values.radius);
  drawSimpleCurve(gx, gy, gw, gh, maxOmega, maxValue, "#2563eb", function (w) { return w * values.radius; });
  drawSimpleCurve(gx, gy, gw, gh, maxOmega, maxValue, "#dc2626", function (w) { return w * w * values.radius; });
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.omega, maxOmega), maxOmega);
}

function drawJsonCircularDartDiskScene() {
  var values = getJsonCircularValues();
  var flight = Math.max(0.2, getJsonParam(currentScene, "flight", 1.0));
  var state = getJsonAnimationState(currentScene);
  var tNow = Math.min(state.time, flight);
  var progress = tNow / flight;
  var diskX = 410;
  var diskY = 245;
  var diskR = 96;
  var startX = 70;
  var startY = diskY - diskR;
  var dartX = startX + (diskX - startX) * progress;
  var dartY = startY + 78 * progress * progress;
  var angle = values.omega * tNow - Math.PI / 2;

  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(diskX, diskY, 2 * diskR);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (var i = 0; i < 8; i++) {
    var a = angle + i * Math.PI / 4;
    line(diskX, diskY, diskX + diskR * Math.cos(a), diskY + diskR * Math.sin(a));
  }
  var targetX = diskX + diskR * Math.cos(angle);
  var targetY = diskY + diskR * Math.sin(angle);
  noStroke();
  fill("#dc2626");
  circle(targetX, targetY, 18);
  fill("#111827");
  circle(diskX, diskY, 7);

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 80; i++) {
    var p = i / 80;
    vertex(startX + (diskX - startX) * p, startY + 78 * p * p);
  }
  endShape();
  drawArrow(dartX - 38, dartY, dartX + 20, dartY, "#2563eb");
  noStroke();
  fill("#f97316");
  triangle(dartX + 20, dartY, dartX - 12, dartY - 8, dartX - 12, dartY + 8);

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("飞镖与转盘同步", 28, 28);
  fill("#334155");
  textSize(14);
  text("飞镖飞行时间 t=L/v₀；圆盘需转到目标点", 28, 54);
  text("当前转角 ωt=" + (values.omega * tNow).toFixed(2) + " rad", 28, 78);
}

function drawJsonCircularDartDiskGraph() {
  var values = getJsonCircularValues();
  var flight = Math.max(0.2, getJsonParam(currentScene, "flight", 1.0));
  var state = getJsonAnimationState(currentScene);
  drawGraphFrame("飞行时间与转角条件", "命中要求：ωt=(2n+1)π 或题设对应目标角");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var angleMax = Math.max(Math.PI * 2, values.omega * flight * 1.2);
  drawSimpleCurve(gx, gy, gw, gh, flight, angleMax, "#2563eb", function (t) { return values.omega * t; });
  stroke("#dc2626");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  var targetY = map(Math.PI, 0, angleMax, gy + gh, gy);
  line(gx, targetY, gx + gw, targetY);
  drawingContext.setLineDash([]);
  drawTimeMarker(gx, gy, gw, gh, Math.min(state.time, flight), flight);
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(14);
  text("t=" + flight.toFixed(2) + "s，ωt=" + (values.omega * flight).toFixed(2) + "rad", gx + 12, gy + 12);
}

function drawJsonCircularTransmissionScene() {
  var values = getJsonCircularValues();
  var leftX = 190;
  var rightX = 398;
  var cy = 250;
  var r1 = 96;
  var r2 = Math.max(36, r1 / values.ratio);
  var a1 = values.omega * values.time;
  var a2 = values.omega * values.ratio * values.time;
  stroke("#64748b");
  strokeWeight(7);
  line(leftX, cy - r1, rightX, cy - r2);
  line(leftX, cy + r1, rightX, cy + r2);
  drawJsonGear(leftX, cy, r1, a1, "#2563eb", "主动轮");
  drawJsonGear(rightX, cy, r2, -a2, "#f97316", "从动轮");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("传动关系", 28, 28);
  fill("#334155");
  textSize(14);
  text("皮带/啮合处线速度相等：ω₁r₁=ω₂r₂", 28, 54);
  text("半径比 r₁:r₂=" + values.ratio.toFixed(1) + ":1，角速度反比", 28, 78);
}

function drawJsonGear(cx, cy, r, angle, colorHex, labelText) {
  stroke(colorHex);
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (var i = 0; i < 10; i++) {
    var a = angle + i * Math.PI / 5;
    line(cx, cy, cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  noStroke();
  fill(colorHex);
  circle(cx, cy, 10);
  fill("#111827");
  textAlign(CENTER, TOP);
  textSize(14);
  text(labelText, cx, cy + r + 12);
}

function drawJsonCircularTransmissionGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("传动量比较", "同轴看角速度；接触/皮带/啮合看线速度");
  var gx = graphLeft + 66;
  var base = 390;
  var scale = 54;
  var v1 = values.omega * values.ratio;
  var v2 = values.omega * values.ratio;
  var w1 = values.omega;
  var w2 = values.omega * values.ratio;
  drawBar(gx, base, 44, w1 * scale / 3, "#2563eb", "ω₁");
  drawBar(gx + 70, base, 44, w2 * scale / 3, "#f97316", "ω₂");
  drawBar(gx + 170, base, 44, v1 * scale / 3, "#16a34a", "v₁");
  drawBar(gx + 240, base, 44, v2 * scale / 3, "#16a34a", "v₂");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(14);
  text("线速度相等，角速度与半径成反比", gx, 92);
}

function drawJsonCircularConicalScene(variant) {
  var values = getJsonCircularValues();
  var cx = 285;
  var topY = 78;
  var centerY = 310;
  var orbitR = 120 * Math.sin(values.theta);
  var angle = values.omega * values.time;
  var ballX = cx + orbitR * Math.cos(angle);
  var ballY = centerY + 20 * Math.sin(angle);
  if (variant === "funnel_balls") {
    stroke("#94a3b8");
    strokeWeight(3);
    line(cx - 150, centerY + 80, cx, topY);
    line(cx + 150, centerY + 80, cx, topY);
  }
  stroke("#2563eb");
  strokeWeight(3);
  line(cx, topY, ballX, ballY);
  stroke("#cbd5e1");
  strokeWeight(1.5);
  noFill();
  ellipse(cx, centerY, 2 * orbitR, 42);
  var p = drawJsonCircleBody(cx, centerY, orbitR, angle, "#f97316", "m");
  p.y = ballY;
  drawVectorArrow(ballX, ballY, (cx - ballX) * 0.45, (centerY - ballY) * 0.45, "#dc2626", "a");
  drawVectorArrow(ballX, ballY, 0, 64, "#64748b", "G");
  drawVectorArrow(ballX, ballY, (cx - ballX) * 0.34, (topY - ballY) * 0.34, "#2563eb", "T/N");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text(variant === "rope_cone_limit" ? "双绳/圆锥面临界" : "圆锥摆模型", 28, 28);
  fill("#334155");
  textSize(14);
  text("水平合力提供向心力，竖直方向平衡", 28, 54);
  text("tanθ = a/g，a=" + values.acc.toFixed(2), 28, 78);
}

function drawJsonCircularConicalGraph(variant) {
  var values = getJsonCircularValues();
  drawGraphFrame("角速度-夹角关系", "θ 越大，需要的水平向心加速度越大");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var g = values.g;
  drawSimpleCurve(gx, gy, gw, gh, 70, 20, "#2563eb", function (deg) {
    return g * Math.tan(deg * Math.PI / 180);
  });
  var thetaDeg = values.theta * 180 / Math.PI;
  drawTimeMarker(gx, gy, gw, gh, thetaDeg, 70);
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(14);
  text((variant === "rope_cone_limit" ? "临界看某根绳/支持力是否为 0" : "同高圆锥摆满足 ω²=g/h"), gx + 12, gy + 14);
}

function drawJsonCircularFrictionScene() {
  var values = getJsonCircularValues();
  var cx = 285;
  var cy = 248;
  var rInner = 86;
  var rOuter = 150;
  var angle = values.omega * values.time;
  stroke("#111827");
  strokeWeight(3);
  noFill();
  ellipse(cx, cy, 2 * rOuter, 2 * rOuter);
  ellipse(cx, cy, 2 * rInner, 2 * rInner);
  var p1 = drawJsonCircleBody(cx, cy, rInner, angle, "#2563eb", "A");
  var p2 = drawJsonCircleBody(cx, cy, rOuter, angle + 0.5, "#f97316", "C");
  drawVectorArrow(p1.x, p1.y, (cx - p1.x) * 0.42, (cy - p1.y) * 0.42, "#16a34a", "f");
  drawVectorArrow(p2.x, p2.y, (cx - p2.x) * 0.42, (cy - p2.y) * 0.42, "#dc2626", "f");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("摩擦提供向心力", 28, 28);
  fill("#334155");
  textSize(14);
  text("所需 f=mω²r；r 越大越先达到最大静摩擦", 28, 54);
  text(values.omega * values.omega * values.radius > values.mu * values.g ? "当前：已超过临界" : "当前：未到临界", 28, 78);
}

function drawJsonCircularFrictionGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("所需摩擦-半径", "蓝线：mω²r；红线：最大静摩擦 μmg");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var rMax = 2;
  var yMax = Math.max(values.omega * values.omega * rMax, values.mu * values.g) * 1.2;
  drawSimpleCurve(gx, gy, gw, gh, rMax, yMax, "#2563eb", function (r) { return values.omega * values.omega * r; });
  stroke("#dc2626");
  strokeWeight(2);
  var y = map(values.mu * values.g, 0, yMax, gy + gh, gy);
  line(gx, y, gx + gw, y);
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.radius, rMax), rMax);
}

function drawJsonCircularVerticalScene() {
  var values = getJsonCircularValues();
  var cx = 285;
  var cy = 245;
  var r = 130;
  var angle = values.omega * values.time - Math.PI / 2;
  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#2563eb");
  strokeWeight(3);
  line(cx, cy, cx + r * Math.cos(angle), cy + r * Math.sin(angle));
  var p = drawJsonCircleBody(cx, cy, r, angle, "#f97316", "m");
  drawVectorArrow(p.x, p.y, (cx - p.x) * 0.45, (cy - p.y) * 0.45, "#dc2626", "a");
  drawVectorArrow(p.x, p.y, 0, 62, "#64748b", "G");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("竖直圆周运动", 28, 28);
  fill("#334155");
  textSize(14);
  text("碰钉/骤停：速度瞬时不变，半径变小则 ω、a、T 变大", 28, 54);
  text("a=ω²r=" + values.acc.toFixed(2), 28, 78);
}

function drawJsonCircularVerticalGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("拉力/支持力随位置变化", "最低点最大，最高点最小；半径改变会使向心项改变");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = values.g + values.omega * values.omega * values.radius * 1.5;
  drawSimpleCurve(gx, gy, gw, gh, 2 * Math.PI, yMax, "#2563eb", function (a) {
    return values.g + values.omega * values.omega * values.radius * (1 + Math.sin(a)) / 2;
  });
  drawTimeMarker(gx, gy, gw, gh, (values.omega * values.time) % (2 * Math.PI), 2 * Math.PI);
}

function drawJsonCircularTwoBodyScene() {
  var values = getJsonCircularValues();
  var cx = 285;
  var cy = 250;
  var total = 210;
  var rHeavy = total / (1 + values.massRatio);
  var rLight = total - rHeavy;
  var angle = values.omega * values.time;
  var heavy = drawJsonCircleBody(cx, cy, rHeavy, angle + Math.PI, "#2563eb", "男");
  var light = drawJsonCircleBody(cx, cy, rLight, angle, "#f97316", "女");
  stroke("#111827");
  strokeWeight(2.5);
  line(heavy.x, heavy.y, light.x, light.y);
  noStroke();
  fill("#111827");
  circle(cx, cy, 8);
  textAlign(LEFT, TOP);
  textSize(20);
  text("双人牵连圆周运动", 28, 28);
  fill("#334155");
  textSize(14);
  text("拉力相等、角速度相同；m₁r₁=m₂r₂", 28, 54);
  text("半径比约 r重:r轻=1:" + values.massRatio.toFixed(1), 28, 78);
}

function drawJsonCircularTwoBodyGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("半径与速度比较", "同一角速度下，v=ωr；质量大者半径小、速度小");
  var gx = graphLeft + 80;
  var base = 390;
  var total = 1;
  var rHeavy = total / (1 + values.massRatio);
  var rLight = total - rHeavy;
  drawBar(gx, base, 58, rHeavy * 220, "#2563eb", "r重");
  drawBar(gx + 100, base, 58, rLight * 220, "#f97316", "r轻");
  drawBar(gx + 230, base, 58, rHeavy * values.omega * 220, "#93c5fd", "v重");
  drawBar(gx + 330, base, 58, rLight * values.omega * 220, "#fdba74", "v轻");
}

function drawBar(x, baseY, w, h, colorHex, labelText) {
  var graphFrameLeft = graphLeft + 50;
  var graphFrameRight = graphRight - 40;
  var graphFrameTop = 82;
  var clippedX = constrain(x, graphFrameLeft, graphFrameRight);
  var clippedRight = constrain(x + w, graphFrameLeft, graphFrameRight);
  var clippedW = clippedRight - clippedX;
  if (clippedW <= 0) {
    return;
  }
  var bh = Math.max(6, Math.min(baseY - graphFrameTop, 280, h));
  noStroke();
  fill(colorHex);
  rect(clippedX, baseY - bh, clippedW, bh, 5);
  fill("#111827");
  textAlign(CENTER, TOP);
  textSize(14);
  text(labelText, constrain(x + w / 2, graphFrameLeft + 8, graphFrameRight - 8), baseY + 8);
}

function drawGraphFrame(title, subtitle) {
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text(title, graphLeft + 24, 22);
  fill("#334155");
  textSize(14);
  text(subtitle, graphLeft + 24, 48);
  stroke("#cbd5e1");
  strokeWeight(1);
  noFill();
  rect(gx, gy, gw, gh);
  stroke("#e5e7eb");
  for (var i = 0; i <= 4; i++) {
    line(gx, gy + i * gh / 4, gx + gw, gy + i * gh / 4);
    line(gx + i * gw / 4, gy, gx + i * gw / 4, gy + gh);
  }
}

function drawSimpleCurve(gx, gy, gw, gh, xMax, yMax, colorHex, fn) {
  xMax = Math.max(0.0001, xMax);
  yMax = Math.max(0.0001, yMax);
  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  beginShape();
  for (var i = 0; i <= 120; i++) {
    var x = i * xMax / 120;
    var y = fn(x);
    if (!isFinite(y)) {
      y = 0;
    }
    vertex(
      constrain(map(x, 0, xMax, gx, gx + gw), gx, gx + gw),
      constrain(map(y, 0, yMax, gy + gh, gy), gy, gy + gh)
    );
  }
  endShape();
}

function drawSpringCoil(x, y1, y2, radius, turns, colorHex) {
  noFill();
  stroke(colorHex);
  strokeWeight(3);
  beginShape();
  vertex(x, y1);
  for (var i = 0; i <= turns * 12; i++) {
    var p = i / (turns * 12);
    var y = lerp(y1 + 14, y2 - 14, p);
    var xOffset = Math.sin(p * Math.PI * turns * 2) * radius;
    vertex(x + xOffset, y);
  }
  vertex(x, y2);
  endShape();
}

function forceDirectionVector(direction, angle) {
  direction = String(direction || "").toLowerCase();
  if (direction === "down") {
    return { x: 0, y: 1 };
  }
  if (direction === "up") {
    return { x: 0, y: -1 };
  }
  if (direction === "normal") {
    return { x: -Math.sin(angle), y: -Math.cos(angle) };
  }
  if (direction === "up-left" || direction === "upleft") {
    return { x: -0.7, y: -0.7 };
  }
  if (direction === "up-right" || direction === "upright") {
    return { x: 0.7, y: -0.7 };
  }
  if (direction === "down-left" || direction === "downleft") {
    return { x: -0.7, y: 0.7 };
  }
  if (direction === "down-right" || direction === "downright") {
    return { x: 0.7, y: 0.7 };
  }
  if (direction === "surface" || direction === "up_slope") {
    return { x: Math.cos(angle), y: -Math.sin(angle) };
  }
  if (direction === "down_slope") {
    return { x: -Math.cos(angle), y: Math.sin(angle) };
  }
  if (direction === "left") {
    return { x: -1, y: 0 };
  }
  if (direction === "right") {
    return { x: 1, y: 0 };
  }
  return { x: 0.75, y: -0.45 };
}

function forceVectorScale(force, animation) {
  var label = String(force.label || "").replace(/[^0-9A-Za-z_]/g, "");
  var params = animation.params || {};
  if (params[label]) {
    var value = Math.abs(getJsonParam(currentScene, label, params[label].value || 0));
    var maxValue = Math.max(1, Math.abs(Number(params[label].max || value || 1)));
    return 48 + 72 * Math.min(1, value / maxValue);
  }
  if (/wall/i.test(label) && params.F) {
    var fValue = Math.abs(getJsonParam(currentScene, "F", params.F.value || 0));
    var fMax = Math.max(1, Math.abs(Number(params.F.max || fValue || 1)));
    return 35 + 65 * Math.min(1, fValue / fMax);
  }
  return 95;
}
