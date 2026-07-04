import { createFileRoute } from '@tanstack/react-router';
import { ChangelogShell } from '../../../layouts/changelog/ChangelogRoute';
import { fetchReleases } from '../../../lib/changelog-data';

// A static route, so it preempts the `/ko/docs/$` fumadocs splat for `/ko/docs/changelog`.
export const Route = createFileRoute('/ko/docs/changelog')({
  component: Page,
  loader: () => fetchReleases(),
});

function Page() {
  const { releases, error } = Route.useLoaderData();
  return <ChangelogShell locale="ko" releases={releases} error={error} />;
}
