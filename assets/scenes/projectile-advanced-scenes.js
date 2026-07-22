// Advanced projectile-motion scenes.
function dartVY0() {
  return Math.sqrt(2 * dartG * dartH);
}

function dartFlightTime() {
  return dartVY0() / Math.max(0.1, dartG);
}

function dartVX0() {
  return dartL / Math.max(0.1, dartFlightTime());
}

function dartV0() {
  return Math.sqrt(dartVX0() * dartVX0() + dartVY0() * dartVY0());
}

function dartThetaRad() {
  return Math.atan2(dartVY0(), dartVX0());
}

function dartThetaDeg() {
  return dartThetaRad() * 180 / Math.PI;
}

function dartNewL() {
  var theta = (dartThetaDeg() + dartDeltaTheta) * Math.PI / 180;
  var vx = dartVY0() / Math.max(0.1, Math.tan(theta));
  return vx * dartFlightTime();
}

function dartXAtTime(t) {
  return dartVX0() * t;
}

function dartYAtTime(t) {
  return dartVY0() * t - 0.5 * dartG * t * t;
}

function drawDartScene() {
  var startX = 105;
  var groundY = 392;
  var scale = Math.min(1.55, 410 / Math.max(1, dartL * 1.2), 270 / Math.max(1, dartH * 1.2));
  var targetX = startX + dartL * scale;
  var targetY = groundY - dartH * scale;
  var newTargetX = startX + dartNewL() * scale;
  var tNow = Math.min(dartT, dartFlightTime());
  var dartX = startX + dartXAtTime(tNow) * scale;
  var dartY = groundY - dartYAtTime(tNow) * scale;
  var i;

  stroke("#111827");
  strokeWeight(2);
  line(44, groundY, animRight - 24, groundY);
  line(startX, groundY, startX, targetY);

  stroke("#64748b");
  strokeWeight(5);
  line(targetX, targetY - 70, targetX, targetY + 70);
  noStroke();
  fill("#fee2e2");
  circle(targetX, targetY, 74);
  fill("#ffffff");
  circle(targetX, targetY, 48);
  fill("#dc2626");
  circle(targetX, targetY, 18);

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 120; i++) {
    var t = i * dartFlightTime() / 120;
    vertex(startX + dartXAtTime(t) * scale, groundY - dartYAtTime(t) * scale);
  }
  endShape();

  stroke("#16a34a");
  strokeWeight(2);
  drawingContext.setLineDash([4, 4]);
  line(newTargetX, targetY - 62, newTargetX, targetY + 62);
  drawingContext.setLineDash([]);

  drawVectorArrow(startX, groundY, dartVX0() * 0.38, -dartVY0() * 0.38, "#f97316", "v0");
  drawVectorArrow(targetX - 70, targetY, 52, 0, "#2563eb", "命中速度");

  noStroke();
  fill("#111827");
  circle(startX, groundY, 8);
  fill("#f97316");
  circle(dartX, dartY, 14);
  triangle(dartX + 17, dartY, dartX - 8, dartY - 6, dartX - 8, dartY + 6);

  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("L", (startX + targetX) / 2, groundY + 14);
  text("H", startX + 10, (groundY + targetY) / 2 - 8);
  text("角度增大后目标水平距离 L'=" + dartNewL().toFixed(0), 42, 42);
  text(dartNewL() < dartL ? "L' < L，所以人应前移" : "L' ≥ L", 42, 66);
}

function drawDartGraph() {
  var gx = graphLeft + 50;
  var gy = 66;
  var gw = graphRight - graphLeft - 86;
  var gh = 332;
  var xMax = Math.max(dartL, dartNewL()) * 1.18;
  var yMax = dartH * 1.25;
  var i;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("飞镖轨迹与速度分解", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
  text("命中竖直靶面时，竖直分速度为 0", graphLeft + 24, 44);

  drawBasicGrid(gx, gy, gw, gh);
  drawGraphTicks(gx, gy, gw, gh, xMax, yMax, "x");

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 150; i++) {
    var t = i * dartFlightTime() / 150;
    vertex(map(dartXAtTime(t), 0, xMax, gx, gx + gw), map(dartYAtTime(t), 0, yMax, gy + gh, gy));
  }
  endShape();

  var targetGX = map(dartL, 0, xMax, gx, gx + gw);
  var targetGY = map(dartH, 0, yMax, gy + gh, gy);
  var newGX = map(dartNewL(), 0, xMax, gx, gx + gw);

  stroke("#64748b");
  strokeWeight(2);
  line(targetGX, gy, targetGX, gy + gh);
  stroke("#16a34a");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(newGX, gy, newGX, gy + gh);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#dc2626");
  circle(targetGX, targetGY, 9);
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(14);
  text("v0 = " + dartV0().toFixed(1), gx + 12, gy + 12);
  text("θ = " + dartThetaDeg().toFixed(1) + "°", gx + 12, gy + 34);
  text("vx = " + dartVX0().toFixed(1) + "，vy = " + dartVY0().toFixed(1), gx + 12, gy + 56);
  text("Δθ=" + dartDeltaTheta.toFixed(0) + "° 后 L'=" + dartNewL().toFixed(0), gx + 12, gy + 78);
}


