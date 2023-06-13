import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import React from "react";
import { useState } from "react";
import { DocumentsPanel } from "../DocumentPanel";

export const LeftPanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div
      data-collapsed={isCollapsed}
      className="left-panel group relative flex-none min-h-full  border-r-2 border-slate-200 bg-neutral-100 data-[collapsed=false]:sm:w-[200px] data-[collapsed=false]:md:w-[300px] data-[collapsed=true]:w-0 transtiion-[width] ease-linear duration-100"
    >
      <header className="app-header flex-none h-[40px]"></header>
      <DocumentsPanel />
      <div
        data-collapsed={isCollapsed}
        className="control-btn absolute right-[-15px] top-[50%] rounded-full bg-slate-200 text-slate-500 cursor-pointer hover:bg-slate-300 z-10"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <CaretRightIcon width={30} height={30} />
        ) : (
          <CaretLeftIcon width={30} height={30} />
        )}
      </div>
    </div>
  );
};
