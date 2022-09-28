import { contextBridge, ipcRenderer, MessageBoxOptions } from "electron";

contextBridge.exposeInMainWorld("Bridge", {
  showMessage: (options: MessageBoxOptions) => {
    ipcRenderer.invoke("showMessage", options);
  },
});
