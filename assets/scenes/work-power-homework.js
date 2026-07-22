// Homework scenes for work and power.
function drawLesson10TiltingTruckScene() {
  var maxAngle = wpParam("angle", 35) * Math.PI / 180;
  var arm = wpParam("arm", 3);
  var theta = maxAngle * wpProgress();
  var hingeX = 92;
  var hingeY = 380;
  var length = 350;
  var endX = hingeX + length * Math.cos(theta);
  var endY = hingeY - length * Math.sin(theta);
  wpGround(408);
  fill("#475569");
  noStroke();
  rect(56, 380, 462, 28, 6);
  fill("#dbeafe");
  stroke("#2563eb");
  strokeWeight(8);
  line(hingeX, hingeY, endX, endY);
  var blockR = 0.68;
  var bx = hingeX + length * blockR * Math.cos(theta);
  var by = hingeY - length * blockR * Math.sin(theta);
  push();
  translate(bx, by);
  rotate(-theta);
  fill("#f97316");
  stroke("#c2410c");
  rect(-30, -48, 60, 46, 5);
  pop();
  var normalX = -Math.sin(theta);
  var normalY = -Math.cos(theta);
  wpArrow(bx, by - 28, bx + 70 * normalX, by + 70 * normalY, "#2563eb", "N");
  wpArrow(bx, by - 28, bx + 70 * Math.cos(theta), by - 28 - 70 * Math.sin(theta), "#7c3aed", "f");
  wpText("货物随车厢绕铰点转动", 28, 30, "#0f172a", 18, LEFT);
  wpText("θ = " + (theta * 180 / Math.PI).toFixed(1) + "°", 28, 470, "#334155", 14, LEFT);
  wpText("摩擦力 ⟂ 瞬时位移", 420, 470, "#7c3aed", 14, RIGHT);
}

function drawLesson10TiltingTruckGraph() {
  var maxAngle = wpParam("angle", 35);
  var mass = wpParam("mass", 100);
  var arm = wpParam("arm", 3);
  var g = 10;
  var normalWorkAt = function (degrees) {
    return mass * g * arm * Math.sin(degrees * Math.PI / 180);
  };
  var frame = wpAxes("车厢两种力的累计功", "θ / °", "W / J", 0, maxAngle, 0, normalWorkAt(maxAngle));
  wpPlot(frame, "#2563eb", normalWorkAt);
  wpPlot(frame, "#7c3aed", function () { return 0; });
  var now = maxAngle * wpProgress();
  wpMarker(frame, now, normalWorkAt(now), "#2563eb");
  wpLegend([
    { color: "#2563eb", label: "支持力：正功" },
    { color: "#7c3aed", label: "摩擦力：零功" }
  ], 830, 106);
}

function lesson10SliderWorkAt(rise) {
  var force = wpParam("force", 20);
  var offset = wpParam("offset", 2);
  var step = wpParam("step", 1);
  var startVertical = 3 * step;
  var initialLength = Math.sqrt(offset * offset + startVertical * startVertical);
  var vertical = Math.max(step, startVertical - rise);
  return force * (initialLength - Math.sqrt(offset * offset + vertical * vertical));
}

function drawLesson10VerticalSliderScene() {
  var p = wpProgress();
  var rise = 2 * wpParam("step", 1) * p;
  var rodX = 130;
  var pulleyX = 420;
  var pulleyY = 86;
  var sliderY = lerp(398, 196, p);
  stroke("#64748b");
  strokeWeight(7);
  line(rodX, 82, rodX, 430);
  fill("#e2e8f0");
  stroke("#475569");
  circle(pulleyX, pulleyY, 42);
  stroke("#0f172a");
  strokeWeight(2);
  line(rodX, sliderY, pulleyX - 18, pulleyY + 10);
  line(pulleyX + 20, pulleyY, 518, 188);
  fill("#f97316");
  stroke("#c2410c");
  rect(105, sliderY - 28, 50, 56, 6);
  wpArrow(155, sliderY - 8, 224, sliderY - 56, "#2563eb", "T");
  wpText("A", 92, 398, "#475569", 13, RIGHT);
  wpText("B", 92, 297, "#475569", 13, RIGHT);
  wpText("C", 92, 196, "#475569", 13, RIGHT);
  wpText("滑块越高，绳与速度夹角越大", 28, 30, "#0f172a", 18, LEFT);
  wpText("上升距离 = " + rise.toFixed(2) + " m", 28, 470, "#334155", 14, LEFT);
}

