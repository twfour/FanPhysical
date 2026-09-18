function mp3Variant() { return ((problemDataMap[currentScene] || {}).animation || {}).variant || ""; }
function mp3Progress() {
  var state = getJsonAnimationState(currentScene);
  return constrain(state.time / Math.max(0.001, getJsonDuration(currentScene)), 0, 1);
}
function mp3Header(note) {
  crText((problemDataMap[currentScene] || {}).title || "动量守恒习题", 28, 28, "#0f172a", 18, LEFT);
  crText(note, 28, 54, "#475569", 13, LEFT);
}

function mp3DrawFootball(p) {
  mp3Header("下落、接触反弹与上升：冲量必须按阶段分解"); crGround(410);
  var y;
  if (p < 0.38) y = 105 + 265 * p / 0.38;
  else if (p < 0.5) y = 370 - 35 * sin(PI * (p - 0.38) / 0.12);
  else y = 370 - 250 * sin(PI * (p - 0.5));
  crBall(285, y, 27, "#f8fafc", "球");
  if (p > 0.36 && p < 0.52) { fill("#f59e0b"); noStroke(); arc(285, 410, 110, 72, PI, TWO_PI); crArrow(285, 385, 285, 305, "#2563eb", "I头"); }
  crArrow(350, 120, 350, 200, "#dc2626", "mg");
}

function mp3DrawFlow(p) {
  var wind = mp3Variant() === "wind_tunnel";
  mp3Header(wind ? "风力与速度平方成正比" : "单位时间动量变化产生持续冲力");
  if (wind) {
    for (var i=0;i<24;i+=1) { var y=430-((i*23+p*240)%360); crBall(155+(i%5)*55,y,6,"#bae6fd",""); }
    crBlock(360,185,52,130,"#f59e0b","m"); crArrow(386,365,386,270,"#2563eb","F风"); crArrow(386,150,386,220,"#dc2626","mg");
  } else {
    crBlock(390,145,70,245,"#64748b","车面");
    for (var j=0;j<18;j+=1) crBall(70+((j*29+p*300)%300),230+(j%4)*18,6,"#38bdf8","");
    crArrow(90,330,355,330,"#2563eb","水流"); crArrow(420,420,330,420,"#dc2626","反作用");
  }
}

function mp3DrawDrag(p) {
  mp3Header("线性阻力使速度按指数规律趋近终端速度"); crGround(415);
  var up = p < 0.42; var q = up ? p/0.42 : (p-0.42)/0.58;
  var y = up ? 375-260*(1-(1-q)*(1-q)) : 115+260*q*q;
  crBall(270,y,24,"#f97316","m");
  crArrow(270,y+32,270,y+92,"#dc2626","mg");
  crArrow(220,y,220,y+(up?55:-55),"#2563eb","f");
}

function mp3DrawBowl(p) {
  mp3Header("水平方向质心不动，曲面与小球反向移动"); crGround(420);
  var bowlX=150+70*p; noFill(); stroke("#475569"); strokeWeight(8); arc(bowlX+170,210,300,300,0,PI);
  var angle=0.08+2.98*p; var bx=bowlX+170+150*cos(angle); var by=210+150*sin(angle); crBall(bx,by,22,"#f97316","A");
  crArrow(bowlX+170,390,bowlX+105,390,"#2563eb","B反向");
}

function mp3DrawBoards(p) {
  mp3Header("摩擦改变各部分速度，但整体水平动量保持不变"); crGround(405);
  var baseX=80+75*p; crBlock(baseX,330,210,55,"#f59e0b","A"); crBlock(baseX+210,330,210,55,"#2563eb","B");
  var blockX=baseX+370-290*p; crBlock(blockX,275,48,55,"#0f766e","C");
  crArrow(baseX+180,430,baseX+250,430,"#475569","v车");
}

function mp3DrawPendulumPossible(p) {
  mp3Header("碰撞耗散程度不同，B 球上升高度形成可行区间");
  var ox=280,oy=95,len=220; var a1=-PI/3*(1-constrain(p/0.38,0,1)); var a2=0.8*sin(PI*constrain((p-0.38)/0.62,0,1));
  var ax=ox+len*sin(a1), ay=oy+len*cos(a1); var bx=ox+len*sin(a2), by=oy+len*cos(a2);
  stroke("#475569"); strokeWeight(2); line(ox,oy,ax,ay); line(ox,oy,bx,by); crBall(ax,ay,21,"#f97316","A"); crBall(bx,by,21,"#2563eb","B");
}

