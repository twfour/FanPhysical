var projHeight = 160;
var projV0 = 28;
var projG = 10;
var projT = 0;

var slopeAngle = 30;
var slopeV0 = 32;
var slopeG = 10;
var slopeT = 0;

var winL = 1.4;
var winD = 0.4;
var winH = 1.6;
var winTopDrop = 0.2;
var winV0 = 4;
var winG = 10;
var winT = 0;

var volleyH1 = 180;
var volleyH2 = 100;
var volleyS = 180;
var volleyV0 = 45;
var volleyT = 0;

var dartL = 180;
var dartH = 120;
var dartG = 10;
var dartDeltaTheta = 10;
var dartT = 0;

var normalAngle = 37;
var normalV0 = 28;
var normalG = 10;
var normalT = 0;

var bounceH = 4;
var bounceWallX = 6;
var bounceD = 10;
var bounceG = 10;
var bounceT = 0;

var semiR = 135;
var semiAlpha = 38;
var semiG = 10;

function projectileFlightTime() {
  return Math.sqrt(2 * projHeight / projG);
}

function projectileX(t) {
  return projV0 * t;
}

function projectileY(t) {
  return Math.max(0, projHeight - 0.5 * projG * t * t);
}

function projectileVY(t) {
  return projG * t;
}

function drawProjectileScene() {
  var groundY = 430;
  var startX = 95;
  var startY = 92;
  var tFlight = projectileFlightTime();
  var range = projectileX(tFlight);
  var sx = Math.min(3.2, 430 / Math.max(1, range));
  var sy = (groundY - startY) / projHeight;
  var tNow = Math.min(projT, tFlight);
  var ballX = startX + projectileX(tNow) * sx;
  var ballY = groundY - projectileY(tNow) * sy;
  var vy = projectileVY(tNow);
  var speed = Math.sqrt(projV0 * projV0 + vy * vy);
  var angle = Math.atan2(vy, projV0) * 180 / Math.PI;
  var i;

  stroke("#111827");
  strokeWeight(3);
  line(55, groundY, 545, groundY);

  stroke("#94a3b8");
  strokeWeight(2);
  line(startX, groundY, startX, 58);
  drawArrow(startX, groundY, startX, 62, "#64748b");

  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("y/m", startX + 10, 60);
  text("地面 y = 0", 60, groundY + 10);

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 120; i++) {
    var t = i * tFlight / 120;
    vertex(startX + projectileX(t) * sx, groundY - projectileY(t) * sy);
  }
  endShape();

  stroke("#cbd5e1");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(startX, startY, ballX, startY);
  line(ballX, startY, ballX, ballY);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#f97316");
  circle(ballX, ballY, 24);
  fill("#ffedd5");
  circle(ballX - 5, ballY - 5, 7);

  drawVectorArrow(ballX, ballY, projV0 * 2.2, 0, "#2563eb", "vx");
  drawVectorArrow(ballX, ballY, 0, vy * 2.2, "#dc2626", "vy");

}

