import { createFileRoute, redirect } from '@tanstack/react-router';
import { DocsShell, docsClientLoader, docsServerLoader } from '../../layouts/docs/DocsRoute';

export const Route = createFileRoute('/docs/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? [];
    // `/docs` has no tab context; send readers to the Guide tab.
    if (slugs.length === 0) {
      throw redirect({ to: '/docs/$', params: { _splat: 'guide' } });
    }
    const data = await docsServerLoader({ data: { slugs, locale: 'en' } });
    await docsClientLoader.preload(data.path);
    return data;
  },
});

function Page() {
  return <DocsShell data={Route.useLoaderData()} />;
}
