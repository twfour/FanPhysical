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

function drawGravPerihelionScene() {
  var ra = getJsonParam(currentScene, "apoapsis", 5);
  var rp = Math.min(ra - 0.2, getJsonParam(currentScene, "periapsis", 2));
  var va = getJsonParam(currentScene, "farSpeed", 4);
  var e = (ra - rp) / (ra + rp);
  var a = 160;
  var p = getGravitationProgress();
  var M = Math.PI + Math.PI * p;
  var body = gravEllipsePoint(330, 250, a, e, M, false);
  var speed = va * ra / map(body.r, a * (1 - e), a * (1 + e), rp, ra);
  gravSceneHeading("远日点到近日点", "相等时间扫过相等面积，r·v 保持不变");
  gravDrawEllipse(330, 250, a, e, false, "#94a3b8");
  gravBody(330, 250, 34, "#f59e0b", "日");
  gravBody(body.x, body.y, 20, "#2563eb", "");
  stroke("#cbd5e1");
  line(330, 250, body.x, body.y);
  noStroke();
  fill("#0f172a");
  textAlign(LEFT, TOP);
  textSize(14);
  text("当前 r ≈ " + map(body.r, a * (1 - e), a * (1 + e), rp, ra).toFixed(2) + " a.u.", 28, 408);
  text("当前 v ≈ " + speed.toFixed(2) + " km/s", 28, 432);
  text("结论：v近 = (a/b)v远", 300, 432);
}

function drawGravPerihelionGraph() {
  var ra = getJsonParam(currentScene, "apoapsis", 5);
  var rp = Math.min(ra - 0.2, getJsonParam(currentScene, "periapsis", 2));
  var va = getJsonParam(currentScene, "farSpeed", 4);
  var p = getGravitationProgress();
  var rNow = ra - (ra - rp) * p;
  var frame = gravGraphFrame("速度—日距关系", "v = v远·r远 / r");
  gravPlot(frame, ra - rp, va, va * ra / rp, "#2563eb", function (x) { return va * ra / (rp + x); });
  gravGraphMarker(frame, rNow - rp, ra - rp, va * ra / rNow, va, va * ra / rp, "#dc2626");
  noStroke(); fill("#334155"); textAlign(LEFT, TOP); textSize(12);
  text("近日点 b", frame.x, frame.y + frame.h + 12); text("远日点 a", frame.x + frame.w - 48, frame.y + frame.h + 12);
}

function drawGravEllipseReturnScene() {
  var r = getJsonParam(currentScene, "orbitRadius", 4);
  var R = Math.min(r - 0.2, getJsonParam(currentScene, "earthRadius", 1));
  var e = (r - R) / (r + R);
  var a = 112;
  var scale = 180 / r;
  a = (r + R) * scale / 2;
  var p = getGravitationProgress();
  var body = gravEllipsePoint(260, 252, a, e, Math.PI + Math.PI * p, true);
  gravSceneHeading("降速进入转移椭圆", "A 为远地点，B 为地表相切的近地点");
  noFill(); stroke("#cbd5e1"); circle(260, 252, 2 * r * scale);
  gravDrawEllipse(260, 252, a, e, true, "#2563eb");
  gravBody(260, 252, 2 * R * scale, "#60a5fa", "地");
  gravBody(body.x, body.y, 17, "#f97316", "");
  noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(14);
  text("A", 260 + r * scale + 8, 242); text("B", 260 - R * scale - 22, 242);
  text("已完成转移 " + (p * 100).toFixed(0) + "%", 28, 430);
}

function drawGravEllipseReturnGraph() {
  var r = getJsonParam(currentScene, "orbitRadius", 4);
  var R = Math.min(r - 0.2, getJsonParam(currentScene, "earthRadius", 1));
  var T = getJsonParam(currentScene, "period", 16);
  var transfer = 0.5 * T * Math.pow((r + R) / (2 * r), 1.5);
  var p = getGravitationProgress();
  var frame = gravGraphFrame("转移过程的地心距", "tAB = T/2 · [(r+R)/(2r)]³ᐟ²");
  gravPlot(frame, transfer, R, r, "#2563eb", function (t) { var q = t / transfer; return R + (r - R) * 0.5 * (1 + Math.cos(Math.PI * q)); });
  var nowR = R + (r - R) * 0.5 * (1 + Math.cos(Math.PI * p));
  gravGraphMarker(frame, transfer * p, transfer, nowR, R, r, "#dc2626");
  noStroke(); fill("#334155"); textAlign(LEFT, TOP); textSize(12); text("0", frame.x, frame.y + frame.h + 10); text(transfer.toFixed(2) + " h", frame.x + frame.w - 42, frame.y + frame.h + 10);
}

