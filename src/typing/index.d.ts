declare interface Window {
  Bridge?: {
    createNotebook: (name: string) => Promise<void>;
    getNotebooks: () => Promise<
      { id: number; name: string; create_at: string; update_at: string }[]
    >;
  };
}
