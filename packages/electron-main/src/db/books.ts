import { inject, injectable } from "inversify";
import { LocalDB } from ".";

export interface BookModel {
  id: number;
  name: string;
  created_at: number;
  updated_at: number;
}

@injectable()
export class BooksController {
  name = "books";
  constructor(@inject(LocalDB) private _db: LocalDB) {}

  async create(name: string) {
    return (
      await this._db.db.table(this.name).insert({ name }).returning("*")
    )[0];
  }

  async update(data: { id: number; name: string }) {
    return this._db.db
      .table(this.name)
      .update({ name: data.name })
      .where({ id: data.id });
  }

  async delete(id: number) {
    try {
      await this._db.db.table(this.name).where({ id }).del();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getAll() {
    return await this._db.db.table(this.name).select("*");
  }
}
