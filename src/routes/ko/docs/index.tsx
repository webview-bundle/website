import { createFileRoute, redirect } from '@tanstack/react-router';

// `/ko/docs` itself has no tab context — land readers on the Guide tab.
export const Route = createFileRoute('/ko/docs/')({
  beforeLoad: () => {
    throw redirect({ to: '/ko/docs/$', params: { _splat: 'guide' } });
  },
});
