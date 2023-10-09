// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// import Request = chrome.devtools.network.Request;

console.log("dev tools start");
import { emitter, EventNameType } from "./utils/share";
import { devEmitter } from "./utils/emitter";

function boot() {
  const backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-script",
  });

  backgroundPageConnection.postMessage({
    name: "init",
    tabId: chrome.devtools.inspectedWindow.tabId,
  });
  chrome.runtime.onMessageExternal.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    console.log("devtools onMessageExternal from page ", request, sender);
  });
  chrome.runtime.sendMessage(
    { greeting: "hello from devtools" },
    function (response) {
      console.log("devtool runtime.sendMessage res", response);
    }
  );

  function setup() {
    function foo3() {
      window._foo = 445;
      console.log("start inject code ");
      const _send = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function () {
        this.setRequestHeader("MyCustomHead", "xxxyyyaaa");
        this.addEventListener("loadend", function () {});
        return _send.apply(this, arguments);
      };

      const _fetch = window.fetch;
      window.fetch = function (input, init) {
        console.log("inject fetch ", input, init);
        const headers = init?.headers;
        if (headers) {
          headers["MyCustomHead"] = "xxxyyyaaa";
        }
        return _fetch.call(this, input, { ...init, headers });
      };

      window.addEventListener("message", function (event) {
        console.log("foo3 page window.addEventListener", event.data);
      });

      return "foo3 res ok";
    }
    function build(fn: Function) {
      return `(${fn
        .toString()
        .replace(/[\n\r]/g, "")
        .replace(/"/g, "'")})();`;
    }
    console.log("inspectedWindow.eval");

    chrome.devtools.inspectedWindow.eval(
      build(foo3),
      (result, exceptionInfo) => {
        console.log("inspectedWindow.eval result v52", result, exceptionInfo);
      }
    );
  }

  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (message.tag === "init") {
      console.log("devtool chrome.runtime.onMessage init ", message);
      setup();
      sendResponse({ farewell: "init ok", sendBy: "devtool" });
    }
  });
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

// const cha = new BroadcastChannel("devtool_and_kit_chn");
// @ts-ignore
chrome.devtools.network.onRequestFinished.addListener(function (
  req: chrome.devtools.network.Request,
  res
) {
  if (req.response.content.mimeType !== "application/json") return;
  req.getContent((content, encoding) => {
    const data: ext.HttpRecord = {
      url: req.request?.url,
      timestamp: Date.now().valueOf(),
      version: 0,
      response: JSON.parse(content),
      _contentType: req._contentType,
      headersReq: req.request.headers,
      headersRes: req.response.headers,
      method: req.request.method,
      cookies: req.request.cookies as any,
      bodySize: req.response.bodySize,
      status: req.response.status,
    };
    // console.log("devtools network.onRequestFinished emit", data);
    // const tabId = chrome.devtools.inspectedWindow.tabId;
    // emitter.emit(EventNameType.HAR_HOT, data);
    // devEmitter.emit(EventNameType.HAR_HOT, data);
    // chrome.runtime
    //   .sendMessage({ data, event: "devtool_http" })
    //   .catch(console.error);
    window.postMessage({ data, event: "devtool_http" }, "*");
    // chrome.tabs.sendMessage(
    //   tabId,
    //   { greeting: "hello", data, tag: "devtool2page" },
    //   function (response) {
    //     console.log("devtool response from tab ", response);
    //   }
    // );
  });
});
