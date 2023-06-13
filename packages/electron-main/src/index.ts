import "reflect-metadata";
import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { initBridge } from "./bridge";
import { getMenu } from "./menu";
import { ioc } from "./ioc";
import { LocalDB } from "./db";

Menu.setApplicationMenu(null);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    frame: false,
    roundedCorners: true,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 12, y: 14 },
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(app.getAppPath(), "dist", "preload.js"),
    },
  });

  app.isPackaged
    ? win.loadFile(
        path.join(app.getAppPath(), "dist", "renderer", "index.html")
      )
    : win.loadURL("http://localhost:8080");

  win.webContents.on("dom-ready", () => {
    win.show();
  });

  return win;
}

app.whenReady().then(() => {
  ioc.get(LocalDB).init();
  createWindow();
  initBridge();
  Menu.setApplicationMenu(getMenu());
});