function drawProjectileGraph() {
  var gx = graphLeft + 50;
  var gy = 62;
  var gw = graphRight - graphLeft - 80;
  var gh = 360;
  var tMax = projectileFlightTime();
  var xMax = projectileX(tMax);
  var yMax = projHeight;
  var i;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("分运动图像", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
  text("蓝线：x(t)；红线：下落高度 y落(t)", graphLeft + 24, 44);

  stroke("#cbd5e1");
  strokeWeight(1);
  noFill();
  rect(gx, gy, gw, gh);
  stroke("#e5e7eb");
  for (i = 0; i <= 4; i++) {
    line(gx, gy + i * gh / 4, gx + gw, gy + i * gh / 4);
    line(gx + i * gw / 4, gy, gx + i * gw / 4, gy + gh);
  }

  noStroke();
  fill("#334155");
  textSize(11);
  textAlign(RIGHT, CENTER);
  for (i = 0; i <= 4; i++) {
    var val = map(i, 0, 4, Math.max(xMax, yMax), 0);
    text(val.toFixed(0), gx - 8, gy + i * gh / 4);
  }
  textAlign(CENTER, TOP);
  for (i = 0; i <= 4; i++) {
    text((i * tMax / 4).toFixed(1) + "s", gx + i * gw / 4, gy + gh + 10);
  }

  drawProjectileComponentCurve(gx, gy, gw, gh, tMax, Math.max(xMax, yMax), "x");
  drawProjectileComponentCurve(gx, gy, gw, gh, tMax, Math.max(xMax, yMax), "y");

  var currentX = map(Math.min(projT, tMax), 0, tMax, gx, gx + gw);
  stroke("#111827");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(currentX, gy, currentX, gy + gh);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#2563eb");
  textAlign(LEFT, TOP);
  textSize(14);
  text("水平位移", gx + 10, gy + 10);
  fill("#dc2626");
  text("下落高度", gx + 10, gy + 28);
}

function drawProjectileComponentCurve(gx, gy, gw, gh, tMax, vMax, kind) {
  var colorHex = kind === "x" ? "#2563eb" : "#dc2626";
  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  beginShape();
  for (var i = 0; i <= 120; i++) {
    var t = i * tMax / 120;
    var value = kind === "x" ? projectileX(t) : 0.5 * projG * t * t;
    vertex(map(t, 0, tMax, gx, gx + gw), map(value, 0, vMax, gy + gh, gy));
  }
  endShape();
}

function slopeThetaRad() {
  return slopeAngle * Math.PI / 180;
}

function slopeHitTime() {
  return Math.max(0.2, 2 * slopeV0 * Math.tan(slopeThetaRad()) / slopeG);
}

function slopeCaseFactors() {
  return [0.72, 1, 1.28];
}

function slopeCaseTime(index) {
  return slopeHitTime() * slopeCaseFactors()[index];
}

function slopeCaseV0(index) {
  return slopeG * slopeCaseTime(index) / (2 * Math.tan(slopeThetaRad()));
}

function slopeCasePoint(index) {
  var t = slopeCaseTime(index);
  var v = slopeCaseV0(index);
  return {
    x: v * t,
    y: 0.5 * slopeG * t * t
  };
}

function slopeCaseX(index, t) {
  return slopeCaseV0(index) * t;
}

function slopeCaseDrop(t) {
  return 0.5 * slopeG * t * t;
}

function slopeMaxTime() {
  return slopeCaseTime(2);
}

function drawSlopeScene() {
  var startX = 86;
  var startY = 92;
  var labels = ["a", "b", "c"];
  var colors = ["#2563eb", "#f97316", "#dc2626"];
  var farPoint = slopeCasePoint(2);
  var scale = Math.min(420 / Math.max(1, farPoint.x), 330 / Math.max(1, farPoint.y));
  var tNow = Math.min(slopeT, slopeMaxTime());
  var slopeEndX = startX + farPoint.x * scale * 1.08;
  var slopeEndY = startY + farPoint.x * Math.tan(slopeThetaRad()) * scale * 1.08;
  var i;

  stroke("#111827");
  strokeWeight(3);
  line(startX - 28, startY, slopeEndX, slopeEndY);

  stroke("#cbd5e1");
  strokeWeight(1);
  for (i = 1; i <= 4; i++) {
    var guideX = startX + i * (slopeEndX - startX) / 5;
    var guideY = startY + i * (slopeEndY - startY) / 5;
    line(guideX - 12, guideY + 18, guideX + 32, guideY - 4);
  }

  for (i = 0; i < 3; i++) {
    var hitT = slopeCaseTime(i);
    var drawT = Math.min(tNow, hitT);
    var point = slopeCasePoint(i);
    var ballX = startX + slopeCaseX(i, drawT) * scale;
    var ballY = startY + slopeCaseDrop(drawT) * scale;
    var hitX = startX + point.x * scale;
    var hitY = startY + point.y * scale;
    var j;

    stroke(colors[i]);
    strokeWeight(2.5);
    noFill();
    beginShape();
    for (j = 0; j <= 90; j++) {
      var t = j * hitT / 90;
      vertex(startX + slopeCaseX(i, t) * scale, startY + slopeCaseDrop(t) * scale);
    }
    endShape();

    noStroke();
    fill(colors[i]);
    circle(hitX, hitY, 9);
    circle(ballX, ballY, 22);
    fill("#ffffff");
    textAlign(CENTER, CENTER);
    textSize(14);
    text(labels[i], hitX, hitY);
  }

  var midIndex = 1;
  var midT = Math.min(tNow, slopeCaseTime(midIndex));
  var midX = startX + slopeCaseX(midIndex, midT) * scale;
  var midY = startY + slopeCaseDrop(midT) * scale;
  drawVectorArrow(midX, midY, slopeCaseV0(midIndex) * 1.3, 0, "#2563eb", "vx");
  drawVectorArrow(midX, midY, 0, slopeG * midT * 1.3, "#dc2626", "vy");

  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("斜面", slopeEndX - 38, slopeEndY - 20);
  text("同一斜面：a、b、c 由近到远", startX + 10, startY + 22);
}

function drawSlopeGraph() {
  var gx = graphLeft + 50;
  var gy = 62;
  var gw = graphRight - graphLeft - 80;
  var gh = 360;
  var labels = ["a", "b", "c"];
  var colors = ["#2563eb", "#f97316", "#dc2626"];
  var tMax = slopeMaxTime();
  var vMax = slopeCaseV0(2);
  var dvMax = slopeG * tMax;
  var i;
  var groupW = gw / 3;
  var barW = 28;
  var baseY = gy + gh;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("三球比较图像", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
  text("时间 t、初速度 v₀、速度变化量 Δv 均由 a 到 c 增大", graphLeft + 24, 44);

  drawBasicGrid(gx, gy, gw, gh);

  for (i = 0; i < 3; i++) {
    var centerX = gx + groupW * (i + 0.5);
    var tVal = slopeCaseTime(i);
    var vVal = slopeCaseV0(i);
    var dvVal = slopeG * tVal;
    var hT = map(tVal, 0, tMax, 0, gh * 0.84);
    var hV = map(vVal, 0, vMax, 0, gh * 0.84);
    var hD = map(dvVal, 0, dvMax, 0, gh * 0.84);

    noStroke();
    fill("#2563eb");
    rect(centerX - 42, baseY - hT, barW, hT);
    fill("#f97316");
    rect(centerX - 10, baseY - hV, barW, hV);
    fill("#dc2626");
    rect(centerX + 22, baseY - hD, barW, hD);

    fill("#111827");
    textAlign(CENTER, TOP);
    textSize(15);
    text(labels[i], centerX, baseY + 12);
  }

  fill("#2563eb");
  textAlign(LEFT, TOP);
  textSize(14);
  text("蓝：t", gx + 10, gy + 10);
  fill("#f97316");
  text("橙：v₀", gx + 10, gy + 28);
  fill("#dc2626");
  text("红：Δv", gx + 10, gy + 46);

  stroke("#111827");
  strokeWeight(1);
  var markerX = map(Math.min(slopeT, tMax), 0, tMax, gx, gx + gw);
  drawingContext.setLineDash([4, 4]);
  line(markerX, gy, markerX, gy + gh);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("末速度方向：tanφ = vy/vx = 2tanθ，三球相同", gx + 72, gy + 12);
}

function windowEndTime() {
  var rawEnd = (winL + winD + 1.1) / Math.max(0.2, winV0);
  return Math.min(rawEnd, windowGroundTime());
}

function windowGroundDrop() {
  return (430 - 130) / 130;
}

function windowGroundTime() {
  return Math.sqrt(2 * windowGroundDrop() / winG);
}

function windowDropAtX(x) {
  var t = x / Math.max(0.2, winV0);
  return 0.5 * winG * t * t;
}

function windowCanPass() {
  var dropIn = windowDropAtX(winL);
  var dropOut = windowDropAtX(winL + winD);
  var bottom = winTopDrop + winH;
  return dropIn >= winTopDrop && dropIn <= bottom && dropOut >= winTopDrop && dropOut <= bottom;
}

function drawWindowScene() {
  var startX = 72;
  var startY = 130;
  var scale = 130;
  var wallX = startX + winL * scale;
  var wallW = Math.max(18, winD * scale);
  var wallTop = 70;
  var wallBottom = 430;
  var slotTop = startY + winTopDrop * scale;
  var slotBottom = startY + (winTopDrop + winH) * scale;
  var tNow = Math.min(winT, windowEndTime());
  var ballX = startX + winV0 * tNow * scale;
  var ballY = startY + 0.5 * winG * tNow * tNow * scale;
  var tMax = windowEndTime();
  var i;

  noStroke();
  fill("#e5e7eb");
  rect(wallX, wallTop, wallW, wallBottom - wallTop, 4);
  fill("#ffffff");
  rect(wallX - 1, slotTop, wallW + 2, slotBottom - slotTop);

  stroke("#111827");
  strokeWeight(3);
  line(45, wallBottom, 545, wallBottom);

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 120; i++) {
    var t = i * tMax / 120;
    vertex(startX + winV0 * t * scale, startY + 0.5 * winG * t * t * scale);
  }
  endShape();

  stroke(windowCanPass() ? "#16a34a" : "#dc2626");
  strokeWeight(3);
  noFill();
  rect(wallX, slotTop, wallW, slotBottom - slotTop);

  noStroke();
  fill("#111827");
  circle(startX, startY, 7);
  fill("#f97316");
  circle(ballX, ballY, 22);

  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("P", startX - 16, startY - 8);
  text("窗口", wallX + wallW + 8, slotTop + 8);
}

function drawWindowGraph() {
  var gx = graphLeft + 50;
  var gy = 62;
  var gw = graphRight - graphLeft - 80;
  var gh = 360;
  var xMax = winL + winD + 1.0;
  var yMax = Math.max(winTopDrop + winH + 0.6, windowDropAtX(xMax));
  var i;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("下落量-水平位置图像", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
  text("绿色区间：窗口允许范围", graphLeft + 24, 44);

  drawBasicGrid(gx, gy, gw, gh);
  drawGraphTicks(gx, gy, gw, gh, xMax, yMax, "m");

  var bandTop = map(winTopDrop, 0, yMax, gy + gh, gy);
  var bandBottom = map(winTopDrop + winH, 0, yMax, gy + gh, gy);
  noStroke();
  fill(220, 252, 231, 170);
  rect(map(winL, 0, xMax, gx, gx + gw), bandBottom, map(winL + winD, 0, xMax, gx, gx + gw) - map(winL, 0, xMax, gx, gx + gw), bandTop - bandBottom);

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 160; i++) {
    var x = i * xMax / 160;
    vertex(map(x, 0, xMax, gx, gx + gw), map(windowDropAtX(x), 0, yMax, gy + gh, gy));
  }
  endShape();
}

function volleyFlightTime() {
  return Math.sqrt(2 * volleyH1 / 10);
}

function volleyRange() {
  return volleyV0 * volleyFlightTime();
}

function volleyYAtX(x) {
  return volleyH1 - 0.5 * 10 * Math.pow(x / Math.max(0.1, volleyV0), 2);
}

function volleyYAtTime(t) {
  return volleyH1 - 0.5 * 10 * t * t;
}

function volleyExactV0() {
  return 1.5 * volleyS / Math.max(0.1, volleyFlightTime());
}

function volleyCanClearAndLand() {
  return volleyYAtX(volleyS) >= volleyH2 && volleyRange() > volleyS && volleyRange() <= 1.5 * volleyS;
}

function drawVolleyScene() {
  var groundY = 405;
  var startX = 70;
  var scaleX = 460 / Math.max(1, 1.65 * volleyS);
  var scaleY = 280 / Math.max(1, volleyH1 * 1.15);
  var netX = startX + volleyS * scaleX;
  var baseX = startX + 1.5 * volleyS * scaleX;
  var startY = groundY - volleyH1 * scaleY;
  var netTopY = groundY - volleyH2 * scaleY;
  var rangeX = startX + volleyRange() * scaleX;
  var tNow = Math.min(volleyT, volleyFlightTime());
  var ballX = startX + volleyV0 * tNow * scaleX;
  var ballY = groundY - Math.max(0, volleyYAtTime(tNow)) * scaleY;
  var i;

  stroke("#111827");
  strokeWeight(2);
  line(36, groundY, animRight - 28, groundY);
  line(startX, groundY, startX, startY);

  stroke("#64748b");
  strokeWeight(4);
  line(netX, groundY, netX, netTopY);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (i = 0; i < 7; i++) {
    var ny = netTopY + i * (groundY - netTopY) / 6;
    line(netX - 14, ny, netX + 14, ny);
  }

  stroke("#94a3b8");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(baseX, groundY - 72, baseX, groundY + 18);
  line(netX, netTopY, startX, netTopY);
  drawingContext.setLineDash([]);

  stroke(volleyCanClearAndLand() ? "#2563eb" : "#dc2626");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 130; i++) {
    var x = i * Math.max(volleyRange(), 1.55 * volleyS) / 130;
    var y = volleyYAtX(x);
    if (y < 0) {
      y = 0;
    }
    vertex(startX + x * scaleX, groundY - y * scaleY);
    if (y <= 0 && x > 0) {
      break;
    }
  }
  endShape();

  noStroke();
  fill("#111827");
  rect(startX - 18, startY, 15, groundY - startY);
  fill("#f97316");
  circle(ballX, ballY, 18);
  fill("#2563eb");
  circle(startX, startY, 10);
  fill(volleyCanClearAndLand() ? "#16a34a" : "#dc2626");
  circle(rangeX, groundY, 10);

  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("h1", startX + 8, (startY + groundY) / 2 - 8);
  text("h2", netX + 12, (netTopY + groundY) / 2 - 8);
  text("s", (startX + netX) / 2 - 6, groundY + 14);
  text("s/2", (netX + baseX) / 2 - 12, groundY + 14);
  text("落点 R=" + volleyRange().toFixed(0), Math.min(rangeX + 10, animRight - 120), groundY - 42);

  fill("#111827");
  text("v0=" + volleyV0.toFixed(0) + "，网处高度=" + volleyYAtX(volleyS).toFixed(0), 36, 42);
  text(volleyCanClearAndLand() ? "当前：过网且落在界内" : "当前：不能同时满足过网和界内", 36, 66);
}

