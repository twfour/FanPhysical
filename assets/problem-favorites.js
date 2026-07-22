// Favorite storage, controls, and home-page cards.

var favoriteProblemStorageKey = "fanphysics:favoritedProblems";
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
