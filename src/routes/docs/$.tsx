import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import { Suspense } from 'react';
import browserCollections from '~source/browser';
import { docSource } from '../../doc';
import { Logo } from '../../layouts/home/components/Logo';
import { GITHUB_URL, NAV_ITEMS } from '../../layouts/home/data';
import { useMDXComponents } from '../../mdx';

export const Route = createFileRoute('/docs/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? [];
    // `/docs` has no tab context; send readers to the Guide tab.
    if (slugs.length === 0) {
      throw redirect({ to: '/docs/$', params: { _splat: 'guide' } });
    }
    const data = await serverLoader({ data: slugs });
    await clientLoader.preload(data.path);
    return data;
  },
});

const serverLoader = createServerFn({
  method: 'GET',
})
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = docSource.getPage(slugs);
    if (page == null) {
      throw notFound();
    }
    return {
      path: page.path,
      pageTree: await docSource.serializePageTree(docSource.getPageTree()),
    };
  });

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: MDX },
    // you can define props for the component
    _props: undefined
  ) {
    return (
      <DocsPage toc={toc}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody>
          <MDX components={useMDXComponents()} />
        </DocsBody>
      </DocsPage>
    );
  },
});

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData());

  return (
    <DocsLayout
      tree={data.pageTree}
      tabMode="navbar"
      nav={{
        mode: 'top',
        url: '/',
        title: (
          <>
            <Logo width={26} height={26} />
            <span className="font-mono text-[15px] font-semibold tracking-tight">
              webview-bundle
            </span>
          </>
        ),
      }}
      links={NAV_ITEMS.map(item => ({
        text: item.label,
        url: item.href.startsWith('#') ? `/${item.href}` : item.href,
      }))}
      githubUrl={GITHUB_URL}
    >
      <Suspense>{clientLoader.useContent(data.path)}</Suspense>
    </DocsLayout>
  );
}
