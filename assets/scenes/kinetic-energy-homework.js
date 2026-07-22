// Homework scenes for the kinetic-energy theorem.
function drawLesson11SpringCompressionScene() {
  var p = keProgress();
  var s = keParam("distance", 2);
  var compression = keParam("compression", 0.8);
  var contactRatio = s / (s + compression);
  var blockX;
  var springEnd;
  keGround(378);
  if (p <= contactRatio) {
    blockX = lerp(500, 274, p / contactRatio);
    springEnd = 254;
  } else {
    var q = (p - contactRatio) / (1 - contactRatio);
    blockX = lerp(274, 194, q);
    springEnd = lerp(254, 174, q);
  }
  stroke("#475569");
  strokeWeight(6);
  line(58, 286, 58, 378);
  keSpring(58, 348, springEnd, 348, "#2563eb", 10);
  keBlock(blockX, 328, "#f97316", "m", 0);
  if (p < 0.99) keArrow(blockX + 8, 298, blockX - 55, 298, "#dc2626", "v");
  keText("A", 500, 397, "#0f172a", 14, CENTER);
  keText("O", 254, 397, "#0f172a", 14, CENTER);
  keText("先滑行 s，再压缩弹簧 x", 28, 30, "#0f172a", 18, LEFT);
  keText(p <= contactRatio ? "尚未接触弹簧" : "弹簧正在压缩", 28, 76, p <= contactRatio ? "#64748b" : "#2563eb", 14, LEFT);
}

function drawLesson11SpringCompressionGraph() {
  var m = keParam("mass", 1);
  var v = keParam("speed", 8);
  var s = keParam("distance", 2);
  var x = keParam("compression", 0.8);
  var mu = keParam("mu", 0.2);
  var g = keParam("g", 10);
  var totalDistance = s + x;
  var initial = 0.5 * m * v * v;
  var friction = mu * m * g;
  var springFinal = Math.max(0, initial - friction * totalDistance);
  var frame = keAxes("能量随路程分配", "累计路程 l / m", "能量 / J", 0, totalDistance, 0, initial * 1.12);
  kePlot(frame, "#2563eb", function (distance) {
    var springEnergy = distance <= s ? 0 : springFinal * Math.pow((distance - s) / x, 2);
    return Math.max(0, initial - friction * distance - springEnergy);
  });
  kePlot(frame, "#64748b", function (distance) { return friction * distance; });
  kePlot(frame, "#dc2626", function (distance) {
    return distance <= s ? 0 : springFinal * Math.pow((distance - s) / x, 2);
  });
  var distanceNow = totalDistance * keProgress();
  var springNow = distanceNow <= s ? 0 : springFinal * Math.pow((distanceNow - s) / x, 2);
  keMarker(frame, distanceNow, Math.max(0, initial - friction * distanceNow - springNow), "#2563eb");
  keLegend([
    { color: "#2563eb", label: "物体动能" },
    { color: "#64748b", label: "摩擦耗能" },
    { color: "#dc2626", label: "弹簧储能" }
  ], 744, 104);
}

function keInclineConveyorState(progress) {
  var length = keParam("length", 8);
  var beltSpeed = keParam("beltSpeed", 2);
  var angle = radians(keParam("angle", 37));
  var mu = keParam("mu", 0.8);
  var mass = keParam("mass", 1);
  var g = 10;
  var friction = mu * mass * g * Math.cos(angle);
  var accel = Math.max(0.05, friction / mass - g * Math.sin(angle));
  var matchTime = beltSpeed / accel;
  var matchDistance = 0.5 * accel * matchTime * matchTime;
  var endTime = matchTime + Math.max(0, length - matchDistance) / beltSpeed;
  var t = progress * endTime;
  var position;
  var velocity;
  if (t <= matchTime) {
    position = 0.5 * accel * t * t;
    velocity = accel * t;
  } else {
    position = matchDistance + beltSpeed * (t - matchTime);
    velocity = beltSpeed;
  }
  return {
    t: t,
    endTime: endTime,
    position: Math.min(length, position),
    velocity: velocity,
    friction: friction,
    accel: accel,
    matchTime: matchTime,
    matchDistance: matchDistance,
    length: length,
    beltSpeed: beltSpeed,
    angle: angle,
    mass: mass,
    g: g
  };
}

