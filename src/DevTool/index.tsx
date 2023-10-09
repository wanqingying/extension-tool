import React, { HTMLProps, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import styled from "styled-components";
import { SchemaYapi } from "./pages/SchemaYapi";
import { Json2dts } from "./pages/Json2dts";
import { NetView } from "./pages/NetView/NetView";
import { EditorExample } from "./editor/Example";
import { emitter, EventNameType } from "./utils/share";
import { devEmitter } from "./utils/emitter";

import { ConfigProvider, Menu } from "antd";
import { MailOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

const RootDiv: React.ElementType<HTMLProps<HTMLDivElement>> = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  .left-list {
  }
  .page-box {
    padding: 12px 0;
    width: calc(100% - 50px);
  }
` as any;

const RootApp = () => {
  const [count, setCount] = useState(0);
  const [activeKey, setActiveKey] = React.useState<string>("network");
  useEffect(() => {}, [count]);

  useEffect(() => {
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   const b = tabs[0];
    //   window._yapi_host = new URL(b.url).hostname;
    //   // setCurrentURL(tabs[0].url);
    // });
    // console.log("url", window.location.hostname);
    // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {});
  }, []);

  const pageList = [
    {
      label: "network",
      key: "network",
      icon: <MailOutlined />,
      page: NetView,
    },
    {
      label: "泳道助手",
      key: "json2dts2",
      icon: <MailOutlined />,
      page: Json2dts,
    },
  ];

  const target = pageList.find((p) => p.key === activeKey);
  const Page: any = target?.page;

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
      </div>
    </RootDiv>
  );
};

console.log("ReactDOM.createRoot  334", document.getElementById("root"));

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
