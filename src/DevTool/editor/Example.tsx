import VanillaJSONEditor from "./VanillaEditor";
import React, { useState } from "react";
import "./styles.css";

export function EditorExample(props: any) {
  const [showEditor, setShowEditor] = useState(true);
  const [readOnly, setReadOnly] = useState(false);
  const [content, setContent] = useState({});

  return (
      <div className="my-editor">
          <VanillaJSONEditor
              content={props.content}
              readOnly={readOnly}
              // onChange={setContent}
          />
      </div>
  );
}
