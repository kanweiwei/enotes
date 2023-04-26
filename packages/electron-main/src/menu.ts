import { ArgumentsType } from "vitest";
import { app, BrowserWindow, dialog, Menu } from "electron";

const template: ArgumentsType<typeof Menu.buildFromTemplate>[0] = [
  {
    label: "File",
    submenu: [
      {
        label: "Open",
        accelerator: "CmdOrCtrl+O",
        click: async () => {
          const win = BrowserWindow.getFocusedWindow();
          if (!win) return;
          const res = await dialog.showOpenDialog({
            filters: [{ name: "Markdown", extensions: ["md"] }],
            properties: ["openFile"],
          });
          if (!res.canceled && res.filePaths.length) {
            await win.webContents.executeJavaScript(`
                window.dispatchEvent(new CustomEvent("openFile", {
                    detail: {
                        filePath: "${res.filePaths[0]}"
                    }
                }));
            `);
          }
        },
      },
      { type: "separator" },
      {
        label: "Quit",
        accelerator: "CmdOrCtrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

export function getMenu() {
  return Menu.buildFromTemplate(template);
}