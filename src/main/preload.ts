import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("Bridge", {});
