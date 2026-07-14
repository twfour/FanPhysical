var currentScene = "home";
var mathRenderedSceneMap = {};
var mathRenderingSceneMap = {};
var favoriteProblemStorageKey = "fanphysics:favoritedProblems";
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
  dualConstraintCircle: {
    title: "暑假课时5 曲线运动习题训练",
    text: "第17题"
  },
  handRopeBreak: {
    title: "暑假课时5 曲线运动习题训练",
    text: "第18题"
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
  },
  pileDriver: {
    title: "2026暑假班 / 圆周运动",
    text: "第9题"
  }
};

var knowledgePointMap = {
  doubleThrow: ["竖直上抛", "相对运动", "相遇条件"],
  pipeDrop: ["相对运动", "自由落体", "同加速度模型"],
  threeCar: ["匀减速", "追及相遇", "临界条件"],
  inclineSlot: ["斜面运动", "圆几何", "等时性"],
  curveForce: ["曲线运动", "受力分析", "切向与法向"],
  motionCompose: ["运动合成", "图像读取", "牛顿第二定律"],
  riverCrossing: ["速度合成", "渡河模型", "分运动"],
  waterfallCrossing: ["速度合成", "临界轨迹", "最小船速"],
  riverAdvanced: ["速度圆", "最短位移", "矢量合成"],
  rainWindow: ["相对速度", "参考系", "速度分解"],
  rodConstraint: ["杆约束", "速度投影", "关联速度"],
  dualConstraintCircle: ["圆周运动", "双约束", "向心力"],
  handRopeBreak: ["圆锥摆", "断绳抛体", "最值"],
  projectileBasic: ["平抛运动", "分解运动", "运动学公式"],
  projectileSlope: ["平抛运动", "斜面几何", "末速度方向"],
  projectileWindow: ["平抛运动", "区间判断", "厚墙模型"],
  volleyballServe: ["平抛运动", "临界过网", "落点判断"],
  dartTarget: ["斜抛运动", "命中条件", "速度方向"],
  projectileNormal: ["平抛运动", "垂直斜面", "速度分解"],
  projectileBounce: ["平抛运动", "碰撞反弹", "分段运动"],
  semiCircleThrow: ["平抛运动", "圆弧坐标", "速度比"],
  bulletCylinder: ["圆周运动", "角速度", "穿筒时间"],
  bikeGear: ["圆周运动", "链传动", "角速度"],
  pileDriver: ["圆周运动", "向心力", "超重与失重"],
  bowlDoubleBall: ["圆周运动", "圆锥摆", "半球碗约束"]
};

var problemDataMap = {};
var problemDataList = [];
var promotedProblemChapterMap = {
  "圆周运动": true,
  "圆周运动日常": true,
  "万有引力与宇宙航行": true,
  "行星运动与变轨等问题": true,
  "功和功率": true,
  "动能定理": true
};
var legacySceneMap = {
  spring: true,
  pendulum: true,
  brownian: true,
  doubleThrow: true,
  pipeDrop: true,
  threeCar: true,
  inclineSlot: true,
  riverCrossing: true,
  waterfallCrossing: true,
  projectileBasic: true,
  projectileSlope: true,
  projectileWindow: true,
  volleyballServe: true,
  dartTarget: true,
  rainWindow: true,
  projectileNormal: true,
  projectileBounce: true,
  curveForce: true,
  motionCompose: true,
  riverAdvanced: true,
  rodConstraint: true,
  dualConstraintCircle: true,
  handRopeBreak: true,
  semiCircleThrow: true,
  bulletCylinder: true,
  bikeGear: true,
  pileDriver: true,
  bowlDoubleBall: true
};
var jsonAnimationState = {};

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

var waterfallWidth = 30;
var waterfallDownstream = 40;
var waterfallWaterSpeed = 10;
var waterfallBoatSpeed = 6;
var waterfallTheta = 126.9;
var waterfallT = 0;
var waterfallPlaying = false;

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

var dualOmega = 1;
var dualT = 0;
var dualPlaying = false;

var handAlpha = 45;
var handLengthRatio = 3;
var handT = 0;
var handPlaying = false;

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

var pileM = 6;
var pilem = 2;
var pileL = 1.2;
var pileOmega = 4;
var pileG = 10;
var pileT = 0;
var pilePlaying = false;

var bowlR = 0.10;
var bowlThetaA = 53;
var bowlThetaB = 37;
var bowlG = 10;
var bowlT = 0;
var bowlPlaying = false;

var simTime = 0;
var lastMillis = 0;
var graphWindow = 14;

function setup() {
  pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
  var cnv = createCanvas(canvasW, canvasH);
  cnv.parent("canvas-holder");
  textFont('"Noto Sans SC", "Microsoft YaHei", sans-serif');
  if (drawingContext) {
    drawingContext.fontKerning = "normal";
    drawingContext.textRendering = "geometricPrecision";
  }
  loadProblemData().then(function () {
    renderProblemDataNotes();
    enhanceProblemNotes();
    renderFavoriteHome();
    switchScene(currentScene);
  });
  enhanceProblemNotes();
  renderFavoriteHome();
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

  if (currentScene === "waterfallCrossing") {
    updateWaterfall(dt);
    drawAnimScene(drawWaterfallScene);
    drawWaterfallGraph();
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

  if (currentScene === "dualConstraintCircle") {
    updateDualConstraint(dt);
    drawAnimScene(drawDualConstraintScene);
    drawDualConstraintGraph();
  }

  if (currentScene === "handRopeBreak") {
    updateHandRope(dt);
    drawAnimScene(drawHandRopeScene);
    drawHandRopeGraph();
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

  if (currentScene === "pileDriver") {
    updatePile(dt);
    drawAnimScene(drawPileScene);
    drawPileGraph();
  }

  if (currentScene === "bowlDoubleBall") {
    updateBowl(dt);
    drawAnimScene(drawBowlScene);
    drawBowlGraph();
  }

  if (isJsonProblemScene(currentScene)) {
    updateJsonAnimation(dt);
    drawJsonAnimationScene();
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
  document.getElementById("treeWaterfallCrossing").className = sceneName === "waterfallCrossing" ? "tree-item indent active" : "tree-item indent";
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
  document.getElementById("treeDualConstraintCircle").className = sceneName === "dualConstraintCircle" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeHandRopeBreak").className = sceneName === "handRopeBreak" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeSemiCircleThrow").className = sceneName === "semiCircleThrow" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeBulletCylinder").className = sceneName === "bulletCylinder" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeBikeGear").className = sceneName === "bikeGear" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treePileDriver").className = sceneName === "pileDriver" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeBowlDoubleBall").className = sceneName === "bowlDoubleBall" ? "tree-item indent active" : "tree-item indent";
  document.querySelectorAll(".tree-item[data-scene]").forEach(function (item) {
    item.className = item.dataset.scene === sceneName ? "tree-item indent active" : "tree-item indent";
  });

  document.getElementById("homePanel").style.display = sceneName === "home" ? "block" : "none";
  if (sceneName === "home") {
    renderFavoriteHome();
  }
  document.getElementById("canvas-holder").style.display = shouldShowCanvas(sceneName) ? "block" : "none";
  document.getElementById("springControls").style.display = sceneName === "spring" ? "grid" : "none";
  document.getElementById("pendulumControls").style.display = sceneName === "pendulum" ? "grid" : "none";
  document.getElementById("brownianControls").style.display = sceneName === "brownian" ? "grid" : "none";
  document.getElementById("doubleThrowControls").style.display = sceneName === "doubleThrow" ? "grid" : "none";
  document.getElementById("pipeDropControls").style.display = sceneName === "pipeDrop" ? "grid" : "none";
  document.getElementById("threeCarControls").style.display = sceneName === "threeCar" ? "grid" : "none";
  document.getElementById("inclineSlotControls").style.display = sceneName === "inclineSlot" ? "grid" : "none";
  document.getElementById("riverCrossingControls").style.display = sceneName === "riverCrossing" ? "grid" : "none";
  document.getElementById("waterfallCrossingControls").style.display = sceneName === "waterfallCrossing" ? "grid" : "none";
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
  document.getElementById("dualConstraintCircleControls").style.display = sceneName === "dualConstraintCircle" ? "grid" : "none";
  document.getElementById("handRopeBreakControls").style.display = sceneName === "handRopeBreak" ? "grid" : "none";
  document.getElementById("semiCircleThrowControls").style.display = sceneName === "semiCircleThrow" ? "grid" : "none";
  document.getElementById("bulletCylinderControls").style.display = sceneName === "bulletCylinder" ? "grid" : "none";
  document.getElementById("bikeGearControls").style.display = sceneName === "bikeGear" ? "grid" : "none";
  document.getElementById("pileDriverControls").style.display = sceneName === "pileDriver" ? "grid" : "none";
  document.getElementById("bowlDoubleBallControls").style.display = sceneName === "bowlDoubleBall" ? "grid" : "none";
  renderJsonAnimationControls(sceneName);
  document.getElementById("doubleThrowNotes").style.display = sceneName === "doubleThrow" ? "block" : "none";
  document.getElementById("pipeDropNotes").style.display = sceneName === "pipeDrop" ? "block" : "none";
  document.getElementById("threeCarNotes").style.display = sceneName === "threeCar" ? "block" : "none";
  document.getElementById("inclineSlotNotes").style.display = sceneName === "inclineSlot" ? "block" : "none";
  document.getElementById("riverCrossingNotes").style.display = sceneName === "riverCrossing" ? "block" : "none";
  document.getElementById("waterfallCrossingNotes").style.display = sceneName === "waterfallCrossing" ? "block" : "none";
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
  document.getElementById("dualConstraintCircleNotes").style.display = sceneName === "dualConstraintCircle" ? "block" : "none";
  document.getElementById("handRopeBreakNotes").style.display = sceneName === "handRopeBreak" ? "block" : "none";
  document.getElementById("semiCircleThrowNotes").style.display = sceneName === "semiCircleThrow" ? "block" : "none";
  document.getElementById("bulletCylinderNotes").style.display = sceneName === "bulletCylinder" ? "block" : "none";
  document.getElementById("bikeGearNotes").style.display = sceneName === "bikeGear" ? "block" : "none";
  document.getElementById("pileDriverNotes").style.display = sceneName === "pileDriver" ? "block" : "none";
  document.getElementById("bowlDoubleBallNotes").style.display = sceneName === "bowlDoubleBall" ? "block" : "none";
  document.querySelectorAll(".problem-notes").forEach(function (note) {
    note.style.display = note.id === sceneName + "Notes" ? "block" : "none";
  });
  updateModelSource(sceneName);
  scheduleSceneMath(sceneName);
}

async function loadProblemData() {
  try {
    var response = await fetch("/data/problems/index.json", { cache: "no-store" });
    if (!response.ok) {
      return;
    }
    var index = await response.json();
    var items = Array.isArray(index.problems) ? index.problems : [];
    var loaded = await Promise.all(items.map(async function (item) {
      var itemResponse = await fetch("/data/problems/" + item.file, { cache: "no-store" });
      if (!itemResponse.ok) {
        return null;
      }
      return itemResponse.json();
    }));
    problemDataList = loaded.filter(Boolean);
    problemDataList.forEach(function (problem) {
      problem.animation = normalizeProblemAnimation(problem);
      problemDataMap[problem.id] = problem;
      if (problem.knowledge) {
        knowledgePointMap[problem.id] = problem.knowledge;
      }
      if (!isPromotedProblem(problem)) {
        modelSourceMap[problem.id] = normalizeProblemSource(problem);
      }
    });
  } catch (error) {
    console.warn("Problem JSON load failed", error);
  }
}

function renderProblemDataNotes() {
  problemDataList.forEach(function (problem) {
    if (!problem || !problem.id) {
      return;
    }
    var note = document.getElementById(problem.id + "Notes");
    var modelSource = document.getElementById("modelSource");
    if (!note) {
      note = document.createElement("div");
      note.id = problem.id + "Notes";
      note.className = "problem-notes";
      if (modelSource && modelSource.parentNode) {
        modelSource.parentNode.insertBefore(note, modelSource);
      }
    }
    note.dataset.problemJson = "1";
    note.innerHTML = "";
    var grid = document.createElement("div");
    grid.className = "problem-notes-grid";
    note.appendChild(grid);

    grid.appendChild(createProblemQuestionBlock(problem));
    var analysisBlock = createProblemAnalysisBlock(problem);
    analysisBlock.dataset.analysisBlock = "1";
    grid.appendChild(analysisBlock);
    var practiceBlock = createProblemPracticeBlock(problem);
    if (practiceBlock) {
      grid.appendChild(practiceBlock);
    }
    if (problem.summary && !problem.analysis) {
      grid.appendChild(createProblemNoteBlock("一句话总结", problem.summary.title || "总结", problem.summary.content || ""));
    }
  });
}

function createProblemQuestionBlock(problem) {
  var options = Array.isArray(problem.options) ? problem.options : [];
  var block = createProblemNoteBlock("题目", problem.title, problem.question || "");
  appendProblemOptions(block, options);
  appendProblemImages(block, problem.images);
  return block;
}

function formatProblemOption(option) {
  if (typeof option === "string") {
    return option.replace(/^\s*[-*]\s*/, "").replace(/^\s*([A-D])[．、]\s*/, "$1. ");
  }
  if (option && typeof option === "object") {
    var label = option.label ? String(option.label).replace(/[．、.：:]+$/, "") : "";
    var text = option.text || option.content || "";
    return (label ? label + ". " : "") + text;
  }
  return String(option || "");
}

function appendProblemOptions(block, options) {
  if (!block || !Array.isArray(options) || !options.length) {
    return;
  }
  var optionWrap = document.createElement("div");
  optionWrap.className = "problem-options";
  options.forEach(function (option) {
    var optionLine = document.createElement("p");
    optionLine.className = "problem-option";
    optionLine.innerHTML = markdownLiteInlineToHtml(formatProblemOption(option));
    optionWrap.appendChild(optionLine);
  });
  block.appendChild(optionWrap);
}

function appendProblemImages(block, images) {
  if (!block || !Array.isArray(images) || !images.length) {
    return;
  }
  var gallery = document.createElement("div");
  gallery.className = "problem-image-gallery";
  images.forEach(function (image) {
    if (!image || !image.src) {
      return;
    }
    var figure = document.createElement("figure");
    figure.className = "problem-image-figure";
    var img = document.createElement("img");
    img.src = "/" + String(image.src).replace(/^\/+/, "");
    img.alt = image.alt || image.caption || "题图";
    img.loading = "lazy";
    figure.appendChild(img);
    if (image.caption) {
      var caption = document.createElement("figcaption");
      caption.innerText = image.caption;
      figure.appendChild(caption);
    }
    gallery.appendChild(figure);
  });
  if (gallery.children.length) {
    block.appendChild(gallery);
  }
}

function createProblemAnalysisBlock(problem) {
  var block = createProblemNoteBlock("解析", (problem.analysis && problem.analysis.title) || "分步解析", "");
  var steps = Array.isArray(problem.steps) ? problem.steps : [];
  var content = problem.analysis && problem.analysis.content ? problem.analysis.content.trim() : "";
  if (content && !steps.length) {
    appendMarkdownChildren(block, content);
    return block;
  }
  if (steps.length) {
    steps.forEach(function (step, index) {
      var stepWrap = document.createElement("div");
      stepWrap.className = "analysis-step";
      stepWrap.dataset.stepIndex = String(index);
      var title = document.createElement("h3");
      title.innerText = "步骤 " + (index + 1) + "：" + (step.title || "分析");
      stepWrap.appendChild(title);
      appendMarkdownChildren(stepWrap, step.content || "");
      block.appendChild(stepWrap);
    });
    return block;
  }
  appendMarkdownChildren(block, content || (problem.summary && problem.summary.content) || "这道题的解析还需要补充。");
  return block;
}

function createProblemPracticeBlock(problem) {
  var practice = problem.practice || problem.similarProblem || null;
  if (!practice) {
    return null;
  }
  var block = createProblemNoteBlock("近似题", practice.title || "同模型练习", practice.question || "");
  if (practice.answer) {
    var answerDetails = document.createElement("details");
    var answerSummary = document.createElement("summary");
    answerSummary.innerText = "近似题答案";
    answerDetails.appendChild(answerSummary);
    appendMarkdownChildren(answerDetails, practice.answer);
    block.appendChild(answerDetails);
  }
  if (practice.thinking || practice.solutionIdea) {
    var thinkingDetails = document.createElement("details");
    var thinkingSummary = document.createElement("summary");
    thinkingSummary.innerText = "近似题解题思路";
    thinkingDetails.appendChild(thinkingSummary);
    appendMarkdownChildren(thinkingDetails, practice.thinking || practice.solutionIdea);
    block.appendChild(thinkingDetails);
  }
  return block;
}

function appendMarkdownChildren(parent, content) {
  var contentWrap = document.createElement("div");
  contentWrap.innerHTML = markdownLiteToHtml(content || "");
  Array.prototype.slice.call(contentWrap.children).forEach(function (child) {
    parent.appendChild(child);
  });
}

function normalizeProblemSource(problem) {
  var source = problem.source || {};
  var title = source.title || problem.chapter || "题目来源";
  var text = source.text || source.page || "";
  var imageLike = /(^|\/)(IMG_|image|photo)|\.(jpg|jpeg|png|webp|bmp|gif)$/i.test(text);
  if (!title || title === "图片 OCR 导入" || title === "OCR 文本导入") {
    title = problem.chapter || "题目来源";
  }
  if (!text || imageLike) {
    text = source.page || "来源待校对";
  }
  return { title: title, text: text };
}

function isPromotedProblem(problem) {
  return Boolean(problem && promotedProblemChapterMap[problem.chapter || ""]);
}

