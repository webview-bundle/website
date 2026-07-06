'use client';

import { createContext, type ReactNode, use } from 'react';
import { DEFAULT_LOCALE, type Locale } from './i18n';

// Client-side locale context. The active locale is provided (server-known, from
// the `[lang]` segment) by `LocaleProvider` in the layout; client components read
// it with `useLocale`. Pure locale helpers (localizeHref, switchLocalePath, …)
// and the KO translations live in `./i18n` so server components can use them too.
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useLocale(): Locale {
  return use(LocaleContext);
}
