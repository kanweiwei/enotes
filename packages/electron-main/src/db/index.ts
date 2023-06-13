import { app } from "electron";
import knex, { Knex } from "knex";
import { join } from "path";
import { injectable } from "inversify";

@injectable()
export class LocalDB {
  declare db: Knex;
  async init() {
    this.db = knex({
      client: "sqlite",
      useNullAsDefault: true,
      connection: {
        filename: join(app.getPath("userData"), "local.db"),
      },
    });
    await this.sync();
  }

  async sync() {
    await this.db.schema.hasTable("books").then((exist) => {
      if (exist) return;
      return this.db.schema.createTable("books", (table) => {
        table.bigIncrements("id", { primaryKey: true });
        table.string("name");
        table.timestamps(true, true);
      });
    });
    await this.db.schema.hasTable("articles").then((exist) => {
      if (exist) return;
      return this.db.schema.createTable("articles", (table) => {
        table.bigIncrements("id", { primaryKey: true });
        table.string("name");
        table.text("content");
        table.bigInteger("book_id");
        table.integer("sort_order");
        table.timestamps(true, true);
      });
    });
  }
}