function toPascalId(value) {
  return String(value || "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map(function (part) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
}

function createProblemNoteBlock(kicker, title, content) {
  var section = document.createElement("section");
  section.className = "problem-note-block";
  var kickerEl = document.createElement("p");
  kickerEl.className = "problem-note-kicker";
  kickerEl.innerText = kicker;
  var titleEl = document.createElement("h2");
  titleEl.innerText = title || "";
  section.appendChild(kickerEl);
  section.appendChild(titleEl);
  var contentWrap = document.createElement("div");
  contentWrap.innerHTML = markdownLiteToHtml(content || "");
  Array.prototype.slice.call(contentWrap.children).forEach(function (child) {
    section.appendChild(child);
  });
  return section;
}

function readFavoriteProblems() {
  try {
    return JSON.parse(localStorage.getItem(favoriteProblemStorageKey) || "{}") || {};
  } catch (error) {
    return {};
  }
}

function writeFavoriteProblems(favorites) {
  try {
    localStorage.setItem(favoriteProblemStorageKey, JSON.stringify(favorites || {}));
  } catch (error) {
    // localStorage can fail in private or file contexts; the button still works for the current render.
  }
}

function getFavoriteProblemKey(sceneName) {
  return "scene:" + String(sceneName || "unknown");
}

function isFavoriteProblem(sceneName) {
  var favorites = readFavoriteProblems();
  return Boolean(favorites[getFavoriteProblemKey(sceneName)]);
}

function setFavoriteProblem(sceneName, title, active) {
  var favorites = readFavoriteProblems();
  var key = getFavoriteProblemKey(sceneName);
  if (active) {
    var catalogItem = findSceneCatalogItem(sceneName);
    favorites[key] = {
      scene: sceneName,
      title: (catalogItem && catalogItem.title) || title || sceneName,
      path: (catalogItem && catalogItem.path) || "",
      savedAt: new Date().toISOString()
    };
  } else {
    delete favorites[key];
  }
  writeFavoriteProblems(favorites);
  renderFavoriteHome();
}

function updateFavoriteButton(button, active) {
  button.classList.toggle("is-favorite", active);
  button.setAttribute("aria-pressed", active ? "true" : "false");
  button.innerText = active ? "♥" : "♡";
  button.title = active ? "取消收藏这道题" : "收藏这道题";
}

function ensureFavoriteButton(block, sceneName) {
  if (!block || block.querySelector(".favorite-toggle")) {
    return;
  }
  var kicker = block.querySelector(".problem-note-kicker");
  if (!kicker) {
    return;
  }
  var titleEl = block.querySelector("h2");
  var title = titleEl ? titleEl.innerText.trim() : sceneName;
  var button = document.createElement("button");
  button.type = "button";
  button.className = "favorite-toggle";
  button.setAttribute("aria-label", "收藏题目");
  updateFavoriteButton(button, isFavoriteProblem(sceneName));
  button.onclick = function (event) {
    event.preventDefault();
    event.stopPropagation();
    var active = !button.classList.contains("is-favorite");
    setFavoriteProblem(sceneName, title, active);
    updateFavoriteButton(button, active);
  };
  block.classList.add("has-favorite");
  kicker.appendChild(button);
}

function getSceneFromElement(element) {
  if (!element) {
    return "";
  }
  if (element.dataset && element.dataset.scene) {
    return element.dataset.scene;
  }
  var onclick = element.getAttribute("onclick") || "";
  var match = onclick.match(/switchScene\('([^']+)'\)/);
  return match ? match[1] : "";
}

function getScenePathFromElement(element) {
  var parts = [];
  var parent = element ? element.parentElement : null;
  while (parent) {
    if (parent.tagName === "DETAILS") {
      var summary = getDirectSummary(parent);
      if (summary) {
        parts.unshift(summary.textContent.trim());
      }
    }
    parent = parent.parentElement;
  }
  return parts.join(" / ");
}

function getDirectSummary(detailsElement) {
  if (!detailsElement || !detailsElement.children) {
    return null;
  }
  for (var i = 0; i < detailsElement.children.length; i += 1) {
    if (detailsElement.children[i].tagName === "SUMMARY") {
      return detailsElement.children[i];
    }
  }
  return null;
}

function getSceneCatalog() {
  var catalog = [];
  var seen = {};
  document.querySelectorAll(".sidebar .tree-item").forEach(function (item) {
    var sceneName = getSceneFromElement(item);
    if (!sceneName || sceneName === "home" || seen[sceneName]) {
      return;
    }
    seen[sceneName] = true;
    catalog.push({
      scene: sceneName,
      title: item.textContent.trim(),
      path: getScenePathFromElement(item)
    });
  });
  return catalog;
}

function findSceneCatalogItem(sceneName) {
  var catalog = getSceneCatalog();
  for (var i = 0; i < catalog.length; i += 1) {
    if (catalog[i].scene === sceneName) {
      return catalog[i];
    }
  }
  return null;
}

function stripProblemTitlePrefix(title) {
  return String(title || "").replace(/^(例|课上|第|补充|A|B|C|单)?\d+[：:-]\s*/, "").trim();
}

function getFavoriteSceneTitle(sceneName, catalogItem, favorite) {
  if (catalogItem && catalogItem.title) {
    return catalogItem.title;
  }
  var problem = problemDataMap[sceneName] || {};
  if (problem.title) {
    return stripProblemTitlePrefix(problem.title) || problem.title;
  }
  var note = document.getElementById(sceneName + "Notes");
  var heading = note ? note.querySelector(".problem-note-block h2") : null;
  if (heading && heading.innerText.trim()) {
    return stripProblemTitlePrefix(heading.innerText.trim()) || heading.innerText.trim();
  }
  if (favorite && favorite.title && !/^([a-z]+_|\w*[A-Z]\w*)/.test(favorite.title)) {
    return favorite.title;
  }
  return "收藏模型题";
}

function getFavoriteScenePath(sceneName, catalogItem, favorite) {
  if (catalogItem && catalogItem.path) {
    return catalogItem.path;
  }
  var problem = problemDataMap[sceneName] || {};
  if (problem.chapter === "圆周运动") {
    return "2026暑假班 / 圆周运动";
  }
  if (problem.chapter) {
    return problem.chapter;
  }
  if (modelSourceMap[sceneName] && modelSourceMap[sceneName].title) {
    return modelSourceMap[sceneName].title;
  }
  return (favorite && favorite.path) || "收藏模型题";
}

function renderFavoriteHome() {
  var grid = document.getElementById("favoriteHomeGrid");
  if (!grid) {
    return;
  }
  grid.innerHTML = "";
  var favorites = readFavoriteProblems();
  var catalog = getSceneCatalog();
  var catalogMap = {};
  var didUpgradeFavorites = false;
  catalog.forEach(function (item) {
    catalogMap[item.scene] = item;
    var key = getFavoriteProblemKey(item.scene);
    if (favorites[key] && (favorites[key].title !== item.title || favorites[key].path !== item.path)) {
      favorites[key].scene = item.scene;
      favorites[key].title = item.title;
      favorites[key].path = item.path;
      didUpgradeFavorites = true;
    }
  });
  if (didUpgradeFavorites) {
    writeFavoriteProblems(favorites);
  }
  function appendFavoriteCard(key) {
    var favorite = favorites[key] || {};
    var sceneName = favorite.scene || String(key).replace(/^scene:/, "");
    var item = catalogMap[sceneName] || {};
    var titleText = getFavoriteSceneTitle(sceneName, item, favorite);
    var pathText = getFavoriteScenePath(sceneName, item, favorite);
    if (!sceneName) {
      return;
    }
    var card = document.createElement("button");
    card.type = "button";
    card.className = "home-card favorite-home-card";
    card.onclick = function () {
      switchScene(sceneName);
    };
    var mark = document.createElement("span");
    mark.className = "favorite-home-mark";
    mark.innerText = "♥";
    var title = document.createElement("strong");
    title.innerText = titleText;
    var meta = document.createElement("span");
    meta.innerText = pathText;
    card.appendChild(mark);
    card.appendChild(title);
    card.appendChild(meta);
    grid.appendChild(card);
  }
  catalog.forEach(function (item) {
    var key = getFavoriteProblemKey(item.scene);
    if (favorites[key]) {
      appendFavoriteCard(key);
    }
  });
  Object.keys(favorites).forEach(function (key) {
    var favorite = favorites[key] || {};
    var sceneName = favorite.scene || String(key).replace(/^scene:/, "");
    if (!catalogMap[sceneName]) {
      appendFavoriteCard(key);
    }
  });
}

function enhanceProblemNotes() {
  var notes = document.querySelectorAll(".problem-notes");
  notes.forEach(function (note) {
    var sceneName = note.id.replace("Notes", "");
    var grid = note.querySelector(".problem-notes-grid");
    if (!grid) {
      return;
    }

    var blocks = grid.querySelectorAll(".problem-note-block");
    blocks.forEach(function (block, index) {
      var kicker = block.querySelector(".problem-note-kicker");
      var kickerText = kicker ? kicker.innerText.trim() : "";
      if (kickerText === "题目") {
        ensureFavoriteButton(block, sceneName);
      }
      if (block.querySelector(".note-body")) {
        return;
      }
      var body = document.createElement("div");
      body.className = "note-body";
      var children = Array.prototype.slice.call(block.children);
      children.forEach(function (child) {
        if (child.classList && child.classList.contains("problem-note-kicker")) {
          return;
        }
        if (child.classList && child.classList.contains("favorite-toggle")) {
          return;
        }
        body.appendChild(child);
      });
      if (index > 0 && kickerText !== "近似题") {
        block.classList.add("is-collapsed");
        var toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "note-toggle";
        toggle.innerText = "展开";
        toggle.onclick = function () {
          var collapsed = block.classList.toggle("is-collapsed");
          toggle.innerText = collapsed ? "展开" : "收起";
          renderMath(block);
        };
        block.appendChild(toggle);
        if (isAnalysisNoteBlock(block)) {
          addStepAiButtons(body);
        }
      }
      block.appendChild(body);
    });

  });
}

function isAnalysisNoteBlock(block) {
  if (!block) {
    return false;
  }
  if (block.dataset.analysisBlock === "1") {
    return true;
  }
  var kicker = block.querySelector(".problem-note-kicker");
  return kicker && kicker.innerText.trim() === "解析";
}

function addStepAiButtons(body) {
  var paragraphs = getStepAiParagraphs(body);
  paragraphs.forEach(function (paragraph, paragraphIndex) {
    if (paragraph.nextElementSibling && paragraph.nextElementSibling.classList.contains("step-ai-tools")) {
      return;
    }
    var tools = document.createElement("div");
    tools.className = "step-ai-tools";
    [
      [
        "explain",
        "AI 解析",
        "学生已经看过解析，但是还是没懂。请把这一步当成第一次教初中学生，不要出现专业术语，从基础开始一步一步解释，不要重复解析的内容。"
      ]
    ].forEach(function (item) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "step-ai-button";
      button.innerText = item[1];
      button.onclick = function () {
        askStepAi(paragraph, item[2], item[0], paragraphIndex);
      };
      tools.appendChild(button);
    });
    var response = document.createElement("div");
    response.className = "step-ai-response";
    tools.appendChild(response);
    paragraph.insertAdjacentElement("afterend", tools);
  });
}

function getStepAiParagraphs(body) {
  if (!body) {
    return [];
  }
  var jsonStepParagraphs = Array.prototype.slice.call(body.querySelectorAll(".analysis-step p"));
  if (jsonStepParagraphs.length) {
    return jsonStepParagraphs;
  }
  var directParagraphs = Array.prototype.slice.call(body.children).filter(function (child) {
    return child.tagName === "P";
  });
  var numberedParagraphs = directParagraphs.filter(function (paragraph) {
    var text = paragraph.innerText.trim();
    return /^\d+\s*[.、．]/.test(text);
  });
  if (numberedParagraphs.length) {
    return numberedParagraphs;
  }
  return directParagraphs.filter(function (paragraph) {
    return !/^答案[：:]/.test(paragraph.innerText.trim());
  });
}

function getStepContext(paragraph, prompt, intent, fallbackStepIndex) {
  var note = document.querySelector("#" + currentScene + "Notes");
  var block = paragraph ? paragraph.closest(".problem-note-block") : null;
  var analysisStep = paragraph ? paragraph.closest(".analysis-step") : null;
  var body = paragraph ? paragraph.closest(".note-body") : null;
  var paragraphs = body ? Array.prototype.slice.call(body.querySelectorAll("p")) : [];
  var noteBlocks = note ? Array.prototype.slice.call(note.querySelectorAll(".problem-note-block")) : [];
  var blockIndex = block ? noteBlocks.indexOf(block) : -1;
  var stepIndex = analysisStep && analysisStep.dataset.stepIndex
    ? Number(analysisStep.dataset.stepIndex)
    : block && block.dataset.stepIndex
    ? Number(block.dataset.stepIndex)
    : (blockIndex > 0 ? blockIndex - 1 : (paragraph ? paragraphs.indexOf(paragraph) : fallbackStepIndex));
  var source = modelSourceMap[currentScene] || {};
  var problemData = problemDataMap[currentScene];
  var heading = block ? block.querySelector("h2") : null;
  var kicker = block ? block.querySelector(".problem-note-kicker") : null;
  var isAnalysisOverview = problemData && problemData.analysis && block && block.dataset.analysisBlock === "1" && !analysisStep;
  var dataStep = !isAnalysisOverview && problemData && problemData.steps ? problemData.steps[stepIndex] : null;
  var stepTitle = "";
  var strong = paragraph ? paragraph.querySelector("strong") : null;
  if (dataStep && dataStep.title) {
    stepTitle = dataStep.title;
  } else if (isAnalysisOverview && problemData.analysis.title) {
    stepTitle = problemData.analysis.title;
  } else if (strong) {
    stepTitle = strong.innerText.replace(/[：:。.\s]+$/, "");
  } else if (heading) {
    stepTitle = heading.innerText;
  }

  return {
    problemId: currentScene,
    problemTitle: (problemData && problemData.title) || source.title || currentScene,
    stepId: isAnalysisOverview ? "analysis" : stepIndex + 1,
    stepTitle: stepTitle || "当前步骤",
    stepContent: (dataStep && dataStep.content) || (isAnalysisOverview && problemData.analysis.content) || (paragraph ? paragraph.innerText : ""),
    previousSteps: !isAnalysisOverview && problemData && problemData.steps
      ? problemData.steps.slice(0, Math.max(stepIndex, 0)).map(function (item) {
        return item.title + "：" + item.content;
      })
      : paragraphs.slice(0, Math.max(stepIndex, 0)).map(function (item) {
        return item.innerText;
      }),
    knowledge: (dataStep && dataStep.knowledge) || (problemData && problemData.knowledge) || knowledgePointMap[currentScene] || [],
    commonMistakes: (dataStep && dataStep.commonMistakes) || getCommonMistakes(currentScene),
    animationState: getAnimationState(currentScene),
    studentState: getStudentState(currentScene, stepIndex + 1),
    intent: intent,
    userQuestion: prompt,
    noteTitle: note ? (note.querySelector(".problem-note-block h2") || {}).innerText : "",
    animationRange: dataStep ? dataStep.animationRange : null
  };
}

function getCommonMistakes(sceneName) {
  var defaults = {
    projectileBasic: ["误认为水平速度会变小", "混淆位移方向和速度方向"],
    projectileSlope: ["只看水平位移，不看斜面几何", "误认为末速度方向随落点改变"],
    riverCrossing: ["把船速直接当合速度", "忘记分解垂直河岸分量"],
    curveForce: ["把速度方向当成合力方向", "忽略切向分力对快慢的影响"],
    rodConstraint: ["没有把速度投影到杆方向", "误把两端速度大小看成相等"],
    bikeGear: ["混淆同轴角速度相等和链条线速度相等"]
  };
  return defaults[sceneName] || [];
}

function normalizeProblemAnimation(problem) {
  var animation = problem.animation || {};
  if (!animation || animation.type === "none") {
    return inferProblemAnimation(problem);
  }
  animation.enabled = animation.enabled === true;
  animation.params = animation.params || {};
  animation.timeline = animation.timeline || {};
  if (typeof animation.playable !== "boolean") {
    animation.playable = animation.level === "animated";
  }
  if (typeof animation.interactive !== "boolean") {
    animation.interactive = true;
  }
  if (!animation.level) {
    animation.level = animation.playable ? "animated" : "interactive_diagram";
  }
  return animation;
}

function isProblemAnimationEnabled(problem) {
  return Boolean(problem && problem.animation && problem.animation.enabled === true && problem.animation.type !== "none");
}

function shouldShowCanvas(sceneName) {
  if (sceneName === "home") {
    return false;
  }
  if (isJsonProblemScene(sceneName)) {
    return isJsonAnimationScene(sceneName);
  }
  return true;
}

