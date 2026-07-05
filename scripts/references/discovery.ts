// Discovers the public @wvb packages to document from a webview-bundle checkout:
// npm packages (package.json) under packages/** and packages/remote/**, plus the
// Deno packages (deno.json).
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { PackageTarget } from './types.ts';

interface PackageManifest {
  name?: string;
  private?: boolean;
  description?: string;
  types?: string;
}

// Subset of deno.json we read for JSR-published packages (@wvb/deno*).
interface DenoManifest {
  name?: string;
  description?: string;
  exports?: string | Record<string, string>;
}

const PACKAGE_ROOTS = ['packages', 'packages/remote'];

// Stable sidebar order: core packages first, then the remotes alphabetically.
const ORDER_HINT = [
  'node',
  'bridge',
  'cli',
  'config',
  'electron',
  'electron-builder',
  'electron-forge',
  'deno',
  'deno-desktop',
];

async function readManifest(file: string): Promise<PackageManifest> {
  return JSON.parse(await readFile(file, 'utf8')) as PackageManifest;
}

// Resolve the main entry (`.`) from a deno.json `exports` field.
function denoMainExport(manifest: DenoManifest): string | null {
  const exports = manifest.exports;
  if (exports == null) return null;
  if (typeof exports === 'string') return exports;
  return exports['.'] ?? null;
}

// Build a PackageTarget from a directory that ships a package.json (npm) or a
// deno.json (JSR). Returns null when the directory is not a public @wvb package.
async function targetFromDir(repo: string, dir: string): Promise<PackageTarget | null> {
  const pkgFile = path.join(dir, 'package.json');
  if (existsSync(pkgFile)) {
    const pkg = await readManifest(pkgFile);
    if (pkg.private === true || pkg.name == null || !pkg.name.startsWith('@wvb/')) return null;
    // Prefer TypeScript source (full JSDoc, no build needed); fall back to the
    // committed .d.ts entry (e.g. @wvb/node's napi-generated index.d.ts).
    const srcEntry = path.join(dir, 'src/index.ts');
    const typesEntry = pkg.types != null ? path.join(dir, pkg.types) : null;
    const entry = existsSync(srcEntry) ? srcEntry : typesEntry;
    if (entry == null || !existsSync(entry)) {
      console.warn(`[skip] ${pkg.name}: no src/index.ts or types entry`);
      return null;
    }
    return {
      name: pkg.name,
      slug: pkg.name.slice('@wvb/'.length),
      description: pkg.description ?? '',
      dir,
      entry,
      tsconfig: existsSync(path.join(dir, 'tsconfig.json'))
        ? path.join(dir, 'tsconfig.json')
        : path.join(repo, 'tsconfig.json'),
    };
  }

  // Deno package: no package.json, but a deno.json with JSR name + exports.
  // TypeDoc can still read the TypeScript source (with a synthetic tsconfig —
  // see convertPackage), so these are documented here rather than on jsr.io.
  const denoFile = path.join(dir, 'deno.json');
  if (existsSync(denoFile)) {
    const manifest = JSON.parse(await readFile(denoFile, 'utf8')) as DenoManifest;
    if (manifest.name == null || !manifest.name.startsWith('@wvb/')) return null;
    const mainExport = denoMainExport(manifest);
    const entry = mainExport == null ? null : path.join(dir, mainExport);
    if (entry == null || !existsSync(entry)) {
      console.warn(`[skip] ${manifest.name}: deno.json has no resolvable main export`);
      return null;
    }
    return {
      name: manifest.name,
      slug: manifest.name.slice('@wvb/'.length),
      description: manifest.description ?? '',
      dir,
      entry,
      tsconfig: null, // convertPackage writes a synthetic one
    };
  }
  return null;
}

// Discover public packages: packages/*/(package.json|deno.json) +
// packages/remote/*/package.json.
export async function discoverPackages(repo: string): Promise<PackageTarget[]> {
  const found: PackageTarget[] = [];
  for (const root of PACKAGE_ROOTS) {
    const base = path.join(repo, root);
    if (!existsSync(base)) continue;
    for (const dirent of await readdir(base, { withFileTypes: true })) {
      if (!dirent.isDirectory()) continue;
      const target = await targetFromDir(repo, path.join(base, dirent.name));
      if (target != null) found.push(target);
    }
  }
  return found.sort((a, b) => {
    const ai = ORDER_HINT.indexOf(a.slug);
    const bi = ORDER_HINT.indexOf(b.slug);
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    return a.slug.localeCompare(b.slug);
  });
}
