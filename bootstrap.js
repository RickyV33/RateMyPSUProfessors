chrome.tabs.onUpdated.addListener(function (id, info, tab) {
  if (tab.url.toLocaleLowerCase().indexOf("https://banweb.pdx.edu/pls/oprd/bwskfcls.p_getcrse") > -1
      && info.status === 'loading') {
    chrome.pageAction.show(tab.id);
    chrome.tabs.executeScript(tab.id, { "file": "extension.js" });
  }
});