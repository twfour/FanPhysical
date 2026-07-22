function curveTrainingGraphBegin(title, subtitle) {
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(graphLeft, 0, graphRight - graphLeft, canvasH);
  drawingContext.clip();
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text(title, graphLeft + 24, 20);
  fill("#475569");
  textSize(13);
  text(subtitle, graphLeft + 24, 49);
  var frame = {
    x: graphLeft + 54,
    y: 88,
    w: graphRight - graphLeft - 92,
    h: 320
  };
  stroke("#cbd5e1");
  strokeWeight(1);
  noFill();
  rect(frame.x, frame.y, frame.w, frame.h);
  stroke("#e5e7eb");
  for (var i = 1; i < 4; i += 1) {
    line(frame.x, frame.y + frame.h * i / 4, frame.x + frame.w, frame.y + frame.h * i / 4);
    line(frame.x + frame.w * i / 4, frame.y, frame.x + frame.w * i / 4, frame.y + frame.h);
  }
  return frame;
}

function curveTrainingGraphEnd() {
  drawingContext.restore();
  pop();
}

function curveTrainingPlot(frame, xMin, xMax, yMin, yMax, colorHex, fn) {
  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  beginShape();
  for (var i = 0; i <= 120; i += 1) {
    var x = lerp(xMin, xMax, i / 120);
    var y = fn(x);
    if (isFinite(y)) {
      vertex(
        constrain(map(x, xMin, xMax, frame.x, frame.x + frame.w), frame.x, frame.x + frame.w),
        constrain(map(y, yMin, yMax, frame.y + frame.h, frame.y), frame.y, frame.y + frame.h)
      );
    }
  }
  endShape();
}

function curveTrainingMarker(frame, x, y, xMin, xMax, yMin, yMax, colorHex) {
  var px = constrain(map(x, xMin, xMax, frame.x, frame.x + frame.w), frame.x, frame.x + frame.w);
  var py = constrain(map(y, yMin, yMax, frame.y + frame.h, frame.y), frame.y, frame.y + frame.h);
  noStroke();
  fill(colorHex);
  circle(px, py, 9);
}

function curveTrainingGraphLabels(frame, xLabel, yLabel) {
  noStroke();
  fill("#334155");
  textSize(12);
  textAlign(CENTER, TOP);
  text(xLabel, frame.x + frame.w / 2, frame.y + frame.h + 28);
  push();
  translate(frame.x - 38, frame.y + frame.h / 2);
  rotate(-Math.PI / 2);
  textAlign(CENTER, CENTER);
  text(yLabel, 0, 0);
  pop();
}

function curveTrainingLegend(x, y, colorHex, label) {
  stroke(colorHex);
  strokeWeight(3);
  line(x, y, x + 24, y);
  noStroke();
  fill("#334155");
  textAlign(LEFT, CENTER);
  textSize(12);
  text(label, x + 31, y);
}

function curveTrainingDashedLine(x1, y1, x2, y2, colorHex) {
  stroke(colorHex);
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(x1, y1, x2, y2);
  drawingContext.setLineDash([]);
}

function curveTrainingTitle(title, subtitle) {
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text(title, 24, 20);
  fill("#475569");
  textSize(13);
  text(subtitle, 24, 49);
}
