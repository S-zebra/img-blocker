const ALLOW = "allow";
const BLOCK = "block";
let origin = "";
let isAllowed = true;

function getEntry(origin, callback) {
  chrome.contentSettings.images.get({ primaryUrl: origin }, callback);
}

function setEntry(origin, setting, callback) {
  chrome.contentSettings.images.set({ primaryPattern: origin, setting: setting, scope: "regular" }, callback);
}

chrome.browserAction.onClicked.addListener((tab) => {
  setEntry(origin, isAllowed ? BLOCK : ALLOW, () => {
    chrome.tabs.update(tab.id, { url: tab.url });
  });
});

chrome.tabs.onUpdated.addListener((id, info, tab) => {
  if (!tab.active) return;
  const url = tab.url.split("/");
  origin = url[0] + "//" + url[2] + "/*";
  getEntry(origin, (e) => {
    isAllowed = e.setting === ALLOW;
    chrome.browserAction.setIcon({
      path: {
        "128": "resources/" + e.setting + "/128.png"
      }
    });
  });
});
