import { createFileRoute } from '@tanstack/react-router';
import { createFromSource } from 'fumadocs-core/search/server';
import { docSource } from '../../doc';

const server = createFromSource(docSource, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
});

export const Route = createFileRoute('/api/search')({
  server: {
    handlers: {
      GET: async ({ request }) => server.GET(request),
    },
  },
});
