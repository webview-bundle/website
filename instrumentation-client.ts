import * as Sentry from '@sentry/nextjs';

// Browser-side Sentry. The error boundaries (app/[lang]/error.tsx,
// app/global-error.tsx) run on the client and call `Sentry.captureException`;
// this init is what actually delivers those events. A no-op unless a DSN is set,
// so local/dev and unconfigured deploys send nothing.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production' && Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  tracesSampleRate: 0,
});

// Instruments client-side navigations (Next 16 convention).
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
