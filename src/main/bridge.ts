import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { promises } from "fs";
import { join } from "path";

export function initBridge() {
  ipcMain.handle("export", async (e, content: string) => {
    let filePath;
    const res = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow()!, {
      defaultPath: join(app.getPath("downloads"), "note.md"),
      filters: [
        {
          name: "Markdown",
          extensions: ["md"],
        },
      ],
    });
    if (!res.canceled && res.filePath) {
      try {
        filePath = res.filePath.endsWith(".md")
          ? res.filePath
          : res.filePath + ".md";

        await promises.writeFile(filePath, content);
      } catch (error) {
        console.error(error);
        filePath = null;
      }
    }
    return filePath;
  });

  ipcMain.handle("save", async (e, filePath: string, content: string) => {
    try {
      await promises.writeFile(filePath, content);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  });
}