function drawLesson11InclineConveyorScene() {
  var state = keInclineConveyorState(keProgress());
  var a = { x: 80, y: 398 };
  var b = { x: 500, y: 150 };
  stroke("#64748b");
  strokeWeight(16);
  line(a.x, a.y, b.x, b.y);
  stroke("#93c5fd");
  strokeWeight(3);
  for (var i = 0; i < 13; i += 1) {
    var q = ((i / 12) + keTime() * 0.08) % 1;
    var sx = lerp(a.x, b.x, q);
    var sy = lerp(a.y, b.y, q);
    line(sx - 7, sy - 12, sx + 7, sy + 12);
  }
  var ratio = state.position / state.length;
  var x = lerp(a.x, b.x, ratio);
  var y = lerp(a.y, b.y, ratio);
  keBlock(x, y - 22, "#f97316", "m", Math.atan2(b.y - a.y, b.x - a.x));
  keArrow(x - 4, y - 52, x + 58, y - 88, "#2563eb", "f");
  keText("倾斜传送带：先滑动后同速", 28, 30, "#0f172a", 18, LEFT);
  keText("s = " + state.position.toFixed(2) + " m", 28, 462, "#334155", 14, LEFT);
  keText("v = " + state.velocity.toFixed(2) + " m/s", 290, 462, "#2563eb", 14, LEFT);
}

function drawLesson11InclineConveyorGraph() {
  var state = keInclineConveyorState(keProgress());
  var maxWork = state.mass * state.g * state.length * Math.sin(state.angle) + 0.5 * state.mass * state.beltSpeed * state.beltSpeed;
  var frame = keAxes("摩擦功与摩擦热", "时间 t / s", "能量 / J", 0, state.endTime, 0, maxWork * 1.12);
  kePlot(frame, "#2563eb", function (t) {
    var position = t <= state.matchTime ? 0.5 * state.accel * t * t : state.matchDistance + state.beltSpeed * (t - state.matchTime);
    if (t <= state.matchTime) return state.friction * position;
    return state.friction * state.matchDistance + state.mass * state.g * Math.sin(state.angle) * (position - state.matchDistance);
  });
  kePlot(frame, "#dc2626", function (t) {
    var limited = Math.min(t, state.matchTime);
    var position = 0.5 * state.accel * limited * limited;
    return state.friction * Math.max(0, state.beltSpeed * limited - position);
  });
  var workNow = state.t <= state.matchTime
    ? state.friction * state.position
    : state.friction * state.matchDistance + state.mass * state.g * Math.sin(state.angle) * (state.position - state.matchDistance);
  keMarker(frame, state.t, workNow, "#2563eb");
  keLegend([
    { color: "#2563eb", label: "摩擦力对包裹做功" },
    { color: "#dc2626", label: "摩擦生热" }
  ], 736, 104);
}

function drawLesson11InclineRoundTripScene() {
  var p = keProgress();
  var bottom = { x: 86, y: 395 };
  var top = { x: 478, y: 156 };
  var positionRatio;
  var upward = p <= 0.5;
  if (upward) {
    var q1 = p * 2;
    positionRatio = 2 * q1 - q1 * q1;
  } else {
    var q2 = (p - 0.5) * 2;
    positionRatio = 1 - q2 * q2;
  }
  stroke("#475569");
  strokeWeight(5);
  line(bottom.x - 20, bottom.y + 14, top.x + 20, top.y - 12);
  var x = lerp(bottom.x, top.x, positionRatio);
  var y = lerp(bottom.y, top.y, positionRatio);
  keBlock(x, y - 18, upward ? "#2563eb" : "#f97316", upward ? "上滑" : "下滑", Math.atan2(top.y - bottom.y, top.x - bottom.x));
  keArrow(x, y + 8, x - 55, y + 42, "#dc2626", "f");
  keText("粗糙斜面往返", 28, 30, "#0f172a", 18, LEFT);
  keText(upward ? "摩擦力与重力分力同向减速" : "摩擦力与重力分力反向", 28, 462, "#475569", 14, LEFT);
}

