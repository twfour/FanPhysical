// Problem-note enhancement and collapsible analysis steps.

function enhanceProblemNotes(root) {
  var notes = root ? [root] : document.querySelectorAll(".problem-notes");
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
      var existingBody = block.querySelector(".note-body");
      if (existingBody) {
        var existingToggle = block.querySelector(":scope > .note-toggle");
        if (existingToggle && existingToggle.dataset.toggleEnhanced !== "1") {
          existingToggle.dataset.toggleEnhanced = "1";
          existingToggle.onclick = function () {
            var collapsed = block.classList.toggle("is-collapsed");
            existingToggle.innerText = collapsed ? "展开" : "收起";
            if (!collapsed && isAnalysisNoteBlock(block)) {
              addStepAiButtons(existingBody, sceneName);
            }
            renderMath(block);
          };
        }
        wireCollapsedAnalysisSteps(existingBody, sceneName);
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
      var hasCollapsibleSteps = body.querySelector('details.analysis-step[data-collapsible-step="1"]');
      if (hasCollapsibleSteps && isAnalysisNoteBlock(block)) {
        wireCollapsedAnalysisSteps(body, sceneName);
      } else if (index > 0 && kickerText !== "近似题" && block.dataset.keepExpanded !== "1") {
        block.classList.add("is-collapsed");
        var toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "note-toggle";
        toggle.innerText = "展开";
        toggle.onclick = function () {
          var collapsed = block.classList.toggle("is-collapsed");
          toggle.innerText = collapsed ? "展开" : "收起";
          if (!collapsed && isAnalysisNoteBlock(block)) {
            addStepAiButtons(body, sceneName);
          }
          renderMath(block);
        };
        block.appendChild(toggle);
      }
      block.appendChild(body);
    });

  });
}

function wireCollapsedAnalysisSteps(body, sceneName) {
  var steps = body.querySelectorAll('details.analysis-step[data-collapsible-step="1"]');
  steps.forEach(function (step) {
    step.open = false;
    if (step.dataset.collapseEnhanced === "1") {
      return;
    }
    step.dataset.collapseEnhanced = "1";
    step.addEventListener("toggle", function () {
      if (step.open) {
        addStepConversationPanels(step, sceneName);
        renderMath(step);
      }
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

function addStepAiButtons(body, sceneName) {
  addStepConversationPanels(body, sceneName);
}
