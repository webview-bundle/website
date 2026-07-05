// Changelog data model + parsing for the GitHub-releases-backed changelog page.
//
// Releases in webview-bundle/webview-bundle are cut per package, tagged
// `<packageKey>/<version>` (e.g. `cli/0.1.0`, `remote-aws-provider-pulumi/0.1.0`)
// with a changeset-style body:
//
//   # Changelog
//   ## cli v0.1.0
//   This release includes packages: [`@wvb/cli`](https://npmjs.com/package/@wvb/cli/v/0.1.0)
//   - feat(config,cli): supports cli to read config file (#92)
//   - ...
//
// Per-commit prereleases (`prerelease/<sha>`, `*-next.<sha>`) are excluded — they
// are build snapshots, not meaningful changelog entries. Parsing is kept pure and
// framework-free so it runs on the Worker and is easy to reason about.

/** Owner/repo the changelog is sourced from. */
export const CHANGELOG_REPO = 'webview-bundle/webview-bundle';

/** Raw GitHub Releases API shape (only the fields we read). */
export interface GhRelease {
  tag_name: string;
  name: string | null;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  html_url: string;
}

/** A single changelog bullet, with the PR number linkified when present. */
export interface ReleaseChange {
  text: string;
  prNumber?: number;
}

/** A normalized, published stable release for one package. */
export interface Release {
  /** Full git tag, e.g. `cli/0.1.0` (stable identity). */
  tag: string;
  /** Tag prefix used as the package filter key, e.g. `cli`. */
  packageKey: string;
  /** Display package name from the body, e.g. `@wvb/cli` (falls back to the key). */
  packageName: string;
  /** Registry URL for the package, when the body provides one. */
  packageUrl?: string;
  /** Semantic version from the tag, e.g. `0.1.0`. */
  version: string;
  /** ISO 8601 publish timestamp (`published_at`), or `''` if unknown. */
  date: string;
  /** GitHub release page URL. */
  htmlUrl: string;
  /** Parsed changelog bullets. */
  changes: ReleaseChange[];
}

/** A package present in the release set, for the filter dropdown. */
export interface ReleasePackage {
  key: string;
  name: string;
}

// Tag is `<key>/<version>`; split on the last slash so multi-segment keys like
// `remote-aws-provider-pulumi` survive intact.
function splitTag(tag: string): { key: string; version: string } {
  const idx = tag.lastIndexOf('/');
  if (idx === -1) return { key: tag, version: '' };
  return { key: tag.slice(0, idx), version: tag.slice(idx + 1) };
}

// Some release bodies link crates to a non-canonical `crates.io/<name>` URL
// (missing the `/crates/` segment), which 404s. Rewrite those to the canonical
// package page; leave npm and everything else untouched.
function normalizePackageUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'crates.io' && !parsed.pathname.startsWith('/crates/')) {
      const name = parsed.pathname.split('/').filter(Boolean)[0];
      if (name != null) return `https://crates.io/crates/${name}`;
    }
    return url;
  } catch {
    return url;
  }
}

// First markdown package link on the "This release includes packages:" line —
// the primary published package, which matches the tag key.
function parsePrimaryPackage(body: string): { name: string; url: string } | undefined {
  const line = body.split('\n').find(l => /includes packages/i.test(l));
  if (line == null) return undefined;
  const match = line.match(/\[`([^`]+)`\]\(([^)]+)\)/);
  if (match == null) return undefined;
  return { name: match[1]!, url: normalizePackageUrl(match[2]!) };
}

// Collect top-level `- ` bullets as changelog entries, pulling the trailing
// `(#NN)` out as a PR number. Stable bodies list packages inline (not as
// bullets), so every bullet here is a real changelog entry.
function parseChanges(body: string): ReleaseChange[] {
  const changes: ReleaseChange[] = [];
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (!line.startsWith('- ')) continue;
    const text = line.slice(2).trim();
    if (text === '') continue;
    const prMatch = text.match(/\(#(\d+)\)\s*$/);
    changes.push({
      text,
      prNumber: prMatch != null ? Number(prMatch[1]) : undefined,
    });
  }
  return changes;
}

/**
 * Normalize raw GitHub releases into published stable releases, newest first.
 * Drafts and prereleases are dropped.
 */
export function parseReleases(raw: GhRelease[]): Release[] {
  return raw
    .filter(release => !release.draft && !release.prerelease)
    .map(release => {
      const { key, version } = splitTag(release.tag_name);
      const body = release.body ?? '';
      const primary = parsePrimaryPackage(body);
      return {
        tag: release.tag_name,
        packageKey: key,
        packageName: primary?.name ?? key,
        packageUrl: primary?.url,
        version,
        date: release.published_at ?? '',
        htmlUrl: release.html_url,
        changes: parseChanges(body),
      } satisfies Release;
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Distinct packages across the releases, sorted by display name, for the filter. */
export function releasePackages(releases: Release[]): ReleasePackage[] {
  const byKey = new Map<string, ReleasePackage>();
  for (const release of releases) {
    if (!byKey.has(release.packageKey)) {
      byKey.set(release.packageKey, { key: release.packageKey, name: release.packageName });
    }
  }
  return [...byKey.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Filter releases by package and a free-text query (scoped to the changelog).
 * `packageKey` is a `Release['packageKey']`, or the sentinel `'all'` for no
 * package filter. The query matches the package name, version, and change text.
 */
export function filterReleases(releases: Release[], packageKey: string, query: string): Release[] {
  const q = query.trim().toLowerCase();
  return releases.filter(release => {
    if (packageKey !== 'all' && release.packageKey !== packageKey) return false;
    if (q === '') return true;
    if (release.packageName.toLowerCase().includes(q)) return true;
    if (release.version.toLowerCase().includes(q)) return true;
    return release.changes.some(change => change.text.toLowerCase().includes(q));
  });
}
