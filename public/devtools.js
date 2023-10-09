// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// import Request = chrome.devtools.network.Request;

console.log("dev tools start");

function boot() {
  var backgroundPageConnection = chrome.runtime.connect({
    name: "panel"
  });

  console.log('post message to background');
  backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
  });
  console.log("inspectedWindow eval");
  // chrome.devtools.inspectedWindow.eval(
  //   new Function("console.log('Hello, world!');return 5556;").toString(),
  //   function (result, isException) {
  //     console.log("inspectedWindow result", result, isException);
  //   }
  // );
  function foo() {
    window._foo = 445;
    console.log("xoooook");
    const _open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
      console.log(" inject XMLHttpRequest open ", arguments);
      return _open.apply(this, arguments);
    };
    const _fetch = window.fetch;
    window.fetch = function () {
      console.log("inject fetch ", arguments);
      return _fetch.apply(this, arguments);
    };
    return "foo res ok";
  }
  const codestr = `
    (function foo() {
      window._foo = 445;
      console.log("start inject code ");
      const _open = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function () {
        console.log(" inject XMLHttpRequest open ", arguments);
        return _open.apply(this, arguments);
      };
      const _fetch = window.fetch;
      window.fetch = function () {
        console.log("inject fetch ", arguments);
        return _fetch.apply(this, arguments);
      };
      return "foo res ok";
    })();
    `;

  console.log("add custom header 4");
  chrome.devtools.inspectedWindow.eval('console.log("foo v214")');
  chrome.devtools.inspectedWindow.eval(
      "(function foo() {    console.log('foo v51');})();"
  );
  chrome.devtools.inspectedWindow.eval(
      "(function foo() {    console.log(666);})();"
  );
  // console.log("build(foo) = ", build(foo));
  // chrome.devtools.inspectedWindow.eval(
  //   build(foo),
  //   function (result, isException) {
  //     console.log("inspectedWindow result v3", result, isException);
  //   }
  // );
  function setup() {
    chrome.devtools.inspectedWindow.eval(
        codestr,
        function (result, isException) {
          console.log("inspectedWindow result v42 ", result, isException);
        }
    );
  }
  setup();
  chrome.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
  ) {
    console.log("chrome.runtime.onMessage.addListener", message);
    sendResponse({ farewell: "goodbye g" });
    setup();
  });

  // chrome.devtools.network.onRequestFinished.addListener(function (request) {
  //   request.request.headers.push({
  //     name: "MyCustomHead",
  //     value: "xxxyyyaaa",
  //   });
  //   request.response.headers.push({
  //     name: "MyCustomHead",
  //     value: "xxxyyyaaa",
  //   });
  //   chrome.devtools.inspectedWindow.eval(
  //     'console.log("Large image: " + unescape("' +
  //       escape(request.request.url) +
  //       '"))'
  //   );
  // });
  // chrome.devtools.network.getHAR(function (harLog) {
  //   // change headers
  //
  //   harLog.entries.forEach(function (entry) {
  //     console.log("add custom header ", entry.request.url);
  //
  //     entry.request.headers.push({
  //       name: "MyCustomHead",
  //       value: "xxxyyyaaa",
  //     });
  //   });
  // });
}
boot();

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