function drawGravCavityScene() {
  var p = getGravitationProgress();
  gravSceneHeading("球体挖腔的等效叠加", "剩余部分 = 完整大球 − 被挖去的小球");
  noStroke(); fill("#93c5fd"); circle(220, 255, 250);
  fill("#f8fafc"); circle(282, 255, 125 * p);
  noFill(); stroke("#64748b"); drawingContext.setLineDash([4, 4]); circle(282, 255, 125); drawingContext.setLineDash([]);
  gravBody(470, 255, 22, "#f97316", "m");
  gravArrow(458, 236, 368, 236, "#2563eb", "F₁");
  if (p > 0.2) gravArrow(458, 274, 393, 274, "#dc2626", "减去 F挖");
  noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(14);
  text("挖腔进度 " + (p * 100).toFixed(0) + "%", 28, 425); text("最终 F₂ = 7GMm/(36R²)", 280, 425);
}

function drawGravCavityGraph() {
  var p = getGravitationProgress();
  var frame = gravGraphFrame("引力叠加分解", "以 GMm/R² 为单位");
  var vals = [0.25, p / 18, 0.25 - p / 18];
  var labels = ["完整球 F₁", "挖去部分", "剩余 F₂"];
  for (var i = 0; i < 3; i++) {
    var bw = 62; var x = frame.x + 38 + i * 96; var bh = vals[i] / 0.28 * frame.h;
    noStroke(); fill(i === 1 ? "#dc2626" : i === 2 ? "#16a34a" : "#2563eb"); rect(x, frame.y + frame.h - bh, bw, bh, 5);
    fill("#0f172a"); textAlign(CENTER, TOP); textSize(11); text(labels[i], x + bw / 2, frame.y + frame.h + 10); text(vals[i].toFixed(3), x + bw / 2, frame.y + frame.h - bh - 18);
  }
}

function drawGravShellsScene() {
  var L = getJsonParam(currentScene, "separation", 4);
  var p = getGravitationProgress();
  var gap = map(L, 2.5, 8, 190, 330) - 10 * Math.sin(Math.PI * p);
  var x1 = 285 - gap / 2; var x2 = 285 + gap / 2;
  gravSceneHeading("两个均匀空心球壳", "球外引力等效为球心处质点之间的引力");
  noFill(); stroke("#2563eb"); strokeWeight(16); circle(x1, 250, 112); stroke("#f97316"); circle(x2, 250, 112);
  gravBody(x1, 250, 8, "#0f172a", ""); gravBody(x2, 250, 8, "#0f172a", "");
  gravArrow(x1 + 68, 250, x1 + 112, 250, "#dc2626", "F"); gravArrow(x2 - 68, 250, x2 - 112, 250, "#dc2626", "");
  noStroke(); fill("#0f172a"); textAlign(CENTER, TOP); textSize(14); text("中心距 L = " + L.toFixed(1) + " m", 285, 360); text("F = GM²/L²", 285, 386);
}

function drawGravShellsGraph() {
  var L = getJsonParam(currentScene, "separation", 4); var M = getJsonParam(currentScene, "mass", 2); var G = 6.67e-11;
  var frame = gravGraphFrame("球壳引力—中心距", "F = GM²/L²");
  var minL = 2.5; var maxL = 8; var yMax = G * M * M / (minL * minL);
  gravPlot(frame, maxL - minL, 0, yMax, "#2563eb", function (x) { var d = minL + x; return G * M * M / (d * d); });
  gravGraphMarker(frame, L - minL, maxL - minL, G * M * M / (L * L), 0, yMax, "#dc2626");
  noStroke(); fill("#334155"); textAlign(LEFT, TOP); textSize(12); text("L 增大，F 按平方反比减小", frame.x + 8, frame.y + 8);
}

function drawGravEarthRotationScene() {
  var p = getGravitationProgress(); var angle = p * Math.PI * 2;
  gravSceneHeading("地球自转与视重", "赤道处万有引力的一部分提供自转向心力");
  gravBody(270, 260, 238, "#60a5fa", "");
  stroke("#ffffff"); strokeWeight(2); line(270, 141, 270, 379); line(270 + 118 * Math.cos(angle), 260 + 118 * Math.sin(angle), 270 - 118 * Math.cos(angle), 260 - 118 * Math.sin(angle));
  gravBody(270, 140, 16, "#f97316", ""); gravBody(389, 260, 16, "#dc2626", "");
  gravArrow(270, 122, 270, 82, "#f97316", "g₀"); gravArrow(407, 260, 453, 260, "#dc2626", "g");
  noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(14); text("北极：无自转向心项", 38, 410); text("赤道：g₀ − g = ω²R", 302, 410);
}

