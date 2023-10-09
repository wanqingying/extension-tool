// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// import Request = chrome.devtools.network.Request;

console.log("dev tools start");

// The function below is executed in the context of the inspected page.

chrome.devtools.panels.create(
  "MyDevPanel2",
  "icon48.png",
  "devtools.html",
  (panel) => {
    console.log("create dev panel", panel);
  }
);
console.log("document", document.body);

// const cha = new BroadcastChannel("devtool_and_kit_chn");
// @ts-ignore
chrome.devtools.network.onRequestFinished.addListener(function (req, res) {
  if (req.response.content.mimeType !== "application/json") return;
  // req.getContent((content, encoding) => {
  //   // const p = document
  //   //   .createElement("p")
  //   //   .appendChild(document.createTextNode(content));
  //   // document.body.appendChild(p);
  //
  //   // cha.postMessage({
  //   //   tag: "chrome.devtools.network.onRequestFinished",
  //   //   data: content,
  //   // });
  //   send2runtime(content);
  //   console.log("network.onRequestFinished", {
  //     url: req.request.url,
  //     content: JSON.parse(content),
  //     encoding,
  //     text: req.response.content,
  //     bodySize: req.response.bodySize,
  //   });
  // });

  // if (request.request.url.indexOf("https://www.baidu.com/") === 0) {
  //   setCount(count + 1);
  // }
});

function send2runtime(data) {
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (!tab?.id) return;
    const response = await chrome.tabs.sendMessage(tab.id, {
      greeting: "hello",
    });
    // do something with response here, not outside the function
    console.log(response);
  })();
}