function inferProblemAnimation(problem) {
  var text = [problem.id, problem.model, problem.title, problem.question, (problem.knowledge || []).join(" ")]
    .filter(Boolean)
    .join(" ");
  var circularAnimation = inferCircularProblemAnimation(problem, text);
  if (circularAnimation) {
    return circularAnimation;
  }
  if (/子弹.*(圆筒|纸筒)|弹孔|穿.*(圆筒|纸筒)|bullet.*cylinder/i.test(text)) {
    return {
      level: "animated",
      type: "codex_scene",
      key: "bulletCylinder",
      playable: true,
      interactive: true,
      confidence: 0.72,
      notes: "题目解析来自 JSON，动画与图表绑定 Codex 手写模型 bulletCylinder",
      params: {
        d: { label: "圆筒直径", value: 0.2, min: 0.05, max: 1, step: 0.01, unit: "m" },
        omega: { label: "圆筒角速度", value: 3, min: 0.5, max: 8, step: 0.1, unit: "rad/s" },
        phi: { label: "弹孔夹角", value: 65, min: 10, max: 160, step: 1, unit: "deg" }
      },
      timeline: { duration: 1, loop: false }
    };
  }
  if (/平抛|抛体|projectile/i.test(text)) {
    return {
      level: "animated",
      type: "projectile",
      playable: true,
      interactive: true,
      confidence: 0.7,
      notes: "根据题目关键词自动选择平抛模型",
      params: {
        vx: { label: "水平速度", value: 8, min: 1, max: 30, step: 0.5, unit: "m/s" },
        height: { label: "高度", value: 20, min: 1, max: 80, step: 1, unit: "m" },
        g: { label: "重力加速度", value: 9.8, min: 1, max: 15, step: 0.1, unit: "m/s²" }
      },
      timeline: { duration: 3, loop: false }
    };
  }
  if (/弹簧|胡克|劲度|伸长|spring/i.test(text)) {
    return {
      level: "animated",
      type: "spring_balance",
      playable: true,
      interactive: true,
      confidence: 0.65,
      notes: "根据题目关键词自动选择弹簧平衡模型",
      params: {
        k: { label: "劲度系数", value: 100, min: 20, max: 300, step: 10, unit: "N/m" },
        mass: { label: "质量", value: 0.5, min: 0.1, max: 2, step: 0.1, unit: "kg" },
        g: { label: "重力加速度", value: 9.8, min: 1, max: 15, step: 0.1, unit: "m/s²" }
      },
      timeline: { duration: 4, loop: true }
    };
  }
  if (/受力|弹力|摩擦|平衡|斜面|支持力|force|friction/i.test(text)) {
    return {
      level: "interactive_diagram",
      type: "force_diagram",
      playable: false,
      interactive: true,
      confidence: 0.6,
      notes: "根据题目关键词自动选择受力图",
      params: {
        angle: { label: "接触面角度", value: 25, min: 0, max: 60, step: 1, unit: "deg" }
      },
      forces: [
        { label: "G", direction: "down", color: "#dc2626" },
        { label: "N", direction: "normal", color: "#2563eb" },
        { label: "f", direction: "surface", color: "#f59e0b" }
      ]
    };
  }
  return { level: "none", type: "none", playable: false, interactive: false, params: {} };
}

function makeCircularAnimation(variant, notes, params) {
  return {
    enabled: true,
    level: "animated",
    type: "circular_concept",
    variant: variant,
    playable: true,
    interactive: true,
    confidence: 0.8,
    notes: notes || "圆周运动动态图：按题意展示运动、受力和图像关系",
    params: params || {
      omega: { label: "角速度", value: 2.4, min: 0.5, max: 6, step: 0.1, unit: "rad/s" },
      radius: { label: "半径", value: 1.0, min: 0.3, max: 2.0, step: 0.1, unit: "m" }
    },
    timeline: { duration: 6, loop: false }
  };
}

function inferCircularProblemAnimation(problem, text) {
  if (!problem || problem.chapter !== "圆周运动") {
    return null;
  }
  var id = problem.id || "";
  if (/bullet|子弹|纸筒|圆筒|弹孔/i.test(text)) {
    return {
      enabled: true,
      level: "animated",
      type: "bullet_cylinder",
      playable: true,
      interactive: true,
      confidence: 0.86,
      notes: "子弹穿旋转筒：用同一段时间连接子弹直线运动和圆筒转角",
      params: {
        d: { label: "圆筒直径", value: 0.30, min: 0.10, max: 1.00, step: 0.01, unit: "m" },
        omega: { label: "角速度", value: 6.0, min: 1.0, max: 12.0, step: 0.1, unit: "rad/s" },
        phi: { label: "弹孔夹角", value: 60, min: 10, max: 160, step: 1, unit: "deg" }
      },
      timeline: { duration: 1, loop: false }
    };
  }
  if (/飞镖|击中|转盘游戏/i.test(text)) {
    return makeCircularAnimation("dart_disk", "飞镖与转盘：飞镖飞行时间与圆盘转角条件同时满足", {
      omega: { label: "圆盘角速度", value: 3.14, min: 0.5, max: 8, step: 0.01, unit: "rad/s" },
      radius: { label: "圆盘半径", value: 1.0, min: 0.4, max: 2.0, step: 0.1, unit: "m" },
      flight: { label: "飞行时间", value: 1.0, min: 0.4, max: 2.5, step: 0.05, unit: "s" }
    });
  }
  if (/gear|belt|pulley|皮带|齿轮|传动|链轮|飞轮|自行车/i.test(text)) {
    return makeCircularAnimation("transmission", "传动模型：同轴角速度相等，接触/皮带/啮合处线速度相等", {
      omega: { label: "主动角速度", value: 2.4, min: 0.5, max: 6, step: 0.1, unit: "rad/s" },
      ratio: { label: "半径比", value: 2.0, min: 1.0, max: 5.0, step: 0.1, unit: "" }
    });
  }
  if (/cake|奶油|泼水|水珠|圆盘点|圆盘绕中心/i.test(text)) {
    return makeCircularAnimation("rotating_disk", "圆盘匀速转动：速度沿切线，向心加速度指向圆心", {
      omega: { label: "角速度", value: 1.57, min: 0.3, max: 5, step: 0.01, unit: "rad/s" },
      radius: { label: "半径", value: 1.0, min: 0.3, max: 2.0, step: 0.1, unit: "m" }
    });
  }
  if (/圆锥摆|飞椅|漏斗|圆锥面|同高|双绳|转盘连接小球|水平圆周运动/i.test(text)) {
    var variant = /双绳|圆锥面/.test(text) ? "rope_cone_limit" : "conical_pendulum";
    if (/漏斗/.test(text)) {
      variant = "funnel_balls";
    }
    return makeCircularAnimation(variant, "圆锥摆/漏斗模型：重力与约束力合成提供水平向心力", {
      theta: { label: "夹角", value: 37, min: 10, max: 65, step: 1, unit: "deg" },
      radius: { label: "半径", value: 1.0, min: 0.3, max: 2.0, step: 0.1, unit: "m" },
      g: { label: "重力加速度", value: 10, min: 5, max: 15, step: 0.1, unit: "m/s²" }
    });
  }
  if (/碰钉|突然停止|绕钉|拉力图像|竖直平面|竖直圆周|打夯机/i.test(text)) {
    return makeCircularAnimation("vertical_circle", "竖直圆模型：速度方向瞬时不变，半径改变会改变角速度、向心加速度和拉力", {
      omega: { label: "角速度", value: 2.8, min: 0.5, max: 7, step: 0.1, unit: "rad/s" },
      radius: { label: "半径", value: 1.0, min: 0.3, max: 2.0, step: 0.1, unit: "m" },
      g: { label: "重力加速度", value: 10, min: 5, max: 15, step: 0.1, unit: "m/s²" }
    });
  }
  if (/摩擦|临界|侧滑|转台|木块|滑动/i.test(text)) {
    return makeCircularAnimation("friction_limit", "摩擦临界模型：所需向心力随 \\(\\omega^2r\\) 增大，先到临界者先滑", {
      omega: { label: "角速度", value: 2.0, min: 0.5, max: 6.0, step: 0.1, unit: "rad/s" },
      mu: { label: "摩擦因数", value: 0.40, min: 0.10, max: 1.00, step: 0.01, unit: "" },
      radius: { label: "半径", value: 1.0, min: 0.3, max: 2.0, step: 0.1, unit: "m" }
    });
  }
  if (/双人|溜冰|弹簧秤|面对面/i.test(text)) {
    return makeCircularAnimation("two_body_orbit", "双人圆周运动：内力相等、角速度相同，半径按质量反比分配", {
      omega: { label: "角速度", value: 0.62, min: 0.2, max: 2.0, step: 0.01, unit: "rad/s" },
      massRatio: { label: "质量比", value: 2.0, min: 0.5, max: 4.0, step: 0.1, unit: "" }
    });
  }
  return makeCircularAnimation("uniform_circle", "匀速圆周运动：速度沿切线，向心加速度指向圆心");
}

function isJsonAnimationScene(sceneName) {
  var problem = problemDataMap[sceneName];
  return Boolean(problem && !legacySceneMap[sceneName] && isProblemAnimationEnabled(problem));
}

function isJsonProblemScene(sceneName) {
  return Boolean(problemDataMap[sceneName] && !legacySceneMap[sceneName]);
}

function getJsonAnimationState(sceneName) {
  if (!jsonAnimationState[sceneName]) {
    jsonAnimationState[sceneName] = { time: 0, playing: false, values: {} };
  }
  var state = jsonAnimationState[sceneName];
  var animation = (problemDataMap[sceneName] || {}).animation || {};
  Object.keys(animation.params || {}).forEach(function (key) {
    if (typeof state.values[key] !== "number") {
      state.values[key] = Number(animation.params[key].value || 0);
    }
  });
  return state;
}

function getJsonParam(sceneName, key, fallback) {
  var state = getJsonAnimationState(sceneName);
  var value = state.values[key];
  return typeof value === "number" ? value : fallback;
}

function getCodexAnimationKey(sceneName) {
  var animation = (problemDataMap[sceneName] || {}).animation || {};
  return animation.key || animation.animationKey || "";
}

function renderJsonAnimationControls(sceneName) {
  var container = document.getElementById("jsonAnimationControls");
  if (!container) {
    return;
  }
  container.innerHTML = "";
  if (!isJsonAnimationScene(sceneName)) {
    container.style.display = "none";
    return;
  }
  var problem = problemDataMap[sceneName];
  var animation = problem.animation;
  var state = getJsonAnimationState(sceneName);
  var params = animation.params || {};
  Object.keys(params).forEach(function (key) {
    var param = params[key] || {};
    var control = document.createElement("div");
    control.className = "control";
    var label = document.createElement("label");
    label.innerText = param.label || key;
    var input = document.createElement("input");
    input.type = "range";
    input.min = param.min;
    input.max = param.max;
    input.step = param.step || 1;
    input.value = getJsonParam(sceneName, key, Number(param.value || 0));
    var value = document.createElement("span");
    value.className = "value";
    value.innerText = formatParamValue(Number(input.value), param.unit);
    input.oninput = function () {
      state.values[key] = input.valueAsNumber;
      state.playing = false;
      value.innerText = formatParamValue(state.values[key], param.unit);
      syncJsonTimeControl(sceneName);
    };
    control.appendChild(label);
    control.appendChild(input);
    control.appendChild(value);
    container.appendChild(control);
  });
  if (animation.playable) {
    var duration = getJsonDuration(sceneName);
    var timeControl = document.createElement("div");
    timeControl.className = "control";
    var timeLabel = document.createElement("label");
    timeLabel.innerText = "观察时间";
    var timeInput = document.createElement("input");
    timeInput.id = "jsonAnimTime";
    timeInput.type = "range";
    timeInput.min = 0;
    timeInput.max = duration;
    timeInput.step = 0.02;
    timeInput.value = Math.min(state.time, duration);
    var timeValue = document.createElement("span");
    timeValue.id = "jsonAnimTimeVal";
    timeValue.className = "value";
    timeValue.innerText = Number(timeInput.value).toFixed(2) + "s";
    timeInput.oninput = function () {
      state.time = timeInput.valueAsNumber;
      state.playing = false;
      syncJsonTimeControl(sceneName);
    };
    timeControl.appendChild(timeLabel);
    timeControl.appendChild(timeInput);
    timeControl.appendChild(timeValue);
    container.appendChild(timeControl);

    var play = document.createElement("button");
    play.id = "jsonAnimPlayBtn";
    play.type = "button";
    play.className = "action";
    play.innerText = state.playing ? "暂停" : "播放";
    play.onclick = function () {
      state.playing = !state.playing;
      syncJsonTimeControl(sceneName);
    };
    container.appendChild(play);
  }
  if (animation.notes) {
    var meta = document.createElement("div");
    meta.className = "json-animation-meta";
    meta.innerText = animation.notes;
    container.appendChild(meta);
  }
  container.style.display = "grid";
}

function formatParamValue(value, unit) {
  var absolute = Math.abs(value);
  var fixed = absolute >= 10 ? value.toFixed(0) : (absolute > 0 && absolute < 0.1 ? value.toFixed(2) : value.toFixed(1));
  var cleanUnit = formatPhysicsUnit(unit);
  if (cleanUnit === "deg" || cleanUnit === "°") {
    return fixed + "°";
  }
  return cleanUnit ? fixed + cleanUnit : fixed;
}

function formatPhysicsUnit(unit) {
  return String(unit || "")
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³")
    .replace(/m\/s2/g, "m/s²")
    .replace(/m\/s²²/g, "m/s²");
}

function getJsonDuration(sceneName) {
  var animation = (problemDataMap[sceneName] || {}).animation || {};
  if (animation.type === "gravitation_lunar_throw") {
    var lunarV0 = Math.max(0.1, getJsonParam(sceneName, "v0", 8));
    var lunarHeight = Math.max(0.1, getJsonParam(sceneName, "height", 20));
    return 4 * lunarHeight / lunarV0;
  }
  if (animation.type === "projectile") {
    var height = getJsonParam(sceneName, "height", 20);
    var g = Math.max(0.1, getJsonParam(sceneName, "g", 9.8));
    return Math.sqrt(2 * height / g);
  }
  if (animation.type === "bullet_cylinder") {
    var omega = Math.max(0.1, getJsonParam(sceneName, "omega", 3));
    var phi = getJsonBulletPhi(sceneName);
    return Math.max(0.2, (Math.PI - phi) / omega);
  }
  if (getCodexAnimationKey(sceneName) === "bulletCylinder") {
    var codexOmega = Math.max(0.1, getJsonParam(sceneName, "omega", 3));
    var codexPhi = getJsonBulletPhi(sceneName);
    return Math.max(0.2, (Math.PI - codexPhi) / codexOmega);
  }
  if (animation.type === "circular_concept" && animation.variant === "dart_disk") {
    return Math.max(0.2, getJsonParam(sceneName, "flight", 1.0));
  }
  if (animation.type === "work_power_model" && animation.variant === "lesson10_conveyor_work") {
    var beltSpeed = Math.max(0.1, getJsonParam(sceneName, "beltSpeed", 2));
    var conveyorMu = Math.max(0.01, getJsonParam(sceneName, "mu", 0.2));
    var conveyorG = Math.max(0.1, getJsonParam(sceneName, "g", 10));
    return beltSpeed / (conveyorMu * conveyorG);
  }
  if (animation.type === "work_power_model" && animation.variant === "lesson10_gravity_power") {
    var throwHeight = Math.max(0.1, getJsonParam(sceneName, "height", 20));
    var throwSpeed = Math.max(0, getJsonParam(sceneName, "speed", 10));
    var throwG = Math.max(0.1, getJsonParam(sceneName, "g", 10));
    return (throwSpeed + Math.sqrt(throwSpeed * throwSpeed + 2 * throwG * throwHeight)) / throwG;
  }
  return Math.max(0.5, Number((animation.timeline || {}).duration || 4));
}

function syncJsonTimeControl(sceneName) {
  var state = getJsonAnimationState(sceneName);
  var duration = getJsonDuration(sceneName);
  state.time = Math.min(state.time, duration);
  var input = document.getElementById("jsonAnimTime");
  var value = document.getElementById("jsonAnimTimeVal");
  var play = document.getElementById("jsonAnimPlayBtn");
  if (input) {
    input.max = duration.toFixed(2);
    input.value = state.time.toFixed(2);
  }
  if (value) {
    value.innerText = state.time.toFixed(2) + "s";
  }
  if (play) {
    play.innerText = state.playing ? "暂停" : "播放";
  }
}

function updateJsonAnimation(dt) {
  if (!isJsonAnimationScene(currentScene)) {
    return;
  }
  var state = getJsonAnimationState(currentScene);
  var animation = problemDataMap[currentScene].animation;
  if (!state.playing || !animation.playable) {
    return;
  }
  var duration = getJsonDuration(currentScene);
  state.time += dt;
  if (state.time >= duration) {
    if ((animation.timeline || {}).loop) {
      state.time = 0;
    } else {
      state.time = 0;
      state.playing = false;
    }
  }
  syncJsonTimeControl(currentScene);
}

function drawJsonAnimationScene() {
  var animation = problemDataMap[currentScene].animation;
  var codexKey = getCodexAnimationKey(currentScene);
  if (codexKey === "bulletCylinder") {
    syncCodexBulletCylinderScene(currentScene);
    drawAnimScene(drawBulletScene);
    drawBulletGraph();
    drawCodexSceneBadge("Codex 动画模型：bulletCylinder");
  } else if (animation.type === "projectile") {
    drawAnimScene(drawJsonProjectileScene);
    drawJsonProjectileGraph();
  } else if (animation.type === "spring_balance") {
    drawAnimScene(drawJsonSpringScene);
    drawJsonSpringGraph();
  } else if (animation.type === "force_diagram") {
    drawAnimScene(drawJsonForceDiagramScene);
    drawJsonForceDiagramGraph();
  } else if (animation.type === "bullet_cylinder") {
    drawAnimScene(drawJsonBulletCylinderScene);
    drawJsonBulletCylinderGraph();
  } else if (animation.type === "circular_concept") {
    drawAnimScene(drawJsonCircularConceptScene);
    drawJsonCircularConceptGraph();
  } else if (animation.type === "gravitation_eclipse") {
    drawAnimScene(drawGravitationEclipseScene);
    drawGravitationEclipseGraph();
  } else if (animation.type === "gravitation_lunar_throw") {
    drawAnimScene(drawGravitationLunarThrowScene);
    drawGravitationLunarThrowGraph();
  } else if (animation.type === "gravitation_model") {
    drawAnimScene(drawGravitationModelScene);
    drawGravitationModelGraph();
  } else if (animation.type === "work_power_model") {
    drawAnimScene(drawWorkPowerModelScene);
    drawWorkPowerModelGraph();
  } else if (animation.type === "kinetic_energy_model") {
    drawAnimScene(drawKineticEnergyModelScene);
    drawKineticEnergyModelGraph();
  } else {
    drawAnimScene(drawJsonPlaceholderScene);
    drawJsonPlaceholderGraph();
  }
}

