import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { useState } from "react";

export const LeftPanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div
      data-collapsed={isCollapsed}
      className="left-panel group relative min-h-full  border-r-2 border-slate-150  bg-slate-100 data-[collapsed=false]:w-[240px] data-[collapsed=true]:w-0 transtiion-[width] ease-linear duration-100"
    >
      <div
        data-collapsed={isCollapsed}
        className="control-btn absolute right-[-15px] top-[50%] rounded-full bg-slate-200 text-slate-500 hover:cursor-pointer hover:bg-slate-300"
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
