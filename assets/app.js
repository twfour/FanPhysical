var currentScene = "home";
var modelSourceMap = {
  doubleThrow: {
    title: "2026春季班 / 竖直上抛运动",
    text: "第7题"
  },
  pipeDrop: {
    title: "2026春季班 / 竖直上抛运动",
    text: "第10题"
  },
  threeCar: {
    title: "2026春季班 / 竖直上抛运动",
    text: "第11题"
  },
  inclineSlot: {
    title: "2026春季班 / 必修一结业测试",
    text: "第3题"
  },
  curveForce: {
    title: "暑期课时1曲线运动课上内容",
    text: "第5题"
  },
  motionCompose: {
    title: "暑期课时1曲线运动课上内容",
    text: "第4题"
  },
  riverCrossing: {
    title: "暑期课时1曲线运动课上内容 / 曲线运动课后作业",
    text: "课上第8题；课后作业 A组第3题"
  },
  riverAdvanced: {
    title: "暑期课时1曲线运动课上内容",
    text: "第9题"
  },
  rainWindow: {
    title: "曲线运动课后作业",
    text: "B组第10题"
  },
  rodConstraint: {
    title: "暑期课时1曲线运动课上内容",
    text: "第13题"
  },
  projectileBasic: {
    title: "平抛运动课上内容",
    text: "第1题、第2题基础模型"
  },
  projectileSlope: {
    title: "平抛运动课上内容",
    text: "第2题"
  },
  projectileWindow: {
    title: "平抛运动课上内容",
    text: "第6题"
  },
  volleyballServe: {
    title: "平抛运动课上内容",
    text: "第7题"
  },
  dartTarget: {
    title: "平抛运动课上内容",
    text: "第8题"
  },
  projectileNormal: {
    title: "平抛运动课上内容 / 平抛运动课后作业",
    text: "课上第3题；课后作业第8题"
  },
  projectileBounce: {
    title: "平抛运动课后作业",
    text: "第12题"
  },
  semiCircleThrow: {
    title: "平抛运动课上内容",
    text: "第5题"
  },
  bulletCylinder: {
    title: "2026暑假班 / 圆周运动",
    text: "课上第2题"
  },
  bikeGear: {
    title: "2026暑假班 / 圆周运动",
    text: "课上第3题"
  }
};

var canvasW = 1000;
var canvasH = 500;
var animRight = 570;
var graphLeft = 574;
var graphRight = 1000;
var originX = 400;
var originY = 250;

var springM = 2;
var springK = 10;
var springC = 0.1;
var springY = -110;
var springV = 0;
var springInitialY = -110;
var springData = [];
var springStable = false;

var pendulumL = 150;
var pendulumG = 9.8;
var pendulumTheta0 = 40;
var pendulumTheta = 40 * Math.PI / 180;
var pendulumOmega = 0;
var pendulumData = [];
var pendulumStable = false;
var pendulumDamping = 0.025;

var brownianT = 1;
var brownianN = 60;
var particles = [];
var trackedIndex = 0;
var trackedTrail = [];
var brownianData = [];

var pipeL = 80;
var pipeH = 260;
var pipeV0 = 70;
var pipeG = 9.8;
var pipeT = 3;
var pipeMaxT = 16;
var pipePlaying = false;

var throwV0 = 30;
var throwG = 10;
var throwDelay = 7;
var throwT = 0;
var throwMaxT = 18;
var throwPlaying = false;

var carT = 0;
var carMaxT = 8;
var carPlaying = false;
var carVa0 = 6;
var carVb0 = 8;
var carVc0 = 9;
var carGap0 = 5;
var carAa = 1;
var carAb = 7 / 5;
var carAc = 189 / 130;

var slotR = 160;
var slotr = 100;
var slotTheta1 = 30;
var slotTheta2 = 45;
var slotT = 0;
var slotMaxT = 12;
var slotPlaying = false;
var slotG = 10;

var riverWidth = 220;
var riverBoatSpeed = 6;
var riverWaterSpeed = 3;
var riverTheta = 90;
var riverT = 0;
var riverPlaying = false;

