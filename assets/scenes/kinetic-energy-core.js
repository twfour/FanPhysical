// Shared runtime and dispatch for kinetic-energy scenes.
function keVariant() {
  return ((problemDataMap[currentScene] || {}).animation || {}).variant || "";
}

function keParam(key, fallback) {
  return getJsonParam(currentScene, key, fallback);
}

function keTime() {
  return getJsonAnimationState(currentScene).time;
}

function keDuration() {
  return getJsonDuration(currentScene);
}

function keProgress() {
  return constrain(keTime() / Math.max(0.001, keDuration()), 0, 1);
}

function keText(label, x, y, colorHex, size, alignMode) {
  noStroke();
  fill(colorHex || "#334155");
  textSize(size || 14);
  textAlign(alignMode || LEFT, CENTER);
  text(label, x, y);
}

function keArrow(x1, y1, x2, y2, colorHex, label) {
  var angle = Math.atan2(y2 - y1, x2 - x1);
  var head = 8;
  stroke(colorHex || "#dc2626");
  strokeWeight(2.2);
  line(x1, y1, x2, y2);
  line(x2, y2, x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
  line(x2, y2, x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
  if (label) {
    keText(label, x2 + 7, y2 - 9, colorHex || "#dc2626", 13, LEFT);
  }
}

function keGround(y, x1, x2) {
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

function keBall(x, y, colorHex, label) {
  stroke("#ffffff");
  strokeWeight(2);
  fill(colorHex || "#2563eb");
  circle(x, y, 22);
  if (label) {
    keText(label, x, y - 20, "#0f172a", 13, CENTER);
  }
}

function keBlock(x, y, colorHex, label, angle) {
  push();
  translate(x, y);
  rotate(angle || 0);
  fill(colorHex || "#f97316");
  stroke("#9a3412");
  strokeWeight(1.5);
  rect(-17, -14, 34, 28, 4);
  pop();
  if (label) {
    keText(label, x, y - 25, "#0f172a", 13, CENTER);
  }
}

function keSpring(x1, y1, x2, y2, colorHex, coils) {
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

function kePolylinePoint(points, progress) {
  var lengths = [];
  var total = 0;
  var i;
  for (i = 0; i < points.length - 1; i += 1) {
    var dx = points[i + 1].x - points[i].x;
    var dy = points[i + 1].y - points[i].y;
    var segment = Math.sqrt(dx * dx + dy * dy);
    lengths.push(segment);
    total += segment;
  }
  var target = constrain(progress, 0, 1) * total;
  var walked = 0;
  for (i = 0; i < lengths.length; i += 1) {
    if (target <= walked + lengths[i] || i === lengths.length - 1) {
      var local = lengths[i] ? (target - walked) / lengths[i] : 0;
      return {
        x: lerp(points[i].x, points[i + 1].x, local),
        y: lerp(points[i].y, points[i + 1].y, local),
        angle: Math.atan2(points[i + 1].y - points[i].y, points[i + 1].x - points[i].x)
      };
    }
    walked += lengths[i];
  }
  return { x: points[0].x, y: points[0].y, angle: 0 };
}

function keAxes(title, xLabel, yLabel, xMin, xMax, yMin, yMax) {
  var frame = { left: 620, right: 970, top: 82, bottom: 430 };
  fill("#ffffff");
  stroke("#cbd5e1");
  strokeWeight(1.2);
  rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  keText(title, 795, 36, "#0f172a", 17, CENTER);
  keText(yLabel, 592, 64, "#475569", 13, CENTER);
  keText(xLabel, 795, 468, "#475569", 13, CENTER);
  for (var i = 0; i <= 4; i += 1) {
    var px = map(i, 0, 4, frame.left, frame.right);
    var py = map(i, 0, 4, frame.bottom, frame.top);
    stroke("#e2e8f0");
    strokeWeight(1);
    line(px, frame.top, px, frame.bottom);
    line(frame.left, py, frame.right, py);
    keText(keNumber(map(i, 0, 4, xMin, xMax)), px, frame.bottom + 18, "#64748b", 11, CENTER);
    keText(keNumber(map(i, 0, 4, yMin, yMax)), frame.left - 10, py, "#64748b", 11, RIGHT);
  }
  frame.xMin = xMin;
  frame.xMax = xMax;
  frame.yMin = yMin;
  frame.yMax = yMax;
  return frame;
}

function keNumber(value) {
  var absolute = Math.abs(value);
  if (absolute >= 1000000) return (value / 1000000).toFixed(1) + "M";
  if (absolute >= 1000) return (value / 1000).toFixed(1) + "k";
  if (absolute >= 10) return value.toFixed(0);
  if (absolute >= 1) return value.toFixed(1);
  return value.toFixed(2);
}

function keGX(frame, value) {
  return map(value, frame.xMin, frame.xMax, frame.left, frame.right);
}

function keGY(frame, value) {
  return map(value, frame.yMin, frame.yMax, frame.bottom, frame.top);
}

function kePlot(frame, colorHex, valueAt, segments, dashed) {
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
      vertex(keGX(frame, xValue), keGY(frame, yValue));
    }
  }
  endShape();
  drawingContext.setLineDash([]);
  drawingContext.restore();
  pop();
}

function keMarker(frame, xValue, yValue, colorHex) {
  var x = keGX(frame, constrain(xValue, frame.xMin, frame.xMax));
  var y = keGY(frame, constrain(yValue, frame.yMin, frame.yMax));
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

function keLegend(items, x, y) {
  for (var i = 0; i < items.length; i += 1) {
    noStroke();
    fill(items[i].color);
    circle(x, y + i * 21, 8);
    keText(items[i].label, x + 10, y + i * 21, "#475569", 12, LEFT);
  }
}

function drawKineticEnergyModelScene() {
  var variant = keVariant();
  if (variant === "lesson11_jet_takeoff") drawLesson11JetScene();
  else if (variant === "lesson11_spring_incline") drawLesson11SpringInclineScene();
  else if (variant === "lesson11_round_trip_incline") drawLesson11RoundTripScene();
  else if (variant === "lesson11_kinetic_graph") drawLesson11KineticGraphScene();
  else if (variant === "lesson11_incline_loop") drawLesson11InclineLoopScene();
  else if (variant === "lesson11_rough_semicircle") drawLesson11RoughSemicircleScene();
  else if (variant === "lesson11_hydrogen_car") drawLesson11HydrogenCarScene();
  else if (variant === "lesson11_arc_plank") drawLesson11ArcPlankScene();
  else if (variant === "lesson11_conveyor_return") drawLesson11ConveyorReturnScene();
  else if (variant === "lesson11_arc_projectile") drawLesson11ArcProjectileScene();
  else if (variant === "lesson11_spring_compression") drawLesson11SpringCompressionScene();
  else if (variant === "lesson11_incline_conveyor") drawLesson11InclineConveyorScene();
  else if (variant === "lesson11_incline_round_trip") drawLesson11InclineRoundTripScene();
  else if (variant === "lesson11_vertical_drag_force") drawLesson11VerticalDragScene();
  else if (variant === "lesson11_cross_conveyor") drawLesson11CrossConveyorScene();
  else if (variant === "lesson11_hoist_shortest_time") drawLesson11HoistScene();
  else if (variant === "lesson11_car_rope_spring") drawLesson11CarRopeSpringScene();
  else if (variant === "lesson11_pendulum_tension") drawLesson11PendulumTensionScene();
  else if (variant === "lesson11_linear_drag_throw") drawLesson11LinearDragScene();
  else if (variant === "lesson11_trebuchet") drawLesson11TrebuchetScene();
}

function drawKineticEnergyModelGraph() {
  var variant = keVariant();
  if (variant === "lesson11_jet_takeoff") drawLesson11JetGraph();
  else if (variant === "lesson11_spring_incline") drawLesson11SpringInclineGraph();
  else if (variant === "lesson11_round_trip_incline") drawLesson11RoundTripGraph();
  else if (variant === "lesson11_kinetic_graph") drawLesson11KineticGraphGraph();
  else if (variant === "lesson11_incline_loop") drawLesson11InclineLoopGraph();
  else if (variant === "lesson11_rough_semicircle") drawLesson11RoughSemicircleGraph();
  else if (variant === "lesson11_hydrogen_car") drawLesson11HydrogenCarGraph();
  else if (variant === "lesson11_arc_plank") drawLesson11ArcPlankGraph();
  else if (variant === "lesson11_conveyor_return") drawLesson11ConveyorReturnGraph();
  else if (variant === "lesson11_arc_projectile") drawLesson11ArcProjectileGraph();
  else if (variant === "lesson11_spring_compression") drawLesson11SpringCompressionGraph();
  else if (variant === "lesson11_incline_conveyor") drawLesson11InclineConveyorGraph();
  else if (variant === "lesson11_incline_round_trip") drawLesson11InclineRoundTripGraph();
  else if (variant === "lesson11_vertical_drag_force") drawLesson11VerticalDragGraph();
  else if (variant === "lesson11_cross_conveyor") drawLesson11CrossConveyorGraph();
  else if (variant === "lesson11_hoist_shortest_time") drawLesson11HoistGraph();
  else if (variant === "lesson11_car_rope_spring") drawLesson11CarRopeSpringGraph();
  else if (variant === "lesson11_pendulum_tension") drawLesson11PendulumTensionGraph();
  else if (variant === "lesson11_linear_drag_throw") drawLesson11LinearDragGraph();
  else if (variant === "lesson11_trebuchet") drawLesson11TrebuchetGraph();
}

registerSceneRenderer("kinetic_energy_model", drawKineticEnergyModelScene, drawKineticEnergyModelGraph);