function drawLesson10VerticalSliderGraph() {
  var step = wpParam("step", 1);
  var maxRise = 2 * step;
  var frame = wpAxes("绳拉力累计做功", "上升距离 / m", "W / J", 0, maxRise, 0, lesson10SliderWorkAt(maxRise));
  wpPlot(frame, "#2563eb", lesson10SliderWorkAt);
  var splitX = wpGX(frame, step);
  stroke("#94a3b8");
  drawingContext.setLineDash([4, 4]);
  line(splitX, frame.top, splitX, frame.bottom);
  drawingContext.setLineDash([]);
  wpText("B", splitX, frame.top + 16, "#475569", 12, CENTER);
  var now = maxRise * wpProgress();
  wpMarker(frame, now, lesson10SliderWorkAt(now), "#dc2626");
}

function lesson10WalkingProgress(minute) {
  var total = wpParam("minutes", 20);
  var pause = Math.min(2, total * 0.25);
  var pauseStart = total / 2 - pause / 2;
  var pauseEnd = pauseStart + pause;
  var activeTotal = total - pause;
  var activeTime;
  if (minute <= pauseStart) {
    activeTime = minute;
  } else if (minute <= pauseEnd) {
    activeTime = pauseStart;
  } else {
    activeTime = minute - pause;
  }
  return constrain(activeTime / Math.max(0.1, activeTotal), 0, 1);
}

function drawLesson10WalkingScene() {
  var mass = wpParam("mass", 60);
  var distance = wpParam("distance", 2000);
  var steps = wpParam("steps", 2995);
  var minute = wpParam("minutes", 20) * wpProgress();
  var progress = lesson10WalkingProgress(minute);
  var x = 84 + 390 * progress;
  var bob = 8 * Math.abs(Math.sin(progress * Math.PI * 14));
  wpGround(410);
  stroke("#334155");
  strokeWeight(4);
  line(x, 286 - bob, x, 354);
  line(x, 322, x - 25, 350);
  line(x, 322, x + 27, 344);
  line(x, 354, x - 22, 405);
  line(x, 354, x + 28, 405);
  fill("#f8fafc");
  stroke("#334155");
  circle(x, 264 - bob, 38);
  stroke("#cbd5e1");
  for (var i = 0; i < 8; i += 1) {
    var footprintX = 72 + i * 62;
    line(footprintX, 422, footprintX + 18, 422);
  }
  var stepLength = distance / steps;
  var stepWork = mass * 10 * 0.1 * stepLength;
  wpArrow(x + 44, 302 - bob, x + 44, 264 - bob, "#dc2626", "重心升高");
  wpText("步行重心周期性升降", 28, 30, "#0f172a", 18, LEFT);
  wpText("每步约 " + stepWork.toFixed(1) + " J", 28, 470, "#334155", 14, LEFT);
  wpText("经过 " + minute.toFixed(1) + " min", 420, 470, "#2563eb", 14, RIGHT);
}

function drawLesson10WalkingGraph() {
  var mass = wpParam("mass", 60);
  var distance = wpParam("distance", 2000);
  var total = wpParam("minutes", 20);
  var totalWork = mass * 10 * 0.1 * distance;
  var frame = wpAxes("累计克服重力做功", "时间 / min", "W / J", 0, total, 0, totalWork);
  wpPlot(frame, "#2563eb", function (minute) {
    return totalWork * lesson10WalkingProgress(minute);
  });
  var now = total * wpProgress();
  wpMarker(frame, now, totalWork * lesson10WalkingProgress(now), "#dc2626");
  wpText("平段表示等红灯", 790, 58, "#7c3aed", 13, CENTER);
}

