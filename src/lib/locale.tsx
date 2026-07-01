import { createContext, type ReactNode, use } from 'react';
import { DEFAULT_LOCALE, isLocale, type Locale, localePrefix } from './i18n';

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useLocale(): Locale {
  return use(LocaleContext);
}

// Derive the active locale from a pathname. `/ko/...` → 'ko', otherwise English.
export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  return first != null && isLocale(first) ? first : DEFAULT_LOCALE;
}

// Korean overrides for the built-in fumadocs-ui strings (search box, table of
// contents, pager, theme/language menus). English uses fumadocs' defaults.
export const KO_UI_TRANSLATIONS = {
  search: '검색',
  searchNoResult: '결과가 없습니다',
  toc: '목차',
  tocNoHeadings: '제목이 없습니다',
  lastUpdate: '마지막 업데이트',
  chooseLanguage: '언어 선택',
  nextPage: '다음',
  previousPage: '이전',
  chooseTheme: '테마 선택',
  editOnGithub: 'GitHub에서 편집',
};

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
