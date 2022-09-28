import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("Bridge", {
  test: () => {
    console.log("bridge is working");
  },
});
