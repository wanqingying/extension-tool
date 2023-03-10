chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log("url cxx", window.location.href);
  // console.log("body 22", document.body);

  if (msg.color) {
    console.log("Receive color = " + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse("Change color to " + msg.color);
  } else {
    sendResponse("Color message is none.");
  }
});

const port = chrome.runtime.connect();

window.addEventListener(
  "message",
  (event) => {
    // We only accept messages from ourselves
    console.log("event message", event.data);
    if (event.source !== window) {
      return;
    }

    if (event.data.type && event.data.type === "FROM_PAGE") {
      console.log("Content script received: " + event.data.text);
      port.postMessage(event.data.text);
    }
  },
  false
);

// throw new Error("texx");
console.log("url cxx", window.location.href);
