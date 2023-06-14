import { inject, injectable } from "inversify";
import { LocalDB } from ".";

@injectable()
export class BaseController {
  constructor(@inject(LocalDB) protected _db: LocalDB) {}
}
