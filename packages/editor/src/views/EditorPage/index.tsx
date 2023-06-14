import React, { useEffect, useState } from "react";
import { AppContext } from "../../hooks/appContext";
import { Markdown } from "./components/Markdown";
import "./style.less";
import { LeftPanel } from "./components/LeftPanel";
import { FolderTreeIcon } from "lucide-react";
import { LayoutIcon } from "@radix-ui/react-icons";
import { useToggle } from "ahooks";

export const EditorPage = () => {
  const [filePath, setFilePath] = useState<undefined | string>();

  const [isCollapsed, { toggle: toggleCollapsed }] = useToggle(false);

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
      <div className="editor h-full flex flex-col flex-nowrap">
        <header className="app-header flex-none h-[40px] flex flex-row flex-nowrap items-center content-between bg-neutral-100 ">
          <div
            className="left-header flex-none pl-20 w-[250px] data-[collapsed=true]:w-[120px]"
            data-collapsed={isCollapsed}
          >
            <i
              className="float-right mr-2 hover:bg-neutral-300 p-1 rounded"
              onClick={toggleCollapsed}
            >
              <LayoutIcon />
            </i>
          </div>
        </header>
        <div
          className="flex flex-1 felx-nowrap"
          style={{ height: "calc(100% - 40px)" }}
        >
          <LeftPanel isCollapsed={isCollapsed} />
          <Markdown />
        </div>
      </div>
    </AppContext.Provider>
  );
};
