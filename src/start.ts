import {
  sentryGlobalFunctionMiddleware,
  sentryGlobalRequestMiddleware,
} from '@sentry/tanstackstart-react';
import { createCsrfMiddleware, createStart } from '@tanstack/react-start';

// Server functions are same-origin RPC endpoints; reject cross-site requests to
// them (same-origin check via Sec-Fetch-Site / Origin, with a Referer fallback).
const csrfMiddleware = createCsrfMiddleware({
  filter: ctx => ctx.handlerType === 'serverFn',
});

export const startInstance = createStart(() => {
  return {
    // Sentry first (outermost) so it observes the whole request, including any
    // CSRF rejection raised by the middleware after it.
    requestMiddleware: [sentryGlobalRequestMiddleware, csrfMiddleware],
    functionMiddleware: [sentryGlobalFunctionMiddleware],
  };
});
