// Discover public packages and their export subpaths from the source checkout.
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { PackageTarget } from './types.ts';

interface PackageManifest {
  name?: string;
  private?: boolean;
  description?: string;
  types?: string;
  exports?: string | Record<string, unknown>;
  engines?: { node?: string };
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
}

const PACKAGE_ROOTS = ['packages', 'packages/remote'];
const ORDER_HINT = [
  'node',
  'bridge',
  'cli',
  'config',
  'electron',
  'electron-builder',
  'electron-forge',
  'deno',
];

function exportEntries(manifest: PackageManifest): [string, unknown][] {
  const exports = manifest.exports;
  if (exports == null || typeof exports === 'string') return [['.', exports]];
  if (Object.keys(exports).every(key => !key.startsWith('.'))) return [['.', exports]];
  return Object.entries(exports).filter(
    ([key, value]) => key !== './package.json' && value != null
  );
}

function typeEntries(value: unknown): string[] {
  if (typeof value === 'string') return /\.d\.[cm]?ts$/.test(value) ? [value] : [];
  if (value == null || typeof value !== 'object') return [];
  return Object.values(value).flatMap(typeEntries);
}

async function targetsFromDir(repo: string, dir: string): Promise<PackageTarget[]> {
  const registry = existsSync(path.join(dir, 'package.json')) ? 'npm' : 'jsr';
  const file = path.join(dir, registry === 'npm' ? 'package.json' : 'deno.json');
  if (!existsSync(file)) return [];
  const manifest = JSON.parse(await readFile(file, 'utf8')) as PackageManifest;
  if (manifest.private === true || manifest.name?.startsWith('@wvb/') !== true) return [];
  const packageName = manifest.name;
  return exportEntries(manifest).map(([subpath, value]) => {
    if (subpath !== '.' && (!subpath.startsWith('./') || subpath.includes('*'))) {
      throw new Error(`Cannot document ${packageName}: unsupported export ${subpath}`);
    }
    const suffix = subpath === '.' ? '' : subpath.slice(2);
    const name = suffix === '' ? packageName : `${packageName}/${suffix}`;
    const candidates =
      registry === 'jsr'
        ? typeof value === 'string'
          ? [path.join(dir, value)]
          : []
        : [
            ...['src', 'lib'].flatMap(root =>
              suffix === ''
                ? [path.join(dir, root, 'index.ts')]
                : [path.join(dir, root, suffix, 'index.ts'), path.join(dir, root, `${suffix}.ts`)]
            ),
            ...typeEntries(value).map(file => path.join(dir, file)),
            ...(suffix === '' && manifest.types != null && manifest.types !== ''
              ? [path.join(dir, manifest.types)]
              : []),
          ];
    const entry = candidates.find(file => existsSync(file));
    if (entry == null) throw new Error(`Cannot document ${name}: source or types entry missing`);
    return {
      packageName,
      registry,
      name,
      slug: name.slice('@wvb/'.length).replaceAll('/', '-'),
      description: suffix === '' ? (manifest.description ?? '') : '',
      nodeVersion: manifest.engines?.node,
      peers: Object.entries(manifest.peerDependencies ?? {}).map(([name, version]) => ({
        name,
        version,
        optional: manifest.peerDependenciesMeta?.[name]?.optional === true,
      })),
      dir,
      entry,
      tsconfig:
        registry === 'jsr'
          ? null
          : existsSync(path.join(dir, 'tsconfig.json'))
            ? path.join(dir, 'tsconfig.json')
            : path.join(repo, 'tsconfig.json'),
    };
  });
}

export async function discoverPackages(repo: string): Promise<PackageTarget[]> {
  const found: PackageTarget[] = [];
  for (const root of PACKAGE_ROOTS) {
    const base = path.join(repo, root);
    if (!existsSync(base)) continue;
    for (const dirent of await readdir(base, { withFileTypes: true })) {
      if (dirent.isDirectory())
        found.push(...(await targetsFromDir(repo, path.join(base, dirent.name))));
    }
  }
  const slugs = new Set<string>();
  for (const pkg of found) {
    if (slugs.has(pkg.slug)) throw new Error(`Duplicate reference path: ${pkg.slug}`);
    slugs.add(pkg.slug);
  }
  // Keep subpaths next to their owning package in the sidebar.
  return found.sort((a, b) => {
    const rank = (pkg: PackageTarget) => {
      const index = ORDER_HINT.indexOf(pkg.packageName.slice('@wvb/'.length));
      return index === -1 ? ORDER_HINT.length : index;
    };
    return (
      rank(a) - rank(b) ||
      a.packageName.localeCompare(b.packageName) ||
      a.name.localeCompare(b.name)
    );
  });
}
