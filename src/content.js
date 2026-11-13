(() => {
  if (window.top !== window) return;

  const type = document.contentType || "";
  if (!type.startsWith("image/")) return;

  if (document.documentElement?.localName === "svg" || type === "image/svg+xml") {
    openSvgViewer();
    return;
  }

  let dismissed = false;
  const boot = document.createElement("style");
  boot.id = "picoview-boot";
  boot.textContent = "html.picoview-page > body > img { visibility: hidden !important; } html.picoview-page, html.picoview-page body { margin: 0; background: #111; }";
  (document.documentElement || document.head).append(boot);
  document.documentElement.classList.add("picoview-page");

  const settingsPromise = PicoSettings.load();
  const imagePromise = waitForBodyImage();
  void mountImage(boot);

  function openSvgViewer() {
    chrome.runtime.sendMessage({ type: "open-svg", src: location.href }).catch((error) => {
      console.error("打开 SVG 失败", error);
    });
  }

  function release(bootStyle) {
    bootStyle.remove();
    document.documentElement.classList.remove("picoview-page");
  }

  async function mountImage(bootStyle) {
    let theme = null;
    let root = null;
    let image = null;
    try {
      const [settings, found] = await Promise.all([settingsPromise, imagePromise]);
      image = found;
      if (dismissed) return;
      if (!image || !document.body) {
        release(bootStyle);
        return;
      }

      theme = document.createElement("style");
      theme.textContent = globalThis.PicoCss;
      document.documentElement.append(theme);

      root = document.createElement("main");
      root.id = "picoview-root";
      document.body.append(root);

      PicoViewer.mount(root, {
        src: image.currentSrc || image.src || location.href,
        image,
        settings,
        onClose: () => {
          dismissed = true;
          image.className = "";
          image.style.cssText = "";
          image.removeAttribute("width");
          image.removeAttribute("height");
          document.body.append(image);
          root.remove();
          theme.remove();
          release(bootStyle);
        }
      });
    } catch (error) {
      console.error("打开图片查看器失败", error);
      if (image && document.body) document.body.append(image);
      root?.remove();
      theme?.remove();
      release(bootStyle);
    }
  }

  function waitForBodyImage() {
    return new Promise((resolve) => {
      let frame = 0;
      let settled = false;
      const observer = new MutationObserver(() => {
        check();
      });
      const stop = (image) => {
        if (settled) return;
        settled = true;
        observer.disconnect();
        if (frame) cancelAnimationFrame(frame);
        resolve(image);
      };
      const check = () => {
        if (settled || !document.body) return;
        for (const node of document.body.children) {
          if (node.localName === "img") {
            stop(node);
            return;
          }
        }
      };
      const poll = () => {
        check();
        if (!settled) frame = requestAnimationFrame(poll);
      };
      if (document.documentElement) {
        observer.observe(document.documentElement, { childList: true, subtree: true });
      }
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          check();
          if (!settled) stop(null);
        }, { once: true });
      }
      poll();
      if (document.readyState !== "loading") {
        check();
        if (!settled) stop(null);
      }
    });
  }
})();