function drawVolleyGraph() {
  var gx = graphLeft + 50;
  var gy = 66;
  var gw = graphRight - graphLeft - 86;
  var gh = 332;
  var xMax = 1.65 * volleyS;
  var yMax = Math.max(volleyH1 * 1.1, volleyH2 * 1.4, 1);
  var i;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("高度-水平位置图像", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
  text("蓝线为球的抛物线；绿线为网高，虚线为底线", graphLeft + 24, 44);

  drawBasicGrid(gx, gy, gw, gh);
  drawGraphTicks(gx, gy, gw, gh, xMax, yMax, "x");

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 150; i++) {
    var x = i * xMax / 150;
    var y = Math.max(0, volleyYAtX(x));
    vertex(map(x, 0, xMax, gx, gx + gw), map(y, 0, yMax, gy + gh, gy));
  }
  endShape();

  var netGraphX = map(volleyS, 0, xMax, gx, gx + gw);
  var baseGraphX = map(1.5 * volleyS, 0, xMax, gx, gx + gw);
  var netGraphY = map(volleyH2, 0, yMax, gy + gh, gy);
  var rangeGraphX = map(Math.min(volleyRange(), xMax), 0, xMax, gx, gx + gw);

  stroke("#16a34a");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(gx, netGraphY, gx + gw, netGraphY);
  line(baseGraphX, gy, baseGraphX, gy + gh);
  drawingContext.setLineDash([]);

  stroke("#64748b");
  strokeWeight(3);
  line(netGraphX, gy + gh, netGraphX, netGraphY);

  noStroke();
  fill("#f97316");
  circle(rangeGraphX, gy + gh, 8);
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(14);
  text("h1/h2 = " + (volleyH1 / Math.max(0.1, volleyH2)).toFixed(2) + "，原题应为 1.80", gx + 12, gy + 12);
  text("刚落底线所需 v0 = " + volleyExactV0().toFixed(1), gx + 12, gy + 34);
  text("当前落点 R = " + volleyRange().toFixed(1), gx + 12, gy + 56);
}

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