function normalThetaRad() {
  return normalAngle * Math.PI / 180;
}

function normalExamTime() {
  return normalV0 / Math.max(0.1, normalG);
}

function normalHitTime() {
  return normalExamTime();
}

function normalSlopeHitTime() {
  return normalExamTime();
}

function normalSceneMaxTime() {
  return normalExamTime();
}

function normalX1(t) {
  return normalV0 * t;
}

function normalX2(t) {
  return 0.5 * normalV0 * t;
}

function normalDrop(t) {
  return 0.5 * normalG * t * t;
}

function normalXC() {
  var t = normalExamTime();
  return normalX1(t);
}

function normalXB() {
  var t = normalExamTime();
  return normalX2(t);
}

function normalYBC() {
  return normalDrop(normalExamTime());
}

function normalHeightMN() {
  return 1.5 * normalYBC();
}

function drawNormalScene() {
  var startX = 86;
  var startY = 86;
  var tMax = normalSceneMaxTime();
  var xB = normalXB();
  var xC = normalXC();
  var yBC = normalYBC();
  var heightMN = normalHeightMN();
  var scale = Math.min(420 / Math.max(1, xC), 330 / Math.max(1, heightMN));
  var tNow = Math.min(normalT, tMax);
  var ball1X = startX + normalX1(tNow) * scale;
  var ball1Y = startY + normalDrop(tNow) * scale;
  var ball2X = startX + normalX2(tNow) * scale;
  var ball2Y = startY + normalDrop(tNow) * scale;
  var bx = startX + xB * scale;
  var by = startY + yBC * scale;
  var cx = startX + xC * scale;
  var cy = startY + yBC * scale;
  var ox = startX + heightMN * scale;
  var oy = startY + heightMN * scale;
  var pX = startX;
  var pY = startY;
  var qX = ox + 120;
  var qY = oy - 120;
  var i;

  stroke("#111827");
  strokeWeight(3);
  line(pX, pY, ox, oy);
  line(ox, oy, qX, qY);
  line(startX - 20, oy, Math.min(animRight - 25, qX + 18), oy);

  stroke("#94a3b8");
  strokeWeight(2);
  line(cx, cy, cx - 54, cy - 54);
  drawingContext.setLineDash([4, 4]);
  line(bx, by, cx, cy);
  line(startX, startY, startX, oy);
  drawingContext.setLineDash([]);

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 120; i++) {
    var t1 = i * tMax / 120;
    vertex(startX + normalX1(t1) * scale, startY + normalDrop(t1) * scale);
  }
  endShape();

  stroke("#dc2626");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 120; i++) {
    var t2 = i * tMax / 120;
    vertex(startX + normalX2(t2) * scale, startY + normalDrop(t2) * scale);
  }
  endShape();

  noStroke();
  fill("#2563eb");
  circle(ball1X, ball1Y, 22);
  fill("#dbeafe");
  circle(ball1X - 5, ball1Y - 5, 6);
  fill("#dc2626");
  circle(ball2X, ball2Y, 20);
  fill("#fee2e2");
  circle(ball2X - 5, ball2Y - 5, 6);
  fill("#2563eb");
  circle(cx, cy, 9);
  fill("#dc2626");
  circle(bx, by, 9);

  drawVectorArrow(ball1X, ball1Y, normalV0 * 1.35, 0, "#2563eb", "v1x");
  drawVectorArrow(ball1X, ball1Y, 0, normalG * tNow * 1.35, "#2563eb", "v1y");
  drawVectorArrow(ball2X, ball2Y, normalV0 * 0.7, 0, "#dc2626", "v2x");
  drawVectorArrow(ball2X, ball2Y, 0, normalG * tNow * 1.25, "#dc2626", "v2y");

  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("A/P", startX - 20, startY - 18);
  text("O", ox + 6, oy - 4);
  text("MN", startX - 18, oy + 8);
  text("法线", cx - 62, cy - 68);
  fill("#2563eb");
  text("C：v1 垂直 QO", cx + 10, cy - 30);
  fill("#dc2626");
  text("B：v2 落 PO", bx - 88, by - 20);
  fill("#334155");
  text("B、C 同一水平面", bx + 20, by + 8);
}

