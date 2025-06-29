import { defaultNS, resources } from "./i18n.ts";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["pl"];
  }
}
