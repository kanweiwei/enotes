import React, { useEffect, useState } from "react";
import { AppContext } from "../../hooks/appContext";
import { Markdown } from "./components/Markdown";
import "./style.less";

export const EditorPage = () => {
  const [filePath, setFilePath] = useState<undefined | string>();
  const updateFilePath = (p: string) => {
    setFilePath(p);
  };

  useEffect(() => {
    if (window.$$filePath$$ && window.$$filePath$$ !== filePath) {
      updateFilePath(window.$$filePath$$);
    }
  }, []);

  return (
    <AppContext.Provider value={{ filePath, updateFilePath }}>
      <div className="editor">
        <Markdown />
      </div>
    </AppContext.Provider>
  );
};