function drawCodexSceneBadge(label) {
  push();
  noStroke();
  fill("#0f172a");
  rect(24, 22, 214, 30, 7);
  fill("#ffffff");
  textAlign(LEFT, CENTER);
  textSize(14);
  text(label, 36, 37);
  pop();
}

function syncCodexBulletCylinderScene(sceneName) {
  var state = getJsonAnimationState(sceneName);
  var d = Math.max(0.01, getJsonParam(sceneName, "d", 0.2));
  bulletD = d <= 2 ? constrain(d * 750, 80, 220) : constrain(d, 80, 220);
  bulletOmega = Math.max(0.1, getJsonParam(sceneName, "omega", 3));
  bulletPhi = constrain(getJsonBulletPhi(sceneName) * 180 / Math.PI, 10, 160);
  bulletT = Math.min(state.time, bulletTransitTime());
  bulletPlaying = Boolean(state.playing);
}

function drawJsonPlaceholderScene() {
  var problem = problemDataMap[currentScene] || {};
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("暂未生成动画模型", 28, 30);
  fill("#334155");
  textSize(15);
  text("这道题已经有题干和分步解析，但 animation.type 还不是可绘制模型。", 28, 62);
  fill("#eff6ff");
  stroke("#bfdbfe");
  strokeWeight(2);
  rect(92, 138, 390, 190, 12);
  noStroke();
  fill("#2563eb");
  textAlign(CENTER, CENTER);
  textSize(20);
  text(problem.model || "待补充模型", 287, 218);
  fill("#475569");
  textSize(15);
  text((problem.knowledge || []).slice(0, 4).join(" / ") || "请校对 animation 字段", 287, 252);
}

function drawJsonPlaceholderGraph() {
  drawGraphFrame("模型信息", "右图会在 animation.type 可识别后自动绘制");
  var problem = problemDataMap[currentScene] || {};
  var x = graphLeft + 30;
  var y = 100;
  noStroke();
  textAlign(LEFT, TOP);
  fill("#111827");
  textSize(14);
  text("当前类型：" + (((problem.animation || {}).type) || "none"), x, y);
  fill("#64748b");
  textSize(15);
  text("建议类型：projectile / spring_balance / force_diagram / codex_scene", x, y + 34);
}

function drawJsonProjectileScene() {
  var vx = getJsonParam(currentScene, "vx", 8);
  var height = getJsonParam(currentScene, "height", 20);
  var g = Math.max(0.1, getJsonParam(currentScene, "g", 9.8));
  var state = getJsonAnimationState(currentScene);
  var duration = getJsonDuration(currentScene);
  var tNow = Math.min(state.time, duration);
  var range = vx * duration;
  var groundY = 430;
  var startX = 85;
  var startY = 80;
  var sx = Math.min(8, 440 / Math.max(1, range));
  var sy = (groundY - startY) / Math.max(1, height);
  var x = vx * tNow;
  var y = Math.max(0, height - 0.5 * g * tNow * tNow);
  var ballX = startX + x * sx;
  var ballY = groundY - y * sy;
  var vy = g * tNow;

  stroke("#111827");
  strokeWeight(3);
  line(45, groundY, 545, groundY);
  stroke("#94a3b8");
  strokeWeight(2);
  line(startX, groundY, startX, 60);
  drawArrow(startX, groundY, startX, 64, "#64748b");

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (var i = 0; i <= 120; i++) {
    var t = i * duration / 120;
    vertex(startX + vx * t * sx, groundY - Math.max(0, height - 0.5 * g * t * t) * sy);
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
  drawVectorArrow(ballX, ballY, vx * 5, 0, "#2563eb", "vx");
  drawVectorArrow(ballX, ballY, 0, vy * 5, "#dc2626", "vy");

  noStroke();
  fill("#111827");
  textSize(20);
  textAlign(LEFT, TOP);
  text("JSON 平抛动画", 24, 28);
  fill("#334155");
  textSize(14);
  text("t = " + tNow.toFixed(2) + "s，x = " + x.toFixed(1) + "m，y = " + y.toFixed(1) + "m", 24, 52);
}

function drawJsonProjectileGraph() {
  var vx = getJsonParam(currentScene, "vx", 8);
  var height = getJsonParam(currentScene, "height", 20);
  var g = Math.max(0.1, getJsonParam(currentScene, "g", 9.8));
  var state = getJsonAnimationState(currentScene);
  var tMax = getJsonDuration(currentScene);
  drawGraphFrame("分运动图像", "蓝线：x(t)；红线：下落高度");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var maxValue = Math.max(vx * tMax, height);
  drawSimpleCurve(gx, gy, gw, gh, tMax, maxValue, "#2563eb", function (t) { return vx * t; });
  drawSimpleCurve(gx, gy, gw, gh, tMax, maxValue, "#dc2626", function (t) { return 0.5 * g * t * t; });
  var currentX = map(Math.min(state.time, tMax), 0, tMax, gx, gx + gw);
  stroke("#111827");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(currentX, gy, currentX, gy + gh);
  drawingContext.setLineDash([]);
}

function drawJsonSpringScene() {
  var values = getJsonSpringValues();
  var k = values.k;
  var mass = values.mass;
  var g = values.g;
  var state = getJsonAnimationState(currentScene);
  var extension = mass * g / k;
  var pxExtension = constrain(extension * 900, 30, 210);
  var wave = Math.sin(state.time * 5) * 10 * Math.exp(-state.time * 0.5);
  var topX = 285;
  var topY = 70;
  var bottomY = topY + 125 + pxExtension + wave;
  var massY = bottomY + 40;

  stroke("#111827");
  strokeWeight(5);
  line(160, topY, 410, topY);
  drawSpringCoil(topX, topY, bottomY, 28, 12, "#14b8a6");
  noStroke();
  fill("#2563eb");
  rect(topX - 42, massY - 28, 84, 56, 8);
  fill("#fff");
  textAlign(CENTER, CENTER);
  textSize(14);
  text("m", topX, massY);
  drawVectorArrow(topX, massY + 34, 0, 70, "#dc2626", "G");
  drawVectorArrow(topX, bottomY - 8, 0, -70, "#2563eb", "F");

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("JSON 弹簧动画", 24, 28);
  fill("#334155");
  textSize(14);
  text("平衡伸长量 Δx = mg/k = " + extension.toFixed(3) + " m", 24, 52);
}

function drawJsonSpringGraph() {
  var values = getJsonSpringValues();
  var k = values.k;
  var mass = values.mass;
  var g = values.g;
  var extension = mass * g / k;
  drawGraphFrame("弹簧平衡关系", "蓝线：F = kx；橙点：当前平衡位置");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var xMax = Math.max(0.05, extension * 2.2);
  var fMax = k * xMax;
  drawSimpleCurve(gx, gy, gw, gh, xMax, fMax, "#2563eb", function (x) { return k * x; });
  noStroke();
  fill("#f97316");
  circle(map(extension, 0, xMax, gx, gx + gw), map(mass * g, 0, fMax, gy + gh, gy), 12);
}

function getJsonSpringValues() {
  var g = Math.max(0.1, getJsonParam(currentScene, "g", 9.8));
  var m1 = getJsonParam(currentScene, "m1", NaN);
  var m2 = getJsonParam(currentScene, "m2", NaN);
  var mass = getJsonParam(currentScene, "mass", NaN);
  if (!Number.isFinite(mass)) {
    mass = (Number.isFinite(m1) ? m1 : 0) + (Number.isFinite(m2) ? m2 : 0);
  }
  if (!Number.isFinite(mass) || mass <= 0) {
    mass = 0.5;
  }

  var k = getJsonParam(currentScene, "k", NaN);
  var k1 = getJsonParam(currentScene, "k1", NaN);
  var k2 = getJsonParam(currentScene, "k2", NaN);
  if (!Number.isFinite(k) && Number.isFinite(k1) && Number.isFinite(k2) && k1 > 0 && k2 > 0) {
    k = (k1 * k2) / (k1 + k2);
  }
  if (!Number.isFinite(k) || k <= 0) {
    k = 100;
  }
  return { k: Math.max(1, k), mass: Math.max(0.01, mass), g: g };
}

function drawJsonForceDiagramScene() {
  var animation = problemDataMap[currentScene].animation;
  var angle = getJsonParam(currentScene, "angle", 25) * Math.PI / 180;
  var cx = 285;
  var cy = 275;
  var planeLen = 360;
  var dx = Math.cos(angle) * planeLen / 2;
  var dy = Math.sin(angle) * planeLen / 2;

  stroke("#111827");
  strokeWeight(3);
  line(cx - dx, cy + dy, cx + dx, cy - dy);
  push();
  translate(cx, cy - 34);
  rotate(-angle);
  fill("#e0f2fe");
  stroke("#2563eb");
  strokeWeight(2);
  rectMode(CENTER);
  rect(0, 0, 90, 54, 8);
  pop();

  (animation.forces || []).forEach(function (force) {
    var vector = forceDirectionVector(force.direction, angle);
    var scale = forceVectorScale(force, animation);
    drawVectorArrow(cx, cy - 34, vector.x * scale, vector.y * scale, force.color || "#2563eb", force.label || "");
  });

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("JSON 受力图", 24, 28);
  fill("#334155");
  textSize(14);
  text("调节接触面角度，观察弹力/摩擦力方向如何随接触面变化。", 24, 52);
}

function drawJsonForceDiagramGraph() {
  var animation = problemDataMap[currentScene].animation;
  drawGraphFrame("当前受力上下文", "方向由 animation.forces 结构化描述");
  var x = graphLeft + 28;
  var y = 95;
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  fill("#111827");
  text("力的方向", x, y);
  (animation.forces || []).forEach(function (force, index) {
    fill(force.color || "#2563eb");
    circle(x + 8, y + 42 + index * 34, 10);
    fill("#334155");
    text((force.label || "F") + "：" + force.direction, x + 24, y + 34 + index * 34);
  });
}

function getJsonBulletPhi(sceneName) {
  var raw = getJsonParam(sceneName, "phi", Math.PI / 3);
  if (raw > Math.PI + 0.01) {
    return raw * Math.PI / 180;
  }
  return raw;
}

function getJsonBulletValues(sceneName) {
  var d = Math.max(0.01, getJsonParam(sceneName, "d", 0.2));
  var omega = Math.max(0.1, getJsonParam(sceneName, "omega", 3));
  var phi = constrain(getJsonBulletPhi(sceneName), 0.05, Math.PI - 0.05);
  var delta = Math.PI - phi;
  var time = delta / omega;
  var speed = d / time;
  return { d: d, omega: omega, phi: phi, delta: delta, time: time, speed: speed };
}

function drawJsonBulletCylinderScene() {
  var values = getJsonBulletValues(currentScene);
  var state = getJsonAnimationState(currentScene);
  var cx = 280;
  var cy = 245;
  var r = 142;
  var tMax = getJsonDuration(currentScene);
  var tNow = Math.min(state.time, tMax);
  var progress = tNow / Math.max(0.001, tMax);
  var bulletX = cx - r - 85 + (2 * r + 170) * progress;
  var bulletY = cy;
  var rotateNow = values.omega * tNow;
  var aAng = Math.PI + rotateNow;
  var bAng = values.phi + rotateNow;
  var aX = cx + r * Math.cos(aAng);
  var aY = cy + r * Math.sin(aAng);
  var bX = cx + r * Math.cos(bAng);
  var bY = cy + r * Math.sin(bAng);

  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);

  stroke("#cbd5e1");
  strokeWeight(1);
  for (var i = 0; i < 12; i++) {
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
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("O", cx + 10, cy - 8);
  text("a", aX + 10, aY - 14);
  text("b", bX + 10, bY - 14);
  text("圆筒转角 Δθ = π - φ", 88, 64);
  text("子弹路程 = d", 88, 86);
  text("v = ωd/(π-φ) = " + values.speed.toFixed(2) + " m/s", 88, 108);

  stroke("#16a34a");
  strokeWeight(2);
  noFill();
  arc(cx, cy, 64, 64, values.phi, Math.PI);
  drawArrow(
    cx + 32 * Math.cos((values.phi + Math.PI) / 2),
    cy + 32 * Math.sin((values.phi + Math.PI) / 2),
    cx + 32 * Math.cos(Math.PI - 0.15),
    cy + 32 * Math.sin(Math.PI - 0.15),
    "#16a34a"
  );
}

function drawJsonBulletCylinderGraph() {
  var values = getJsonBulletValues(currentScene);
  var state = getJsonAnimationState(currentScene);
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var tMax = getJsonDuration(currentScene);
  var angleMax = Math.PI;

  drawGraphFrame("转角-时间图像", "圆筒转到 π-φ 时，子弹刚穿过直径 d");

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (var i = 0; i <= 120; i++) {
    var t = i * tMax / 120;
    vertex(map(t, 0, tMax, gx, gx + gw), map(values.omega * t, 0, angleMax, gy + gh, gy));
  }
  endShape();

  var targetY = map(values.delta, 0, angleMax, gy + gh, gy);
  stroke("#16a34a");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(gx, targetY, gx + gw, targetY);
  drawingContext.setLineDash([]);

  drawTimeMarker(gx, gy, gw, gh, Math.min(state.time, tMax), tMax);

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(14);
  text("t = (π-φ)/ω = " + values.time.toFixed(2) + "s", gx + 14, gy + 12);
  text("v = ωd/(π-φ) = " + values.speed.toFixed(2) + "m/s", gx + 14, gy + 34);
}

function getJsonCircularVariant() {
  return ((problemDataMap[currentScene] || {}).animation || {}).variant || "uniform_circle";
}

function getJsonCircularValues() {
  var omega = Math.max(0.05, getJsonParam(currentScene, "omega", 2.4));
  var radius = Math.max(0.1, getJsonParam(currentScene, "radius", 1.0));
  var theta = getJsonParam(currentScene, "theta", 37) * Math.PI / 180;
  var mu = Math.max(0.01, getJsonParam(currentScene, "mu", 0.4));
  var g = Math.max(0.1, getJsonParam(currentScene, "g", 10));
  var ratio = Math.max(0.2, getJsonParam(currentScene, "ratio", 2.0));
  var massRatio = Math.max(0.2, getJsonParam(currentScene, "massRatio", 2.0));
  var time = getJsonAnimationState(currentScene).time;
  return {
    omega: omega,
    radius: radius,
    theta: theta,
    mu: mu,
    g: g,
    ratio: ratio,
    massRatio: massRatio,
    time: time,
    speed: omega * radius,
    acc: omega * omega * radius
  };
}

function drawJsonCircularConceptScene() {
  var variant = getJsonCircularVariant();
  if (variant === "transmission") {
    drawJsonCircularTransmissionScene();
  } else if (variant === "dart_disk") {
    drawJsonCircularDartDiskScene();
  } else if (variant === "rotating_disk") {
    drawJsonCircularDiskScene();
  } else if (variant === "conical_pendulum" || variant === "funnel_balls" || variant === "rope_cone_limit") {
    drawJsonCircularConicalScene(variant);
  } else if (variant === "friction_limit") {
    drawJsonCircularFrictionScene();
  } else if (variant === "vertical_circle") {
    drawJsonCircularVerticalScene();
  } else if (variant === "two_body_orbit") {
    drawJsonCircularTwoBodyScene();
  } else if (variant === "daily_banked_curve") {
    drawDailyBankedCurveScene();
  } else if (variant === "daily_conical_cylinder") {
    drawDailyConicalCylinderScene();
  } else if (variant === "daily_hilly_road") {
    drawDailyHillyRoadScene();
  } else if (variant === "daily_centrifuge") {
    drawDailyCentrifugeScene();
  } else if (variant === "daily_airplane_turn") {
    drawDailyAirplaneTurnScene();
  } else if (variant === "daily_bicycle_turn") {
    drawDailyBicycleTurnScene();
  } else if (variant === "daily_tube_projectile") {
    drawDailyTubeProjectileScene();
  } else if (variant === "daily_horizontal_bar") {
    drawDailyHorizontalBarScene();
  } else if (variant === "daily_rod_two_balls") {
    drawDailyRodTwoBallsScene();
  } else if (variant === "daily_rattle_drum") {
    drawDailyRattleDrumScene();
  } else if (variant === "daily_turntable_sensor") {
    drawDailyTurntableSensorScene();
  } else if (variant === "daily_car_passengers") {
    drawDailyCarPassengersScene();
  } else if (variant === "daily_bicycle_mud") {
    drawDailyBicycleMudScene();
  } else if (variant === "daily_box_vertical_circle") {
    drawDailyBoxVerticalCircleScene();
  } else if (variant === "daily_string_tension_graph") {
    drawDailyStringTensionScene();
  } else if (variant === "daily_stacked_turntable") {
    drawDailyStackedTurntableScene();
  } else if (variant === "daily_inclined_sand") {
    drawDailyInclinedSandScene();
  } else if (variant === "daily_valve_light") {
    drawDailyValveLightScene();
  } else if (variant === "daily_carrier_turn") {
    drawDailyCarrierTurnScene();
  } else {
    drawJsonCircularDiskScene();
  }
}

function drawJsonCircularConceptGraph() {
  var variant = getJsonCircularVariant();
  if (variant === "transmission") {
    drawJsonCircularTransmissionGraph();
  } else if (variant === "dart_disk") {
    drawJsonCircularDartDiskGraph();
  } else if (variant === "friction_limit") {
    drawJsonCircularFrictionGraph();
  } else if (variant === "conical_pendulum" || variant === "funnel_balls" || variant === "rope_cone_limit") {
    drawJsonCircularConicalGraph(variant);
  } else if (variant === "vertical_circle") {
    drawJsonCircularVerticalGraph();
  } else if (variant === "two_body_orbit") {
    drawJsonCircularTwoBodyGraph();
  } else if (variant === "daily_banked_curve") {
    drawDailyBankedCurveGraph();
  } else if (variant === "daily_conical_cylinder") {
    drawDailyConicalCylinderGraph();
  } else if (variant === "daily_hilly_road") {
    drawDailyHillyRoadGraph();
  } else if (variant === "daily_centrifuge") {
    drawDailyCentrifugeGraph();
  } else if (variant === "daily_airplane_turn") {
    drawDailyAirplaneTurnGraph();
  } else if (variant === "daily_bicycle_turn") {
    drawDailyBicycleTurnGraph();
  } else if (variant === "daily_tube_projectile") {
    drawDailyTubeProjectileGraph();
  } else if (variant === "daily_horizontal_bar") {
    drawDailyHorizontalBarGraph();
  } else if (variant === "daily_rod_two_balls") {
    drawDailyRodTwoBallsGraph();
  } else if (variant === "daily_rattle_drum") {
    drawDailyRattleDrumGraph();
  } else if (variant === "daily_turntable_sensor") {
    drawDailyTurntableSensorGraph();
  } else if (variant === "daily_car_passengers") {
    drawDailyCarPassengersGraph();
  } else if (variant === "daily_bicycle_mud") {
    drawDailyBicycleMudGraph();
  } else if (variant === "daily_box_vertical_circle") {
    drawDailyBoxVerticalCircleGraph();
  } else if (variant === "daily_string_tension_graph") {
    drawDailyStringTensionGraph();
  } else if (variant === "daily_stacked_turntable") {
    drawDailyStackedTurntableGraph();
  } else if (variant === "daily_inclined_sand") {
    drawDailyInclinedSandGraph();
  } else if (variant === "daily_valve_light") {
    drawDailyValveLightGraph();
  } else if (variant === "daily_carrier_turn") {
    drawDailyCarrierTurnGraph();
  } else {
    drawJsonCircularDiskGraph();
  }
}

function drawJsonCircleBody(cx, cy, r, angle, colorHex, labelText) {
  var x = cx + r * Math.cos(angle);
  var y = cy + r * Math.sin(angle);
  noStroke();
  fill(colorHex);
  circle(x, y, 22);
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(14);
  text(labelText || "", x, y);
  return { x: x, y: y };
}

function drawJsonCircularDiskScene() {
  var values = getJsonCircularValues();
  var cx = 285;
  var cy = 245;
  var r = 132;
  var angle = values.omega * values.time - Math.PI / 3;
  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (var i = 0; i < 12; i++) {
    var a = angle + i * Math.PI / 6;
    line(cx, cy, cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  var p = drawJsonCircleBody(cx, cy, r, angle, "#f97316", "P");
  drawVectorArrow(p.x, p.y, -Math.sin(angle) * 62, Math.cos(angle) * 62, "#2563eb", "v");
  drawVectorArrow(p.x, p.y, (cx - p.x) * 0.42, (cy - p.y) * 0.42, "#dc2626", "a");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("匀速圆周运动", 26, 28);
  fill("#334155");
  textSize(14);
  text("速度沿切线，向心加速度始终指向圆心", 26, 54);
  text("v=ωr=" + values.speed.toFixed(2) + "，a=ω²r=" + values.acc.toFixed(2), 26, 78);
}

function drawJsonCircularDiskGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("线速度/向心加速度", "随角速度变化：v=ωr，a=ω²r");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var maxOmega = 6;
  var maxValue = Math.max(maxOmega * values.radius, maxOmega * maxOmega * values.radius);
  drawSimpleCurve(gx, gy, gw, gh, maxOmega, maxValue, "#2563eb", function (w) { return w * values.radius; });
  drawSimpleCurve(gx, gy, gw, gh, maxOmega, maxValue, "#dc2626", function (w) { return w * w * values.radius; });
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.omega, maxOmega), maxOmega);
}

