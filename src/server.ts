import * as Sentry from '@sentry/cloudflare';
import { wrapFetchWithSentry } from '@sentry/tanstackstart-react';
import entry from '@tanstack/react-start/server-entry';
import { enforceAccess } from './lib/access';

async function handler(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const denied = await enforceAccess(request, env);
  if (denied != null) {
    return denied;
  }
  return (entry as any).fetch(request, env, ctx);
}

export default Sentry.withSentry(
  () => ({
    dsn: 'https://d1893624a683484f8260184a6025be0f@o4503970038611968.ingest.us.sentry.io/4503970040053760',
    sendDefaultPii: false,
  }),
  // @ts-expect-error - TanStack's ServerEntry types fetch as (request, opts?), not (request, env, ctx)
  wrapFetchWithSentry({ fetch: handler })
) satisfies ExportedHandler<Env>;
