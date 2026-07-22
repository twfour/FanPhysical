// Course scenes for work and power.
function drawLesson10CraneScene() {
  var weight = wpParam("weight", 10000);
  var accel = wpParam("accel", 1);
  var g = wpParam("g", 10);
  var t = wpTime();
  var mass = weight / g;
  var tension = mass * (g + accel);
  var height = 0.5 * accel * t * t;
  var maxHeight = Math.max(0.1, 0.5 * accel * wpDuration() * wpDuration());
  var lift = 165 * height / maxHeight;
  wpGround(430);
  stroke("#334155");
  strokeWeight(7);
  line(95, 430, 95, 74);
  line(95, 74, 390, 74);
  line(155, 74, 95, 132);
  fill("#475569");
  noStroke();
  rect(365, 56, 58, 36, 4);
  stroke("#0f172a");
  strokeWeight(2);
  line(390, 92, 390, 330 - lift);
  fill("#f97316");
  stroke("#c2410c");
  rect(345, 330 - lift, 90, 66, 5);
  wpArrow(390, 330 - lift, 390, 262 - lift, "#2563eb", "T");
  wpArrow(390, 396 - lift, 390, 448 - lift, "#dc2626", "mg");
  wpText("起重机加速提升", 28, 30, "#0f172a", 18, LEFT);
  wpText("h = " + height.toFixed(2) + " m", 28, 474, "#334155", 14, LEFT);
  wpText("T = " + tension.toFixed(0) + " N", 250, 474, "#2563eb", 14, LEFT);
}

function drawLesson10CraneGraph() {
  var weight = wpParam("weight", 10000);
  var accel = wpParam("accel", 1);
  var g = wpParam("g", 10);
  var duration = wpDuration();
  var tension = weight * (g + accel) / g;
  var maxWork = 0.5 * tension * accel * duration * duration;
  var frame = wpAxes("拉力累计做功", "t / s", "W / J", 0, duration, 0, maxWork);
  wpPlot(frame, "#2563eb", function (t) { return 0.5 * tension * accel * t * t; });
  var now = wpTime();
  wpMarker(frame, now, 0.5 * tension * accel * now * now, "#dc2626");
}

function drawLesson10MovingWedgeScene() {
  var theta = wpParam("angle", 30) * Math.PI / 180;
  var p = wpProgress();
  var offset = 205 * p;
  var ox = 48 + offset;
  var oy = 405;
  var length = 205;
  var dx = length * Math.cos(theta);
  var dy = length * Math.sin(theta);
  wpGround(405);
  fill("#dbeafe");
  stroke("#2563eb");
  strokeWeight(2);
  triangle(ox, oy, ox + dx, oy - dy, ox + dx, oy);
  var q = 0.68;
  var bx = ox + dx * q;
  var by = oy - dy * q;
  push();
  translate(bx, by);
  rotate(-theta);
  fill("#f97316");
  stroke("#c2410c");
  rect(-24, -38, 48, 36, 5);
  pop();
  wpArrow(bx, by - 26, bx + 70 * Math.cos(theta), by - 26 - 70 * Math.sin(theta), "#dc2626", "f");
  wpArrow(ox + dx * 0.35, oy + 30, ox + dx * 0.35 + 58, oy + 30, "#0f766e", "v");
  wpText("物块与斜面相对静止", 28, 30, "#0f172a", 18, LEFT);
  wpText("水平位移  x = " + (wpParam("distance", 4) * p).toFixed(2) + " m", 28, 470, "#334155", 14, LEFT);
}

function drawLesson10MovingWedgeGraph() {
  var mass = wpParam("mass", 2);
  var theta = wpParam("angle", 30) * Math.PI / 180;
  var distance = wpParam("distance", 4);
  var g = wpParam("g", 10);
  var coefficient = mass * g * Math.sin(theta) * Math.cos(theta);
  var frame = wpAxes("摩擦力做功", "x / m", "Wf / J", 0, distance, 0, coefficient * distance);
  wpPlot(frame, "#dc2626", function (x) { return coefficient * x; });
  var xNow = distance * wpProgress();
  wpMarker(frame, xNow, coefficient * xNow, "#dc2626");
}

