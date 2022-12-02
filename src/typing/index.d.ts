declare interface Window {
  Bridge?: {
    createNotebook: (name: string) => Promise<void>;
    getNotebooks: () => Promise<import("../dtos/notebooks").NotebookOutput[]>;
    deleteNotebook: (id: number) => Promise<void>;
    getNotes: (id: number) => Promise<import("../dtos/notes").NoteOutput[]>;
  };
}
