import React, { FC, HTMLProps, useEffect } from "react";
import styled from "styled-components";
import { EditorExample } from "../../editor/Example";

const RootDiv: React.ElementType<HTMLProps<HTMLDivElement>> = styled.div`
  // css style
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 100%;
  .list-meta {
    width: 100%;
    display: flex;
    flex-direction: row;
    .meta-cel {
      flex: 1;
      padding: 10px;
    }
    margin-bottom: 10px;
  }
  .list-body {
    width: 100%;

    display: flex;
    flex-direction: column;
    .rnd-2-true {
      background-color: #f9f9f9;
    }
    .net-row {
      display: flex;
      flex-direction: row;
      //margin: 10px 0;

      .net-cel {
        flex: 1;
        padding: 10px;
        //background-color: #eee;
        cursor: pointer;
      }
      .net-url {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
` as any;

interface IProps {}

// desc
export const NetView: FC<IProps> = function (props) {
  const [json, setJson] = React.useState<Record<string, any>>({
    greeting: "Hello World",
    color: "#ff3e00",
    ok: true,
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 911],
  });
  const entries = React.useRef(new Map<string, ext.HttpRecord>());
  const [current, setCurrent] = React.useState<any>({});
  const [cont, setCont] = React.useState<number>(1);

  useEffect(function () {
    window.addEventListener("message", (ev) => {
      const data = ev.data;
      if (data.event === "devtool_http" && data.data) {
        console.log("ev data", data.data);
        const key = `method=${data.data.method} url=${data.data.url}`;
        entries.current.set(key, data.data);
        // setCurrent();
        setCont((pv) => pv + 1);
      }
    });
  }, []);

  const list = Array.from(entries.current.values());

  return (
    <RootDiv>
      <div className="list-meta">
        <div className="meta-url meta-cel">名称</div>
        <div className="meta-status meta-cel">状态</div>
        <div className="meta-method meta-cel">方法</div>
        <div className="meta-size meta-cel">大小</div>
      </div>
      <div className="list-body">
        {list.map((t, idx) => {
          return (
            <div
              className={`net-row rnd-2-${idx % 2 === 0}`}
              onClick={(e) => {
                setCurrent(t.response);
              }}
            >
              <div className={"net-url net-cel"}>{t.url}</div>
              <div className={"net-status net-cel"}>{t.status}</div>
              <div className={"net-method net-cel"}>{t.method}</div>
              <div className={"net-size net-cel"}>{t.bodySize}</div>
            </div>
          );
        })}
      </div>
      <div className="view-editor">
        <EditorExample content={{ json: current, text: undefined }} />
      </div>
    </RootDiv>
  );
};

export default NetView;
