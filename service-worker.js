var CACHE_PREFIX = "fanphysics-shell-";
var CACHE_NAME = CACHE_PREFIX + "20261127-fan-subpath-01";
var APP_SHELL = [
  "/fan/",
  "/fan/classical-mechanics-demo.html",
  "/fan/manifest.webmanifest",
  "/fan/icons/fanphysics-192.png",
  "/fan/icons/fanphysics-512.png",
  "/fan/assets/styles.css",
  "/fan/assets/learning.css",
  "/fan/assets/vendor/p5.min.js",
  "/fan/assets/learning-sync.js",
  "/fan/assets/learning-progress.js",
  "/fan/assets/learning-blocks.js",
  "/fan/assets/virtual-experiment.js",
  "/fan/assets/problem-content.js",
  "/fan/assets/learning-cycle.js",
  "/fan/assets/problem-favorites.js",
  "/fan/assets/notebooklm-home.js",
  "/fan/assets/problem-note-interactions.js",
  "/fan/assets/step-conversation.js",
  "/fan/assets/scene-registry.js",
  "/fan/assets/scenes/common.js",
  "/fan/assets/json-animation-runtime.js",
  "/fan/assets/app.js",
  "/fan/assets/pwa.js",
  "/fan/data/problems/index.json",
  "/fan/data/learning-progress.json"
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
  if (url.origin !== self.location.origin || url.pathname.indexOf("/fan/api/") === 0) return;
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, "/fan/classical-mechanics-demo.html"));
    return;
  }
  if (url.pathname === "/fan/data/problems/index.json" || url.pathname === "/fan/data/learning-progress.json") {
    event.respondWith(networkFirst(request));
    return;
  }
  if (
    url.pathname.indexOf("/fan/assets/") === 0 ||
    url.pathname.indexOf("/fan/icons/") === 0 ||
    url.pathname === "/fan/manifest.webmanifest"
  ) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
