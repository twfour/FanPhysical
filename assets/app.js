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
  riverAdvanced: ["速度圆", "最短位移", "矢量合成"],
  rainWindow: ["相对速度", "参考系", "速度分解"],
  rodConstraint: ["杆约束", "速度投影", "关联速度"],
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
var legacySceneMap = {
  spring: true,
  pendulum: true,
  brownian: true,
  doubleThrow: true,
  pipeDrop: true,
  threeCar: true,
  inclineSlot: true,
  riverCrossing: true,
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
  var cnv = createCanvas(canvasW, canvasH);
  cnv.parent("canvas-holder");
  pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
  textFont('"Noto Sans SC", "Microsoft YaHei", sans-serif');
  loadProblemData().then(function () {
    renderProblemDataNotes();
    renderProblemDataTree();
    renderProblemDataHome();
    enhanceProblemNotes();
    switchScene(currentScene);
  });
  enhanceProblemNotes();
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
  document.getElementById("treePileDriver").className = sceneName === "pileDriver" ? "tree-item indent active" : "tree-item indent";
  document.getElementById("treeBowlDoubleBall").className = sceneName === "bowlDoubleBall" ? "tree-item indent active" : "tree-item indent";
  document.querySelectorAll(".tree-item[data-scene]").forEach(function (item) {
    item.className = item.dataset.scene === sceneName ? "tree-item indent active" : "tree-item indent";
  });

  document.getElementById("homePanel").style.display = sceneName === "home" ? "block" : "none";
  document.getElementById("canvas-holder").style.display = shouldShowCanvas(sceneName) ? "block" : "none";
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
  document.getElementById("pileDriverControls").style.display = sceneName === "pileDriver" ? "grid" : "none";
  document.getElementById("bowlDoubleBallControls").style.display = sceneName === "bowlDoubleBall" ? "grid" : "none";
  renderJsonAnimationControls(sceneName);
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
  document.getElementById("pileDriverNotes").style.display = sceneName === "pileDriver" ? "block" : "none";
  document.getElementById("bowlDoubleBallNotes").style.display = sceneName === "bowlDoubleBall" ? "block" : "none";
  document.querySelectorAll(".problem-notes").forEach(function (note) {
    note.style.display = note.id === sceneName + "Notes" ? "block" : "none";
  });
  updateModelSource(sceneName);
  renderMath();
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
      modelSourceMap[problem.id] = normalizeProblemSource(problem);
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
    if (isProblemAnimationEnabled(problem)) {
      grid.appendChild(createProblemAnimationBlock(problem));
    }
    var analysisBlock = createProblemAnalysisBlock(problem);
    analysisBlock.dataset.analysisBlock = "1";
    grid.appendChild(analysisBlock);
    if (problem.summary && !problem.analysis) {
      grid.appendChild(createProblemNoteBlock("一句话总结", problem.summary.title || "总结", problem.summary.content || ""));
    }
  });
}

