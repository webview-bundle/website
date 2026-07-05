import { createFileRoute } from '@tanstack/react-router';
import { ChangelogShell } from '../../layouts/changelog/ChangelogRoute';
import { fetchReleases } from '../../lib/changelog-data';

// A static route, so it preempts the `/docs/$` fumadocs splat for `/docs/changelog`.
export const Route = createFileRoute('/docs/changelog')({
  component: Page,
  loader: () => fetchReleases(),
});

function Page() {
  const { releases, error } = Route.useLoaderData();
  return <ChangelogShell locale="en" releases={releases} error={error} />;
}