var projHeight = 160;
var projV0 = 28;
var projG = 10;
var projT = 0;
var projPlaying = false;

var slopeAngle = 30;
var slopeV0 = 32;
var slopeG = 10;
var slopeT = 0;
var slopePlaying = false;

var winL = 1.4;
var winD = 0.4;
var winH = 1.6;
var winTopDrop = 0.2;
var winV0 = 4;
var winG = 10;
var winT = 0;
var winPlaying = false;

var volleyH1 = 180;
var volleyH2 = 100;
var volleyS = 180;
var volleyV0 = 45;
var volleyT = 0;
var volleyPlaying = false;

var dartL = 180;
var dartH = 120;
var dartG = 10;
var dartDeltaTheta = 10;
var dartT = 0;
var dartPlaying = false;

var rainTrainV = 18;
var rainDropV = 24;
var rainDensity = 10;

var normalAngle = 37;
var normalV0 = 28;
var normalG = 10;
var normalT = 0;
var normalPlaying = false;

var bounceH = 4;
var bounceWallX = 6;
var bounceD = 10;
var bounceG = 10;
var bounceT = 0;
var bouncePlaying = false;

var forceNormal = 55;
var forceTangential = 28;
var forcePoint = 0.45;

var composeVx0 = 24;
var composeVy0 = 12;
var composeAx = 3;
var composeAy = -8;
var composeT = 0;
var composeMaxT = 8;
var composePlaying = false;

var advRiverWidth = 200;
var advBoatSpeed = 2;
var advWaterSpeed = 4;
var advRiverTheta = 120;
var advRiverT = 0;
var advRiverPlaying = false;

var rodAlpha = 38;
var rodVB = 24;

var semiR = 135;
var semiAlpha = 38;
var semiG = 10;

var bulletD = 150;
var bulletOmega = 3;
var bulletPhi = 65;
var bulletT = 0;
var bulletPlaying = false;

var bikeSpeed = 4;
var bikeWheelD = 0.66;
var bikeChainTeeth = 48;
var bikeFlyTeeth = 15;
var bikeGearT = 0;
var bikeGearPlaying = false;

var simTime = 0;
var lastMillis = 0;
var graphWindow = 14;

function setup() {
  var cnv = createCanvas(canvasW, canvasH);
  cnv.parent("canvas-holder");
  pixelDensity(1);
  textFont('"Noto Sans SC", "Microsoft YaHei", sans-serif');
  resetBrownian();
  updateLabels();
  switchScene(currentScene);
  lastMillis = millis();
}

