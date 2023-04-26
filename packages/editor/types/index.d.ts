declare interface Window {
  Bridge?: {
    export: (content: string) => Promise<string>;
    save: (filePath: string, content) => Promise<boolean>;
    getFileContent: (filePath: string) => Promise<string>;
  };
  $$filePath$$?: string;
  $$fileContent$$?: string;
}