function wpMiniAxes(title, xLabel, yLabel, top, bottom, xMin, xMax, yMin, yMax) {
  var frame = { left: 632, right: 968, top: top, bottom: bottom, xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax };
  fill("#ffffff");
  stroke("#cbd5e1");
  rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  wpText(title, 800, top - 20, "#0f172a", 14, CENTER);
  wpText(yLabel, 596, top + 12, "#475569", 11, CENTER);
  wpText(xLabel, frame.right - 8, bottom - 10, "#475569", 11, RIGHT);
  for (var i = 0; i <= 2; i += 1) {
    var px = map(i, 0, 2, frame.left, frame.right);
    var py = map(i, 0, 2, frame.bottom, frame.top);
    stroke("#94a3b8");
    line(px, bottom, px, bottom + 4);
    line(frame.left - 4, py, frame.left, py);
    wpText(wpNumber(map(i, 0, 2, xMin, xMax)), px, bottom + 14, "#64748b", 10, CENTER);
    wpText(wpNumber(map(i, 0, 2, yMin, yMax)), frame.left - 8, py, "#64748b", 10, RIGHT);
  }
  return frame;
}

function lesson10EvSpeed(t) {
  var ramp = wpParam("rampTime", 5);
  var switchSpeed = wpParam("switchSpeed", 5);
  if (t <= ramp) {
    return switchSpeed * t / ramp;
  }
  var limit = switchSpeed * 2;
  return switchSpeed + (limit - switchSpeed) * (1 - Math.exp(-(t - ramp) / 4));
}

function lesson10EvPower(t) {
  var rated = wpParam("ratedPower", 15);
  var ramp = wpParam("rampTime", 5);
  return rated * Math.min(1, t / ramp);
}

function drawLesson10EvGraphScene() {
  var speed = lesson10EvSpeed(wpTime());
  var x = 70 + 270 * wpProgress();
  wpGround(378);
  fill("#0f766e");
  stroke("#115e59");
  rect(x, 302, 126, 54, 9);
  rect(x + 30, 274, 64, 34, 8);
  fill("#0f172a");
  circle(x + 28, 360, 30);
  circle(x + 100, 360, 30);
  wpArrow(x + 124, 318, x + 188, 318, "#dc2626", "牵引力");
  wpText("功率先线性增加，再保持恒定", 28, 30, "#0f172a", 18, LEFT);
  wpText("v = " + speed.toFixed(2) + " m/s", 28, 470, "#2563eb", 14, LEFT);
  wpText("P = " + lesson10EvPower(wpTime()).toFixed(1) + " kW", 420, 470, "#dc2626", 14, RIGHT);
}

function drawLesson10EvGraphGraph() {
  var duration = wpDuration();
  var rated = wpParam("ratedPower", 15);
  var speedMax = lesson10EvSpeed(duration);
  var powerFrame = wpMiniAxes("图甲：牵引功率", "t / s", "P/kW", 66, 214, 0, duration, 0, rated);
  wpPlot(powerFrame, "#dc2626", lesson10EvPower);
  var speedFrame = wpMiniAxes("图乙：瞬时速度", "t / s", "v", 296, 444, 0, duration, 0, speedMax);
  wpPlot(speedFrame, "#2563eb", lesson10EvSpeed);
  var now = wpTime();
  wpMarker(powerFrame, now, lesson10EvPower(now), "#dc2626");
  wpMarker(speedFrame, now, lesson10EvSpeed(now), "#2563eb");
}

