import { createFileRoute } from '@tanstack/react-router';
import { getRSS } from '../rss';

export const Route = createFileRoute('/rss.xml')({
  server: {
    handlers: {
      GET: async () => new Response(getRSS()),
    },
  },
});
