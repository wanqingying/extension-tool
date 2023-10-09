const CacheName = "dev-tool-xh-cache";

console.log('sw start')

const CACHE_VERSION = 1;
const CURRENT_CACHES = {
  font: `api-cache-v${CACHE_VERSION}`,
};

chrome.runtime.onInstalled.addListener(function () {
    console.log('sw onInstalled')

    // chrome.storage.local.set({ color: '#3aa757' }, function () {
    //     console.log('The color is green.');
    // });
})

// background.js
var connections = {};

chrome.runtime.onConnect.addListener(function (port) {
  const extensionListener = function (message, sender, sendResponse) {
    // The original connection event doesn't include the tab ID of the
    // DevTools page, so we need to send it explicitly.
    if (message.name == "init") {
      connections[message.tabId] = port;
      console.log('devtools->background init', message, sender, sendResponse);
      return;
    }

    // other message handling
  };

  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(extensionListener as any);

  port.onDisconnect.addListener(function (port) {
    port.onMessage.removeListener(extensionListener as any);

    var tabs = Object.keys(connections);
    for (var i = 0, len = tabs.length; i < len; i++) {
      if (connections[tabs[i]] == port) {
        delete connections[tabs[i]];
        break;
      }
    }
  });
});

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Messages from content scripts should have sender.tab set
  console.log("background onMessage", request, sender);
  if (sender.tab) {
    var tabId = sender.tab.id;
    if (tabId in connections) {
      connections[tabId].postMessage(request);
    } else {
      console.log("Tab not found in connection list.");
    }
  } else {
    console.log("sender.tab not defined.");
  }
  return true;
});
