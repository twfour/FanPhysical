// Shared dispatch and drawing helpers for gravitation model scenes.
function getGravitationVariant() {
  return ((problemDataMap[currentScene] || {}).animation || {}).variant || "";
}

function getGravitationProgress() {
  var state = getJsonAnimationState(currentScene);
  return constrain(state.time / Math.max(0.01, getJsonDuration(currentScene)), 0, 1);
}

function drawGravitationModelScene() {
  var variant = getGravitationVariant();
  if (variant === "perihelion_speed") drawGravPerihelionScene();
  else if (variant === "ellipse_return") drawGravEllipseReturnScene();
  else if (variant === "spherical_cavity") drawGravCavityScene();
  else if (variant === "hollow_shells") drawGravShellsScene();
  else if (variant === "earth_density_rotation") drawGravEarthRotationScene();
  else if (variant === "orbit_known_quantities") drawGravKnownOrbitScene();
  else if (variant === "planet_breakup") drawGravBreakupScene();
  else if (variant === "earth_tunnel") drawGravTunnelScene();
  else if (variant === "gravity_profile") drawGravProfileScene();
  else if (variant === "saturn_moons") drawGravSaturnMoonsScene();
  else if (variant === "solar_terms") drawGravSolarTermsScene();
  else if (variant === "halley_comet") drawGravCometScene();
  else if (variant === "scale_weight") drawGravScaleScene();
  else if (variant === "unknown_body_throw") drawGravUnknownThrowScene();
  else if (variant === "arc_angle") drawGravArcAngleScene();
  else if (variant === "photogate_tension") drawGravPhotogateScene();
  else if (variant === "astronomy_photo") drawGravAstronomyPhotoScene();
  else if (variant === "elliptic_force_graph") drawGravForceOrbitScene();
  else if (variant === "lesson9_satellite_comparison") drawLesson9SatelliteComparisonScene();
  else if (variant === "lesson9_exoplanet_mass") drawLesson9ExoplanetMassScene();
  else if (variant === "lesson9_three_orbit_comparison") drawLesson9ThreeOrbitScene();
  else if (variant === "lesson9_saturn_ring_identity") drawLesson9SaturnRingScene();
  else if (variant === "lesson9_sync_min_period") drawLesson9SyncMinPeriodScene();
  else if (variant === "lesson9_eclipse_geometry") drawLesson9EclipseGeometryScene();
  else if (variant === "lesson9_horizon_flash") drawLesson9HorizonFlashScene();
  else if (variant === "lesson9_sync_transfer") drawLesson9SyncTransferScene();
  else if (variant === "lesson9_change3_lunar_orbits") drawLesson9Change3Scene();
  else if (variant === "lesson9_earth_mars_transfer") drawLesson9EarthMarsScene();
  else if (variant === "lesson9_binary_star") drawLesson9BinaryStarScene();
  else if (variant === "lesson9_binary_mass_transfer") drawLesson9BinaryTransferScene();
  else if (variant === "lesson9_triple_star") drawLesson9TripleStarScene();
  else if (variant === "lesson9_change4_speed") drawLesson9Change4SpeedScene();
  else if (variant === "lesson9_space_elevator") drawLesson9SpaceElevatorScene();
  else if (variant === "lesson9_monitor_window") drawLesson9MonitorWindowScene();
  else if (variant === "lesson9_satellite_distance_graph") drawLesson9SatelliteDistanceScene();
  else if (variant === "lesson9_tianzhou_transfer") drawLesson9TianzhouScene();
  else if (variant === "lesson9_ground_track") drawLesson9GroundTrackScene();
  else if (variant === "lesson9_black_hole_period") drawLesson9BlackHoleScene();
  else if (variant === "lesson9_rod_graph_planet") drawLesson9RodGraphScene();
  else if (variant === "lesson9_pulsar_binary_satellite") drawLesson9PulsarScene();
  else if (variant === "lesson9_ellipse_energy") drawLesson9EllipseEnergyScene();
}