function drawJsonCircularDartDiskScene() {
  var values = getJsonCircularValues();
  var flight = Math.max(0.2, getJsonParam(currentScene, "flight", 1.0));
  var state = getJsonAnimationState(currentScene);
  var tNow = Math.min(state.time, flight);
  var progress = tNow / flight;
  var diskX = 410;
  var diskY = 245;
  var diskR = 96;
  var startX = 70;
  var startY = diskY - diskR;
  var dartX = startX + (diskX - startX) * progress;
  var dartY = startY + 78 * progress * progress;
  var angle = values.omega * tNow - Math.PI / 2;

  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(diskX, diskY, 2 * diskR);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (var i = 0; i < 8; i++) {
    var a = angle + i * Math.PI / 4;
    line(diskX, diskY, diskX + diskR * Math.cos(a), diskY + diskR * Math.sin(a));
  }
  var targetX = diskX + diskR * Math.cos(angle);
  var targetY = diskY + diskR * Math.sin(angle);
  noStroke();
  fill("#dc2626");
  circle(targetX, targetY, 18);
  fill("#111827");
  circle(diskX, diskY, 7);

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 80; i++) {
    var p = i / 80;
    vertex(startX + (diskX - startX) * p, startY + 78 * p * p);
  }
  endShape();
  drawArrow(dartX - 38, dartY, dartX + 20, dartY, "#2563eb");
  noStroke();
  fill("#f97316");
  triangle(dartX + 20, dartY, dartX - 12, dartY - 8, dartX - 12, dartY + 8);

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("飞镖与转盘同步", 28, 28);
  fill("#334155");
  textSize(14);
  text("飞镖飞行时间 t=L/v₀；圆盘需转到目标点", 28, 54);
  text("当前转角 ωt=" + (values.omega * tNow).toFixed(2) + " rad", 28, 78);
}

function drawJsonCircularDartDiskGraph() {
  var values = getJsonCircularValues();
  var flight = Math.max(0.2, getJsonParam(currentScene, "flight", 1.0));
  var state = getJsonAnimationState(currentScene);
  drawGraphFrame("飞行时间与转角条件", "命中要求：ωt=(2n+1)π 或题设对应目标角");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var angleMax = Math.max(Math.PI * 2, values.omega * flight * 1.2);
  drawSimpleCurve(gx, gy, gw, gh, flight, angleMax, "#2563eb", function (t) { return values.omega * t; });
  stroke("#dc2626");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  var targetY = map(Math.PI, 0, angleMax, gy + gh, gy);
  line(gx, targetY, gx + gw, targetY);
  drawingContext.setLineDash([]);
  drawTimeMarker(gx, gy, gw, gh, Math.min(state.time, flight), flight);
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(14);
  text("t=" + flight.toFixed(2) + "s，ωt=" + (values.omega * flight).toFixed(2) + "rad", gx + 12, gy + 12);
}

function drawJsonCircularTransmissionScene() {
  var values = getJsonCircularValues();
  var leftX = 190;
  var rightX = 398;
  var cy = 250;
  var r1 = 96;
  var r2 = Math.max(36, r1 / values.ratio);
  var a1 = values.omega * values.time;
  var a2 = values.omega * values.ratio * values.time;
  stroke("#64748b");
  strokeWeight(7);
  line(leftX, cy - r1, rightX, cy - r2);
  line(leftX, cy + r1, rightX, cy + r2);
  drawJsonGear(leftX, cy, r1, a1, "#2563eb", "主动轮");
  drawJsonGear(rightX, cy, r2, -a2, "#f97316", "从动轮");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("传动关系", 28, 28);
  fill("#334155");
  textSize(14);
  text("皮带/啮合处线速度相等：ω₁r₁=ω₂r₂", 28, 54);
  text("半径比 r₁:r₂=" + values.ratio.toFixed(1) + ":1，角速度反比", 28, 78);
}

function drawJsonGear(cx, cy, r, angle, colorHex, labelText) {
  stroke(colorHex);
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (var i = 0; i < 10; i++) {
    var a = angle + i * Math.PI / 5;
    line(cx, cy, cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  noStroke();
  fill(colorHex);
  circle(cx, cy, 10);
  fill("#111827");
  textAlign(CENTER, TOP);
  textSize(14);
  text(labelText, cx, cy + r + 12);
}

function drawJsonCircularTransmissionGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("传动量比较", "同轴看角速度；接触/皮带/啮合看线速度");
  var gx = graphLeft + 66;
  var base = 390;
  var scale = 54;
  var v1 = values.omega * values.ratio;
  var v2 = values.omega * values.ratio;
  var w1 = values.omega;
  var w2 = values.omega * values.ratio;
  drawBar(gx, base, 44, w1 * scale / 3, "#2563eb", "ω₁");
  drawBar(gx + 70, base, 44, w2 * scale / 3, "#f97316", "ω₂");
  drawBar(gx + 170, base, 44, v1 * scale / 3, "#16a34a", "v₁");
  drawBar(gx + 240, base, 44, v2 * scale / 3, "#16a34a", "v₂");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(14);
  text("线速度相等，角速度与半径成反比", gx, 92);
}

function drawJsonCircularConicalScene(variant) {
  var values = getJsonCircularValues();
  var cx = 285;
  var topY = 78;
  var centerY = 310;
  var orbitR = 120 * Math.sin(values.theta);
  var angle = values.omega * values.time;
  var ballX = cx + orbitR * Math.cos(angle);
  var ballY = centerY + 20 * Math.sin(angle);
  if (variant === "funnel_balls") {
    stroke("#94a3b8");
    strokeWeight(3);
    line(cx - 150, centerY + 80, cx, topY);
    line(cx + 150, centerY + 80, cx, topY);
  }
  stroke("#2563eb");
  strokeWeight(3);
  line(cx, topY, ballX, ballY);
  stroke("#cbd5e1");
  strokeWeight(1.5);
  noFill();
  ellipse(cx, centerY, 2 * orbitR, 42);
  var p = drawJsonCircleBody(cx, centerY, orbitR, angle, "#f97316", "m");
  p.y = ballY;
  drawVectorArrow(ballX, ballY, (cx - ballX) * 0.45, (centerY - ballY) * 0.45, "#dc2626", "a");
  drawVectorArrow(ballX, ballY, 0, 64, "#64748b", "G");
  drawVectorArrow(ballX, ballY, (cx - ballX) * 0.34, (topY - ballY) * 0.34, "#2563eb", "T/N");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text(variant === "rope_cone_limit" ? "双绳/圆锥面临界" : "圆锥摆模型", 28, 28);
  fill("#334155");
  textSize(14);
  text("水平合力提供向心力，竖直方向平衡", 28, 54);
  text("tanθ = a/g，a=" + values.acc.toFixed(2), 28, 78);
}

function drawJsonCircularConicalGraph(variant) {
  var values = getJsonCircularValues();
  drawGraphFrame("角速度-夹角关系", "θ 越大，需要的水平向心加速度越大");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var g = values.g;
  drawSimpleCurve(gx, gy, gw, gh, 70, 20, "#2563eb", function (deg) {
    return g * Math.tan(deg * Math.PI / 180);
  });
  var thetaDeg = values.theta * 180 / Math.PI;
  drawTimeMarker(gx, gy, gw, gh, thetaDeg, 70);
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(14);
  text((variant === "rope_cone_limit" ? "临界看某根绳/支持力是否为 0" : "同高圆锥摆满足 ω²=g/h"), gx + 12, gy + 14);
}

function drawJsonCircularFrictionScene() {
  var values = getJsonCircularValues();
  var cx = 285;
  var cy = 248;
  var rInner = 86;
  var rOuter = 150;
  var angle = values.omega * values.time;
  stroke("#111827");
  strokeWeight(3);
  noFill();
  ellipse(cx, cy, 2 * rOuter, 2 * rOuter);
  ellipse(cx, cy, 2 * rInner, 2 * rInner);
  var p1 = drawJsonCircleBody(cx, cy, rInner, angle, "#2563eb", "A");
  var p2 = drawJsonCircleBody(cx, cy, rOuter, angle + 0.5, "#f97316", "C");
  drawVectorArrow(p1.x, p1.y, (cx - p1.x) * 0.42, (cy - p1.y) * 0.42, "#16a34a", "f");
  drawVectorArrow(p2.x, p2.y, (cx - p2.x) * 0.42, (cy - p2.y) * 0.42, "#dc2626", "f");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("摩擦提供向心力", 28, 28);
  fill("#334155");
  textSize(14);
  text("所需 f=mω²r；r 越大越先达到最大静摩擦", 28, 54);
  text(values.omega * values.omega * values.radius > values.mu * values.g ? "当前：已超过临界" : "当前：未到临界", 28, 78);
}

function drawJsonCircularFrictionGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("所需摩擦-半径", "蓝线：mω²r；红线：最大静摩擦 μmg");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var rMax = 2;
  var yMax = Math.max(values.omega * values.omega * rMax, values.mu * values.g) * 1.2;
  drawSimpleCurve(gx, gy, gw, gh, rMax, yMax, "#2563eb", function (r) { return values.omega * values.omega * r; });
  stroke("#dc2626");
  strokeWeight(2);
  var y = map(values.mu * values.g, 0, yMax, gy + gh, gy);
  line(gx, y, gx + gw, y);
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.radius, rMax), rMax);
}

function drawJsonCircularVerticalScene() {
  var values = getJsonCircularValues();
  var cx = 285;
  var cy = 245;
  var r = 130;
  var angle = values.omega * values.time - Math.PI / 2;
  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#2563eb");
  strokeWeight(3);
  line(cx, cy, cx + r * Math.cos(angle), cy + r * Math.sin(angle));
  var p = drawJsonCircleBody(cx, cy, r, angle, "#f97316", "m");
  drawVectorArrow(p.x, p.y, (cx - p.x) * 0.45, (cy - p.y) * 0.45, "#dc2626", "a");
  drawVectorArrow(p.x, p.y, 0, 62, "#64748b", "G");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("竖直圆周运动", 28, 28);
  fill("#334155");
  textSize(14);
  text("碰钉/骤停：速度瞬时不变，半径变小则 ω、a、T 变大", 28, 54);
  text("a=ω²r=" + values.acc.toFixed(2), 28, 78);
}

function drawJsonCircularVerticalGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("拉力/支持力随位置变化", "最低点最大，最高点最小；半径改变会使向心项改变");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = values.g + values.omega * values.omega * values.radius * 1.5;
  drawSimpleCurve(gx, gy, gw, gh, 2 * Math.PI, yMax, "#2563eb", function (a) {
    return values.g + values.omega * values.omega * values.radius * (1 + Math.sin(a)) / 2;
  });
  drawTimeMarker(gx, gy, gw, gh, (values.omega * values.time) % (2 * Math.PI), 2 * Math.PI);
}

function drawJsonCircularTwoBodyScene() {
  var values = getJsonCircularValues();
  var cx = 285;
  var cy = 250;
  var total = 210;
  var rHeavy = total / (1 + values.massRatio);
  var rLight = total - rHeavy;
  var angle = values.omega * values.time;
  var heavy = drawJsonCircleBody(cx, cy, rHeavy, angle + Math.PI, "#2563eb", "男");
  var light = drawJsonCircleBody(cx, cy, rLight, angle, "#f97316", "女");
  stroke("#111827");
  strokeWeight(2.5);
  line(heavy.x, heavy.y, light.x, light.y);
  noStroke();
  fill("#111827");
  circle(cx, cy, 8);
  textAlign(LEFT, TOP);
  textSize(20);
  text("双人牵连圆周运动", 28, 28);
  fill("#334155");
  textSize(14);
  text("拉力相等、角速度相同；m₁r₁=m₂r₂", 28, 54);
  text("半径比约 r重:r轻=1:" + values.massRatio.toFixed(1), 28, 78);
}

function drawJsonCircularTwoBodyGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("半径与速度比较", "同一角速度下，v=ωr；质量大者半径小、速度小");
  var gx = graphLeft + 80;
  var base = 390;
  var total = 1;
  var rHeavy = total / (1 + values.massRatio);
  var rLight = total - rHeavy;
  drawBar(gx, base, 58, rHeavy * 220, "#2563eb", "r重");
  drawBar(gx + 100, base, 58, rLight * 220, "#f97316", "r轻");
  drawBar(gx + 230, base, 58, rHeavy * values.omega * 220, "#93c5fd", "v重");
  drawBar(gx + 330, base, 58, rLight * values.omega * 220, "#fdba74", "v轻");
}

function dailyParam(key, fallback) {
  return getJsonParam(currentScene, key, fallback);
}

function drawDailyRoad(x1, y1, x2, y2, colorHex) {
  stroke(colorHex || "#111827");
  strokeWeight(5);
  line(x1, y1, x2, y2);
  stroke("#cbd5e1");
  strokeWeight(1.5);
  for (var i = 0; i <= 8; i++) {
    var x = lerp(x1, x2, i / 8);
    var y = lerp(y1, y2, i / 8);
    line(x - 12, y + 18, x + 12, y - 18);
  }
}

function drawDailyCar(x, y, angle, colorHex, labelText) {
  push();
  translate(x, y);
  rotate(angle);
  noStroke();
  fill(colorHex || "#2563eb");
  rect(-28, -14, 56, 28, 7);
  fill("#dbeafe");
  rect(-10, -11, 20, 22, 4);
  fill("#111827");
  circle(-18, 16, 9);
  circle(18, 16, 9);
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(11);
  text(labelText || "", 0, 0);
  pop();
}

