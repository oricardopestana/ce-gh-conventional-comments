/**
 * GitHub Conventional Comments Extension
 *
 * Injects a toolbar button into GitHub PR review textareas (line comments,
 * file comments, and review comments). Clicking the button opens a menu
 * to insert a conventional comment label (praise, nitpick, suggestion, etc.)
 * with optional decorations (non-blocking, blocking, if-minor).
 */

// ─── Data ──────────────────────────────────────────────────────────────────────

const LABELS = [
  { label: "praise", description: "Highlight something positive" },
  { label: "nitpick", description: "Trivial preference-based request" },
  { label: "suggestion", description: "Propose an improvement" },
  { label: "issue", description: "Highlight a specific problem" },
  { label: "todo", description: "Small necessary change" },
  { label: "question", description: "Potential concern, not sure" },
  { label: "thought", description: "An idea that popped up" },
  { label: "chore", description: "Simple task that must be done" },
  { label: "note", description: "Something to take note of" },
];

const DECORATIONS = [
  { label: "non-blocking", description: "Should not prevent acceptance" },
  { label: "blocking", description: "Should prevent acceptance until resolved" },
  { label: "if-minor", description: "Resolve only if changes are minor" },
];

// ─── Octicon SVG definitions ───────────────────────────────────────────────────

const OCTICONS = {
  praise:
    '<svg aria-hidden="true" focusable="false" class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;overflow:visible;vertical-align:text-bottom"><path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314Z"/></svg>',
  nitpick:
    '<svg aria-hidden="true" focusable="false" class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;overflow:visible;vertical-align:text-bottom"><path d="M11.5 7.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-.816 4.328a5.5 5.5 0 1 1 .644-.644l2.72 2.72a.75.75 0 1 1-1.06 1.06l-2.72-2.72Z"/></svg>',
  suggestion:
    '<svg aria-hidden="true" focusable="false" class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;overflow:visible;vertical-align:text-bottom"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 5.187 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.211c.084-.594.337-1.08.621-1.49.203-.292.45-.584.673-.848l.214-.253c.56-.679.984-1.32.984-2.304 0-2.06-1.637-3.75-4-3.75ZM5.5 12.5a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Zm.75 2a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5Z"/></svg>',
  issue:
    '<svg aria-hidden="true" focusable="false" class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;overflow:visible;vertical-align:text-bottom"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"/></svg>',
  todo: '<svg aria-hidden="true" focusable="false" class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;overflow:visible;vertical-align:text-bottom"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>',
  question:
    '<svg aria-hidden="true" focusable="false" class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;overflow:visible;vertical-align:text-bottom"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.92 6.085h.001a.75.75 0 1 1-1.342-.67c.169-.339.436-.701.811-.962.387-.269.883-.453 1.61-.453.878 0 1.535.308 1.966.727.436.423.665.996.665 1.651 0 .868-.376 1.366-.787 1.687-.218.17-.467.312-.688.434l-.04.023c-.239.132-.439.245-.596.384a1.348 1.348 0 0 0-.314.394.75.75 0 0 1-1.331-.69c.099-.19.237-.364.405-.519.28-.257.613-.42.872-.564l.036-.02c.264-.147.433-.257.569-.363.27-.211.423-.403.423-.673 0-.29-.102-.496-.277-.664-.19-.182-.495-.315-1.01-.315-.493 0-.692.156-.85.313-.154.153-.253.326-.309.47ZM9 11.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>',
  thought:
    '<svg aria-hidden="true" focusable="false" class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;overflow:visible;vertical-align:text-bottom"><path d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 13.25 12H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 13.543V12H2.75A1.75 1.75 0 0 1 1 10.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h4.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>',
  chore:
    '<svg aria-hidden="true" focusable="false" class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;overflow:visible;vertical-align:text-bottom"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7.25-3.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z"/></svg>',
  note: '<svg aria-hidden="true" focusable="false" class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;overflow:visible;vertical-align:text-bottom"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25ZM11 9.5a.75.75 0 0 0 0-1.5H7.333a.75.75 0 0 0 0 1.5Zm0-3.083a.75.75 0 0 0 0-1.5H5a.75.75 0 0 0 0 1.5ZM5.75 12.5a.75.75 0 0 1 0-1.5H11a.75.75 0 0 1 0 1.5Z"/></svg>',
  // Decorations
  "non-blocking":
    '<svg aria-hidden="true" focusable="false" class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;overflow:visible;vertical-align:text-bottom"><path d="M4.177 12.744A6.48 6.48 0 0 0 8 14.5a6.48 6.48 0 0 0 3.823-1.256L4.256 5.177A6.48 6.48 0 0 0 3 3.823l1.177 8.921ZM5.67 3.035A6.48 6.48 0 0 1 8 1.5a6.5 6.5 0 0 1 6.5 6.5 6.48 6.48 0 0 1-1.535 4.33l-7.295-7.295ZM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Z"/></svg>',
  blocking:
    '<svg aria-hidden="true" focusable="false" class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;overflow:visible;vertical-align:text-bottom"><path d="M4.47 11.53A5.477 5.477 0 0 0 8 13c1.47 0 2.807-.578 3.79-1.523L4.47 4.23A5.485 5.485 0 0 0 2.5 8a5.48 5.48 0 0 0 1.97 3.53Zm7.06-7.06A5.477 5.477 0 0 0 8 3c-1.47 0-2.807.578-3.79 1.523l7.32 7.32A5.485 5.485 0 0 0 13.5 8a5.48 5.48 0 0 0-1.97-3.53ZM8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Z"/></svg>',
  "if-minor":
    '<svg aria-hidden="true" focusable="false" class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;overflow:visible;vertical-align:text-bottom"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/></svg>',
  // Back arrow
  back: '<svg aria-hidden="true" focusable="false" class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;overflow:visible;vertical-align:text-bottom"><path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.22 8.03a.75.75 0 0 1 0-1.06l4.5-4.5a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L5.06 7h8.19a.75.75 0 0 1 0 1.5H5.06l2.72 2.72a.751.751 0 0 1 .018 1.042.751.751 0 0 1-.018.268Z"/></svg>',
  // Chevron right (for sub-menu indicator)
  chevronRight:
    '<svg aria-hidden="true" focusable="false" class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display:inline-block;overflow:visible;vertical-align:text-bottom"><path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"/></svg>',
};

