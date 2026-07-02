function bulletPhiRad() {
  return bulletPhi * Math.PI / 180;
}

function bulletRotateAngle() {
  return Math.PI - bulletPhiRad();
}

function bulletTransitTime() {
  return bulletRotateAngle() / Math.max(0.1, bulletOmega);
}

function bulletSpeed() {
  return bulletD / bulletTransitTime();
}

function toggleBulletPlay() {
  bulletPlaying = !bulletPlaying;
  updateLabels();
}

function resetBulletTime() {
  bulletT = 0;
  bulletPlaying = false;
  updateLabels();
}

function updateBullet(dt) {
  if (bulletPlaying) {
    bulletT += dt;
    if (bulletT >= bulletTransitTime()) {
      bulletT = bulletTransitTime();
      bulletPlaying = false;
    }
    updateLabels();
  }
}

function drawBulletScene() {
  var cx = 280;
  var cy = 245;
  var r = Math.min(150, bulletD * 0.82);
  var tMax = bulletTransitTime();
  var tNow = Math.min(bulletT, tMax);
  var progress = tNow / Math.max(0.001, tMax);
  var bulletX = cx - r - 85 + (2 * r + 170) * progress;
  var bulletY = cy;
  var rotateNow = bulletOmega * tNow;
  var aAng = Math.PI + rotateNow;
  var bAng = bulletPhiRad() + rotateNow;
  var aX = cx + r * Math.cos(aAng);
  var aY = cy + r * Math.sin(aAng);
  var bX = cx + r * Math.cos(bAng);
  var bY = cy + r * Math.sin(bAng);
  var i;

  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);

  stroke("#cbd5e1");
  strokeWeight(1);
  for (i = 0; i < 12; i++) {
    var spoke = rotateNow + i * Math.PI / 6;
    line(cx, cy, cx + r * Math.cos(spoke), cy + r * Math.sin(spoke));
  }

  stroke("#94a3b8");
  strokeWeight(2);
  drawingContext.setLineDash([4, 4]);
  line(cx - r - 96, cy, cx + r + 96, cy);
  drawingContext.setLineDash([]);

  stroke("#2563eb");
  strokeWeight(4);
  line(cx - r, cy, cx + r, cy);
  drawArrow(cx - r - 70, cy, cx - r - 18, cy, "#2563eb");

  noStroke();
  fill("#111827");
  circle(cx, cy, 7);
  fill("#2563eb");
  circle(aX, aY, 11);
  fill("#dc2626");
  circle(bX, bY, 11);
  fill("#f97316");
  circle(bulletX, bulletY, 20);
  fill("#ffedd5");
  circle(bulletX - 5, bulletY - 5, 6);

  noStroke();
  fill("#5b6472");
  textAlign(LEFT, TOP);
  textSize(12);
  text("O", cx + 10, cy - 8);
  text("a", aX + 10, aY - 14);
  text("b", bX + 10, bY - 14);
  text("圆筒转角 Δθ = π - φ", 88, 64);
  text("子弹路程 = d", 88, 86);

  stroke("#16a34a");
  strokeWeight(2);
  noFill();
  arc(cx, cy, 64, 64, bulletPhiRad(), Math.PI);
  drawArrow(cx + 32 * Math.cos((bulletPhiRad() + Math.PI) / 2), cy + 32 * Math.sin((bulletPhiRad() + Math.PI) / 2), cx + 32 * Math.cos(Math.PI - 0.15), cy + 32 * Math.sin(Math.PI - 0.15), "#16a34a");
}

