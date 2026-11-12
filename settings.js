globalThis.PicoSettings = (() => {
  const DEFAULTS = {
    language: "auto",
    backgroundMode: "solid",
    backgroundColor: "#0e0e0e",
    backgroundColorSvg: "#ffffff",
    startZoom: "fit-if-larger",
    position: "center",
    controls: "picoview",
    smooth: true,
    keepInside: false,
    closeOnBackgroundClick: false,
    openInCurrentTab: true,
    invertZoom: false,
    invertVertical: false,
    invertHorizontal: false,
    invertRotate: false,
    keys: {
      close: "Escape",
      pixelate: "p",
      checker: "t",
      rotateLeft: "q",
      rotateRight: "e",
      flipH: "h",
      flipV: "v",
      up: "ArrowUp",
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight"
    }
  };

  const CHOICE_DEFS = {
    language: [
      ["auto", "langAuto"],
      ["en", "langEn"],
      ["zh-CN", "langZhCN"]
    ],
    backgroundMode: [
      ["solid", "bgSolid"],
      ["blur", "bgBlur"]
    ],
    startZoom: [
      ["fit-if-larger", "zoomFitIfLarger"],
      ["fit", "zoomFit"],
      ["actual", "zoomActual"]
    ],
    position: [
      ["top-left", "posTopLeft"],
      ["top-center", "posTopCenter"],
      ["top-right", "posTopRight"],
      ["center-left", "posCenterLeft"],
      ["center", "posCenter"],
      ["center-right", "posCenterRight"],
      ["bottom-left", "posBottomLeft"],
      ["bottom-center", "posBottomCenter"],
      ["bottom-right", "posBottomRight"]
    ],
    controls: [
      ["picoview", "ctrlPicoview"],
      ["chrome", "ctrlChrome"]
    ]
  };

  const KEY_DEFS = [
    ["close", "keyClose"],
    ["pixelate", "keyPixelate"],
    ["checker", "keyChecker"],
    ["rotateLeft", "keyRotateLeft"],
    ["rotateRight", "keyRotateRight"],
    ["flipH", "keyFlipH"],
    ["flipV", "keyFlipV"],
    ["up", "keyUp"],
    ["down", "keyDown"],
    ["left", "keyLeft"],
    ["right", "keyRight"]
  ];

  function getChoices(name, lang) {
    const list = CHOICE_DEFS[name] || [];
    return list.map(([value, i18nKey]) => [
      value,
      globalThis.PicoI18n ? PicoI18n.t(i18nKey, null, lang) : i18nKey
    ]);
  }

  function getKeyFields(lang) {
    return KEY_DEFS.map(([key, i18nKey]) => [
      key,
      globalThis.PicoI18n ? PicoI18n.t(i18nKey, null, lang) : i18nKey
    ]);
  }

  function normalize(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    const next = { ...DEFAULTS };
    if (CHOICE_DEFS.language.some(([value]) => value === source.language)) next.language = source.language;
    if (CHOICE_DEFS.backgroundMode.some(([value]) => value === source.backgroundMode)) next.backgroundMode = source.backgroundMode;
    if (CHOICE_DEFS.startZoom.some(([value]) => value === source.startZoom)) next.startZoom = source.startZoom;
    if (CHOICE_DEFS.position.some(([value]) => value === source.position)) next.position = source.position;
    if (CHOICE_DEFS.controls.some(([value]) => value === source.controls)) next.controls = source.controls;
    if (isColor(source.backgroundColor)) next.backgroundColor = source.backgroundColor;
    if (isColor(source.backgroundColorSvg)) next.backgroundColorSvg = source.backgroundColorSvg;
    for (const name of ["smooth", "keepInside", "closeOnBackgroundClick", "openInCurrentTab", "invertZoom", "invertVertical", "invertHorizontal", "invertRotate"]) {
      if (typeof source[name] === "boolean") next[name] = source[name];
    }
    const keys = { ...DEFAULTS.keys };
    if (source.keys && typeof source.keys === "object") {
      for (const name of Object.keys(DEFAULTS.keys)) {
        const value = source.keys[name];
        if (typeof value === "string" && value.length < 32) keys[name] = value;
      }
    }
    next.keys = keys;
    return next;
  }

  function isColor(value) {
    return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
  }

  async function load() {
    try {
      const stored = await chrome.storage.local.get("settings");
      return normalize(stored.settings);
    } catch (error) {
      console.error("读取设置失败", error);
      return normalize(null);
    }
  }

  async function save(settings) {
    await chrome.storage.local.set({ settings: normalize(settings) });
  }

  return {
    DEFAULTS,
    CHOICE_DEFS,
    KEY_DEFS,
    getChoices,
    getKeyFields,
    normalize,
    load,
    save
  };
})();
