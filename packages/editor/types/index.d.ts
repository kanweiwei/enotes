declare interface Window {
  Bridge?: {
    export: (content: string) => Promise<string>;
    save: (filePath: string, content) => Promise<boolean>;
    getFileContent: (filePath: string) => Promise<string>;
    getDocuments: () => Promise<DocumentDto[]>;
    getWithPages: () => Promise<DocumentDto[]>;
    createDocument: (name: string) => Promise<DocumentDto>;
    updateDocument: (data: { id: number; name: string }) => Promise<boolean>;
    deleteDocument: (id: number) => Promise<boolean>;
    createPage: (data: { documentId: number; name: string }) => Promise<Page>;
    deletePage: (id: number) => Promise<boolean>;
    updatePageName: (id: number, name: string) => Promise<boolean>;
  };
  $$filePath$$?: string;
  $$fileContent$$?: string;
}