// Comment bubble with smiley face icon for the toolbar button (adapted from comment.svg)
const COMMENT_ICON_SVG = [
  '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">',
  '  <path d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 13.25 12H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 13.543V12H2.75A1.75 1.75 0 0 1 1 10.25Z"/>',
  '  <circle cx="5.5" cy="7" r=".6"/>',
  '  <circle cx="10.5" cy="7" r=".6"/>',
  '  <path d="M5.5 9.5C5.5 10.5 7 11 8 11s2.5-.5 2.5-1.5"/>',
  "</svg>",
].join("\n");

// ─── Shared styles (CSS custom properties for theming) ─────────────────────────

const MENU_STYLES = {
  container: [
    "display:none;",
    "position:fixed;",
    "z-index:999999;",
    "background:#ffffff;",
    "border:1px solid #d0d7de;",
    "border-radius:6px;",
    "box-shadow:0 8px 24px rgba(140,149,159,0.2);",
    "padding:4px 0;",
    "min-width:280px;",
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif;',
    "font-size:12px;",
    "color:#1f2328;",
    "overflow:visible;",
  ].join(" "),
  actionItem: [
    "display:flex;",
    "align-items:center;",
    "gap:8px;",
    "padding:6px 8px;",
    "margin:0 8px;",
    "border-radius:4px;",
    "cursor:pointer;",
    "color:#1f2328;",
    "font-size:12px;",
    "line-height:1.5;",
    "transition:background 0s;",
  ].join(""),
  iconWrap: [
    "display:flex;",
    "align-items:center;",
    "justify-content:center;",
    "flex-shrink:0;",
    "width:20px;",
    "height:20px;",
    "color:#656d76;",
  ].join(""),
  labelText: "flex-shrink:0;font-weight:500;",
  description: [
    "color:#656d76;",
    "font-size:12px;",
    "overflow:hidden;",
    "text-overflow:ellipsis;",
    "white-space:nowrap;",
  ].join(""),
  divider: "height:1px;background:#e1e4e8;margin:4px 0;",
  hoverBg: "#e8eaed",
};

// ─── ActionList Menu (native GitHub styling) ───────────────────────────────────

