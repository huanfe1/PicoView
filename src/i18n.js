globalThis.PicoI18n = (() => {
  const MESSAGES = {
    en: {
      optionsTitle: "PicoView Settings",
      optionsDesc: "Configure appearance, mouse interactions, and keyboard shortcuts for standalone image tabs. Changes are saved automatically.",
      resetDefaults: "Reset to Defaults",
      statusSaved: "Settings saved",
      statusSaveError: "Failed to save settings",

      secDisplay: "Appearance & View",
      optLanguage: "Interface Language",
      optLanguageHint: "Choose the display language for PicoView settings and notifications",
      optBackgroundMode: "Background Style",
      optBackgroundModeHint: "Choose a solid background color or a blurred backdrop from the current image",
      optBackgroundColor: "Bitmap Background Color",
      optBackgroundColorHint: "Background color behind raster formats like JPG, PNG, and WebP",
      optBackgroundColorSvg: "SVG Background Color",
      optBackgroundColorSvgHint: "Independent background color for SVGs to clearly inspect transparent vector art",
      optStartZoom: "Initial Zoom",
      optStartZoomHint: "Default zoom level applied when an image is first opened",
      optPosition: "Initial Alignment",
      optPositionHint: "Alignment anchor when the image does not fill the viewport or upon initial load",
      optSmooth: "Smooth Transitions",
      optSmoothHint: "Enable smooth visual transitions during zooming, rotating, or alignment changes",
      optKeepInside: "Keep Inside Window",
      optKeepInsideHint: "Prevent the image from being dragged completely out of the viewport",
      optCloseOnBackgroundClick: "Close on Background Click",
      optCloseOnBackgroundClickHint: "Click empty background area to exit viewer or close the tab",

      secControls: "Controls & Gestures",
      optControls: "Wheel Default Mode",
      optControlsHint: "Default mouse wheel action (hold Ctrl to toggle the other action)",
      optInvertZoom: "Invert Wheel Zoom",
      optInvertZoomHint: "Invert zoom direction when scrolling up or down",
      optInvertVertical: "Invert Vertical Pan",
      optInvertVerticalHint: "Invert direction for vertical dragging or scrolling",
      optInvertHorizontal: "Invert Horizontal Pan",
      optInvertHorizontalHint: "Invert direction for horizontal dragging or Shift+wheel scrolling",
      optInvertRotate: "Invert Wheel Rotation",
      optInvertRotateHint: "Invert clockwise/counter-clockwise direction when scrolling with Alt",
      optOpenInCurrentTab: "Context Menu Item",
      optOpenInCurrentTabHint: "Show 'Open image in current tab' in the right-click menu of images",

      secKeys: "Keyboard Shortcuts",
      secKeysHint: "Click a button to record a new key; right-click an item to clear its shortcut.",
      keyPressPrompt: "Press a key...",
      keyNotSet: "Not set",
      keyWaitingAria: "{0}, waiting for new key press",
      keyCurrentAria: "{0}, currently assigned to {1}",
      keySpace: "Space",

      bgSolid: "Solid Color",
      bgBlur: "Blurred Image Backdrop",
      zoomFitIfLarger: "Fit if larger (Recommended)",
      zoomFit: "Always fit window",
      zoomActual: "Actual size (100%)",
      posTopLeft: "Top Left",
      posTopCenter: "Top Center",
      posTopRight: "Top Right",
      posCenterLeft: "Center Left",
      posCenter: "Center",
      posCenterRight: "Center Right",
      posBottomLeft: "Bottom Left",
      posBottomCenter: "Bottom Center",
      posBottomRight: "Bottom Right",
      ctrlPicoview: "Zoom image (Recommended, Ctrl to scroll)",
      ctrlChrome: "Scroll page (Native, Ctrl to zoom)",

      langAuto: "Follow System (Auto)",
      langEn: "English",
      langZhCN: "简体中文",

      keyClose: "Exit viewer",
      keyPixelate: "Toggle pixelated rendering (crisp pixels)",
      keyChecker: "Toggle checkerboard background",
      keyRotateLeft: "Rotate 90° counter-clockwise",
      keyRotateRight: "Rotate 90° clockwise",
      keyFlipH: "Flip horizontally",
      keyFlipV: "Flip vertically",
      keyUp: "Pan view up",
      keyDown: "Pan view down",
      keyLeft: "Pan view left",
      keyRight: "Pan view right",

      viewerTitle: "PicoView",
      viewerImageTitle: "PicoView Image Viewer",
      stageAriaLabel: "Image. Arrow keys to pan, mouse wheel to zoom.",
      imageLoadError: "Failed to load image.",
      imageCannotOpen: "Unable to open this image.",
      currentImage: "Current image",
      annFit: "Fit to window",
      annActual: "Actual size",
      annRotate: "Rotated {0}°",
      annFlipH: "Flipped horizontally",
      annFlipV: "Flipped vertically",
      annPixelateOn: "Pixelated rendering enabled",
      annPixelateOff: "Pixelated rendering disabled",
      annCheckerOn: "Checkerboard background enabled",
      annCheckerOff: "Checkerboard background disabled",
      annPan: "Panned",
      annPanUp: "Panned up",
      annPanDown: "Panned down",
      annPanLeft: "Panned left",
      annPanRight: "Panned right",

      contextMenuOpenImage: "Open image in current tab"
    },
    "zh-CN": {
      optionsTitle: "PicoView 设置",
      optionsDesc: "配置 PicoView 图片查看器的外观呈现、鼠标交互与快捷键偏好，修改将自动保存。",
      resetDefaults: "恢复默认设置",
      statusSaved: "设置已保存",
      statusSaveError: "保存设置失败",

      secDisplay: "外观与视图",
      optLanguage: "界面语言",
      optLanguageHint: "选择 PicoView 设置页面与交互提示的显示语言",
      optBackgroundMode: "背景样式",
      optBackgroundModeHint: "选择视口底色效果或当前图片虚化背景",
      optBackgroundColor: "常规图片背景色",
      optBackgroundColorHint: "适用于 JPG、PNG、WebP 等位图格式背后的底色",
      optBackgroundColorSvg: "SVG 矢量图背景色",
      optBackgroundColorSvgHint: "独立设置 SVG 底色，便于清晰辨识透明图案",
      optStartZoom: "初始缩放模式",
      optStartZoomHint: "新打开图片时默认采用的显示比例",
      optPosition: "初始对齐位置",
      optPositionHint: "图片未占满视口或初始加载时的定位锚点",
      optSmooth: "平滑动画过渡",
      optSmoothHint: "在缩放、旋转或对齐切换时提供平滑视觉过渡",
      optKeepInside: "拖拽平移限制在窗口内",
      optKeepInsideHint: "拖拽平移时防止图片完全移出可视区域",
      optCloseOnBackgroundClick: "点击空白背景退出查看",
      optCloseOnBackgroundClickHint: "单击图片外围空白区域时退出查看器或关闭页面",

      secControls: "操作与交互",
      optControls: "滚轮默认模式",
      optControlsHint: "鼠标滚轮默认行为（操作时按住 Ctrl 可切换另一行为）",
      optInvertZoom: "反转滚轮缩放方向",
      optInvertZoomHint: "对调滚轮向上/向下滚动时的放大与缩小逻辑",
      optInvertVertical: "反转垂直平移方向",
      optInvertVerticalHint: "反转上下拖拽或垂直滚动时的平移方向",
      optInvertHorizontal: "反转水平平移方向",
      optInvertHorizontalHint: "反转按住 Shift 滚轮滚动或水平拖拽时的平移方向",
      optInvertRotate: "反转滚轮旋转方向",
      optInvertRotateHint: "反转按住 Alt 滚轮旋转图片时的顺时针/逆时针方向",
      optOpenInCurrentTab: "网页图片右键菜单项",
      optOpenInCurrentTabHint: "在网页图片的右键菜单中显示“在当前标签页打开图片”",

      secKeys: "键盘快捷键",
      secKeysHint: "点击按键即可开始录制，按下目标键完成绑定；右键点击对应项可清除快捷键。",
      keyPressPrompt: "请按键...",
      keyNotSet: "未设置",
      keyWaitingAria: "{0}，等待按下新按键",
      keyCurrentAria: "{0}，当前快捷键为 {1}",
      keySpace: "Space (空格)",

      bgSolid: "纯色背景",
      bgBlur: "当前图片模糊虚化",
      zoomFitIfLarger: "超出窗口时自适应（推荐）",
      zoomFit: "始终自适应窗口",
      zoomActual: "原始尺寸 (100%)",
      posTopLeft: "左上角",
      posTopCenter: "顶部居中",
      posTopRight: "右上角",
      posCenterLeft: "左侧居中",
      posCenter: "居中对齐",
      posCenterRight: "右侧居中",
      posBottomLeft: "左下角",
      posBottomCenter: "底部居中",
      posBottomRight: "右下角",
      ctrlPicoview: "缩放图片（推荐，Ctrl 切换为滚动）",
      ctrlChrome: "页面滚动（原生，Ctrl 切换为缩放）",

      langAuto: "跟随系统 (Auto)",
      langEn: "English",
      langZhCN: "简体中文",

      keyClose: "退出查看",
      keyPixelate: "切换像素化渲染 (去平滑)",
      keyChecker: "切换透明网格背景",
      keyRotateLeft: "逆时针旋转 90°",
      keyRotateRight: "顺时针旋转 90°",
      keyFlipH: "水平镜像翻转",
      keyFlipV: "垂直镜像翻转",
      keyUp: "向上平移视图",
      keyDown: "向下平移视图",
      keyLeft: "向左平移视图",
      keyRight: "向右平移视图",

      viewerTitle: "PicoView",
      viewerImageTitle: "PicoView 图片查看",
      stageAriaLabel: "图片。方向键平移，滚轮缩放。",
      imageLoadError: "这张图片没有显示出来。",
      imageCannotOpen: "打不开这张图片。",
      currentImage: "当前图片",
      annFit: "适合窗口",
      annActual: "实际大小",
      annRotate: "旋转 {0} 度",
      annFlipH: "已水平翻转",
      annFlipV: "已垂直翻转",
      annPixelateOn: "像素显示已打开",
      annPixelateOff: "像素显示已关闭",
      annCheckerOn: "棋盘背景已打开",
      annCheckerOff: "棋盘背景已关闭",
      annPan: "已平移",
      annPanUp: "已向上平移",
      annPanDown: "已向下平移",
      annPanLeft: "已向左平移",
      annPanRight: "已向右平移",

      contextMenuOpenImage: "在当前标签页打开图片"
    }
  };

  function getSystemLanguage() {
    let raw = "";
    try {
      if (typeof chrome !== "undefined" && chrome.i18n?.getUILanguage) {
        raw = chrome.i18n.getUILanguage();
      }
    } catch {
      // ignore
    }
    if (!raw && typeof navigator !== "undefined") {
      raw = navigator.language || (navigator.languages && navigator.languages[0]) || "";
    }
    raw = (raw || "").toLowerCase();
    if (raw.startsWith("zh")) return "zh-CN";
    return "en";
  }

  function resolveLanguage(preferred) {
    if (preferred === "en") return "en";
    if (preferred === "zh-CN" || preferred === "zh") return "zh-CN";
    return getSystemLanguage();
  }

  function t(key, params, preferredLang) {
    const lang = resolveLanguage(preferredLang);
    const dict = MESSAGES[lang] || MESSAGES.en;
    let template = dict[key];
    if (template == null) {
      template = MESSAGES.en[key] != null ? MESSAGES.en[key] : key;
    }
    if (params == null) return template;
    if (Array.isArray(params)) {
      return template.replace(/\{(\d+)\}/g, (match, index) => {
        const val = params[Number(index)];
        return val != null ? String(val) : match;
      });
    }
    if (typeof params === "object") {
      return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, paramKey) => {
        const val = params[paramKey];
        return val != null ? String(val) : match;
      });
    }
    return template.replace(/\{0\}/g, String(params));
  }

  function applyToDOM(container = document, lang) {
    const resolved = resolveLanguage(lang);
    if (container === document && document.documentElement) {
      document.documentElement.lang = resolved;
    }

    container.querySelectorAll?.("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key, null, resolved);
    });

    container.querySelectorAll?.("[data-i18n-hint]").forEach((el) => {
      const key = el.getAttribute("data-i18n-hint");
      if (key) el.textContent = t(key, null, resolved);
    });

    container.querySelectorAll?.("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (key) el.setAttribute("title", t(key, null, resolved));
    });

    container.querySelectorAll?.("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (key) el.setAttribute("aria-label", t(key, null, resolved));
    });
  }

  return {
    MESSAGES,
    getSystemLanguage,
    resolveLanguage,
    t,
    applyToDOM
  };
})();