function getGravitationLunarThrowValues() {
  var v0 = Math.max(0.1, getJsonParam(currentScene, "v0", 8));
  var height = Math.max(0.1, getJsonParam(currentScene, "height", 20));
  var moonRadiusKm = Math.max(1, getJsonParam(currentScene, "moonRadius", 1737));
  var ropeLength = Math.max(0.1, getJsonParam(currentScene, "ropeLength", 5));
  var gravity = v0 * v0 / (2 * height);
  var duration = 2 * v0 / gravity;
  var peakTime = v0 / gravity;
  var radiusM = moonRadiusKm * 1000;
  var gravityConstant = 6.67e-11;
  var moonMass = gravity * radiusM * radiusM / gravityConstant;
  var density = 3 * gravity / (4 * Math.PI * gravityConstant * radiusM);
  var minCircleSpeed = Math.sqrt(gravity * ropeLength);
  return {
    v0: v0,
    height: height,
    moonRadiusKm: moonRadiusKm,
    ropeLength: ropeLength,
    gravity: gravity,
    duration: duration,
    peakTime: peakTime,
    moonMass: moonMass,
    density: density,
    minCircleSpeed: minCircleSpeed
  };
}

function getGravitationLunarThrowPosition(values, time) {
  var t = constrain(time, 0, values.duration);
  return {
    time: t,
    height: Math.max(0, values.v0 * t - 0.5 * values.gravity * t * t),
    velocity: values.v0 - values.gravity * t
  };
}

