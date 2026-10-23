// Generates the JavaScript API reference pages (content/docs/references/api/*)
// from the webview-bundle monorepo's TypeScript sources + JSDoc, using TypeDoc.
//
// Usage:
//   node scripts/generate-references.ts [--repo <path-to-webview-bundle>]
//
// The repo path defaults to $WVB_REPO or ../webview-bundle. The monorepo must
// have its dependencies installed (yarn install) so imports resolve.
//
// Layout: one folder per package (content/docs/references/api/<pkg>/), with one
// MDX page per exported symbol plus an index. Each symbol page splits the API
// into readable sections — Signature, Parameters, Returns, Examples — and uses
// Fumadocs' <TypeTable> for property and parameter tables. Output is committed
// to git; CI regenerates it on release (see .github/workflows/references.yaml).
//
// The generator is split by responsibility under scripts/references/:
//   discovery   — find the @wvb packages (npm + Deno) to document
//   typedoc     — convert one package's sources to a TypeDoc project
//   reflection  — read type/signature strings and JSDoc tags off reflections
//   mdx         — escape text and render comment parts to MDX / plain text
//   render      — per-kind page-body renderers + <TypeTable>
//   pages       — group exports into pages, write index/meta files
//   i18n        — sidebar label translations (extensible per locale)
//   installation — localized install commands and integration dependencies
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { ReflectionKind } from 'typedoc';
import { discoverPackages } from './references/discovery.ts';
import { DEFAULT_LOCALE, LOCALES, metaFileName } from './references/i18n.ts';
import { exportPage, groupExports, indexPage, isRemote, packageMeta } from './references/pages.ts';
import { writeSidebarMetadata } from './references/sidebar.ts';
import { convertPackage } from './references/typedoc.ts';
import type { PackageTarget, RenderCtx } from './references/types.ts';

const WEBSITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(WEBSITE_ROOT, 'content/docs/references/api');

function repoPathFromArgs(): string {
  const idx = process.argv.indexOf('--repo');
  const fromArgs = idx !== -1 ? process.argv[idx + 1] : undefined;
  if (idx !== -1 && (fromArgs == null || fromArgs.startsWith('--')))
    throw new Error('Missing --repo <path>');
  const raw = fromArgs ?? process.env.WVB_REPO ?? '../webview-bundle';
  if (raw == null || raw === '') throw new Error('Missing --repo <path>');
  return path.resolve(WEBSITE_ROOT, raw);
}

async function generatePackage(
  pkg: PackageTarget,
  parentDir: string,
  packages: PackageTarget[]
): Promise<string[]> {
  const project = await convertPackage(pkg, packages);
  const children: any[] = (project.children ?? []).filter(
    (c: any) => c.kind !== ReflectionKind.Module
  );
  const groups = groupExports(children);
  const nameToSlug = new Map(groups.map(g => [g.name, g.slug]));

  // Absolute page URL for this package, so generated cross-links and cards route
  // client-side (relative `./` hrefs are not localized nor matched by the router).
  const urlBase = `/docs/references/api${isRemote(pkg) ? '/remotes' : ''}/${pkg.slug}`;
  const ctx: RenderCtx = {
    link: label => {
      const slug = nameToSlug.get(label);
      return slug == null ? null : `${urlBase}/${slug}`;
    },
    sourceUrl: reflection => reflection?.sources?.[0]?.url ?? null,
    emittedSources: new Set<string>(),
  };

  const pkgDir = path.join(parentDir, pkg.slug);
  await mkdir(pkgDir, { recursive: true });
  for (const group of groups) {
    await writeFile(path.join(pkgDir, `${group.slug}.mdx`), exportPage(group, ctx));
  }
  for (const locale of LOCALES) {
    const index = locale === DEFAULT_LOCALE ? 'index.mdx' : `index.${locale}.mdx`;
    await writeFile(path.join(pkgDir, index), indexPage(pkg, groups, urlBase, locale));
    await writeFile(path.join(pkgDir, metaFileName(locale)), packageMeta(pkg, groups, locale));
  }
  return groups.map(g => g.slug);
}

export async function generateReferences(repo: string, outDir: string = OUT_DIR): Promise<void> {
  if (!existsSync(path.join(repo, 'packages'))) {
    throw new Error(`Not a webview-bundle checkout: ${repo}`);
  }
  const packages = await discoverPackages(repo);
  if (packages.length === 0) throw new Error(`No public packages found in ${repo}`);
  console.log(`Generating API references for ${packages.length} packages from ${repo}`);

  // Replace the generated tree only after every package converts successfully.
  // This removes obsolete pages without losing the previous docs on failure.
  await mkdir(path.dirname(outDir), { recursive: true });
  const staging = await mkdtemp(path.join(path.dirname(outDir), '.api-generation-'));
  const remotesDir = path.join(staging, 'remotes');
  try {
    for (const pkg of packages) {
      const parentDir = isRemote(pkg) ? remotesDir : staging;
      const slugs = await generatePackage(pkg, parentDir, packages);
      console.log(`  ok ${pkg.name} (${slugs.length} exports)`);
    }

    await writeSidebarMetadata(packages, staging);
    await rm(outDir, { recursive: true, force: true });
    await rename(staging, outDir);
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

if (process.argv[1] != null && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await generateReferences(repoPathFromArgs());
}
