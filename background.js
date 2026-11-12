importScripts("i18n.js", "settings.js");

let menuTask = Promise.resolve();

function setupMenus() {
  menuTask = menuTask.then(async () => {
    const settings = await PicoSettings.load();
    await chrome.contextMenus.removeAll();
    if (!settings.openInCurrentTab) return;
    const title = PicoI18n.t("contextMenuOpenImage", null, settings.language);
    await chrome.contextMenus.create({
      id: "open-image",
      title,
      contexts: ["image"]
    });
  }).catch((error) => {
    console.error("创建右键菜单失败", error);
  });
}

async function openInViewer(tabId, src) {
  const key = "image-" + tabId + "-" + Date.now();
  await chrome.storage.session.set({ [key]: src });
  await chrome.tabs.update(tabId, {
    url: chrome.runtime.getURL("viewer.html") + "?key=" + encodeURIComponent(key)
  });
}

async function readBlobImage(tabId, blobUrl) {
  const [injection] = await chrome.scripting.executeScript({
    target: { tabId },
    func: async (url) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        if (!blob.type.startsWith("image/")) return null;
        return await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
      } catch {
        return null;
      }
    },
    args: [blobUrl],
    world: "MAIN"
  });
  return injection?.result || null;
}

async function readLocation(tabId) {
  const [injection] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => location.href
  });
  return injection?.result || "";
}

async function routeSpecialImage(details) {
  if (details.frameId !== 0) return;
  const url = details.url || "";
  if (!url || url.startsWith(chrome.runtime.getURL(""))) return;
  const dataImage = /^data:image\//i.test(url);
  const blobImage = url.startsWith("blob:");
  if (!dataImage && !blobImage) return;
  try {
    if (dataImage) {
      const full = await readLocation(details.tabId);
      if (/^data:image\//i.test(full)) await openInViewer(details.tabId, full);
      return;
    }
    const dataUrl = await readBlobImage(details.tabId, url);
    if (dataUrl) await openInViewer(details.tabId, dataUrl);
  } catch (error) {
    console.error("打开特殊图片地址失败", error);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  setupMenus();
});

chrome.runtime.onStartup.addListener(() => {
  setupMenus();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.settings) setupMenus();
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage().catch((error) => {
    console.error("打开设置失败", error);
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "open-image" || !info.srcUrl || tab?.id == null) return;
  chrome.tabs.update(tab.id, { url: info.srcUrl }).catch((error) => {
    console.error("打开图片失败", error);
  });
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type !== "open-svg" || sender.tab?.id == null) return;
  const src = message.src;
  if (typeof src !== "string" || !/^(https?|file):/i.test(src)) return;
  chrome.tabs.update(sender.tab.id, {
    url: chrome.runtime.getURL("viewer.html") + "?src=" + encodeURIComponent(src)
  }).catch((error) => {
    console.error("打开 SVG 失败", error);
  });
});

chrome.webNavigation.onCommitted.addListener((details) => {
  void routeSpecialImage(details);
});

setupMenus();