function drawLesson10ConveyorScene() {
  var mass = wpParam("mass", 10);
  var mu = wpParam("mu", 0.2);
  var beltSpeed = wpParam("beltSpeed", 2);
  var g = wpParam("g", 10);
  var t = wpTime();
  var accel = mu * g;
  var slipTime = beltSpeed / accel;
  var activeT = Math.min(t, slipTime);
  var bagSpeed = accel * activeT;
  var bagX = 115 + 150 * (0.5 * accel * activeT * activeT) / Math.max(0.1, beltSpeed * slipTime);
  fill("#e2e8f0");
  stroke("#64748b");
  rect(54, 304, 470, 58, 28);
  noFill();
  stroke("#334155");
  circle(88, 333, 46);
  circle(490, 333, 46);
  for (var i = 0; i < 9; i += 1) {
    var markerX = 70 + ((i * 58 + beltSpeed * t * 65) % 430);
    stroke("#94a3b8");
    line(markerX, 309, markerX + 18, 309);
  }
  fill("#f97316");
  stroke("#c2410c");
  rect(bagX, 246, 82, 58, 5);
  wpArrow(bagX + 40, 236, bagX + 98, 236, "#2563eb", "f");
  wpGround(392);
  wpText("行李轻放在运动传送带上", 28, 30, "#0f172a", 18, LEFT);
  wpText("v物 = " + bagSpeed.toFixed(2) + " m/s", 28, 470, "#2563eb", 14, LEFT);
  wpText("v带 = " + beltSpeed.toFixed(2) + " m/s", 260, 470, "#0f766e", 14, LEFT);
  wpText("m = " + mass.toFixed(0) + " kg", 435, 470, "#475569", 13, RIGHT);
}

function drawLesson10ConveyorGraph() {
  var mass = wpParam("mass", 10);
  var mu = wpParam("mu", 0.2);
  var beltSpeed = wpParam("beltSpeed", 2);
  var g = wpParam("g", 10);
  var force = mu * mass * g;
  var accel = mu * g;
  var duration = beltSpeed / accel;
  var minWork = -force * beltSpeed * duration;
  var maxWork = force * 0.5 * accel * duration * duration;
  var frame = wpAxes("接触摩擦功", "t / s", "W / J", 0, duration, minWork, maxWork);
  wpPlot(frame, "#2563eb", function (t) { return force * 0.5 * accel * t * t; });
  wpPlot(frame, "#f97316", function (t) { return -force * beltSpeed * t; });
  wpPlot(frame, "#7c3aed", function (t) { return force * 0.5 * accel * t * t - force * beltSpeed * t; });
  var now = Math.min(wpTime(), duration);
  wpMarker(frame, now, force * 0.5 * accel * now * now, "#2563eb");
  wpLegend([
    { color: "#2563eb", label: "对行李" },
    { color: "#f97316", label: "对传送带" },
    { color: "#7c3aed", label: "总功" }
  ], 842, 102);
}

function drawLesson10TangentDiskScene() {
  var p = wpProgress();
  var angle = -Math.PI / 2 + Math.PI * 2 * p;
  var cx = 282;
  var cy = 252;
  var radius = 126;
  fill("#f8fafc");
  stroke("#475569");
  strokeWeight(2.5);
  circle(cx, cy, radius * 2);
  stroke("#cbd5e1");
  line(cx - radius, cy, cx + radius, cy);
  line(cx, cy - radius, cx, cy + radius);
  var px = cx + radius * Math.cos(angle);
  var py = cy + radius * Math.sin(angle);
  stroke("#2563eb");
  strokeWeight(3);
  line(cx, cy, px, py);
  fill("#f97316");
  noStroke();
  circle(px, py, 16);
  var tangentX = -Math.sin(angle);
  var tangentY = Math.cos(angle);
  wpArrow(px, py, px + 78 * tangentX, py + 78 * tangentY, "#dc2626", "F");
  wpText("力始终沿圆周切线", 28, 30, "#0f172a", 18, LEFT);
  wpText("θ = " + (360 * p).toFixed(0) + "°", 28, 470, "#334155", 14, LEFT);
  wpText("W = Frθ", 420, 470, "#7c3aed", 15, RIGHT);
}

