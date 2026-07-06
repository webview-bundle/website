'use client';

import './global.css';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

// Root error boundary: only fires when the root/[lang] layout itself throws, so
// it must render its own <html>/<body> and can't rely on the locale providers.
// Kept minimal and English-only; reports to Sentry like the segment boundary.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-svh flex-col items-center justify-center bg-white px-6 py-24 text-center text-zinc-900 dark:bg-[#09090a] dark:text-zinc-100">
        <p className="font-mono text-sm font-medium tracking-[0.2em] text-brand">500</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-3 max-w-md text-zinc-500 dark:text-zinc-400">
          An unexpected error occurred. The issue has been reported — please try again.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-brand px-5 py-2.5 font-mono text-[14px] font-medium text-white transition-colors hover:bg-brand-hover"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-5 py-2.5 font-mono text-[14px] font-medium text-zinc-800 transition-colors hover:border-zinc-500 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600"
          >
            Go home
          </a>
        </div>
      </body>
    </html>
  );
}
