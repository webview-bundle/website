import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from '@tanstack/react-router';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { ReactNode } from 'react';
import { KO_UI_TRANSLATIONS, localeFromPathname } from '../lib/locale';
import styles from '../styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Webview Bundle',
      },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://static.wvb.dev',
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
        sizes: '32x32',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-96x96.png',
        sizes: '96x96',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '180x180',
      },
      {
        rel: 'stylesheet',
        href: styles,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const locale = localeFromPathname(pathname);

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <head>
        <HeadContent />
      </head>
      <body>
        <RootProvider
          theme={{ enabled: true }}
          i18n={{ locale, translations: locale === 'ko' ? KO_UI_TRANSLATIONS : undefined }}
        >
          {children}
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
