import { injectable } from "inversify";
import { BaseController } from "./BaseController";

@injectable()
export class PagesController extends BaseController {
  name = "pages";

  async create(data: { book_id: number; name: string }) {
    return (await this._db.db.table(this.name).insert(data).returning("*"))[0];
  }
}
