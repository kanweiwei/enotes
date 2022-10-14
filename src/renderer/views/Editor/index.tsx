import React from "react";
import { Resizable } from "re-resizable";
import { Markdown } from "../Markdown";

export const Editor = () => {
  return (
    <div>
      <Resizable />
      <Resizable />
      <Markdown />
    </div>
  );
};