function drawGravEarthRotationGraph() {
  var gp = getJsonParam(currentScene, "poleGravity", 9.83); var ge = Math.min(gp, getJsonParam(currentScene, "equatorGravity", 9.78)); var lat = 90 * getGravitationProgress();
  var frame = gravGraphFrame("视重—纬度", "g(φ)=g赤+(g极−g赤)sin²φ");
  gravPlot(frame, 90, ge, gp, "#2563eb", function (x) { return ge + (gp - ge) * Math.pow(Math.sin(x * Math.PI / 180), 2); });
  var now = ge + (gp - ge) * Math.pow(Math.sin(lat * Math.PI / 180), 2);
  gravGraphMarker(frame, lat, 90, now, ge, gp, "#dc2626");
  noStroke(); fill("#334155"); textAlign(LEFT, TOP); textSize(12); text("赤道 0°", frame.x, frame.y + frame.h + 10); text("北极 90°", frame.x + frame.w - 52, frame.y + frame.h + 10);
}

function drawGravKnownOrbitScene() {
  var p = getGravitationProgress(); var angle = p * Math.PI * 2;
  gravSceneHeading("月球轨道数据估算", "已知 G、r、T，可求地球质量和月球速度");
  gravBody(270, 255, 108, "#3b82f6", "地"); noFill(); stroke("#94a3b8"); circle(270, 255, 330);
  var x = 270 + 165 * Math.cos(angle); var y = 255 + 165 * Math.sin(angle); gravBody(x, y, 28, "#cbd5e1", "月");
  stroke("#64748b"); line(270, 255, x, y); noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(14); text("r", (270 + x) / 2, (255 + y) / 2);
  text("卫星质量 m 在方程中约去", 28, 425);
}

function gravKnownOrbitValues() {
  var r = getJsonParam(currentScene, "orbitRadius", 3.84) * 1e8; var T = getJsonParam(currentScene, "period", 27.3) * 86400; var G = 6.67e-11;
  return { r: r, T: T, mass: 4 * Math.PI * Math.PI * Math.pow(r, 3) / (G * T * T), speed: 2 * Math.PI * r / T };
}

function drawGravKnownOrbitGraph() {
  var v = gravKnownOrbitValues(); var p = getGravitationProgress(); var frame = gravGraphFrame("由 r、T 得到的物理量", "M=4π²r³/(GT²)，v=2πr/T");
  var values = [v.mass / 1e24, v.speed / 1000]; var labels = ["地球质量/10²⁴kg", "月球速度/km·s⁻¹"];
  for (var i = 0; i < 2; i++) { var bh = Math.min(frame.h * 0.82, values[i] / 8 * frame.h); var x = frame.x + 62 + i * 142; noStroke(); fill(i ? "#f97316" : "#2563eb"); rect(x, frame.y + frame.h - bh, 72, bh * p, 5); fill("#0f172a"); textAlign(CENTER, TOP); textSize(11); text(labels[i], x + 36, frame.y + frame.h + 10); text(values[i].toFixed(2), x + 36, frame.y + frame.h - bh - 18); }
}

function drawGravBreakupScene() {
  var p = getGravitationProgress(); var ratio = 1.15 * p; var offset = ratio > 1 ? (ratio - 1) * 180 : 0;
  gravSceneHeading("自转加快直到解体", "临界条件：ω²R = g");
  gravBody(270, 260, 236, "#60a5fa", "");
  for (var i = 0; i < 10; i++) { var a = i * Math.PI * 2 / 10 + p * Math.PI * 4; gravBody(270 + 118 * Math.cos(a), 260 + 118 * Math.sin(a), 9, "#e2e8f0", ""); }
  gravBody(388 + offset, 260, 18, "#f97316", ""); gravArrow(388 + offset, 260, 340 + offset, 260, "#2563eb", "g"); gravArrow(388 + offset, 282, 388 + offset + 48 * ratio * ratio, 282, "#dc2626", "ω²R");
  noStroke(); fill(ratio >= 1 ? "#dc2626" : "#15803d"); textAlign(LEFT, TOP); textSize(15); text(ratio >= 1 ? "达到临界：赤道物质开始脱离" : "尚未解体", 28, 430);
}

function drawGravBreakupGraph() {
  var x = 1.15 * getGravitationProgress(); var frame = gravGraphFrame("离心需求/重力", "纵轴 = ω²R/g，临界值为 1");
  gravPlot(frame, 1.15, 0, 1.35, "#2563eb", function (q) { return q * q; });
  stroke("#dc2626"); drawingContext.setLineDash([4, 4]); line(frame.x, map(1, 0, 1.35, frame.y + frame.h, frame.y), frame.x + frame.w, map(1, 0, 1.35, frame.y + frame.h, frame.y)); drawingContext.setLineDash([]);
  gravGraphMarker(frame, x, 1.15, x * x, 0, 1.35, "#f97316");
}

