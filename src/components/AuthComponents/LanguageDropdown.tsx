/** @format */

"use client";

import React from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { changeAppLanguage } from "@/i18n/init";
import {
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@/i18n/resources";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageDropdown() {
  const { t, i18n } = useTranslation("dashboard");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentLanguage = (SUPPORTED_LANGUAGES.find(
    (item) => item === i18n.language,
  ) ?? "en") as SupportedLanguage;

  const handleLanguageChange = (language: SupportedLanguage) => {
    void changeAppLanguage(language);
  };

  const displayLanguage = mounted ? currentLanguage : "en";
  const displayLabel = mounted ? t("language.label") : "Language";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all text-sm select-none border border-white/5 bg-white/2 hover:bg-white/10 hover:border-white/10 outline-none">
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground text-xs sm:text-sm">
          {displayLabel}
        </span>
        <span className="font-semibold text-white text-xs sm:text-sm">
          {LANGUAGE_LABELS[displayLanguage]}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 mt-1.5 border border-white/10 bg-[#100f17] rounded-xl p-1 shadow-2xl z-50 text-white"
      >
        {SUPPORTED_LANGUAGES.map((languageCode) => (
          <DropdownMenuItem
            key={languageCode}
            onClick={() => handleLanguageChange(languageCode)}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg cursor-pointer text-sm text-white/90 hover:bg-white/5 focus:bg-white/5 focus:text-white transition-colors outline-none"
          >
            <span className="font-medium">
              {LANGUAGE_LABELS[languageCode]}
            </span>
            {mounted && currentLanguage === languageCode ? (
              <span className="text-xs text-muted-foreground/60 font-normal">
                Selected
              </span>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>

  );
}
