import * as Sentry from '@sentry/cloudflare';
import { wrapFetchWithSentry } from '@sentry/tanstackstart-react';
import entry from '@tanstack/react-start/server-entry';
import { enforceAccess } from './lib/access';
import { sentryDataCollection } from './lib/sentry-options';

async function handler(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const denied = await enforceAccess(request, env);
  if (denied != null) {
    return denied;
  }
  return (entry as any).fetch(request, env, ctx);
}

export default Sentry.withSentry(
  () => ({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    dataCollection: sentryDataCollection,
  }),
  // @ts-expect-error - TanStack's ServerEntry types fetch as (request, opts?), not (request, env, ctx)
  wrapFetchWithSentry({ fetch: handler })
) satisfies ExportedHandler<Env>;