function drawBulletGraph() {
  var gx = graphLeft + 50;
  var gy = 62;
  var gw = graphRight - graphLeft - 80;
  var gh = 360;
  var tMax = bulletTransitTime();
  var angleMax = Math.PI;
  var i;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(18);
  text("转角-时间图像", graphLeft + 24, 20);
  fill("#5b6472");
  textSize(12);
  text("圆筒转到 π-φ 时，子弹刚穿过直径 d", graphLeft + 24, 44);

  drawBasicGrid(gx, gy, gw, gh);
  drawGraphTicks(gx, gy, gw, gh, tMax, angleMax, "s");

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 120; i++) {
    var t = i * tMax / 120;
    vertex(map(t, 0, tMax, gx, gx + gw), map(bulletOmega * t, 0, angleMax, gy + gh, gy));
  }
  endShape();

  var targetY = map(bulletRotateAngle(), 0, angleMax, gy + gh, gy);
  stroke("#16a34a");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(gx, targetY, gx + gw, targetY);
  drawingContext.setLineDash([]);

  drawTimeMarker(gx, gy, gw, gh, Math.min(bulletT, tMax), tMax);

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(12);
  text("t = (π-φ)/ω = " + tMax.toFixed(2) + "s", gx + 14, gy + 12);
  text("v = ωd/(π-φ) = " + bulletSpeed().toFixed(1), gx + 14, gy + 34);
}

function bikeWheelOmega() {
  return bikeSpeed / Math.max(0.01, bikeWheelD / 2);
}

function bikePedalOmegaFor(chainTeeth, flyTeeth) {
  return bikeWheelOmega() * flyTeeth / chainTeeth;
}

function bikePedalOmega() {
  return bikePedalOmegaFor(bikeChainTeeth, bikeFlyTeeth);
}

function bikeMinOmega() {
  return bikePedalOmegaFor(48, 15);
}

function toggleBikeGearPlay() {
  bikeGearPlaying = !bikeGearPlaying;
  updateLabels();
}

function resetBikeGearTime() {
  bikeGearT = 0;
  bikeGearPlaying = false;
  updateLabels();
}

function updateBikeGear(dt) {
  if (bikeGearPlaying) {
    bikeGearT += dt;
    if (bikeGearT >= 6) {
      bikeGearT = 6;
      bikeGearPlaying = false;
    }
    updateLabels();
  }
}

