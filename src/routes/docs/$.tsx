import { createFileRoute } from '@tanstack/react-router';
import { docsClientLoader, docsServerLoader, DocsShell } from '../../layouts/docs/DocsRoute';

export const Route = createFileRoute('/docs/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? [];
    const data = await docsServerLoader({ data: { slugs, locale: 'en' } });
    await docsClientLoader.preload(data.path);
    return data;
  },
});

function Page() {
  return <DocsShell data={Route.useLoaderData()} />;
}