function drawGravTunnelScene() {
  var p = getGravitationProgress(); var xNorm = Math.cos(Math.PI * p); var x = 270 + 150 * xNorm;
  gravSceneHeading("通过地心的光滑隧道", "球内加速度 a = −g·x/R，始终指向地心");
  gravBody(270, 255, 310, "#60a5fa", ""); stroke("#e2e8f0"); strokeWeight(13); line(115, 255, 425, 255); gravBody(x, 255, 22, "#f97316", "m");
  var arrow = -xNorm * 72; if (Math.abs(arrow) > 5) gravArrow(x, 282, x + arrow, 282, "#dc2626", "a");
  noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(14); text("距地心 x/R = " + xNorm.toFixed(2), 28, 425); text("地心处加速度为 0", 330, 425);
}

function drawGravTunnelGraph() {
  var p = getGravitationProgress(); var x = Math.cos(Math.PI * p); var g = getJsonParam(currentScene, "surfaceGravity", 10); var frame = gravGraphFrame("加速度大小—位置", "|a|=g|x|/R：先减小后增大");
  gravPlot(frame, 2, 0, g, "#2563eb", function (q) { return g * Math.abs(1 - q); });
  gravGraphMarker(frame, 1 - x, 2, g * Math.abs(x), 0, g, "#dc2626");
  noStroke(); fill("#334155"); textAlign(LEFT, TOP); textSize(12); text("中国", frame.x, frame.y + frame.h + 10); text("地心", frame.x + frame.w / 2 - 14, frame.y + frame.h + 10); text("巴西", frame.x + frame.w - 28, frame.y + frame.h + 10);
}

function gravProfileValue(q, g) { return q >= 0 ? g / Math.pow(1 + q, 2) : g * (1 + q); }

function drawGravProfileScene() {
  var depth = getJsonParam(currentScene, "depthRatio", 0.6); var height = getJsonParam(currentScene, "heightRatio", 0.6); var p = getGravitationProgress(); var q = -depth + (depth + height) * p; var y = 355 - q * 190;
  gravSceneHeading("地表上下的重力变化", "地下按距地心线性变化，地表上方按平方反比变化");
  noStroke(); fill("#60a5fa"); circle(270, 570, 430); stroke("#64748b"); line(270, 355, 270, 112); gravBody(270, y, 22, "#f97316", "m");
  noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(14); text(q >= 0 ? "地表上方 h/R = " + q.toFixed(2) : "地下深度 h/R = " + (-q).toFixed(2), 28, 425);
}

function drawGravProfileGraph() {
  var depth = getJsonParam(currentScene, "depthRatio", 0.6); var height = getJsonParam(currentScene, "heightRatio", 0.6); var g = getJsonParam(currentScene, "surfaceGravity", 10); var p = getGravitationProgress(); var q = -depth + (depth + height) * p; var frame = gravGraphFrame("重力加速度—相对地表位置", "左侧为地下，右侧为地表上空");
  gravPlot(frame, depth + height, 0, g, "#2563eb", function (x) { return gravProfileValue(x - depth, g); });
  gravGraphMarker(frame, q + depth, depth + height, gravProfileValue(q, g), 0, g, "#dc2626");
  noStroke(); fill("#334155"); textAlign(CENTER, TOP); textSize(12); text("地表", map(depth, 0, depth + height, frame.x, frame.x + frame.w), frame.y + frame.h + 10);
}

function drawGravSaturnMoonsScene() {
  var ratio = getJsonParam(currentScene, "radiusRatio", 2); var periodRatio = Math.pow(ratio, 1.5); var p = getGravitationProgress();
  var aM = Math.PI * 2 * p; var aE = Math.PI * 2 * p / periodRatio;
  gravSceneHeading("土星双卫星相对位置", "同一时间内，外轨道卫星转过的角度更小");
  gravBody(270, 255, 76, "#f59e0b", "S"); noFill(); stroke("#cbd5e1"); circle(270, 255, 180); circle(270, 255, 360);
  gravBody(270 + 90 * Math.cos(-aM), 255 + 90 * Math.sin(-aM), 24, "#2563eb", "M");
  gravBody(270 + 180 * Math.cos(-aE), 255 + 180 * Math.sin(-aE), 24, "#f97316", "E");
  noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(14); text("θM = " + (360 * p).toFixed(0) + "°", 28, 420); text("θE = " + (360 * p / periodRatio).toFixed(0) + "°", 280, 420);
}

