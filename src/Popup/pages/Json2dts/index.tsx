import React, { FC, HTMLProps } from "react";
import styled from "styled-components";
import { Input, Button } from "antd";
import { string2dts } from "./help";

const RootDiv: React.ElementType<HTMLProps<HTMLDivElement>> = styled.div`
  // css style
` as any;

interface IProps {}

// desc
export const Json2dts: FC<IProps> = function (props) {
  const [dts, setDts] = React.useState<any>("");
  const [value, setValue] = React.useState<any>(undefined);
  return (
    <RootDiv>
      <div>
        <Input.TextArea
          placeholder={"请输入json数据"}
          value={value}
          style={{ height: 100 }}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </div>
      <div
        style={{
          margin: "12px 0",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={(e) => {
            if (!value) return;
            try {
              setDts(string2dts(value));
            } catch (e) {}
            console.log("value", value);
          }}
          style={{ marginRight: 12 }}
        >
          转换
        </Button>
        <Button
          onClick={(e) => {
            window.navigator.clipboard.writeText(dts).then();
          }}
        >
          复制
        </Button>
      </div>
      <div>
        {!dts && <span>请输入数据</span>}
        {dts && <pre>{dts}</pre>}
      </div>
    </RootDiv>
  );
};