function lesson10AccelAtInverse(inverseSpeed) {
  var power = wpParam("power", 120) * 1000;
  var mass = wpParam("mass", 2000);
  var resistance = wpParam("resistance", 2000);
  var maxForce = wpParam("maxForce", 8000);
  var constantAccel = (maxForce - resistance) / mass;
  return Math.max(0, Math.min(constantAccel, power * inverseSpeed / mass - resistance / mass));
}

function drawLesson10AccelReciprocalScene() {
  var power = wpParam("power", 120) * 1000;
  var resistance = wpParam("resistance", 2000);
  var maxSpeed = power / resistance;
  var speed = Math.max(1, maxSpeed * wpProgress());
  var accel = lesson10AccelAtInverse(1 / speed);
  var x = 72 + 265 * wpProgress();
  wpGround(378);
  fill("#7c3aed");
  stroke("#6d28d9");
  rect(x, 304, 120, 52, 8);
  fill("#0f172a");
  circle(x + 28, 360, 30);
  circle(x + 96, 360, 30);
  wpArrow(x + 118, 320, x + 178, 320, "#dc2626", "F");
  wpText("a 与 1/v 的分段关系", 28, 30, "#0f172a", 18, LEFT);
  wpText("v = " + speed.toFixed(1) + " m/s", 28, 470, "#2563eb", 14, LEFT);
  wpText("a = " + accel.toFixed(2) + " m/s²", 420, 470, "#dc2626", 14, RIGHT);
}

function drawLesson10AccelReciprocalGraph() {
  var power = wpParam("power", 120) * 1000;
  var resistance = wpParam("resistance", 2000);
  var maxForce = wpParam("maxForce", 8000);
  var mass = wpParam("mass", 2000);
  var switchSpeed = power / maxForce;
  var maxSpeed = power / resistance;
  var xMax = 1 / Math.max(1, switchSpeed * 0.65);
  var yMax = (maxForce - resistance) / mass;
  var frame = wpAxes("加速度与速度倒数", "1/v / (s/m)", "a / (m/s²)", 0, xMax, 0, yMax * 1.08);
  wpPlot(frame, "#7c3aed", lesson10AccelAtInverse);
  var speed = Math.max(1, maxSpeed * wpProgress());
  var inverse = 1 / speed;
  wpMarker(frame, inverse, lesson10AccelAtInverse(inverse), "#dc2626");
}

function lesson10ElevatorWorks(t) {
  var mass = wpParam("mass", 2);
  var accel = wpParam("accel", 5);
  var theta = wpParam("angle", 30) * Math.PI / 180;
  var g = wpParam("g", 10);
  var distance = 0.5 * accel * t * t;
  var normalWork = mass * (g + accel) * distance * Math.cos(theta) * Math.cos(theta);
  var frictionWork = mass * (g + accel) * distance * Math.sin(theta) * Math.sin(theta);
  var gravityWork = -mass * g * distance;
  return {
    distance: distance,
    normal: normalWork,
    friction: frictionWork,
    gravity: gravityWork,
    net: normalWork + frictionWork + gravityWork
  };
}

function drawLesson10ElevatorScene() {
  var theta = wpParam("angle", 30) * Math.PI / 180;
  var values = lesson10ElevatorWorks(wpTime());
  var lift = 105 * wpProgress();
  fill("#f8fafc");
  stroke("#475569");
  strokeWeight(4);
  rect(66, 132 - lift, 454, 286);
  var ox = 132;
  var oy = 374 - lift;
  var length = 265;
  stroke("#2563eb");
  strokeWeight(7);
  line(ox, oy, ox + length * Math.cos(theta), oy - length * Math.sin(theta));
  var bx = ox + length * 0.58 * Math.cos(theta);
  var by = oy - length * 0.58 * Math.sin(theta);
  push();
  translate(bx, by);
  rotate(-theta);
  fill("#f97316");
  stroke("#c2410c");
  rect(-27, -44, 54, 42, 5);
  pop();
  wpArrow(492, 332 - lift, 492, 252 - lift, "#0f766e", "a");
  wpArrow(bx, by - 25, bx - 52 * Math.sin(theta), by - 25 - 52 * Math.cos(theta), "#2563eb", "N");
  wpArrow(bx, by - 25, bx + 60 * Math.cos(theta), by - 25 - 60 * Math.sin(theta), "#7c3aed", "f");
  wpText("物块随升降机竖直加速上升", 28, 30, "#0f172a", 18, LEFT);
  wpText("s = " + values.distance.toFixed(1) + " m", 28, 470, "#334155", 14, LEFT);
  wpText("W合 = " + values.net.toFixed(0) + " J", 420, 470, "#dc2626", 14, RIGHT);
}