function drawGravSaturnMoonsGraph() {
  var ratio = getJsonParam(currentScene, "radiusRatio", 2); var periodRatio = Math.pow(ratio, 1.5); var p = getGravitationProgress(); var frame = gravGraphFrame("两颗卫星的角位置", "横轴为土卫一完成一周的时间比例");
  gravPlot(frame, 1, 0, 360, "#2563eb", function (x) { return 360 * x; });
  gravPlot(frame, 1, 0, 360, "#f97316", function (x) { return 360 * x / periodRatio; });
  gravGraphMarker(frame, p, 1, 360 * p, 0, 360, "#2563eb");
  gravGraphMarker(frame, p, 1, 360 * p / periodRatio, 0, 360, "#f97316");
  noStroke(); fill("#2563eb"); textAlign(LEFT, TOP); textSize(12); text("M", frame.x + 8, frame.y + 8); fill("#f97316"); text("E", frame.x + 30, frame.y + 8);
}

function drawGravSolarTermsScene() {
  var e = getJsonParam(currentScene, "eccentricity", 0.12); var p = getGravitationProgress(); var pos = gravEllipsePoint(270, 255, 184, e, Math.PI * 2 * p, false);
  gravSceneHeading("二十四节气与公转快慢", "近日点附近快，远日点附近慢；等角度不等时间");
  gravDrawEllipse(270, 255, 184, e, false, "#94a3b8"); gravBody(270, 255, 34, "#f59e0b", "日");
  for (var i = 0; i < 24; i++) { var dot = gravEllipsePoint(270, 255, 184, e, Math.PI * 2 * i / 24, false); gravBody(dot.x, dot.y, 5, "#cbd5e1", ""); }
  gravBody(pos.x, pos.y, 22, "#2563eb", "地");
  noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(13); text("当前位置对应节气序号约 " + (Math.floor(p * 24) + 1), 28, 425); text("面积速度恒定", 360, 425);
}

function drawGravSolarTermsGraph() {
  var e = getJsonParam(currentScene, "eccentricity", 0.12); var p = getGravitationProgress(); var frame = gravGraphFrame("相邻节气的相对时长", "每段扫角相同，时长近似与 r² 成正比");
  var maxV = Math.pow(1 + e, 2); var minV = Math.pow(1 - e, 2);
  gravPlot(frame, 24, minV, maxV, "#2563eb", function (x) { return Math.pow(1 - e * Math.cos(Math.PI * 2 * x / 24), 2); });
  var now = Math.pow(1 - e * Math.cos(Math.PI * 2 * p), 2); gravGraphMarker(frame, p * 24, 24, now, minV, maxV, "#dc2626");
  noStroke(); fill("#334155"); textAlign(LEFT, TOP); textSize(12); text("近日点附近短", frame.x + 8, frame.y + 8); text("远日点附近长", frame.x + frame.w - 92, frame.y + 8);
}

function drawGravCometScene() {
  var rp = getJsonParam(currentScene, "periapsis", 1); var ra = Math.max(rp + 0.5, getJsonParam(currentScene, "apoapsis", 6)); var e = (ra - rp) / (ra + rp); var p = getGravitationProgress(); var pos = gravEllipsePoint(360, 255, 150, e, Math.PI * 2 * p, false);
  gravSceneHeading("哈雷彗星的高偏心率轨道", "近日点速度大、引力加速度也大");
  gravDrawEllipse(360, 255, 150, e, false, "#94a3b8"); gravBody(360, 255, 34, "#f59e0b", "日"); gravBody(pos.x, pos.y, 18, "#2563eb", "");
  var rPhysical = map(pos.r, 150 * (1 - e), 150 * (1 + e), rp, ra); var speedRatio = Math.sqrt((2 / rPhysical - 2 / (rp + ra)) / (2 / rp - 2 / (rp + ra)));
  gravArrow(pos.x, pos.y, pos.x + 55 * speedRatio, pos.y - 18, "#16a34a", "v");
  noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(14); text("r = " + rPhysical.toFixed(2) + " a.u.", 28, 421); text("a/a近 = " + Math.pow(rp / rPhysical, 2).toFixed(2), 300, 421);
}

function drawGravCometGraph() {
  var rp = getJsonParam(currentScene, "periapsis", 1); var ra = Math.max(rp + 0.5, getJsonParam(currentScene, "apoapsis", 6)); var e = (ra - rp) / (ra + rp); var p = getGravitationProgress(); var frame = gravGraphFrame("彗星速度与加速度", "蓝：v/v近；橙：a/a近");
  gravPlot(frame, 1, 0, 1, "#2563eb", function (x) { var r = (rp + ra) / 2 * (1 - e * Math.cos(Math.PI * 2 * x)); return Math.sqrt((2 / r - 2 / (rp + ra)) / (2 / rp - 2 / (rp + ra))); });
  gravPlot(frame, 1, 0, 1, "#f97316", function (x) { var r = (rp + ra) / 2 * (1 - e * Math.cos(Math.PI * 2 * x)); return Math.pow(rp / r, 2); });
  var rNow = (rp + ra) / 2 * (1 - e * Math.cos(Math.PI * 2 * p)); gravGraphMarker(frame, p, 1, Math.pow(rp / rNow, 2), 0, 1, "#dc2626");
}

