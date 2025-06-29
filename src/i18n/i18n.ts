import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import pl from "./pl";

export type Resource = typeof pl;

export const defaultNS = "shared";
export const defaultLng = "pl";
export const resources = {
  pl,
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    lng: defaultLng,
    fallbackLng: defaultLng,
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
  })
  .then();