function drawGravitationModelGraph() {
  var variant = getGravitationVariant();
  if (variant === "perihelion_speed") drawGravPerihelionGraph();
  else if (variant === "ellipse_return") drawGravEllipseReturnGraph();
  else if (variant === "spherical_cavity") drawGravCavityGraph();
  else if (variant === "hollow_shells") drawGravShellsGraph();
  else if (variant === "earth_density_rotation") drawGravEarthRotationGraph();
  else if (variant === "orbit_known_quantities") drawGravKnownOrbitGraph();
  else if (variant === "planet_breakup") drawGravBreakupGraph();
  else if (variant === "earth_tunnel") drawGravTunnelGraph();
  else if (variant === "gravity_profile") drawGravProfileGraph();
  else if (variant === "saturn_moons") drawGravSaturnMoonsGraph();
  else if (variant === "solar_terms") drawGravSolarTermsGraph();
  else if (variant === "halley_comet") drawGravCometGraph();
  else if (variant === "scale_weight") drawGravScaleGraph();
  else if (variant === "unknown_body_throw") drawGravUnknownThrowGraph();
  else if (variant === "arc_angle") drawGravArcAngleGraph();
  else if (variant === "photogate_tension") drawGravPhotogateGraph();
  else if (variant === "astronomy_photo") drawGravAstronomyPhotoGraph();
  else if (variant === "elliptic_force_graph") drawGravForceOrbitGraph();
  else if (variant === "lesson9_satellite_comparison") drawLesson9SatelliteComparisonGraph();
  else if (variant === "lesson9_exoplanet_mass") drawLesson9ExoplanetMassGraph();
  else if (variant === "lesson9_three_orbit_comparison") drawLesson9ThreeOrbitGraph();
  else if (variant === "lesson9_saturn_ring_identity") drawLesson9SaturnRingGraph();
  else if (variant === "lesson9_sync_min_period") drawLesson9SyncMinPeriodGraph();
  else if (variant === "lesson9_eclipse_geometry") drawLesson9EclipseGeometryGraph();
  else if (variant === "lesson9_horizon_flash") drawLesson9HorizonFlashGraph();
  else if (variant === "lesson9_sync_transfer") drawLesson9SyncTransferGraph();
  else if (variant === "lesson9_change3_lunar_orbits") drawLesson9Change3Graph();
  else if (variant === "lesson9_earth_mars_transfer") drawLesson9EarthMarsGraph();
  else if (variant === "lesson9_binary_star") drawLesson9BinaryStarGraph();
  else if (variant === "lesson9_binary_mass_transfer") drawLesson9BinaryTransferGraph();
  else if (variant === "lesson9_triple_star") drawLesson9TripleStarGraph();
  else if (variant === "lesson9_change4_speed") drawLesson9Change4SpeedGraph();
  else if (variant === "lesson9_space_elevator") drawLesson9SpaceElevatorGraph();
  else if (variant === "lesson9_monitor_window") drawLesson9MonitorWindowGraph();
  else if (variant === "lesson9_satellite_distance_graph") drawLesson9SatelliteDistanceGraph();
  else if (variant === "lesson9_tianzhou_transfer") drawLesson9TianzhouGraph();
  else if (variant === "lesson9_ground_track") drawLesson9GroundTrackGraph();
  else if (variant === "lesson9_black_hole_period") drawLesson9BlackHoleGraph();
  else if (variant === "lesson9_rod_graph_planet") drawLesson9RodGraphGraph();
  else if (variant === "lesson9_pulsar_binary_satellite") drawLesson9PulsarGraph();
  else if (variant === "lesson9_ellipse_energy") drawLesson9EllipseEnergyGraph();
}

function gravSceneHeading(title, subtitle) {
  noStroke();
  fill("#f8fafc");
  rect(0, 0, 570, 500);
  fill("#0f172a");
  textAlign(LEFT, TOP);
  textSize(18);
  text(title, 28, 22);
  fill("#475569");
  textSize(13);
  text(subtitle, 28, 49);
}

function gravGraphFrame(title, subtitle) {
  var frame = { x: graphLeft + 54, y: 88, w: graphRight - graphLeft - 88, h: 304 };
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(19);
  text(title, graphLeft + 24, 20);
  fill("#475569");
  textSize(13);
  text(subtitle, graphLeft + 24, 47);
  drawBasicGrid(frame.x, frame.y, frame.w, frame.h);
  return frame;
}

function gravPlot(frame, xMax, yMin, yMax, colorHex, fn) {
  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  beginShape();
  for (var i = 0; i <= 120; i++) {
    var x = xMax * i / 120;
    var y = fn(x);
    vertex(frame.x + frame.w * i / 120, map(y, yMin, yMax, frame.y + frame.h, frame.y));
  }
  endShape();
}

function gravGraphMarker(frame, x, xMax, y, yMin, yMax, colorHex) {
  var px = map(x, 0, xMax, frame.x, frame.x + frame.w);
  var py = map(y, yMin, yMax, frame.y + frame.h, frame.y);
  stroke(colorHex);
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(px, frame.y, px, frame.y + frame.h);
  drawingContext.setLineDash([]);
  noStroke();
  fill(colorHex);
  circle(px, py, 11);
}

function gravEllipsePoint(focusX, focusY, a, e, meanAnomaly, flipX) {
  var E = meanAnomaly;
  for (var i = 0; i < 6; i++) E -= (E - e * Math.sin(E) - meanAnomaly) / (1 - e * Math.cos(E));
  var b = a * Math.sqrt(Math.max(0.01, 1 - e * e));
  var x = a * (Math.cos(E) - e);
  if (flipX) x = -x;
  return { x: focusX + x, y: focusY + b * Math.sin(E), r: a * (1 - e * Math.cos(E)), E: E };
}