function drawNormalGraph() {
  var gx = graphLeft + 50;
  var gy = 62;
  var gw = graphRight - graphLeft - 80;
  var gh = 360;
  var tMax = normalSceneMaxTime();
  var xMax = normalXC();
  var i;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("两球水平位移-时间图像", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
  text("蓝线：v1 到 C；红线：v2 到 B；两球飞行时间相同", graphLeft + 24, 44);

  drawBasicGrid(gx, gy, gw, gh);
  drawGraphTicks(gx, gy, gw, gh, tMax, xMax, "s");

  stroke("#cbd5e1");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(gx, map(normalXB(), 0, xMax, gy + gh, gy), gx + gw, map(normalXB(), 0, xMax, gy + gh, gy));
  line(gx, map(normalXC(), 0, xMax, gy + gh, gy), gx + gw, map(normalXC(), 0, xMax, gy + gh, gy));
  drawingContext.setLineDash([]);

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 120; i++) {
    var t = i * tMax / 120;
    vertex(map(t, 0, tMax, gx, gx + gw), map(normalX1(t), 0, xMax, gy + gh, gy));
  }
  endShape();

  stroke("#dc2626");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 120; i++) {
    var tRed = i * tMax / 120;
    vertex(map(tRed, 0, tMax, gx, gx + gw), map(normalX2(tRed), 0, xMax, gy + gh, gy));
  }
  endShape();

  noStroke();
  fill("#2563eb");
  circle(gx + gw, map(normalXC(), 0, xMax, gy + gh, gy), 8);
  fill("#dc2626");
  circle(gx + gw, map(normalXB(), 0, xMax, gy + gh, gy), 8);
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("C: x=gt²", gx + gw - 78, map(normalXC(), 0, xMax, gy + gh, gy) - 28);
  text("B: x=1/2gt²", gx + gw - 98, map(normalXB(), 0, xMax, gy + gh, gy) + 8);

  drawTimeMarker(gx, gy, gw, gh, Math.min(normalT, tMax), tMax);
}

function bounceFallTime() {
  return Math.sqrt(2 * bounceH / bounceG);
}

function bounceTotalTime() {
  return 3 * bounceFallTime();
}

function bounceV1() {
  return bounceD / bounceTotalTime();
}

function bounceV2() {
  return bounceD / bounceFallTime();
}

function bounceV0() {
  return bounceV1();
}

function bounceY1AtTime(t) {
  var tf = bounceFallTime();
  if (t <= tf) {
    return bounceH - 0.5 * bounceG * t * t;
  }
  var after = t - tf;
  var upV = bounceG * tf;
  return Math.max(0, upV * after - 0.5 * bounceG * after * after);
}

function bounceY2AtTime(t) {
  return Math.max(0, bounceH - 0.5 * bounceG * t * t);
}

function bounceY1AtX(x) {
  var t = x / Math.max(0.1, bounceV1());
  return bounceY1AtTime(t);
}

function bounceY2AtX(x) {
  var t = x / Math.max(0.1, bounceV2());
  return bounceY2AtTime(t);
}

function bounceBoardHeight() {
  return bounceH * 0.75;
}

function bounceYDirectAtX(x) {
  var t = x / Math.max(0.1, bounceV2());
  return Math.max(0, bounceH - 0.5 * bounceG * t * t);
}

