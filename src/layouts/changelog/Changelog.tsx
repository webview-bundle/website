import { type ComponentProps, useEffect, useMemo, useRef, useState } from 'react';
import {
  CHANGELOG_REPO,
  filterReleases,
  type Release,
  type ReleaseChange,
  releasePackages,
} from '../../lib/changelog';
import { cn } from '../../lib/cn';
import type { Locale } from '../../lib/i18n';
import { localizeHref, useLocale } from '../../lib/locale';
import { useUiStrings } from '../../lib/ui-strings';

function ChevronDownIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function PackageIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="m3 8 9 5 9-5M12 13v8" />
    </svg>
  );
}

function SearchIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

function ArrowUpRightIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

// Package filter dropdown. Manual popover (matching LanguageDropdown) so it
// shares the header controls' look and needs no extra dependency.
function PackageFilter({
  packages,
  value,
  onChange,
}: {
  packages: { key: string; name: string }[];
  value: string;
  onChange: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const t = useUiStrings();
  const options = [{ key: 'all', name: t.changelog.allPackages }, ...packages];
  const current = options.find(option => option.key === value) ?? options[0]!;

  // Dismiss on outside pointerdown or Escape. A fixed full-screen overlay can't
  // be used here: the sticky toolbar's `backdrop-blur` establishes a containing
  // block for fixed descendants, so the overlay would be confined to the toolbar
  // and neither catch outside clicks nor let clicks through to sibling controls.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current != null && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(state => !state)}
        aria-label={t.changelog.filterLabel}
        aria-expanded={open}
        className="flex h-9 min-w-52 items-center gap-2 rounded-md border border-zinc-300 px-2.5 text-sm text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700"
      >
        <PackageIcon className="size-4 shrink-0 text-zinc-400" />
        <span
          className={cn('truncate', current.key !== 'all' && 'font-mono text-[13px] text-brand')}
        >
          {current.name}
        </span>
        <ChevronDownIcon
          className={cn('ms-auto size-3.5 shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <ul className="absolute start-0 z-50 mt-2 max-h-80 min-w-64 overflow-auto rounded-md border border-fd-border bg-fd-popover py-1 text-sm shadow-lg">
          {options.map(option => {
            const active = option.key === value;
            return (
              <li key={option.key}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.key);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 px-3 py-1.5 text-start transition-colors hover:bg-fd-accent',
                    option.key !== 'all' && 'font-mono text-[13px]'
                  )}
                >
                  <span className={cn('truncate', active && 'text-brand')}>{option.name}</span>
                  {active && <span className="shrink-0 text-brand">✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// A single changelog bullet: a subtle conventional-commit prefix, the message,
// and the PR number linked to its pull request.
function ChangeText({ change }: { change: ReleaseChange }) {
  let text = change.text;
  if (change.prNumber != null) {
    text = text.replace(/\s*\(#\d+\)\s*$/, '');
  }

  let prefix: string | undefined;
  const conventional = text.match(/^(\w+(?:\([^)]*\))?!?:)\s+([\s\S]+)$/);
  let rest = text;
  if (conventional != null) {
    prefix = conventional[1];
    rest = conventional[2]!;
  }

  return (
    <>
      {prefix != null && (
        <span className="font-mono text-[12px] text-fd-muted-foreground">{prefix} </span>
      )}
      <span>{rest}</span>
      {change.prNumber != null && (
        <>
          {' '}
          <a
            href={`https://github.com/${CHANGELOG_REPO}/pull/${change.prNumber}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[12px] text-fd-muted-foreground underline-offset-2 hover:text-brand hover:underline"
          >
            #{change.prNumber}
          </a>
        </>
      )}
    </>
  );
}

function formatDate(date: string, locale: Locale): string {
  if (date === '') return '';
  return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
}

function ReleaseItem({ release, isLatest }: { release: Release; isLatest: boolean }) {
  const locale = useLocale();
  const t = useUiStrings();

  return (
    <article className="border-t border-fd-border py-8 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          {release.packageUrl != null ? (
            <a
              href={release.packageUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm font-medium text-fd-foreground underline-offset-4 hover:text-brand hover:underline"
            >
              {release.packageName}
            </a>
          ) : (
            <span className="font-mono text-sm font-medium text-fd-foreground">
              {release.packageName}
            </span>
          )}
          <span className="rounded-sm border border-brand/30 bg-brand/10 px-1.5 py-0.5 font-mono text-xs font-medium text-brand">
            v{release.version}
          </span>
          {isLatest && (
            <span className="rounded-sm border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-zinc-600 uppercase dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {t.changelog.latest}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-fd-muted-foreground">
          {release.date !== '' && (
            <time dateTime={release.date}>{formatDate(release.date, locale)}</time>
          )}
          <a
            href={release.htmlUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={t.changelog.viewRelease}
            className="inline-flex items-center gap-0.5 underline-offset-2 hover:text-brand hover:underline"
          >
            GitHub
            <ArrowUpRightIcon className="size-3" />
          </a>
        </div>
      </div>

      {release.changes.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {release.changes.map((change, index) => (
            <li key={index} className="flex gap-2 text-sm leading-relaxed text-fd-foreground">
              <span className="mt-0.5 shrink-0 text-fd-muted-foreground select-none" aria-hidden>
                –
              </span>
              <span className="min-w-0">
                <ChangeText change={change} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function Changelog({ releases, error }: { releases: Release[]; error: boolean }) {
  const t = useUiStrings();
  const locale = useLocale();
  const [selected, setSelected] = useState<string>('all');
  const [query, setQuery] = useState('');

  const packages = useMemo(() => releasePackages(releases), [releases]);
  const filtered = useMemo(
    () => filterReleases(releases, selected, query),
    [releases, selected, query]
  );

  // The newest release for each package (computed over the full set) is marked
  // "latest" — stays meaningful while searching/filtering.
  const latestTags = useMemo(() => {
    const seen = new Set<string>();
    const tags = new Set<string>();
    for (const release of releases) {
      if (!seen.has(release.packageKey)) {
        seen.add(release.packageKey);
        tags.add(release.tag);
      }
    }
    return tags;
  }, [releases]);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-fd-foreground">
          {t.changelog.title}
        </h1>
        <p className="mt-2 text-fd-muted-foreground">{t.changelog.subtitle}</p>
      </header>

      {releases.length === 0 ? (
        <p className="rounded-md border border-fd-border bg-fd-card px-4 py-8 text-center text-sm text-fd-muted-foreground">
          {error ? t.changelog.empty : t.changelog.noReleases}
        </p>
      ) : (
        <>
          <div className="sticky top-14 z-20 -mx-4 mb-2 flex flex-wrap items-center gap-2 border-b border-fd-border bg-fd-background/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
            <PackageFilter packages={packages} value={selected} onChange={setSelected} />
            <div className="relative min-w-48 flex-1">
              <SearchIcon className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder={t.changelog.searchPlaceholder}
                aria-label={t.changelog.searchLabel}
                className="h-9 w-full rounded-md border border-zinc-300 bg-transparent ps-8 pe-3 text-sm text-fd-foreground placeholder:text-zinc-400 focus:border-brand focus:outline-none dark:border-zinc-800"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-fd-muted-foreground">
              {t.changelog.noResults}
            </p>
          ) : (
            <div className="mt-4">
              {filtered.map(release => (
                <ReleaseItem
                  key={release.tag}
                  release={release}
                  isLatest={latestTags.has(release.tag)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <footer className="mt-12 border-t border-fd-border pt-6 text-sm leading-relaxed text-fd-muted-foreground">
        {t.changelog.versioningNote}{' '}
        <a
          href={localizeHref('/docs/guide/bundle-format', locale)}
          className="text-brand underline-offset-2 hover:underline"
        >
          {t.changelog.bundleFormatLink}
        </a>
        .
      </footer>
    </div>
  );
}
