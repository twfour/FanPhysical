var CACHE_PREFIX = "fanphysics-shell-";
var CACHE_NAME = CACHE_PREFIX + "20260731-kinematics-02-15";
var APP_SHELL = [
  "/",
  "/classical-mechanics-demo.html",
  "/manifest.webmanifest",
  "/icons/fanphysics-192.png",
  "/icons/fanphysics-512.png",
  "/assets/styles.css",
  "/assets/learning.css",
  "/assets/vendor/p5.min.js",
  "/assets/learning-sync.js",
  "/assets/learning-progress.js",
  "/assets/learning-blocks.js",
  "/assets/virtual-experiment.js",
  "/assets/problem-content.js",
  "/assets/learning-cycle.js",
  "/assets/problem-favorites.js",
  "/assets/notebooklm-home.js",
  "/assets/problem-note-interactions.js",
  "/assets/step-conversation.js",
  "/assets/scene-registry.js",
  "/assets/scenes/common.js",
  "/assets/json-animation-runtime.js",
  "/assets/app.js",
  "/assets/pwa.js",
  "/data/problems/index.json",
  "/data/learning-progress.json"
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    return cache.addAll(APP_SHELL);
  }));
});

self.addEventListener("activate", function (event) {
  event.waitUntil(caches.keys().then(function (names) {
    return Promise.all(names.map(function (name) {
      if (name.indexOf(CACHE_PREFIX) === 0 && name !== CACHE_NAME) {
        return caches.delete(name);
      }
      return null;
    }));
  }).then(function () {
    return self.clients.claim();
  }));
});

self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

function networkFirst(request, fallbackUrl) {
  return fetch(request).then(function (response) {
    if (response && response.ok) {
      var copy = response.clone();
      caches.open(CACHE_NAME).then(function (cache) {
        cache.put(request, copy);
      });
    }
    return response;
  }).catch(function () {
    return caches.match(request).then(function (cached) {
      return cached || (fallbackUrl ? caches.match(fallbackUrl) : null);
    });
  });
}

function staleWhileRevalidate(request) {
  return caches.match(request).then(function (cached) {
    var refresh = fetch(request).then(function (response) {
      if (response && response.ok) {
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(request, response.clone());
        });
      }
      return response;
    }).catch(function () {
      return cached || caches.match(request, { ignoreSearch: true });
    });
    return cached || refresh;
  });
}

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;
  var url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.indexOf("/api/") === 0) return;
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, "/classical-mechanics-demo.html"));
    return;
  }
  if (url.pathname === "/data/problems/index.json" || url.pathname === "/data/learning-progress.json") {
    event.respondWith(networkFirst(request));
    return;
  }
  if (
    url.pathname.indexOf("/assets/") === 0 ||
    url.pathname.indexOf("/icons/") === 0 ||
    url.pathname === "/manifest.webmanifest"
  ) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
