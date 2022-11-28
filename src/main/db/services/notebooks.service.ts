import { inject, injectable } from "inversify";
import { LocalDB } from "../db";

interface NotebookModel {
  id: number;
  name: string;
  create_at?: string | null;
  update_at?: string | null;
}

@injectable()
export class NotebooksService {
  name = "notebooks";
  constructor(@inject(LocalDB) public localDB: LocalDB) {}

  async create(data: { name: string }) {
    return await this.localDB.db.table(this.name).insert(data);
  }

  async get(id: number) {
    return await this.localDB.db
      .table<NotebookModel>(this.name)
      .select("*")
      .where("id", "=", id)
      .first();
  }

  async delete(id: number) {
    return await this.localDB.db.table(this.name).where("id", "=", id).delete();
  }

  async update(data: { id: number; name: string }) {
    return await this.localDB.db
      .table(this.name)
      .where("id", "=", data.id)
      .update({ name: data.name });
  }

  async getAll() {
    return await this.localDB.db.table<NotebookModel>(this.name).select("*");
  }
}