function drawLesson11InclineRoundTripGraph() {
  var m = keParam("mass", 1);
  var v0 = keParam("speed", 8);
  var angle = radians(keParam("angle", 37));
  var g = keParam("g", 10);
  var maxDistance = 5 * v0 * v0 / (16 * g * Math.sin(angle));
  var initial = 0.5 * m * v0 * v0;
  var returned = initial / 4;
  var frame = keAxes("同一位置的上、下行动能", "距出发点 s / m", "Eₖ / J", 0, maxDistance, 0, initial * 1.12);
  kePlot(frame, "#2563eb", function (s) { return initial * (1 - s / maxDistance); });
  kePlot(frame, "#f97316", function (s) { return returned * (1 - s / maxDistance); });
  var p = keProgress();
  var ratio = p <= 0.5 ? 2 * (p * 2) - (p * 2) * (p * 2) : 1 - Math.pow((p - 0.5) * 2, 2);
  var energy = p <= 0.5 ? initial * (1 - ratio) : returned * (1 - ratio);
  keMarker(frame, maxDistance * ratio, energy, p <= 0.5 ? "#2563eb" : "#f97316");
  keLegend([
    { color: "#2563eb", label: "上滑动能" },
    { color: "#f97316", label: "下滑动能" }
  ], 754, 104);
}

function keVerticalDragState(progress) {
  var energy0 = keParam("initialEnergy", 72);
  var weight = keParam("weight", 10);
  var resistance = keParam("resistance", 2);
  var g = 10;
  var mass = weight / g;
  var v0 = Math.sqrt(2 * energy0 / mass);
  var accelUp = (weight + resistance) / mass;
  var height = energy0 / (weight + resistance);
  var timeUp = v0 / accelUp;
  var accelDown = (weight - resistance) / mass;
  var timeDown = Math.sqrt(2 * height / accelDown);
  var totalTime = timeUp + timeDown;
  var t = progress * totalTime;
  var y;
  var velocity;
  var rising = t <= timeUp;
  if (rising) {
    y = v0 * t - 0.5 * accelUp * t * t;
    velocity = v0 - accelUp * t;
  } else {
    var downTime = t - timeUp;
    y = height - 0.5 * accelDown * downTime * downTime;
    velocity = -accelDown * downTime;
  }
  return {
    t: t,
    y: Math.max(0, y),
    velocity: velocity,
    rising: rising,
    height: height,
    energy0: energy0,
    weight: weight,
    resistance: resistance,
    mass: mass,
    totalTime: totalTime
  };
}

function drawLesson11VerticalDragScene() {
  var state = keVerticalDragState(keProgress());
  keGround(420, 70, 500);
  stroke("#cbd5e1");
  strokeWeight(2);
  line(275, 92, 275, 420);
  var y = map(state.y, 0, state.height, 402, 112);
  keBall(275, y, "#f97316", "m");
  keArrow(275, y + 15, 275, y + 68, "#dc2626", "mg");
  if (state.rising) keArrow(305, y + 4, 305, y + 51, "#64748b", "F");
  else keArrow(305, y - 4, 305, y - 51, "#64748b", "F");
  keText("恒阻力竖直上抛", 28, 30, "#0f172a", 18, LEFT);
  keText(state.rising ? "上升：mg 与 F 同向" : "下落：mg 与 F 反向", 28, 76, state.rising ? "#dc2626" : "#2563eb", 14, LEFT);
  keText("h = " + state.y.toFixed(2) + " m", 30, 468, "#334155", 14, LEFT);
}

function drawLesson11VerticalDragGraph() {
  var state = keVerticalDragState(keProgress());
  var frame = keAxes("原题 Eₖ-h 图像", "高度 h / m", "Eₖ / J", 0, state.height, 0, state.energy0 * 1.12);
  kePlot(frame, "#e11d48", function (h) { return state.energy0 - (state.weight + state.resistance) * h; });
  kePlot(frame, "#2563eb", function (h) { return (state.weight - state.resistance) * (state.height - h); });
  var energy = state.rising
    ? state.energy0 - (state.weight + state.resistance) * state.y
    : (state.weight - state.resistance) * (state.height - state.y);
  keMarker(frame, state.y, energy, state.rising ? "#e11d48" : "#2563eb");
  keLegend([
    { color: "#e11d48", label: "上升" },
    { color: "#2563eb", label: "下落" }
  ], 792, 104);
}