function mp3DrawGravityAssist(p) {
  mp3Header("在行星系中反射，再换回太阳参考系");
  crBall(360,280,68,"#64748b","行星"); crArrow(430,170,350,170,"#2563eb","u");
  var angle=PI+PI*p; var x=360+220*cos(angle), y=280+145*sin(angle); crBall(x,y,12,"#f97316","探");
  crArrow(x,y-25,x+(p<0.5?55:-75),y-25,"#dc2626",p<0.5?"v0":"v1");
}

function mp3DrawStep(p) {
  mp3Header("摆动、断绳、摩擦滑动与台阶碰撞分阶段处理"); crGround(410);
  fill("#64748b"); stroke("#334155"); rect(35,330,80,80); var boardX=165-85*min(p/0.72,1); crBlock(boardX,350,390,50,"#f59e0b","A");
  var bx=boardX+360-300*constrain((p-0.28)/0.72,0,1); var by=p<0.28?115+210*p/0.28:325; crBall(bx,by,20,"#2563eb","B");
  if (p<0.28) { stroke("#334155"); line(boardX+360,95,bx,by); }
}

function mp3DrawBulletBag(p) {
  mp3Header("粘连碰撞后，砂袋与可动车共同摆动"); crGround(420);
  var cartX=175+55*p; crBlock(cartX,90,260,48,"#64748b","M2");
  var angle=0.85*sin(PI*constrain((p-0.28)/0.72,0,1)); var ox=cartX+130,oy=138,bx=ox+220*sin(angle),by=oy+220*cos(angle);
  stroke("#334155"); strokeWeight(3); line(ox,oy,bx,by); crBlock(bx-30,by-25,60,50,"#f59e0b","M1");
  var bulletX=p<0.28?40+245*p/0.28:bx-18; crBlock(bulletX,by-4,38,12,"#475569","m");
}

function drawMomentumPracticeScene() {
  var v=mp3Variant(),p=mp3Progress();
  if (v==="football_header") mp3DrawFootball(p);
  else if (/pressure_washer|wind_tunnel/.test(v)) mp3DrawFlow(p);
  else if (v==="linear_drag_throw") mp3DrawDrag(p);
  else if (v==="moving_bowl") mp3DrawBowl(p);
  else if (/two_planks_slider/.test(v)) mp3DrawBoards(p);
  else if (v==="possible_pendulum_height") mp3DrawPendulumPossible(p);
  else if (/wall_ball_chain/.test(v)) crDrawHeadOn(p,true);
  else if (/mobile_curved_tube/.test(v)) crDrawTube(p);
  else if (v==="gravity_assist") mp3DrawGravityAssist(p);
  else if (/sticky_carts_spring|spring_velocity_graph/.test(v)) crDrawSpringSystem(p);
  else if (v==="pendulum_plank_step") mp3DrawStep(p);
  else if (v==="bullet_bag_cart") mp3DrawBulletBag(p);
  else crDrawHeadOn(p,false);
}

function drawMomentumPracticeGraph() {
  var v=mp3Variant(),base=crParam("mass",1)*crParam("speed",6),f;
  if (/linear_drag/.test(v)) {
    f=crAxes("速度随时间变化","v",-base,base); crPlot(f,"#f97316",function(q){return q<0.42?base*(1-q/0.42): -base*0.75*(1-exp(-5*(q-0.42)));});
  } else if (/spring|pendulum|bowl|tube|bullet_bag/.test(v)) {
    f=crAxes("动能与势能转化","E",0,base*4); crPlot(f,"#f97316",function(q){return base*3*(1-sin(PI*q)*sin(PI*q));}); crPlot(f,"#2563eb",function(q){return base*3*sin(PI*q)*sin(PI*q);});
  } else {
    f=crAxes("分量动量与系统总动量","p",-base*1.2,base*1.2); crPlot(f,"#0f766e",function(){return base*0.5;}); crPlot(f,"#f97316",function(q){return base*(0.9-1.1*q);}); crPlot(f,"#2563eb",function(q){return base*0.5-base*(0.9-1.1*q);});
  }
  var x=map(mp3Progress(),0,1,f.left,f.right); stroke("#dc2626"); drawingContext.setLineDash([4,4]); line(x,f.top,x,f.bottom); drawingContext.setLineDash([]);
}

registerSceneRenderer("momentum_practice_model", drawMomentumPracticeScene, drawMomentumPracticeGraph);