function drawLesson10TangentDiskGraph() {
  var force = wpParam("force", 10);
  var radius = wpParam("radius", 1);
  var maxAngle = Math.PI * 2;
  var frame = wpAxes("累计功与转角", "θ / rad", "W / J", 0, maxAngle, 0, force * radius * maxAngle);
  wpPlot(frame, "#7c3aed", function (theta) { return force * radius * theta; });
  var thetaNow = maxAngle * wpProgress();
  wpMarker(frame, thetaNow, force * radius * thetaNow, "#dc2626");
}

function drawLesson10SubmergedCubeScene() {
  var mass = wpParam("mass", 2);
  var edge = wpParam("edge", 1);
  var g = wpParam("g", 10);
  var p = wpProgress();
  var waterY = 198;
  var side = 126;
  var down = side * 0.5 * p;
  fill("#dbeafe");
  noStroke();
  rect(44, waterY, 480, 240);
  stroke("#2563eb");
  strokeWeight(2);
  line(44, waterY, 524, waterY);
  fill("#fbbf24");
  stroke("#b45309");
  rect(235, waterY - side / 2 + down, side, side, 4);
  var force = mass * g * p;
  wpArrow(298, waterY - side / 2 + down - 12, 298, waterY - side / 2 + down + 45, "#dc2626", "F");
  wpArrow(332, waterY + side / 2 + down, 332, waterY + side / 2 + down - 74, "#2563eb", "F浮");
  wpText("缓慢下压至刚好完全浸没", 28, 30, "#0f172a", 18, LEFT);
  wpText("下压 x = " + (edge * p / 2).toFixed(2) + " m", 28, 470, "#334155", 14, LEFT);
  wpText("F = " + force.toFixed(1) + " N", 420, 470, "#dc2626", 14, RIGHT);
}

function drawLesson10SubmergedCubeGraph() {
  var mass = wpParam("mass", 2);
  var edge = wpParam("edge", 1);
  var g = wpParam("g", 10);
  var maxX = edge / 2;
  var frame = wpAxes("下压力随深度变化", "x / m", "F / N", 0, maxX, 0, mass * g);
  wpPlot(frame, "#dc2626", function (x) { return 2 * mass * g * x / edge; });
  var xNow = maxX * wpProgress();
  wpMarker(frame, xNow, 2 * mass * g * xNow / edge, "#dc2626");
  wpText("曲线下面积 = mga / 4", 790, 58, "#7c3aed", 13, CENTER);
}

