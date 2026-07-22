// Runtime registries for animation types and FanPhysics model variants.

var sceneRendererRegistry = {};
var fanPhysicsRendererRegistry = {};

function registerSceneRenderer(type, sceneDrawer, graphDrawer) {
  if (!type || typeof sceneDrawer !== "function" || typeof graphDrawer !== "function") {
    return;
  }
  sceneRendererRegistry[type] = {
    scene: sceneDrawer,
    graph: graphDrawer
  };
}

function getSceneRenderer(type) {
  return sceneRendererRegistry[type] || null;
}

function registerFanPhysicsRenderer(sceneName, sceneDrawer, graphDrawer, options) {
  if (!sceneName || typeof sceneDrawer !== "function" || typeof graphDrawer !== "function") {
    return;
  }
  fanPhysicsRendererRegistry[sceneName] = {
    scene: sceneDrawer,
    graph: graphDrawer,
    timeKey: options && options.timeKey ? options.timeKey : "",
    duration: options && typeof options.duration === "function" ? options.duration : null
  };
}

function getFanPhysicsRenderer(sceneName) {
  return fanPhysicsRendererRegistry[sceneName] || null;
}
