/** @format */

"use client";

import { useEffect } from "react";
import i18n from "@/i18n/init";

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
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
