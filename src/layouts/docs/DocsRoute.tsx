import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import { Suspense, useMemo } from 'react';
import browserCollections from '~source/browser';
import { docSource } from '../../doc';
import type { Locale } from '../../lib/i18n';
import { LocaleProvider } from '../../lib/locale';
import { useMDXComponents } from '../../mdx';
import { GITHUB_URL } from '../home/data';
import { DocsNavbar } from './DocsNavbar';
import { MobileTocBar } from './MobileTocBar';
import { withExperimentalBadges } from './sidebar-badges';

// Shared docs route wiring, parameterized by locale so `/docs/*` (English) and
// `/ko/docs/*` (Korean) render the same UI from the locale's page tree.
export const docsServerLoader = createServerFn({ method: 'GET' })
  .inputValidator((input: { slugs: string[]; locale: Locale }) => input)
  .handler(async ({ data: { slugs, locale } }) => {
    const page = docSource.getPage(slugs, locale);
    if (page == null) {
      throw notFound();
    }
    return {
      path: page.path,
      locale,
      pageTree: await docSource.serializePageTree(docSource.getPageTree(locale)),
    };
  });

export const docsClientLoader = browserCollections.docs.createClientLoader({
  component({ toc, frontmatter, default: MDX }, _props: undefined) {
    return (
      <DocsPage toc={toc} tableOfContentPopover={{ component: <MobileTocBar /> }}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody>
          <MDX components={useMDXComponents()} />
        </DocsBody>
      </DocsPage>
    );
  },
});

export function DocsShell({
  data,
}: {
  data: {
    path: string;
    locale: Locale;
    pageTree: Awaited<ReturnType<typeof docsServerLoader>>['pageTree'];
  };
}) {
  const loaded = useFumadocsLoader({ path: data.path, pageTree: data.pageTree });
  const tree = useMemo(() => withExperimentalBadges(loaded.pageTree), [loaded.pageTree]);

  return (
    <LocaleProvider locale={data.locale}>
      <DocsLayout
        tree={tree}
        tabMode="navbar"
        nav={{ mode: 'top', component: <DocsNavbar /> }}
        githubUrl={GITHUB_URL}
      >
        <Suspense>{docsClientLoader.useContent(loaded.path)}</Suspense>
      </DocsLayout>
    </LocaleProvider>
  );
}
