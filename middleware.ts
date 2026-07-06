import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { enforceAccess } from '@/lib/access';
import { i18n } from '@/lib/i18n';

// Bilingual routing: rewrites each request to its `/<lang>/...` path (the default
// locale's prefix stays hidden), so the `app/[lang]` tree always sees a locale.
const i18nMiddleware = createI18nMiddleware(i18n);

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  // Gate preview deployments (`*.workers.dev`) behind Cloudflare Access before
  // routing; production custom domains are public. Guarded so an Access/context
  // failure can never take down the (critical) i18n routing below.
  if (request.nextUrl.hostname.endsWith('.workers.dev')) {
    try {
      const { env } = await getCloudflareContext({ async: true });
      const denied = await enforceAccess(request, env as unknown as Parameters<typeof enforceAccess>[1]);
      if (denied != null) return denied;
    } catch (error) {
      console.error('Cloudflare Access enforcement failed:', error);
    }
  }

  return i18nMiddleware(request, event);
}

export const config = {
  // Everything except API routes, Next internals, and static files (which carry a dot).
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
