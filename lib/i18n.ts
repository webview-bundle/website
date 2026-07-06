import { defineI18n } from 'fumadocs-core/i18n';

// Bilingual site. English is the default and lives at the un-prefixed URLs
// (`/`, `/docs/...`); Korean lives under `/ko` (`/ko`, `/ko/docs/...`).
export const i18n = defineI18n({
  languages: ['en', 'ko'],
  defaultLanguage: 'en',
  hideLocale: 'default-locale',
});

export type Locale = (typeof i18n)['languages'][number];

// Single source of truth — follows the `defineI18n` config above.
export const DEFAULT_LOCALE: Locale = i18n.defaultLanguage;

export function isLocale(value: string): value is Locale {
  return (i18n.languages as readonly string[]).includes(value);
}

// URL prefix for a locale: '' for the default (English), '/ko' otherwise.
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

// Derive the active locale from a pathname. `/ko/...` → 'ko', otherwise English.
export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  return first != null && isLocale(first) ? first : DEFAULT_LOCALE;
}

// Prefix an internal, root-relative path with the locale ('' for English).
// External URLs, anchors, and already-prefixed paths are returned unchanged.
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const prefix = localePrefix(locale);
  if (prefix === '') return href;
  if (href === prefix || href.startsWith(`${prefix}/`)) return href;
  return `${prefix}${href}`;
}

// Remove any locale prefix from a pathname → the un-prefixed (English) path.
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split('/');
  if (first != null && isLocale(first)) return `/${rest.join('/')}`;
  return pathname;
}

// The equivalent path in another locale, for the language switcher.
export function switchLocalePath(pathname: string, locale: Locale): string {
  const base = stripLocale(pathname);
  return localizeHref(base === '' ? '/' : base, locale);
}

// Korean overrides for the built-in fumadocs-ui strings (search box, table of
// contents, pager, theme/language menus). English uses fumadocs' defaults.
// Keys follow fumadocs' translation scheme: the English default text plus its
// `(note)` (see fumadocs-ui `.translations`); the old flat keys no longer match.
export const KO_UI_TRANSLATIONS: Record<string, string> = {
  'Search(search trigger)': '검색',
  'Search(search dialog)': '검색',
  'Open Search(search trigger)(aria-label)': '검색 열기',
  'Close Search(search dialog)(aria-label)': '검색 닫기',
  'No results found(search dialog)': '결과가 없습니다',
  'On this page(table of contents)': '목차',
  'Table of Contents(inline table of contents)': '목차',
  'No Headings(table of contents)': '제목이 없습니다',
  'Last updated on(page footer)': '마지막 업데이트',
  'Choose a language(language switcher)': '언어 선택',
  'Choose a language(language switcher)(aria-label)': '언어 선택',
  'Next Page(pagination)': '다음',
  'Previous Page(pagination)': '이전',
  'Edit on GitHub(edit page)': 'GitHub에서 편집',
  'Toggle Theme(theme switcher)(aria-label)': '테마 전환',
  'Light(theme switcher)(aria-label)': '라이트',
  'Dark(theme switcher)(aria-label)': '다크',
  'System(theme switcher)(aria-label)': '시스템',
  'Collapse Sidebar(sidebar)(aria-label)': '사이드바 접기',
  'Open Sidebar(sidebar)(aria-label)': '사이드바 열기',
  'Toggle Menu(mobile menu)(aria-label)': '메뉴 전환',
  'Page Not Found(404 page)': '페이지를 찾을 수 없습니다',
  'Back to Home(404 page)': '홈으로',
  displayName: '한국어',
};
