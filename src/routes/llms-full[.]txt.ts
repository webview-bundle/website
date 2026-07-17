import { createFileRoute } from '@tanstack/react-router';
import { llmsFullResponse } from '../lib/llms';

export const Route = createFileRoute('/llms-full.txt')({
  server: {
    handlers: {
      GET: () => llmsFullResponse('en'),
    },
  },
});