function draw() {
  var now = millis();
  var dt = Math.min((now - lastMillis) / 1000, 0.033);
  lastMillis = now;
  simTime += dt;

  background(255);
  drawLayout();

  if (currentScene === "spring") {
    updateSpring(dt);
    drawAnimScene(drawSpringScene);
    drawGraph(springData, "位移 y(t)" + (springStable ? "（已稳定）" : ""), "y", "#dc2626", springStable);
  }

  if (currentScene === "pendulum") {
    updatePendulum(dt);
    drawAnimScene(drawPendulumScene);
    drawGraph(pendulumData, "角度 θ(t)" + (pendulumStable ? "（已稳定）" : ""), "θ", "#2563eb", pendulumStable);
  }

  if (currentScene === "brownian") {
    updateBrownian(dt);
    drawAnimScene(drawBrownianScene);
    drawGraph(brownianData, "追踪粒子 X 坐标", "x", "#0f766e", false);
  }

  if (currentScene === "pipeDrop") {
    updatePipeDrop(dt);
    drawAnimScene(drawPipeDropScene);
    drawPipeDropGraph();
  }

  if (currentScene === "doubleThrow") {
    updateDoubleThrow(dt);
    drawAnimScene(drawDoubleThrowScene);
    drawDoubleThrowGraph();
  }

  if (currentScene === "threeCar") {
    updateThreeCar(dt);
    drawAnimScene(drawThreeCarScene);
    drawThreeCarGraph();
  }

  if (currentScene === "inclineSlot") {
    updateInclineSlot(dt);
    drawAnimScene(drawInclineSlotScene);
    drawInclineSlotGraph();
  }

  if (currentScene === "riverCrossing") {
    updateRiver(dt);
    drawAnimScene(drawRiverScene);
    drawRiverGraph();
  }

  if (currentScene === "projectileBasic") {
    updateProjectile(dt);
    drawAnimScene(drawProjectileScene);
    drawProjectileGraph();
  }

  if (currentScene === "projectileSlope") {
    updateSlope(dt);
    drawAnimScene(drawSlopeScene);
    drawSlopeGraph();
  }

  if (currentScene === "projectileWindow") {
    updateWindow(dt);
    drawAnimScene(drawWindowScene);
    drawWindowGraph();
  }

  if (currentScene === "volleyballServe") {
    updateVolley(dt);
    drawAnimScene(drawVolleyScene);
    drawVolleyGraph();
  }

  if (currentScene === "dartTarget") {
    updateDart(dt);
    drawAnimScene(drawDartScene);
    drawDartGraph();
  }

  if (currentScene === "rainWindow") {
    drawAnimScene(drawRainScene);
    drawRainGraph();
  }

  if (currentScene === "projectileNormal") {
    updateNormal(dt);
    drawAnimScene(drawNormalScene);
    drawNormalGraph();
  }

  if (currentScene === "projectileBounce") {
    updateBounce(dt);
    drawAnimScene(drawBounceScene);
    drawBounceGraph();
  }

  if (currentScene === "curveForce") {
    drawAnimScene(drawCurveForceScene);
    drawCurveForceGraph();
  }

  if (currentScene === "motionCompose") {
    updateCompose(dt);
    drawAnimScene(drawComposeScene);
    drawComposeGraph();
  }

  if (currentScene === "riverAdvanced") {
    updateAdvRiver(dt);
    drawAnimScene(drawAdvRiverScene);
    drawAdvRiverGraph();
  }

  if (currentScene === "rodConstraint") {
    drawAnimScene(drawRodConstraintScene);
    drawRodConstraintGraph();
  }

  if (currentScene === "semiCircleThrow") {
    drawAnimScene(drawSemiCircleScene);
    drawSemiCircleGraph();
  }

  if (currentScene === "bulletCylinder") {
    updateBullet(dt);
    drawAnimScene(drawBulletScene);
    drawBulletGraph();
  }

  if (currentScene === "bikeGear") {
    updateBikeGear(dt);
    drawAnimScene(drawBikeGearScene);
    drawBikeGearGraph();
  }
}

function drawAnimScene(sceneDrawer) {
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(0, 0, animRight, canvasH);
  drawingContext.clip();
  sceneDrawer();
  drawingContext.restore();
  pop();
}

