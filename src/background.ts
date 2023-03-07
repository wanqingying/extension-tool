function polling() {
  console.log("polling");
  setTimeout(polling, 1000 * 10);
}

polling();

const color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  // chrome.storage.sync.set({ color });
  console.log("chrome.runtime.onInstalled");
});

// chrome.webRequest.onResponseStarted.addListener(
//   function (details) {
//     console.log("req", details);
//     debugger;
//   },
//
//   { urls: ["<all_urls>"] }
// );
