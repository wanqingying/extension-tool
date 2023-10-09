import { JSONEditor, Mode } from "vanilla-jsoneditor";
import React, { useEffect, useRef } from "react";
import "./VanillaEditor.css";

export default function SvelteJSONEditor(props) {
  const refContainer = useRef(null);
  const refEditor = useRef<JSONEditor>(null);

  useEffect(() => {
    // create editor
    console.log("create editor", refContainer.current);
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {},
    });
    refEditor.current.updateProps({ mode: Mode.text, mainMenuBar: false });

    return () => {
      // destroy editor
      if (refEditor.current) {
        console.log("destroy editor");
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  // update props
  useEffect(() => {
    if (refEditor.current) {
      console.log("update props", props);
      refEditor.current.updateProps(props);
    }
  }, [props]);

  return <div className="vanilla-jsoneditor-react" ref={refContainer}></div>;
}