function drawDailyBankedCurveScene() {
  var values = getJsonCircularValues();
  var theta = constrain(dailyParam("theta", 18), 0, 45) * Math.PI / 180;
  var mu = dailyParam("mu", 0.35);
  var speed = dailyParam("speed", 18);
  var radius = dailyParam("radius", 60);
  var isPlane = currentScene === "circular_daily_a2_airplane_turn";
  var ideal = Math.sqrt(values.g * radius * Math.tan(theta));
  var need = speed * speed / Math.max(1, radius);
  var idealAcc = values.g * Math.tan(theta);
  var diff = need - idealAcc;
  var period = Math.max(1.6, getJsonDuration(currentScene));
  var travel = (values.time % period) / period;
  var carX = lerp(122, 460, travel);
  var carY = lerp(318, 202, travel);
  var orbitCx = 282;
  var orbitCy = 354;
  var orbitR = 76;
  var orbitAngle = -Math.PI * 0.8 + travel * Math.PI * 1.45;
  drawDailyRoad(108, 324, 476, 198, "#334155");
  stroke("#cbd5e1");
  strokeWeight(1.5);
  noFill();
  arc(orbitCx, orbitCy, 2 * orbitR, 2 * orbitR, -Math.PI * 0.95, Math.PI * 0.55);
  noStroke();
  fill(isPlane ? "#0ea5e9" : "#f97316");
  circle(orbitCx + orbitR * Math.cos(orbitAngle), orbitCy + orbitR * Math.sin(orbitAngle), 14);
  drawDailyCar(carX, carY, -theta, isPlane ? "#0ea5e9" : "#2563eb", isPlane ? "机" : "车");
  drawVectorArrow(carX, carY - 8, 0, 82, "#64748b", "G");
  drawVectorArrow(carX, carY, -74 * Math.sin(theta), -74 * Math.cos(theta), "#2563eb", isPlane ? "L" : "N");
  drawVectorArrow(carX, carY, -72, 0, "#dc2626", "向心");
  drawVectorArrow(carX, carY + 18, diff >= 0 ? -70 : 70, diff >= 0 ? -18 : 18, "#f97316", "f");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text(isPlane ? "飞机水平盘旋升力" : "弯道侧滑临界", 28, 28);
  fill("#334155");
  textSize(14);
  text(isPlane ? "升力竖直分量平衡重力，水平分量提供向心力" : "理想速度 v₀=√(rg tanθ)，摩擦只负责偏离 v₀ 的部分", 28, 54);
  text("v=" + speed.toFixed(1) + "，v₀=" + ideal.toFixed(1) + "，" + (isPlane ? "倾角=" + (theta * 180 / Math.PI).toFixed(0) + "°" : "μ=" + mu.toFixed(2)), 28, 78);
}

function drawDailyBankedCurveGraph() {
  var values = getJsonCircularValues();
  var theta = constrain(dailyParam("theta", 18), 0, 45) * Math.PI / 180;
  var mu = dailyParam("mu", 0.35);
  var radius = dailyParam("radius", 60);
  var speed = dailyParam("speed", 18);
  var vmax = Math.max(12, speed * 1.6);
  var idealAcc = values.g * Math.tan(theta);
  drawGraphFrame("侧向摩擦需求-速度", "蓝线：|v²/r-g tanθ|；红线：μg");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = Math.max(mu * values.g, vmax * vmax / radius) * 1.1;
  drawSimpleCurve(gx, gy, gw, gh, vmax, yMax, "#2563eb", function (v) { return Math.abs(v * v / radius - idealAcc); });
  stroke("#dc2626");
  strokeWeight(2);
  var limitY = map(mu * values.g, 0, yMax, gy + gh, gy);
  line(gx, limitY, gx + gw, limitY);
  drawTimeMarker(gx, gy, gw, gh, Math.min(speed, vmax), vmax);
}

function drawDailyConicalCylinderScene() {
  var values = getJsonCircularValues();
  var theta = dailyParam("theta", 53) * Math.PI / 180;
  var omega = values.omega;
  var t = values.time;
  var axisX = 286;
  var topY = 98;
  var bottomY = 386;
  var topR = 148;
  var blockR = 76;
  var blockY = 250;
  var spin = omega * t;
  var blockX = axisX + blockR * Math.cos(spin);
  stroke("#111827");
  strokeWeight(3);
  line(axisX, topY - 20, axisX, bottomY + 20);
  line(axisX - topR, topY, axisX, bottomY);
  line(axisX + topR, topY, axisX, bottomY);
  stroke("#94a3b8");
  strokeWeight(1.5);
  noFill();
  ellipse(axisX, blockY, 2 * blockR, 26);
  ellipse(axisX, topY, 2 * topR, 36);
  noStroke();
  fill("#f97316");
  rect(blockX - 18, blockY - 18, 36, 36, 7);
  drawVectorArrow(blockX, blockY, axisX > blockX ? 64 : -64, 0, "#dc2626", "向心");
  drawVectorArrow(blockX, blockY, -48 * Math.cos(theta), -48 * Math.sin(theta), "#2563eb", "N");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("粗糙圆锥筒中物块", 28, 28);
  fill("#334155");
  textSize(14);
  text("A 点半径 R/2；摩擦为零时由支持力分量供向心力", 28, 54);
  text("ω=" + omega.toFixed(1) + "，θ≈" + (theta * 180 / Math.PI).toFixed(0) + "°", 28, 78);
}

function drawDailyConicalCylinderGraph() {
  var values = getJsonCircularValues();
  var theta = dailyParam("theta", 53) * Math.PI / 180;
  var radius = Math.max(0.1, dailyParam("radius", 0.5));
  var omega0 = Math.sqrt(values.g / radius / Math.tan(theta));
  drawGraphFrame("摩擦方向-角速度", "蓝线：所需向心加速度；红线：无摩擦临界");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var wMax = 6;
  var yMax = wMax * wMax * radius;
  drawSimpleCurve(gx, gy, gw, gh, wMax, yMax, "#2563eb", function (w) { return w * w * radius; });
  stroke("#dc2626");
  strokeWeight(2);
  var x0 = constrain(map(omega0, 0, wMax, gx, gx + gw), gx, gx + gw);
  line(x0, gy, x0, gy + gh);
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.omega, wMax), wMax);
}

function drawDailyHillyRoadScene() {
  var values = getJsonCircularValues();
  var speed = dailyParam("speed", 20);
  var radius = dailyParam("radius", 80);
  var phase = (values.omega * values.time) % (2 * Math.PI);
  var x = 88 + 396 * (phase / (2 * Math.PI));
  var y = 300 + 72 * Math.sin(phase);
  stroke("#111827");
  strokeWeight(5);
  noFill();
  beginShape();
  for (var i = 0; i <= 160; i++) {
    var p = i / 160;
    vertex(80 + 410 * p, 300 + 72 * Math.sin(p * 2 * Math.PI));
  }
  endShape();
  drawDailyCar(x, y - 20, 0, "#f97316", "车");
  drawVectorArrow(x, y - 24, 0, 72, "#64748b", "G");
  drawVectorArrow(x + 34, y - 12, 0, phase < Math.PI ? -80 : 92, "#16a34a", "N");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("丘陵路面爆胎位置", 28, 28);
  fill("#334155");
  textSize(14);
  text("谷底：N=mg+mv²/r 最大；桥顶：N=mg-mv²/r", 28, 54);
  text("谷底更容易爆胎", 28, 78);
}

function drawDailyHillyRoadGraph() {
  var values = getJsonCircularValues();
  var speed = dailyParam("speed", 20);
  var radius = dailyParam("radius", 80);
  var maxV = Math.max(25, speed * 1.5);
  drawGraphFrame("支持力-速度", "橙线谷底更大，蓝线桥顶更小");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = values.g + maxV * maxV / radius;
  drawSimpleCurve(gx, gy, gw, gh, maxV, yMax, "#f97316", function (v) { return values.g + v * v / radius; });
  drawSimpleCurve(gx, gy, gw, gh, maxV, yMax, "#2563eb", function (v) { return Math.max(0, values.g - v * v / radius); });
  drawTimeMarker(gx, gy, gw, gh, Math.min(speed, maxV), maxV);
}

function drawDailyCentrifugeScene() {
  var values = getJsonCircularValues();
  var omega = values.omega;
  var t = values.time;
  var cx = 250;
  var cy = 250;
  var tubeAngle = omega * t - Math.PI / 5;
  stroke("#111827");
  strokeWeight(3);
  line(cx, cy, cx + 175 * Math.cos(tubeAngle), cy + 175 * Math.sin(tubeAngle));
  noStroke();
  fill("#111827");
  circle(cx, cy, 18);
  push();
  translate(cx + 118 * Math.cos(tubeAngle), cy + 118 * Math.sin(tubeAngle));
  rotate(tubeAngle);
  fill("#e0f2fe");
  stroke("#0284c7");
  strokeWeight(2);
  rect(-20, -42, 180, 84, 18);
  noStroke();
  fill("#2563eb");
  circle(22 - 18 * Math.sin(t), -15, 18);
  fill("#dc2626");
  circle(104 + 24 * Math.sin(t), 18, 18);
  fill("#111827");
  textAlign(CENTER, CENTER);
  textSize(11);
  text("a", 22 - 18 * Math.sin(t), -15);
  text("b", 104 + 24 * Math.sin(t), 18);
  pop();
  drawVectorArrow(cx + 230, cy, 76, 0, "#dc2626", "模拟重力");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("离心分离血液", 28, 28);
  fill("#334155");
  textSize(14);
  text("等效加速度 a=ω²r，向外且随半径增大", 28, 54);
  text("轻细胞向内，重细胞向外", 28, 78);
}

function drawDailyCentrifugeGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("模拟重力加速度-半径", "a=ω²r，越远离转轴越大");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var rMax = 2;
  var yMax = values.omega * values.omega * rMax * 1.2;
  drawSimpleCurve(gx, gy, gw, gh, rMax, yMax, "#dc2626", function (r) { return values.omega * values.omega * r; });
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.radius, rMax), rMax);
}

function drawDailyAirplaneTurnScene() {
  var values = getJsonCircularValues();
  var speed = dailyParam("speed", 20);
  var radius = dailyParam("radius", 80);
  var theta = Math.atan(speed * speed / Math.max(1, values.g * radius));
  var t = values.time;
  var cx = 292;
  var cy = 265;
  var r = 124;
  var a = values.omega * t - Math.PI / 2;
  var x = cx + r * Math.cos(a);
  var y = cy + r * Math.sin(a) * 0.42;
  stroke("#cbd5e1");
  strokeWeight(2);
  noFill();
  ellipse(cx, cy, 2 * r, r * 0.84);
  push();
  translate(x, y);
  rotate(a + Math.PI / 2);
  noStroke();
  fill("#0ea5e9");
  triangle(0, -32, -18, 22, 18, 22);
  fill("#bae6fd");
  triangle(0, -8, -56, 16, 56, 16);
  pop();
  drawVectorArrow(x, y, 0, 78, "#64748b", "G");
  drawVectorArrow(x, y, -82 * Math.sin(theta), -82 * Math.cos(theta), "#2563eb", "L");
  drawVectorArrow(x, y, cx > x ? 74 : -74, 0, "#dc2626", "向心");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("飞机水平盘旋升力", 28, 28);
  fill("#334155");
  textSize(14);
  text("升力竖直分量平衡重力，水平分量提供向心力", 28, 54);
  text("L/mg=" + Math.sqrt(1 + Math.pow(speed * speed / values.g / radius, 2)).toFixed(2), 28, 78);
}

function drawDailyAirplaneTurnGraph() {
  var values = getJsonCircularValues();
  var radius = dailyParam("radius", 80);
  var speed = dailyParam("speed", 20);
  var vmax = Math.max(30, speed * 1.5);
  drawGraphFrame("升力倍数-速度", "L/mg=√(1+(v²/rg)²)");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = 3;
  drawSimpleCurve(gx, gy, gw, gh, vmax, yMax, "#2563eb", function (v) {
    return Math.sqrt(1 + Math.pow(v * v / Math.max(1, radius * values.g), 2));
  });
  drawTimeMarker(gx, gy, gw, gh, Math.min(speed, vmax), vmax);
}

function drawDailyBicycleTurnScene() {
  var values = getJsonCircularValues();
  var speed = dailyParam("speed", 9);
  var radius = dailyParam("radius", 30);
  var lean = Math.atan(speed * speed / Math.max(1, values.g * radius));
  var baseX = 280;
  var baseY = 332;
  stroke("#111827");
  strokeWeight(3);
  line(60, baseY + 36, 510, baseY + 36);
  push();
  translate(baseX, baseY);
  rotate(-lean);
  stroke("#2563eb");
  strokeWeight(4);
  line(0, 0, 0, -140);
  noStroke();
  fill("#f97316");
  circle(0, -154, 28);
  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(-34, 24, 52);
  circle(34, 24, 52);
  pop();
  drawVectorArrow(baseX, baseY - 90, 0, 82, "#64748b", "G");
  drawVectorArrow(baseX, baseY - 90, -82, 0, "#dc2626", "f");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("自行车转弯侧倾", 28, 28);
  fill("#334155");
  textSize(14);
  text("tanα=v²/(Rg)，速度越大车身越向内倾", 28, 54);
  text("v=" + speed.toFixed(1) + "，α=" + (lean * 180 / Math.PI).toFixed(1) + "°", 28, 78);
}

function drawDailyBicycleTurnGraph() {
  var values = getJsonCircularValues();
  var mu = dailyParam("mu", 0.6);
  var radius = dailyParam("radius", 30);
  var speed = dailyParam("speed", 9);
  var vmax = Math.sqrt(mu * values.g * radius);
  drawGraphFrame("侧滑临界", "蓝线：v²/R；红线：μg");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var xMax = Math.max(vmax * 1.25, speed * 1.35);
  var yMax = Math.max(mu * values.g, xMax * xMax / radius) * 1.15;
  drawSimpleCurve(gx, gy, gw, gh, xMax, yMax, "#2563eb", function (v) { return v * v / radius; });
  stroke("#dc2626");
  strokeWeight(2);
  line(gx, map(mu * values.g, 0, yMax, gy + gh, gy), gx + gw, map(mu * values.g, 0, yMax, gy + gh, gy));
  drawTimeMarker(gx, gy, gw, gh, Math.min(speed, xMax), xMax);
}

function drawDailyTubeProjectileScene() {
  var values = getJsonCircularValues();
  var t = Math.min(values.time, getJsonDuration(currentScene));
  var vx = dailyParam("vx", 3);
  var g = values.g;
  var pipeX = 170;
  var pipeY = 245;
  var pipeR = 92;
  var startX = pipeX;
  var startY = pipeY - pipeR;
  var ballX = startX + vx * 58 * t;
  var ballY = startY + 0.5 * g * 38 * t * t;
  stroke("#111827");
  strokeWeight(3);
  noFill();
  arc(pipeX, pipeY, 2 * pipeR, 2 * pipeR, Math.PI, 0);
  stroke("#cbd5e1");
  line(pipeX, pipeY, pipeX, pipeY - pipeR);
  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (var i = 0; i <= 80; i++) {
    var p = i / 80 * getJsonDuration(currentScene);
    vertex(startX + vx * 58 * p, startY + 0.5 * g * 38 * p * p);
  }
  endShape();
  noStroke();
  fill("#f97316");
  circle(ballX, ballY, 22);
  drawVectorArrow(ballX, ballY, 62, 0, "#2563eb", "vx");
  drawVectorArrow(ballX, ballY, 0, Math.min(82, g * t * 12), "#dc2626", "vy");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("半圆管道脱离平抛", 28, 28);
  fill("#334155");
  textSize(14);
  text("离开 B 点后做平抛，垂直斜面用速度方向判断", 28, 54);
  text("vx=" + vx.toFixed(1) + "，vy=gt=" + (g * t).toFixed(1), 28, 78);
}

function drawDailyTubeProjectileGraph() {
  var values = getJsonCircularValues();
  var vx = dailyParam("vx", 3);
  var duration = getJsonDuration(currentScene);
  drawGraphFrame("速度分量-时间", "平抛：vx 恒定，vy=gt");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = Math.max(vx, values.g * duration) * 1.2;
  drawSimpleCurve(gx, gy, gw, gh, duration, yMax, "#2563eb", function () { return vx; });
  drawSimpleCurve(gx, gy, gw, gh, duration, yMax, "#dc2626", function (t) { return values.g * t; });
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.time, duration), duration);
}

function drawDailyHorizontalBarScene() {
  var values = getJsonCircularValues();
  var cx = 286;
  var cy = 218;
  var r = 124;
  var a = values.omega * values.time - Math.PI / 2;
  var x = cx + r * Math.cos(a);
  var y = cy + r * Math.sin(a);
  stroke("#111827");
  strokeWeight(6);
  line(cx - 170, cy, cx + 170, cy);
  noStroke();
  fill("#111827");
  circle(cx, cy, 16);
  stroke("#cbd5e1");
  strokeWeight(1.5);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#2563eb");
  strokeWeight(5);
  line(cx, cy, x, y);
  noStroke();
  fill("#f97316");
  ellipse(x, y, 30, 46);
  drawVectorArrow(x, y, (cx - x) * 0.46, (cy - y) * 0.46, "#dc2626", "向心");
  drawVectorArrow(x, y, 0, 66, "#64748b", "G");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("单杠最高点弹力图像", 28, 28);
  fill("#334155");
  textSize(14);
  text("最高点弹力方向由 v² 与 gr 比较决定", 28, 54);
  text("零弹力条件：v²=gr", 28, 78);
}

function drawDailyHorizontalBarGraph() {
  var values = getJsonCircularValues();
  var radius = Math.max(0.1, values.radius);
  drawGraphFrame("最高点弹力 F-v²", "零点 v²=gr；右侧弹力向下");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var xMax = 25;
  var yMax = 20;
  drawSimpleCurve(gx, gy, gw, gh, xMax, yMax, "#2563eb", function (v2) {
    return Math.abs(v2 / radius - values.g);
  });
  stroke("#dc2626");
  strokeWeight(2);
  var zeroX = constrain(map(values.g * radius, 0, xMax, gx, gx + gw), gx, gx + gw);
  line(zeroX, gy, zeroX, gy + gh);
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.omega * values.omega * radius * radius, xMax), xMax);
}

