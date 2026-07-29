var fanPhysicsRefreshingForUpdate = false;

function showPwaUpdateNotice(registration) {
  if (!registration || !registration.waiting || document.getElementById("pwaUpdateNotice")) return;
  var notice = document.createElement("div");
  notice.id = "pwaUpdateNotice";
  notice.className = "pwa-update-notice";
  notice.setAttribute("role", "status");
  var message = document.createElement("span");
  message.innerText = "FanPhysics 已有新版本";
  var update = document.createElement("button");
  update.type = "button";
  update.innerText = "立即更新";
  update.onclick = function () {
    fanPhysicsRefreshingForUpdate = true;
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
  };
  var dismiss = document.createElement("button");
  dismiss.type = "button";
  dismiss.className = "is-dismiss";
  dismiss.setAttribute("aria-label", "稍后更新");
  dismiss.innerText = "稍后";
  dismiss.onclick = function () {
    notice.remove();
  };
  notice.appendChild(message);
  notice.appendChild(update);
  notice.appendChild(dismiss);
  document.body.appendChild(notice);
}

function watchPwaRegistration(registration) {
  if (registration.waiting && navigator.serviceWorker.controller) {
    showPwaUpdateNotice(registration);
  }
  registration.addEventListener("updatefound", function () {
    var worker = registration.installing;
    if (!worker) return;
    worker.addEventListener("statechange", function () {
      if (worker.state === "installed" && navigator.serviceWorker.controller) {
        showPwaUpdateNotice(registration);
      }
    });
  });
}

function initializeFanPhysicsPwa() {
  if (!("serviceWorker" in navigator) || window.location.protocol === "file:") return;
  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (fanPhysicsRefreshingForUpdate) window.location.reload();
  });
  navigator.serviceWorker.register("/service-worker.js", { scope: "/" }).then(function (registration) {
    watchPwaRegistration(registration);
  }).catch(function (error) {
    console.warn("PWA registration failed", error);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeFanPhysicsPwa, { once: true });
} else {
  initializeFanPhysicsPwa();
}