function createActionItem(iconSvg, label, description, onClick) {
  const li = document.createElement("li");
  li.setAttribute("role", "menuitem");
  li.tabIndex = -1;
  li.style.cssText = "list-style:none;outline:none;";

  const content = document.createElement("div");
  content.style.cssText = MENU_STYLES.actionItem;

  // Leading visual (icon)
  const iconWrap = document.createElement("span");
  iconWrap.style.cssText = MENU_STYLES.iconWrap;
  iconWrap.innerHTML = iconSvg;
  content.appendChild(iconWrap);

  // Label text
  const labelSpan = document.createElement("span");
  labelSpan.textContent = label;
  labelSpan.style.cssText = MENU_STYLES.labelText;
  content.appendChild(labelSpan);

  // Description (if any)
  if (description) {
    const descSpan = document.createElement("span");
    descSpan.textContent = description;
    descSpan.style.cssText = MENU_STYLES.description;
    content.appendChild(descSpan);
  }

  li.appendChild(content);

  li.addEventListener("mouseenter", () => {
    content.style.background = MENU_STYLES.hoverBg;
  });
  li.addEventListener("mouseleave", () => {
    content.style.background = "";
  });
  li.addEventListener("click", onClick);

  return li;
}

function createDivider() {
  const li = document.createElement("li");
  li.setAttribute("aria-hidden", "true");
  li.style.cssText = "list-style:none;";
  const div = document.createElement("div");
  div.style.cssText = MENU_STYLES.divider;
  li.appendChild(div);
  return li;
}

// Build the labels (first-level) panel
function buildLabelsPanel() {
  const panel = document.createElement("div");

  LABELS.forEach((item) => {
    const row = createActionItem(OCTICONS[item.label] || OCTICONS.note, item.label + ":", item.description, () =>
      showDecoPanel(item.label),
    );
    panel.appendChild(row);
  });

  return panel;
}

// Build the decorations (second-level) sub-panel for a given label name
function buildDecoPanel(labelName) {
  const panel = document.createElement("div");

  // ── Back button ──
  const backLi = document.createElement("li");
  backLi.setAttribute("role", "menuitem");
  backLi.tabIndex = -1;
  backLi.style.cssText = "list-style:none;outline:none;";

  const backContent = document.createElement("div");
  backContent.style.cssText = MENU_STYLES.actionItem;

  const iconWrap = document.createElement("span");
  iconWrap.style.cssText = MENU_STYLES.iconWrap;
  iconWrap.innerHTML = OCTICONS.back;
  backContent.appendChild(iconWrap);

  const backLabel = document.createElement("span");
  backLabel.textContent = "Back";
  backLabel.style.cssText = "font-weight:500;color:#656d76;";
  backContent.appendChild(backLabel);

  backLi.appendChild(backContent);
  backLi.addEventListener("mouseenter", () => {
    backContent.style.background = MENU_STYLES.hoverBg;
  });
  backLi.addEventListener("mouseleave", () => {
    backContent.style.background = "";
  });
  backLi.addEventListener("click", () => showLabelsPanel());
  panel.appendChild(backLi);

  // Divider after back
  panel.appendChild(createDivider());

  // Options: plain label + decorated variants
  const options = [
    { text: labelName + ":", insert: labelName + ": ", desc: "" },
    ...DECORATIONS.map((d) => ({
      text: labelName + " (" + d.label + "):",
      insert: labelName + " (" + d.label + "): ",
      desc: d.description,
    })),
  ];

  options.forEach((opt) => {
    let iconSvg = OCTICONS[labelName] || OCTICONS.note;
    if (opt.desc) {
      // Find matching decoration to get its icon
      const dec = DECORATIONS.find((d) => opt.text.includes("(" + d.label + ")"));
      if (dec && OCTICONS[dec.label]) {
        iconSvg = OCTICONS[dec.label];
      }
    }

    const row = createActionItem(iconSvg, opt.text, opt.desc, () => {
      insertAtCursor(opt.insert);
      hideMenu();
    });
    panel.appendChild(row);
  });

  return panel;
}

// ─── Menu container ────────────────────────────────────────────────────────────

const menuEl = document.createElement("div");
menuEl.id = "gh-conventional-comments-menu";
menuEl.setAttribute("role", "none");
menuEl.style.cssText = MENU_STYLES.container;

