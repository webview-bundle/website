import type { Release } from '../../lib/changelog';
import type { Locale } from '../../lib/i18n';
import { LocaleProvider } from '../../lib/locale';
import { SiteHeader } from '../SiteHeader';
import { Changelog } from './Changelog';

// Standalone shell for the changelog route. It reuses the shared SiteHeader
// (so the section tabs, global search, language, and theme controls all work
// and the "Changelog" tab reads as active) but deliberately skips the fumadocs
// DocsLayout: the changelog is served from GitHub releases, not the MDX source,
// so it carries no page tree and is absent from the global search index. Its own
// scoped search + package filter live in the toolbar.
export function ChangelogShell({
  locale,
  releases,
  error,
}: {
  locale: Locale;
  releases: Release[];
  error: boolean;
}) {
  return (
    <LocaleProvider locale={locale}>
      <div className="flex min-h-svh flex-col bg-fd-background text-fd-foreground">
        <SiteHeader className="sticky top-0" />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-10 pb-24 sm:px-6">
          <Changelog releases={releases} error={error} />
        </main>
      </div>
    </LocaleProvider>
  );
}