function switchScene(sceneName) {
  currentScene = sceneName;

  document.getElementById("treeHome").className = sceneName === "home" ? "tree-item active" : "tree-item";
  document.getElementById("treeDoubleThrow").className = sceneName === "doubleThrow" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treePipeDrop").className = sceneName === "pipeDrop" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeThreeCar").className = sceneName === "threeCar" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeInclineSlot").className = sceneName === "inclineSlot" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeRiverCrossing").className = sceneName === "riverCrossing" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeProjectileBasic").className = sceneName === "projectileBasic" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeProjectileSlope").className = sceneName === "projectileSlope" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeProjectileWindow").className = sceneName === "projectileWindow" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeVolleyballServe").className = sceneName === "volleyballServe" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeDartTarget").className = sceneName === "dartTarget" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeRainWindow").className = sceneName === "rainWindow" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeProjectileNormal").className = sceneName === "projectileNormal" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeProjectileBounce").className = sceneName === "projectileBounce" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeCurveForce").className = sceneName === "curveForce" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeMotionCompose").className = sceneName === "motionCompose" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeRiverAdvanced").className = sceneName === "riverAdvanced" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeRodConstraint").className = sceneName === "rodConstraint" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeSemiCircleThrow").className = sceneName === "semiCircleThrow" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeBulletCylinder").className = sceneName === "bulletCylinder" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeBikeGear").className = sceneName === "bikeGear" ? "tree-item indent active" : "tree-item indent";

  document.getElementById("homePanel").style.display = sceneName === "home" ? "block" : "none";
  document.getElementById("canvas-holder").style.display = sceneName === "home" ? "none" : "block";
  document.getElementById("springControls").style.display = sceneName === "spring" ? "grid" : "none";
  document.getElementById("pendulumControls").style.display = sceneName === "pendulum" ? "grid" : "none";
  document.getElementById("brownianControls").style.display = sceneName === "brownian" ? "grid" : "none";
  document.getElementById("doubleThrowControls").style.display = sceneName === "doubleThrow" ? "grid" : "none";
  document.getElementById("pipeDropControls").style.display = sceneName === "pipeDrop" ? "grid" : "none";
  document.getElementById("threeCarControls").style.display = sceneName === "threeCar" ? "grid" : "none";
  document.getElementById("inclineSlotControls").style.display = sceneName === "inclineSlot" ? "grid" : "none";
  document.getElementById("riverCrossingControls").style.display = sceneName === "riverCrossing" ? "grid" : "none";
  document.getElementById("projectileBasicControls").style.display = sceneName === "projectileBasic" ? "grid" : "none";
  document.getElementById("projectileSlopeControls").style.display = sceneName === "projectileSlope" ? "grid" : "none";
  document.getElementById("projectileWindowControls").style.display = sceneName === "projectileWindow" ? "grid" : "none";
  document.getElementById("volleyballServeControls").style.display = sceneName === "volleyballServe" ? "grid" : "none";
  document.getElementById("dartTargetControls").style.display = sceneName === "dartTarget" ? "grid" : "none";
  document.getElementById("rainWindowControls").style.display = sceneName === "rainWindow" ? "grid" : "none";
  document.getElementById("projectileNormalControls").style.display = sceneName === "projectileNormal" ? "grid" : "none";
  document.getElementById("projectileBounceControls").style.display = sceneName === "projectileBounce" ? "grid" : "none";
  document.getElementById("curveForceControls").style.display = sceneName === "curveForce" ? "grid" : "none";
  document.getElementById("motionComposeControls").style.display = sceneName === "motionCompose" ? "grid" : "none";
  document.getElementById("riverAdvancedControls").style.display = sceneName === "riverAdvanced" ? "grid" : "none";
  document.getElementById("rodConstraintControls").style.display = sceneName === "rodConstraint" ? "grid" : "none";
  document.getElementById("semiCircleThrowControls").style.display = sceneName === "semiCircleThrow" ? "grid" : "none";
  document.getElementById("bulletCylinderControls").style.display = sceneName === "bulletCylinder" ? "grid" : "none";
  document.getElementById("bikeGearControls").style.display = sceneName === "bikeGear" ? "grid" : "none";
  document.getElementById("doubleThrowNotes").style.display = sceneName === "doubleThrow" ? "block" : "none";
  document.getElementById("pipeDropNotes").style.display = sceneName === "pipeDrop" ? "block" : "none";
  document.getElementById("threeCarNotes").style.display = sceneName === "threeCar" ? "block" : "none";
  document.getElementById("inclineSlotNotes").style.display = sceneName === "inclineSlot" ? "block" : "none";
  document.getElementById("riverCrossingNotes").style.display = sceneName === "riverCrossing" ? "block" : "none";
  document.getElementById("projectileBasicNotes").style.display = sceneName === "projectileBasic" ? "block" : "none";
  document.getElementById("projectileSlopeNotes").style.display = sceneName === "projectileSlope" ? "block" : "none";
  document.getElementById("projectileWindowNotes").style.display = sceneName === "projectileWindow" ? "block" : "none";
  document.getElementById("volleyballServeNotes").style.display = sceneName === "volleyballServe" ? "block" : "none";
  document.getElementById("dartTargetNotes").style.display = sceneName === "dartTarget" ? "block" : "none";
  document.getElementById("rainWindowNotes").style.display = sceneName === "rainWindow" ? "block" : "none";
  document.getElementById("projectileNormalNotes").style.display = sceneName === "projectileNormal" ? "block" : "none";
  document.getElementById("projectileBounceNotes").style.display = sceneName === "projectileBounce" ? "block" : "none";
  document.getElementById("curveForceNotes").style.display = sceneName === "curveForce" ? "block" : "none";
  document.getElementById("motionComposeNotes").style.display = sceneName === "motionCompose" ? "block" : "none";
  document.getElementById("riverAdvancedNotes").style.display = sceneName === "riverAdvanced" ? "block" : "none";
  document.getElementById("rodConstraintNotes").style.display = sceneName === "rodConstraint" ? "block" : "none";
  document.getElementById("semiCircleThrowNotes").style.display = sceneName === "semiCircleThrow" ? "block" : "none";
  document.getElementById("bulletCylinderNotes").style.display = sceneName === "bulletCylinder" ? "block" : "none";
  document.getElementById("bikeGearNotes").style.display = sceneName === "bikeGear" ? "block" : "none";
  updateModelSource(sceneName);
  renderMath();
}

