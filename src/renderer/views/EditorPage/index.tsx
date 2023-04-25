import React from "react";
import { Markdown } from "./components/Markdown";
import "./style.less";

export const EditorPage = () => {
  return (
    <div className="editor">
      <Markdown />
    </div>
  );
};
