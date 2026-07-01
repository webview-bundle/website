import { createFileRoute, redirect } from '@tanstack/react-router';
import { DocsShell, docsClientLoader, docsServerLoader } from '../../../layouts/docs/DocsRoute';

export const Route = createFileRoute('/ko/docs/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? [];
    if (slugs.length === 0) {
      throw redirect({ to: '/ko/docs/$', params: { _splat: 'guide' } });
    }
    const data = await docsServerLoader({ data: { slugs, locale: 'ko' } });
    await docsClientLoader.preload(data.path);
    return data;
  },
});

function Page() {
  return <DocsShell data={Route.useLoaderData()} />;
}
