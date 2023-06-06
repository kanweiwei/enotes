import fse from "fs-extra";
import { dirname, join } from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = join(__dirname, "..", "dist");
const destDir = join(
  __dirname,
  "..",
  "..",
  "electron-main",
  "dist",
  "renderer"
);
if (await fse.pathExists(destDir)) {
  fse.removeSync(destDir);
}
await fse.ensureDir(destDir);
fse.copySync(srcDir, destDir);
