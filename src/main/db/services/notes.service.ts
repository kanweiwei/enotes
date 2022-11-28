import { inject, injectable } from "inversify";
import { LocalDB } from "../db";

interface NoteModel {
  id: number;
  name: string;
  content: string;
  notebook_id: number;
  create_at: string;
  update_at: string;
}

@injectable()
export class NotesService {
  name = "notes";

  constructor(@inject(LocalDB) public localDB: LocalDB) {}

  async getByNotebookId(notebookId: number) {
    return await this.localDB.db
      .table<NoteModel>(this.name)
      .select("*")
      .where("notebook_id", "=", notebookId);
  }
}
