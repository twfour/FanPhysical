function crProblem() { return problemDataMap[currentScene] || {}; }
function crAnimation() { return crProblem().animation || {}; }
function crVariant() { return crAnimation().variant || ""; }
function crParam(key, fallback) { return getJsonParam(currentScene, key, fallback); }
function crProgress() {
  var state = getJsonAnimationState(currentScene);
  return constrain(state.time / Math.max(0.001, getJsonDuration(currentScene)), 0, 1);
}
function crText(value, x, y, colorValue, size, alignValue) {
  noStroke(); fill(colorValue || "#334155"); textSize(size || 14); textAlign(alignValue || LEFT, CENTER); text(value, x, y);
}
function crArrow(x1, y1, x2, y2, colorValue, label) {
  var angle = atan2(y2 - y1, x2 - x1);
  push(); stroke(colorValue || "#dc2626"); strokeWeight(2.4); line(x1, y1, x2, y2);
  line(x2, y2, x2 - 9 * cos(angle - PI / 6), y2 - 9 * sin(angle - PI / 6));
  line(x2, y2, x2 - 9 * cos(angle + PI / 6), y2 - 9 * sin(angle + PI / 6)); pop();
  if (label) crText(label, x2 + 7, y2 - 10, colorValue, 13, LEFT);
}
function crGround(y) {
  stroke("#64748b"); strokeWeight(2); line(28, y, 542, y); stroke("#cbd5e1"); strokeWeight(1);
  for (var x = 36; x < 542; x += 20) line(x, y, x - 8, y + 8);
}
function crBall(x, y, radius, colorValue, label) {
  fill(colorValue); stroke("#334155"); strokeWeight(1.4); circle(x, y, radius * 2);
  if (label) crText(label, x, y, "#ffffff", 12, CENTER);
}
function crBlock(x, y, w, h, colorValue, label) {
  fill(colorValue); stroke("#334155"); strokeWeight(1.5); rect(x, y, w, h, 5);
  if (label) crText(label, x + w / 2, y + h / 2, "#ffffff", 13, CENTER);
}
function crSpring(x1, x2, y) {
  noFill(); stroke("#0f766e"); strokeWeight(2.2); beginShape(); vertex(x1, y);
  for (var i = 1; i < 14; i += 1) vertex(map(i, 0, 14, x1, x2), y + (i % 2 ? -10 : 10));
  vertex(x2, y); endShape();
}
function crHeader(note) {
  crText(crProblem().title || "碰撞与反冲", 28, 28, "#0f172a", 18, LEFT);
  crText(note, 28, 54, "#475569", 13, LEFT);
}

function crDrawHeadOn(p, chain) {
  crHeader(chain ? "连续弹性碰撞：速度逐级传递" : "碰撞前后同时检查动量、能量与分离条件");
  crGround(365);
  if (chain) {
    var whiteX = 70 + 310 * p;
    crBall(whiteX, 338, 27, "#f8fafc", "2m");
    for (var i = 0; i < 4; i += 1) {
      var hit = constrain(p * 5 - i, 0, 1);
      crBall(330 + i * 48 + 55 * hit, 341, 21, "#ef4444", String(4 - i));
    }
    return;
  }
  var before = p < 0.5;
  var q = before ? p / 0.5 : (p - 0.5) / 0.5;
  var x1 = before ? 80 + 255 * q : 335 - 120 * q;
  var x2 = before ? 455 - 110 * q : 350 + 145 * q;
  crBall(x1, 338, 26, "#f97316", "A"); crBall(x2, 334, 32, "#2563eb", "B");
  crArrow(x1, 272, x1 + (before ? 62 : -42), 272, "#f97316", "vA");
  crArrow(x2, 228, x2 + (before ? -38 : 58), 228, "#2563eb", "vB");
}

function crDrawNewtonCradle(p) {
  crHeader("摆动势能先转为动能，再逐次弹性传递");
  var phase = p * 5;
  for (var i = 0; i < 4; i += 1) {
    var angle = 0;
    if (i === 0 && phase < 1) angle = -PI / 3 * (1 - phase);
    if (i === 3 && phase > 3) angle = PI / 3 * constrain(phase - 3, 0, 1);
    var ox = 205 + i * 52; var oy = 100; var bx = ox + 180 * sin(angle); var by = oy + 180 * cos(angle);
    stroke("#475569"); strokeWeight(2); line(ox, oy, bx, by); crBall(bx, by, 23 - i * 2, ["#f97316","#fb923c","#60a5fa","#2563eb"][i], "m" + (i + 1));
  }
  stroke("#334155"); strokeWeight(5); line(160, 98, 410, 98);
}

