chrome.tabs.onUpdated.addListener(function(id, info, tab) {
  if (tab.url.toLocaleLowerCase().indexOf("banweb.pdx.edu") > -1 && info.status === 'loading') {
    chrome.pageAction.show(tab.id);
    chrome.tabs.executeScript(tab.id, {"file": "extension.js"});
  }
});