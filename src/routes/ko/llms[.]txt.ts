import { createFileRoute } from '@tanstack/react-router';
import { llmsIndexResponse } from '../../lib/llms';

export const Route = createFileRoute('/ko/llms.txt')({
  server: {
    handlers: {
      GET: () => llmsIndexResponse('ko'),
    },
  },
});
