import { injectable } from "inversify";
import { BaseController } from "./BaseController";

@injectable()
export class PagesController extends BaseController {
  name = "pages";

  async create(data: { book_id: number; name: string }) {
    return (await this._db.db.table(this.name).insert(data).returning("*"))[0];
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

  async updateName(id: number, name: string) {
    try {
      await this._db.db.table(this.name).update({ name }).where({ id });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