function drawLesson10ElevatorGraph() {
  var duration = wpDuration();
  var end = lesson10ElevatorWorks(duration);
  var yMin = end.gravity * 1.08;
  var yMax = Math.max(end.normal, end.friction, end.net) * 1.08;
  var frame = wpAxes("升降机内各力累计做功", "t / s", "W / J", 0, duration, yMin, yMax);
  wpPlot(frame, "#2563eb", function (t) { return lesson10ElevatorWorks(t).normal; });
  wpPlot(frame, "#7c3aed", function (t) { return lesson10ElevatorWorks(t).friction; });
  wpPlot(frame, "#f97316", function (t) { return lesson10ElevatorWorks(t).gravity; });
  wpPlot(frame, "#dc2626", function (t) { return lesson10ElevatorWorks(t).net; });
  var now = wpTime();
  wpMarker(frame, now, lesson10ElevatorWorks(now).net, "#dc2626");
  wpLegend([
    { color: "#2563eb", label: "支持力" },
    { color: "#7c3aed", label: "摩擦力" },
    { color: "#f97316", label: "重力" },
    { color: "#dc2626", label: "合力" }
  ], 852, 104);
}

function lesson10CarInverseValues() {
  var power = wpParam("power", 50) * 1000;
  var maxForce = wpParam("maxForce", 5000);
  var resistance = wpParam("resistance", 2000);
  return {
    power: power,
    maxForce: maxForce,
    resistance: resistance,
    switchSpeed: power / maxForce,
    maxSpeed: power / resistance
  };
}

function drawLesson10CarInverseForceScene() {
  var values = lesson10CarInverseValues();
  var speed = Math.max(0.5, values.maxSpeed * wpProgress());
  var traction = Math.min(values.maxForce, values.power / speed);
  var x = 72 + 265 * wpProgress();
  wpGround(378);
  fill(speed <= values.switchSpeed ? "#f97316" : "#0f766e");
  stroke("#334155");
  rect(x, 304, 120, 52, 8);
  fill("#0f172a");
  circle(x + 28, 360, 30);
  circle(x + 96, 360, 30);
  wpArrow(x + 118, 320, x + 180, 320, "#dc2626", "F");
  wpText("v - 1/F 图像的两阶段启动", 28, 30, "#0f172a", 18, LEFT);
  wpText("v = " + speed.toFixed(1) + " m/s", 28, 470, "#2563eb", 14, LEFT);
  wpText("1/F = " + (1000 / traction).toFixed(3) + "×10⁻³", 430, 470, "#7c3aed", 14, RIGHT);
}

function drawLesson10CarInverseForceGraph() {
  var values = lesson10CarInverseValues();
  var xConstant = 1 / values.maxForce;
  var xMax = 1 / values.resistance;
  var frame = wpAxes("速度与牵引力倒数", "1/F / N⁻¹", "v / (m/s)", 0, xMax * 1.08, 0, values.maxSpeed * 1.08);
  push();
  stroke("#f97316");
  strokeWeight(2.5);
  line(wpGX(frame, xConstant), wpGY(frame, 0), wpGX(frame, xConstant), wpGY(frame, values.switchSpeed));
  pop();
  wpPlot(frame, "#2563eb", function (inverseForce) {
    if (inverseForce < xConstant || inverseForce > xMax) {
      return NaN;
    }
    return values.power * inverseForce;
  });
  var speed = Math.max(0.5, values.maxSpeed * wpProgress());
  var inverse = speed <= values.switchSpeed ? xConstant : speed / values.power;
  wpMarker(frame, inverse, speed, "#dc2626");
}

