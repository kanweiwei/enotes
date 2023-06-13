import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("Bridge", {
  export: (content: string) => {
    return ipcRenderer.invoke("export", content);
  },
  save: (filePath: string, content: string) => {
    return ipcRenderer.invoke("save", filePath, content);
  },
  getFileContent: (filePath: string) => {
    return ipcRenderer.invoke("getFileContent", filePath);
  },
  getAllBooks: () => ipcRenderer.invoke("getAllBooks"),
  createBook: (fileName: string) => {
    return ipcRenderer.invoke("createBook", fileName);
  },
  deleteBook: (id: number) => ipcRenderer.invoke("deleteBook", id),
  updateBook: (data: { id: number; name: string }) =>
    ipcRenderer.invoke("updateBook", data),
});