function drawLesson10PulleyPersonScene() {
  var mass = wpParam("mass", 50);
  var walk = wpParam("walk", 2);
  var g = wpParam("g", 10);
  var p = wpProgress();
  var cot30 = Math.sqrt(3);
  var cot60 = 1 / Math.sqrt(3);
  var height = walk / (cot30 - cot60);
  var x0 = height * cot60;
  var xNow = x0 + walk * p;
  var rope0 = Math.sqrt(height * height + x0 * x0);
  var ropeNow = Math.sqrt(height * height + xNow * xNow);
  var lift = ropeNow - rope0;
  var pulleyX = 130;
  var pulleyY = 94;
  var scale = 118;
  var handX = pulleyX + xNow * scale;
  var handY = 386;
  stroke("#334155");
  strokeWeight(4);
  line(50, 62, 230, 62);
  line(pulleyX, 62, pulleyX, pulleyY);
  fill("#e2e8f0");
  stroke("#475569");
  circle(pulleyX, pulleyY, 38);
  stroke("#0f172a");
  strokeWeight(2);
  line(pulleyX - 19, pulleyY, 76, 274 - lift * 68);
  line(pulleyX, pulleyY + 19, handX, handY);
  fill("#f97316");
  stroke("#c2410c");
  rect(49, 274 - lift * 68, 54, 62, 4);
  stroke("#334155");
  strokeWeight(3);
  line(handX, handY, handX, 426);
  line(handX, 403, handX - 18, 424);
  line(handX, 403, handX + 18, 424);
  line(handX, 402, handX - 18, 382);
  wpGround(430);
  wpText("人水平移动，重物匀速上升", 28, 30, "#0f172a", 18, LEFT);
  wpText("ΔL = " + lift.toFixed(2) + " m", 28, 470, "#334155", 14, LEFT);
  wpText("T = " + (mass * g).toFixed(0) + " N", 420, 470, "#2563eb", 14, RIGHT);
}

function drawLesson10PulleyPersonGraph() {
  var mass = wpParam("mass", 50);
  var walk = wpParam("walk", 2);
  var g = wpParam("g", 10);
  var cot30 = Math.sqrt(3);
  var cot60 = 1 / Math.sqrt(3);
  var height = walk / (cot30 - cot60);
  var x0 = height * cot60;
  var rope0 = Math.sqrt(height * height + x0 * x0);
  var workAt = function (x) {
    return mass * g * (Math.sqrt(height * height + (x0 + x) * (x0 + x)) - rope0);
  };
  var frame = wpAxes("人对绳做功", "水平位移 x / m", "W / J", 0, walk, 0, workAt(walk));
  wpPlot(frame, "#2563eb", workAt);
  var xNow = walk * wpProgress();
  wpMarker(frame, xNow, workAt(xNow), "#dc2626");
}

function drawLesson10ThreePathsScene() {
  var p = wpProgress();
  var ox = 68;
  var oy = 414;
  var ex = 510;
  var lowY = 302;
  var highY = 126;
  var curveY = 222;
  stroke("#94a3b8");
  strokeWeight(3);
  line(ox, oy, ex, lowY);
  line(ox, oy, ex, highY);
  noFill();
  stroke("#2563eb");
  beginShape();
  for (var i = 0; i <= 80; i += 1) {
    var q = i / 80;
    vertex(lerp(ox, ex, q), oy - (oy - curveY) * q * q);
  }
  endShape();
  var routeP = 1 - p;
  var x = lerp(ox, ex, routeP);
  var y1 = lerp(oy, lowY, routeP);
  var y2 = lerp(oy, highY, routeP);
  var y3 = oy - (oy - curveY) * routeP * routeP;
  noStroke();
  fill("#f97316");
  circle(x, y1, 18);
  fill("#7c3aed");
  circle(x, y2, 18);
  fill("#2563eb");
  circle(x, y3, 18);
  wpText("a", ex + 8, lowY, "#f97316", 14, LEFT);
  wpText("b", ex + 8, highY, "#7c3aed", 14, LEFT);
  wpText("c", ex + 8, curveY, "#2563eb", 14, LEFT);
  wpText("O", ox - 20, oy, "#334155", 14, LEFT);
  wpText("等底的两直面与凹曲面", 28, 30, "#0f172a", 18, LEFT);
  wpText("下滑进度 " + (100 * p).toFixed(0) + "%", 28, 470, "#334155", 14, LEFT);
}

