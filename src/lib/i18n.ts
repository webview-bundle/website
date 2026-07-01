import { defineI18n } from 'fumadocs-core/i18n';

// Bilingual site. English is the default and lives at the un-prefixed URLs
// (`/`, `/docs/...`); Korean lives under `/ko` (`/ko`, `/ko/docs/...`).
export const i18n = defineI18n({
  languages: ['en', 'ko'],
  defaultLanguage: 'en',
  hideLocale: 'default-locale',
});

export type Locale = (typeof i18n)['languages'][number];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (i18n.languages as readonly string[]).includes(value);
}

// URL prefix for a locale: '' for the default (English), '/ko' otherwise.
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}
