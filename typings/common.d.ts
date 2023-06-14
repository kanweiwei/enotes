interface PageDto {
  id: number;
  name: string;
  documentId: number;
}

interface DocumentDto {
  id: number;
  name: string;
  pages: Page[];
}
