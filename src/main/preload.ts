import { contextBridge, ipcRenderer, MessageBoxOptions } from "electron";

contextBridge.exposeInMainWorld("Bridge", {
  showMessage: (options: MessageBoxOptions) => {
    ipcRenderer.invoke("showMessage", options);
  },
  createNotebook: (name: string) => {
    ipcRenderer.invoke("createNotebook", name);
  },
  getNotebooks: () => {
    return ipcRenderer.invoke("getNotebooks");
  },
});