function drawBounceScene() {
  var groundY = 430;
  var startX = 70;
  var scaleX = 450 / Math.max(1, bounceD);
  var scaleY = 330 / Math.max(1, bounceH);
  var v1 = bounceV1();
  var v2 = bounceV2();
  var tNow = Math.min(bounceT, bounceTotalTime());
  var t2Now = Math.min(tNow, bounceFallTime());
  var ball1X = startX + v1 * tNow * scaleX;
  var ball1Y = groundY - bounceY1AtTime(tNow) * scaleY;
  var ball2X = startX + v2 * t2Now * scaleX;
  var ball2Y = groundY - bounceY2AtTime(t2Now) * scaleY;
  var bounceX = startX + v1 * bounceFallTime() * scaleX;
  var wallX = startX + bounceWallX * scaleX;
  var wallH = bounceBoardHeight();
  var wallTopY = groundY - wallH * scaleY;
  var i;

  stroke("#111827");
  strokeWeight(3);
  line(45, groundY, 545, groundY);

  stroke("#16a34a");
  strokeWeight(5);
  line(wallX, groundY, wallX, wallTopY);

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 160; i++) {
    var t = i * bounceTotalTime() / 160;
    vertex(startX + v1 * t * scaleX, groundY - bounceY1AtTime(t) * scaleY);
  }
  endShape();

  stroke("#dc2626");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 100; i++) {
    var tDirect = i * bounceFallTime() / 100;
    vertex(startX + v2 * tDirect * scaleX, groundY - bounceY2AtTime(tDirect) * scaleY);
  }
  endShape();

  noStroke();
  fill("#111827");
  circle(startX, groundY - bounceH * scaleY, 7);
  circle(bounceX, groundY, 7);
  circle(startX + bounceD * scaleX, groundY, 7);
  fill("#16a34a");
  circle(wallX, wallTopY, 9);
  fill("#2563eb");
  circle(ball1X, ball1Y, 22);
  fill("#dbeafe");
  circle(ball1X - 5, ball1Y - 5, 6);
  fill("#dc2626");
  circle(ball2X, ball2Y, 20);
  fill("#ffedd5");
  circle(ball2X - 5, ball2Y - 5, 6);

  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("A", startX - 18, groundY - bounceH * scaleY - 8);
  text("C：球1反弹点", bounceX - 32, groundY + 8);
  text("D：共同落点", startX + bounceD * scaleX - 28, groundY + 8);
  text("挡板 h=3/4H", wallX + 8, wallTopY - 20);
  fill("#2563eb");
  text("球1：先反弹", startX + 18, 54);
  fill("#dc2626");
  text("球2：直接越过", startX + 18, 74);
}

function drawBounceGraph() {
  var gx = graphLeft + 50;
  var gy = 62;
  var gw = graphRight - graphLeft - 80;
  var gh = 360;
  var tMax = bounceTotalTime();
  var yMax = bounceH;
  var i;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("两球高度-时间图像", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
  text("绿线：挡板顶端 h=3/4H；蓝点/红点：两球恰好越过同一高度", graphLeft + 24, 44);

  drawBasicGrid(gx, gy, gw, gh);
  drawGraphTicks(gx, gy, gw, gh, tMax, yMax, "s");

  stroke("#dc2626");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 160; i++) {
    var td = i * bounceFallTime() / 160;
    vertex(map(td, 0, tMax, gx, gx + gw), map(bounceY2AtTime(td), 0, yMax, gy + gh, gy));
  }
  endShape();

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 160; i++) {
    var tb = i * tMax / 160;
    vertex(map(tb, 0, tMax, gx, gx + gw), map(bounceY1AtTime(tb), 0, yMax, gy + gh, gy));
  }
  endShape();

  var tWall1 = bounceWallX / Math.max(0.1, bounceV1());
  var tWall2 = bounceWallX / Math.max(0.1, bounceV2());
  var yWall1 = bounceY1AtX(bounceWallX);
  var yWall2 = bounceY2AtX(bounceWallX);
  var boardH = bounceBoardHeight();

  stroke("#16a34a");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(gx, map(boardH, 0, yMax, gy + gh, gy), gx + gw, map(boardH, 0, yMax, gy + gh, gy));
  drawingContext.setLineDash([]);

  noStroke();
  fill("#2563eb");
  circle(map(tWall1, 0, tMax, gx, gx + gw), map(yWall1, 0, yMax, gy + gh, gy), 7);
  fill("#dc2626");
  circle(map(tWall2, 0, tMax, gx, gx + gw), map(yWall2, 0, yMax, gy + gh, gy), 7);
  fill("#16a34a");
  textAlign(LEFT, TOP);
  textSize(14);
  text("挡板高 h=" + boardH.toFixed(2) + "m", gx + 14, map(boardH, 0, yMax, gy + gh, gy) - 22);

  drawTimeMarker(gx, gy, gw, gh, Math.min(bounceT, tMax), tMax);
}

function semiAlphaRad() {
  return semiAlpha * Math.PI / 180;
}

function semiPointA() {
  var theta = semiAlphaRad();
  return {
    x: -semiR * Math.sin(theta),
    y: semiR * Math.cos(theta)
  };
}

function semiPointB() {
  var beta = Math.PI / 2 - semiAlphaRad();
  return {
    x: semiR * Math.sin(beta),
    y: semiR * Math.cos(beta)
  };
}

