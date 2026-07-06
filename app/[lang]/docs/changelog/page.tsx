import { notFound } from 'next/navigation';
import { Changelog } from '@/components/changelog/Changelog';
import { SiteHeader } from '@/components/SiteHeader';
import { getChangelog } from '@/lib/changelog-data';
import { isLocale } from '@/lib/i18n';

// The changelog is served from GitHub releases (not the MDX source), so it lives
// outside the docs notebook layout: a standalone shell with the shared SiteHeader
// (the "Changelog" tab reads as active) and no page-tree sidebar. Its own scoped
// search + package filter live in the toolbar.
//
// Rendered as an async Server Component: releases are fetched on the server at
// request time (cached per isolate + at the edge, see `getChangelog`) and handed
// to the interactive `<Changelog>` client component as data.
export const dynamic = 'force-dynamic';

export default async function ChangelogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const { releases, error } = await getChangelog();

  return (
    <div className="flex min-h-svh flex-col bg-fd-background text-fd-foreground">
      <SiteHeader className="sticky top-0" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-10 pb-24 sm:px-6">
        <Changelog releases={releases} error={error} />
      </main>
    </div>
  );
}
