// oxlint-disable jsx_a11y/html-has-lang
// oxlint-disable jsx_a11y/lang
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { ReactNode } from 'react';
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
  return (
    <html suppressHydrationWarning={true}>
      <head>
        <HeadContent />
      </head>
      <body>
        <RootProvider theme={{ enabled: true }}>{children}</RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
