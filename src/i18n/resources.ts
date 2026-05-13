/** @format */

import enDashboard from "@/i18n/locales/en/dashboard.json";
import deDashboard from "@/i18n/locales/de/dashboard.json";
import frDashboard from "@/i18n/locales/fr/dashboard.json";
import esDashboard from "@/i18n/locales/es/dashboard.json";

export const DEFAULT_LANGUAGE = "en";

export const SUPPORTED_LANGUAGES = ["en", "de", "fr", "es"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Francais",
  es: "Espanol",
};

export const resources = {
  en: { dashboard: enDashboard },
  de: { dashboard: deDashboard },
  fr: { dashboard: frDashboard },
  es: { dashboard: esDashboard },
} as const;

export const isSupportedLanguage = (
  value: string,
): value is SupportedLanguage =>
  SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);
