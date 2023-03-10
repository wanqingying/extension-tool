// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
console.log("dev tools start");

// The function below is executed in the context of the inspected page.
var page_getProperties = function () {
  var data = { test: 333, name: "jq" };
  // Make a shallow copy with a null prototype, so that sidebar does not
  // expose prototype.
  return data;
};

chrome.devtools.network.onRequestFinished.addListener(function (request) {
  console.log("request", request.response.status);
});


chrome.devtools.panels.elements.createSidebarPane(
  "MyDevTool",
  function (sidebar) {
    console.log("createSidebarPane", sidebar);
    function updateElementProperties() {
      sidebar.setExpression("(" + page_getProperties.toString() + ")()");
    }
    updateElementProperties();
    chrome.devtools.panels.elements.onSelectionChanged.addListener(
      updateElementProperties
    );
  }
);