function drawLesson11CrossConveyorScene() {
  var q = keProgress();
  fill("#dbeafe");
  stroke("#64748b");
  strokeWeight(2);
  rect(120, 70, 390, 370, 4);
  for (var i = 0; i < 8; i += 1) {
    var stripeY = 100 + ((i * 54 - keTime() * 55 + 430) % 370);
    stroke("#93c5fd");
    line(128, stripeY, 502, stripeY);
  }
  keArrow(92, 390, 92, 285, "#2563eb", "传送带 v");
  stroke("#f97316");
  strokeWeight(3);
  noFill();
  beginShape();
  for (i = 0; i <= 40; i += 1) {
    var u = i / 40 * q;
    vertex(145 + 310 * u, 390 - 245 * u * u);
  }
  endShape();
  stroke("#2563eb");
  drawingContext.setLineDash([5, 4]);
  beginShape();
  for (i = 0; i <= 40; i += 1) {
    var r = i / 40 * q;
    vertex(145 + 310 * r, 390 + 48 * (2 * r - r * r));
  }
  endShape();
  drawingContext.setLineDash([]);
  keBlock(145 + 310 * q, 390 - 245 * q * q, "#f97316", "货物", 0);
  keText("橙色：对地轨迹", 330, 92, "#f97316", 13, LEFT);
  keText("蓝色虚线：传送带上的划痕", 286, 424, "#2563eb", 13, LEFT);
  keText("垂直冲上传送带", 28, 30, "#0f172a", 18, LEFT);
}

function drawLesson11CrossConveyorGraph() {
  var v = keParam("speed", 4);
  var frame = keAxes("速度分量与相对速度", "归一化时间 t/T", "速度 / (m·s⁻¹)", 0, 1, 0, 1.55 * v);
  kePlot(frame, "#64748b", function () { return v; });
  kePlot(frame, "#2563eb", function (x) { return v * x; });
  kePlot(frame, "#dc2626", function (x) { return v * Math.sqrt(1 + Math.pow(1 - x, 2)); });
  var q = keProgress();
  keMarker(frame, q, v * q, "#2563eb");
  keLegend([
    { color: "#64748b", label: "vₓ" },
    { color: "#2563eb", label: "vᵧ" },
    { color: "#dc2626", label: "相对传送带速率" }
  ], 744, 104);
}

function keHoistSpeedAt(t) {
  if (t <= 0.8) return 5 * t;
  if (t <= 2) return 4 + 2 * (1 - Math.pow(1 - (t - 0.8) / 1.2, 2));
  if (t <= 14.3) return 6;
  return Math.max(0, 6 - 5 * (t - 14.3));
}

function drawLesson11HoistScene() {
  var t = keTime();
  var height;
  if (t <= 0.8) height = 0.5 * 5 * t * t;
  else if (t <= 14.3) height = 1.6 + 80 * (t - 0.8) / 13.5;
  else {
    var dt = t - 14.3;
    height = 81.6 + 6 * dt - 2.5 * dt * dt;
  }
  stroke("#475569");
  strokeWeight(7);
  line(120, 438, 120, 72);
  line(120, 72, 380, 72);
  fill("#475569");
  noStroke();
  rect(350, 54, 62, 38, 4);
  var y = map(height, 0, 85.2, 405, 110);
  stroke("#0f172a");
  strokeWeight(2);
  line(382, 92, 382, y - 28);
  keBlock(382, y, "#f97316", "20 kg", 0);
  keArrow(382, y - 12, 382, y - 76, "#2563eb", "T");
  keText("受拉力与功率限制的提升", 28, 30, "#0f172a", 18, LEFT);
  keText("h = " + height.toFixed(1) + " m", 28, 464, "#334155", 14, LEFT);
  keText("v = " + keHoistSpeedAt(t).toFixed(2) + " m/s", 290, 464, "#2563eb", 14, LEFT);
}

function drawLesson11HoistGraph() {
  var frame = keAxes("最短时间速度图", "时间 t / s", "速度 / (m·s⁻¹)", 0, 15.5, 0, 6.8);
  kePlot(frame, "#2563eb", function (t) { return keHoistSpeedAt(t); }, 180);
  var tNow = keTime();
  keMarker(frame, tNow, keHoistSpeedAt(tNow), "#dc2626");
  stroke("#94a3b8");
  drawingContext.setLineDash([4, 4]);
  line(keGX(frame, 0.8), frame.top, keGX(frame, 0.8), frame.bottom);
  line(keGX(frame, 14.3), frame.top, keGX(frame, 14.3), frame.bottom);
  drawingContext.setLineDash([]);
  keText("最大拉力", 646, 104, "#475569", 12, LEFT);
  keText("额定功率", 768, 104, "#475569", 12, LEFT);
  keText("最大减速", 895, 104, "#475569", 12, LEFT);
}

