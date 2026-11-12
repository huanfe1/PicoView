void main();

async function main() {
const form = document.querySelector("#settings");
const status = document.querySelector("#status");
const keysRoot = document.querySelector("#keys");
let settings = await PicoSettings.load();
let capturing = null;
let statusTimer = 0;

fillSelect("backgroundMode");
fillSelect("startZoom");
fillSelect("position");
fillSelect("controls");
buildKeys();
fill();

form.addEventListener("change", () => {
  readForm();
  void persist();
});

document.querySelector("#reset").addEventListener("click", () => {
  settings = PicoSettings.normalize(null);
  fill();
  void persist();
});

function fillSelect(name) {
  const select = form.elements[name];
  for (const [value, label] of PicoSettings.CHOICES[name]) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  }
}

function buildKeys() {
  for (const [name, label] of PicoSettings.KEY_FIELDS) {
    const text = document.createElement("span");
    text.textContent = label;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.key = name;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      capturing = capturing === name ? null : name;
      paintKeyButtons();
    });
    button.addEventListener("keydown", (event) => {
      if (event.key === "Tab") return;
      if (event.key === "ContextMenu" || (event.key === "F10" && event.shiftKey)) return;
      event.preventDefault();
      if (["Shift", "Control", "Alt", "Meta"].includes(event.key)) return;
      settings.keys[name] = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      capturing = null;
      paintKeyButtons();
      void persist();
    });
    button.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      if (!settings.keys[name] && capturing !== name) return;
      settings.keys[name] = "";
      capturing = null;
      paintKeyButtons();
      void persist();
    });
    const item = document.createElement("div");
    item.className = "key-item";
    item.append(text, button);
    keysRoot.append(item);
  }
}

function fill() {
  for (const name of Object.keys(PicoSettings.CHOICES)) form.elements[name].value = settings[name];
  form.elements.backgroundColor.value = settings.backgroundColor;
  form.elements.backgroundColorSvg.value = settings.backgroundColorSvg;
  for (const name of ["smooth", "keepInside", "closeOnBackgroundClick", "openInCurrentTab", "invertZoom", "invertVertical", "invertHorizontal", "invertRotate"]) {
    form.elements[name].checked = settings[name];
  }
  paintKeyButtons();
}

function readForm() {
  const next = { ...settings, keys: { ...settings.keys } };
  for (const name of Object.keys(PicoSettings.CHOICES)) next[name] = form.elements[name].value;
  next.backgroundColor = form.elements.backgroundColor.value;
  next.backgroundColorSvg = form.elements.backgroundColorSvg.value;
  for (const name of ["smooth", "keepInside", "closeOnBackgroundClick", "openInCurrentTab", "invertZoom", "invertVertical", "invertHorizontal", "invertRotate"]) {
    next[name] = form.elements[name].checked;
  }
  settings = PicoSettings.normalize(next);
}

function paintKeyButtons() {
  for (const button of keysRoot.querySelectorAll("button")) {
    const name = button.dataset.key;
    const active = capturing === name;
    button.textContent = active ? "请按键..." : formatKey(settings.keys[name]);
    button.setAttribute("aria-pressed", active ? "true" : "false");
    const label = PicoSettings.KEY_FIELDS.find(([key]) => key === name)[1];
    button.setAttribute("aria-label", active ? `${label}，等待按下新按键` : `${label}，当前快捷键为 ${formatKey(settings.keys[name])}`);
  }
}

function formatKey(key) {
  if (!key) return "未设置";
  const names = {
    Escape: "Esc",
    ArrowUp: "↑",
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→",
    " ": "Space (空格)"
  };
  if (names[key]) return names[key];
  return key.length === 1 ? key.toUpperCase() : key;
}

async function persist() {
  try {
    await PicoSettings.save(settings);
    showStatus("设置已保存", "ok");
  } catch (error) {
    console.error("保存设置失败", error);
    showStatus("保存设置失败", "error");
  }
}

function showStatus(message, state) {
  status.textContent = message;
  status.dataset.state = state;
  clearTimeout(statusTimer);
  if (state === "ok") statusTimer = setTimeout(() => { status.textContent = ""; }, 2000);
}
}
