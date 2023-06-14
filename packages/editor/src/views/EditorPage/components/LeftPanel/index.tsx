import React, { useState } from "react";
import { DocumentsPanel } from "../DocumentPanel";

interface LeftPanelProps {
  isCollapsed: boolean;
}

export const LeftPanel = (props: LeftPanelProps) => {
  return (
    <div
      data-collapsed={props.isCollapsed}
      className="left-panel group relative flex-none min-h-full  border-r-2 border-slate-200 bg-neutral-200  data-[collapsed=false]:w-[250px] data-[collapsed=true]:w-0 transtiion-[width] ease-linear duration-100"
    >
      <DocumentsPanel />
    </div>
  );
};
