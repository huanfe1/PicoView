(async () => {
  const theme = document.createElement("style");
  theme.textContent = globalThis.PicoCss;
  document.head.append(theme);

  const root = document.querySelector("#picoview-root");
  const params = new URLSearchParams(location.search);
  let src = params.get("src");
  const key = params.get("key");
  if (!src && key) {
    try {
      const stored = await chrome.storage.session.get(key);
      src = typeof stored[key] === "string" ? stored[key] : "";
    } catch (error) {
      console.error("读取图片失败", error);
    }
  }

  document.title = imageTitle(src);

  if (!src) {
    const title = document.createElement("h1");
    title.className = "visually-hidden";
    title.textContent = "PicoView 图片查看";
    const message = document.createElement("p");
    message.className = "message";
    message.textContent = "打不开这张图片。";
    root.replaceChildren(title, message);
    return;
  }

  const settings = await PicoSettings.load();
  const isSvg = /^data:image\/svg/i.test(src) || /\.svg(?:$|[?#])/i.test(src);
  PicoViewer.mount(root, { src, isSvg, settings });
})();

function imageTitle(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "data:") return "PicoView 图片查看";
    const name = decodeURIComponent(parsed.pathname.split("/").pop() || "");
    return name ? `${name} - PicoView` : "PicoView 图片查看";
  } catch {
    return "PicoView 图片查看";
  }
}