function drawDailyRodTwoBallsScene() {
  var values = getJsonCircularValues();
  var angle = values.omega * values.time - Math.PI / 2;
  var ox = 285;
  var oy = 250;
  var rA = 68;
  var rB = 136;
  var ax = ox - rA * Math.cos(angle);
  var ay = oy - rA * Math.sin(angle);
  var bx = ox + rB * Math.cos(angle);
  var by = oy + rB * Math.sin(angle);
  stroke("#111827");
  strokeWeight(5);
  line(ax, ay, bx, by);
  noStroke();
  fill("#111827");
  circle(ox, oy, 16);
  fill("#2563eb");
  circle(ax, ay, 26);
  fill("#f97316");
  circle(bx, by, 26);
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(14);
  text("A", ax, ay);
  text("B", bx, by);
  drawVectorArrow(bx, by, (ox - bx) * 0.38, (oy - by) * 0.38, "#dc2626", "向心");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("轻杆双球最高点", 28, 28);
  fill("#334155");
  textSize(14);
  text("同杆同角速度，线速度与到轴距离成正比", 28, 54);
  text("rB:rA=2:1，所以 vB:vA=2:1", 28, 78);
}

function drawDailyRodTwoBallsGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("杆上两球速度比较", "同角速度：v=ωr，向心加速度 a=ω²r");
  var gx = graphLeft + 78;
  var base = 390;
  drawBar(gx, base, 56, values.omega * 1 * 80, "#2563eb", "vA");
  drawBar(gx + 96, base, 56, values.omega * 2 * 80, "#f97316", "vB");
  drawBar(gx + 220, base, 56, values.omega * values.omega * 1 * 36, "#93c5fd", "aA");
  drawBar(gx + 316, base, 56, values.omega * values.omega * 2 * 36, "#fdba74", "aB");
}

function drawDailyRattleDrumScene() {
  var values = getJsonCircularValues();
  var cx = 286;
  var cy = 190;
  var angle = values.omega * values.time;
  var leftAnchor = { x: cx - 62, y: cy };
  var rightAnchor = { x: cx + 62, y: cy };
  var aLen = 132;
  var bLen = 92;
  var ax = leftAnchor.x - aLen * Math.sin(0.72) * Math.cos(angle);
  var ay = leftAnchor.y + aLen * Math.cos(0.72);
  var bx = rightAnchor.x + bLen * Math.sin(0.46) * Math.cos(angle + 0.4);
  var by = rightAnchor.y + bLen * Math.cos(0.46);
  stroke("#111827");
  strokeWeight(5);
  line(cx, 88, cx, 360);
  noFill();
  strokeWeight(3);
  circle(cx, cy, 128);
  stroke("#2563eb");
  line(leftAnchor.x, leftAnchor.y, ax, ay);
  stroke("#f97316");
  line(rightAnchor.x, rightAnchor.y, bx, by);
  noStroke();
  fill("#2563eb");
  circle(ax, ay, 26);
  fill("#f97316");
  circle(bx, by, 26);
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(14);
  text("A", ax, ay);
  text("B", bx, by);
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("拨浪鼓双球圆周", 28, 28);
  fill("#334155");
  textSize(14);
  text("同周期同角速度，长绳对应更大夹角和更大半径", 28, 54);
}

function drawDailyRattleDrumGraph() {
  drawGraphFrame("长绳 A 与短绳 B 比较", "同角速度：l cosθ 相同，长绳半径更大");
  var gx = graphLeft + 78;
  var base = 390;
  drawBar(gx, base, 56, 170, "#2563eb", "θA");
  drawBar(gx + 92, base, 56, 120, "#f97316", "θB");
  drawBar(gx + 210, base, 56, 190, "#93c5fd", "vA");
  drawBar(gx + 302, base, 56, 130, "#fdba74", "vB");
}

function drawDailyTurntableSensorScene() {
  var values = getJsonCircularValues();
  var w2 = values.omega * values.omega;
  var cx = 285;
  var cy = 250;
  var r = 136;
  var angle = values.omega * values.time;
  var x = cx + r * Math.cos(angle);
  var y = cy + r * Math.sin(angle);
  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#2563eb");
  line(cx, cy, x, y);
  noStroke();
  fill("#f97316");
  rect(x - 28, y - 20, 56, 40, 7);
  fill("#2563eb");
  rect(x - 20, y - 52, 40, 30, 7);
  fill("#111827");
  circle(cx, cy, 14);
  drawVectorArrow(x, y, (cx - x) * 0.46, (cy - y) * 0.46, "#dc2626", "F");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("转盘叠块传感器", 28, 28);
  fill("#334155");
  textSize(14);
  text("F 随 ω² 分段变化；A 开始滑动后斜率改变", 28, 54);
  text("ω²=" + w2.toFixed(1) + "，F=" + dailyTurntableForce(w2).toFixed(1) + "N", 28, 78);
}

function dailyTurntableForce(w2) {
  if (w2 <= 4) {
    return 0;
  }
  if (w2 <= 16) {
    return 0.5 * w2 - 2;
  }
  return 0.25 * w2 + 2;
}

function drawDailyTurntableSensorGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("传感器读数 F-ω²", "分段：0、0.5ω²-2、0.25ω²+2");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var xMax = 24;
  var yMax = 9;
  drawSimpleCurve(gx, gy, gw, gh, xMax, yMax, "#2563eb", dailyTurntableForce);
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.omega * values.omega, xMax), xMax);
}

function drawDailyCarPassengersScene() {
  var values = getJsonCircularValues();
  var cx = 120;
  var cy = 395;
  var angle = -0.95 + values.omega * values.time * 0.35;
  var rA = 150;
  var rB = 230;
  var ax = cx + rA * Math.cos(angle);
  var ay = cy + rA * Math.sin(angle);
  var bx = cx + rB * Math.cos(angle);
  var by = cy + rB * Math.sin(angle);
  stroke("#cbd5e1");
  strokeWeight(18);
  noFill();
  arc(cx, cy, 2 * rB, 2 * rB, -1.25, -0.15);
  stroke("#94a3b8");
  strokeWeight(2);
  arc(cx, cy, 2 * rA, 2 * rA, -1.25, -0.15);
  noStroke();
  fill("#2563eb");
  circle(ax, ay, 28);
  fill("#f97316");
  circle(bx, by, 28);
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(14);
  text("A", ax, ay);
  text("B", bx, by);
  drawVectorArrow(ax, ay, cx - ax, cy - ay, "#2563eb", "aA");
  drawVectorArrow(bx, by, (cx - bx) * 0.7, (cy - by) * 0.7, "#dc2626", "aB");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("汽车转弯乘员比较", 28, 28);
  fill("#334155");
  textSize(14);
  text("同车转弯角速度相同；外侧乘客半径更大", 28, 54);
}

function drawDailyCarPassengersGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("同角速度下的半径效应", "B 在外侧：v 和 a 都更大");
  var gx = graphLeft + 80;
  var base = 390;
  drawBar(gx, base, 58, 110, "#2563eb", "vA");
  drawBar(gx + 92, base, 58, 174, "#f97316", "vB");
  drawBar(gx + 218, base, 58, 105, "#93c5fd", "aA");
  drawBar(gx + 310, base, 58, 170, "#fdba74", "aB");
}

function drawDailyBicycleMudScene() {
  var values = getJsonCircularValues();
  var cx = 286;
  var cy = 250;
  var r = 132;
  var angle = values.omega * values.time - Math.PI / 2;
  var x = cx + r * Math.cos(angle);
  var y = cy + r * Math.sin(angle);
  stroke("#111827");
  strokeWeight(4);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (var i = 0; i < 12; i++) {
    var a = i * Math.PI / 6 + angle;
    line(cx, cy, cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  noStroke();
  fill("#a16207");
  ellipse(x, y, 28, 20);
  drawVectorArrow(x, y, (cx - x) * 0.42, (cy - y) * 0.42, "#dc2626", "向心");
  drawVectorArrow(x, y, 0, 66, "#64748b", "G");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("车轮泥巴脱落", 28, 28);
  fill("#334155");
  textSize(14);
  text("最高点重力帮忙提供向心力，附着力需求最小", 28, 54);
}

function drawDailyBicycleMudGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("附着力需求-位置", "最高点最小，最容易被甩下");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = values.omega * values.omega * values.radius + values.g;
  drawSimpleCurve(gx, gy, gw, gh, 2 * Math.PI, yMax, "#a16207", function (a) {
    return Math.max(0, values.omega * values.omega * values.radius - values.g * Math.cos(a));
  });
  drawTimeMarker(gx, gy, gw, gh, (values.omega * values.time) % (2 * Math.PI), 2 * Math.PI);
}

function drawDailyBoxVerticalCircleScene() {
  var values = getJsonCircularValues();
  var cx = 286;
  var cy = 250;
  var r = 126;
  var a = values.omega * values.time - Math.PI / 2;
  var x = cx + r * Math.cos(a);
  var y = cy + r * Math.sin(a);
  stroke("#cbd5e1");
  strokeWeight(2);
  noFill();
  circle(cx, cy, 2 * r);
  push();
  translate(x, y);
  noFill();
  stroke("#111827");
  strokeWeight(3);
  rect(-36, -36, 72, 72, 8);
  noStroke();
  fill("#f97316");
  circle(0, 0, 25);
  pop();
  drawVectorArrow(x, y, (cx - x) * 0.44, (cy - y) * 0.44, "#dc2626", "向心");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("盒内小球竖直圆", 28, 28);
  fill("#334155");
  textSize(14);
  text("最高点无作用力定速度；最低点压力为 2mg", 28, 54);
}

function drawDailyBoxVerticalCircleGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("盒壁作用力-位置", "最高点 0，最低点 2mg");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  drawSimpleCurve(gx, gy, gw, gh, 2 * Math.PI, 2.2, "#2563eb", function (a) {
    return 1 - Math.cos(a);
  });
  drawTimeMarker(gx, gy, gw, gh, (values.omega * values.time) % (2 * Math.PI), 2 * Math.PI);
}

function drawDailyStringTensionScene() {
  var values = getJsonCircularValues();
  var cx = 286;
  var cy = 250;
  var r = 128;
  var a = values.omega * values.time - Math.PI / 2;
  var x = cx + r * Math.cos(a);
  var y = cy + r * Math.sin(a);
  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#2563eb");
  strokeWeight(4);
  line(cx, cy, x, y);
  noStroke();
  fill("#f97316");
  circle(x, y, 28);
  drawVectorArrow(x, y, (cx - x) * 0.46, (cy - y) * 0.46, "#2563eb", "T");
  drawVectorArrow(x, y, 0, 66, "#64748b", "G");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("最高点绳拉力图像", 28, 28);
  fill("#334155");
  textSize(14);
  text("最高点：T=m v²/L-mg，图像斜率为 m/L", 28, 54);
}

function drawDailyStringTensionGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("最高点 T-v² 图像", "横轴交点 b 对应 T=0");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var xMax = 25;
  var yMax = 18;
  drawSimpleCurve(gx, gy, gw, gh, xMax, yMax, "#2563eb", function (v2) {
    return Math.max(0, v2 / Math.max(0.1, values.radius) - values.g);
  });
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.g * values.radius, xMax), xMax);
}

function drawDailyStackedTurntableScene() {
  var values = getJsonCircularValues();
  var cx = 286;
  var cy = 250;
  var r = 128;
  var a = values.omega * values.time;
  var x = cx + r * Math.cos(a);
  var y = cy + r * Math.sin(a);
  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);
  noStroke();
  fill("#f97316");
  rect(x - 34, y - 21, 68, 42, 7);
  fill("#2563eb");
  rect(x - 24, y - 55, 48, 30, 7);
  drawVectorArrow(x, y, (cx - x) * 0.46, (cy - y) * 0.46, "#16a34a", "盘摩擦");
  drawVectorArrow(x, y - 40, (cx - x) * 0.34, (cy - y) * 0.34, "#dc2626", "甲乙摩擦");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("叠放物块转盘临界", 28, 28);
  fill("#334155");
  textSize(14);
  text("甲靠乙摩擦，整体靠盘面摩擦；较小 μ 决定临界", 28, 54);
}

function drawDailyStackedTurntableGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("两处静摩擦临界", "比较甲乙面与盘面的最大允许角速度");
  var gx = graphLeft + 96;
  var base = 390;
  var mu2 = values.mu;
  var mu1 = values.mu + 0.25;
  drawBar(gx, base, 72, Math.sqrt(mu1 * values.g / values.radius) * 62, "#2563eb", "甲乙");
  drawBar(gx + 130, base, 72, Math.sqrt(mu2 * values.g / values.radius) * 62, "#f97316", "盘面");
  drawBar(gx + 276, base, 72, values.omega * 62, "#16a34a", "当前");
}

function drawDailyInclinedSandScene() {
  var values = getJsonCircularValues();
  var theta = dailyParam("theta", 20) * Math.PI / 180;
  var mu = dailyParam("mu", 0.65);
  var cx = 285;
  var cy = 250;
  var angle = values.omega * values.time;
  var remain = 90;
  push();
  translate(cx, cy);
  rotate(-theta);
  fill("#f8fafc");
  stroke("#111827");
  strokeWeight(3);
  ellipse(0, 0, 280, 112);
  noStroke();
  fill("#facc15");
  ellipse(0, 0, 2 * remain, 36);
  fill("#eab308");
  for (var i = 0; i < 24; i++) {
    var a = angle + i * 0.7;
    var rr = 62 + (i % 5) * 16;
    circle(rr * Math.cos(a), 18 * Math.sin(a), 5);
  }
  pop();
  drawVectorArrow(cx + 126, cy, 72, 0, "#dc2626", "甩出");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("倾斜圆盘细沙脱落", 28, 28);
  fill("#334155");
  textSize(14);
  text("剩余面积 1/9 ⇒ 剩余半径 R/3", 28, 54);
  text("临界：ω²r+g sinθ=μg cosθ，μ=" + mu.toFixed(2), 28, 78);
}

function drawDailyInclinedSandGraph() {
  var values = getJsonCircularValues();
  var theta = dailyParam("theta", 20) * Math.PI / 180;
  var mu = dailyParam("mu", 0.65);
  drawGraphFrame("沿下坡方向临界", "蓝线：ω²r+g sinθ；红线：μg cosθ");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var rMax = 1;
  var limit = mu * values.g * Math.cos(theta);
  var yMax = Math.max(limit, values.omega * values.omega * rMax + values.g * Math.sin(theta)) * 1.2;
  drawSimpleCurve(gx, gy, gw, gh, rMax, yMax, "#2563eb", function (r) { return values.omega * values.omega * r + values.g * Math.sin(theta); });
  stroke("#dc2626");
  strokeWeight(2);
  line(gx, map(limit, 0, yMax, gy + gh, gy), gx + gw, map(limit, 0, yMax, gy + gh, gy));
  drawTimeMarker(gx, gy, gw, gh, 1 / 3, rMax);
}

function drawDailyValveLightScene() {
  var values = getJsonCircularValues();
  var cx = 285;
  var cy = 250;
  var r = 128;
  var angle = values.omega * values.time + Math.PI / 2;
  var x = cx + r * Math.cos(angle);
  var y = cy + r * Math.sin(angle);
  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#cbd5e1");
  line(cx, cy, x, y);
  noStroke();
  fill("#f97316");
  rect(x - 18, y - 42, 36, 84, 12);
  fill(y > cy ? "#ef4444" : "#94a3b8");
  circle(x, y + 28, 18);
  drawVectorArrow(x, y, (x - cx) * 0.5, (y - cy) * 0.5, "#dc2626", "向外");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("自行车气嘴灯", 28, 28);
  fill("#334155");
  textSize(14);
  text("最低点重力帮忙触发，最高点重力阻碍触发", 28, 54);
  text(y > cy ? "当前更容易发光" : "当前不易发光", 28, 78);
}

function drawDailyValveLightGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("触发趋势-转角", "最低点最大，最高点最小");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = values.omega * values.omega * values.radius + values.g;
  drawSimpleCurve(gx, gy, gw, gh, 2 * Math.PI, yMax, "#f97316", function (a) {
    return Math.max(0, values.omega * values.omega * values.radius + values.g * Math.sin(a));
  });
  drawTimeMarker(gx, gy, gw, gh, (values.omega * values.time + Math.PI / 2) % (2 * Math.PI), 2 * Math.PI);
}

function drawDailyCarrierTurnScene() {
  var values = getJsonCircularValues();
  var theta = dailyParam("theta", 12) * Math.PI / 180;
  var speed = dailyParam("speed", 14);
  var radius = dailyParam("radius", 120);
  var mu = dailyParam("mu", 0.45);
  var turnCx = 168;
  var turnCy = 248;
  var turnR = 92;
  var angle = -Math.PI / 5 + values.omega * values.time;
  var shipX = turnCx + turnR * Math.cos(angle);
  var shipY = turnCy + turnR * Math.sin(angle);
  var deckCx = 386;
  var deckCy = 290;
  var deckLen = 216;
  var inwardX = -1;
  var aNeed = speed * speed / Math.max(1, radius);
  var k = (aNeed / values.g + Math.tan(theta)) / Math.max(0.05, 1 - aNeed * Math.tan(theta) / values.g);
  var safe = k <= mu;

  stroke("#cbd5e1");
  strokeWeight(2);
  noFill();
  circle(turnCx, turnCy, 2 * turnR);
  stroke("#111827");
  strokeWeight(2);
  line(turnCx, turnCy, shipX, shipY);
  push();
  translate(shipX, shipY);
  rotate(angle + Math.PI / 2);
  noStroke();
  fill("#0f766e");
  rect(-18, -34, 36, 68, 7);
  fill("#99f6e4");
  rect(-11, -18, 22, 36, 4);
  pop();
  drawVectorArrow(shipX, shipY, (turnCx - shipX) * 0.48, (turnCy - shipY) * 0.48, "#dc2626", "向心");

  stroke("#334155");
  strokeWeight(5);
  line(deckCx - deckLen / 2, deckCy - deckLen * Math.tan(theta) / 2, deckCx + deckLen / 2, deckCy + deckLen * Math.tan(theta) / 2);
  noStroke();
  fill("#2563eb");
  circle(deckCx, deckCy, 24);
  drawVectorArrow(deckCx, deckCy, 0, 76, "#64748b", "G");
  drawVectorArrow(deckCx, deckCy, 70 * Math.sin(theta), -70 * Math.cos(theta), "#2563eb", "N");
  drawVectorArrow(deckCx, deckCy, inwardX * 82 * Math.cos(theta), -82 * Math.sin(theta), safe ? "#16a34a" : "#dc2626", "f");
  drawVectorArrow(deckCx, deckCy + 38, -78, 0, "#dc2626", "向心");

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("航母外倾转弯", 28, 28);
  fill("#334155");
  textSize(14);
  text("俯视看航母顺时针转弯；截面看甲板外倾", 28, 54);
  text("摩擦需沿甲板指向圆心，f/N=" + k.toFixed(2) + "，μ=" + mu.toFixed(2), 28, 78);
}

