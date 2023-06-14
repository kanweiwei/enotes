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
    await this.db.schema.hasTable("documents").then((exist) => {
      if (exist) return;
      return this.db.schema.createTable("documents", (table) => {
        table.bigIncrements("id", { primaryKey: true });
        table.string("name");
        table.timestamps(true, true);
      });
    });
    await this.db.schema.hasTable("pages").then((exist) => {
      if (exist) return;
      return this.db.schema.createTable("pages", (table) => {
        table.bigIncrements("id", { primaryKey: true });
        table.string("name");
        table.text("content");
        table.bigInteger("documentId");
        table.integer("sort_order");
        table.timestamps(true, true);
      });
    });
  }
}
