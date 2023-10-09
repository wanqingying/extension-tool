import React, { FC, HTMLProps } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { transDino, transSaddle } from "./trans";
import { name_trans, } from "./data";

const RootDiv: React.ElementType<HTMLProps<HTMLDivElement>> = styled.div`
  // css style
` as any;

interface IProps {}

// desc
export const Wiki: FC<IProps> = function (props) {
  return (
    <RootDiv>
      <Button
        onClick={(e) => {
          console.log("ok start wiki 8");
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              const tab = tabs[0];
              if (!tab) return console.error("tab not found");
              chrome.scripting
                .executeScript({
                  target: { tabId: tab.id },
                  func: transSaddle,
                  args: [name_trans],
                })
                .then((res) => {
                  console.log("executeScript res", res);
                })
                .catch((e) => {
                  console.error("executeScript err ", e);
                });
              try {
                console.log("tab url", tab.url);
                const u = new URL(tab.url as string);
              } catch (e) {
                console.error(e);
              }
            }
          );
        }}
      >
        翻译saddle
      </Button>
      <Button
        onClick={(e) => {
          console.log("ok start wiki 11");
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              const tab = tabs[0];
              if (!tab) return console.error("tab not found");
              chrome.scripting
                .executeScript({
                  target: { tabId: tab.id },
                  func: transDino,
                  args: [name_trans],
                })
                .then((res) => {
                  console.log("executeScript res", res);
                })
                .catch((e) => {
                  console.error("executeScript err ", e);
                });
              try {
                console.log("tab url", tab.url);
              } catch (e) {
                console.error(e);
              }
            }
          );
        }}
      >
        翻译dino
      </Button>
    </RootDiv>
  );
};

export default Wiki;
