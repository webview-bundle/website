import { CHANGELOG_REPO, type GhRelease, parseReleases, type Release } from '@/lib/changelog';

// Server-side changelog loader. GitHub releases are fetched on the Worker and
// cached at two levels so we don't hit the API on every render:
//
//  1. `cf.cacheTtl` edge-caches each GitHub subrequest across isolates/requests
//     in a colo (production), so at most one origin call per TTL per colo.
//  2. A module-level memo caches the *parsed* result per isolate, so repeated
//     renders in the same isolate skip both the subrequests and re-parsing.
//     This also covers local dev, where `cf` caching is a no-op.
//
// The whole fetch + parse runs under one guard: on ANY failure (network, non-2xx,
// non-JSON/unexpected body, parse error) we serve the last good memo if we have
// one, so a transient GitHub hiccup degrades to slightly stale data rather than
// a blank page.

const RELEASES_URL = `https://api.github.com/repos/${CHANGELOG_REPO}/releases?per_page=100`;
// Freshness window for a newly published release to appear. Both cache layers use
// it, so a new release shows up within ~this long. Kept short enough to feel
// live, long enough that origin calls stay well under GitHub's unauthenticated
// rate limit (60/hr/IP): 5 min ⇒ at most ~12 fetches/hr/colo.
const CACHE_TTL_SECONDS = 5 * 60; // 5 minutes
const TTL_MS = CACHE_TTL_SECONDS * 1000;
// Safety cap on pagination. Releases are cut per package (~11) plus per-commit
// prereleases; 10 pages (1000 releases) is far beyond any realistic history and
// stops a malformed `Link` header from looping forever.
const MAX_PAGES = 10;

const REQUEST_HEADERS = {
  // GitHub requires a User-Agent; the API version pins the response shape.
  'User-Agent': 'webview-bundle-website',
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

let memo: { at: number; releases: Release[] } | undefined;

// The `rel="next"` URL from a GitHub `Link` header, or undefined when there is
// no next page.
function nextPageUrl(linkHeader: string | null): string | undefined {
  if (linkHeader == null) return undefined;
  for (const part of linkHeader.split(',')) {
    const match = part.match(/<([^>]+)>\s*;\s*rel="next"/);
    if (match != null) return match[1];
  }
  return undefined;
}

// Fetch every release page. Prereleases are filtered out only after fetching
// (the API has no server-side filter), so we must page through the full list —
// otherwise accumulating prereleases could crowd stable releases out of a single
// 100-item window.
async function fetchAllReleases(): Promise<GhRelease[]> {
  const all: GhRelease[] = [];
  let url: string | undefined = RELEASES_URL;
  for (let page = 0; page < MAX_PAGES && url != null; page++) {
    const response = await fetch(url, {
      headers: REQUEST_HEADERS,
      // Edge-cache each GitHub subrequest (production/workerd only; a no-op in dev).
      cf: { cacheTtl: CACHE_TTL_SECONDS, cacheEverything: true },
    } as RequestInit);
    if (!response.ok) {
      throw new Error(`GitHub releases request failed: ${response.status} ${response.statusText}`);
    }
    const batch = await response.json();
    if (!Array.isArray(batch)) {
      throw new Error('GitHub releases response was not an array');
    }
    all.push(...(batch as GhRelease[]));
    url = nextPageUrl(response.headers.get('Link'));
  }
  return all;
}

async function loadReleases(): Promise<Release[]> {
  if (memo != null && Date.now() - memo.at < TTL_MS) {
    return memo.releases;
  }
  try {
    const releases = parseReleases(await fetchAllReleases());
    memo = { at: Date.now(), releases };
    return releases;
  } catch (error) {
    // Serve the last good data on any transient failure; only propagate when we
    // have nothing cached to fall back on.
    if (memo != null) return memo.releases;
    throw error;
  }
}

/** The changelog payload: parsed releases (newest first) plus a load-failure flag. */
export interface ChangelogData {
  releases: Release[];
  /** True only when the releases could not be loaded at all (cold-start failure). */
  error: boolean;
}

/** Fetch the cached changelog data. Never throws — degrades to `error: true`. */
export async function getChangelog(): Promise<ChangelogData> {
  try {
    return { releases: await loadReleases(), error: false };
  } catch (error) {
    console.error('Failed to load changelog releases from GitHub:', error);
    return { releases: [], error: true };
  }
}
