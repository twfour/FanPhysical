function wpVariant() {
  return ((problemDataMap[currentScene] || {}).animation || {}).variant || "";
}

function wpParam(key, fallback) {
  return getJsonParam(currentScene, key, fallback);
}

function wpTime() {
  return getJsonAnimationState(currentScene).time;
}

function wpDuration() {
  return getJsonDuration(currentScene);
}

function wpProgress() {
  return constrain(wpTime() / Math.max(0.001, wpDuration()), 0, 1);
}

function wpText(label, x, y, colorHex, size, alignMode) {
  noStroke();
  fill(colorHex || "#334155");
  textSize(size || 14);
  textAlign(alignMode || LEFT, CENTER);
  text(label, x, y);
}

function wpArrow(x1, y1, x2, y2, colorHex, label) {
  var angle = Math.atan2(y2 - y1, x2 - x1);
  var head = 8;
  push();
  stroke(colorHex || "#dc2626");
  strokeWeight(2.4);
  line(x1, y1, x2, y2);
  line(x2, y2, x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
  line(x2, y2, x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
  pop();
  if (label) {
    wpText(label, x2 + 7 * Math.cos(angle - Math.PI / 2), y2 + 7 * Math.sin(angle - Math.PI / 2), colorHex, 14, LEFT);
  }
}

function wpGround(y) {
  stroke("#64748b");
  strokeWeight(2);
  line(28, y, 542, y);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (var x = 34; x < 542; x += 18) {
    line(x, y, x - 8, y + 9);
  }
}

function wpAxes(title, xLabel, yLabel, xMin, xMax, yMin, yMax) {
  var frame = { left: 620, right: 970, top: 82, bottom: 430 };
  fill("#ffffff");
  stroke("#cbd5e1");
  strokeWeight(1.2);
  rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  wpText(title, 795, 36, "#0f172a", 17, CENTER);
  wpText(yLabel, 592, 64, "#475569", 13, CENTER);
  wpText(xLabel, 795, 468, "#475569", 13, CENTER);
  stroke("#94a3b8");
  strokeWeight(1);
  for (var i = 0; i <= 4; i += 1) {
    var px = map(i, 0, 4, frame.left, frame.right);
    var py = map(i, 0, 4, frame.bottom, frame.top);
    line(px, frame.bottom, px, frame.bottom + 5);
    line(frame.left - 5, py, frame.left, py);
    wpText(wpNumber(map(i, 0, 4, xMin, xMax)), px, frame.bottom + 18, "#64748b", 11, CENTER);
    wpText(wpNumber(map(i, 0, 4, yMin, yMax)), frame.left - 10, py, "#64748b", 11, RIGHT);
  }
  frame.xMin = xMin;
  frame.xMax = xMax;
  frame.yMin = yMin;
  frame.yMax = yMax;
  return frame;
}

function wpNumber(value) {
  var absValue = Math.abs(value);
  if (absValue >= 10000) {
    return (value / 1000).toFixed(0) + "k";
  }
  if (absValue >= 1000) {
    return (value / 1000).toFixed(1) + "k";
  }
  if (absValue >= 10) {
    return value.toFixed(0);
  }
  if (absValue >= 1) {
    return value.toFixed(1);
  }
  return value.toFixed(2);
}

function wpGX(frame, value) {
  return map(value, frame.xMin, frame.xMax, frame.left, frame.right);
}

function wpGY(frame, value) {
  return map(value, frame.yMin, frame.yMax, frame.bottom, frame.top);
}

function wpPlot(frame, colorHex, valueAt, segments) {
  var count = segments || 120;
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  drawingContext.clip();
  noFill();
  stroke(colorHex);
  strokeWeight(2.4);
  beginShape();
  var openShape = true;
  for (var i = 0; i <= count; i += 1) {
    var xValue = map(i, 0, count, frame.xMin, frame.xMax);
    var yValue = valueAt(xValue);
    if (Number.isFinite(yValue)) {
      vertex(wpGX(frame, xValue), wpGY(frame, yValue));
      openShape = true;
    } else if (openShape) {
      endShape();
      beginShape();
      openShape = false;
    }
  }
  endShape();
  drawingContext.restore();
  pop();
}

function wpMarker(frame, xValue, yValue, colorHex) {
  var x = wpGX(frame, constrain(xValue, frame.xMin, frame.xMax));
  var y = wpGY(frame, constrain(yValue, frame.yMin, frame.yMax));
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

function wpLegend(items, x, y) {
  for (var i = 0; i < items.length; i += 1) {
    noStroke();
    fill(items[i].color);
    circle(x, y + i * 22, 8);
    wpText(items[i].label, x + 10, y + i * 22, "#475569", 12, LEFT);
  }
}

function drawWorkPowerModelScene() {
  var variant = wpVariant();
  if (variant === "lesson10_crane_work") drawLesson10CraneScene();
  else if (variant === "lesson10_moving_wedge") drawLesson10MovingWedgeScene();
  else if (variant === "lesson10_conveyor_work") drawLesson10ConveyorScene();
  else if (variant === "lesson10_tangent_disk_work") drawLesson10TangentDiskScene();
  else if (variant === "lesson10_submerged_cube") drawLesson10SubmergedCubeScene();
  else if (variant === "lesson10_pulley_person_work") drawLesson10PulleyPersonScene();
  else if (variant === "lesson10_three_paths_friction") drawLesson10ThreePathsScene();
  else if (variant === "lesson10_reverse_force_power") drawLesson10ReverseForceScene();
  else if (variant === "lesson10_horizontal_pull_ball") drawLesson10HorizontalPullScene();
  else if (variant === "lesson10_rated_power_car") drawLesson10RatedPowerCarScene();
  else if (variant === "lesson10_two_stage_car") drawLesson10TwoStageCarScene();
  else if (variant === "lesson10_force_reciprocal") drawLesson10ForceReciprocalScene();
  else if (variant === "lesson10_tilting_truck") drawLesson10TiltingTruckScene();
  else if (variant === "lesson10_vertical_slider") drawLesson10VerticalSliderScene();
  else if (variant === "lesson10_walking_power") drawLesson10WalkingScene();
  else if (variant === "lesson10_ev_power_graph") drawLesson10EvGraphScene();
  else if (variant === "lesson10_accel_reciprocal") drawLesson10AccelReciprocalScene();
  else if (variant === "lesson10_elevator_work") drawLesson10ElevatorScene();
  else if (variant === "lesson10_car_inverse_force") drawLesson10CarInverseForceScene();
  else if (variant === "lesson10_sled_circle") drawLesson10SledScene();
  else if (variant === "lesson10_gravity_power") drawLesson10GravityPowerScene();
}

function drawWorkPowerModelGraph() {
  var variant = wpVariant();
  if (variant === "lesson10_crane_work") drawLesson10CraneGraph();
  else if (variant === "lesson10_moving_wedge") drawLesson10MovingWedgeGraph();
  else if (variant === "lesson10_conveyor_work") drawLesson10ConveyorGraph();
  else if (variant === "lesson10_tangent_disk_work") drawLesson10TangentDiskGraph();
  else if (variant === "lesson10_submerged_cube") drawLesson10SubmergedCubeGraph();
  else if (variant === "lesson10_pulley_person_work") drawLesson10PulleyPersonGraph();
  else if (variant === "lesson10_three_paths_friction") drawLesson10ThreePathsGraph();
  else if (variant === "lesson10_reverse_force_power") drawLesson10ReverseForceGraph();
  else if (variant === "lesson10_horizontal_pull_ball") drawLesson10HorizontalPullGraph();
  else if (variant === "lesson10_rated_power_car") drawLesson10RatedPowerCarGraph();
  else if (variant === "lesson10_two_stage_car") drawLesson10TwoStageCarGraph();
  else if (variant === "lesson10_force_reciprocal") drawLesson10ForceReciprocalGraph();
  else if (variant === "lesson10_tilting_truck") drawLesson10TiltingTruckGraph();
  else if (variant === "lesson10_vertical_slider") drawLesson10VerticalSliderGraph();
  else if (variant === "lesson10_walking_power") drawLesson10WalkingGraph();
  else if (variant === "lesson10_ev_power_graph") drawLesson10EvGraphGraph();
  else if (variant === "lesson10_accel_reciprocal") drawLesson10AccelReciprocalGraph();
  else if (variant === "lesson10_elevator_work") drawLesson10ElevatorGraph();
  else if (variant === "lesson10_car_inverse_force") drawLesson10CarInverseForceGraph();
  else if (variant === "lesson10_sled_circle") drawLesson10SledGraph();
  else if (variant === "lesson10_gravity_power") drawLesson10GravityPowerGraph();
}

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
