import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { initBridge } from "./bridge";
import { getMenu } from "./menu";

Menu.setApplicationMenu(null);

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

app.whenReady().then(() => {
  createWindow();
  initBridge();
  Menu.setApplicationMenu(getMenu());
});