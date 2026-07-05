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
import { existsSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { ReflectionKind } from 'typedoc';
import { discoverPackages } from './references/discovery.ts';
import { LOCALES, metaFileName } from './references/i18n.ts';
import {
  apiMeta,
  exportPage,
  groupExports,
  indexPage,
  isRemote,
  packageMeta,
  remotesMeta,
} from './references/pages.ts';
import { convertPackage } from './references/typedoc.ts';
import type { PackageTarget, RenderCtx } from './references/types.ts';

const WEBSITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(WEBSITE_ROOT, 'content/docs/references/api');
// Remote packages render as a collapsible "Remotes" group under this subfolder.
const REMOTES_DIR = path.join(OUT_DIR, 'remotes');

function repoPathFromArgs(): string {
  const idx = process.argv.indexOf('--repo');
  const fromArgs = idx !== -1 ? process.argv[idx + 1] : undefined;
  const raw = fromArgs ?? process.env.WVB_REPO ?? '../webview-bundle';
  if (raw == null || raw === '') throw new Error('Missing --repo <path>');
  return path.resolve(WEBSITE_ROOT, raw);
}

async function generatePackage(pkg: PackageTarget, parentDir: string): Promise<string[]> {
  const project = await convertPackage(pkg);
  const children: any[] = (project.children ?? []).filter(
    (c: any) => c.kind !== ReflectionKind.Module && c.kind !== ReflectionKind.Reference
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
  await writeFile(path.join(pkgDir, 'index.mdx'), indexPage(pkg, groups, urlBase));
  for (const group of groups) {
    await writeFile(path.join(pkgDir, `${group.slug}.mdx`), exportPage(group, ctx));
  }
  for (const locale of LOCALES) {
    await writeFile(path.join(pkgDir, metaFileName(locale)), packageMeta(pkg, groups, locale));
  }
  return groups.map(g => g.slug);
}

async function main(): Promise<void> {
  const repo = repoPathFromArgs();
  if (!existsSync(path.join(repo, 'packages'))) {
    throw new Error(`Not a webview-bundle checkout: ${repo}`);
  }
  const packages = await discoverPackages(repo);
  console.log(`Generating API references for ${packages.length} packages from ${repo}`);

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const failed: string[] = [];
  const ok: PackageTarget[] = [];
  for (const pkg of packages) {
    try {
      const parentDir = isRemote(pkg) ? REMOTES_DIR : OUT_DIR;
      const slugs = await generatePackage(pkg, parentDir);
      ok.push(pkg);
      console.log(`  ok ${pkg.name} (${slugs.length} exports)`);
    } catch (error) {
      failed.push(pkg.name);
      console.error(
        `  FAIL ${pkg.name}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // The `api` folder is flattened into the sidebar (`...api`), so it has no
  // index page. Core packages sit directly under it; remotes get a collapsible
  // `api/remotes/` subfolder with its own localized "Remotes" title.
  const core = ok.filter(p => !isRemote(p));
  const remotes = ok.filter(isRemote);
  for (const locale of LOCALES) {
    await writeFile(path.join(OUT_DIR, metaFileName(locale)), apiMeta(core, remotes.length > 0));
  }
  if (remotes.length > 0) {
    await mkdir(REMOTES_DIR, { recursive: true });
    for (const locale of LOCALES) {
      await writeFile(path.join(REMOTES_DIR, metaFileName(locale)), remotesMeta(remotes, locale));
    }
  }

  if (failed.length > 0) {
    throw new Error(`Failed packages: ${failed.join(', ')}`);
  }
}

await main();