function lesson10SledValues() {
  var mass = wpParam("mass", 80);
  var radius = wpParam("radius", 24);
  var speed = wpParam("speed", 3);
  var mu = wpParam("mu", 0.05);
  var friction = mu * mass * 10;
  var radial = mass * speed * speed / radius;
  return {
    mass: mass,
    radius: radius,
    speed: speed,
    friction: friction,
    radial: radial,
    pull: Math.sqrt(friction * friction + radial * radial),
    angle: Math.atan2(radial, friction)
  };
}

function drawLesson10SledScene() {
  var values = lesson10SledValues();
  var angle = -Math.PI / 2 + values.speed * wpTime() / values.radius;
  var cx = 282;
  var cy = 256;
  var radiusPx = 150;
  noFill();
  stroke("#94a3b8");
  strokeWeight(2);
  circle(cx, cy, radiusPx * 2);
  var x = cx + radiusPx * Math.cos(angle);
  var y = cy + radiusPx * Math.sin(angle);
  push();
  translate(x, y);
  rotate(angle + Math.PI / 2);
  fill("#f97316");
  stroke("#c2410c");
  rect(-30, -18, 60, 36, 6);
  pop();
  var tangentX = -Math.sin(angle);
  var tangentY = Math.cos(angle);
  var inwardX = -Math.cos(angle);
  var inwardY = -Math.sin(angle);
  var tangentShare = values.friction / Math.max(0.001, values.pull);
  var inwardShare = values.radial / Math.max(0.001, values.pull);
  wpArrow(x, y, x + 72 * tangentX, y + 72 * tangentY, "#2563eb", "v");
  wpArrow(x, y, x + 55 * inwardX, y + 55 * inwardY, "#7c3aed", "Fr");
  wpArrow(x, y, x + 70 * (tangentShare * tangentX + inwardShare * inwardX), y + 70 * (tangentShare * tangentY + inwardShare * inwardY), "#dc2626", "F");
  fill("#0f172a");
  noStroke();
  circle(cx, cy, 8);
  wpText("拉力同时克服摩擦并提供向心力", 28, 30, "#0f172a", 18, LEFT);
  wpText("F = " + values.pull.toFixed(1) + " N", 28, 470, "#dc2626", 14, LEFT);
  wpText("夹角 = " + (values.angle * 180 / Math.PI).toFixed(1) + "°", 420, 470, "#7c3aed", 14, RIGHT);
}

function drawLesson10SledGraph() {
  var values = lesson10SledValues();
  var maxTheta = Math.max(Math.PI / 6, values.speed * wpDuration() / values.radius);
  var frame = wpAxes("克服摩擦力做功", "圆心角 θ / rad", "W / J", 0, maxTheta, 0, values.friction * values.radius * maxTheta);
  wpPlot(frame, "#dc2626", function (theta) {
    return values.friction * values.radius * theta;
  });
  var now = Math.min(maxTheta, values.speed * wpTime() / values.radius);
  wpMarker(frame, now, values.friction * values.radius * now, "#dc2626");
}

function lesson10GravityDurations() {
  var height = wpParam("height", 20);
  var speed = wpParam("speed", 10);
  var g = wpParam("g", 10);
  var root = Math.sqrt(speed * speed + 2 * g * height);
  return {
    free: Math.sqrt(2 * height / g),
    up: (speed + root) / g,
    down: (-speed + root) / g
  };
}