function drawLesson11CarRopeSpringScene() {
  var q = keProgress();
  var inclineA = { x: 88, y: 404 };
  var inclineTop = { x: 406, y: 136 };
  var pulley = { x: 420, y: 126 };
  var carStart = { x: 420, y: 404 };
  var carX = carStart.x + 102 * q;
  var blockA = { x: 124, y: 374 };
  var blockBStart = { x: 248, y: 270 };
  var blockB = {
    x: blockBStart.x + 44 * q,
    y: blockBStart.y - 37 * q
  };
  stroke("#475569");
  strokeWeight(5);
  line(inclineA.x, inclineA.y, inclineTop.x, inclineTop.y);
  keGround(424, 40, 542);
  fill("#cbd5e1");
  stroke("#64748b");
  circle(pulley.x, pulley.y, 30);
  stroke("#0f172a");
  strokeWeight(2);
  line(blockB.x, blockB.y, pulley.x, pulley.y);
  line(pulley.x, pulley.y, carX, 386);
  keSpring(blockA.x + 18, blockA.y - 16, blockB.x - 18, blockB.y + 8, "#2563eb", 9);
  keBlock(blockA.x, blockA.y - 18, "#94a3b8", "A", -0.7);
  keBlock(blockB.x, blockB.y - 18, "#f97316", "B", -0.7);
  fill("#2563eb");
  stroke("#1d4ed8");
  rect(carX - 27, 382, 58, 25, 6);
  fill("#0f172a");
  circle(carX - 15, 410, 12);
  circle(carX + 20, 410, 12);
  keText("小车—绳—弹簧几何联动", 28, 30, "#0f172a", 18, LEFT);
  keText("小车位移 = " + (0.75 * q).toFixed(2) + " L", 28, 466, "#334155", 14, LEFT);
  keText("B 位移 = " + (Math.sqrt(1 + Math.pow(0.75 * q, 2)) - 1).toFixed(2) + " L", 280, 466, "#2563eb", 14, LEFT);
}

function drawLesson11CarRopeSpringGraph() {
  var frame = keAxes("几何约束关系", "小车位移 x / L", "无量纲比值", 0, 0.75, 0, 0.68);
  kePlot(frame, "#2563eb", function (x) { return Math.sqrt(1 + x * x) - 1; });
  kePlot(frame, "#dc2626", function (x) { return x / Math.sqrt(1 + x * x); });
  var xNow = 0.75 * keProgress();
  keMarker(frame, xNow, Math.sqrt(1 + xNow * xNow) - 1, "#2563eb");
  keLegend([
    { color: "#2563eb", label: "B 位移 s_B/L" },
    { color: "#dc2626", label: "速度比 v_B/v_车" }
  ], 740, 104);
}

function drawLesson11PendulumTensionScene() {
  var p = keProgress();
  var o = { x: 220, y: 174 };
  var radius = 170;
  var a = { x: o.x + radius * Math.cos(Math.PI / 6), y: o.y - radius * Math.sin(Math.PI / 6) };
  var b = { x: o.x + radius * Math.cos(Math.PI / 6), y: o.y + radius * Math.sin(Math.PI / 6) };
  var x;
  var y;
  stroke("#475569");
  strokeWeight(5);
  point(o.x, o.y);
  if (p < 0.45) {
    var q1 = p / 0.45;
    x = a.x;
    y = lerp(a.y, b.y, q1 * q1);
    noFill();
    stroke("#64748b");
    strokeWeight(2);
    bezier(o.x, o.y, o.x + 66, o.y + 30, x - 70, y - 15, x, y);
    keText("绳松弛：自由落体", 28, 76, "#dc2626", 14, LEFT);
  } else {
    var q2 = (p - 0.45) / 0.55;
    var angle = lerp(Math.PI / 6, Math.PI / 2, q2);
    x = o.x + radius * Math.cos(angle);
    y = o.y + radius * Math.sin(angle);
    stroke("#334155");
    strokeWeight(2);
    line(o.x, o.y, x, y);
    keText(q2 < 0.08 ? "绳绷紧：径向速度被消去" : "绳绷紧：沿圆弧摆动", 28, 76, "#2563eb", 14, LEFT);
  }
  keBall(x, y, "#f97316", "m");
  keText("O", o.x - 14, o.y - 5, "#0f172a", 14, CENTER);
  keText("松绳—绷紧—摆动", 28, 30, "#0f172a", 18, LEFT);
}