const labelsPanel = buildLabelsPanel();
const decoPanel = document.createElement("div");
decoPanel.id = "gh-cc-decorations";
decoPanel.style.display = "none";

menuEl.appendChild(labelsPanel);
menuEl.appendChild(decoPanel);
document.body.appendChild(menuEl);

let activeTextarea = null;
let activeButton = null;

function showLabelsPanel() {
  labelsPanel.style.display = "";
  decoPanel.innerHTML = "";
  decoPanel.style.display = "none";
  menuEl.style.minWidth = "240px";
}

function showDecoPanel(labelName) {
  labelsPanel.style.display = "none";
  decoPanel.innerHTML = "";
  decoPanel.style.display = "";
  menuEl.style.minWidth = "280px";
  decoPanel.appendChild(buildDecoPanel(labelName));
}

function showMenu(button) {
  const rect = button.getBoundingClientRect();
  menuEl.style.display = "block";
  menuEl.style.left = rect.left + "px";
  menuEl.style.top = rect.bottom + 4 + "px";
  menuEl.style.minWidth = "240px";
  showLabelsPanel();
}

function hideMenu() {
  menuEl.style.display = "none";
  showLabelsPanel();
  activeTextarea = null;
  activeButton = null;
}

function insertAtCursor(text) {
  if (!activeTextarea) return;
  const start = activeTextarea.selectionStart;
  const end = activeTextarea.selectionEnd;
  const before = activeTextarea.value.slice(0, start);
  const after = activeTextarea.value.slice(end);
  activeTextarea.value = before + text + after;
  const newPos = start + text.length;
  activeTextarea.selectionStart = activeTextarea.selectionEnd = newPos;
  activeTextarea.dispatchEvent(new Event("input", { bubbles: true }));
  activeTextarea.focus();
}

// ─── Toolbar button injection ──────────────────────────────────────────────────

function getTextareaForToolbar(toolbar) {
  const fieldset = toolbar.closest("fieldset");
  if (!fieldset) return null;
  const textarea = fieldset.querySelector("textarea");
  if (!textarea || textarea.placeholder !== "Leave a comment") return null;
  return textarea;
}

function injectButton(toolbar) {
  // Skip if button already injected
  if (toolbar.querySelector("[data-cc-btn]")) return;

  // Find the heading button to use as an insertion anchor
  const headingIcon = toolbar.querySelector(".octicon-heading");
  if (!headingIcon) return;
  const headingBtn = headingIcon.closest("button");
  if (!headingBtn) return;

  const btn = document.createElement("button");
  btn.setAttribute("data-cc-btn", "");
  btn.setAttribute("aria-label", "Conventional comment");
  btn.type = "button";
  btn.tabIndex = -1;

  // Match GitHub's toolbar button styling
  const btnClasses = [
    "prc-Button-ButtonBase-9n-Xk",
    "ToolbarButton-module__iconButton__WwwAY",
    "prc-Button-IconButton-fyge7",
  ];
  btn.classList.add(...btnClasses);
  Object.assign(btn.dataset, {
    component: "IconButton",
    loading: "false",
    noVisuals: "true",
    size: "medium",
    variant: "invisible",
  });

  btn.innerHTML = COMMENT_ICON_SVG;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Toggle menu
    if (menuEl.style.display === "block" && activeButton === btn) {
      hideMenu();
      return;
    }

    const textarea = getTextareaForToolbar(toolbar);
    if (!textarea) return;

    activeTextarea = textarea;
    activeButton = btn;
    showMenu(btn);
  });

  // Insert before the heading button (first button in the toolbar)
  headingBtn.parentNode.insertBefore(btn, headingBtn);
}

// ─── Observe DOM for formatting toolbars ───────────────────────────────────────

function findAndInject() {
  document.querySelectorAll('[aria-label="Formatting tools"]').forEach(injectButton);
}

// Hide menu on click outside
document.addEventListener("click", (event) => {
  if (menuEl.style.display === "block" && !menuEl.contains(event.target)) {
    hideMenu();
  }
});

// Hide menu on Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuEl.style.display === "block") {
    hideMenu();
  }
});

// Observe for dynamically added toolbars (e.g. when opening a new comment)
const observer = new MutationObserver(() => {
  findAndInject();
});

observer.observe(document.body, { childList: true, subtree: true });
findAndInject();
