var fanPhysicsModelTimeKeys = {
  doubleThrow: "throwT",
  pipeDrop: "pipeT",
  threeCar: "carT",
  inclineSlot: "slotT",
  motionCompose: "composeT",
  riverCrossing: "riverT",
  riverAdvanced: "advRiverT",
  waterfallCrossing: "waterfallT",
  dualConstraintCircle: "dualT",
  handRopeBreak: "handT",
  projectileBasic: "projT",
  projectileSlope: "slopeT",
  projectileNormal: "normalT",
  projectileWindow: "winT",
  volleyballServe: "volleyT",
  dartTarget: "dartT",
  projectileBounce: "bounceT",
  bulletCylinder: "bulletT",
  bikeGear: "bikeGearT",
  pileDriver: "pileT",
  bowlDoubleBall: "bowlT"
};

var fanPhysicsModelRenderers = {
  doubleThrow: { scene: "drawDoubleThrowScene", graph: "drawDoubleThrowGraph" },
  pipeDrop: { scene: "drawPipeDropScene", graph: "drawPipeDropGraph" },
  threeCar: { scene: "drawThreeCarScene", graph: "drawThreeCarGraph" },
  inclineSlot: { scene: "drawInclineSlotScene", graph: "drawInclineSlotGraph" },
  motionCompose: { scene: "drawComposeScene", graph: "drawComposeGraph" },
  curveForce: { scene: "drawCurveForceScene", graph: "drawCurveForceGraph" },
  riverCrossing: { scene: "drawRiverScene", graph: "drawRiverGraph" },
  riverAdvanced: { scene: "drawAdvRiverScene", graph: "drawAdvRiverGraph" },
  waterfallCrossing: { scene: "drawWaterfallScene", graph: "drawWaterfallGraph" },
  rodConstraint: { scene: "drawRodConstraintScene", graph: "drawRodConstraintGraph" },
  dualConstraintCircle: { scene: "drawDualConstraintScene", graph: "drawDualConstraintGraph" },
  handRopeBreak: { scene: "drawHandRopeScene", graph: "drawHandRopeGraph" },
  rainWindow: { scene: "drawRainScene", graph: "drawRainGraph" },
  projectileBasic: { scene: "drawProjectileScene", graph: "drawProjectileGraph" },
  projectileSlope: { scene: "drawSlopeScene", graph: "drawSlopeGraph" },
  projectileNormal: { scene: "drawNormalScene", graph: "drawNormalGraph" },
  semiCircleThrow: { scene: "drawSemiCircleScene", graph: "drawSemiCircleGraph" },
  projectileWindow: { scene: "drawWindowScene", graph: "drawWindowGraph" },
  volleyballServe: { scene: "drawVolleyScene", graph: "drawVolleyGraph" },
  dartTarget: { scene: "drawDartScene", graph: "drawDartGraph" },
  projectileBounce: { scene: "drawBounceScene", graph: "drawBounceGraph" },
  bulletCylinder: { scene: "drawBulletScene", graph: "drawBulletGraph" },
  bikeGear: { scene: "drawBikeGearScene", graph: "drawBikeGearGraph" },
  pileDriver: { scene: "drawPileScene", graph: "drawPileGraph" },
  bowlDoubleBall: { scene: "drawBowlScene", graph: "drawBowlGraph" }
};

function syncFanPhysicsModelState(sceneName) {
  var state = getJsonAnimationState(sceneName);
  Object.keys(state.values).forEach(function (key) {
    window[key] = state.values[key];
  });

  if (sceneName === "pipeDrop" && pipeH <= pipeL) {
    pipeH = Math.min(420, pipeL + 20);
    state.values.pipeH = pipeH;
  }
  if (sceneName === "inclineSlot" && slotR <= slotr) {
    slotr = Math.max(60, slotR - 10);
    state.values.slotr = slotr;
  }
  if (sceneName === "projectileBounce") {
    bounceD = Math.max(2.2, bounceD);
    bounceWallX = bounceD / 2;
    state.values.bounceD = bounceD;
  }

  var timeKey = fanPhysicsModelTimeKeys[sceneName];
  if (timeKey) {
    window[timeKey] = state.time;
  }
}

function getFanPhysicsModelDuration(sceneName) {
  syncFanPhysicsModelState(sceneName);
  if (sceneName === "doubleThrow") return throwMaxT;
  if (sceneName === "pipeDrop") return pipeLandTime();
  if (sceneName === "threeCar") return carMaxT;
  if (sceneName === "inclineSlot") return slotMaxT;
  if (sceneName === "motionCompose") return composeMaxT;
  if (sceneName === "riverCrossing") return riverArriveTime();
  if (sceneName === "riverAdvanced") return advRiverArriveTime();
  if (sceneName === "waterfallCrossing") return waterfallArriveTime();
  if (sceneName === "dualConstraintCircle") return dualCycleTime();
  if (sceneName === "handRopeBreak") return handSceneDuration();
  if (sceneName === "projectileBasic") return projectileFlightTime();
  if (sceneName === "projectileSlope") return slopeMaxTime();
  if (sceneName === "projectileNormal") return normalSceneMaxTime();
  if (sceneName === "projectileWindow") return windowEndTime();
  if (sceneName === "volleyballServe") return volleyFlightTime();
  if (sceneName === "dartTarget") return dartFlightTime();
  if (sceneName === "projectileBounce") return bounceTotalTime();
  if (sceneName === "bulletCylinder") return bulletTransitTime();
  if (sceneName === "bikeGear") return 6;
  if (sceneName === "pileDriver") return pilePeriod();
  if (sceneName === "bowlDoubleBall") return bowlCycleTime();
  return Math.max(0.5, Number((((problemDataMap[sceneName] || {}).animation || {}).timeline || {}).duration || 4));
}

function drawFanPhysicsModelScene() {
  var renderer = fanPhysicsModelRenderers[currentScene];
  syncFanPhysicsModelState(currentScene);
  var sceneDrawer = renderer ? window[renderer.scene] : null;
  if (sceneDrawer) {
    sceneDrawer();
  }
}

function drawFanPhysicsModelGraph() {
  var renderer = fanPhysicsModelRenderers[currentScene];
  var graphDrawer = renderer ? window[renderer.graph] : null;
  if (graphDrawer) {
    graphDrawer();
  }
}