function gravScaleReadings() {
  var m = getJsonParam(currentScene, "mass", 1); var gp = getJsonParam(currentScene, "poleGravity", 9.83); var h = getJsonParam(currentScene, "heightRatio", 0.3); var rotationDrop = 0.034; return [m * gp, m * (gp - rotationDrop), m * gp / Math.pow(1 + h, 2), m * (gp / Math.pow(1 + h, 2) - rotationDrop * (1 + h))];
}

function drawGravScaleScene() {
  var p = getGravitationProgress(); var index = Math.min(3, Math.floor(p * 4)); var labels = ["北极地面", "赤道地面", "北极上空", "赤道上空"]; var angles = [-Math.PI / 2, 0, -Math.PI / 2, 0]; var h = index >= 2 ? 48 : 0; var a = angles[index];
  gravSceneHeading("不同位置的弹簧测力计", "测力计读数是视重，赤道还要扣除自转向心项");
  gravBody(270, 260, 240, "#60a5fa", ""); var x = 270 + (120 + h) * Math.cos(a); var y = 260 + (120 + h) * Math.sin(a); gravBody(x, y, 24, "#f97316", "m");
  gravArrow(x, y, x + 52 * Math.cos(a), y + 52 * Math.sin(a), "#16a34a", "N");
  noStroke(); fill("#0f172a"); textAlign(CENTER, TOP); textSize(16); text(labels[index], 270, 408); text("读数 = " + gravScaleReadings()[index].toFixed(2) + " N", 270, 435);
}

function drawGravScaleGraph() {
  var vals = gravScaleReadings(); var p = getGravitationProgress(); var active = Math.min(3, Math.floor(p * 4)); var frame = gravGraphFrame("四个位置的测力计读数", "北极等于万有引力，赤道读数更小"); var labels = ["极地", "赤道", "极地+h", "赤道+h"]; var maxV = Math.max.apply(null, vals) * 1.08;
  for (var i = 0; i < 4; i++) { var bw = 48; var x = frame.x + 24 + i * 76; var bh = vals[i] / maxV * frame.h; noStroke(); fill(i === active ? "#dc2626" : "#2563eb"); rect(x, frame.y + frame.h - bh, bw, bh, 4); fill("#0f172a"); textAlign(CENTER, TOP); textSize(10); text(labels[i], x + bw / 2, frame.y + frame.h + 9); text(vals[i].toFixed(2), x + bw / 2, frame.y + frame.h - bh - 16); }
}

function gravUnknownThrowValues() {
  var v0 = getJsonParam(currentScene, "v0", 8); var h = getJsonParam(currentScene, "height", 20); var radius = getJsonParam(currentScene, "radius", 2) * 1e6; var g = v0 * v0 / (2 * h); var duration = 4 * h / v0; var G = 6.67e-11; return { v0: v0, h: h, radius: radius, g: g, duration: duration, mass: g * radius * radius / G };
}

function drawGravUnknownThrowScene() {
  var v = gravUnknownThrowValues(); var p = getGravitationProgress(); var t = p * v.duration; var yValue = Math.max(0, v.v0 * t - 0.5 * v.g * t * t); var y = map(yValue, 0, v.h, 385, 150);
  gravSceneHeading("未知天体上的竖直上抛实验", "由 v₀ 与最大高度 h 反推 g，再由半径 R 求质量 M");
  noStroke(); fill("#94a3b8"); circle(270, 700, 650); stroke("#cbd5e1"); drawingContext.setLineDash([4, 4]); line(270, 385, 270, 150); drawingContext.setLineDash([]); gravBody(270, y, 22, "#2563eb", "m");
  noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(14); text("t = " + t.toFixed(2) + " s", 28, 410); text("y = " + yValue.toFixed(2) + " m", 28, 434); text("g = " + v.g.toFixed(2) + " m/s²", 310, 410); text("M = " + v.mass.toExponential(2) + " kg", 310, 434);
}

function drawGravUnknownThrowGraph() {
  var v = gravUnknownThrowValues(); var p = getGravitationProgress(); var frame = gravGraphFrame("上抛高度—时间", "峰值 h 决定表面重力 g=v₀²/(2h)");
  gravPlot(frame, v.duration, 0, v.h, "#2563eb", function (t) { return Math.max(0, v.v0 * t - 0.5 * v.g * t * t); });
  var t = p * v.duration; gravGraphMarker(frame, t, v.duration, Math.max(0, v.v0 * t - 0.5 * v.g * t * t), 0, v.h, "#dc2626");
}

