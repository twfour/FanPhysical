// Shared runtime and dispatch for work-and-power scenes.
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

registerSceneRenderer("work_power_model", drawWorkPowerModelScene, drawWorkPowerModelGraph);
