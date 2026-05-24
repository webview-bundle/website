import handler from '@tanstack/react-start/server-entry';
import { enforceAccess } from './lib/access';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const denied = await enforceAccess(request, env);
    if (denied != null) {
      return denied;
    }
    return (handler as any).fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
