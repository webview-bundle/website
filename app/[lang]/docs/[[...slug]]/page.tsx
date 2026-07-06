import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  PageLastUpdate,
} from 'fumadocs-ui/layouts/notebook/page';
import { notFound, redirect } from 'next/navigation';
import { MobileTocBar } from '@/components/docs/MobileTocBar';
import { getMDXComponents } from '@/components/mdx';
import { isLocale, localizeHref, type Locale } from '@/lib/i18n';
import { source } from '@/lib/source';

// Server-render docs on demand. The MDX bodies are bundled, so SSR is fast, and
// this avoids OpenNext's prerender-cache path — which, combined with the
// default-locale middleware rewrite (`/docs/*` → `/en/docs/*`), spins when no
// incremental cache is configured. `generateStaticParams` still drives the
// language switcher's known paths; `dynamic` opts the render itself out of SSG.
export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const slugs = slug ?? [];

  // Neither `/docs` nor `/docs/guide` has a page of its own (the Guide tab has no
  // index) — land readers on the Guide's first page, in their locale.
  if (slugs.length === 0 || (slugs.length === 1 && slugs[0] === 'guide')) {
    redirect(localizeHref('/docs/guide/getting-started', locale));
  }

  const page = source.getPage(slugs, locale);
  if (page == null) notFound();

  const MDX = page.data.body;
  // `lastModified` is injected by the last-modified plugin (git commit time,
  // see source.config.ts). Rendered as a localized "Last updated on" /
  // "마지막 업데이트" line under the content.
  const lastModified = (page.data as { lastModified?: Date | string }).lastModified;

  return (
    <DocsPage toc={page.data.toc} tableOfContentPopover={{ component: <MobileTocBar /> }}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents(locale)} />
      </DocsBody>
      {lastModified != null && <PageLastUpdate date={new Date(lastModified)} />}
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}