function drawLesson11PendulumTensionGraph() {
  var frame = keAxes("绳绷紧前后的速度突变", "过程阶段", "v² / (gL)", 0, 2, 0, 2.8);
  kePlot(frame, "#f97316", function (x) { return x <= 1 ? 2 * x : NaN; }, 80);
  kePlot(frame, "#2563eb", function (x) {
    if (x < 1) return NaN;
    var angle = lerp(Math.PI / 6, Math.PI / 2, x - 1);
    return 0.5 + 2 * Math.sin(angle);
  }, 80);
  stroke("#dc2626");
  strokeWeight(2);
  drawingContext.setLineDash([4, 4]);
  line(keGX(frame, 1), keGY(frame, 2), keGX(frame, 1), keGY(frame, 1.5));
  drawingContext.setLineDash([]);
  var stage = keProgress() < 0.45 ? keProgress() / 0.45 : 1 + (keProgress() - 0.45) / 0.55;
  var value;
  if (stage < 1) value = 2 * stage;
  else {
    var angleNow = lerp(Math.PI / 6, Math.PI / 2, stage - 1);
    value = 0.5 + 2 * Math.sin(angleNow);
  }
  keMarker(frame, stage, value, stage < 1 ? "#f97316" : "#2563eb");
  keLegend([
    { color: "#f97316", label: "自由落体" },
    { color: "#2563eb", label: "绷紧后摆动" }
  ], 754, 104);
}

function keLinearDragSpeed(timeValue, initialSpeed, terminalSpeed, g) {
  var tau = terminalSpeed / g;
  var peakTime = tau * Math.log(1 + initialSpeed / terminalSpeed);
  if (timeValue <= peakTime) {
    return (initialSpeed + terminalSpeed) * Math.exp(-timeValue / tau) - terminalSpeed;
  }
  return terminalSpeed * (1 - Math.exp(-(timeValue - peakTime) / tau));
}

function drawLesson11LinearDragScene() {
  var p = keProgress();
  var v0 = keParam("initialSpeed", 15);
  var vt = keParam("terminalSpeed", 8);
  var g = keParam("g", 10);
  var tau = vt / g;
  var peakTime = tau * Math.log(1 + v0 / vt);
  var peakRatio = Math.min(0.42, peakTime / Math.max(0.001, keDuration()));
  var y;
  var rising = p <= peakRatio;
  if (rising) {
    var q1 = p / peakRatio;
    y = lerp(408, 130, 2 * q1 - q1 * q1);
  } else {
    var q2 = (p - peakRatio) / (1 - peakRatio);
    y = lerp(130, 408, q2 * q2);
  }
  keGround(426, 70, 500);
  stroke("#cbd5e1");
  strokeWeight(2);
  line(278, 90, 278, 426);
  keBall(278, y, "#f97316", "m");
  keArrow(278, y + 14, 278, y + 66, "#dc2626", "mg");
  if (rising) keArrow(310, y + 8, 310, y + 52, "#64748b", "kv");
  else keArrow(310, y - 8, 310, y - 52, "#64748b", "kv");
  keText("线性空气阻力下的竖直上抛", 28, 30, "#0f172a", 18, LEFT);
  keText(rising ? "上升：阻力向下" : "下落：阻力向上，速率趋近 v₁", 28, 76, rising ? "#dc2626" : "#2563eb", 14, LEFT);
}

function drawLesson11LinearDragGraph() {
  var v0 = keParam("initialSpeed", 15);
  var vt = keParam("terminalSpeed", 8);
  var g = keParam("g", 10);
  var duration = keDuration();
  var frame = keAxes("速率—时间图像", "时间 t / s", "速率 / (m·s⁻¹)", 0, duration, 0, v0 * 1.12);
  kePlot(frame, "#2563eb", function (t) { return keLinearDragSpeed(t, v0, vt, g); }, 180);
  kePlot(frame, "#dc2626", function () { return vt; }, 80, true);
  var tNow = keTime();
  keMarker(frame, tNow, keLinearDragSpeed(tNow, v0, vt, g), "#2563eb");
  keLegend([
    { color: "#2563eb", label: "小球速率" },
    { color: "#dc2626", label: "终端速率 v₁" }
  ], 758, 104);
}

