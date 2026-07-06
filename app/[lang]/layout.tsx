import { RootProvider } from 'fumadocs-ui/provider/next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { i18n, isLocale, KO_UI_TRANSLATIONS, type Locale } from '@/lib/i18n';
import { LocaleProvider } from '@/lib/locale';

// Available languages for the fumadocs search dialog / built-in switcher.
const LOCALES = [
  { name: 'English', locale: 'en' },
  { name: '한국어', locale: 'ko' },
];

// Per-locale document root. The i18n middleware rewrites every request to a
// `/<lang>/...` path (with the default locale's prefix hidden), so `[lang]` is
// always present and this layout owns `<html>`/`<body>` and the providers.
export default async function LangLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider
          i18n={{
            locale,
            locales: LOCALES,
            translations: locale === 'ko' ? KO_UI_TRANSLATIONS : undefined,
          }}
        >
          <LocaleProvider locale={locale}>{children}</LocaleProvider>
        </RootProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return i18n.languages.map(lang => ({ lang }));
}
