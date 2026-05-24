import * as Sentry from '@sentry/tanstackstart-react';
import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  });

  if (!router.isServer) {
    Sentry.init({
      dsn: 'https://d1893624a683484f8260184a6025be0f@o4503970038611968.ingest.us.sentry.io/4503970040053760',
      integrations: [],
    });
  }

  return router;
}
