// Basic projectile-motion scenes.

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
