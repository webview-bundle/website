// Assembles per-export pages, per-package index pages, the top-level API index,
// and the Fumadocs `meta.json` sidebar files. Groups a package's exports into
// one page per name, ordered and slugged deterministically.
import { ReflectionKind } from 'typedoc';
import { DEFAULT_LOCALE, KIND_ORDER, kindRank, type Locale, t } from './i18n.ts';
import { frontmatter, frontmatterDescription, htmlAttr, plainParts } from './mdx.ts';
import { commentOf } from './reflection.ts';
import { renderReflection } from './render.ts';
import type { ExportGroup, PackageTarget, RenderCtx } from './types.ts';

export const AUTOGEN_NOTE =
  '{/* This page is auto-generated from TypeScript + JSDoc by scripts/generate-references.ts — do not edit by hand. */}';

// ---------------------------------------------------------------------------
// Grouping top-level exports into pages (one page per exported name)
// ---------------------------------------------------------------------------

function slugify(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function groupExports(children: any[]): ExportGroup[] {
  const byName = new Map<string, any[]>();
  for (const child of children) {
    const list = byName.get(child.name) ?? [];
    list.push(child);
    byName.set(child.name, list);
  }
  const groups: ExportGroup[] = [...byName.entries()].map(([name, reflections]) => {
    reflections.sort((a, b) => kindRank(a.kind) - kindRank(b.kind));
    const primary = reflections[0];
    const summarySource =
      reflections.find(r => plainParts(commentOf(r)?.summary) !== '') ?? primary;
    return {
      name,
      slug: '',
      reflections,
      primaryKind: primary.kind,
      summary: plainParts(commentOf(summarySource)?.summary),
    };
  });
  // Sort into final order first, then assign slugs — so a type/value name
  // collision (e.g. `WebviewBundle` class vs `webviewBundle` fn) resolves to a
  // deterministic, kind-tagged slug regardless of export source order.
  groups.sort((a, b) => {
    const r = kindRank(a.primaryKind) - kindRank(b.primaryKind);
    return r !== 0 ? r : a.name.localeCompare(b.name);
  });
  const usedSlugs = new Set<string>();
  for (const g of groups) {
    let slug = slugify(g.name);
    const kindTag = slugify(ReflectionKind[g.primaryKind] ?? 'export');
    if (slug === '' || slug === 'index') slug = `${slug}-${kindTag}`;
    if (usedSlugs.has(slug)) slug = `${slug}-${kindTag}`;
    let unique = slug;
    let n = 2;
    while (usedSlugs.has(unique)) unique = `${slug}-${n++}`;
    usedSlugs.add(unique);
    g.slug = unique;
  }
  return groups;
}

// ---------------------------------------------------------------------------
// Page writers
// ---------------------------------------------------------------------------

export function exportPage(group: ExportGroup, ctx: RenderCtx): string {
  ctx.emittedSources.clear();
  const description = frontmatterDescription(group.summary, `${group.name} — API reference.`);
  // In the enum pattern (a `const` plus a `type` of the same name), show the
  // value's members first and the derived type alias last. Distinct section
  // headings (## Properties, ## Type) already tell the two parts apart, so a
  // horizontal rule is enough of a divider.
  const ordered = [...group.reflections].sort(
    (a, b) =>
      (a.kind === ReflectionKind.TypeAlias ? 1 : 0) - (b.kind === ReflectionKind.TypeAlias ? 1 : 0)
  );
  const body = ordered.map(r => renderReflection(r, ctx).trim()).join('\n\n---\n\n');
  return [frontmatter(group.name, description), AUTOGEN_NOTE, '', body.trim(), ''].join('\n');
}

// `urlBase` is the package's absolute page URL (e.g. /docs/references/api/node);
// cards link to `${urlBase}/${export}` so client-side routing can resolve them
// (relative `./` hrefs are not localized/routed).
export function indexPage(pkg: PackageTarget, groups: ExportGroup[], urlBase: string): string {
  const description = pkg.description === '' ? `API reference for ${pkg.name}.` : pkg.description;
  let body = '';
  for (const kg of KIND_ORDER) {
    const inKind = groups.filter(g => g.primaryKind === kg.kind);
    if (inKind.length === 0) continue;
    body += `## ${t(kg.label, DEFAULT_LOCALE)}\n\n<Cards>\n`;
    for (const g of inKind) {
      const cardDesc = htmlAttr(frontmatterDescription(g.summary, ''));
      body += `  <Card title="${htmlAttr(g.name)}" href="${urlBase}/${g.slug}"${cardDesc === '' ? '' : ` description="${cardDesc}"`} />\n`;
    }
    body += `</Cards>\n\n`;
  }
  return [frontmatter(pkg.name, description), AUTOGEN_NOTE, '', body.trim(), ''].join('\n');
}

// Sidebar meta for one package folder, grouped by kind with separators.
// `index` is intentionally NOT listed: Fumadocs auto-detects `index.mdx` as the
// folder's own landing page (the clickable folder header), so listing it would
// duplicate it as a redundant child item of the same name.
export function packageMeta(pkg: PackageTarget, groups: ExportGroup[], locale: Locale): string {
  const pages: string[] = [];
  for (const kg of KIND_ORDER) {
    const inKind = groups.filter(g => g.primaryKind === kg.kind);
    if (inKind.length === 0) continue;
    pages.push(`---${t(kg.label, locale)}---`);
    for (const g of inKind) pages.push(g.slug);
  }
  return `${JSON.stringify({ title: pkg.name, pages }, null, 2)}\n`;
}

// ---------------------------------------------------------------------------
// Top-level API section
//
// The `api` folder is flattened into the References sidebar via `...api` in
// content/docs/references/meta.json, so its own title is never shown and it
// needs no index page: core packages appear directly under "JavaScript", and
// the remotes live in an `api/remotes/` subfolder that renders as a collapsible
// "Remotes" group.
// ---------------------------------------------------------------------------

// Remote packages (`@wvb/remote-*`) are grouped under `api/remotes/`; everything
// else is a top-level core package.
export function isRemote(pkg: PackageTarget): boolean {
  return pkg.slug.startsWith('remote-');
}

// The `api` folder meta: core packages, then the `remotes` subfolder. Locale
// independent — the entries are path refs, and the folder title is not rendered
// (the folder is extracted into its parent).
export function apiMeta(core: PackageTarget[], hasRemotes: boolean): string {
  const pages = core.map(p => p.slug);
  if (hasRemotes) pages.push('remotes');
  return `${JSON.stringify({ title: 'API', pages }, null, 2)}\n`;
}

// The `api/remotes` folder meta: a collapsible group titled "Remotes" per locale.
export function remotesMeta(remotes: PackageTarget[], locale: Locale): string {
  const pages = remotes.map(p => p.slug);
  return `${JSON.stringify({ title: t('remotes', locale), pages }, null, 2)}\n`;
}
