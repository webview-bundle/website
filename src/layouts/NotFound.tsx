import { useRouterState } from '@tanstack/react-router';
import { localeFromPathname, localizeHref, LocaleProvider, useLocale } from '../lib/locale';
import { useUiStrings } from '../lib/ui-strings';
import { SiteHeader } from './SiteHeader';

// Global 404 page. Rendered by the router's `defaultNotFoundComponent`, so it
// catches both unmatched URLs and `notFound()` thrown from docs loaders. The
// locale is inferred from the path (`/ko/...` → Korean) so the message and the
// nav links match the section the reader came from.
export function NotFound() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const locale = localeFromPathname(pathname);

  return (
    <LocaleProvider locale={locale}>
      <div className="flex min-h-svh flex-col bg-fd-background text-fd-foreground">
        <SiteHeader className="sticky top-0" />
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
          <NotFoundBody />
        </main>
      </div>
    </LocaleProvider>
  );
}

function NotFoundBody() {
  const t = useUiStrings();
  const locale = useLocale();

  return (
    <>
      <p className="font-mono text-sm font-medium tracking-[0.2em] text-brand">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-fd-foreground sm:text-4xl">
        {t.notFound.title}
      </h1>
      <p className="mt-3 max-w-md text-fd-muted-foreground">{t.notFound.message}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href={localizeHref('/', locale)}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-2.5 font-mono text-[14px] font-medium text-white transition-colors hover:bg-brand-hover"
        >
          {t.notFound.home}
        </a>
        <a
          href={localizeHref('/docs/guide', locale)}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 px-5 py-2.5 font-mono text-[14px] font-medium text-zinc-800 transition-colors hover:border-zinc-500 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600"
        >
          {t.notFound.docs}
        </a>
      </div>
    </>
  );
}
