/** @format */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  resources,
  type SupportedLanguage,
} from "@/i18n/resources";

const STORAGE_KEY = "tp-language";

export const getBrowserLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const persisted = window.localStorage.getItem(STORAGE_KEY);
  if (persisted && isSupportedLanguage(persisted)) {
    return persisted;
  }

  const browserCode = window.navigator.language.split("-")[0]?.toLowerCase();
  if (browserCode && isSupportedLanguage(browserCode)) {
    return browserCode;
  }

  return DEFAULT_LANGUAGE;
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: "dashboard",
    ns: ["dashboard"],
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });
}

export const changeAppLanguage = async (language: SupportedLanguage) => {
  await i18n.changeLanguage(language);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, language);
  }
};

export default i18n;