function crDrawSpringSystem(p) {
  crHeader("短时碰撞决定初态，弹簧阶段交换动量和能量"); crGround(375);
  var phase = sin(PI * constrain((p - 0.28) / 0.72, 0, 1));
  var aX = 55 + min(p / 0.28, 1) * 150;
  var bX = 220 + 55 * phase; var cX = 435 - 45 * phase;
  if (crVariant() === "bullet_spring_blocks") aX = bX - 35;
  crBlock(aX, 318, 52, 56, "#f97316", crVariant().indexOf("bullet") >= 0 ? "弹" : "A");
  crBlock(bX, 318, 62, 56, "#0ea5e9", "B"); crSpring(bX + 62, cX, 345); crBlock(cX, 318, 62, 56, "#2563eb", "C");
}

function crDrawRecoil(p) {
  var variant = crVariant();
  crHeader(variant.indexOf("rocket") >= 0 ? "向后喷出质量，箭体获得向前动量" : "系统质心不变，内部运动引起载体反冲");
  crGround(395);
  if (variant.indexOf("rocket") >= 0 || variant.indexOf("cannon") >= 0) {
    var bodyX = 180 + 130 * p;
    fill("#475569"); stroke("#0f172a"); rect(bodyX, 245, 190, 86, 10);
    fill("#64748b"); triangle(bodyX + 190, 245, bodyX + 245, 288, bodyX + 190, 331);
    for (var i = 0; i < 9; i += 1) crBall(bodyX - ((i * 31 + p * 250) % 190), 275 + (i % 3) * 14, 6, "#fb923c", "");
    crArrow(bodyX + 80, 220, bodyX + 165, 220, "#2563eb", "V"); return;
  }
  var cartX = 110 + 90 * p;
  crBlock(cartX, 315, 330, 65, "#ef4444", "载体");
  var personX = variant.indexOf("boat") >= 0 ? cartX + 280 - 260 * p : cartX + 45 + 250 * p;
  crBall(personX, 280, 18, "#2563eb", "m");
  crArrow(cartX + 165, 425, cartX + 95, 425, "#dc2626", "反冲");
}

function crDrawBullet(p) {
  crHeader("完全非弹性碰撞：动量守恒，机械能减少"); crGround(370);
  var impact = 0.42; var blockX = p < impact ? 360 : 360 + 95 * (p - impact);
  var bulletX = p < impact ? 55 + 305 * p / impact : blockX + 18;
  crBlock(blockX, 285, 125, 85, "#a16207", "M"); crBlock(bulletX, 320, 48, 18, "#475569", "m");
  crArrow(bulletX, 270, bulletX + (p < impact ? 70 : 34), 270, "#dc2626", "v");
  if (crVariant().indexOf("block_rider") >= 0 || crVariant().indexOf("plank_collision") >= 0) {
    crBlock(blockX + 35, 235, 55, 50, "#2563eb", "B");
  }
}

function crDrawPendulumCart(p) {
  crHeader("碰撞后由摆动把相对动能转化为重力势能"); crGround(405);
  var cartX = 130 + 65 * p;
  crBlock(cartX, 340, 280, 58, "#64748b", "A+B");
  var angle = 0.9 * sin(PI * p); var ox = cartX + 210; var oy = 130; var bx = ox - 170 * sin(angle); var by = oy + 170 * cos(angle);
  stroke("#334155"); strokeWeight(3); line(ox, oy, bx, by); crBall(bx, by, 23, "#0ea5e9", "C");
}

function crDrawTube(p) {
  crHeader("可动约束：水平质心位置和水平总动量控制载体运动"); crGround(420);
  var cartX = 100 + 55 * sin(TWO_PI * p);
  crBlock(cartX, 382, 350, 34, "#94a3b8", "车");
  noFill(); stroke("#475569"); strokeWeight(16); arc(cartX + 180, 285, 235, 225, PI / 8, PI - PI / 8);
  var angle = PI / 8 + (PI - PI / 4) * p;
  var bx = cartX + 180 + 117 * cos(angle); var by = 285 - 112 * sin(angle);
  crBall(bx, by, 18, "#f97316", "m");
}

function crDrawBounce(p) {
  crHeader("大球先与地面碰撞，再与小球发生二次弹性碰撞"); crGround(405);
  var yBig = 350 - 170 * abs(sin(PI * p));
  var ySmall = yBig - 52 - 110 * constrain((p - 0.52) / 0.48, 0, 1);
  crBall(285, yBig, 40, "#64748b", "M"); crBall(285, ySmall, 18, "#f97316", "m");
}

