// Shared chapter-level visual scaffold for 物理学难题集萃（力学） pages.

function getMechanicsChallengeState() {
  var animation = (problemDataMap[currentScene] || {}).animation || {};
  var state = getJsonAnimationState(currentScene);
  var duration = getJsonDuration(currentScene);
  return {
    variant: animation.variant || "kinematics",
    amplitude: getJsonParam(currentScene, "amplitude", 1),
    rate: getJsonParam(currentScene, "rate", 1),
    steps: Math.max(1, Math.round(getJsonParam(currentScene, "steps", 4))),
    time: Math.min(state.time, duration),
    duration: duration
  };
}

function mechanicsChallengeLabel(variant) {
  var labels = {
    kinematics: "运动学：状态—时间—轨迹",
    kinematics_problem_01: "竖直—水平阶梯路径",
    newton: "牛顿定律：受力—加速度",
    energy: "功能与动量：过程守恒",
    angular: "角动量：径向—切向分解",
    statics: "静力学：合力与合力矩为零",
    rigid: "刚体：质心平动与绕质心转动",
    oscillation: "振动与波动：相位传播"
  };
  return labels[variant] || labels.kinematics;
}

function mechanicsProblem01NormalizedTime(stepCount) {
  var sum = 0;
  for (var i = 1; i <= stepCount; i += 1) {
    sum += 1 / Math.sqrt(i);
  }
  return 1 + (4 / 3) * sum / (2 * Math.sqrt(stepCount));
}

function mechanicsProblem01Particle(model) {
  var n = model.steps;
  var total = mechanicsProblem01NormalizedTime(n);
  var remaining = (model.duration > 0 ? model.time / model.duration : 0) * total;
  var q0 = 0;
  var x0 = 0;
  for (var i = 1; i <= n; i += 1) {
    var q1 = i / n;
    var verticalTime = Math.sqrt(q1) - Math.sqrt(q0);
    if (remaining <= verticalTime) {
      var q = Math.pow(Math.sqrt(q0) + Math.max(0, remaining), 2);
      return { x: x0, y: q, segment: "竖直" };
    }
    remaining -= verticalTime;
    var horizontalTime = (4 / 3) / (2 * Math.sqrt(n * i));
    if (remaining <= horizontalTime) {
      var ratio = horizontalTime > 0 ? remaining / horizontalTime : 1;
      return { x: x0 + ratio / n, y: q1, segment: "水平" };
    }
    remaining -= horizontalTime;
    q0 = q1;
    x0 = i / n;
  }
  return { x: 1, y: 1, segment: "到达 C" };
}

function drawMechanicsProblem01Scene(model) {
  var n = model.steps;
  var particle = mechanicsProblem01Particle(model);
  var ax = 104;
  var ay = 106;
  var bx = 104;
  var by = 394;
  var cx = 488;
  var cy = 394;
  drawAnimScene(function () {
    noStroke();
    fill("#0f172a");
    textAlign(LEFT, TOP);
    textSize(19);
    text("第1题：竖直—水平阶梯路径", 24, 22);
    fill("#64748b");
    textSize(13);
    text("α = arctan(3/4)；阶梯越细，路径越贴近 AC，时间越长", 24, 52);

    stroke("#94a3b8");
    strokeWeight(2);
    line(ax, ay, bx, by);
    line(bx, by, cx, cy);
    drawingContext.setLineDash([6, 5]);
    stroke("#cbd5e1");
    line(ax, ay, cx, cy);
    drawingContext.setLineDash([]);

    stroke("#2563eb");
    strokeWeight(3);
    noFill();
    beginShape();
    vertex(ax, ay);
    for (var i = 1; i <= n; i += 1) {
      var py = ay + (by - ay) * i / n;
      var px = ax + (cx - ax) * i / n;
      vertex(ax + (cx - ax) * (i - 1) / n, py);
      vertex(px, py);
    }
    endShape();

    var ballX = ax + (cx - ax) * particle.x;
    var ballY = ay + (by - ay) * particle.y;
    noStroke();
    fill("#f97316");
    circle(ballX, ballY, 23);
    fill("#fff7ed");
    circle(ballX - 4, ballY - 4, 6);

    fill("#0f172a");
    textSize(15);
    textAlign(CENTER, CENTER);
    text("A", ax - 18, ay - 5);
    text("B", bx - 18, by + 4);
    text("C", cx + 17, cy + 4);
    textAlign(LEFT, TOP);
    fill("#334155");
    text("当前：" + n + " 级阶梯 · " + particle.segment, 24, 438);
    text("Tₙ/t₁ = " + mechanicsProblem01NormalizedTime(n).toFixed(4), 310, 438);
  });
}

function drawMechanicsProblem01Graph(model) {
  var left = graphLeft + 54;
  var right = 968;
  var top = 92;
  var bottom = 402;
  var yMin = 1.6;
  var yMax = 2.4;
  drawGraphFrame("阶梯级数与总时间", "蓝点：Tₙ/t₁；虚线：极限 7/3");
  stroke("#94a3b8");
  strokeWeight(1.5);
  line(left, bottom, right, bottom);
  line(left, bottom, left, top);
  noStroke();
  fill("#475569");
  textAlign(CENTER, TOP);
  textSize(12);
  text("1", left, bottom + 8);
  text("10", left + (right - left) * 9 / 19, bottom + 8);
  text("20", right, bottom + 8);
  text("阶梯级数 n", (left + right) / 2, bottom + 29);
  textAlign(RIGHT, CENTER);
  text("5/3", left - 8, bottom - (5 / 3 - yMin) / (yMax - yMin) * (bottom - top));
  text("7/3", left - 8, bottom - (7 / 3 - yMin) / (yMax - yMin) * (bottom - top));

  var limitY = bottom - (7 / 3 - yMin) / (yMax - yMin) * (bottom - top);
  stroke("#dc2626");
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 5]);
  line(left, limitY, right, limitY);
  drawingContext.setLineDash([]);

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (var i = 1; i <= 20; i += 1) {
    var value = mechanicsProblem01NormalizedTime(i);
    var px = left + (right - left) * (i - 1) / 19;
    var py = bottom - (value - yMin) / (yMax - yMin) * (bottom - top);
    vertex(px, py);
  }
  endShape();

  var currentValue = mechanicsProblem01NormalizedTime(model.steps);
  var currentX = left + (right - left) * (model.steps - 1) / 19;
  var currentY = bottom - (currentValue - yMin) / (yMax - yMin) * (bottom - top);
  noStroke();
  fill("#f97316");
  circle(currentX, currentY, 13);
  fill("#0f172a");
  textAlign(LEFT, TOP);
  textSize(13);
  text("n=" + model.steps + "，Tₙ/t₁=" + currentValue.toFixed(4), left + 10, top + 12);
  text("最短：n=1，Tmin/t₁=5/3", left + 10, top + 34);
  text("最长极限：n→∞，Tmax/t₁=7/3", left + 10, top + 56);
}

