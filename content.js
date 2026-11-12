(() => {
  if (window.top !== window) return;

  const type = document.contentType || "";
  if (!type.startsWith("image/")) return;

  if (document.documentElement?.localName === "svg") {
    openSvgViewer();
    return;
  }

  let dismissed = false;
  const boot = document.createElement("style");
  boot.id = "picoview-boot";
  boot.textContent = "html.picoview-page > body > img { display: none !important; } html.picoview-page, html.picoview-page body { background: #111; }";
  (document.documentElement || document.head).append(boot);
  document.documentElement.classList.add("picoview-page");

  const start = () => {
    if (dismissed) return;
    if (document.documentElement?.localName === "svg") {
      openSvgViewer();
      return;
    }
    void mountImage(boot);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();

  function openSvgViewer() {
    chrome.runtime.sendMessage({ type: "open-svg", src: location.href }).catch((error) => {
      console.error("打开 SVG 失败", error);
    });
  }

  async function mountImage(bootStyle) {
    try {
      if (dismissed) return;
      const theme = document.createElement("style");
      theme.textContent = globalThis.PicoCss;
      document.documentElement.append(theme);

      const root = document.createElement("main");
      root.id = "picoview-root";
      document.body.append(root);

      const settings = await PicoSettings.load();
      if (dismissed) {
        root.remove();
        theme.remove();
        return;
      }

      PicoViewer.mount(root, {
        src: location.href,
        isSvg: type === "image/svg+xml",
        settings,
        onClose: () => {
          dismissed = true;
          root.remove();
          theme.remove();
          bootStyle.remove();
          document.documentElement.classList.remove("picoview-page");
        }
      });
    } catch (error) {
      console.error("打开图片查看器失败", error);
      bootStyle.remove();
      document.documentElement.classList.remove("picoview-page");
    }
  }
})();
