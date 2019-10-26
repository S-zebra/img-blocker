const ALLOW = "allow";
const BLOCK = "block";

function getEntry(origin, callback) {
  chrome.contentSettings.images.get({ primaryUrl: origin }, callback);
}

function setEntry(origin, setting, callback) {
  chrome.contentSettings.images.set({ primaryPattern: origin, setting: setting, scope: "regular" }, callback);
}

chrome.browserAction.onClicked.addListener((tab) => {
  const url = tab.url.split("/");
  const origin = url[0] + "//" + url[2] + "/*";
  getEntry(origin, (e) => {
    setEntry(origin, e.setting === ALLOW ? BLOCK : ALLOW, () => {
      chrome.tabs.update(tab.id, { url: tab.url });
    });
  });
});