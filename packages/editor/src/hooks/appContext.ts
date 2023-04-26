import { createContext } from "react";

interface AppContextState {
  filePath?: string;
  updateFilePath: (filePath: string) => void;
}

export const AppContext = createContext<AppContextState>({
  filePath: undefined,
  updateFilePath: () => {},
});
