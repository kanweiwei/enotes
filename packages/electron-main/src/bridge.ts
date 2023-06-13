import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { promises } from "fs";
import { join } from "path";
import { ioc } from "./ioc";
import { BooksController } from "./db/books";

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

  ipcMain.handle("getFileContent", async (e, filePath: string) => {
    let res = "";
    try {
      res = await promises.readFile(filePath, "utf-8");
    } catch (error) {
      console.error(error);
    }
    return res;
  });

  ipcMain.handle("getAllBooks", async () => {
    return await ioc.get(BooksController).getAll();
  });

  ipcMain.handle("createBook", async (e, fileName) => {
    return await ioc.get(BooksController).create(fileName);
  });

  ipcMain.handle("deleteBook", async (e, id: number) =>{
    return await ioc.get(BooksController).delete(id)
  })

  ipcMain.handle(
    "updateBook",
    async (e, data: { id: number; name: string }) => {
      try {
        await ioc.get(BooksController).update(data);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  );
}