function drawGravitationLunarThrowScene() {
  var values = getGravitationLunarThrowValues();
  var state = getJsonAnimationState(currentScene);
  var motion = getGravitationLunarThrowPosition(values, state.time);
  var launchX = 218;
  var surfaceY = 388;
  var peakY = 152;
  var ballY = map(motion.height, 0, values.height, surfaceY, peakY);
  var circleX = 458;
  var circleY = 270;
  var circleR = 64;

  noStroke();
  fill("#f8fafc");
  rect(0, 0, 570, 500);

  noFill();
  stroke("#cbd5e1");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(launchX, surfaceY, launchX, peakY);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#e2e8f0");
  circle(255, 735, 700);
  fill("#cbd5e1");
  circle(154, 412, 28);
  circle(320, 430, 42);
  fill("#94a3b8");
  circle(154, 412, 12);
  circle(320, 430, 18);

  noStroke();
  fill("#2563eb");
  circle(launchX, ballY, 22);
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(12);
  text("m", launchX, ballY);

  var velocityArrow = constrain(Math.abs(motion.velocity) * 8, 18, 72);
  if (Math.abs(motion.velocity) > 0.08) {
    drawArrow(
      launchX + 18,
      ballY,
      launchX + 18,
      ballY + (motion.velocity > 0 ? -velocityArrow : velocityArrow),
      motion.velocity > 0 ? "#16a34a" : "#dc2626"
    );
  }

  noStroke();
  fill("#0f172a");
  textAlign(LEFT, TOP);
  textSize(17);
  text("月面竖直上抛", 28, 24);
  fill("#334155");
  textSize(14);
  text("g = v₀² / (2h) = " + values.gravity.toFixed(2) + " m/s²", 28, 54);
  text("t = " + motion.time.toFixed(2) + " s", 28, 80);
  text("y = " + motion.height.toFixed(2) + " m", 28, 104);
  text("v = " + motion.velocity.toFixed(2) + " m/s", 28, 128);

  noFill();
  stroke("#64748b");
  strokeWeight(2);
  circle(circleX, circleY, circleR * 2);
  line(circleX, circleY, circleX, circleY - circleR);
  noStroke();
  fill("#f97316");
  circle(circleX, circleY - circleR, 20);
  drawArrow(circleX + 12, circleY - circleR, circleX + 66, circleY - circleR, "#f97316");
  noStroke();
  fill("#0f172a");
  textAlign(CENTER, TOP);
  textSize(14);
  text("最高点临界：T = 0", circleX, circleY + circleR + 12);
  text("vmin = √(gL) = " + values.minCircleSpeed.toFixed(2) + " m/s", circleX, circleY + circleR + 35);

  fill("#475569");
  textAlign(LEFT, TOP);
  textSize(13);
  text("蓝球：上抛与回落    橙球：竖直圆周最高点临界条件", 28, 458);
}