function drawBikeGearWheel(cx, cy, r, angle, labelText, colorHex) {
  var i;
  stroke(colorHex);
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (i = 0; i < 12; i++) {
    var a = angle + i * Math.PI / 6;
    line(cx, cy, cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  noStroke();
  fill(colorHex);
  circle(cx, cy, 8);
  fill("#111827");
  textAlign(CENTER, TOP);
  textSize(12);
  text(labelText, cx, cy + r + 10);
}

function drawBikeGearScene() {
  var rearX = 392;
  var wheelY = 300;
  var frontX = 168;
  var wheelR = 98;
  var chainR = 34 + bikeChainTeeth * 0.95;
  var flyR = 16 + bikeFlyTeeth * 1.35;
  var wheelAngle = bikeWheelOmega() * bikeGearT;
  var pedalAngle = bikePedalOmega() * bikeGearT;
  var pedalLen = chainR + 28;

  stroke("#111827");
  strokeWeight(3);
  line(frontX, wheelY, rearX, wheelY);
  line(frontX, wheelY, 268, 178);
  line(268, 178, rearX, wheelY);
  line(268, 178, 238, 300);

  drawBikeGearWheel(rearX, wheelY, wheelR, wheelAngle, "后轮 d=" + bikeWheelD.toFixed(2) + "m", "#111827");

  stroke("#64748b");
  strokeWeight(9);
  noFill();
  line(frontX, wheelY - chainR, rearX, wheelY - flyR);
  line(frontX, wheelY + chainR, rearX, wheelY + flyR);

  stroke("#2563eb");
  strokeWeight(4);
  noFill();
  circle(frontX, wheelY, 2 * chainR);
  stroke("#dc2626");
  circle(rearX, wheelY, 2 * flyR);

  stroke("#94a3b8");
  strokeWeight(1);
  var i;
  for (i = 0; i < 16; i++) {
    var ca = pedalAngle + i * Math.PI / 8;
    line(frontX, wheelY, frontX + chainR * Math.cos(ca), wheelY + chainR * Math.sin(ca));
  }
  for (i = 0; i < 10; i++) {
    var fa = wheelAngle + i * Math.PI / 5;
    line(rearX, wheelY, rearX + flyR * Math.cos(fa), wheelY + flyR * Math.sin(fa));
  }

  stroke("#f97316");
  strokeWeight(5);
  line(frontX, wheelY, frontX + pedalLen * Math.cos(pedalAngle), wheelY + pedalLen * Math.sin(pedalAngle));
  line(frontX, wheelY, frontX - pedalLen * Math.cos(pedalAngle), wheelY - pedalLen * Math.sin(pedalAngle));
  noStroke();
  fill("#f97316");
  circle(frontX + pedalLen * Math.cos(pedalAngle), wheelY + pedalLen * Math.sin(pedalAngle), 12);
  circle(frontX - pedalLen * Math.cos(pedalAngle), wheelY - pedalLen * Math.sin(pedalAngle), 12);

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(13);
  text("链轮 " + bikeChainTeeth + " 齿", frontX - 62, wheelY + chainR + 16);
  text("飞轮 " + bikeFlyTeeth + " 齿", rearX - 44, wheelY + flyR + 16);
  text("ω轮 = v/(d/2) = " + bikeWheelOmega().toFixed(2) + " rad/s", 36, 52);
  text("ω踏 = ω轮 × N飞/N链 = " + bikePedalOmega().toFixed(2) + " rad/s", 36, 78);

  fill("#5b6472");
  text("要最小：选 48 齿链轮、15 齿飞轮", 36, 104);
}

function drawBikeGearGraph() {
  var gx = graphLeft + 48;
  var gy = 72;
  var gw = graphRight - graphLeft - 82;
  var gh = 330;
  var chainOptions = [48, 38, 28];
  var flyOptions = [15, 18, 21, 24, 28];
  var barCount = chainOptions.length * flyOptions.length;
  var barW = gw / barCount;
  var yMax = 14;
  var index = 0;
  var minVal = bikeMinOmega();
  var i;
  var j;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(18);
  text("踏板角速度-齿数组合", graphLeft + 24, 20);
  fill("#5b6472");
  textSize(12);
  text("柱越低，脚蹬越慢；原题求最小值", graphLeft + 24, 44);

  drawBasicGrid(gx, gy, gw, gh);
  drawGraphTicks(gx, gy, gw, gh, barCount, yMax, "组");

  for (i = 0; i < chainOptions.length; i++) {
    for (j = 0; j < flyOptions.length; j++) {
      var chain = chainOptions[i];
      var fly = flyOptions[j];
      var omega = bikePedalOmegaFor(chain, fly);
      var x = gx + index * barW + 3;
      var y = map(omega, 0, yMax, gy + gh, gy);
      var isSelected = chain === bikeChainTeeth && fly === bikeFlyTeeth;
      var isMin = chain === 48 && fly === 15;
      fill(isSelected ? "#f97316" : (isMin ? "#16a34a" : "#93c5fd"));
      rect(x, y, Math.max(4, barW - 6), gy + gh - y);
      if (isSelected || isMin) {
        fill("#111827");
        textAlign(CENTER, BOTTOM);
        textSize(10);
        text(omega.toFixed(1), x + barW / 2 - 3, y - 4);
      }
      index++;
    }
  }

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(12);
  text("当前：" + bikeChainTeeth + "/" + bikeFlyTeeth + "，ω踏 = " + bikePedalOmega().toFixed(2) + " rad/s", gx + 10, gy + 12);
  text("原题最小值：48/15，ωmin = " + minVal.toFixed(2) + " rad/s ≈ 3.8 rad/s", gx + 10, gy + 34);
}

