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

  const settings = await PicoSettings.load();
  const lang = settings.language;
  document.documentElement.lang = PicoI18n.resolveLanguage(lang);
  document.title = imageTitle(src, lang);

  if (!src) {
    const title = document.createElement("h1");
    title.className = "visually-hidden";
    title.textContent = PicoI18n.t("viewerImageTitle", null, lang);
    const message = document.createElement("p");
    message.className = "message";
    message.textContent = PicoI18n.t("imageCannotOpen", null, lang);
    root.replaceChildren(title, message);
    return;
  }

  const isSvg = /^data:image\/svg/i.test(src) || /\.svg(?:$|[?#])/i.test(src);
  PicoViewer.mount(root, { src, isSvg, settings });
})();

function imageTitle(url, lang) {
  const fallback = PicoI18n.t("viewerImageTitle", null, lang);
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "data:") return fallback;
    const name = decodeURIComponent(parsed.pathname.split("/").pop() || "");
    return name ? `${name} - PicoView` : fallback;
  } catch {
    return fallback;
  }
}