function drawDailyCarrierTurnGraph() {
  var values = getJsonCircularValues();
  var theta = dailyParam("theta", 12) * Math.PI / 180;
  var mu = dailyParam("mu", 0.45);
  var radius = dailyParam("radius", 120);
  var speed = dailyParam("speed", 14);
  var top = Math.max(24, speed * 1.4);
  drawGraphFrame("摩擦需求-航速", "外倾时：f/N=(v²/Rg+tanθ)/(1-v²tanθ/Rg)");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = Math.max(1, mu * 1.45);
  drawSimpleCurve(gx, gy, gw, gh, top, yMax, "#2563eb", function (v) {
    var q = v * v / Math.max(1, radius) / values.g;
    return Math.max(0, Math.min(yMax, (q + Math.tan(theta)) / Math.max(0.05, 1 - q * Math.tan(theta))));
  });
  stroke("#dc2626");
  strokeWeight(2);
  line(gx, map(mu, 0, yMax, gy + gh, gy), gx + gw, map(mu, 0, yMax, gy + gh, gy));
  drawTimeMarker(gx, gy, gw, gh, Math.min(speed, top), top);
}

function drawBar(x, baseY, w, h, colorHex, labelText) {
  var graphFrameLeft = graphLeft + 50;
  var graphFrameRight = graphRight - 40;
  var graphFrameTop = 82;
  var clippedX = constrain(x, graphFrameLeft, graphFrameRight);
  var clippedRight = constrain(x + w, graphFrameLeft, graphFrameRight);
  var clippedW = clippedRight - clippedX;
  if (clippedW <= 0) {
    return;
  }
  var bh = Math.max(6, Math.min(baseY - graphFrameTop, 280, h));
  noStroke();
  fill(colorHex);
  rect(clippedX, baseY - bh, clippedW, bh, 5);
  fill("#111827");
  textAlign(CENTER, TOP);
  textSize(14);
  text(labelText, constrain(x + w / 2, graphFrameLeft + 8, graphFrameRight - 8), baseY + 8);
}

function drawGraphFrame(title, subtitle) {
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text(title, graphLeft + 24, 22);
  fill("#334155");
  textSize(14);
  text(subtitle, graphLeft + 24, 48);
  stroke("#cbd5e1");
  strokeWeight(1);
  noFill();
  rect(gx, gy, gw, gh);
  stroke("#e5e7eb");
  for (var i = 0; i <= 4; i++) {
    line(gx, gy + i * gh / 4, gx + gw, gy + i * gh / 4);
    line(gx + i * gw / 4, gy, gx + i * gw / 4, gy + gh);
  }
}

function drawSimpleCurve(gx, gy, gw, gh, xMax, yMax, colorHex, fn) {
  xMax = Math.max(0.0001, xMax);
  yMax = Math.max(0.0001, yMax);
  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  beginShape();
  for (var i = 0; i <= 120; i++) {
    var x = i * xMax / 120;
    var y = fn(x);
    if (!isFinite(y)) {
      y = 0;
    }
    vertex(
      constrain(map(x, 0, xMax, gx, gx + gw), gx, gx + gw),
      constrain(map(y, 0, yMax, gy + gh, gy), gy, gy + gh)
    );
  }
  endShape();
}

function drawSpringCoil(x, y1, y2, radius, turns, colorHex) {
  noFill();
  stroke(colorHex);
  strokeWeight(3);
  beginShape();
  vertex(x, y1);
  for (var i = 0; i <= turns * 12; i++) {
    var p = i / (turns * 12);
    var y = lerp(y1 + 14, y2 - 14, p);
    var xOffset = Math.sin(p * Math.PI * turns * 2) * radius;
    vertex(x + xOffset, y);
  }
  vertex(x, y2);
  endShape();
}

function forceDirectionVector(direction, angle) {
  direction = String(direction || "").toLowerCase();
  if (direction === "down") {
    return { x: 0, y: 1 };
  }
  if (direction === "up") {
    return { x: 0, y: -1 };
  }
  if (direction === "normal") {
    return { x: -Math.sin(angle), y: -Math.cos(angle) };
  }
  if (direction === "up-left" || direction === "upleft") {
    return { x: -0.7, y: -0.7 };
  }
  if (direction === "up-right" || direction === "upright") {
    return { x: 0.7, y: -0.7 };
  }
  if (direction === "down-left" || direction === "downleft") {
    return { x: -0.7, y: 0.7 };
  }
  if (direction === "down-right" || direction === "downright") {
    return { x: 0.7, y: 0.7 };
  }
  if (direction === "surface" || direction === "up_slope") {
    return { x: Math.cos(angle), y: -Math.sin(angle) };
  }
  if (direction === "down_slope") {
    return { x: -Math.cos(angle), y: Math.sin(angle) };
  }
  if (direction === "left") {
    return { x: -1, y: 0 };
  }
  if (direction === "right") {
    return { x: 1, y: 0 };
  }
  return { x: 0.75, y: -0.45 };
}

function forceVectorScale(force, animation) {
  var label = String(force.label || "").replace(/[^0-9A-Za-z_]/g, "");
  var params = animation.params || {};
  if (params[label]) {
    var value = Math.abs(getJsonParam(currentScene, label, params[label].value || 0));
    var maxValue = Math.max(1, Math.abs(Number(params[label].max || value || 1)));
    return 48 + 72 * Math.min(1, value / maxValue);
  }
  if (/wall/i.test(label) && params.F) {
    var fValue = Math.abs(getJsonParam(currentScene, "F", params.F.value || 0));
    var fMax = Math.max(1, Math.abs(Number(params.F.max || fValue || 1)));
    return 35 + 65 * Math.min(1, fValue / fMax);
  }
  return 95;
}

function getStudentState(sceneName, stepId) {
  var key = "fanphysics_step_ai_" + sceneName + "_" + stepId;
  var count = Number(localStorage.getItem(key) || "0");
  return {
    currentStepQuestionCount: count,
    status: count > 0 ? "提问中" : "未提问"
  };
}

function incrementStudentState(sceneName, stepId) {
  var key = "fanphysics_step_ai_" + sceneName + "_" + stepId;
  var count = Number(localStorage.getItem(key) || "0") + 1;
  localStorage.setItem(key, String(count));
}

function getAnimationState(sceneName) {
  var state = { scene: sceneName };
  if (isJsonAnimationScene(sceneName)) {
    var animation = (problemDataMap[sceneName] || {}).animation || {};
    var jsonState = getJsonAnimationState(sceneName);
    return {
      scene: sceneName,
      type: animation.type,
      level: animation.level,
      time: jsonState.time,
      playing: jsonState.playing,
      params: jsonState.values
    };
  }
  if (sceneName === "projectileBasic") {
    state.time = projT;
    state.x = projV0 * projT;
    state.y = projHeight - 0.5 * projG * projT * projT;
    state.vx = projV0;
    state.vy = -projG * projT;
    return state;
  }
  if (sceneName === "projectileSlope") {
    state.time = slopeT;
    state.vx = slopeV0;
    state.vy = -slopeG * slopeT;
    state.slopeAngle = slopeAngle;
    return state;
  }
  if (sceneName === "riverCrossing") {
    state.time = riverT;
    state.boatSpeed = riverBoatSpeed;
    state.waterSpeed = riverWaterSpeed;
    state.theta = riverTheta;
    return state;
  }
  if (sceneName === "curveForce") {
    state.forceNormal = forceNormal;
    state.forceTangential = forceTangential;
    state.forcePoint = forcePoint;
    return state;
  }
  if (sceneName === "rodConstraint") {
    state.alpha = rodAlpha;
    state.vB = rodVB;
    return state;
  }
  if (sceneName === "dualConstraintCircle") {
    state.omega = dualOmega;
    state.time = dualT;
    return state;
  }
  if (sceneName === "handRopeBreak") {
    state.alpha = handAlpha;
    state.lengthRatio = handLengthRatio;
    state.time = handT;
    return state;
  }
  state.time = typeof simTime === "number" ? Number(simTime.toFixed(2)) : null;
  return state;
}

function getOrCreateStepResponse(paragraph) {
  var tools = paragraph.nextElementSibling;
  if (tools && tools.classList.contains("step-ai-tools")) {
    return tools.querySelector(".step-ai-response");
  }
  return null;
}

function renderStepAiAnswer(target, text) {
  if (!target) {
    return;
  }
  target.innerHTML = "<p class=\"step-ai-title\">AI 解释</p>" + markdownLiteToHtml(text);
  renderMath(target);
}

function markdownLiteInlineToHtml(text) {
  var placeholders = [];
  var protectedText = String(text || "").replace(/\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/g, function (match) {
    var token = "@@MATH" + placeholders.length + "@@";
    placeholders.push(match);
    return token;
  });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  return escapeHtml(protectedText)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/@@MATH(\d+)@@/g, function (_, index) {
      return placeholders[Number(index)] || "";
    });
}

function markdownLiteToHtml(text) {
  var placeholders = [];
  var protectedText = String(text || "").replace(/\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/g, function (match) {
    var token = "@@MATH" + placeholders.length + "@@";
    placeholders.push(match);
    return token;
  });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function restoreMath(value) {
    return value.replace(/@@MATH(\d+)@@/g, function (_, index) {
      return placeholders[Number(index)] || "";
    });
  }

  function renderInline(value) {
    var escaped = escapeHtml(value);
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return restoreMath(escaped);
  }

  return protectedText.split(/\n{2,}/).map(function (part) {
    var lines = part.split("\n");
    if (lines.length > 0 && /^#{1,4}\s+/.test(lines[0])) {
      var title = lines.shift().replace(/^#{1,4}\s+/, "");
      var rest = lines.join("\n").trim();
      return "<p class=\"step-ai-subtitle\">" + renderInline(title) + "</p>" +
        (rest ? markdownLiteToHtml(restoreMath(rest)) : "");
    }
    var isList = lines.every(function (line) {
      return /^\s*[-*]\s+/.test(line);
    });
    if (isList) {
      return "<ul>" + lines.map(function (line) {
        return "<li>" + renderInline(line.replace(/^\s*[-*]\s+/, "")) + "</li>";
      }).join("") + "</ul>";
    }
    return "<p>" + lines.map(renderInline).join("<br>") + "</p>";
  }).join("");
}

function renderStepAiError(target, message) {
  if (!target) {
    return;
  }
  target.innerHTML = "<p class=\"step-ai-title\">AI 暂时不可用</p><p>" + message + "</p>";
}

async function askStepAi(paragraph, prompt, intent, fallbackStepIndex) {
  if (!paragraph) {
    return;
  }
  var block = paragraph.closest(".problem-note-block");
  if (block && block.classList.contains("is-collapsed")) {
    block.classList.remove("is-collapsed");
    var toggle = block.querySelector(".note-toggle");
    if (toggle) {
      toggle.innerText = "收起";
    }
  }
  var context = getStepContext(paragraph, prompt, intent, fallbackStepIndex);
  var target = getOrCreateStepResponse(paragraph);
  if (target) {
    target.classList.add("is-open");
    target.innerHTML = "<p class=\"step-ai-title\">AI 正在看这一小步...</p>";
  }

  try {
    var response = await fetch("/api/step-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(context)
    });
    var data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || "请求失败");
    }
    incrementStudentState(context.problemId, context.stepId);
    renderStepAiAnswer(target, data.answer);
  } catch (error) {
    renderStepAiError(target, "请确认已通过 server.py 运行，并设置 DEEPSEEK_API_KEY。错误：" + error.message);
  }
}

function renderMath(root) {
  if (window.MathJax && window.MathJax.typesetPromise) {
    if (root) {
      return window.MathJax.typesetPromise([root]);
    } else {
      return window.MathJax.typesetPromise();
    }
  }
  return Promise.resolve();
}

function scheduleSceneMath(sceneName) {
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(function () {
      renderSceneMath(sceneName);
    });
  } else {
    setTimeout(function () {
      renderSceneMath(sceneName);
    }, 0);
  }
}

function renderSceneMath(sceneName) {
  if (sceneName === "home") {
    return;
  }
  if (mathRenderedSceneMap[sceneName] || mathRenderingSceneMap[sceneName]) {
    return;
  }
  var root = document.getElementById(sceneName + "Notes");
  if (!root) {
    return;
  }
  mathRenderingSceneMap[sceneName] = true;
  renderMath(root).then(function () {
    mathRenderedSceneMap[sceneName] = true;
  }).catch(function (error) {
    console.warn("MathJax render failed", error);
  }).finally(function () {
    mathRenderingSceneMap[sceneName] = false;
  });
}

function updateModelSource(sceneName) {
  var source = modelSourceMap[sceneName];
  var sourceBox = document.getElementById("modelSource");
  if (!sourceBox) {
    return;
  }
  if (legacySceneMap[sceneName]) {
    sourceBox.style.display = "none";
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
  if (waterfallBoatSpeed * Math.sin(waterfallTheta * Math.PI / 180) < 0.25) {
    waterfallT = 0;
    waterfallPlaying = false;
  }
  waterfallT = Math.min(waterfallT, waterfallArriveTime());
  document.getElementById("waterfallWidthVal").innerText = waterfallWidth.toFixed(0);
  document.getElementById("waterfallDownstreamVal").innerText = waterfallDownstream.toFixed(0);
  document.getElementById("waterfallWaterSpeedVal").innerText = waterfallWaterSpeed.toFixed(1);
  document.getElementById("waterfallBoatSpeedVal").innerText = waterfallBoatSpeed.toFixed(1);
  document.getElementById("waterfallThetaVal").innerText = waterfallTheta.toFixed(1) + "°";
  document.getElementById("waterfallTVal").innerText = waterfallT.toFixed(2) + "s";
  document.getElementById("waterfallT").max = Math.max(2, waterfallArriveTime()).toFixed(2);
  document.getElementById("waterfallT").value = waterfallT.toFixed(2);
  document.getElementById("waterfallPlayBtn").innerText = waterfallPlaying ? "暂停" : "播放";
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
  dualT = Math.min(dualT, dualCycleTime());
  document.getElementById("dualOmegaVal").innerText = dualOmega.toFixed(2) + "√(g/l)";
  document.getElementById("dualTVal").innerText = dualT.toFixed(2) + "s";
  document.getElementById("dualT").max = Math.max(1, dualCycleTime()).toFixed(2);
  document.getElementById("dualT").value = dualT.toFixed(2);
  document.getElementById("dualPlayBtn").innerText = dualPlaying ? "暂停" : "播放";
  handT = Math.min(handT, handSceneDuration());
  document.getElementById("handAlphaVal").innerText = handAlpha.toFixed(0) + "°";
  document.getElementById("handLengthRatioVal").innerText = handLengthRatio.toFixed(1);
  document.getElementById("handTVal").innerText = handT.toFixed(2) + "s";
  document.getElementById("handT").max = Math.max(1, handSceneDuration()).toFixed(2);
  document.getElementById("handT").value = handT.toFixed(2);
  document.getElementById("handPlayBtn").innerText = handPlaying ? "暂停" : "播放";
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
  pileT = Math.min(pileT, pilePeriod());
  document.getElementById("pileMVal").innerText = pileM.toFixed(1);
  document.getElementById("pilemVal").innerText = pilem.toFixed(1);
  document.getElementById("pileLVal").innerText = pileL.toFixed(1);
  document.getElementById("pileOmegaVal").innerText = pileOmega.toFixed(1);
  document.getElementById("pileGVal").innerText = pileG.toFixed(1);
  document.getElementById("pileTVal").innerText = pileT.toFixed(2) + "s";
  document.getElementById("pileT").max = Math.max(1, pilePeriod()).toFixed(2);
  document.getElementById("pileT").value = pileT.toFixed(2);
  document.getElementById("pilePlayBtn").innerText = pilePlaying ? "暂停" : "播放";
  bowlT = Math.min(bowlT, bowlCycleTime());
  document.getElementById("bowlRVal").innerText = bowlR.toFixed(2) + "m";
  document.getElementById("bowlThetaAVal").innerText = bowlThetaA.toFixed(0) + "°";
  document.getElementById("bowlThetaBVal").innerText = bowlThetaB.toFixed(0) + "°";
  document.getElementById("bowlGVal").innerText = bowlG.toFixed(1);
  document.getElementById("bowlTVal").innerText = bowlT.toFixed(2) + "s";
  document.getElementById("bowlT").max = Math.max(1, bowlCycleTime()).toFixed(2);
  document.getElementById("bowlT").value = bowlT.toFixed(2);
  document.getElementById("bowlPlayBtn").innerText = bowlPlaying ? "暂停" : "播放";
}

function drawLayout() {
  stroke("#d7dce5");
  strokeWeight(1);
  line(animRight, 0, animRight, canvasH);
  line(graphLeft, 0, graphLeft, canvasH);

  noStroke();
  fill("#f6f8fb");
  rect(graphLeft, 0, graphRight - graphLeft, canvasH);
}
