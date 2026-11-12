void main();

async function main() {
  const form = document.querySelector("#settings");
  const status = document.querySelector("#status");
  const keysRoot = document.querySelector("#keys");
  let settings = await PicoSettings.load();
  let capturing = null;
  let statusTimer = 0;

  function renderI18n() {
    PicoI18n.applyToDOM(document, settings.language);
    document.title = PicoI18n.t("optionsTitle", null, settings.language);
    fillAllSelects();
    buildKeys();
    fill();
  }

  renderI18n();

  form.addEventListener("change", (event) => {
    const isLangChange = event.target?.name === "language";
    readForm();
    if (isLangChange) {
      renderI18n();
    }
    void persist();
  });

  document.querySelector("#reset").addEventListener("click", () => {
    settings = PicoSettings.normalize(null);
    renderI18n();
    void persist();
  });

  function fillAllSelects() {
    const selectNames = ["language", "backgroundMode", "startZoom", "position", "controls"];
    for (const name of selectNames) {
      const select = form.elements[name];
      if (!select) continue;
      const currentVal = settings[name] || select.value;
      select.replaceChildren();
      for (const [value, label] of PicoSettings.getChoices(name, settings.language)) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        select.append(option);
      }
      select.value = currentVal;
    }
  }

  function buildKeys() {
    keysRoot.replaceChildren();
    for (const [name, label] of PicoSettings.getKeyFields(settings.language)) {
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
    const choiceNames = Object.keys(PicoSettings.CHOICE_DEFS);
    for (const name of choiceNames) {
      if (form.elements[name]) form.elements[name].value = settings[name];
    }
    form.elements.backgroundColor.value = settings.backgroundColor;
    form.elements.backgroundColorSvg.value = settings.backgroundColorSvg;
    for (const name of ["smooth", "keepInside", "closeOnBackgroundClick", "openInCurrentTab", "invertZoom", "invertVertical", "invertHorizontal", "invertRotate"]) {
      form.elements[name].checked = settings[name];
    }
    paintKeyButtons();
  }

  function readForm() {
    const next = { ...settings, keys: { ...settings.keys } };
    const choiceNames = Object.keys(PicoSettings.CHOICE_DEFS);
    for (const name of choiceNames) {
      if (form.elements[name]) next[name] = form.elements[name].value;
    }
    next.backgroundColor = form.elements.backgroundColor.value;
    next.backgroundColorSvg = form.elements.backgroundColorSvg.value;
    for (const name of ["smooth", "keepInside", "closeOnBackgroundClick", "openInCurrentTab", "invertZoom", "invertVertical", "invertHorizontal", "invertRotate"]) {
      next[name] = form.elements[name].checked;
    }
    settings = PicoSettings.normalize(next);
  }

  function paintKeyButtons() {
    const keyFields = PicoSettings.getKeyFields(settings.language);
    for (const button of keysRoot.querySelectorAll("button")) {
      const name = button.dataset.key;
      const active = capturing === name;
      button.textContent = active ? PicoI18n.t("keyPressPrompt", null, settings.language) : formatKey(settings.keys[name]);
      button.setAttribute("aria-pressed", active ? "true" : "false");
      const field = keyFields.find(([key]) => key === name);
      const label = field ? field[1] : name;
      button.setAttribute(
        "aria-label",
        active
          ? PicoI18n.t("keyWaitingAria", [label], settings.language)
          : PicoI18n.t("keyCurrentAria", [label, formatKey(settings.keys[name])], settings.language)
      );
    }
  }

  function formatKey(key) {
    if (!key) return PicoI18n.t("keyNotSet", null, settings.language);
    const names = {
      Escape: "Esc",
      ArrowUp: "↑",
      ArrowDown: "↓",
      ArrowLeft: "←",
      ArrowRight: "→",
      " ": PicoI18n.t("keySpace", null, settings.language)
    };
    if (names[key]) return names[key];
    return key.length === 1 ? key.toUpperCase() : key;
  }

  async function persist() {
    try {
      await PicoSettings.save(settings);
      showStatus(PicoI18n.t("statusSaved", null, settings.language), "ok");
    } catch (error) {
      console.error("保存设置失败", error);
      showStatus(PicoI18n.t("statusSaveError", null, settings.language), "error");
    }
  }

  function showStatus(message, state) {
    status.textContent = message;
    status.dataset.state = state;
    clearTimeout(statusTimer);
    if (state === "ok") statusTimer = setTimeout(() => { status.textContent = ""; }, 2000);
  }
}
