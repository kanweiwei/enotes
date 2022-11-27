import React from "react";
import { Resizable } from "re-resizable";
import { Markdown } from "../Markdown";
import "./style.less";
import { Notes } from "./components/Notes";
import { Notebooks } from "./components/Notes/Notebooks";

export const Editor = () => {
  return (
    <div className="editor">
      <Resizable
        minWidth={100}
        defaultSize={{ width: 200, height: "100vh" }}
        style={{ borderRight: "1px solid #ddd" }}
      >
        <Notebooks />
      </Resizable>
      <Notes />
      <Markdown />
    </div>
  );
};
