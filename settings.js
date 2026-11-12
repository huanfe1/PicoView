globalThis.PicoSettings = (() => {
  const DEFAULTS = {
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

  const CHOICES = {
    backgroundMode: [
      ["solid", "纯色背景"],
      ["blur", "当前图片模糊虚化"]
    ],
    startZoom: [
      ["fit-if-larger", "超出窗口时自适应（推荐）"],
      ["fit", "始终自适应窗口"],
      ["actual", "原始尺寸 (100%)"]
    ],
    position: [
      ["top-left", "左上角"],
      ["top-center", "顶部居中"],
      ["top-right", "右上角"],
      ["center-left", "左侧居中"],
      ["center", "居中对齐"],
      ["center-right", "右侧居中"],
      ["bottom-left", "左下角"],
      ["bottom-center", "底部居中"],
      ["bottom-right", "右下角"]
    ],
    controls: [
      ["picoview", "缩放图片（推荐，Ctrl 切换为滚动）"],
      ["chrome", "页面滚动（原生，Ctrl 切换为缩放）"]
    ]
  };

  const KEY_FIELDS = [
    ["close", "退出查看"],
    ["pixelate", "切换像素化渲染 (去平滑)"],
    ["checker", "切换透明网格背景"],
    ["rotateLeft", "逆时针旋转 90°"],
    ["rotateRight", "顺时针旋转 90°"],
    ["flipH", "水平镜像翻转"],
    ["flipV", "垂直镜像翻转"],
    ["up", "向上平移视图"],
    ["down", "向下平移视图"],
    ["left", "向左平移视图"],
    ["right", "向右平移视图"]
  ];

  function normalize(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    const next = { ...DEFAULTS };
    if (CHOICES.backgroundMode.some(([value]) => value === source.backgroundMode)) next.backgroundMode = source.backgroundMode;
    if (CHOICES.startZoom.some(([value]) => value === source.startZoom)) next.startZoom = source.startZoom;
    if (CHOICES.position.some(([value]) => value === source.position)) next.position = source.position;
    if (CHOICES.controls.some(([value]) => value === source.controls)) next.controls = source.controls;
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

  return { DEFAULTS, CHOICES, KEY_FIELDS, normalize, load, save };
})();
