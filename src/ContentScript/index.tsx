// import * as sw from '../ServiceWorker'
console.log("url = ", window.location.href);
console.log("ContentScript id= ", chrome.runtime.id);
document.addEventListener("DOMContentLoaded", function () {
  console.log("ContentScript DOMContentLoaded");
});

window.addEventListener("message", function (event) {
  console.log("ContentScript window message", event.data);
  // if (event.source !== window) return;
  // chrome.runtime.sendMessage(event.data.data, function (response) {
  //     console.log("ContentScript window message response", response);
  // });
});

chrome.runtime.sendMessage(
  { greeting: "hello", sendBy: "ContentScript", tag: "init" },
  function (response) {
    console.log("ContentScript init sendMessage response", response);
  }
);

function transDevTool2Page() {
  // 将devtool的消息转发给页面
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.tag !== "devtool2page") return;
    window.postMessage(
      { tag: "devtool2page", data: request, sendBy: "ConteScript" },
      "*"
    );
    sendResponse("ok");
  });
}
transDevTool2Page();

// throw new Error("texx");

// if ("serviceWorker" in navigator) {
//   const codeURL = URL.createObjectURL(
//     new Blob([codeStr], { type: "text/javascript" })
//   );
//   navigator.serviceWorker.register(codeURL, { scope: "/" });
// }