function keTrebuchetValues(radius) {
  var arm = keParam("armLength", 4);
  var angle = radians(keParam("angle", 30));
  var mass = keParam("mass", 10);
  var target = keParam("target", 12);
  var g = 10;
  var pivotHeight = arm * Math.sin(angle);
  var originalHeight = pivotHeight + arm;
  var originalSpeedSquared = target * target * g / (2 * originalHeight);
  var work = 0.5 * mass * originalSpeedSquared + mass * g * originalHeight;
  var speedSquared = Math.max(0, 2 * work / mass - 2 * g * radius * (1 + Math.sin(angle)));
  var releaseHeight = pivotHeight + radius;
  var range = Math.sqrt(Math.max(0, speedSquared * 2 * releaseHeight / g));
  return {
    arm: arm,
    angle: angle,
    mass: mass,
    target: target,
    pivotHeight: pivotHeight,
    work: work,
    speedSquared: speedSquared,
    releaseHeight: releaseHeight,
    range: range
  };
}

function drawLesson11TrebuchetScene() {
  var p = keProgress();
  var radiusValue = keParam("mountRadius", 3);
  var values = keTrebuchetValues(radiusValue);
  var o = { x: 238, y: 286 };
  var scale = 42;
  var radiusPixels = radiusValue * scale;
  var angle;
  var x;
  var y;
  keGround(418, 32, 542);
  fill("#64748b");
  stroke("#475569");
  triangle(o.x - 24, 418, o.x + 24, 418, o.x, o.y + 10);
  if (p < 0.45) {
    var q1 = p / 0.45;
    angle = lerp(5 * Math.PI / 6, 3 * Math.PI / 2, q1);
    x = o.x + radiusPixels * Math.cos(angle);
    y = o.y + radiusPixels * Math.sin(angle);
    stroke("#334155");
    strokeWeight(8);
    line(o.x - 58 * Math.cos(angle), o.y - 58 * Math.sin(angle), o.x + values.arm * scale * Math.cos(angle), o.y + values.arm * scale * Math.sin(angle));
  } else {
    var q2 = (p - 0.45) / 0.55;
    stroke("#334155");
    strokeWeight(8);
    line(o.x, o.y + 58, o.x, o.y - values.arm * scale);
    x = o.x + 282 * q2;
    y = o.y - radiusPixels + (418 - (o.y - radiusPixels)) * q2 * q2;
    stroke("#94a3b8");
    strokeWeight(1.5);
    drawingContext.setLineDash([4, 4]);
    noFill();
    beginShape();
    for (var i = 0; i <= 30; i += 1) {
      var u = i / 30;
      vertex(o.x + 282 * u, o.y - radiusPixels + (418 - (o.y - radiusPixels)) * u * u);
    }
    endShape();
    drawingContext.setLineDash([]);
  }
  keBall(x, y, "#f97316", "");
  keText("O", o.x + 15, o.y + 4, "#0f172a", 14, LEFT);
  keText("可调安装位置的抛石机", 28, 30, "#0f172a", 18, LEFT);
  keText("r = " + radiusValue.toFixed(1) + " m", 28, 466, "#334155", 14, LEFT);
  keText("预测射程 = " + values.range.toFixed(2) + " m", 278, 466, "#2563eb", 14, LEFT);
}

function drawLesson11TrebuchetGraph() {
  var arm = keParam("armLength", 4);
  var minRadius = arm / 2;
  var maxRadius = arm;
  var selected = keParam("mountRadius", 3);
  var maxRange = 0;
  for (var i = 0; i <= 80; i += 1) {
    var radius = lerp(minRadius, maxRadius, i / 80);
    maxRange = Math.max(maxRange, keTrebuchetValues(radius).range);
  }
  var frame = keAxes("落点距离随安装半径变化", "安装半径 r / m", "水平射程 X / m", minRadius, maxRadius, 0, maxRange * 1.12);
  kePlot(frame, "#2563eb", function (r) { return keTrebuchetValues(r).range; });
  keMarker(frame, selected, keTrebuchetValues(selected).range, "#dc2626");
  keText("原题最优：r = 3.0 m", 790, 112, "#dc2626", 13, CENTER);
}
