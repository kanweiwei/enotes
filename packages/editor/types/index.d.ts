declare interface Window {
  Bridge?: {
    export: (content: string) => Promise<string>;
    save: (filePath: string, content) => Promise<boolean>;
    getFileContent: (filePath: string) => Promise<string>;
    getAllBooks: () => Promise<{ name: string; id: number }[]>;
    createBook: (name: string) => Promise<{ name: string; id: number }>;
    updateBook: (data: { id: number; name: string }) => Promise<boolean>;
    deleteBook: (id: number) => Promise<boolean>;
  };
  $$filePath$$?: string;
  $$fileContent$$?: string;
}
