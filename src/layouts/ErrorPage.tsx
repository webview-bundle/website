import * as Sentry from '@sentry/tanstackstart-react';
import { type ErrorComponentProps, useRouterState } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { localeFromPathname, localizeHref, LocaleProvider, useLocale } from '../lib/locale';
import { useUiStrings } from '../lib/ui-strings';
import { SiteHeader } from './SiteHeader';

// Global error page. Rendered by the router's `defaultErrorComponent`, so it
// catches anything a route's render or loader throws — including the docs
// loaders — and, like `NotFound`, takes its locale from the path so a reader who
// broke on `/ko/...` stays in Korean.
export function ErrorPage({ error, info, reset }: ErrorComponentProps) {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const locale = localeFromPathname(pathname);

  return (
    <LocaleProvider locale={locale}>
      <div className="flex min-h-svh flex-col bg-fd-background text-fd-foreground">
        <SiteHeader className="sticky top-0" />
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
          <ErrorBody error={error} info={info} reset={reset} />
        </main>
      </div>
    </LocaleProvider>
  );
}

function ErrorBody({ error, info, reset }: ErrorComponentProps) {
  const t = useUiStrings();
  const locale = useLocale();
  const [eventId, setEventId] = useState<string>();
  const reported = useRef<unknown>(undefined);

  // Report to Sentry once per error instance — the ref survives the re-renders
  // and remounts that `reset` triggers, so a reader retrying a persistent
  // failure doesn't send the same event repeatedly. `info.componentStack` is
  // attached under the `react` context, the same key Sentry's React integration
  // uses, so the stack shows up where the UI expects it.
  //
  // Effects never run during SSR, so this fires on the client only. That is the
  // point: an error the router catches and renders here never propagates out of
  // the server handler, so the Sentry request/function middleware (src/start.ts)
  // never sees it. This is the report.
  useEffect(() => {
    if (reported.current === error) return;
    reported.current = error;
    setEventId(
      Sentry.captureException(error, {
        tags: { boundary: 'router', locale },
        contexts: { react: { componentStack: info?.componentStack } },
      })
    );
  }, [error, info, locale]);

  return (
    <>
      <p className="font-mono text-sm font-medium tracking-[0.2em] text-brand uppercase">
        {t.error.eyebrow}
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-fd-foreground sm:text-4xl">
        {t.error.title}
      </h1>
      <p className="mt-3 max-w-md text-fd-muted-foreground">{t.error.message}</p>

      {/* The raw message is useful while developing and noise (or a leak) in
          production, where the error ID is what we'd actually ask a reader for. */}
      {import.meta.env.DEV && (
        <pre className="mt-6 max-w-xl overflow-x-auto rounded-md border border-zinc-300 bg-fd-muted/50 p-4 text-left font-mono text-xs text-fd-muted-foreground dark:border-zinc-800">
          {error.message}
        </pre>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-2.5 font-mono text-[14px] font-medium text-white transition-colors hover:bg-brand-hover"
        >
          {t.error.retry}
        </button>
        <a
          href={localizeHref('/', locale)}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 px-5 py-2.5 font-mono text-[14px] font-medium text-zinc-800 transition-colors hover:border-zinc-500 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600"
        >
          {t.error.home}
        </a>
      </div>

      {eventId != null && (
        <p className="mt-8 font-mono text-xs text-fd-muted-foreground">
          {t.error.eventId}: <span className="select-all">{eventId}</span>
        </p>
      )}
    </>
  );
}
