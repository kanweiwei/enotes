import { Container } from "inversify";

export const ioc = new Container({
  defaultScope: "Singleton",
  autoBindInjectable: true,
});
