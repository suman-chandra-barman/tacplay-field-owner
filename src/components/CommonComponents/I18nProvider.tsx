/** @format */

"use client";

import { useEffect } from "react";
import i18n, { getBrowserLanguage } from "@/i18n/init";

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const browserLang = getBrowserLanguage();
    if (i18n.language !== browserLang) {
      void i18n.changeLanguage(browserLang);
    }

    const syncDocumentLang = (language: string) => {
      document.documentElement.lang = language;
    };

    syncDocumentLang(i18n.language);
    i18n.on("languageChanged", syncDocumentLang);

    return () => {
      i18n.off("languageChanged", syncDocumentLang);
    };
  }, []);

  return <>{children}</>;
}
