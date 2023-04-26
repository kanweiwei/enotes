declare interface Window {
  Bridge?: {
    export: (content: string) => Promise<string>;
    save: (filePath: string, content) => Promise<boolean>;
  };
  $$filePath$$?: string;
  $$fileContent$$?: string;
}