function drawGravitationLunarThrowGraph() {
  var values = getGravitationLunarThrowValues();
  var state = getJsonAnimationState(currentScene);
  var gx = graphLeft + 54;
  var gy = 84;
  var gw = graphRight - gx - 32;
  var gh = 292;
  var i;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("月面上抛高度—时间图", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
  text("y = v₀t - 1/2 gt²；峰值为题给高度 h", graphLeft + 24, 48);

  drawBasicGrid(gx, gy, gw, gh);
  drawGraphTicks(gx, gy, gw, gh, values.duration, values.height, "s");

  noFill();
  stroke("#2563eb");
  strokeWeight(3);
  beginShape();
  for (i = 0; i <= 120; i++) {
    var t = values.duration * i / 120;
    var point = getGravitationLunarThrowPosition(values, t);
    vertex(map(t, 0, values.duration, gx, gx + gw), map(point.height, 0, values.height, gy + gh, gy));
  }
  endShape();

  var current = getGravitationLunarThrowPosition(values, state.time);
  var currentX = map(current.time, 0, values.duration, gx, gx + gw);
  var currentY = map(current.height, 0, values.height, gy + gh, gy);
  stroke("#dc2626");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(currentX, gy, currentX, gy + gh);
  drawingContext.setLineDash([]);
  noStroke();
  fill("#dc2626");
  circle(currentX, currentY, 12);

  fill("#0f172a");
  textAlign(LEFT, TOP);
  textSize(12);
  text("最高点 (" + values.peakTime.toFixed(2) + " s, " + values.height.toFixed(1) + " m)", gx + 8, gy + 8);
  text("M月 = " + values.moonMass.toExponential(2) + " kg", gx + 8, gy + gh + 38);
  text("ρ月 = " + values.density.toFixed(0) + " kg/m³", gx + 190, gy + gh + 38);
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
