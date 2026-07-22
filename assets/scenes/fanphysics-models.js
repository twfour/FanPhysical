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

  var renderer = getFanPhysicsRenderer(sceneName);
  var timeKey = renderer && renderer.timeKey;
  if (timeKey) {
    window[timeKey] = state.time;
  }
}

function getFanPhysicsModelDuration(sceneName) {
  syncFanPhysicsModelState(sceneName);
  var renderer = getFanPhysicsRenderer(sceneName);
  if (renderer && renderer.duration) {
    return renderer.duration();
  }
  return Math.max(0.5, Number((((problemDataMap[sceneName] || {}).animation || {}).timeline || {}).duration || 4));
}

function drawFanPhysicsModelScene() {
  var renderer = getFanPhysicsRenderer(currentScene);
  syncFanPhysicsModelState(currentScene);
  var sceneDrawer = renderer ? renderer.scene : null;
  if (sceneDrawer) {
    sceneDrawer();
  }
}

function drawFanPhysicsModelGraph() {
  var renderer = getFanPhysicsRenderer(currentScene);
  var graphDrawer = renderer ? renderer.graph : null;
  if (graphDrawer) {
    graphDrawer();
  }
}

registerSceneRenderer("fanphysics_model", drawFanPhysicsModelScene, drawFanPhysicsModelGraph);
