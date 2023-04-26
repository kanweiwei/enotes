import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("Bridge", {
  export: (content: string) => {
    return ipcRenderer.invoke("export", content);
  },
  save: (filePath: string, content: string) => {
    return ipcRenderer.invoke("save", filePath, content);
  },
});
