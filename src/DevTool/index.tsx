import React, { HTMLProps, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import styled from "styled-components";
import { SchemaYapi } from "./pages/SchemaYapi";
import { Json2dts } from "./pages/Json2dts";
import { Wiki } from "./pages/ARK/Wiki";
import { EditorExample } from "./editor/Example";

import { ConfigProvider, Button, Menu } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";

const RootDiv: React.ElementType<HTMLProps<HTMLDivElement>> = styled.div`
  width: 400px;
  height: 300px;
  display: flex;
  .left-list {
  }
  .page-box {
    padding: 12px 0;
  }
` as any;

const RootApp = () => {
  const [count, setCount] = useState(0);
  const [activeKey, setActiveKey] = React.useState<string>("wiki");

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);
  useEffect(function () {
    const cha = new BroadcastChannel("devtool_and_kit_chn");
    console.log("BroadcastChannel init");
    cha.addEventListener("message", (e) => {
      console.log("BroadcastChannel", e.data);
    });

    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      console.log(
        sender.tab
          ? "from a content script:" + sender.tab.url
          : "from the extension"
      );
      if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
    });
  }, []);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const b = tabs[0];
      window._yapi_host = new URL(b.url).hostname;
      // setCurrentURL(tabs[0].url);
    });
    console.log("url", window.location.hostname);
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {});
  }, []);

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      console.log("send");
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: "#555555",
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };
  const pageList = [
    {
      label: "wiki",
      key: "wiki",
      icon: <MailOutlined />,
      page: Wiki,
    },
    {
      label: "yapi接口生成",
      key: "yapi",
      icon: <MailOutlined />,
      page: SchemaYapi,
    },
    {
      label: "json转ts定义",
      key: "json2dts",
      icon: <MailOutlined />,
      page: Json2dts,
    },
    {
      label: "泳道助手",
      key: "json2dts2",
      icon: <MailOutlined />,
      page: Json2dts,
    },
    {
      label: "网关同步助手",
      key: "json2dts3",
      icon: <MailOutlined />,
      page: Json2dts,
    },
  ];

  const target = pageList.find((p) => p.key === activeKey);
  const Page: any = target?.page;
  console.log("page ", target.key);
  return (
    <RootDiv>
      <div className="left-list">
        <Menu
          items={pageList.map((p) => {
            return {
              key: p.key,
              icon: p.icon,
              label: p.label,
            };
          })}
          activeKey={activeKey}
          onClick={(e) => {
            setActiveKey(e.key);
          }}
          mode={"vertical"}
        />
      </div>
      <div className={"page-box"}>
        <Page />
        <EditorExample />
      </div>
    </RootDiv>
  );
};

console.log("ReactDOM.createRoot", document.getElementById("root"));
ReactDOM.createRoot(
  document.getElementById("root") ?? document.body,
  {}
).render(
  <React.StrictMode>
    <ConfigProvider>
      <RootApp />
    </ConfigProvider>
  </React.StrictMode>
);
