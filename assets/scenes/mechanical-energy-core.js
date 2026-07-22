// Shared runtime and dispatch for mechanical-energy scenes.
function meVariant() {
  return ((problemDataMap[currentScene] || {}).animation || {}).variant || "";
}

function meParam(key, fallback) {
  return getJsonParam(currentScene, key, fallback);
}

function meTime() {
  return getJsonAnimationState(currentScene).time;
}

function meDuration() {
  return getJsonDuration(currentScene);
}

function meProgress() {
  return constrain(meTime() / Math.max(0.001, meDuration()), 0, 1);
}

function meText(label, x, y, colorHex, size, alignMode) {
  noStroke();
  fill(colorHex || "#334155");
  textSize(size || 14);
  textAlign(alignMode || LEFT, CENTER);
  text(label, x, y);
}

function meArrow(x1, y1, x2, y2, colorHex, label) {
  var angle = Math.atan2(y2 - y1, x2 - x1);
  var head = 8;
  stroke(colorHex || "#dc2626");
  strokeWeight(2.2);
  line(x1, y1, x2, y2);
  line(x2, y2, x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
  line(x2, y2, x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
  if (label) {
    meText(label, x2 + 7, y2 - 9, colorHex || "#dc2626", 13, LEFT);
  }
}

function meBall(x, y, colorHex, label, radius) {
  stroke("#ffffff");
  strokeWeight(2);
  fill(colorHex || "#2563eb");
  circle(x, y, radius || 22);
  if (label) {
    meText(label, x, y - 20, "#0f172a", 13, CENTER);
  }
}

function meBlock(x, y, colorHex, label, angle) {
  push();
  translate(x, y);
  rotate(angle || 0);
  fill(colorHex || "#f97316");
  stroke("#9a3412");
  strokeWeight(1.5);
  rect(-18, -14, 36, 28, 4);
  pop();
  if (label) {
    meText(label, x, y - 25, "#0f172a", 13, CENTER);
  }
}

function meSpring(x1, y1, x2, y2, colorHex, coils) {
  var turns = coils || 9;
  var dx = x2 - x1;
  var dy = y2 - y1;
  var length = Math.sqrt(dx * dx + dy * dy);
  var nx = length ? -dy / length : 0;
  var ny = length ? dx / length : 0;
  noFill();
  stroke(colorHex || "#2563eb");
  strokeWeight(2);
  beginShape();
  vertex(x1, y1);
  for (var i = 1; i < turns * 2; i += 1) {
    var ratio = i / (turns * 2);
    var offset = (i % 2 ? 1 : -1) * 7;
    vertex(x1 + dx * ratio + nx * offset, y1 + dy * ratio + ny * offset);
  }
  vertex(x2, y2);
  endShape();
}

function meGround(y, x1, x2) {
  var left = x1 === undefined ? 28 : x1;
  var right = x2 === undefined ? 542 : x2;
  stroke("#64748b");
  strokeWeight(2);
  line(left, y, right, y);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (var x = left + 7; x < right; x += 18) {
    line(x, y, x - 8, y + 9);
  }
}

function meAxes(title, xLabel, yLabel, xMin, xMax, yMin, yMax) {
  var frame = { left: 620, right: 970, top: 82, bottom: 430 };
  fill("#ffffff");
  stroke("#cbd5e1");
  strokeWeight(1.2);
  rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  meText(title, 795, 36, "#0f172a", 17, CENTER);
  meText(yLabel, 592, 64, "#334155", 13, CENTER);
  meText(xLabel, 795, 468, "#334155", 13, CENTER);
  for (var i = 0; i <= 4; i += 1) {
    var px = map(i, 0, 4, frame.left, frame.right);
    var py = map(i, 0, 4, frame.bottom, frame.top);
    stroke("#e2e8f0");
    strokeWeight(1);
    line(px, frame.top, px, frame.bottom);
    line(frame.left, py, frame.right, py);
    meText(meNumber(map(i, 0, 4, xMin, xMax)), px, frame.bottom + 18, "#475569", 11, CENTER);
    meText(meNumber(map(i, 0, 4, yMin, yMax)), frame.left - 10, py, "#475569", 11, RIGHT);
  }
  frame.xMin = xMin;
  frame.xMax = xMax;
  frame.yMin = yMin;
  frame.yMax = yMax;
  return frame;
}

function meNumber(value) {
  var absolute = Math.abs(value);
  if (absolute >= 1000000) return (value / 1000000).toFixed(1) + "M";
  if (absolute >= 1000) return (value / 1000).toFixed(1) + "k";
  if (absolute >= 10) return value.toFixed(0);
  if (absolute >= 1) return value.toFixed(1);
  return value.toFixed(2);
}

function meGX(frame, value) {
  return map(value, frame.xMin, frame.xMax, frame.left, frame.right);
}

function meGY(frame, value) {
  return map(value, frame.yMin, frame.yMax, frame.bottom, frame.top);
}

function mePlot(frame, colorHex, valueAt, segments, dashed) {
  var count = segments || 140;
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
  for (var i = 0; i <= count; i += 1) {
    var xValue = map(i, 0, count, frame.xMin, frame.xMax);
    var yValue = valueAt(xValue);
    if (Number.isFinite(yValue)) {
      vertex(meGX(frame, xValue), meGY(frame, yValue));
    }
  }
  endShape();
  drawingContext.setLineDash([]);
  drawingContext.restore();
  pop();
}

function meMarker(frame, xValue, yValue, colorHex) {
  var x = meGX(frame, constrain(xValue, frame.xMin, frame.xMax));
  var y = meGY(frame, constrain(yValue, frame.yMin, frame.yMax));
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

function meLegend(items, x, y) {
  for (var i = 0; i < items.length; i += 1) {
    noStroke();
    fill(items[i].color);
    circle(x, y + i * 21, 8);
    meText(items[i].label, x + 10, y + i * 21, "#334155", 12, LEFT);
  }
}

function meBar(frame, index, count, value, colorHex, label, valueLabel) {
  var slot = (frame.right - frame.left) / count;
  var width = slot * 0.56;
  var x = frame.left + slot * index + (slot - width) / 2;
  var y = meGY(frame, constrain(value, frame.yMin, frame.yMax));
  noStroke();
  fill(colorHex);
  rect(x, y, width, frame.bottom - y, 4, 4, 0, 0);
  meText(label, x + width / 2, frame.bottom + 18, "#334155", 12, CENTER);
  meText(valueLabel || meNumber(value), x + width / 2, y - 12, colorHex, 12, CENTER);
}

function meArcPath(cx, cy, radius, startAngle, endAngle, colorHex, weight) {
  noFill();
  stroke(colorHex || "#64748b");
  strokeWeight(weight || 3);
  beginShape();
  for (var i = 0; i <= 50; i += 1) {
    var angle = lerp(startAngle, endAngle, i / 50);
    vertex(cx + radius * Math.sin(angle), cy + radius * Math.cos(angle));
  }
  endShape();
}

function meCar(x, y, angle) {
  push();
  translate(x, y);
  rotate(angle || 0);
  fill("#2563eb");
  stroke("#1e3a8a");
  strokeWeight(1.5);
  rect(-28, -15, 56, 24, 5);
  fill("#bfdbfe");
  quad(-16, -15, -7, -29, 16, -29, 25, -15);
  fill("#0f172a");
  circle(-17, 12, 12);
  circle(18, 12, 12);
  pop();
}

function drawMechanicalEnergyModelScene() {
  var variant = meVariant();
  if (variant === "lesson12_reference_plane") drawLesson12ReferencePlaneScene();
  else if (variant === "lesson12_well_throw") drawLesson12WellThrowScene();
  else if (variant === "lesson12_conservation_condition") drawLesson12ConservationScene();
  else if (variant === "lesson12_football_reference") drawLesson12FootballScene();
  else if (variant === "lesson12_arc_max_height") drawLesson12ArcHeightScene();
  else if (variant === "lesson12_ball_spring_platform") drawLesson12BallSpringScene();
  else if (variant === "lesson12_rod_two_balls") drawLesson12RodTwoBallsScene();
  else if (variant === "lesson12_u_tube_water") drawLesson12UTubeScene();
  else if (variant === "lesson12_accelerated_descent") drawLesson12AcceleratedDescentScene();
  else if (variant === "lesson12_spring_ek_height") drawLesson12SpringEkScene();
  else if (variant === "lesson12_rope_spring_linkage") drawLesson12RopeSpringScene();
  else if (variant === "lesson12_projectile_sea") drawLesson12ProjectileSeaScene();
  else if (variant === "lesson12_pirate_spring") drawLesson12PirateSpringScene();
  else if (variant === "lesson12_track_deformation") drawLesson12TrackDeformationScene();
  else if (variant === "lesson12_incline_pull") drawLesson12InclinePullScene();
  else if (variant === "lesson12_car_two_roads") drawLesson12CarRoadsScene();
  else if (variant === "lesson12_pulley_slider") drawLesson12PulleySliderScene();
  else if (variant === "lesson12_buffer_device") drawLesson12BufferScene();
  else if (variant === "lesson12_sliding_rope") drawLesson12SlidingRopeScene();
  else if (variant === "lesson12_rod_end_balls") drawLesson12RodEndBallsScene();
  else if (variant === "lesson12_linked_sliders") drawLesson12LinkedSlidersScene();
}

function drawMechanicalEnergyModelGraph() {
  var variant = meVariant();
  if (variant === "lesson12_reference_plane") drawLesson12ReferencePlaneGraph();
  else if (variant === "lesson12_well_throw") drawLesson12WellThrowGraph();
  else if (variant === "lesson12_conservation_condition") drawLesson12ConservationGraph();
  else if (variant === "lesson12_football_reference") drawLesson12FootballGraph();
  else if (variant === "lesson12_arc_max_height") drawLesson12ArcHeightGraph();
  else if (variant === "lesson12_ball_spring_platform") drawLesson12BallSpringGraph();
  else if (variant === "lesson12_rod_two_balls") drawLesson12RodTwoBallsGraph();
  else if (variant === "lesson12_u_tube_water") drawLesson12UTubeGraph();
  else if (variant === "lesson12_accelerated_descent") drawLesson12AcceleratedDescentGraph();
  else if (variant === "lesson12_spring_ek_height") drawLesson12SpringEkGraph();
  else if (variant === "lesson12_rope_spring_linkage") drawLesson12RopeSpringGraph();
  else if (variant === "lesson12_projectile_sea") drawLesson12ProjectileSeaGraph();
  else if (variant === "lesson12_pirate_spring") drawLesson12PirateSpringGraph();
  else if (variant === "lesson12_track_deformation") drawLesson12TrackDeformationGraph();
  else if (variant === "lesson12_incline_pull") drawLesson12InclinePullGraph();
  else if (variant === "lesson12_car_two_roads") drawLesson12CarRoadsGraph();
  else if (variant === "lesson12_pulley_slider") drawLesson12PulleySliderGraph();
  else if (variant === "lesson12_buffer_device") drawLesson12BufferGraph();
  else if (variant === "lesson12_sliding_rope") drawLesson12SlidingRopeGraph();
  else if (variant === "lesson12_rod_end_balls") drawLesson12RodEndBallsGraph();
  else if (variant === "lesson12_linked_sliders") drawLesson12LinkedSlidersGraph();
}