function drawCollisionRecoilScene() {
  var variant = crVariant(); var p = crProgress();
  if (/newton_cradle/.test(variant)) crDrawNewtonCradle(p);
  else if (/billiard_chain/.test(variant)) crDrawHeadOn(p, true);
  else if (/head_on_collision|collision_possible|pendulum_collision/.test(variant)) crDrawHeadOn(p, false);
  else if (/sticky_spring|bullet_spring_blocks|spring_velocity_graph/.test(variant)) crDrawSpringSystem(p);
  else if (/person_boat|cannon_recoil|rocket_ejection|skateboard_jump|cart_jump|acrobat_cart/.test(variant)) crDrawRecoil(p);
  else if (/bullet_block|block_rider|plank_collision/.test(variant)) crDrawBullet(p);
  else if (/cart_pendulum|ring_bullet_pendulum/.test(variant)) crDrawPendulumCart(p);
  else if (/mobile_u_tube|mobile_curved_tube/.test(variant)) crDrawTube(p);
  else if (/bounce_big_ball/.test(variant)) crDrawBounce(p);
  else crDrawHeadOn(p, false);
}

function crAxes(title, yLabel, yMin, yMax) {
  var f = {left:624,right:970,top:82,bottom:430,xMin:0,xMax:1,yMin:yMin,yMax:yMax};
  fill("#ffffff"); stroke("#cbd5e1"); strokeWeight(1.2); rect(f.left,f.top,f.right-f.left,f.bottom-f.top);
  crText(title,797,35,"#0f172a",17,CENTER); crText(yLabel,595,62,"#475569",12,CENTER); crText("过程进度",797,468,"#475569",12,CENTER);
  stroke("#e2e8f0"); strokeWeight(1);
  for (var i=0;i<=4;i+=1) { var x=map(i,0,4,f.left,f.right); var y=map(i,0,4,f.bottom,f.top); line(x,f.top,x,f.bottom); line(f.left,y,f.right,y); crText((i/4).toFixed(2),x,f.bottom+18,"#64748b",11,CENTER); crText(map(i,0,4,yMin,yMax).toFixed(1),f.left-10,y,"#64748b",11,RIGHT); }
  return f;
}
function crPlot(f,colorValue,valueAt) {
  push(); drawingContext.save(); drawingContext.beginPath(); drawingContext.rect(f.left,f.top,f.right-f.left,f.bottom-f.top); drawingContext.clip();
  noFill(); stroke(colorValue); strokeWeight(2.5); beginShape();
  for (var i=0;i<=140;i+=1) { var q=i/140; vertex(map(q,0,1,f.left,f.right),map(valueAt(q),f.yMin,f.yMax,f.bottom,f.top)); }
  endShape(); drawingContext.restore(); pop();
}
function drawCollisionRecoilGraph() {
  var variant=crVariant(); var mass=crParam("mass",1); var speed=crParam("speed",6); var base=mass*speed; var f;
  if (/spring|pendulum|tube/.test(variant)) {
    f=crAxes("动能与势能转化","E",0,base*speed*0.65);
    crPlot(f,"#f97316",function(q){return base*speed*0.5*(1-sin(PI*q)*sin(PI*q));});
    crPlot(f,"#2563eb",function(q){return base*speed*0.5*sin(PI*q)*sin(PI*q);});
    crText("动能",940,108,"#f97316",12,RIGHT); crText("势能",940,130,"#2563eb",12,RIGHT);
  } else {
    f=crAxes("各部分动量与系统总动量","p",-base*1.2,base*1.2);
    crPlot(f,"#0f766e",function(){return base*0.55;});
    crPlot(f,"#f97316",function(q){return base*(0.9-1.05*q);});
    crPlot(f,"#2563eb",function(q){return base*0.55-base*(0.9-1.05*q);});
    crText("系统",940,108,"#0f766e",12,RIGHT); crText("物体1",940,130,"#f97316",12,RIGHT); crText("物体2",940,152,"#2563eb",12,RIGHT);
  }
  var x=map(crProgress(),0,1,f.left,f.right); stroke("#dc2626"); strokeWeight(1); drawingContext.setLineDash([4,4]); line(x,f.top,x,f.bottom); drawingContext.setLineDash([]);
}

registerSceneRenderer("collision_recoil_model", drawCollisionRecoilScene, drawCollisionRecoilGraph);