function mechanicsKinematicsProblemNumber(variant) {
  var match = String(variant || "").match(/^kinematics_problem_(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function drawMechanicsCurve(points, color, weight) {
  noFill();
  stroke(color || "#2563eb");
  strokeWeight(weight || 3);
  beginShape();
  points.forEach(function (point) { vertex(point[0], point[1]); });
  endShape();
}

function drawMechanicsProblem02Scene(model) {
  var tau = getJsonParam(currentScene, "tau", 1);
  var v0 = getJsonParam(currentScene, "v0", 5);
  var n = Math.max(2, Math.round(getJsonParam(currentScene, "n", 4)));
  var t = model.time;
  var xInf = v0 * tau;
  var x = xInf * (1 - Math.exp(-t / tau));
  var v = v0 * Math.exp(-t / tau);
  var tn = tau * Math.log(n);
  var xn = xInf * (1 - 1 / n);
  var trackLeft = 82;
  var trackRight = 520;
  var ballX = trackLeft + (trackRight - trackLeft) * x / xInf;
  drawAnimScene(function () {
    noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(19);
    text("第2题：与速度成正比的阻力", 24, 22);
    fill("#64748b"); textSize(13);
    text("m dv/dt = -kv　·　τ=m/k　·　x∞=v₀τ", 24, 52);
    stroke("#94a3b8"); strokeWeight(2); line(trackLeft, 292, trackRight, 292);
    for (var tick = 0; tick <= 4; tick += 1) {
      var tx = trackLeft + (trackRight - trackLeft) * tick / 4;
      line(tx, 286, tx, 300);
      noStroke(); fill("#64748b"); textAlign(CENTER, TOP); textSize(12);
      text((tick / 4).toFixed(2) + "x∞", tx, 306); stroke("#94a3b8");
    }
    var targetX = trackLeft + (trackRight - trackLeft) * xn / xInf;
    drawingContext.setLineDash([6, 5]); stroke("#dc2626"); line(targetX, 126, targetX, 292); drawingContext.setLineDash([]);
    noStroke(); fill("#dc2626"); textAlign(CENTER, BOTTOM); text("v=v₀/n", targetX, 120); text("xₙ/x∞=" + ((n-1)/n).toFixed(3), targetX, 145);
    fill("#f97316"); circle(ballX, 278, 26); fill("#fff7ed"); circle(ballX-4,274,6);
    var arrowLength = 105 * v / v0;
    drawVectorArrow(ballX, 242, arrowLength, 0, "#2563eb", "v");
    drawVectorArrow(ballX, 332, -arrowLength, 0, "#dc2626", "f=kv");
    noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(14);
    text("t = " + t.toFixed(2) + " s", 30, 390);
    text("v = " + v.toFixed(3) + " m/s", 175, 390);
    text("x = " + x.toFixed(3) + " m", 350, 390);
    fill(t >= tn ? "#16a34a" : "#64748b");
    text("tₙ=τ ln n=" + tn.toFixed(3) + " s", 30, 422);
  });
}

function drawMechanicsProblem02Graph(model) {
  var tau = getJsonParam(currentScene, "tau", 1);
  var n = Math.max(2, Math.round(getJsonParam(currentScene, "n", 4)));
  var tMax = 5 * tau;
  var t = Math.min(model.time, tMax);
  var tn = tau * Math.log(n);
  var left = graphLeft + 52, right = 970, top = 104, bottom = 402;
  drawGraphFrame("精确函数图：速度与位移", "横轴 t/τ；蓝线 v/v₀，橙线 x/x∞");
  stroke("#94a3b8"); line(left,bottom,right,bottom); line(left,bottom,left,top);
  noStroke(); fill("#64748b"); textAlign(CENTER,TOP); textSize(12);
  for (var tick = 0; tick <= 5; tick += 1) {
    var tx = left + (right-left)*tick/5; text(String(tick),tx,bottom+8);
  }
  text("t/τ",(left+right)/2,bottom+29); textAlign(RIGHT,CENTER); text("1",left-8,top); text("0",left-8,bottom);
  var velocityPoints=[], positionPoints=[];
  for (var i=0;i<=160;i+=1) {
    var s=5*i/160, decay=Math.exp(-s), px=left+(right-left)*s/5;
    velocityPoints.push([px,bottom-(bottom-top)*decay]);
    positionPoints.push([px,bottom-(bottom-top)*(1-decay)]);
  }
  drawMechanicsCurve(velocityPoints,"#2563eb",3); drawMechanicsCurve(positionPoints,"#f97316",3);
  var markerX=left+(right-left)*Math.min(5,tn/tau)/5;
  drawingContext.setLineDash([5,4]); stroke("#dc2626"); line(markerX,top,markerX,bottom); drawingContext.setLineDash([]);
  var currentX=left+(right-left)*(t/tau)/5, currentDecay=Math.exp(-t/tau);
  noStroke(); fill("#2563eb"); circle(currentX,bottom-(bottom-top)*currentDecay,12); fill("#f97316"); circle(currentX,bottom-(bottom-top)*(1-currentDecay),12);
  fill("#0f172a"); textAlign(LEFT,TOP); textSize(13); text("tₙ/τ=ln n="+Math.log(n).toFixed(3),left+12,top+10); text("xₙ/x∞="+((n-1)/n).toFixed(3),left+12,top+31);
}

function drawMechanicsProblem03Scene(model) {
  var beta=getJsonParam(currentScene,"beta",0.05), v0=getJsonParam(currentScene,"v0",5), t=model.time;
  var root=Math.sqrt(1+2*beta*v0*v0*t), v=v0/root, x=(root-1)/(beta*v0);
  var xEnd=(Math.sqrt(1+2*beta*v0*v0*model.duration)-1)/(beta*v0);
  var left=82,right=520,ballX=left+(right-left)*(xEnd>0?x/xEnd:0);
  drawAnimScene(function(){
    noStroke();fill("#0f172a");textAlign(LEFT,TOP);textSize(19);text("第3题：与速度三次方成正比的阻力",24,22);
    fill("#64748b");textSize(13);text("m dv/dt=-kv³　·　β=k/m",24,52);
    stroke("#94a3b8");strokeWeight(2);line(left,292,right,292);
    for(var i=0;i<=4;i+=1){var tx=left+(right-left)*i/4;line(tx,286,tx,300);noStroke();fill("#64748b");textAlign(CENTER,TOP);text((xEnd*i/4).toFixed(1)+" m",tx,306);stroke("#94a3b8");}
    noStroke();fill("#f97316");circle(ballX,278,26);fill("#fff7ed");circle(ballX-4,274,6);
    drawVectorArrow(ballX,240,105*v/v0,0,"#2563eb","v");
    drawVectorArrow(ballX,334,-105*Math.pow(v/v0,3),0,"#dc2626","f=kv³");
    noStroke();fill("#0f172a");textAlign(LEFT,TOP);textSize(14);text("t="+t.toFixed(2)+" s",28,390);text("v="+v.toFixed(3)+" m/s",170,390);text("x="+x.toFixed(3)+" m",350,390);
    fill("#475569");text("v/v₀="+(v/v0).toFixed(3)+"　　f/f₀="+Math.pow(v/v0,3).toFixed(3),28,422);
  });
}

function drawMechanicsProblem03Graph(model){
  var beta=getJsonParam(currentScene,"beta",0.05),v0=getJsonParam(currentScene,"v0",5),sNow=beta*v0*v0*model.time;
  var sMax=Math.max(5,beta*v0*v0*model.duration),left=graphLeft+52,right=970,top=104,bottom=402;
  drawGraphFrame("精确函数图：v(t)、x(t)、v(x)","横轴 s=βv₀²t；蓝线 v/v₀，橙线 ξ=βv₀x");
  stroke("#94a3b8");line(left,bottom,right,bottom);line(left,bottom,left,top);
  var vp=[],xp=[];for(var i=0;i<=180;i+=1){var s=sMax*i/180,root=Math.sqrt(1+2*s),px=left+(right-left)*i/180;vp.push([px,bottom-(bottom-top)/root]);xp.push([px,bottom-(bottom-top)*Math.min(1,(root-1)/(Math.sqrt(1+2*sMax)-1))]);}
  drawMechanicsCurve(vp,"#2563eb",3);drawMechanicsCurve(xp,"#f97316",3);
  var s=Math.min(sMax,sNow),root=Math.sqrt(1+2*s),cx=left+(right-left)*s/sMax;
  noStroke();fill("#2563eb");circle(cx,bottom-(bottom-top)/root,12);fill("#f97316");circle(cx,bottom-(bottom-top)*(root-1)/(Math.sqrt(1+2*sMax)-1),12);
  fill("#0f172a");textAlign(LEFT,TOP);textSize(13);text("v/v₀=1/√(1+2s)",left+12,top+10);text("ξ=√(1+2s)-1",left+12,top+31);text("消元：v/v₀=1/(1+ξ)",left+12,top+52);
  fill("#64748b");textAlign(CENTER,TOP);text("s=βv₀²t",(left+right)/2,bottom+28);
}

function mechanicsProblem04Values(model){
  var theta=radians(getJsonParam(currentScene,"theta",20)),alpha=radians(getJsonParam(currentScene,"alpha",35));
  var v0=getJsonParam(currentScene,"v0",25),g=getJsonParam(currentScene,"gravity",9.8),phi=theta+alpha;
  var flight=2*v0*Math.sin(alpha)/(g*Math.cos(theta));
  var x1=v0*Math.cos(phi)*flight,y1=x1*Math.tan(theta),range=x1/Math.cos(theta);
  return {theta:theta,alpha:alpha,phi:phi,v0:v0,g:g,flight:flight,x1:x1,y1:y1,range:range,time:flight*(model.duration>0?model.time/model.duration:0)};
}

function drawMechanicsProblem04Scene(model){
  var a=mechanicsProblem04Values(model),ox=78,oy=410,maxY=0;
  for(var j=0;j<=80;j+=1){var tt=a.flight*j/80,yy=a.v0*Math.sin(a.phi)*tt-a.g*tt*tt/2;if(yy>maxY)maxY=yy;}
  var scale=Math.min(410/Math.max(1,a.x1*1.08),285/Math.max(1,maxY*1.08));
  var px=ox+a.v0*Math.cos(a.phi)*a.time*scale,py=oy-(a.v0*Math.sin(a.phi)*a.time-a.g*a.time*a.time/2)*scale;
  drawAnimScene(function(){
    noStroke();fill("#0f172a");textAlign(LEFT,TOP);textSize(19);text("第4题：斜坡上的抛体射程",24,22);fill("#64748b");textSize(13);text("实际发射角 φ=θ+α；着点由抛物线与坡面求交",24,52);
    stroke("#94a3b8");strokeWeight(2);line(ox,oy,ox+a.x1*1.08*scale,oy-a.x1*Math.tan(a.theta)*1.08*scale);
    var trajectory=[];for(var i=0;i<=100;i+=1){var t=a.flight*i/100;trajectory.push([ox+a.v0*Math.cos(a.phi)*t*scale,oy-(a.v0*Math.sin(a.phi)*t-a.g*t*t/2)*scale]);}drawMechanicsCurve(trajectory,"#2563eb",3);
    drawingContext.setLineDash([5,4]);stroke("#cbd5e1");line(ox+a.x1*scale,oy,ox+a.x1*scale,oy-a.y1*scale);drawingContext.setLineDash([]);
    noStroke();fill("#f97316");circle(px,py,22);fill("#dc2626");circle(ox+a.x1*scale,oy-a.y1*scale,12);
    drawVectorArrow(px,py,75*Math.cos(a.phi),-75*(Math.sin(a.phi)-a.g*a.time/a.v0),"#f97316","v");
    noStroke();fill("#334155");textSize(13);textAlign(LEFT,TOP);text("θ="+degrees(a.theta).toFixed(0)+"°",118,oy-34);text("α="+degrees(a.alpha).toFixed(0)+"°",96,oy-72);
    text("t₁="+a.flight.toFixed(2)+" s",28,438);text("着点 ("+a.x1.toFixed(2)+", "+a.y1.toFixed(2)+") m",175,438);text("沿坡 s="+a.range.toFixed(2)+" m",385,438);
  });
}

function drawMechanicsProblem04Graph(model){
  var a=mechanicsProblem04Values(model),left=graphLeft+52,right=970,top=104,bottom=402;
  var alphaLimit=Math.PI/2-a.theta,maxAlpha=Math.PI/4-a.theta/2,sMax=a.v0*a.v0/(a.g*(1+Math.sin(a.theta)));
  drawGraphFrame("沿坡射程 s(α)","蓝线为精确射程；红虚线为 αmax=45°-θ/2");stroke("#94a3b8");line(left,bottom,right,bottom);line(left,bottom,left,top);
  var pts=[];for(var i=0;i<=180;i+=1){var al=alphaLimit*i/180,s=2*a.v0*a.v0*Math.cos(a.theta+al)*Math.sin(al)/(a.g*Math.pow(Math.cos(a.theta),2));pts.push([left+(right-left)*i/180,bottom-(bottom-top)*s/sMax]);}drawMechanicsCurve(pts,"#2563eb",3);
  var maxX=left+(right-left)*maxAlpha/alphaLimit;drawingContext.setLineDash([5,4]);stroke("#dc2626");line(maxX,top,maxX,bottom);drawingContext.setLineDash([]);
  var curX=left+(right-left)*a.alpha/alphaLimit,curY=bottom-(bottom-top)*a.range/sMax;noStroke();fill("#f97316");circle(curX,curY,13);fill("#dc2626");circle(maxX,top,12);
  fill("#0f172a");textAlign(LEFT,TOP);textSize(13);text("αmax="+degrees(maxAlpha).toFixed(1)+"°",left+12,top+10);text("smax="+sMax.toFixed(2)+" m",left+12,top+31);text("当前 s="+a.range.toFixed(2)+" m",left+12,top+52);
  fill("#64748b");textAlign(CENTER,TOP);text("相对坡面仰角 α",(left+right)/2,bottom+28);
}

function mechanicsProblem05Values(model){
  var a1=radians(getJsonParam(currentScene,"alpha",30)),a2=Math.PI/2-a1,v0=getJsonParam(currentScene,"v0",20),g=getJsonParam(currentScene,"gravity",9.8);
  var t1=2*v0*Math.sin(a1)/g,t2=2*v0*Math.sin(a2)/g,r=v0*v0*Math.sin(2*a1)/g,phase=model.duration>0?model.time/model.duration:0;
  return {a1:a1,a2:a2,v0:v0,g:g,t1:t1,t2:t2,r:r,time:t2*phase};
}

function drawMechanicsProblem05Scene(model){
  var a=mechanicsProblem05Values(model),ox=78,oy=410,h2=a.v0*a.v0*Math.pow(Math.sin(a.a2),2)/(2*a.g),scale=Math.min(420/Math.max(1,a.r),285/Math.max(1,h2));
  function projectile(alpha,time){var tt=Math.min(time,2*a.v0*Math.sin(alpha)/a.g);return [ox+a.v0*Math.cos(alpha)*tt*scale,oy-(a.v0*Math.sin(alpha)*tt-a.g*tt*tt/2)*scale];}
  drawAnimScene(function(){
    noStroke();fill("#0f172a");textAlign(LEFT,TOP);textSize(19);text("第5题：等射程的两条抛体轨迹",24,22);fill("#64748b");textSize(13);text("α₂=90°-α₁；两质点初速相同、落点相同",24,52);stroke("#94a3b8");line(ox,oy,ox+a.r*scale,oy);
    var low=[],high=[];for(var i=0;i<=120;i+=1){var tl=a.t1*i/120,th=a.t2*i/120;low.push(projectile(a.a1,tl));high.push(projectile(a.a2,th));}drawMechanicsCurve(low,"#16a34a",3);drawMechanicsCurve(high,"#2563eb",3);
    var p1=projectile(a.a1,a.time),p2=projectile(a.a2,a.time);noStroke();fill("#16a34a");circle(p1[0],p1[1],21);fill("#2563eb");circle(p2[0],p2[1],21);fill("#dc2626");circle(ox+a.r*scale,oy,10);
    fill("#334155");textSize(13);text("α₁="+degrees(a.a1).toFixed(0)+"°",105,oy-48);text("α₂="+degrees(a.a2).toFixed(0)+"°",105,oy-82);
    text("R="+a.r.toFixed(2)+" m",28,438);text("T₁="+a.t1.toFixed(3)+" s",175,438);text("T₂="+a.t2.toFixed(3)+" s",320,438);text("T₁T₂="+(a.t1*a.t2).toFixed(3)+" s²",430,438);
  });
}

function drawMechanicsProblem05Graph(model){
  var a=mechanicsProblem05Values(model),left=graphLeft+52,right=970,top=104,bottom=402;
  drawGraphFrame("飞行时间与时间乘积", "绿：T₁/T₀；蓝：T₂/T₀；橙：g²T₁T₂/(2v₀²)；T₀=2v₀/g");stroke("#94a3b8");line(left,bottom,right,bottom);line(left,bottom,left,top);
  var c1=[],c2=[],cp=[];for(var i=0;i<=160;i+=1){var al=(Math.PI/4)*i/160,px=left+(right-left)*i/160;c1.push([px,bottom-(bottom-top)*Math.sin(al)]);c2.push([px,bottom-(bottom-top)*Math.cos(al)]);cp.push([px,bottom-(bottom-top)*Math.sin(2*al)]);}drawMechanicsCurve(c1,"#16a34a",3);drawMechanicsCurve(c2,"#2563eb",3);drawMechanicsCurve(cp,"#f97316",2);
  var cx=left+(right-left)*a.a1/(Math.PI/4);noStroke();fill("#16a34a");circle(cx,bottom-(bottom-top)*Math.sin(a.a1),11);fill("#2563eb");circle(cx,bottom-(bottom-top)*Math.cos(a.a1),11);fill("#f97316");circle(cx,bottom-(bottom-top)*Math.sin(2*a.a1),11);
  fill("#0f172a");textAlign(LEFT,TOP);textSize(13);text("T₁T₂="+(a.t1*a.t2).toFixed(4)+" s²",left+12,top+10);text("2R/g="+(2*a.r/a.g).toFixed(4)+" s²",left+12,top+31);fill("#64748b");textAlign(CENTER,TOP);text("较小抛射角 α₁（0°—45°）",(left+right)/2,bottom+28);
}

function mechanicsProblem06Values(model){
  var d=getJsonParam(currentScene,"distance",3),h=getJsonParam(currentScene,"height",4),g=getJsonParam(currentScene,"gravity",10),rho=Math.sqrt(d*d+h*h);
  var opt=Math.atan((h+rho)/d),alpha=Math.min(radians(89),Math.max(Math.atan(h/d)+0.002,opt+radians(getJsonParam(currentScene,"angleOffset",0))));
  var vMin=Math.sqrt(g*(h+rho)),den=2*Math.pow(Math.cos(alpha),2)*(d*Math.tan(alpha)-h),v=Math.sqrt(g*d*d/den),wallTime=d/(v*Math.cos(alpha));
  return {d:d,h:h,g:g,opt:opt,alpha:alpha,vMin:vMin,v:v,wallTime:wallTime,time:wallTime*(model.duration>0?model.time/model.duration:0)};
}

function drawMechanicsProblem06Scene(model){
  var a=mechanicsProblem06Values(model),ox=78,oy=410,scale=Math.min(390/(a.d*1.12),280/(a.h*1.25)),wallX=ox+a.d*scale,wallTop=oy-a.h*scale;
  function point(alpha,v,t){return [ox+v*Math.cos(alpha)*t*scale,oy-(v*Math.sin(alpha)*t-a.g*t*t/2)*scale];}
  drawAnimScene(function(){
    noStroke();fill("#0f172a");textAlign(LEFT,TOP);textSize(19);text("第6题：恰过墙顶所需的最小初速度",24,22);fill("#64748b");textSize(13);text("当前角度始终反算至恰过 (d,h)；红虚线为最优轨迹",24,52);
    stroke("#94a3b8");line(ox,oy,520,oy);strokeWeight(8);line(wallX,oy,wallX,wallTop);
    var current=[],optimal=[];var optTime=a.d/(a.vMin*Math.cos(a.opt));for(var i=0;i<=120;i+=1){current.push(point(a.alpha,a.v,a.wallTime*i/120));optimal.push(point(a.opt,a.vMin,optTime*i/120));}
    drawingContext.setLineDash([6,5]);drawMechanicsCurve(optimal,"#dc2626",2);drawingContext.setLineDash([]);drawMechanicsCurve(current,"#2563eb",3);
    var p=point(a.alpha,a.v,a.time);noStroke();fill("#f97316");circle(p[0],p[1],22);fill("#dc2626");circle(wallX,wallTop,12);
    fill("#334155");textSize(13);text("d="+a.d.toFixed(1)+" m",(ox+wallX)/2,oy+16);text("h="+a.h.toFixed(1)+" m",wallX+12,(oy+wallTop)/2);text("α="+degrees(a.alpha).toFixed(2)+"°",100,oy-58);
    text("αmin="+degrees(a.opt).toFixed(2)+"°",28,438);text("当前 v₀="+a.v.toFixed(3)+" m/s",190,438);text("vmin="+a.vMin.toFixed(3)+" m/s",390,438);
  });
}

function drawMechanicsProblem06Graph(model){
  var a=mechanicsProblem06Values(model),left=graphLeft+52,right=970,top=104,bottom=402,start=Math.atan(a.h/a.d)+0.015,end=radians(89),cap=a.vMin*3;
  drawGraphFrame("恰过墙顶所需的 v₀(α)","蓝线由墙顶约束反算；红点为全局最小值");stroke("#94a3b8");line(left,bottom,right,bottom);line(left,bottom,left,top);
  var pts=[];for(var i=0;i<=180;i+=1){var al=start+(end-start)*i/180,den=2*Math.pow(Math.cos(al),2)*(a.d*Math.tan(al)-a.h),v=Math.sqrt(a.g*a.d*a.d/den);pts.push([left+(right-left)*i/180,bottom-(bottom-top)*Math.min(v,cap)/cap]);}drawMechanicsCurve(pts,"#2563eb",3);
  var ox=left+(right-left)*(a.opt-start)/(end-start),oy=bottom-(bottom-top)*a.vMin/cap,cx=left+(right-left)*(a.alpha-start)/(end-start),cy=bottom-(bottom-top)*Math.min(a.v,cap)/cap;
  drawingContext.setLineDash([5,4]);stroke("#dc2626");line(ox,top,ox,bottom);drawingContext.setLineDash([]);noStroke();fill("#dc2626");circle(ox,oy,13);fill("#f97316");circle(cx,cy,13);
  fill("#0f172a");textAlign(LEFT,TOP);textSize(13);text("αmin="+degrees(a.opt).toFixed(2)+"°",left+12,top+10);text("vmin="+a.vMin.toFixed(3)+" m/s",left+12,top+31);text("当前 v₀="+a.v.toFixed(3)+" m/s",left+12,top+52);fill("#64748b");textAlign(CENTER,TOP);text("仰角 α",(left+right)/2,bottom+28);
}

function mechanicsProblem07Values(model){
  var h=getJsonParam(currentScene,"height",5),r=getJsonParam(currentScene,"range",12),g=getJsonParam(currentScene,"gravity",9.8),tau=Math.sqrt(2*h/g),phase=model.duration>0?model.time/model.duration:0;
  return {h:h,r:r,g:g,tau:tau,v1:r/tau,v2:r/(3*tau),time:3*tau*phase};
}

function drawMechanicsProblem07Scene(model){
  var a=mechanicsProblem07Values(model),ox=78,oy=410,scale=Math.min(420/a.r,270/a.h),rodX=ox+a.r*scale/2,rodTop=oy-0.75*a.h*scale;
  function ball1(t){var tt=Math.min(t,a.tau);return [ox+a.v1*tt*scale,oy-(a.h-a.g*tt*tt/2)*scale];}
  function ball2(t){if(t<=a.tau)return [ox+a.v2*t*scale,oy-(a.h-a.g*t*t/2)*scale];var s=Math.min(2*a.tau,t-a.tau);return [ox+(a.r/3+a.v2*s)*scale,oy-(a.g*a.tau*s-a.g*s*s/2)*scale];}
  drawAnimScene(function(){
    noStroke();fill("#0f172a");textAlign(LEFT,TOP);textSize(19);text("第7题：水平抛射、弹性反弹与越杆",24,22);fill("#64748b");textSize(13);text("球2在 t=τ、x=R/3 处完全弹性反弹",24,52);stroke("#94a3b8");line(ox,oy,ox+a.r*scale,oy);strokeWeight(5);line(rodX,oy,rodX,rodTop);
    var c1=[],c2=[];for(var i=0;i<=120;i+=1){c1.push(ball1(a.tau*i/120));c2.push(ball2(3*a.tau*i/120));}drawMechanicsCurve(c1,"#2563eb",3);drawMechanicsCurve(c2,"#16a34a",3);
    drawingContext.setLineDash([5,4]);stroke("#cbd5e1");line(ox+a.r*scale/3,oy,ox+a.r*scale/3,oy-a.h*scale);line(ox+2*a.r*scale/3,oy,ox+2*a.r*scale/3,oy-a.h*scale);drawingContext.setLineDash([]);
    var p1=ball1(a.time),p2=ball2(a.time);noStroke();fill("#2563eb");circle(p1[0],p1[1],21);fill("#16a34a");circle(p2[0],p2[1],21);fill("#dc2626");circle(rodX,rodTop,11);
    fill("#334155");textSize(13);text("R/3",ox+a.r*scale/3-12,oy+12);text("R/2",rodX-12,oy+12);text("2R/3",ox+2*a.r*scale/3-18,oy+12);text("h=3H/4",rodX+8,rodTop-5);
    text("t/τ="+(a.time/a.tau).toFixed(2),28,438);text("v₁="+a.v1.toFixed(2)+" m/s",150,438);text("v₂="+a.v2.toFixed(2)+" m/s",315,438);text("v₁/v₂=3",470,438);
  });
}

function drawMechanicsProblem07Graph(model){
  var a=mechanicsProblem07Values(model),left=graphLeft+52,right=970,top=104,bottom=402;
  drawGraphFrame("两球的高度—水平位置关系","蓝：y₁/H=1-X²；绿：球2分段曲线；红点为杆顶");stroke("#94a3b8");line(left,bottom,right,bottom);line(left,bottom,left,top);
  var c1=[],c2=[];for(var i=0;i<=180;i+=1){var x=i/180,y1=1-x*x,y2=x<=1/3?1-9*x*x:2*(3*x-1)-Math.pow(3*x-1,2);c1.push([left+(right-left)*x,bottom-(bottom-top)*Math.max(0,y1)]);c2.push([left+(right-left)*x,bottom-(bottom-top)*Math.max(0,y2)]);}drawMechanicsCurve(c1,"#2563eb",3);drawMechanicsCurve(c2,"#16a34a",3);
  var rx=left+(right-left)/2,ry=bottom-(bottom-top)*0.75;drawingContext.setLineDash([5,4]);stroke("#dc2626");line(rx,ry,rx,bottom);line(left,ry,rx,ry);drawingContext.setLineDash([]);noStroke();fill("#dc2626");circle(rx,ry,13);
  fill("#0f172a");textAlign(LEFT,TOP);textSize(13);text("交点：X=1/2",left+12,top+10);text("y/H=3/4",left+12,top+31);text("另一交点 X=1 是共同落点",left+12,top+52);fill("#64748b");textAlign(CENTER,TOP);text("X=x/R",(left+right)/2,bottom+28);
}

function mechanicsProblem08Values(model){
  var l=getJsonParam(currentScene,"distance",10),vf=getJsonParam(currentScene,"targetSpeed",3),v=getJsonParam(currentScene,"missileSpeed",8),mu=vf/v,hit=l/(v*(1-mu*mu)),phase=model.duration>0?model.time/model.duration:0;
  return {l:l,vf:vf,v:v,mu:mu,hit:hit,time:hit*phase};
}

function mechanicsProblem08TimeForQ(a,q){return a.l/(2*a.v)*((1-Math.pow(q,1-a.mu))/(1-a.mu)+(1-Math.pow(q,1+a.mu))/(1+a.mu));}

function mechanicsProblem08State(a,time){
  if(time>=a.hit)return {q:0,x:a.l,y:a.vf*a.hit,targetY:a.vf*a.hit,distance:0};
  var lo=0,hi=1;for(var i=0;i<45;i+=1){var mid=(lo+hi)/2;if(mechanicsProblem08TimeForQ(a,mid)>time)lo=mid;else hi=mid;}
  var q=(lo+hi)/2,z=a.l*(Math.pow(q,1-a.mu)-Math.pow(q,1+a.mu))/2,targetY=a.vf*time;
  return {q:q,x:a.l*(1-q),y:targetY-z,targetY:targetY,distance:a.l*(Math.pow(q,1-a.mu)+Math.pow(q,1+a.mu))/2};
}

function drawMechanicsProblem08Scene(model){
  var a=mechanicsProblem08Values(model),s=mechanicsProblem08State(a,a.time),hitY=a.vf*a.hit,ox=74,oy=410,scale=Math.min(390/a.l,285/Math.max(1,hitY));
  drawAnimScene(function(){
    noStroke();fill("#0f172a");textAlign(LEFT,TOP);textSize(19);text("第8题：匀速目标的纯追踪曲线",24,22);fill("#64748b");textSize(13);text("导弹速率恒定，速度方向始终沿当前视线",24,52);
    stroke("#94a3b8");line(ox,oy,ox+a.l*scale,oy);line(ox+a.l*scale,oy,ox+a.l*scale,oy-hitY*scale);
    var trail=[];for(var i=0;i<=140;i+=1){var st=mechanicsProblem08State(a,a.hit*i/140);trail.push([ox+st.x*scale,oy-st.y*scale]);}drawMechanicsCurve(trail,"#2563eb",3);
    var mx=ox+s.x*scale,my=oy-s.y*scale,tx=ox+a.l*scale,ty=oy-s.targetY*scale;drawingContext.setLineDash([5,4]);stroke("#dc2626");line(mx,my,tx,ty);drawingContext.setLineDash([]);
    noStroke();fill("#f97316");circle(mx,my,22);fill("#16a34a");circle(tx,ty,20);fill("#dc2626");circle(ox+a.l*scale,oy-hitY*scale,10);
    drawVectorArrow(mx,my,75*(tx-mx)/Math.max(1,dist(mx,my,tx,ty)),75*(ty-my)/Math.max(1,dist(mx,my,tx,ty)),"#2563eb","v");
    fill("#334155");textSize(13);text("L="+a.l.toFixed(1)+" km",(ox+tx)/2,oy+14);text("t="+a.time.toFixed(3)+" min",28,438);text("间距="+s.distance.toFixed(3)+" km",190,438);text("t*="+a.hit.toFixed(3)+" min",390,438);
  });
}

function drawMechanicsProblem08Graph(model){
  var a=mechanicsProblem08Values(model),left=graphLeft+52,right=970,top=104,bottom=402,cx=[],cy=[],cd=[];
  drawGraphFrame("归一化状态随时间变化","蓝：x/L；绿：y/y*；红：导弹—目标间距/L");stroke("#94a3b8");line(left,bottom,right,bottom);line(left,bottom,left,top);
  var hitY=a.vf*a.hit;for(var i=0;i<=160;i+=1){var phase=i/160,st=mechanicsProblem08State(a,a.hit*phase),px=left+(right-left)*phase;cx.push([px,bottom-(bottom-top)*st.x/a.l]);cy.push([px,bottom-(bottom-top)*(hitY>0?st.y/hitY:0)]);cd.push([px,bottom-(bottom-top)*st.distance/a.l]);}drawMechanicsCurve(cx,"#2563eb",3);drawMechanicsCurve(cy,"#16a34a",3);drawMechanicsCurve(cd,"#dc2626",3);
  var phase=model.duration>0?model.time/model.duration:0,st=mechanicsProblem08State(a,a.time),px=left+(right-left)*phase;noStroke();fill("#2563eb");circle(px,bottom-(bottom-top)*st.x/a.l,10);fill("#16a34a");circle(px,bottom-(bottom-top)*(hitY>0?st.y/hitY:0),10);fill("#dc2626");circle(px,bottom-(bottom-top)*st.distance/a.l,10);
  fill("#0f172a");textAlign(LEFT,TOP);textSize(13);text("μ=vf/v="+a.mu.toFixed(3),left+12,top+10);text("t*=Lv/(v²-vf²)="+a.hit.toFixed(3)+" min",left+12,top+31);fill("#64748b");textAlign(CENTER,TOP);text("t/t*",(left+right)/2,bottom+28);
}

function mechanicsProblem09Values(model){
  var r=getJsonParam(currentScene,"radius",1),v0=getJsonParam(currentScene,"v0",3),maxAngle=getJsonParam(currentScene,"maxAngle",4),phase=model.duration>0?model.time/model.duration:0,phi=maxAngle*Math.sqrt(Math.max(0,phase));
  return {r:r,v0:v0,maxAngle:maxAngle,phi:phi,time:r*phi*phi/(2*v0),length:r*phi,accel:phi>0?v0*v0/(r*phi):Infinity};
}

function mechanicsProblem09Point(r,phi){return {x:r*(Math.cos(phi)+phi*Math.sin(phi)),y:r*(Math.sin(phi)-phi*Math.cos(phi))};}

function drawMechanicsProblem09Scene(model){
  var a=mechanicsProblem09Values(model),minX=-a.r,maxX=a.r,minY=-a.r,maxY=a.r;
  for(var k=0;k<=160;k+=1){var p0=mechanicsProblem09Point(a.r,a.maxAngle*k/160);minX=Math.min(minX,p0.x);maxX=Math.max(maxX,p0.x);minY=Math.min(minY,p0.y);maxY=Math.max(maxY,p0.y);}
  var scale=Math.min(410/Math.max(1,maxX-minX),285/Math.max(1,maxY-minY)),cx=78-minX*scale,cy=245+(maxY+minY)*scale/2;
  function screen(p){return [cx+p.x*scale,cy-p.y*scale];}
  drawAnimScene(function(){
    noStroke();fill("#0f172a");textAlign(LEFT,TOP);textSize(19);text("第9题：圆柱解线形成的渐开线",24,22);fill("#64748b");textSize(13);text("l=rφ；φ=√(2v₀t/r)；速度沿 eᵣ，加速度沿细线",24,52);
    noFill();stroke("#94a3b8");strokeWeight(2);circle(cx,cy,2*a.r*scale);
    var trail=[];for(var i=0;i<=160;i+=1){trail.push(screen(mechanicsProblem09Point(a.r,a.phi*i/160)));}drawMechanicsCurve(trail,"#2563eb",3);
    var tangent=screen({x:a.r*Math.cos(a.phi),y:a.r*Math.sin(a.phi)}),particle=screen(mechanicsProblem09Point(a.r,a.phi));stroke("#64748b");strokeWeight(2);line(tangent[0],tangent[1],particle[0],particle[1]);noStroke();fill("#0f172a");circle(tangent[0],tangent[1],9);fill("#f97316");circle(particle[0],particle[1],22);
    drawVectorArrow(particle[0],particle[1],70*Math.cos(a.phi),-70*Math.sin(a.phi),"#2563eb","v₀");if(a.phi>0.08)drawVectorArrow(particle[0],particle[1],-65*Math.sin(a.phi),-65*Math.cos(a.phi),"#dc2626","a");
    noStroke();fill("#334155");textSize(13);text("φ="+a.phi.toFixed(3)+" rad",28,418);text("t="+a.time.toFixed(3)+" s",170,418);text("l="+a.length.toFixed(3)+" m",305,418);text("a="+(isFinite(a.accel)?a.accel.toFixed(3):"∞")+" m/s²",430,418);
  });
}

function drawMechanicsProblem09Graph(model){
  var a=mechanicsProblem09Values(model),left=graphLeft+52,right=970,top=104,bottom=402,start=0.2,cap=5;
  drawGraphFrame("解线角、时间与加速度","蓝：ar/v₀²=1/φ；橙：t/tmax=(φ/φmax)²");stroke("#94a3b8");line(left,bottom,right,bottom);line(left,bottom,left,top);
  var ca=[],ct=[];for(var i=0;i<=160;i+=1){var ph=start+(a.maxAngle-start)*i/160,px=left+(right-left)*i/160;ca.push([px,bottom-(bottom-top)*Math.min(cap,1/ph)/cap]);ct.push([px,bottom-(bottom-top)*Math.pow(ph/a.maxAngle,2)]);}drawMechanicsCurve(ca,"#2563eb",3);drawMechanicsCurve(ct,"#f97316",3);
  var current=Math.max(start,a.phi),px=left+(right-left)*(current-start)/(a.maxAngle-start);noStroke();fill("#2563eb");circle(px,bottom-(bottom-top)*Math.min(cap,1/current)/cap,11);fill("#f97316");circle(px,bottom-(bottom-top)*Math.pow(current/a.maxAngle,2),11);
  fill("#0f172a");textAlign(LEFT,TOP);textSize(13);text("a=v₀²/(rφ)=v₀²/l",left+12,top+10);text("φ→0⁺ 时理想加速度发散",left+12,top+31);fill("#64748b");textAlign(CENTER,TOP);text("解线角 φ（rad）",(left+right)/2,bottom+28);
}

function mechanicsProblem10Values(model){
  var v=getJsonParam(currentScene,"relativeSpeed",1.5),omega=getJsonParam(currentScene,"omega",0.8),maxTime=getJsonParam(currentScene,"maxTime",8),phase=model.duration>0?model.time/model.duration:0,t=maxTime*phase,q=omega*t;
  var speed=v*Math.sqrt(1+q*q),ar=-v*omega*q,ap=2*v*omega,accel=Math.sqrt(ar*ar+ap*ap),at=v*omega*q/Math.sqrt(1+q*q),an=v*omega*(2+q*q)/Math.sqrt(1+q*q);
  return {v:v,omega:omega,maxTime:maxTime,t:t,q:q,r:v*t,phi:q,speed:speed,ar:ar,ap:ap,accel:accel,at:at,an:an};
}

function drawMechanicsProblem10Scene(model){
  var a=mechanicsProblem10Values(model),cx=282,cy=255,scale=195/Math.max(1,a.v*a.maxTime),px=cx+a.r*Math.cos(a.phi)*scale,py=cy-a.r*Math.sin(a.phi)*scale;
  drawAnimScene(function(){
    noStroke();fill("#0f172a");textAlign(LEFT,TOP);textSize(19);text("第10题：转杆小环的阿基米德螺线",24,22);fill("#64748b");textSize(13);text("r=vt，φ=ωt；蓝色为绝对速度，红色为绝对加速度",24,52);
    var trail=[];for(var i=0;i<=180;i+=1){var tt=a.t*i/180,rr=a.v*tt,ph=a.omega*tt;trail.push([cx+rr*Math.cos(ph)*scale,cy-rr*Math.sin(ph)*scale]);}drawMechanicsCurve(trail,"#2563eb",3);
    stroke("#94a3b8");strokeWeight(2);line(cx,cy,cx+a.v*a.maxTime*Math.cos(a.phi)*scale,cy-a.v*a.maxTime*Math.sin(a.phi)*scale);noStroke();fill("#0f172a");circle(cx,cy,10);fill("#f97316");circle(px,py,22);
    var vx=a.v*Math.cos(a.phi)-a.v*a.q*Math.sin(a.phi),vy=a.v*Math.sin(a.phi)+a.v*a.q*Math.cos(a.phi),ax=a.ar*Math.cos(a.phi)-a.ap*Math.sin(a.phi),ay=a.ar*Math.sin(a.phi)+a.ap*Math.cos(a.phi);
    var vm=Math.max(0.001,Math.sqrt(vx*vx+vy*vy)),am=Math.max(0.001,Math.sqrt(ax*ax+ay*ay));drawVectorArrow(px,py,72*vx/vm,-72*vy/vm,"#2563eb","V");drawVectorArrow(px,py,65*ax/am,-65*ay/am,"#dc2626","a");
    noStroke();fill("#334155");textSize(13);text("t="+a.t.toFixed(2)+" s",28,420);text("r="+a.r.toFixed(2)+" m",135,420);text("φ="+a.phi.toFixed(2)+" rad",245,420);text("V="+a.speed.toFixed(2)+" m/s",380,420);text("a="+a.accel.toFixed(2)+" m/s²",28,444);text("aₜ="+a.at.toFixed(2),220,444);text("aₙ="+a.an.toFixed(2),350,444);
  });
}

function drawMechanicsProblem10Graph(model){
  var a=mechanicsProblem10Values(model),left=graphLeft+52,right=970,top=104,bottom=402,qMax=a.omega*a.maxTime,yMax=Math.sqrt(4+qMax*qMax),ct=[],cn=[],ca=[];
  drawGraphFrame("自然坐标加速度分量","绿：aₜ/(vω)；蓝：aₙ/(vω)；橙：a/(vω)");stroke("#94a3b8");line(left,bottom,right,bottom);line(left,bottom,left,top);
  for(var i=0;i<=180;i+=1){var q=qMax*i/180,den=Math.sqrt(1+q*q),px=left+(right-left)*i/180;ct.push([px,bottom-(bottom-top)*(q/den)/yMax]);cn.push([px,bottom-(bottom-top)*((2+q*q)/den)/yMax]);ca.push([px,bottom-(bottom-top)*Math.sqrt(4+q*q)/yMax]);}drawMechanicsCurve(ct,"#16a34a",3);drawMechanicsCurve(cn,"#2563eb",3);drawMechanicsCurve(ca,"#f97316",2);
  var px=left+(right-left)*(qMax>0?a.q/qMax:0),den=Math.sqrt(1+a.q*a.q);noStroke();fill("#16a34a");circle(px,bottom-(bottom-top)*(a.q/den)/yMax,10);fill("#2563eb");circle(px,bottom-(bottom-top)*((2+a.q*a.q)/den)/yMax,10);fill("#f97316");circle(px,bottom-(bottom-top)*Math.sqrt(4+a.q*a.q)/yMax,10);
  fill("#0f172a");textAlign(LEFT,TOP);textSize(13);text("q=ωt="+a.q.toFixed(2),left+12,top+10);text("aₜ="+a.at.toFixed(3)+" m/s²",left+12,top+31);text("aₙ="+a.an.toFixed(3)+" m/s²",left+12,top+52);fill("#64748b");textAlign(CENTER,TOP);text("q=ωt",(left+right)/2,bottom+28);
}

function mechanicsProblem11Values(model){
  var l=getJsonParam(currentScene,"separation",12),v1=getJsonParam(currentScene,"v1",3),v2=getJsonParam(currentScene,"v2",4),alpha=radians(getJsonParam(currentScene,"alpha",45));
  var dcoef=v1*v1+v2*v2+2*v1*v2*Math.cos(alpha),tStar=l*(v1+v2*Math.cos(alpha))/dcoef,dMin=l*v2*Math.sin(alpha)/Math.sqrt(dcoef),phase=model.duration>0?model.time/model.duration:0;
  return {l:l,v1:v1,v2:v2,alpha:alpha,dcoef:dcoef,tStar:tStar,dMin:dMin,time:2*tStar*phase};
}

function mechanicsProblem11Positions(a,t){return {ax:a.v1*t,ay:0,bx:a.l-a.v2*Math.cos(a.alpha)*t,by:a.v2*Math.sin(a.alpha)*t};}

function drawMechanicsProblem11Scene(model){
  var a=mechanicsProblem11Values(model),end=mechanicsProblem11Positions(a,2*a.tStar),star=mechanicsProblem11Positions(a,a.tStar),cur=mechanicsProblem11Positions(a,a.time);
  var minX=Math.min(0,a.l,end.ax,end.bx),maxX=Math.max(0,a.l,end.ax,end.bx),maxY=Math.max(1,end.by),sx=410/Math.max(1,maxX-minX),sy=260/maxY,scale=Math.min(sx,sy),ox=80-minX*scale,oy=390;
  function sp(x,y){return [ox+x*scale,oy-y*scale];}var a0=sp(0,0),aEnd=sp(end.ax,end.ay),b0=sp(a.l,0),bEnd=sp(end.bx,end.by),pa=sp(cur.ax,cur.ay),pb=sp(cur.bx,cur.by),sa=sp(star.ax,star.ay),sb=sp(star.bx,star.by);
  drawAnimScene(function(){
    noStroke();fill("#0f172a");textAlign(LEFT,TOP);textSize(19);text("第11题：两匀速质点的最短距离",24,22);fill("#64748b");textSize(13);text("两条直线均为真实轨迹；红虚线是 t=t* 时的最短连线",24,52);
    stroke("#94a3b8");strokeWeight(2);line(a0[0],a0[1],aEnd[0],aEnd[1]);line(b0[0],b0[1],bEnd[0],bEnd[1]);drawingContext.setLineDash([5,4]);stroke("#dc2626");line(sa[0],sa[1],sb[0],sb[1]);drawingContext.setLineDash([]);stroke("#64748b");line(pa[0],pa[1],pb[0],pb[1]);
    noStroke();fill("#2563eb");circle(pa[0],pa[1],22);fill("#16a34a");circle(pb[0],pb[1],22);fill("#334155");textSize(13);text("A",pa[0]-5,pa[1]-32);text("B",pb[0]-5,pb[1]-32);
    var dx=cur.bx-cur.ax,dy=cur.by-cur.ay,d=Math.sqrt(dx*dx+dy*dy);text("t="+a.time.toFixed(3)+" s",28,430);text("d(t)="+d.toFixed(3)+" m",175,430);text("t*="+a.tStar.toFixed(3)+" s",340,430);text("dmin="+a.dMin.toFixed(3)+" m",28,454);
  });
}

function drawMechanicsProblem11Graph(model){
  var a=mechanicsProblem11Values(model),left=graphLeft+52,right=970,top=104,bottom=402,pts=[];
  drawGraphFrame("两质点距离 d(t)","横轴 t/t*；红点为唯一最短距离");stroke("#94a3b8");line(left,bottom,right,bottom);line(left,bottom,left,top);
  for(var i=0;i<=180;i+=1){var u=2*i/180,t=u*a.tStar,p=mechanicsProblem11Positions(a,t),dx=p.bx-p.ax,dy=p.by-p.ay,d=Math.sqrt(dx*dx+dy*dy);pts.push([left+(right-left)*i/180,bottom-(bottom-top)*d/a.l]);}drawMechanicsCurve(pts,"#2563eb",3);
  var minX=(left+right)/2,minY=bottom-(bottom-top)*a.dMin/a.l;drawingContext.setLineDash([5,4]);stroke("#dc2626");line(minX,minY,minX,bottom);drawingContext.setLineDash([]);noStroke();fill("#dc2626");circle(minX,minY,13);
  var phase=model.duration>0?model.time/model.duration:0,p=mechanicsProblem11Positions(a,a.time),dx=p.bx-p.ax,dy=p.by-p.ay,d=Math.sqrt(dx*dx+dy*dy),cx=left+(right-left)*phase;fill("#f97316");circle(cx,bottom-(bottom-top)*d/a.l,11);
  fill("#0f172a");textAlign(LEFT,TOP);textSize(13);text("t*="+a.tStar.toFixed(3)+" s",left+12,top+10);text("dmin="+a.dMin.toFixed(3)+" m",left+12,top+31);text("最短时 r·u=0",left+12,top+52);fill("#64748b");textAlign(CENTER,TOP);text("t/t*（0—2）",(left+right)/2,bottom+28);
}

function mechanicsProblem12Values(model){
  var l=getJsonParam(currentScene,"width",160),v0=getJsonParam(currentScene,"centerSpeed",4),vr=getJsonParam(currentScene,"boatSpeed",5),t1=l/(4*vr),total=3*l/(4*vr),x1=v0*l/(16*vr),x2=3*v0*l/(16*vr),phase=model.duration>0?model.time/model.duration:0;
  return {l:l,v0:v0,vr:vr,t1:t1,total:total,x1:x1,x2:x2,time:total*phase};
}

function mechanicsProblem12State(a,t){
  if(t<=a.t1){var y=a.vr*t;return {x:a.v0*y*y/(a.l*a.vr),y:y,stage:"去程",flow:2*a.v0*y/a.l};}
  var s=Math.min(a.total-a.t1,t-a.t1),y=a.l/4-a.vr*s/2,x=a.x2-2*a.v0*y*y/(a.l*a.vr);return {x:x,y:y,stage:"返程",flow:2*a.v0*y/a.l};
}

function drawMechanicsProblem12Scene(model){
  var a=mechanicsProblem12Values(model),s=mechanicsProblem12State(a,a.time),ox=82,oy=408,sx=390/(a.x2*1.12),sy=270/(a.l/4),scaleX=sx,scaleY=sy;
  function sp(x,y){return [ox+x*scaleX,oy-y*scaleY];}
  drawAnimScene(function(){
    noStroke();fill("#0f172a");textAlign(LEFT,TOP);textSize(19);text("第12题：线性流速河流中的往返轨迹",24,22);fill("#64748b");textSize(13);text("u(y)=2v₀y/L；到 y=L/4 后以 vr/2 返回",24,52);
    noStroke();fill("#e0f2fe");rect(ox,oy-a.l*scaleY/2,430,a.l*scaleY/2);stroke("#94a3b8");line(ox,oy,520,oy);line(ox,oy-a.l*scaleY/4,520,oy-a.l*scaleY/4);
    for(var k=1;k<=4;k+=1){var yy=(a.l/4)*k/4,py=oy-yy*scaleY;drawVectorArrow(ox+18,py,95*(2*yy/a.l),0,"#0ea5e9","");}
    var out=[],back=[];for(var i=0;i<=100;i+=1){var y=a.l*i/400;out.push(sp(a.v0*y*y/(a.l*a.vr),y));back.push(sp(a.x2-2*a.v0*y*y/(a.l*a.vr),y));}drawMechanicsCurve(out,"#2563eb",3);drawMechanicsCurve(back,"#16a34a",3);
    var p=sp(s.x,s.y);noStroke();fill("#f97316");circle(p[0],p[1],22);drawVectorArrow(p[0],p[1],58*(s.flow/a.v0),s.stage==="去程"?-58:58,"#dc2626",s.stage);
    var turn=sp(a.x1,a.l/4),end=sp(a.x2,0);fill("#dc2626");circle(turn[0],turn[1],10);circle(end[0],end[1],10);fill("#334155");textSize(13);text("掉头点",turn[0]+8,turn[1]-18);text("返回点",end[0]+8,end[1]-22);
    text("t="+a.time.toFixed(2)+" s",28,438);text("阶段："+s.stage,150,438);text("x="+s.x.toFixed(2)+" m",280,438);text("y="+s.y.toFixed(2)+" m",410,438);
  });
}

function drawMechanicsProblem12Graph(model){
  var a=mechanicsProblem12Values(model),left=graphLeft+52,right=970,top=104,bottom=402,cx=[],cy=[],cu=[];
  drawGraphFrame("分段状态随时间变化","蓝：x/x₂；绿：4y/L；橙：u/v₀");stroke("#94a3b8");line(left,bottom,right,bottom);line(left,bottom,left,top);
  for(var i=0;i<=180;i+=1){var phase=i/180,s=mechanicsProblem12State(a,a.total*phase),px=left+(right-left)*phase;cx.push([px,bottom-(bottom-top)*s.x/a.x2]);cy.push([px,bottom-(bottom-top)*4*s.y/a.l]);cu.push([px,bottom-(bottom-top)*s.flow/a.v0]);}drawMechanicsCurve(cx,"#2563eb",3);drawMechanicsCurve(cy,"#16a34a",3);drawMechanicsCurve(cu,"#f97316",2);
  var turnX=left+(right-left)/3;drawingContext.setLineDash([5,4]);stroke("#dc2626");line(turnX,top,turnX,bottom);drawingContext.setLineDash([]);var phase=model.duration>0?model.time/model.duration:0,s=mechanicsProblem12State(a,a.time),px=left+(right-left)*phase;noStroke();fill("#2563eb");circle(px,bottom-(bottom-top)*s.x/a.x2,10);fill("#16a34a");circle(px,bottom-(bottom-top)*4*s.y/a.l,10);fill("#f97316");circle(px,bottom-(bottom-top)*s.flow/a.v0,10);
  fill("#0f172a");textAlign(LEFT,TOP);textSize(13);text("掉头：t/T=1/3",left+12,top+10);text("x₁="+a.x1.toFixed(2)+" m",left+12,top+31);text("x₂="+a.x2.toFixed(2)+" m",left+12,top+52);fill("#64748b");textAlign(CENTER,TOP);text("t/T",(left+right)/2,bottom+28);
}

function mechanicsProblem13Radius(r0,phi0,k,phi){
  if(phi<=0)return 0;
  return r0*Math.sin(phi0)/Math.sin(phi)*Math.pow(Math.tan(phi/2)/Math.tan(phi0/2),k);
}

function mechanicsProblem13Values(model){
  var r0=getJsonParam(currentScene,"initialDistance",10),phi0=radians(getJsonParam(currentScene,"initialAngle",65)),v0=getJsonParam(currentScene,"currentSpeed",3),vp=getJsonParam(currentScene,"boatSpeed",6);
  vp=Math.max(vp,v0+0.05);
  var k=vp/v0,d=r0*Math.sin(phi0),samples=[],count=520,phiMin=1e-8,previous=null,total=0;
  for(var i=0;i<=count;i+=1){
    var q=i/count,phi=phi0*Math.pow(phiMin/phi0,q),r=mechanicsProblem13Radius(r0,phi0,k,phi);
    var item={phi:phi,r:r,x:r*Math.cos(phi),y:r*Math.sin(phi),time:0};
    if(previous){
      var f0=previous.r/(v0*Math.sin(previous.phi)),f1=r/(v0*Math.sin(phi));
      total+=0.5*(f0+f1)*(previous.phi-phi);
      item.time=total;
    }
    samples.push(item);previous=item;
  }
  var tail=previous.r/(v0*(k-1));
  total+=tail;
  samples.push({phi:0,r:0,x:0,y:0,time:total});
  var phase=model.duration>0?model.time/model.duration:0,target=total*phase,index=0;
  while(index<samples.length-2&&samples[index+1].time<target)index+=1;
  var a=samples[index],b=samples[index+1],mix=b.time>a.time?(target-a.time)/(b.time-a.time):0;
  function lerp13(u,w){return u+(w-u)*mix;}
  var state={phi:lerp13(a.phi,b.phi),r:lerp13(a.r,b.r),x:lerp13(a.x,b.x),y:lerp13(a.y,b.y),time:target};
  return {r0:r0,phi0:phi0,v0:v0,vp:vp,k:k,d:d,total:total,samples:samples,state:state};
}

function drawMechanicsProblem13Scene(model){
  var a=mechanicsProblem13Values(model),maxX=a.r0,maxY=a.d,pts=[];
  for(var i=0;i<a.samples.length;i+=1)maxX=Math.max(maxX,a.samples[i].x);
  var ox=92,oy=400,sx=400/(maxX*1.18),sy=270/(maxY*1.08),scale=Math.min(sx,sy);
  function sp(x,y){return [ox+x*scale,oy-y*scale];}
  for(i=0;i<a.samples.length;i+=1)pts.push(sp(a.samples[i].x,a.samples[i].y));
  var p=sp(a.state.x,a.state.y),o=sp(0,0),start=sp(a.r0*Math.cos(a.phi0),a.d);
  drawAnimScene(function(){
    noStroke();fill("#0f172a");textAlign(LEFT,TOP);textSize(19);text("第13题：恒定水流中指向固定点的航迹",24,22);fill("#64748b");textSize(13);text("蓝线为解析轨迹；播放进度按真实时间积分",24,52);
    noStroke();fill("#e0f2fe");rect(ox-20,oy-a.d*scale,455,a.d*scale);stroke("#94a3b8");strokeWeight(2);line(ox-20,oy,ox+435,oy);line(ox-20,oy-a.d*scale,ox+435,oy-a.d*scale);
    for(var j=0;j<4;j+=1)drawVectorArrow(ox+35+j*100,oy-a.d*scale/2,52,0,"#0ea5e9","");
    drawMechanicsCurve(pts,"#2563eb",3);
    drawingContext.setLineDash([5,4]);stroke("#64748b");line(o[0],o[1],p[0],p[1]);drawingContext.setLineDash([]);
    noStroke();fill("#dc2626");circle(o[0],o[1],18);fill("#334155");textSize(13);text("O",o[0]-7,o[1]+14);text("A",start[0]-5,start[1]-23);
    fill("#f97316");circle(p[0],p[1],22);
    var rr=Math.max(1,Math.sqrt(a.state.x*a.state.x+a.state.y*a.state.y)),ux=-a.state.x/rr,uy=a.state.y/rr;
    drawVectorArrow(p[0],p[1],58*ux,58*uy,"#dc2626","v′");
    drawVectorArrow(p[0],p[1],46,0,"#16a34a","v₀");
    fill("#334155");textAlign(LEFT,TOP);text("k=v′/v₀="+a.k.toFixed(2),28,432);text("t="+a.state.time.toFixed(2)+" h",170,432);text("r="+a.state.r.toFixed(2)+" km",310,432);text("φ="+degrees(a.state.phi).toFixed(1)+"°",28,455);
  });
}

function drawMechanicsProblem13Graph(model){
  var a=mechanicsProblem13Values(model),left=graphLeft+52,right=970,top=104,bottom=402,cr=[],cx=[],cy=[],cursor=0;
  drawGraphFrame("真实时间下的无量纲状态","蓝：r/r₀；橙：x/r₀；绿：y/d");stroke("#94a3b8");line(left,bottom,right,bottom);line(left,bottom,left,top);
  for(var i=0;i<=180;i+=1){
    var target=a.total*i/180;while(cursor<a.samples.length-2&&a.samples[cursor+1].time<target)cursor+=1;
    var s0=a.samples[cursor],s1=a.samples[cursor+1],m=s1.time>s0.time?(target-s0.time)/(s1.time-s0.time):0;
    var r=s0.r+(s1.r-s0.r)*m,x=s0.x+(s1.x-s0.x)*m,y=s0.y+(s1.y-s0.y)*m,px=left+(right-left)*i/180;
    cr.push([px,bottom-(bottom-top)*r/a.r0]);cx.push([px,bottom-(bottom-top)*x/a.r0]);cy.push([px,bottom-(bottom-top)*y/a.d]);
  }
  drawMechanicsCurve(cr,"#2563eb",3);drawMechanicsCurve(cx,"#f97316",2.5);drawMechanicsCurve(cy,"#16a34a",3);
  var phase=model.duration>0?model.time/model.duration:0,px=left+(right-left)*phase;
  noStroke();fill("#2563eb");circle(px,bottom-(bottom-top)*a.state.r/a.r0,10);fill("#f97316");circle(px,bottom-(bottom-top)*a.state.x/a.r0,10);fill("#16a34a");circle(px,bottom-(bottom-top)*a.state.y/a.d,10);
  fill("#0f172a");textAlign(LEFT,TOP);textSize(13);text("总时间 T≈"+a.total.toFixed(3)+" h",left+12,top+10);text("r/r₀="+(a.state.r/a.r0).toFixed(3),left+12,top+31);text("φ="+degrees(a.state.phi).toFixed(2)+"°",left+12,top+52);fill("#64748b");textAlign(CENTER,TOP);text("t/T",(left+right)/2,bottom+28);
}

function mechanicsProblem14Values(model){
  var vc=getJsonParam(currentScene,"centerSpeed",4),omega=getJsonParam(currentScene,"angularSpeed",2),r=vc/omega,phase=model.duration>0?model.time/model.duration:0,theta=2*Math.PI*phase;
  return {vc:vc,omega:omega,r:r,phase:phase,theta:theta,time:theta/omega,vx:vc*(1-Math.cos(theta)),vy:vc*Math.sin(theta),speed:2*vc*Math.abs(Math.sin(theta/2))};
}

function drawMechanicsProblem14Scene(model){
  var a=mechanicsProblem14Values(model),rp=48,cx=102+300*a.phase,cy=338,ground=cy+rp,px=cx-rp*Math.sin(a.theta),py=cy+rp*Math.cos(a.theta),cycloid=[];
  for(var i=0;i<=180;i+=1){var q=2*Math.PI*i/180;cycloid.push([102+rp*(q-Math.sin(q)),ground-rp*(1-Math.cos(q))]);}
  drawAnimScene(function(){
    noStroke();fill("#0f172a");textAlign(LEFT,TOP);textSize(19);text("第14题：纯滚动轮缘点 A 的绝对速度",24,22);fill("#64748b");textSize(13);text("轮心平动与顺时针转动严格满足 v_c=ωR",24,52);
    stroke("#64748b");strokeWeight(2);line(55,ground,520,ground);drawMechanicsCurve(cycloid,"#93c5fd",2);
    noFill();stroke("#2563eb");strokeWeight(3);circle(cx,cy,2*rp);
    stroke("#bfdbfe");strokeWeight(1.5);for(var j=0;j<8;j+=1){var ang=j*Math.PI/4+a.theta;line(cx,cy,cx+rp*Math.cos(ang),cy+rp*Math.sin(ang));}
    stroke("#334155");strokeWeight(2);line(cx,cy,px,py);noStroke();fill("#2563eb");circle(cx,cy,10);fill("#f97316");circle(px,py,20);
    drawVectorArrow(cx,cy,54,0,"#16a34a","v_c");drawVectorArrow(px,py,28*a.vx/a.vc,-28*a.vy/a.vc,"#dc2626","v_A");
    fill("#334155");textAlign(LEFT,TOP);textSize(13);text("A",px+8,py-20);text("C",cx-7,cy+9);text("θ="+degrees(a.theta).toFixed(1)+"°",28,426);text("t="+a.time.toFixed(2)+" s",155,426);text("R=v_c/ω="+a.r.toFixed(2)+" m",285,426);text("|v_A|="+a.speed.toFixed(2)+" m/s",28,451);
  });
}

function drawMechanicsProblem14Graph(model){
  var a=mechanicsProblem14Values(model),left=graphLeft+52,right=970,top=104,bottom=402,yMin=-1.15,yMax=2.15,cx=[],cy=[],cs=[];
  function gy(v){return bottom-(bottom-top)*(v-yMin)/(yMax-yMin);}
  drawGraphFrame("轮缘点速度随位置角 θ 变化","蓝：v_Ax/v_c；绿：v_Ay/v_c；橙：|v_A|/v_c");stroke("#94a3b8");line(left,bottom,right,bottom);line(left,gy(0),right,gy(0));line(left,bottom,left,top);
  for(var i=0;i<=180;i+=1){var q=2*Math.PI*i/180,px=left+(right-left)*i/180;cx.push([px,gy(1-Math.cos(q))]);cy.push([px,gy(Math.sin(q))]);cs.push([px,gy(2*Math.abs(Math.sin(q/2)))]);}
  drawMechanicsCurve(cx,"#2563eb",3);drawMechanicsCurve(cy,"#16a34a",3);drawMechanicsCurve(cs,"#f97316",2.5);
  var px=left+(right-left)*a.phase;noStroke();fill("#2563eb");circle(px,gy(a.vx/a.vc),10);fill("#16a34a");circle(px,gy(a.vy/a.vc),10);fill("#f97316");circle(px,gy(a.speed/a.vc),10);
  fill("#0f172a");textAlign(LEFT,TOP);textSize(13);text("θ="+degrees(a.theta).toFixed(1)+"°",left+12,top+10);text("v_Ax="+a.vx.toFixed(2)+" m/s",left+12,top+31);text("v_Ay="+a.vy.toFixed(2)+" m/s",left+12,top+52);text("|v_A|="+a.speed.toFixed(2)+" m/s",left+12,top+73);fill("#64748b");textAlign(CENTER,TOP);text("θ（0—2π）",(left+right)/2,bottom+28);
}

function mechanicsProblem15Values(model){
  var ring=getJsonParam(currentScene,"ringRadius",7),disk=getJsonParam(currentScene,"diskRadius",2.5),omega=getJsonParam(currentScene,"orbitalSpeed",1.2);
  disk=Math.min(disk,ring*0.9);
  var phase=model.duration>0?model.time/model.duration:0,phi=2*Math.PI*phase,time=phi/omega,spinOmega=-omega*(ring-disk)/disk,spin=spinOmega*time,acc=omega*omega*ring*(ring-disk)/disk,rho=disk/ring,normalized=(1-rho)/rho;
  return {ring:ring,disk:disk,omega:omega,phase:phase,phi:phi,time:time,spinOmega:spinOmega,spin:spin,acc:acc,ax:-acc*Math.cos(phi),ay:-acc*Math.sin(phi),rho:rho,normalized:normalized};
}

function drawMechanicsProblem15Scene(model){
  var a=mechanicsProblem15Values(model),ox=287,oy=270,outer=143,inner=outer*a.rho,orbit=outer-inner,cx=ox+orbit*Math.cos(a.phi),cy=oy-orbit*Math.sin(a.phi),ax=ox+outer*Math.cos(a.phi),ay=oy-outer*Math.sin(a.phi);
  drawAnimScene(function(){
    noStroke();fill("#0f172a");textAlign(LEFT,TOP);textSize(19);text("第15题：圆盘沿圆环内侧无滑动滚动",24,22);fill("#64748b");textSize(13);text("A 为当前瞬时接触材料点；红箭头为其对地加速度",24,52);
    noFill();stroke("#94a3b8");strokeWeight(3);circle(ox,oy,2*outer);drawingContext.setLineDash([5,4]);stroke("#cbd5e1");circle(ox,oy,2*orbit);drawingContext.setLineDash([]);
    stroke("#2563eb");strokeWeight(3);circle(cx,cy,2*inner);stroke("#bfdbfe");strokeWeight(1.5);
    for(var j=0;j<8;j+=1){var q=j*Math.PI/4+a.spin;line(cx,cy,cx+inner*Math.cos(q),cy-inner*Math.sin(q));}
    stroke("#64748b");line(ox,oy,cx,cy);line(cx,cy,ax,ay);noStroke();fill("#0f172a");circle(ox,oy,10);fill("#2563eb");circle(cx,cy,10);fill("#f97316");circle(ax,ay,20);
    var tangent=a.phi+Math.PI/2;drawVectorArrow(cx,cy,50*Math.cos(tangent),-50*Math.sin(tangent),"#16a34a","v_C");drawVectorArrow(ax,ay,-72*Math.cos(a.phi),72*Math.sin(a.phi),"#dc2626","a_A");
    fill("#334155");textAlign(LEFT,TOP);textSize(13);text("O",ox-17,oy+5);text("C",cx+8,cy+5);text("A",ax+8,ay-18);text("φ="+degrees(a.phi).toFixed(1)+"°",28,426);text("ω自转="+a.spinOmega.toFixed(2)+" rad/s",145,426);text("a_A="+a.acc.toFixed(2)+" m/s²",330,426);text("方向：A → O",28,451);
  });
}

function drawMechanicsProblem15Graph(model){
  var a=mechanicsProblem15Values(model),left=graphLeft+52,right=970,top=104,bottom=402,m=a.normalized,yMin=-1.18*m,yMax=1.18*m,cx=[],cy=[],cm=[];
  function gy(v){return bottom-(bottom-top)*(v-yMin)/(yMax-yMin);}
  drawGraphFrame("接触点加速度随公转角 φ 变化","蓝：a_Ax/(Ω²R)；绿：a_Ay/(Ω²R)；橙：|a_A|/(Ω²R)");stroke("#94a3b8");line(left,gy(0),right,gy(0));line(left,bottom,left,top);
  for(var i=0;i<=180;i+=1){var q=2*Math.PI*i/180,px=left+(right-left)*i/180;cx.push([px,gy(-m*Math.cos(q))]);cy.push([px,gy(-m*Math.sin(q))]);cm.push([px,gy(m)]);}
  drawMechanicsCurve(cx,"#2563eb",3);drawMechanicsCurve(cy,"#16a34a",3);drawMechanicsCurve(cm,"#f97316",2.5);
  var px=left+(right-left)*a.phase;noStroke();fill("#2563eb");circle(px,gy(a.ax/(a.omega*a.omega*a.ring)),10);fill("#16a34a");circle(px,gy(a.ay/(a.omega*a.omega*a.ring)),10);fill("#f97316");circle(px,gy(m),10);
  fill("#0f172a");textAlign(LEFT,TOP);textSize(13);text("r/R="+a.rho.toFixed(3),left+12,top+10);text("|a_A|/(Ω²R)="+m.toFixed(3),left+12,top+31);text("a_A="+a.acc.toFixed(2)+" m/s²",left+12,top+52);text("方向始终指向 O",left+12,top+73);fill("#64748b");textAlign(CENTER,TOP);text("φ（0—2π）",(left+right)/2,bottom+28);
}

function drawMechanicsKinematicsScene(model, number) {
  if (number === 2) {
    drawMechanicsProblem02Scene(model);
    return;
  }
  if (number === 3) {
    drawMechanicsProblem03Scene(model);
    return;
  }
  if (number === 4) {
    drawMechanicsProblem04Scene(model);
    return;
  }
  if (number === 5) {
    drawMechanicsProblem05Scene(model);
    return;
  }
  if (number === 6) {
    drawMechanicsProblem06Scene(model);
    return;
  }
  if (number === 7) {
    drawMechanicsProblem07Scene(model);
    return;
  }
  if (number === 8) {
    drawMechanicsProblem08Scene(model);
    return;
  }
  if (number === 9) {
    drawMechanicsProblem09Scene(model);
    return;
  }
  if (number === 10) {
    drawMechanicsProblem10Scene(model);
    return;
  }
  if (number === 11) {
    drawMechanicsProblem11Scene(model);
    return;
  }
  if (number === 12) {
    drawMechanicsProblem12Scene(model);
    return;
  }
  if (number === 13) {
    drawMechanicsProblem13Scene(model);
    return;
  }
  if (number === 14) {
    drawMechanicsProblem14Scene(model);
    return;
  }
  if (number === 15) {
    drawMechanicsProblem15Scene(model);
    return;
  }
  var p = model.duration > 0 ? model.time / model.duration : 0;
  var points = [];
  var i;
  drawAnimScene(function () {
    noStroke(); fill("#0f172a"); textAlign(LEFT, TOP); textSize(19);
    text("运动学第" + number + "题 · 原题模型", 24, 22);
    fill("#64748b"); textSize(13);
    text("橙色点表示当前时刻；轨迹与约束按原题归一化绘制", 24, 52);
    stroke("#cbd5e1"); strokeWeight(1.5); line(62, 408, 530, 408); line(82, 430, 82, 92);
    if (number === 2 || number === 3) {
      for (i = 0; i <= 100; i += 1) {
        var q = i / 100;
        var xx = number === 2 ? 1 - Math.exp(-3 * q) : Math.sqrt(1 + 8 * q) - 1;
        points.push([92 + 390 * xx / (number === 2 ? 0.96 : 2), 285]);
      }
      drawMechanicsCurve(points, "#2563eb", 5);
      fill("#f97316"); noStroke(); circle(points[Math.round(100 * p)][0], 285, 22);
      fill("#334155"); text("阻力方向", 105, 318); drawVectorArrow(245, 285, -72, 0, "#dc2626", "f");
    } else if (number === 4) {
      line(82, 408, 500, 238);
      for (i = 0; i <= 100; i += 1) { var u4=i/100; points.push([82+390*u4,408-285*u4+115*u4*u4]); }
      drawMechanicsCurve(points); fill("#f97316"); noStroke(); circle(points[Math.round(100*p)][0],points[Math.round(100*p)][1],22);
      fill("#334155"); text("坡面 θ", 420, 330); text("发射角 θ+α", 102, 360);
    } else if (number === 5) {
      for (var a5=0; a5<2; a5+=1) { points=[]; for(i=0;i<=100;i+=1){var u5=i/100;points.push([82+420*u5,408-(a5?285:145)*4*u5*(1-u5)]);} drawMechanicsCurve(points,a5?"#2563eb":"#16a34a",3); }
      var py5=408-285*4*p*(1-p); fill("#f97316"); noStroke(); circle(82+420*p,py5,20); fill("#334155"); text("同一 R，不同飞行时间",180,92);
    } else if (number === 6) {
      rectMode(CORNER); noStroke(); fill("#94a3b8"); rect(420,170,18,238);
      points=[]; for(i=0;i<=100;i+=1){var u6=i/100;points.push([82+338*u6,408-330*u6+92*u6*u6]);} drawMechanicsCurve(points);
      fill("#f97316"); noStroke(); circle(points[Math.round(100*p)][0],points[Math.round(100*p)][1],22); fill("#334155"); text("(d,h)",442,164);
    } else if (number === 7) {
      points=[]; for(i=0;i<=100;i+=1){var x7=i/100;points.push([82+420*x7,145+263*x7*x7]);} drawMechanicsCurve(points,"#2563eb",3);
      var bounce=[]; for(i=0;i<=100;i+=1){var xb=i/100;var yb=xb<1/3?145+263*Math.pow(3*xb,2):408-263*Math.max(0,2*(3*xb-1)-Math.pow(3*xb-1,2));bounce.push([82+420*xb,Math.min(408,yb)]);} drawMechanicsCurve(bounce,"#16a34a",3);
      stroke("#64748b"); line(292,408,292,211); fill("#f97316"); noStroke(); circle(82+420*p,points[Math.round(100*p)][1],20); fill("#334155"); text("xₚ=R/2，h=3H/4",315,190);
    } else if (number === 8) {
      stroke("#64748b"); line(470,408,470,90); points=[]; for(i=0;i<=100;i+=1){var q8=i/100;points.push([90+380*q8,408-260*Math.pow(q8,1.55)]);} drawMechanicsCurve(points);
      fill("#f97316"); noStroke(); circle(points[Math.round(100*p)][0],points[Math.round(100*p)][1],22); fill("#16a34a"); circle(470,408-260*p,18); fill("#334155"); text("导弹始终指向目标",140,100);
    } else if (number === 9) {
      noFill(); stroke("#94a3b8"); circle(230,270,150); points=[]; for(i=0;i<=120;i+=1){var ph=4*i/120;points.push([230+75*(Math.cos(ph)+ph*Math.sin(ph)),270-75*(Math.sin(ph)-ph*Math.cos(ph))]);} drawMechanicsCurve(points);
      var j9=Math.round(120*p); fill("#f97316"); noStroke(); circle(points[j9][0],points[j9][1],21); stroke("#64748b"); line(230+75*Math.cos(4*p),270-75*Math.sin(4*p),points[j9][0],points[j9][1]);
    } else if (number === 10) {
      points=[]; for(i=0;i<=160;i+=1){var ph10=4*Math.PI*i/160;var rr=24*ph10;points.push([270+rr*Math.cos(ph10),260-rr*Math.sin(ph10)]);} drawMechanicsCurve(points);
      var j10=Math.round(160*p); stroke("#94a3b8"); line(270,260,points[j10][0],points[j10][1]); fill("#f97316"); noStroke(); circle(points[j10][0],points[j10][1],20);
    } else if (number === 11) {
      stroke("#94a3b8"); line(105,330,465,330); line(465,330,300,170); fill("#2563eb"); noStroke(); circle(105+220*p,330,21); fill("#f97316"); circle(465-150*p,330-145*p,21); fill("#334155"); text("相对轨迹到原点的垂距",125,95);
    } else if (number === 12) {
      points=[]; for(i=0;i<=50;i+=1){var yy=i/50;points.push([95+120*yy*yy,408-260*yy]);} for(i=50;i>=0;i-=1){var yr=i/50;points.push([95+360-240*yr*yr,408-260*yr]);} drawMechanicsCurve(points);
      var j12=Math.round((points.length-1)*p); fill("#f97316"); noStroke(); circle(points[j12][0],points[j12][1],22); drawVectorArrow(180,120,120,0,"#16a34a","水流");
    } else if (number === 13) {
      stroke("#94a3b8"); line(80,120,510,120); line(80,408,510,408); points=[]; for(i=0;i<=100;i+=1){var u13=i/100;points.push([130+220*u13+100*u13*u13,120+288*u13]);} drawMechanicsCurve(points); var j13=Math.round(100*p); fill("#f97316"); noStroke(); circle(points[j13][0],points[j13][1],22); fill("#dc2626"); circle(450,408,18); drawVectorArrow(170,92,100,0,"#16a34a","v₀");
    } else if (number === 14) {
      var cx14=130+330*p; var cy14=315; noFill(); stroke("#2563eb"); circle(cx14,cy14,150); var th=2*Math.PI*p; var ax14=cx14-75*Math.sin(th), ay14=cy14+75*Math.cos(th); fill("#f97316"); noStroke(); circle(ax14,ay14,20); stroke("#64748b"); line(cx14,cy14,ax14,ay14); drawVectorArrow(ax14,ay14,95*(1-Math.cos(th)), -95*Math.sin(th),"#dc2626","v_A");
    } else if (number === 15) {
      noFill(); stroke("#94a3b8"); circle(285,260,300); var ph15=2*Math.PI*p; var ccx=285+105*Math.cos(ph15), ccy=260-105*Math.sin(ph15); stroke("#2563eb"); circle(ccx,ccy,90); var ax15=285+150*Math.cos(ph15), ay15=260-150*Math.sin(ph15); fill("#f97316"); noStroke(); circle(ax15,ay15,20); drawVectorArrow(ax15,ay15,285-ax15,260-ay15,"#dc2626","a_A");
    }
  });
}

function drawMechanicsKinematicsGraph(model, number) {
  if (number === 2) {
    drawMechanicsProblem02Graph(model);
    return;
  }
  if (number === 3) {
    drawMechanicsProblem03Graph(model);
    return;
  }
  if (number === 4) {
    drawMechanicsProblem04Graph(model);
    return;
  }
  if (number === 5) {
    drawMechanicsProblem05Graph(model);
    return;
  }
  if (number === 6) {
    drawMechanicsProblem06Graph(model);
    return;
  }
  if (number === 7) {
    drawMechanicsProblem07Graph(model);
    return;
  }
  if (number === 8) {
    drawMechanicsProblem08Graph(model);
    return;
  }
  if (number === 9) {
    drawMechanicsProblem09Graph(model);
    return;
  }
  if (number === 10) {
    drawMechanicsProblem10Graph(model);
    return;
  }
  if (number === 11) {
    drawMechanicsProblem11Graph(model);
    return;
  }
  if (number === 12) {
    drawMechanicsProblem12Graph(model);
    return;
  }
  if (number === 13) {
    drawMechanicsProblem13Graph(model);
    return;
  }
  if (number === 14) {
    drawMechanicsProblem14Graph(model);
    return;
  }
  if (number === 15) {
    drawMechanicsProblem15Graph(model);
    return;
  }
  var left=graphLeft+48, right=968, top=105, bottom=402, points=[], i;
  var titles={2:"线性阻力：v/v₀=e⁻ᵗ",3:"三次方阻力：v/v₀",4:"沿坡射程—仰角",5:"等射程角的飞行时间",6:"通过墙顶所需初速度",7:"两球高度—水平位置",8:"追踪曲线",9:"圆的渐开线",10:"aₜ 与 aₙ",11:"两质点间距—时间",12:"往返航迹",13:"恒流中的指向航迹",14:"轮缘点速度—θ",15:"接触点加速度方向"};
  drawGraphFrame(titles[number] || "运动学关系", "蓝线为由解析公式得到的归一化关系");
  stroke("#94a3b8"); line(left,bottom,right,bottom); line(left,bottom,left,top);
  for(i=0;i<=100;i+=1){var x=i/100,y=0;
    if(number===2)y=Math.exp(-4*x); else if(number===3)y=1/Math.sqrt(1+8*x); else if(number===4)y=Math.max(0,Math.sin(Math.PI*x)*Math.cos(0.35+Math.PI*x/2)); else if(number===5)y=Math.sin(Math.PI*x/2); else if(number===6)y=0.25+Math.pow(x-0.72,2); else if(number===7)y=1-x*x; else if(number===8)y=Math.pow(x,1.55); else if(number===9)y=Math.min(1,Math.sqrt(x)); else if(number===10)y=(2+4*x*x)/Math.sqrt(1+4*x*x)/3; else if(number===11)y=Math.sqrt(0.12+Math.pow(1.1*x-0.65,2)); else if(number===12)y=x*x; else if(number===13)y=Math.pow(x,1.6); else if(number===14)y=Math.sin(Math.PI*x/2); else y=1;
    points.push([left+(right-left)*x,bottom-(bottom-top)*Math.max(0,Math.min(1,y))]); }
  drawMechanicsCurve(points,"#2563eb",3);
  var j=Math.round(100*(model.duration>0?model.time/model.duration:0)); fill("#f97316"); noStroke(); circle(points[j][0],points[j][1],13);
}

function drawMechanicsChallengeScene() {
  var model = getMechanicsChallengeState();
  if (model.variant === "kinematics_problem_01") {
    drawMechanicsProblem01Scene(model);
    return;
  }
  var kinematicsNumber = mechanicsKinematicsProblemNumber(model.variant);
  if (kinematicsNumber >= 2 && kinematicsNumber <= 15) {
    drawMechanicsKinematicsScene(model, kinematicsNumber);
    return;
  }
  var phase = model.duration > 0 ? model.time / model.duration : 0;
  var omega = Math.PI * 2 * model.rate;
  var x = 115 + 340 * phase;
  var y = 260 - 90 * model.amplitude * Math.sin(omega * phase);
  drawAnimScene(function () {
    noStroke();
    fill("#0f172a");
    textAlign(LEFT, TOP);
    textSize(19);
    text(mechanicsChallengeLabel(model.variant), 24, 24);
    fill("#64748b");
    textSize(13);
    text("章节模型骨架 · 解题时须按原题约束改写方程", 24, 54);

    stroke("#cbd5e1");
    strokeWeight(2);
    line(62, 390, 530, 390);
    line(82, 410, 82, 105);
    drawArrow(82, 390, 532, 390, "#64748b");
    drawArrow(82, 390, 82, 100, "#64748b");

    if (model.variant === "statics") {
      x = 290;
      y = 260;
      stroke("#334155");
      line(x - 120, y + 82, x + 120, y + 82);
      drawVectorArrow(x, y, 0, 105, "#dc2626", "mg");
      drawVectorArrow(x, y, 0, -105, "#2563eb", "N");
      drawVectorArrow(x, y, 110, 0, "#f97316", "F");
      drawVectorArrow(x, y, -110, 0, "#16a34a", "f");
    } else if (model.variant === "rigid" || model.variant === "angular") {
      x = 290;
      y = 255;
      noFill();
      stroke("#2563eb");
      strokeWeight(5);
      circle(x, y, 170 * model.amplitude);
      stroke("#94a3b8");
      line(x, y, x + 85 * model.amplitude * Math.cos(omega * phase), y - 85 * model.amplitude * Math.sin(omega * phase));
      noStroke();
      fill("#f97316");
      circle(x + 85 * model.amplitude * Math.cos(omega * phase), y - 85 * model.amplitude * Math.sin(omega * phase), 22);
      fill("#0f172a");
      textAlign(CENTER, CENTER);
      textSize(14);
      text(model.variant === "angular" ? "L = r × p" : "τ = Iα", x, y);
    } else if (model.variant === "energy") {
      var kinetic = 0.2 + 0.7 * phase;
      noStroke();
      fill("#2563eb");
      rect(145, 355 - 220 * kinetic, 105, 220 * kinetic, 8);
      fill("#f97316");
      rect(330, 355 - 220 * (1 - kinetic), 105, 220 * (1 - kinetic), 8);
      fill("#0f172a");
      textAlign(CENTER, TOP);
      textSize(15);
      text("动能", 198, 365);
      text("势能/内能", 383, 365);
    } else if (model.variant === "oscillation") {
      stroke("#2563eb");
      strokeWeight(3);
      noFill();
      beginShape();
      for (var px = 90; px <= 525; px += 4) {
        vertex(px, 255 - 70 * model.amplitude * Math.sin((px - 90) / 64 - omega * phase));
      }
      endShape();
      noStroke();
      fill("#f97316");
      circle(305, 255 - 70 * model.amplitude * Math.sin(215 / 64 - omega * phase), 18);
    } else {
      stroke("#2563eb");
      strokeWeight(3);
      noFill();
      beginShape();
      for (var i = 0; i <= 100; i += 1) {
        var tx = 105 + i * 3.8;
        var ty = model.variant === "newton" ? 360 - 0.018 * i * i * model.amplitude : 320 - 80 * Math.sin(i / 100 * Math.PI);
        vertex(tx, ty);
      }
      endShape();
      noStroke();
      fill("#f97316");
      circle(x, y, 24);
      if (model.variant === "newton") {
        drawVectorArrow(x, y, 85, 0, "#dc2626", "ΣF");
      }
    }
  });
}

function drawMechanicsChallengeGraph() {
  var model = getMechanicsChallengeState();
  if (model.variant === "kinematics_problem_01") {
    drawMechanicsProblem01Graph(model);
    return;
  }
  var kinematicsNumber = mechanicsKinematicsProblemNumber(model.variant);
  if (kinematicsNumber >= 2 && kinematicsNumber <= 15) {
    drawMechanicsKinematicsGraph(model, kinematicsNumber);
    return;
  }
  var phase = model.duration > 0 ? model.time / model.duration : 0;
  drawGraphFrame("建模检查", mechanicsChallengeLabel(model.variant));
  var items = ["① 研究对象与参考系", "② 约束、受力与过程边界", "③ 控制方程与守恒量", "④ 量纲、极限和方向复核"];
  for (var i = 0; i < items.length; i += 1) {
    var active = phase >= i / items.length;
    noStroke();
    fill(active ? "#dbeafe" : "#f1f5f9");
    rect(graphLeft + 28, 104 + i * 72, 350, 48, 9);
    fill(active ? "#1d4ed8" : "#64748b");
    textAlign(LEFT, CENTER);
    textSize(14);
    text(items[i], graphLeft + 44, 128 + i * 72);
  }
}

registerSceneRenderer("mechanics_challenge_model", drawMechanicsChallengeScene, drawMechanicsChallengeGraph);