function semiTime(point) {
  if (point.y <= 0.1) {
    return null;
  }
  return Math.sqrt(2 * point.y / semiG);
}

function semiV(point) {
  var t = semiTime(point);
  if (t === null) {
    return null;
  }
  return Math.abs(point.x) / t;
}

function drawSemiCircleScene() {
  var cx = 235;
  var cy = 185;
  var scale = Math.min(1.2, 185 / semiR);
  var rPix = semiR * scale;
  var a = semiPointA();
  var b = semiPointB();
  var ax = cx + a.x * scale;
  var ay = cy + a.y * scale;
  var bx = cx + b.x * scale;
  var by = cy + b.y * scale;
  var va = semiV(a);
  var vb = semiV(b);
  var ta = semiTime(a);
  var tb = semiTime(b);
  var i;

  stroke("#111827");
  strokeWeight(3);
  noFill();
  arc(cx, cy, 2 * rPix, 2 * rPix, 0, Math.PI);
  line(cx - rPix, cy, cx + rPix, cy);

  stroke("#cbd5e1");
  strokeWeight(1.5);
  line(cx, cy, ax, ay);
  line(cx, cy, bx, by);
  drawingContext.setLineDash([4, 4]);
  line(ax, cy, ax, ay);
  line(cx, ay, ax, ay);
  line(bx, cy, bx, by);
  line(cx, by, bx, by);
  drawingContext.setLineDash([]);

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  if (ta !== null && va !== null) {
    beginShape();
    for (i = 0; i <= 90; i++) {
      var tA = i * ta / 90;
      vertex(cx + a.x / Math.abs(a.x || 1) * va * tA * scale, cy + 0.5 * semiG * tA * tA * scale);
    }
    endShape();
  }

  stroke("#dc2626");
  strokeWeight(2.5);
  noFill();
  if (tb !== null && vb !== null) {
    beginShape();
    for (i = 0; i <= 90; i++) {
      var tB = i * tb / 90;
      vertex(cx + b.x / Math.abs(b.x || 1) * vb * tB * scale, cy + 0.5 * semiG * tB * tB * scale);
    }
    endShape();
  }

  noStroke();
  fill("#111827");
  circle(cx, cy, 7);
  fill("#2563eb");
  circle(ax, ay, 12);
  fill("#dc2626");
  circle(bx, by, 12);

  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("O", cx + 10, cy - 8);
  text("A", ax + 10, ay - 14);
  text("B", bx + 10, by - 14);
  text("xA", (cx + ax) / 2, ay + 8);
  text("yA", ax + 8, (cy + ay) / 2);
  text("xB", (cx + bx) / 2 - 16, by + 8);
  text("yB", bx - 28, (cy + by) / 2);
}

function drawSemiCircleGraph() {
  var gx = graphLeft + 50;
  var gy = 62;
  var gw = graphRight - graphLeft - 80;
  var gh = 360;
  var a = semiPointA();
  var b = semiPointB();
  var va = semiV(a);
  var vb = semiV(b);
  var validA = va !== null;
  var validB = vb !== null;
  var maxV = Math.max(validA ? va : 0, validB ? vb : 0, 1) * 1.25;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("两次初速度比较", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
  text("蓝：落 A；红：落 B", graphLeft + 24, 44);

  drawBasicGrid(gx, gy, gw, gh);

  noStroke();
  if (validA) {
    fill("#2563eb");
    rect(gx + 80, map(va, 0, maxV, gy + gh, gy), 70, gy + gh - map(va, 0, maxV, gy + gh, gy));
  }
  if (validB) {
    fill("#dc2626");
    rect(gx + 220, map(vb, 0, maxV, gy + gh, gy), 70, gy + gh - map(vb, 0, maxV, gy + gh, gy));
  }

  fill("#111827");
  textAlign(CENTER, TOP);
  textSize(14);
  text("vA", gx + 115, gy + gh + 12);
  text("vB", gx + 255, gy + gh + 12);
  textAlign(LEFT, TOP);
  text(validA && validB ? "vA/vB = " + (va / vb).toFixed(2) : "上半圆点不能由水平平抛落到", gx + 20, gy + 20);
  text("A(" + a.x.toFixed(0) + ", " + a.y.toFixed(0) + ")", gx + 20, gy + 48);
  text("B(" + b.x.toFixed(0) + ", " + b.y.toFixed(0) + ")", gx + 20, gy + 76);
}
