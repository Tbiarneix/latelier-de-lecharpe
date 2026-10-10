export const LOCALES = ["fr", "en", "es", "it"] as const;
export type Locale = (typeof LOCALES)[number];

export function toLocale(value: unknown): Locale {
  return LOCALES.includes(value as Locale) ? (value as Locale) : "fr";
}

/** Locale BCP 47 pour formater les dates. */
export const DATE_LOCALES: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-GB",
  es: "es-ES",
  it: "it-IT",
};

/** Date ISO lisible (ex. « samedi 24 octobre 2026 »), sans décalage de fuseau. */
export function formatLongDate(iso: string, locale: Locale): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(DATE_LOCALES[locale], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
