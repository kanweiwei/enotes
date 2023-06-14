import { injectable } from "inversify";
import { BaseController } from "./BaseController";

export interface BookModel {
  id: number;
  name: string;
  created_at: number;
  updated_at: number;
}

@injectable()
export class DocumentsController extends BaseController {
  name = "documents";

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

  async getWithPages(): Promise<Document[]> {
    const pageSubquery = this._db.db
      .select(
        "documentId",
        this._db.db.raw(
          "json_group_array(json_object('id', id, 'name', name, 'documentId', documentId)) as pages"
        )
      )
      .from("pages")
      .groupBy("documentId")
      .as("pages");

    const documents = await this._db.db
      .select("documents.id", "documents.name", "pages.pages")
      .from(this.name)
      .leftJoin(pageSubquery, "documents.id", "pages.documentId")
      .orderBy("documents.id", "asc");

    return documents.map((document) => {
      if (document.pages) {
        document.pages = JSON.parse(document.pages);
      }
      return document;
    });
  }
}