function gravArcValues() {
  var s = getJsonParam(currentScene, "arcLength", 3) * 1e6; var theta = getJsonParam(currentScene, "angle", 0.6); var t = getJsonParam(currentScene, "time", 2) * 3600; var G = 6.67e-11; var r = s / theta; return { s: s, theta: theta, t: t, r: r, period: 2 * Math.PI * t / theta, mass: Math.pow(s, 3) / (G * t * t * theta) };
}

function drawGravArcAngleScene() {
  var v = gravArcValues(); var p = getGravitationProgress(); var angle = -Math.PI / 2 + v.theta * p; var cx = 270; var cy = 270; var r = 145;
  gravSceneHeading("弧长 s 与扫角 θ", "s=rθ；同一段时间还可得到周期和中心天体质量");
  gravBody(cx, cy, 82, "#94a3b8", "月"); noFill(); stroke("#cbd5e1"); circle(cx, cy, 2 * r); stroke("#2563eb"); strokeWeight(5); arc(cx, cy, 2 * r, 2 * r, -Math.PI / 2, angle);
  var x = cx + r * Math.cos(angle); var y = cy + r * Math.sin(angle); stroke("#64748b"); line(cx, cy, x, y); gravBody(x, y, 20, "#f97316", "");
  noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(14); text("当前扫角 " + (v.theta * p).toFixed(2) + " rad", 28, 420); text("当前弧长 " + (v.s * p / 1e6).toFixed(2) + "×10⁶m", 292, 420);
}

function drawGravArcAngleGraph() {
  var v = gravArcValues(); var p = getGravitationProgress(); var frame = gravGraphFrame("弧长—扫角", "直线斜率就是轨道半径 r=s/θ");
  gravPlot(frame, v.theta, 0, v.s / 1e6, "#2563eb", function (x) { return v.r * x / 1e6; });
  gravGraphMarker(frame, v.theta * p, v.theta, v.s * p / 1e6, 0, v.s / 1e6, "#dc2626");
  noStroke(); fill("#334155"); textAlign(LEFT, TOP); textSize(12); text("T = " + (v.period / 3600).toFixed(1) + " h", frame.x + 8, frame.y + 8); text("M = " + v.mass.toExponential(2) + " kg", frame.x + 8, frame.y + 28);
}

function gravPhotogateValues() {
  var L = getJsonParam(currentScene, "ropeLength", 1); var d = getJsonParam(currentScene, "stripWidth", 2) / 100; var m = getJsonParam(currentScene, "mass", 0.2); return { L: L, d: d, m: m, slope: m * d * d / L, gE: 9.78, gP: 9.83 };
}

function drawGravPhotogateScene() {
  var v = gravPhotogateValues(); var p = getGravitationProgress(); var angle = -Math.PI / 2 + (p - 0.5) * 0.72; var cx = 270; var cy = 280; var r = 125; var x = cx + r * Math.cos(angle); var y = cy + r * Math.sin(angle);
  gravSceneHeading("最高点光电门与拉力传感器", "遮光时间 t 给出 v=d/t，最高点满足 F+mg=mv²/L");
  noFill(); stroke("#94a3b8"); circle(cx, cy, 2 * r); stroke("#64748b"); line(cx, cy, x, y); gravBody(x, y, 24, "#f97316", "m");
  noStroke(); fill("#0f172a"); rect(212, 116, 116, 12, 3); fill("#dc2626"); rect(250, 107, 40, 30, 2); fill("#0f172a"); textAlign(CENTER, TOP); textSize(13); text("光电门", 270, 90); text("力传感器", cx, cy + 14);
}

function drawGravPhotogateGraph() {
  var v = gravPhotogateValues(); var p = getGravitationProgress(); var xMax = 42000; var xNow = xMax * (0.18 + 0.82 * p); var yMax = Math.max(1, v.slope * xMax - v.m * v.gE); var frame = gravGraphFrame("F—t⁻² 图像", "两地斜率相同，南极横截距更大");
  gravPlot(frame, xMax, -v.m * v.gP, yMax, "#2563eb", function (x) { return v.slope * x - v.m * v.gE; });
  gravPlot(frame, xMax, -v.m * v.gP, yMax, "#f97316", function (x) { return v.slope * x - v.m * v.gP; });
  gravGraphMarker(frame, xNow, xMax, v.slope * xNow - v.m * v.gP, -v.m * v.gP, yMax, "#dc2626");
  noStroke(); fill("#2563eb"); textAlign(LEFT, TOP); textSize(12); text("赤道", frame.x + 8, frame.y + 8); fill("#f97316"); text("南极", frame.x + 50, frame.y + 8);
}

