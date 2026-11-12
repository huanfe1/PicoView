const PicoViewer = (() => {
  const MIN_ZOOM = 0.02;
  const MAX_ZOOM = 40;
  const DRAG_THRESHOLD = 4;
  const SMOOTH_MS = 100;
  const SETTLE_MS = 180;

  function mount(container, options) {
    const viewer = new ImageViewer(container, options);
    viewer.start();
    return viewer;
  }

  class ImageViewer {
    constructor(container, options) {
      this.root = container;
      this.src = options.src;
      this.isSvg = Boolean(options.isSvg);
      this.onClose = typeof options.onClose === "function" ? options.onClose : null;
      this.settings = PicoSettings.normalize(options.settings);
      this.zoom = 1;
      this.panX = 0;
      this.panY = 0;
      this.rotation = 0;
      this.flipH = 1;
      this.flipV = 1;
      this.natW = 1;
      this.natH = 1;
      this.viewW = 1;
      this.viewH = 1;
      this.ready = false;
      this.pixelated = false;
      this.checker = false;
      this.pointer = null;
      this.motion = null;
      this.motionFrame = 0;
      this.shown = null;
      this.build();
      this.listen();
    }

    build() {
      const lang = this.settings.language;
      this.title = document.createElement("h1");
      this.title.className = "visually-hidden";
      this.title.textContent = PicoI18n.t("viewerImageTitle", null, lang);

      this.blur = document.createElement("img");
      this.blur.className = "blur";
      this.blur.alt = "";
      this.blur.setAttribute("fetchpriority", "low");

      this.photo = document.createElement("img");
      this.photo.className = "photo";
      this.photo.alt = imageName(this.src, lang);
      this.photo.draggable = true;
      this.photo.setAttribute("fetchpriority", "high");

      this.frame = document.createElement("div");
      this.frame.className = "frame";
      this.frame.append(this.photo);

      this.message = document.createElement("p");
      this.message.className = "message";
      this.message.hidden = true;

      this.stage = document.createElement("div");
      this.stage.className = "stage";
      this.stage.tabIndex = 0;
      this.stage.setAttribute("aria-label", PicoI18n.t("stageAriaLabel", null, lang));
      this.stage.append(this.blur, this.frame, this.message);

      this.live = document.createElement("div");
      this.live.className = "visually-hidden";
      this.live.setAttribute("aria-live", "polite");

      this.root.replaceChildren(this.title, this.stage, this.live);
      this.applyChrome();
    }

    listen() {
      this.stage.addEventListener("pointerdown", (event) => this.onPointerDown(event));
      this.stage.addEventListener("pointermove", (event) => this.onPointerMove(event));
      this.stage.addEventListener("lostpointercapture", () => this.onLostCapture());
      this.photo.addEventListener("dragstart", (event) => {
        if (!event.altKey) event.preventDefault();
      });
      this.photo.addEventListener("load", () => this.onLoad());
      this.photo.addEventListener("error", () => {
        this.message.hidden = false;
        this.message.textContent = PicoI18n.t("imageLoadError", null, this.settings.language);
      });
      this.onWheel = this.onWheel.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);
      this.onSettingsChanged = (changes, area) => {
        if (area !== "local" || !changes.settings) return;
        this.settings = PicoSettings.normalize(changes.settings.newValue);
        const lang = this.settings.language;
        this.title.textContent = PicoI18n.t("viewerImageTitle", null, lang);
        this.stage.setAttribute("aria-label", PicoI18n.t("stageAriaLabel", null, lang));
        this.applyChrome();
        if (this.ready) this.render();
      };
      window.addEventListener("wheel", this.onWheel, { passive: false, capture: true });
      window.addEventListener("keydown", this.onKeyDown);
      this.resizeObserver = new ResizeObserver(() => {
        this.measure();
        if (this.ready) this.render();
      });
      this.resizeObserver.observe(this.stage);
      try {
        chrome.storage.onChanged.addListener(this.onSettingsChanged);
      } catch (error) {
        console.error("监听设置失败", error);
      }
    }

    destroy() {
      window.removeEventListener("wheel", this.onWheel, { capture: true });
      window.removeEventListener("keydown", this.onKeyDown);
      this.resizeObserver?.disconnect();
      this.stopMotion();
      try {
        chrome.storage.onChanged.removeListener(this.onSettingsChanged);
      } catch (error) {
        console.error("停止监听设置失败", error);
      }
    }

    start() {
      this.blur.src = this.src;
      this.photo.src = this.src;
    }

    onLoad() {
      this.natW = this.photo.naturalWidth || this.photo.width || 1;
      this.natH = this.photo.naturalHeight || this.photo.height || 1;
      this.photo.width = this.natW;
      this.photo.height = this.natH;
      this.blur.width = this.natW;
      this.blur.height = this.natH;
      this.ready = true;
      this.message.hidden = true;
      this.measure();
      this.resetView();
      this.render();
    }

    measure() {
      this.viewW = this.stage.clientWidth || 1;
      this.viewH = this.stage.clientHeight || 1;
    }

    fitScale() {
      return Math.min(this.viewW / this.natW, this.viewH / this.natH);
    }

    resetView() {
      const fit = this.fitScale();
      if (this.settings.startZoom === "actual") this.zoom = 1;
      else if (this.settings.startZoom === "fit") this.zoom = fit;
      else this.zoom = fit < 1 ? fit : 1;
      this.placeAtAnchor();
    }

    placeAtAnchor() {
      const halfW = (this.natW * this.zoom) / 2;
      const halfH = (this.natH * this.zoom) / 2;
      const position = this.settings.position;
      const vertical = position.startsWith("top") ? "top" : position.startsWith("bottom") ? "bottom" : "center";
      const horizontal = position.endsWith("left") ? "left" : position.endsWith("right") ? "right" : "center";
      const targetX = horizontal === "left" ? halfW : horizontal === "right" ? this.viewW - halfW : this.viewW / 2;
      const targetY = vertical === "top" ? halfH : vertical === "bottom" ? this.viewH - halfH : this.viewH / 2;
      this.panX = targetX - this.viewW / 2;
      this.panY = targetY - this.viewH / 2;
    }

    matrix(zoom = this.zoom) {
      const sx = zoom * this.flipH;
      const sy = zoom * this.flipV;
      return new DOMMatrix()
        .translate(this.viewW / 2 + this.panX, this.viewH / 2 + this.panY)
        .rotate(this.rotation)
        .scale(sx, sy)
        .translate(-this.natW / 2, -this.natH / 2);
    }

    zoomAt(viewX, viewY, nextZoom) {
      if (!this.ready) return;
      const zoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
      const current = this.matrix();
      const imagePoint = current.inverse().transformPoint(new DOMPoint(viewX, viewY));
      this.zoom = zoom;
      const base = new DOMMatrix()
        .rotate(this.rotation)
        .scale(this.zoom * this.flipH, this.zoom * this.flipV)
        .translate(-this.natW / 2, -this.natH / 2)
        .transformPoint(imagePoint);
      this.panX = viewX - this.viewW / 2 - base.x;
      this.panY = viewY - this.viewH / 2 - base.y;
    }

    keepPoint(change) {
      const viewX = this.viewW / 2;
      const viewY = this.viewH / 2;
      const imagePoint = this.matrix().inverse().transformPoint(new DOMPoint(viewX, viewY));
      change();
      const base = new DOMMatrix()
        .rotate(this.rotation)
        .scale(this.zoom * this.flipH, this.zoom * this.flipV)
        .translate(-this.natW / 2, -this.natH / 2)
        .transformPoint(imagePoint);
      this.panX = viewX - this.viewW / 2 - base.x;
      this.panY = viewY - this.viewH / 2 - base.y;
    }

    clampPan() {
      if (!this.settings.keepInside) return;
      const box = this.boundingSize();
      this.panX = clampAxis(this.panX, this.viewW, box.w);
      this.panY = clampAxis(this.panY, this.viewH, box.h);
    }

    boundingSize() {
      const w = this.natW * this.zoom;
      const h = this.natH * this.zoom;
      const rad = (this.rotation * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));
      return { w: w * cos + h * sin, h: w * sin + h * cos };
    }

    motionAllowed() {
      return this.settings.smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    capture() {
      return {
        zoom: this.zoom,
        panX: this.panX,
        panY: this.panY,
        rotation: this.rotation,
        flipH: this.flipH,
        flipV: this.flipV
      };
    }

    sample(now) {
      const motion = this.motion;
      if (!motion) return this.shown || this.capture();
      return lerpView(motion.from, motion.to, this.motionProgress(motion, now));
    }

    motionProgress(motion, now) {
      const raw = (now - motion.start) / motion.duration;
      const t = Math.min(Math.max(raw, 0), 1);
      if (!motion.settle) return t;
      const remaining = 1 - t;
      return 1 - remaining * remaining * remaining;
    }

    render(smooth = false) {
      this.clampPan();
      const target = this.capture();
      const settle = smooth === "settle";
      const animate = (smooth === true || settle) && this.motionAllowed() && !this.pointer && viewMoved(this.sample(performance.now()), target);
      if (!animate) {
        this.stopMotion();
        this.paint(target);
        return;
      }
      this.motion = {
        start: performance.now(),
        from: this.sample(performance.now()),
        to: target,
        duration: settle ? SETTLE_MS : SMOOTH_MS,
        settle
      };
      this.tickMotion();
    }

    tickMotion() {
      if (this.motionFrame) return;
      this.motionFrame = window.requestAnimationFrame((now) => {
        this.motionFrame = 0;
        const motion = this.motion;
        if (!motion) return;
        const t = this.motionProgress(motion, now);
        this.paint(lerpView(motion.from, motion.to, t));
        const done = now - motion.start >= motion.duration;
        if (!done && this.motion === motion) this.tickMotion();
        else if (this.motion === motion) this.motion = null;
      });
    }

    stopMotion() {
      this.motion = null;
      if (!this.motionFrame) return;
      window.cancelAnimationFrame(this.motionFrame);
      this.motionFrame = 0;
    }

    paint(state) {
      this.shown = state;
      const sx = state.zoom * state.flipH;
      const sy = state.zoom * state.flipV;
      this.frame.style.transform = `translate(${this.viewW / 2 + state.panX}px, ${this.viewH / 2 + state.panY}px) rotate(${state.rotation}deg) scale(${sx}, ${sy}) translate(${-this.natW / 2}px, ${-this.natH / 2}px)`;
      this.zoomText = Math.round(this.zoom * 100) + "%";
    }

    applyChrome() {
      const color = this.isSvg ? this.settings.backgroundColorSvg : this.settings.backgroundColor;
      this.stage.style.backgroundColor = this.checker ? "transparent" : color;
      this.stage.classList.toggle("is-checker", this.checker);
      this.root.classList.toggle("is-blur", this.settings.backgroundMode === "blur");
      this.photo.classList.toggle("is-pixelated", this.pixelated);
    }

    onAction(action) {
      if (!this.ready && action !== "close") return;
      if (action === "zoom-out") {
        this.zoomAt(this.viewW / 2, this.viewH / 2, this.zoom / 1.25);
        this.render(true);
        this.announce(this.zoomText);
      } else if (action === "zoom-in") {
        this.zoomAt(this.viewW / 2, this.viewH / 2, this.zoom * 1.25);
        this.render(true);
        this.announce(this.zoomText);
      } else if (action === "fit") {
        this.zoomAt(this.viewW / 2, this.viewH / 2, this.fitScale());
        this.render(true);
        this.announce(PicoI18n.t("annFit", null, this.settings.language));
      } else if (action === "actual") {
        this.zoomAt(this.viewW / 2, this.viewH / 2, 1);
        this.render(true);
        this.announce(PicoI18n.t("annActual", null, this.settings.language));
      } else if (action === "rotate-left" || action === "rotate-right") {
        const delta = action === "rotate-left" ? -90 : 90;
        this.keepPoint(() => {
          this.rotation += delta;
        });
        this.render(true);
        this.announce(PicoI18n.t("annRotate", [normalizeDegrees(this.rotation)], this.settings.language));
      } else if (action === "flip-h" || action === "flip-v") {
        this.keepPoint(() => {
          if (action === "flip-h") this.flipH *= -1;
          else this.flipV *= -1;
        });
        this.render(true);
        this.announce(action === "flip-h"
          ? PicoI18n.t("annFlipH", null, this.settings.language)
          : PicoI18n.t("annFlipV", null, this.settings.language));
      } else if (action === "pixelate") {
        this.pixelated = !this.pixelated;
        this.applyChrome();
        this.announce(this.pixelated
          ? PicoI18n.t("annPixelateOn", null, this.settings.language)
          : PicoI18n.t("annPixelateOff", null, this.settings.language));
      } else if (action === "checker") {
        this.checker = !this.checker;
        this.applyChrome();
        this.announce(this.checker
          ? PicoI18n.t("annCheckerOn", null, this.settings.language)
          : PicoI18n.t("annCheckerOff", null, this.settings.language));
      } else if (action.startsWith("pan-")) {
        const step = 48;
        if (action === "pan-up") this.panY += step;
        if (action === "pan-down") this.panY -= step;
        if (action === "pan-left") this.panX += step;
        if (action === "pan-right") this.panX -= step;
        this.render(true);
        this.announce(PicoI18n.t("annPan", null, this.settings.language));
      } else if (action === "close") {
        this.requestClose();
      }
    }

    requestClose() {
      if (!this.onClose) return false;
      const close = this.onClose;
      this.onClose = null;
      this.destroy();
      close();
      return true;
    }

    onPointerDown(event) {
      if (event.button !== 0 || event.altKey) return;
      this.pointer = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        panX: this.panX,
        panY: this.panY,
        moved: false,
        target: event.target
      };
      this.stage.setPointerCapture(event.pointerId);
    }

    onPointerMove(event) {
      if (!this.pointer || event.pointerId !== this.pointer.id) return;
      const dx = event.clientX - this.pointer.x;
      const dy = event.clientY - this.pointer.y;
      if (!this.pointer.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      if (!this.pointer.moved) this.pointer.moved = true;
      this.panX = this.pointer.panX + dx;
      this.panY = this.pointer.panY + dy;
      this.render(false);
    }

    onLostCapture() {
      const pointer = this.pointer;
      this.pointer = null;
      if (!pointer || pointer.moved || !this.ready) return;
      if (pointer.target === this.stage && this.settings.closeOnBackgroundClick && this.requestClose()) return;
      const fit = this.fitScale();
      const next = Math.abs(this.zoom - fit) < 0.02 ? 1 : fit;
      this.zoom = clamp(next, MIN_ZOOM, MAX_ZOOM);
      this.panX = 0;
      this.panY = 0;
      this.render("settle");
      this.announce(Math.abs(this.zoom - 1) < 0.001
        ? PicoI18n.t("annActual", null, this.settings.language)
        : PicoI18n.t("annFit", null, this.settings.language));
    }

    onWheel(event) {
      event.preventDefault();
      if (!this.ready) return;
      const { dx, dy } = wheelPixels(event);
      const isPicoControls = this.settings.controls !== "chrome";
      const dominant = Math.abs(dy) >= Math.abs(dx) ? dy : dx;
      const zooming = !event.altKey && !event.shiftKey && (isPicoControls ? !event.ctrlKey : event.ctrlKey);
      if (event.altKey) {
        const sign = this.settings.invertRotate ? -1 : 1;
        this.keepPoint(() => {
          this.rotation += dominant * 0.15 * sign;
        });
      } else if (event.shiftKey) {
        const sign = this.settings.invertHorizontal ? -1 : 1;
        this.panX -= dominant * sign;
      } else if (zooming) {
        const sign = this.settings.invertZoom ? -1 : 1;
        const rect = this.stage.getBoundingClientRect();
        this.zoomAt(event.clientX - rect.left, event.clientY - rect.top, this.zoom * Math.exp(-dominant * 0.0015 * sign));
      } else {
        const sign = this.settings.invertVertical ? -1 : 1;
        this.panY -= dominant * sign;
      }
      this.render(zooming);
    }

    onKeyDown(event) {
      const field = event.target.closest?.("input, textarea, select, [contenteditable='true']");
      if (field) return;
      const keys = this.settings.keys;
      const step = event.shiftKey ? 160 : 48;
      if (matchesKey(event, keys.close)) {
        event.preventDefault();
        this.requestClose();
      } else if (matchesKey(event, keys.pixelate)) {
        event.preventDefault();
        this.onAction("pixelate");
      } else if (matchesKey(event, keys.checker)) {
        event.preventDefault();
        this.onAction("checker");
      } else if (matchesKey(event, keys.rotateLeft)) {
        event.preventDefault();
        this.onAction("rotate-left");
      } else if (matchesKey(event, keys.rotateRight)) {
        event.preventDefault();
        this.onAction("rotate-right");
      } else if (matchesKey(event, keys.flipH)) {
        event.preventDefault();
        this.onAction("flip-h");
      } else if (matchesKey(event, keys.flipV)) {
        event.preventDefault();
        this.onAction("flip-v");
      } else if (matchesKey(event, keys.up)) {
        event.preventDefault();
        this.panY += step;
        this.render(true);
        if (!event.repeat) this.announce(PicoI18n.t("annPanUp", null, this.settings.language));
      } else if (matchesKey(event, keys.down)) {
        event.preventDefault();
        this.panY -= step;
        this.render(true);
        if (!event.repeat) this.announce(PicoI18n.t("annPanDown", null, this.settings.language));
      } else if (matchesKey(event, keys.left)) {
        event.preventDefault();
        this.panX += step;
        this.render(true);
        if (!event.repeat) this.announce(PicoI18n.t("annPanLeft", null, this.settings.language));
      } else if (matchesKey(event, keys.right)) {
        event.preventDefault();
        this.panX -= step;
        this.render(true);
        if (!event.repeat) this.announce(PicoI18n.t("annPanRight", null, this.settings.language));
      }
    }

    announce(text) {
      this.live.textContent = "";
      queueMicrotask(() => {
        this.live.textContent = text;
      });
    }
  }

  function imageName(url, lang) {
    try {
      const path = new URL(url, location.href).pathname;
      const name = decodeURIComponent(path.split("/").pop() || "");
      return name || PicoI18n.t("currentImage", null, lang);
    } catch {
      return PicoI18n.t("currentImage", null, lang);
    }
  }

  function wheelPixels(event) {
    let dx = event.deltaX;
    let dy = event.deltaY;
    if (event.deltaMode === 1) {
      dx *= 16;
      dy *= 16;
    } else if (event.deltaMode === 2) {
      dx *= thisView(event, "x");
      dy *= thisView(event, "y");
    }
    return { dx, dy };
  }

  function thisView(event, axis) {
    const target = event.currentTarget;
    if (!target) return 400;
    return axis === "x" ? target.clientWidth || 400 : target.clientHeight || 400;
  }

  function matchesKey(event, expected) {
    if (!expected || event.altKey || event.ctrlKey || event.metaKey) return false;
    if (expected.startsWith("Arrow") || expected === "Escape") return event.key === expected;
    return event.key.toLowerCase() === expected.toLowerCase();
  }

  function normalizeDegrees(value) {
    const rounded = Math.round(value) % 360;
    return rounded < 0 ? rounded + 360 : rounded;
  }

  function lerpView(from, to, t) {
    return {
      zoom: from.zoom + (to.zoom - from.zoom) * t,
      panX: from.panX + (to.panX - from.panX) * t,
      panY: from.panY + (to.panY - from.panY) * t,
      rotation: from.rotation + (to.rotation - from.rotation) * t,
      flipH: from.flipH + (to.flipH - from.flipH) * t,
      flipV: from.flipV + (to.flipV - from.flipV) * t
    };
  }

  function viewMoved(from, to) {
    return Math.abs(from.zoom - to.zoom) > 0.0001
      || Math.abs(from.panX - to.panX) > 0.1
      || Math.abs(from.panY - to.panY) > 0.1
      || Math.abs(from.rotation - to.rotation) > 0.01
      || from.flipH !== to.flipH
      || from.flipV !== to.flipV;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function clampAxis(pan, view, box) {
    const limit = Math.abs(view - box) / 2;
    return clamp(pan, -limit, limit);
  }

  return { mount };
})();

globalThis.PicoViewer = PicoViewer;