function lesson10BallHeight(kind, t) {
  var height = wpParam("height", 20);
  var speed = wpParam("speed", 10);
  var g = wpParam("g", 10);
  if (kind === "free" || kind === "flat") {
    return Math.max(0, height - 0.5 * g * t * t);
  }
  if (kind === "up") {
    return Math.max(0, height + speed * t - 0.5 * g * t * t);
  }
  return Math.max(0, height - speed * t - 0.5 * g * t * t);
}

function lesson10GravityPowerAt(kind, t) {
  var mass = wpParam("mass", 1);
  var speed = wpParam("speed", 10);
  var g = wpParam("g", 10);
  var durations = lesson10GravityDurations();
  var end = kind === "up" ? durations.up : (kind === "down" ? durations.down : durations.free);
  if (t > end) {
    return NaN;
  }
  if (kind === "up") {
    return mass * g * (g * t - speed);
  }
  if (kind === "down") {
    return mass * g * (speed + g * t);
  }
  return mass * g * g * t;
}

function drawLesson10GravityPowerScene() {
  var height = wpParam("height", 20);
  var speed = wpParam("speed", 10);
  var t = wpTime();
  var scaleY = 230 / Math.max(height + speed * speed / (2 * wpParam("g", 10)), 1);
  var groundY = 412;
  wpGround(groundY);
  var columns = [
    { x: 76, kind: "free", label: "A 自由落体", color: "#2563eb" },
    { x: 186, kind: "flat", label: "B 平抛", color: "#0f766e" },
    { x: 356, kind: "up", label: "C 上抛", color: "#7c3aed" },
    { x: 496, kind: "down", label: "D 下抛", color: "#f97316" }
  ];
  var durations = lesson10GravityDurations();
  for (var i = 0; i < columns.length; i += 1) {
    var item = columns[i];
    var end = item.kind === "up" ? durations.up : (item.kind === "down" ? durations.down : durations.free);
    var activeT = Math.min(t, end);
    var ballX = item.x;
    if (item.kind === "flat") {
      ballX += speed * activeT * 5.2;
    }
    var y = groundY - lesson10BallHeight(item.kind, activeT) * scaleY;
    stroke(item.color);
    strokeWeight(1.5);
    line(item.x, groundY - height * scaleY, item.x, groundY);
    noStroke();
    fill(item.color);
    circle(ballX, y, 18);
    wpText(item.label, item.x, 446, item.color, 12, CENTER);
  }
  wpText("同高度、同质量的四种抛体", 28, 30, "#0f172a", 18, LEFT);
  wpText("t = " + t.toFixed(2) + " s", 28, 470, "#334155", 14, LEFT);
  wpText("重力功均为 mgh", 420, 470, "#dc2626", 14, RIGHT);
}

function drawLesson10GravityPowerGraph() {
  var duration = lesson10GravityDurations().up;
  var mass = wpParam("mass", 1);
  var speed = wpParam("speed", 10);
  var g = wpParam("g", 10);
  var maxPower = mass * g * Math.sqrt(speed * speed + 2 * g * wpParam("height", 20));
  var minPower = -mass * g * speed;
  var frame = wpAxes("重力瞬时功率", "t / s", "P / W", 0, duration, minPower, maxPower);
  wpPlot(frame, "#2563eb", function (t) { return lesson10GravityPowerAt("free", t); });
  wpPlot(frame, "#0f766e", function (t) { return lesson10GravityPowerAt("flat", t); });
  wpPlot(frame, "#7c3aed", function (t) { return lesson10GravityPowerAt("up", t); });
  wpPlot(frame, "#f97316", function (t) { return lesson10GravityPowerAt("down", t); });
  var now = Math.min(wpTime(), duration);
  var markerPower = lesson10GravityPowerAt("up", now);
  if (Number.isFinite(markerPower)) {
    wpMarker(frame, now, markerPower, "#7c3aed");
  }
  wpLegend([
    { color: "#2563eb", label: "A" },
    { color: "#0f766e", label: "B" },
    { color: "#7c3aed", label: "C" },
    { color: "#f97316", label: "D" }
  ], 930, 102);
}
