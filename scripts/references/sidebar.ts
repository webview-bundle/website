// Keep export URLs stable while nesting subpath folders under their package.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { LOCALES, metaFileName } from './i18n.ts';
import { apiMeta, isRemote, packageSlug, remotesMeta } from './pages.ts';
import type { PackageTarget } from './types.ts';

export async function writeSidebarMetadata(
  packages: PackageTarget[],
  outDir: string
): Promise<void> {
  const owners = new Map<string, PackageTarget[]>();
  for (const pkg of packages) {
    const entries = owners.get(pkg.packageName) ?? [];
    entries.push(pkg);
    owners.set(pkg.packageName, entries);
  }

  for (const entries of owners.values()) {
    const owner = entries[0]!;
    const slug = packageSlug(owner);
    const conflicting = packages.find(
      pkg => pkg.slug === slug && pkg.packageName !== owner.packageName
    );
    if (conflicting != null) throw new Error(`Duplicate package folder: ${slug}`);
    const dir = path.join(outDir, ...(isRemote(owner) ? ['remotes'] : []), slug);
    const hasRootExport = entries.some(pkg => pkg.name === pkg.packageName);
    const subpaths = entries.filter(pkg => pkg.name !== pkg.packageName);
    await mkdir(dir, { recursive: true });
    for (const locale of LOCALES) {
      const file = path.join(dir, metaFileName(locale));
      const meta: { title: string; pages: string[] } = hasRootExport
        ? JSON.parse(await readFile(file, 'utf8'))
        : { title: owner.packageName, pages: [] };
      // Fumadocs resolves these as folders, retaining their index and children.
      // Remove previous references so rerunning navigation generation is safe.
      meta.pages = [
        ...meta.pages.filter(page => !page.startsWith('../')),
        ...subpaths.map(pkg => `../${pkg.slug}`),
      ];
      await writeFile(file, `${JSON.stringify(meta, null, 2)}\n`);
    }
  }

  const core = packages.filter(pkg => !isRemote(pkg));
  const remotes = packages.filter(isRemote);
  for (const locale of LOCALES) {
    await writeFile(path.join(outDir, metaFileName(locale)), apiMeta(core, remotes.length > 0));
    if (remotes.length > 0) {
      const dir = path.join(outDir, 'remotes');
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, metaFileName(locale)), remotesMeta(remotes, locale));
    }
  }
}
