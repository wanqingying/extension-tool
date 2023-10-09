import React, { FC, HTMLProps, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { getApiListByUrl } from "./help";
import { Button } from "antd";

const RootDiv: React.ElementType<HTMLProps<HTMLDivElement>> = styled.div`
  // css style
` as any;

interface IProps {}

// desc
export const SchemaYapi: FC<IProps> = function (props) {
  const [cookie, setCookie] = React.useState<any>("");
  function handleLoad() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (!tab) return console.error("tab not found");
      getApiListByUrl(tab.url as string);
    });
  }
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (!tab) return console.error("tab not found");
      try {
        console.log('tab url',tab.url)
        const u = new URL(tab.url as string);
        chrome.cookies.getAll({ domain: u.hostname }).then((cookies) => {
          window._yapi_cookie = cookies;
          // chrome.storage.sync.set({ cookie_yapi: cookies }).then((res) => {
          //   console.log("set cik", res);
          // });
        });
      } catch (e) {
        console.error(e);
      }
    });
  }, []);
  return (
    <RootDiv>
      <Button
        onClick={(e) => {
          handleLoad();
        }}
      >
        扫描页面
      </Button>
    </RootDiv>
  );
};
