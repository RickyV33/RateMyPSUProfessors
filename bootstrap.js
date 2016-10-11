chrome.tabs.onUpdated.addListener(function(id, info, tab) {
  if (tab.url.toLocaleLowerCase().indexOf("banweb.pdx.edu") > -1) {
    chrome.pageAction.show(tab.id);
    chrome.tabs.executeScript(null, {"file": "extension.js"});
  }
});