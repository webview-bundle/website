'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { ErrorScreen } from '@/components/ErrorScreen';

// Segment error boundary for everything under `[lang]`. Renders inside the locale
// layout (providers present), reports the error to Sentry, and offers a retry.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return <ErrorScreen reset={reset} />;
}
