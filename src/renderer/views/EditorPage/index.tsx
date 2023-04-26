import { AppContext } from "~src/renderer/hooks/appContext";
import React, { useState } from "react";
import { Markdown } from "./components/Markdown";
import "./style.less";

export const EditorPage = () => {
  const [filePath, setFilePath] = useState<undefined | string>();
  const updateFilePath = (p: string) => {
    setFilePath(p);
  };
  return (
    <AppContext.Provider value={{ filePath, updateFilePath }}>
      <div className="editor">
        <Markdown />
      </div>
    </AppContext.Provider>
  );
};
