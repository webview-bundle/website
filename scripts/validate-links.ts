// Validates internal links across the docs content so a broken/orphan link
// (pointing at a page or anchor that doesn't exist) fails the build instead of
// shipping. Uses `next-validate-link`.
//
// The site is i18n with `hideLocale: 'default-locale'` (see lib/i18n): links in
// the MDX are written un-prefixed (`/docs/...`) and localized at render, so this
// validates against the un-prefixed URL space. Korean pages (`*.ko.mdx`) also
// contribute their `/ko/...` URL for any explicit Korean links.
//
// Run: `yarn check:links` (also runs in CI). Fails with a non-zero exit and a
// per-file report of every broken link + anchor.
import path from 'node:path';
import Slugger from 'github-slugger';
import {
  printErrors,
  readFiles,
  type ScanResult,
  type UrlMeta,
  validateFiles,
} from 'next-validate-link';

const CONTENT_GLOB = 'content/docs/**/*.{md,mdx}';
const CONTENT_ROOT = path.resolve('content/docs');

// Non-MDX routes that live in `app/` (not in the docs source) but are valid link
// targets: the landing pages and the GitHub-releases changelog.
const APP_ROUTES = ['/', '/ko', '/docs/changelog', '/ko/docs/changelog'];

/** Map a content file path to its public URL (en un-prefixed, ko under `/ko`). */
function fileToUrl(filePath: string): { url: string; unprefixed: string } {
  let slug = path.relative(CONTENT_ROOT, path.resolve(filePath)).replace(/\\/g, '/');
  slug = slug.replace(/\.(md|mdx)$/, '');
  let locale = 'en';
  if (slug.endsWith('.ko')) {
    locale = 'ko';
    slug = slug.slice(0, -'.ko'.length);
  }
  // `index` maps to its folder (`guide/index` → `/docs/guide`, `index` → `/docs`).
  slug = slug === 'index' ? '' : slug.replace(/\/index$/, '');
  const suffix = slug ? `/${slug}` : '';
  const unprefixed = `/docs${suffix}`;
  return { url: locale === 'ko' ? `/ko/docs${suffix}` : unprefixed, unprefixed };
}

// Heading anchors (`## Foo` → `foo`), matching rehype-slug (github-slugger).
// Skips frontmatter and fenced code blocks so `# comment` in code isn't counted.
function extractHashes(content: string): string[] {
  const slugger = new Slugger();
  const hashes: string[] = [];
  const lines = content.split('\n');
  let inFrontmatter = false;
  let inCode = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (i === 0 && line.trim() === '---') {
      inFrontmatter = true;
      continue;
    }
    if (inFrontmatter) {
      if (line.trim() === '---') inFrontmatter = false;
      continue;
    }
    if (/^\s*(```|~~~)/.test(line)) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const heading = line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
    if (heading) {
      const text = heading[1]!
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/[*_~]/g, '')
        .replace(/<[^>]+>/g, '')
        .trim();
      hashes.push(slugger.slug(text));
    }
  }
  return hashes;
}

async function main() {
  const files = await readFiles(CONTENT_GLOB);

  // Build the valid-URL set from the content tree. Every page contributes its
  // un-prefixed URL (what links use); anchors from both locales are unioned onto
  // it so a `#heading` link resolves whether the file is EN or KO.
  const urls = new Map<string, UrlMeta>();
  const merge = (key: string, hashes: string[]) => {
    const existing = urls.get(key)?.hashes ?? [];
    urls.set(key, { hashes: [...new Set([...existing, ...hashes])] });
  };
  for (const file of files) {
    const { url, unprefixed } = fileToUrl(file.path);
    const hashes = extractHashes(file.content);
    merge(unprefixed, hashes);
    if (url !== unprefixed) merge(url, hashes);
  }
  for (const route of APP_ROUTES) {
    if (!urls.has(route)) urls.set(route, {});
  }

  const scanned: ScanResult = { urls, fallbackUrls: [] };

  const results = await validateFiles(files, {
    scanned,
    checkExternal: false,
    checkRelativeUrls: false,
    checkRelativePaths: false,
    // `<Card href="…">` carries links too (default scanning only sees `[](…)`).
    markdown: { components: { Card: { attributes: ['href'] } } },
  });

  // Throws (non-zero exit) if any file has a broken link or anchor.
  printErrors(results, true);
  console.log(`✓ validated links in ${files.length} files (${urls.size} known URLs)`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