function drawGravAstronomyPhotoScene() {
  var period = getJsonParam(currentScene, "period", 48); var p = getGravitationProgress(); var time = period * p; var angle = Math.PI / 12 + Math.PI * 2 * p;
  gravSceneHeading("每隔 2h 拍摄的卫星照片", "照片上的有向距离 L 是圆周运动在水平方向的投影");
  gravBody(242, 225, 86, "#60a5fa", "行"); noFill(); stroke("#94a3b8"); circle(242, 225, 280); gravBody(242 + 140 * Math.sin(angle), 225 - 140 * Math.cos(angle), 18, "#f97316", "");
  for (var i = 0; i < 6; i++) { var y = 340 + i * 21; stroke("#cbd5e1"); line(80, y, 500, y); gravBody(290, y, 14, "#94a3b8", ""); var ti = Math.min(time, i * 2); var ai = Math.PI / 12 + Math.PI * 2 * ti / period; gravBody(290 + 14 * Math.sin(ai), y, 6, "#f97316", ""); }
  noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(14); text("当前时刻 " + time.toFixed(1) + " h", 28, 470);
}

function drawGravAstronomyPhotoGraph() {
  var period = getJsonParam(currentScene, "period", 48); var ratio = getJsonParam(currentScene, "orbitRatio", 10); var p = getGravitationProgress(); var time = period * p; var frame = gravGraphFrame("照片测得的 L—t", "L=10sin(15°+360°t/T)，圆点为每2h数据");
  gravPlot(frame, period, -ratio, ratio, "#2563eb", function (t) { return ratio * Math.sin(Math.PI / 12 + Math.PI * 2 * t / period); });
  for (var i = 0; i <= period / 2; i += 2) { var val = ratio * Math.sin(Math.PI / 12 + Math.PI * 2 * i / period); noStroke(); fill("#f97316"); circle(map(i, 0, period, frame.x, frame.x + frame.w), map(val, -ratio, ratio, frame.y + frame.h, frame.y), 7); }
  gravGraphMarker(frame, time, period, ratio * Math.sin(Math.PI / 12 + Math.PI * 2 * time / period), -ratio, ratio, "#dc2626");
}

function gravForceAtTime(t, period, e, minForce) {
  var M = Math.PI * 2 * ((t % period) / period); var r = 1 - e * Math.cos(M); return minForce * Math.pow((1 + e) / r, 2);
}

function drawGravForceOrbitScene() {
  var t1 = getJsonParam(currentScene, "t1", 4); var p = getGravitationProgress(); var time = 3 * t1 * p; var TQ = 2 * Math.sqrt(2) * t1; var posP = gravEllipsePoint(280, 250, 105, 1 / 3, Math.PI * 2 * time / t1, false); var posQ = gravEllipsePoint(280, 250, 175, 0.5, Math.PI * 2 * time / TQ, false);
  gravSceneHeading("卫星 P、Q 的椭圆轨道", "轨道越接近近点，引力越大；两个周期不同");
  gravDrawEllipse(280, 250, 105, 1 / 3, false, "#2563eb"); gravDrawEllipse(280, 250, 175, 0.5, false, "#f97316"); gravBody(280, 250, 36, "#f59e0b", "星"); gravBody(posP.x, posP.y, 21, "#2563eb", "P"); gravBody(posQ.x, posQ.y, 21, "#f97316", "Q");
  noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(14); text("t = " + time.toFixed(2) + " h", 28, 425); text("TP:TQ = 1:2√2", 300, 425);
}

function drawGravForceOrbitGraph() {
  var t1 = getJsonParam(currentScene, "t1", 4); var base = getJsonParam(currentScene, "baseForce", 1); var TQ = 2 * Math.sqrt(2) * t1; var maxTime = 3 * t1; var time = maxTime * getGravitationProgress(); var frame = gravGraphFrame("P、Q 所受引力—时间", "P：2F～8F；Q：F～9F");
  gravPlot(frame, maxTime, 0, 9 * base, "#2563eb", function (t) { return gravForceAtTime(t, t1, 1 / 3, 2 * base); });
  gravPlot(frame, maxTime, 0, 9 * base, "#f97316", function (t) { return gravForceAtTime(t, TQ, 0.5, base); });
  gravGraphMarker(frame, time, maxTime, gravForceAtTime(time, t1, 1 / 3, 2 * base), 0, 9 * base, "#2563eb");
  gravGraphMarker(frame, time, maxTime, gravForceAtTime(time, TQ, 0.5, base), 0, 9 * base, "#f97316");
}