function renderMath() {
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise();
  }
}

function updateModelSource(sceneName) {
  var source = modelSourceMap[sceneName];
  var sourceBox = document.getElementById("modelSource");
  if (!sourceBox) {
    return;
  }
  if (!source) {
    sourceBox.style.display = "none";
    return;
  }
  document.getElementById("modelSourceTitle").innerText = source.title;
  document.getElementById("modelSourceText").innerText = source.text;
  sourceBox.style.display = "block";
}

function updateLabels() {
  if (pipeH <= pipeL) {
    pipeH = pipeL + 20;
    if (pipeH > 420) {
      pipeH = 420;
      pipeL = 160;
    }
  }

  document.getElementById("springMVal").innerText = springM.toFixed(1);
  document.getElementById("springKVal").innerText = springK.toFixed(0);
  document.getElementById("springCVal").innerText = springC.toFixed(2);
  document.getElementById("pendulumLVal").innerText = pendulumL.toFixed(0);
  document.getElementById("pendulumGVal").innerText = pendulumG.toFixed(1);
  document.getElementById("pendulumTheta0Val").innerText = pendulumTheta0.toFixed(0) + "°";
  document.getElementById("brownianTVal").innerText = brownianT.toFixed(1);
  document.getElementById("brownianNVal").innerText = brownianN.toFixed(0);
  document.getElementById("pipeLVal").innerText = pipeL.toFixed(0);
  document.getElementById("pipeHVal").innerText = pipeH.toFixed(0);
  document.getElementById("pipeV0Val").innerText = pipeV0.toFixed(0);
  document.getElementById("pipeGVal").innerText = pipeG.toFixed(1);
  document.getElementById("pipeTVal").innerText = pipeT.toFixed(1) + "s";
  document.getElementById("pipeL").value = pipeL.toFixed(0);
  document.getElementById("pipeH").value = pipeH.toFixed(0);
  document.getElementById("pipeT").value = pipeT.toFixed(1);
  document.getElementById("pipePlayBtn").innerText = pipePlaying ? "暂停" : "播放";
  document.getElementById("throwV0Val").innerText = throwV0.toFixed(0);
  document.getElementById("throwGVal").innerText = throwG.toFixed(1);
  document.getElementById("throwDelayVal").innerText = throwDelay.toFixed(1) + "s";
  document.getElementById("throwTVal").innerText = throwT.toFixed(1) + "s";
  document.getElementById("throwT").value = throwT.toFixed(1);
  document.getElementById("throwPlayBtn").innerText = throwPlaying ? "暂停" : "播放";
  document.getElementById("carTVal").innerText = carT.toFixed(1) + "s";
  document.getElementById("carT").value = carT.toFixed(1);
  document.getElementById("carPlayBtn").innerText = carPlaying ? "暂停" : "播放";
  if (slotR <= slotr) {
    slotr = slotR - 10;
    if (slotr < 60) {
      slotr = 60;
      slotR = 70;
    }
  }
  document.getElementById("slotRVal").innerText = slotR.toFixed(0);
  document.getElementById("slotrVal").innerText = slotr.toFixed(0);
  document.getElementById("slotTheta1Val").innerText = slotTheta1.toFixed(0) + "°";
  document.getElementById("slotTheta2Val").innerText = slotTheta2.toFixed(0) + "°";
  document.getElementById("slotTVal").innerText = slotT.toFixed(1) + "s";
  document.getElementById("slotR").value = slotR.toFixed(0);
  document.getElementById("slotr").value = slotr.toFixed(0);
  document.getElementById("slotT").value = slotT.toFixed(1);
  document.getElementById("slotPlayBtn").innerText = slotPlaying ? "暂停" : "播放";
  if (riverBoatSpeed * Math.sin(riverTheta * Math.PI / 180) < 0.25) {
    riverT = 0;
    riverPlaying = false;
  }
  riverT = Math.min(riverT, riverArriveTime());
  document.getElementById("riverWidthVal").innerText = riverWidth.toFixed(0);
  document.getElementById("riverBoatSpeedVal").innerText = riverBoatSpeed.toFixed(1);
  document.getElementById("riverWaterSpeedVal").innerText = riverWaterSpeed.toFixed(1);
  document.getElementById("riverThetaVal").innerText = riverTheta.toFixed(0) + "°";
  document.getElementById("riverTVal").innerText = riverT.toFixed(1) + "s";
  document.getElementById("riverT").max = Math.max(10, riverArriveTime()).toFixed(1);
  document.getElementById("riverT").value = riverT.toFixed(1);
  document.getElementById("riverPlayBtn").innerText = riverPlaying ? "暂停" : "播放";
  projT = Math.min(projT, projectileFlightTime());
  document.getElementById("projHeightVal").innerText = projHeight.toFixed(0);
  document.getElementById("projV0Val").innerText = projV0.toFixed(0);
  document.getElementById("projGVal").innerText = projG.toFixed(1);
  document.getElementById("projTVal").innerText = projT.toFixed(2) + "s";
  document.getElementById("projT").max = Math.max(1, projectileFlightTime()).toFixed(2);
  document.getElementById("projT").value = projT.toFixed(2);
  document.getElementById("projPlayBtn").innerText = projPlaying ? "暂停" : "播放";
  slopeT = Math.min(slopeT, slopeMaxTime());
  document.getElementById("slopeAngleVal").innerText = slopeAngle.toFixed(0) + "°";
  document.getElementById("slopeV0Val").innerText = slopeV0.toFixed(0);
  document.getElementById("slopeGVal").innerText = slopeG.toFixed(1);
  document.getElementById("slopeTVal").innerText = slopeT.toFixed(2) + "s";
  document.getElementById("slopeT").max = Math.max(1, slopeMaxTime()).toFixed(2);
  document.getElementById("slopeT").value = slopeT.toFixed(2);
  document.getElementById("slopePlayBtn").innerText = slopePlaying ? "暂停" : "播放";
  winT = Math.min(winT, windowEndTime());
  document.getElementById("winLVal").innerText = winL.toFixed(1);
  document.getElementById("winDVal").innerText = winD.toFixed(1);
  document.getElementById("winHVal").innerText = winH.toFixed(1);
  document.getElementById("winTopDropVal").innerText = winTopDrop.toFixed(2);
  document.getElementById("winV0Val").innerText = winV0.toFixed(1);
  document.getElementById("winTVal").innerText = winT.toFixed(2) + "s";
  document.getElementById("winT").max = Math.max(0.8, windowEndTime()).toFixed(2);
  document.getElementById("winT").value = winT.toFixed(2);
  document.getElementById("winPlayBtn").innerText = winPlaying ? "暂停" : "播放";
  volleyT = Math.min(volleyT, volleyFlightTime());
  document.getElementById("volleyH1Val").innerText = volleyH1.toFixed(0);
  document.getElementById("volleyH2Val").innerText = volleyH2.toFixed(0);
  document.getElementById("volleySVal").innerText = volleyS.toFixed(0);
  document.getElementById("volleyV0Val").innerText = volleyV0.toFixed(0);
  document.getElementById("volleyTVal").innerText = volleyT.toFixed(2) + "s";
  document.getElementById("volleyT").max = Math.max(1, volleyFlightTime()).toFixed(2);
  document.getElementById("volleyT").value = volleyT.toFixed(2);
  document.getElementById("volleyPlayBtn").innerText = volleyPlaying ? "暂停" : "播放";
  dartT = Math.min(dartT, dartFlightTime());
  document.getElementById("dartLVal").innerText = dartL.toFixed(0);
  document.getElementById("dartHVal").innerText = dartH.toFixed(0);
  document.getElementById("dartGVal").innerText = dartG.toFixed(1);
  document.getElementById("dartDeltaThetaVal").innerText = dartDeltaTheta.toFixed(0) + "°";
  document.getElementById("dartTVal").innerText = dartT.toFixed(2) + "s";
  document.getElementById("dartT").max = Math.max(1, dartFlightTime()).toFixed(2);
  document.getElementById("dartT").value = dartT.toFixed(2);
  document.getElementById("dartPlayBtn").innerText = dartPlaying ? "暂停" : "播放";
  document.getElementById("rainTrainVVal").innerText = rainTrainV.toFixed(0);
  document.getElementById("rainDropVVal").innerText = rainDropV.toFixed(0);
  document.getElementById("rainDensityVal").innerText = rainDensity.toFixed(0);
  normalT = Math.min(normalT, normalSceneMaxTime());
  document.getElementById("normalAngleVal").innerText = normalAngle.toFixed(0) + "°";
  document.getElementById("normalV0Val").innerText = normalV0.toFixed(0);
  document.getElementById("normalGVal").innerText = normalG.toFixed(1);
  document.getElementById("normalTVal").innerText = normalT.toFixed(2) + "s";
  document.getElementById("normalT").max = Math.max(1, normalSceneMaxTime()).toFixed(2);
  document.getElementById("normalT").value = normalT.toFixed(2);
  document.getElementById("normalPlayBtn").innerText = normalPlaying ? "暂停" : "播放";
  if (bounceD <= 2.2) {
    bounceD = 2.2;
  }
  bounceWallX = bounceD / 2;
  bounceT = Math.min(bounceT, bounceTotalTime());
  document.getElementById("bounceHVal").innerText = bounceH.toFixed(1);
  document.getElementById("bounceWallXVal").innerText = bounceWallX.toFixed(1);
  document.getElementById("bounceDVal").innerText = bounceD.toFixed(1);
  document.getElementById("bounceTVal").innerText = bounceT.toFixed(2) + "s";
  document.getElementById("bounceD").value = bounceD.toFixed(1);
  document.getElementById("bounceWallX").value = bounceWallX.toFixed(1);
  document.getElementById("bounceT").max = Math.max(1, bounceTotalTime()).toFixed(2);
  document.getElementById("bounceT").value = bounceT.toFixed(2);
  document.getElementById("bouncePlayBtn").innerText = bouncePlaying ? "暂停" : "播放";
  document.getElementById("forceNormalVal").innerText = forceNormal.toFixed(0);
  document.getElementById("forceTangentialVal").innerText = forceTangential.toFixed(0);
  document.getElementById("forcePointVal").innerText = (forcePoint * 100).toFixed(0) + "%";
  composeT = Math.min(composeT, composeMaxT);
  document.getElementById("composeVx0Val").innerText = composeVx0.toFixed(0);
  document.getElementById("composeVy0Val").innerText = composeVy0.toFixed(0);
  document.getElementById("composeAxVal").innerText = composeAx.toFixed(1);
  document.getElementById("composeAyVal").innerText = composeAy.toFixed(1);
  document.getElementById("composeTVal").innerText = composeT.toFixed(2) + "s";
  document.getElementById("composeT").value = composeT.toFixed(2);
  document.getElementById("composePlayBtn").innerText = composePlaying ? "暂停" : "播放";
  if (advBoatSpeed * Math.sin(advRiverTheta * Math.PI / 180) < 0.25) {
    advRiverT = 0;
    advRiverPlaying = false;
  }
  advRiverT = Math.min(advRiverT, advRiverArriveTime());
  document.getElementById("advRiverWidthVal").innerText = advRiverWidth.toFixed(0);
  document.getElementById("advBoatSpeedVal").innerText = advBoatSpeed.toFixed(1);
  document.getElementById("advWaterSpeedVal").innerText = advWaterSpeed.toFixed(1);
  document.getElementById("advRiverThetaVal").innerText = advRiverTheta.toFixed(0) + "°";
  document.getElementById("advRiverTVal").innerText = advRiverT.toFixed(1) + "s";
  document.getElementById("advRiverT").max = Math.max(10, advRiverArriveTime()).toFixed(1);
  document.getElementById("advRiverT").value = advRiverT.toFixed(1);
  document.getElementById("advRiverPlayBtn").innerText = advRiverPlaying ? "暂停" : "播放";
  document.getElementById("rodAlphaVal").innerText = rodAlpha.toFixed(0) + "°";
  document.getElementById("rodVBVal").innerText = rodVB.toFixed(0);
  document.getElementById("semiRVal").innerText = semiR.toFixed(0);
  document.getElementById("semiAlphaVal").innerText = semiAlpha.toFixed(0) + "°";
  document.getElementById("semiGVal").innerText = semiG.toFixed(1);
  bulletT = Math.min(bulletT, bulletTransitTime());
  document.getElementById("bulletDVal").innerText = bulletD.toFixed(0);
  document.getElementById("bulletOmegaVal").innerText = bulletOmega.toFixed(1);
  document.getElementById("bulletPhiVal").innerText = bulletPhi.toFixed(0) + "°";
  document.getElementById("bulletTVal").innerText = bulletT.toFixed(2) + "s";
  document.getElementById("bulletT").max = Math.max(0.2, bulletTransitTime()).toFixed(2);
  document.getElementById("bulletT").value = bulletT.toFixed(2);
  document.getElementById("bulletPlayBtn").innerText = bulletPlaying ? "暂停" : "播放";
  bikeGearT = Math.min(bikeGearT, 6);
  document.getElementById("bikeSpeedVal").innerText = bikeSpeed.toFixed(1);
  document.getElementById("bikeWheelDVal").innerText = bikeWheelD.toFixed(2) + "m";
  document.getElementById("bikeChainTeethVal").innerText = bikeChainTeeth.toFixed(0);
  document.getElementById("bikeFlyTeethVal").innerText = bikeFlyTeeth.toFixed(0);
  document.getElementById("bikeGearTVal").innerText = bikeGearT.toFixed(2) + "s";
  document.getElementById("bikeGearT").value = bikeGearT.toFixed(2);
  document.getElementById("bikeChainTeeth").value = bikeChainTeeth.toFixed(0);
  document.getElementById("bikeFlyTeeth").value = bikeFlyTeeth.toFixed(0);
  document.getElementById("bikeGearPlayBtn").innerText = bikeGearPlaying ? "暂停" : "播放";
}

function drawLayout() {
  stroke("#d7dce5");
  strokeWeight(1);
  line(animRight, 0, animRight, canvasH);
  line(graphLeft, 0, graphLeft, canvasH);

  noStroke();
  fill("#f6f8fb");
  rect(graphLeft, 0, graphRight - graphLeft, canvasH);

  noStroke();
  fill("#5b6472");
  textSize(12);
  textAlign(LEFT, TOP);
  text("动画区原点 (400,250)，y 轴向上为正", 18, 16);
}