function drawLesson10ThreePathsGraph() {
  var mass = wpParam("mass", 1);
  var mu = wpParam("mu", 0.2);
  var base = wpParam("base", 5);
  var g = wpParam("g", 10);
  var straightWork = mu * mass * g * base;
  var frame = wpAxes("克服摩擦力累计做功", "下滑进度", "W / J", 0, 1, 0, straightWork * 1.4);
  wpPlot(frame, "#f97316", function (p) { return straightWork * p; });
  wpPlot(frame, "#7c3aed", function (p) { return straightWork * p; });
  wpPlot(frame, "#2563eb", function (p) { return straightWork * (p + 0.35 * p * p); });
  var now = wpProgress();
  wpMarker(frame, now, straightWork * (now + 0.35 * now * now), "#2563eb");
  wpLegend([
    { color: "#f97316", label: "W1：直面 aO" },
    { color: "#7c3aed", label: "W2：直面 bO" },
    { color: "#2563eb", label: "W3：凹曲面 cO" }
  ], 835, 104);
}

function lesson10ReverseValues(t) {
  var mass = wpParam("mass", 20);
  var force = wpParam("force", 60);
  var friction = wpParam("friction", 40);
  var v0 = 10;
  var decel = (force + friction) / mass;
  var stopTime = v0 / decel;
  if (t <= stopTime) {
    return {
      velocity: v0 - decel * t,
      position: v0 * t - 0.5 * decel * t * t
    };
  }
  var reverseAccel = (force - friction) / mass;
  var dt = t - stopTime;
  var stopX = v0 * stopTime - 0.5 * decel * stopTime * stopTime;
  return {
    velocity: -reverseAccel * dt,
    position: stopX - 0.5 * reverseAccel * dt * dt
  };
}

function drawLesson10ReverseForceScene() {
  var values = lesson10ReverseValues(wpTime());
  var x = 82 + values.position * 34;
  wpGround(370);
  fill("#f97316");
  stroke("#c2410c");
  rect(x, 310, 86, 58, 5);
  wpArrow(x + 4, 296, x - 64, 296, "#dc2626", "F");
  if (values.velocity >= 0) {
    wpArrow(x + 78, 282, x + 126, 282, "#2563eb", "v");
    wpArrow(x + 8, 388, x - 42, 388, "#7c3aed", "f");
  } else {
    wpArrow(x + 8, 282, x - 40, 282, "#2563eb", "v");
    wpArrow(x + 78, 388, x + 128, 388, "#7c3aed", "f");
  }
  stroke("#cbd5e1");
  line(82 + 10 * 34, 260, 82 + 10 * 34, 408);
  wpText("先向右减速，再向左加速", 28, 30, "#0f172a", 18, LEFT);
  wpText("v = " + values.velocity.toFixed(2) + " m/s", 28, 470, "#2563eb", 14, LEFT);
  wpText("x = " + values.position.toFixed(2) + " m", 420, 470, "#334155", 14, RIGHT);
}

function drawLesson10ReverseForceGraph() {
  var duration = wpDuration();
  var frame = wpAxes("分段速度图像", "t / s", "v / (m/s)", 0, duration, -3, 10);
  wpPlot(frame, "#2563eb", function (t) { return lesson10ReverseValues(t).velocity; });
  var now = wpTime();
  wpMarker(frame, now, lesson10ReverseValues(now).velocity, "#dc2626");
}

function drawLesson10HorizontalPullScene() {
  var theta = lerp(10, 55, wpProgress()) * Math.PI / 180;
  var cx = 275;
  var cy = 82;
  var radius = 230;
  var bx = cx + radius * Math.sin(theta);
  var by = cy + radius * Math.cos(theta);
  stroke("#334155");
  strokeWeight(3);
  line(cx, cy, bx, by);
  fill("#0f172a");
  noStroke();
  circle(cx, cy, 12);
  fill("#f97316");
  stroke("#c2410c");
  circle(bx, by, 26);
  wpArrow(bx, by, bx + 90, by, "#dc2626", "F");
  var tangentX = Math.cos(theta);
  var tangentY = -Math.sin(theta);
  wpArrow(bx, by, bx + 66 * tangentX, by + 66 * tangentY, "#2563eb", "v");
  stroke("#cbd5e1");
  noFill();
  arc(cx, cy, 84, 84, Math.PI / 2 - theta, Math.PI / 2);
  wpText("θ", cx + 31, cy + 39, "#475569", 14, CENTER);
  wpText("水平拉力维持小球等速", 28, 30, "#0f172a", 18, LEFT);
  wpText("θ = " + (theta * 180 / Math.PI).toFixed(1) + "°", 28, 470, "#334155", 14, LEFT);
}

