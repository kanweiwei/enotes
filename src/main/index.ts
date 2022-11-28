import "reflect-metadata";
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  MessageBoxOptions,
} from "electron";
import path from "path";
import { ioc } from "./ioc";
import { LocalDB } from "./db/db";
import { NotebooksController } from "./db/controllers/notebooks.controller";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      devTools: app.isPackaged ? false : true,
      contextIsolation: true,
      preload: path.join(app.getAppPath(), "dist", "preload.js"),
    },
  });

  app.isPackaged
    ? win.loadFile(path.join(app.getAppPath(), "dist", "template.html"))
    : win.loadURL("http://localhost:1234");

  win.webContents.on("dom-ready", () => {
    win.show();
  });

  win.webContents.openDevTools({
    mode: "detach",
  });

  return win;
}

app.whenReady().then(async () => {
  await ioc.get(LocalDB).init();
  createWindow();
});

ipcMain.handle("showMessage", (e, options: MessageBoxOptions) => {
  const win =
    BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
  if (!win) return;
  dialog.showMessageBox(win, options);
});

ipcMain.handle("createNotebook", async (e, name: string) => {
  return await ioc.get(NotebooksController).create(name);
});

ipcMain.handle("getNotebooks", async () => {
  return await ioc.get(NotebooksController).getAll();
});
