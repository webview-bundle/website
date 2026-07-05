import { createFileRoute, redirect } from '@tanstack/react-router';
import { DocsShell, docsClientLoader, docsServerLoader } from '../../layouts/docs/DocsRoute';

export const Route = createFileRoute('/docs/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? [];
    // Neither `/docs` nor `/docs/guide` has a page of its own (the Guide tab has
    // no index) — land readers on the Guide's first page.
    if (slugs.length === 0 || (slugs.length === 1 && slugs[0] === 'guide')) {
      throw redirect({ to: '/docs/$', params: { _splat: 'guide/getting-started' } });
    }
    const data = await docsServerLoader({ data: { slugs, locale: 'en' } });
    await docsClientLoader.preload(data.path);
    return data;
  },
});

function Page() {
  return <DocsShell data={Route.useLoaderData()} />;
}
