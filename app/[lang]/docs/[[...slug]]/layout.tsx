import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { DocsNavbar } from '@/components/docs/DocsNavbar';
import { withExperimentalBadges } from '@/components/docs/sidebar-badges';
import { GITHUB_URL } from '@/components/home/data';
import { isLocale } from '@/lib/i18n';
import { source } from '@/lib/source';

// Docs shell (shared across every guide/reference page): the notebook layout —
// a full-width top navbar (the shared SiteHeader) with the page tree in the left
// sidebar. The changelog is a sibling route with its own standalone shell, so it
// deliberately doesn't inherit this sidebar.
export default async function DocsLayoutWrapper({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const tree = withExperimentalBadges(source.getPageTree(lang));

  return (
    <DocsLayout
      tree={tree}
      tabMode="navbar"
      nav={{ mode: 'top', component: <DocsNavbar /> }}
      githubUrl={GITHUB_URL}
    >
      {children}
    </DocsLayout>
  );
}
