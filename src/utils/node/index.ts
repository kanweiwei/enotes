import { basename, extname } from "path";

export function getFileNameWithoutExt(filePath: string) {
  const name = basename(filePath);
  const ext = extname(filePath);
  return name.substring(0, name.lastIndexOf(ext));
}
