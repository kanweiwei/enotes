import { contextBridge, ipcRenderer } from "electron";

const bridge: typeof window.Bridge = {
  export: (content: string) => {
    return ipcRenderer.invoke("export", content);
  },
  save: (filePath: string, content: string) => {
    return ipcRenderer.invoke("save", filePath, content);
  },
  getFileContent: (filePath: string) => {
    return ipcRenderer.invoke("getFileContent", filePath);
  },
  getDocuments: () => ipcRenderer.invoke("getDocuments"),
  getWithPages: () => ipcRenderer.invoke("getWithPages"),
  createDocument: (fileName: string) => {
    return ipcRenderer.invoke("createDocument", fileName);
  },
  deleteDocument: (id: number) => ipcRenderer.invoke("deleteDocument", id),
  updateDocument: (data: { id: number; name: string }) =>
    ipcRenderer.invoke("updateDocument", data),
  createPage: (data: { documentId: number; name: string }) =>
    ipcRenderer.invoke("createPage", data),
  deletePage: (id: number) => ipcRenderer.invoke("deletePage", id),
  updatePageName: (id: number, name: string) =>
    ipcRenderer.invoke("updatePageName", id, name),
};

contextBridge.exposeInMainWorld("Bridge", bridge);