function gravDrawEllipse(focusX, focusY, a, e, flipX, colorHex) {
  var centerX = focusX - a * e * (flipX ? -1 : 1);
  var b = a * Math.sqrt(Math.max(0.01, 1 - e * e));
  noFill();
  stroke(colorHex || "#94a3b8");
  strokeWeight(1.7);
  ellipse(centerX, focusY, 2 * a, 2 * b);
}

function gravBody(x, y, size, colorHex, label) {
  noStroke();
  fill(colorHex);
  circle(x, y, size);
  if (label) {
    fill("#ffffff");
    textAlign(CENTER, CENTER);
    textSize(Math.max(10, size * 0.35));
    text(label, x, y);
  }
}

function gravArrow(x1, y1, x2, y2, colorHex, label) {
  drawArrow(x1, y1, x2, y2, colorHex);
  if (label) {
    noStroke();
    fill(colorHex);
    textAlign(LEFT, CENTER);
    textSize(12);
    text(label, x2 + 5, y2);
  }
}

function gravOrbit(cx, cy, radius, colorHex, dashed) {
  noFill();
  stroke(colorHex || "#cbd5e1");
  strokeWeight(1.4);
  if (dashed) drawingContext.setLineDash([4, 4]);
  circle(cx, cy, radius * 2);
  if (dashed) drawingContext.setLineDash([]);
}

function gravText(value, x, y, colorHex, size, alignMode) {
  noStroke();
  fill(colorHex || "#0f172a");
  textAlign(alignMode || LEFT, TOP);
  textSize(size || 13);
  text(value, x, y);
}

function gravLegendItem(x, y, colorHex, value) {
  noStroke();
  fill(colorHex);
  rect(x, y + 3, 14, 8, 2);
  gravText(value, x + 20, y, "#334155", 11, LEFT);
}

function gravBarChart(frame, labels, values, colors, maxValue, suffix) {
  var count = Math.max(1, labels.length);
  var gap = 12;
  var usable = frame.w - gap * (count + 1);
  var width = Math.max(18, usable / count);
  var topValue = Math.max(0.0001, maxValue || Math.max.apply(null, values) * 1.12);
  for (var i = 0; i < count; i++) {
    var x = frame.x + gap + i * (width + gap);
    var height = constrain(values[i] / topValue, 0, 1) * (frame.h - 32);
    noStroke();
    fill(colors[i % colors.length]);
    rect(x, frame.y + frame.h - height, width, height, 4);
    gravText(labels[i], x + width / 2, frame.y + frame.h + 9, "#334155", 10, CENTER);
    gravText(values[i].toFixed(values[i] >= 10 ? 0 : 2) + (suffix || ""), x + width / 2, frame.y + frame.h - height - 18, "#0f172a", 10, CENTER);
  }
}

function gravDrawAngleArc(cx, cy, radius, startAngle, endAngle, colorHex, label) {
  noFill();
  stroke(colorHex);
  strokeWeight(2);
  arc(cx, cy, radius * 2, radius * 2, startAngle, endAngle);
  var mid = (startAngle + endAngle) / 2;
  gravText(label, cx + (radius + 10) * Math.cos(mid), cy + (radius + 10) * Math.sin(mid), colorHex, 12, CENTER);
}

function gravDrawOptionRows(title, subtitle, labels, ratios, truths) {
  var frame = gravGraphFrame(title, subtitle);
  var rowH = frame.h / labels.length;
  var axisX = frame.x + frame.w * 0.72;
  stroke("#64748b");
  drawingContext.setLineDash([4, 4]);
  line(axisX, frame.y, axisX, frame.y + frame.h);
  drawingContext.setLineDash([]);
  for (var i = 0; i < labels.length; i++) {
    var y = frame.y + i * rowH;
    noStroke();
    fill(i % 2 ? "#f8fafc" : "#f1f5f9");
    rect(frame.x, y, frame.w, rowH - 3);
    var bar = constrain(ratios[i] / 1.4, 0, 1) * frame.w;
    fill(truths[i] ? "#16a34a" : "#dc2626");
    rect(frame.x, y + rowH * 0.52, bar, 13, 3);
    gravText(labels[i], frame.x + 8, y + 8, "#0f172a", 12, LEFT);
    gravText(truths[i] ? "正确" : "不符", frame.x + frame.w - 8, y + 8, truths[i] ? "#15803d" : "#b91c1c", 12, RIGHT);
  }
}

registerSceneRenderer("gravitation_model", drawGravitationModelScene, drawGravitationModelGraph);
