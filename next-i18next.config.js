/**
 * @format
 * @type {import('next-i18next').UserConfig}
 */

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "fr", "es"],
  },
  defaultNS: "dashboard",
  ns: ["dashboard"],
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
