import { inject, injectable } from "inversify";
import { NotebooksService } from "../services/notebooks.service";
import { NotesService } from "../services/notes.service";

@injectable()
export class NotebooksController {
  constructor(
    @inject(NotebooksService) public service: NotebooksService,
    @inject(NotesService) public notesService: NotesService
  ) {}

  async create(name: string) {
    await this.service.create({
      name,
    });
  }

  async delete(id: number) {
    const row = await this.service.get(id);
    if (row) {
      const notes = await this.notesService.getByNotebookId(id);
      if (notes.length) throw Error("delete failed");
      await this.service.delete(id);
    }
  }

  async update(data: { id: number; name: string }) {
    return await this.service.update(data);
  }

  async getAll() {
    return await this.service.getAll();
  }
}