function drawLesson10HorizontalPullGraph() {
  var mass = wpParam("mass", 1);
  var speed = wpParam("speed", 2);
  var g = wpParam("g", 10);
  var minTheta = 10;
  var maxTheta = 55;
  var powerAt = function (degrees) {
    return mass * g * speed * Math.sin(degrees * Math.PI / 180);
  };
  var frame = wpAxes("水平拉力瞬时功率", "θ / °", "P / W", minTheta, maxTheta, 0, powerAt(maxTheta) * 1.05);
  wpPlot(frame, "#dc2626", powerAt);
  var now = lerp(minTheta, maxTheta, wpProgress());
  wpMarker(frame, now, powerAt(now), "#dc2626");
}

function drawLesson10RatedPowerCarScene() {
  var power = wpParam("power", 60) * 1000;
  var mass = wpParam("mass", 5000);
  var ratio = wpParam("resistRatio", 0.1);
  var g = wpParam("g", 10);
  var resistance = ratio * mass * g;
  var maxSpeed = power / resistance;
  var speed = Math.max(0.5, maxSpeed * wpProgress());
  var traction = power / speed;
  var accel = Math.max(0, (traction - resistance) / mass);
  var x = 72 + 265 * wpProgress();
  wpGround(378);
  fill("#2563eb");
  stroke("#1d4ed8");
  rect(x, 302, 120, 54, 8);
  rect(x + 28, 276, 62, 32, 8);
  fill("#0f172a");
  circle(x + 28, 360, 30);
  circle(x + 96, 360, 30);
  wpArrow(x + 120, 318, x + 185, 318, "#dc2626", "F=P/v");
  wpArrow(x, 338, x - 52, 338, "#7c3aed", "f");
  wpText("恒功率汽车：速度越大，牵引力越小", 28, 30, "#0f172a", 18, LEFT);
  wpText("v = " + speed.toFixed(2) + " m/s", 28, 470, "#2563eb", 14, LEFT);
  wpText("a = " + accel.toFixed(2) + " m/s²", 420, 470, "#dc2626", 14, RIGHT);
}

function drawLesson10RatedPowerCarGraph() {
  var power = wpParam("power", 60) * 1000;
  var mass = wpParam("mass", 5000);
  var resistance = wpParam("resistRatio", 0.1) * mass * wpParam("g", 10);
  var maxSpeed = power / resistance;
  var minSpeed = Math.max(0.8, maxSpeed * 0.1);
  var accelAt = function (speed) {
    return Math.max(0, (power / speed - resistance) / mass);
  };
  var frame = wpAxes("恒功率阶段 a-v 关系", "v / (m/s)", "a / (m/s²)", minSpeed, maxSpeed, 0, accelAt(minSpeed));
  wpPlot(frame, "#dc2626", accelAt);
  var now = lerp(minSpeed, maxSpeed, wpProgress());
  wpMarker(frame, now, accelAt(now), "#dc2626");
}

function lesson10TwoStageValues() {
  var power = wpParam("power", 80) * 1000;
  var mass = wpParam("mass", 5000);
  var accel = wpParam("accel", 1);
  var resistance = wpParam("resistRatio", 0.06) * mass * 10;
  var traction = mass * accel + resistance;
  var switchSpeed = power / traction;
  var switchTime = switchSpeed / accel;
  return {
    power: power,
    mass: mass,
    accel: accel,
    resistance: resistance,
    traction: traction,
    switchSpeed: switchSpeed,
    switchTime: switchTime,
    maxSpeed: power / resistance
  };
}

