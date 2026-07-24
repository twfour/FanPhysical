(function () {
  "use strict";

  function createNotebookCard(item) {
    var card = document.createElement("article");
    card.className = "home-card notebooklm-home-card";

    var copy = document.createElement("div");
    copy.className = "notebooklm-home-copy";

    var title = document.createElement("strong");
    title.innerText = item.chapter;
    copy.appendChild(title);

    var hint = document.createElement("span");
    hint.innerText = "在 NotebookLM 中打开章节笔记";
    copy.appendChild(hint);
    card.appendChild(copy);

    var actions = document.createElement("div");
    actions.className = "notebooklm-home-actions";

    var chapterLink = document.createElement("a");
    chapterLink.href = item.chapterPath;
    chapterLink.innerText = "章节页";
    actions.appendChild(chapterLink);

    var notebookLink = document.createElement("a");
    notebookLink.className = "primary";
    notebookLink.href = item.url;
    notebookLink.target = "_blank";
    notebookLink.rel = "noopener noreferrer";
    notebookLink.innerText = "打开笔记";
    actions.appendChild(notebookLink);

    card.appendChild(actions);
    return card;
  }

  function renderNotebookLinks(items) {
    var grid = document.getElementById("notebooklmHomeGrid");
    if (!grid) {
      return;
    }
    grid.innerHTML = "";
    if (!items.length) {
      var empty = document.createElement("p");
      empty.className = "home-empty-copy";
      empty.innerText = "暂未配置 NotebookLM 章节笔记。";
      grid.appendChild(empty);
      return;
    }
    items.forEach(function (item) {
      grid.appendChild(createNotebookCard(item));
    });
  }

  function loadNotebookLinks() {
    fetch("/api/notebooklm-links", { credentials: "same-origin" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("NotebookLM links unavailable");
        }
        return response.json();
      })
      .then(function (payload) {
        renderNotebookLinks(Array.isArray(payload.chapters) ? payload.chapters : []);
      })
      .catch(function () {
        renderNotebookLinks([]);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadNotebookLinks, { once: true });
  } else {
    loadNotebookLinks();
  }
})();