function createProblemQuestionBlock(problem) {
  var parts = [problem.question || ""];
  var options = Array.isArray(problem.options) ? problem.options : [];
  if (options.length) {
    parts.push(options.map(function (option) {
      return "- " + option;
    }).join("\n"));
  }
  var block = createProblemNoteBlock("题目", problem.title, parts.filter(Boolean).join("\n\n"));
  appendProblemImages(block, problem.images);
  return block;
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

function createProblemAnimationBlock(problem) {
  var animation = problem.animation || {};
  var params = Object.keys(animation.params || {}).map(function (key) {
    var param = animation.params[key] || {};
    return (param.label || key) + " " + formatParamValue(Number(param.value || 0), param.unit);
  }).join("，");
  var content = [
    "这道题的题干、解析、步骤来自 JSON。",
    "画图和图表不由 OCR 自动生成，而是绑定 Codex 旧方法的 `" + animation.key + "` 动画模型。",
    params ? "默认参数：" + params + "。" : ""
  ].filter(Boolean).join("\n\n");
  return createProblemNoteBlock("动画模型", "Codex 手写动画：" + animation.key, content);
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

function renderProblemDataHome() {
  var homePanel = document.getElementById("homePanel");
  if (!homePanel || !problemDataList.length) {
    return;
  }
  var oldSection = document.getElementById("jsonProblemSection");
  if (oldSection) {
    oldSection.remove();
  }
  var section = document.createElement("section");
  section.id = "jsonProblemSection";
  section.className = "home-section";
  section.innerHTML = [
    "<div class=\"section-heading\">",
    "<div>",
    "<p class=\"eyebrow\">JSON 题库</p>",
    "<h3>自动读取 /data/problems</h3>",
    "</div>",
    "</div>",
    "<div class=\"home-grid\"></div>"
  ].join("");
  var grid = section.querySelector(".home-grid");
  problemDataList.forEach(function (problem) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "home-card";
    button.onclick = function () {
      switchScene(problem.id);
    };
    var title = document.createElement("strong");
    title.innerText = problem.title;
    var meta = document.createElement("span");
    meta.innerText = [problem.chapter, (problem.knowledge || []).slice(0, 3).join(" / ")].filter(Boolean).join(" · ");
    button.appendChild(title);
    button.appendChild(meta);
    if (isProblemAnimationEnabled(problem)) {
      var badge = document.createElement("span");
      badge.className = "home-card-badge";
      badge.innerText = "Codex 动画：" + problem.animation.key;
      button.appendChild(badge);
    }
    grid.appendChild(button);
  });
  homePanel.appendChild(section);
}

function renderProblemDataTree() {
  var tree = document.getElementById("jsonProblemTree");
  var container = document.getElementById("jsonProblemTreeChildren");
  if (!tree || !container) {
    return;
  }
  container.innerHTML = "";
  tree.hidden = !problemDataList.length;
  if (!problemDataList.length) {
    return;
  }

  var groups = {};
  problemDataList.forEach(function (problem) {
    var chapter = problem.chapter || "未分类";
    if (!groups[chapter]) {
      groups[chapter] = [];
    }
    groups[chapter].push(problem);
  });

  Object.keys(groups).sort(function (a, b) {
    return a.localeCompare(b, "zh-CN");
  }).forEach(function (chapter) {
    var chapterNode = document.createElement("details");
    chapterNode.className = "tree-node";
    var summary = document.createElement("summary");
    summary.className = "tree-subfolder";
    summary.innerText = chapter;
    var children = document.createElement("div");
    children.className = "tree-children";
    groups[chapter].forEach(function (problem) {
      var button = document.createElement("button");
      button.type = "button";
      button.id = "treeJson" + toPascalId(problem.id);
      button.className = "tree-item indent";
      button.dataset.scene = problem.id;
      button.innerText = problem.title || problem.id;
      button.onclick = function () {
        switchScene(problem.id);
      };
      children.appendChild(button);
    });
    chapterNode.appendChild(summary);
    chapterNode.appendChild(children);
    container.appendChild(chapterNode);
  });
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
        body.appendChild(child);
      });
      if (index > 0) {
        block.classList.add("is-collapsed");
        var toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "note-toggle";
        toggle.innerText = "展开";
        toggle.onclick = function () {
          var collapsed = block.classList.toggle("is-collapsed");
          toggle.innerText = collapsed ? "展开" : "收起";
          renderMath();
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
    return {
      enabled: false,
      level: "none",
      type: "none",
      playable: false,
      interactive: false,
      params: {},
      timeline: { duration: 0, loop: false }
    };
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
  var fixed = Math.abs(value) >= 10 ? value.toFixed(0) : value.toFixed(1);
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
  textSize(12);
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
  textSize(18);
  text("暂未生成动画模型", 28, 30);
  fill("#5b6472");
  textSize(13);
  text("这道题已经有题干和分步解析，但 animation.type 还不是可绘制模型。", 28, 62);
  fill("#eff6ff");
  stroke("#bfdbfe");
  strokeWeight(2);
  rect(92, 138, 390, 190, 12);
  noStroke();
  fill("#2563eb");
  textAlign(CENTER, CENTER);
  textSize(18);
  text(problem.model || "待补充模型", 287, 218);
  fill("#475569");
  textSize(13);
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
  textSize(13);
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
  textSize(16);
  textAlign(LEFT, TOP);
  text("JSON 平抛动画", 24, 28);
  fill("#5b6472");
  textSize(12);
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
  textSize(16);
  text("JSON 弹簧动画", 24, 28);
  fill("#5b6472");
  textSize(12);
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
  textSize(16);
  text("JSON 受力图", 24, 28);
  fill("#5b6472");
  textSize(12);
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
  fill("#5b6472");
  textAlign(LEFT, TOP);
  textSize(12);
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
  textSize(12);
  text("t = (π-φ)/ω = " + values.time.toFixed(2) + "s", gx + 14, gy + 12);
  text("v = ωd/(π-φ) = " + values.speed.toFixed(2) + "m/s", gx + 14, gy + 34);
}

function drawGraphFrame(title, subtitle) {
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(18);
  text(title, graphLeft + 24, 22);
  fill("#5b6472");
  textSize(12);
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
  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  beginShape();
  for (var i = 0; i <= 120; i++) {
    var x = i * xMax / 120;
    var y = fn(x);
    vertex(map(x, 0, xMax, gx, gx + gw), map(y, 0, yMax, gy + gh, gy));
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
      window.MathJax.typesetPromise([root]);
    } else {
      window.MathJax.typesetPromise();
    }
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

  noStroke();
  fill("#5b6472");
  textSize(12);
  textAlign(LEFT, TOP);
  text("动画区原点 (400,250)，y 轴向上为正", 18, 16);
}