function drawLesson10TwoStageCarScene() {
  var values = lesson10TwoStageValues();
  var t = Math.min(wpTime(), values.switchTime);
  var speed = values.accel * t;
  var powerNow = values.traction * speed;
  var x = 72 + 265 * constrain(t / values.switchTime, 0, 1);
  wpGround(378);
  fill("#0f766e");
  stroke("#115e59");
  rect(x, 302, 120, 54, 8);
  rect(x + 30, 276, 58, 32, 8);
  fill("#0f172a");
  circle(x + 28, 360, 30);
  circle(x + 96, 360, 30);
  wpArrow(x + 118, 320, x + 182, 320, "#dc2626", "恒 F");
  wpText("第一阶段：恒牵引力匀加速", 28, 30, "#0f172a", 18, LEFT);
  wpText("v = " + speed.toFixed(1) + " m/s", 28, 470, "#2563eb", 14, LEFT);
  wpText("P = " + (powerNow / 1000).toFixed(1) + " kW", 420, 470, "#dc2626", 14, RIGHT);
  wpText("额定功率后转入恒功率阶段", 282, 82, "#7c3aed", 14, CENTER);
}

function drawLesson10TwoStageCarGraph() {
  var values = lesson10TwoStageValues();
  var maxT = values.switchTime;
  var frame = wpAxes("匀加速阶段功率增长", "t / s", "P / kW", 0, maxT, 0, values.power / 1000);
  wpPlot(frame, "#dc2626", function (t) {
    return values.traction * values.accel * t / 1000;
  });
  var now = Math.min(wpTime(), maxT);
  wpMarker(frame, now, values.traction * values.accel * now / 1000, "#dc2626");
  wpText("平均功率 = 额定功率 / 2", 790, 58, "#7c3aed", 13, CENTER);
}

function lesson10ForceReciprocalValues() {
  var power = wpParam("power", 60) * 1000;
  var maxForce = wpParam("maxForce", 6000);
  var resistance = wpParam("resistance", 2000);
  return {
    power: power,
    maxForce: maxForce,
    resistance: resistance,
    switchSpeed: power / maxForce,
    maxSpeed: power / resistance
  };
}

function drawLesson10ForceReciprocalScene() {
  var values = lesson10ForceReciprocalValues();
  var speed = Math.max(0.5, values.maxSpeed * wpProgress());
  var traction = Math.min(values.maxForce, values.power / speed);
  var x = 72 + 265 * wpProgress();
  wpGround(378);
  fill(speed < values.switchSpeed ? "#f97316" : "#2563eb");
  stroke("#334155");
  rect(x, 304, 120, 52, 8);
  fill("#0f172a");
  circle(x + 28, 360, 30);
  circle(x + 96, 360, 30);
  wpArrow(x + 118, 322, x + 182, 322, "#dc2626", "F");
  wpText("低速恒牵引力，高速恒功率", 28, 30, "#0f172a", 18, LEFT);
  wpText("v = " + speed.toFixed(1) + " m/s", 28, 470, "#2563eb", 14, LEFT);
  wpText("F = " + traction.toFixed(0) + " N", 420, 470, "#dc2626", 14, RIGHT);
}

function drawLesson10ForceReciprocalGraph() {
  var values = lesson10ForceReciprocalValues();
  var xMax = 1 / Math.max(1, values.switchSpeed * 0.65);
  var frame = wpAxes("牵引力与速度倒数", "1/v / (s/m)", "F / N", 0, xMax, 0, values.maxForce * 1.08);
  wpPlot(frame, "#2563eb", function (inverseSpeed) {
    return Math.min(values.maxForce, values.power * inverseSpeed);
  });
  var speed = Math.max(0.8, values.maxSpeed * wpProgress());
  var xNow = 1 / speed;
  var forceNow = Math.min(values.maxForce, values.power * xNow);
  wpMarker(frame, xNow, forceNow, "#dc2626");
}
