import { createFileRoute, redirect } from '@tanstack/react-router';

// `/docs` itself has no tab context — land readers on the Guide tab.
export const Route = createFileRoute('/docs/')({
  beforeLoad: () => {
    throw redirect({ to: '/docs/$', params: { _splat: 'guide' } });
  },
});
