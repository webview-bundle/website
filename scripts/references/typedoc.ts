// TypeDoc conversion for one package, including a synthetic tsconfig for Deno
// packages that ship none.
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Application } from 'typedoc';
import type { PackageTarget } from './types.ts';

// Write a synthetic tsconfig for a package that ships none (Deno packages use
// deno.json). Deno sources use explicit `.ts` import extensions and bundler
// resolution; `@std/*` JSR imports don't resolve under Node but degrade to
// `any` under skipErrorChecking, which is fine for doc extraction. Returns the
// tsconfig path and a cleanup callback for its temp dir.
async function syntheticTsconfig(
  pkg: PackageTarget
): Promise<{ file: string; cleanup: () => Promise<void> }> {
  const tmp = await mkdtemp(path.join(tmpdir(), `wvb-tsconfig-${pkg.slug}-`));
  const file = path.join(tmp, 'tsconfig.json');
  await writeFile(
    file,
    JSON.stringify({
      compilerOptions: {
        allowImportingTsExtensions: true,
        noEmit: true,
        moduleResolution: 'bundler',
        module: 'esnext',
        target: 'esnext',
        skipLibCheck: true,
        strict: false,
        types: [],
      },
      include: [path.join(pkg.dir, '**/*.ts')],
    })
  );
  return { file, cleanup: () => rm(tmp, { recursive: true, force: true }) };
}

export async function convertPackage(pkg: PackageTarget): Promise<any> {
  const synthetic = pkg.tsconfig == null ? await syntheticTsconfig(pkg) : null;
  try {
    const app = await Application.bootstrapWithPlugins({
      entryPoints: [pkg.entry],
      tsconfig: pkg.tsconfig ?? synthetic!.file,
      readme: 'none',
      excludePrivate: true,
      excludeInternal: true,
      excludeExternals: true,
      skipErrorChecking: true,
      logLevel: 'Error',
    });
    const project = await app.convert();
    if (project == null) throw new Error(`TypeDoc failed to convert ${pkg.name}`);
    return project;
  } finally {
    await synthetic?.cleanup();
  }
}
