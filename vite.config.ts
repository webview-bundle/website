import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { cloudflare } from '@cloudflare/vite-plugin';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import mdx from 'fumadocs-mdx/vite';
import { createLogger, defineConfig, type Plugin } from 'vite';
import * as MdxConfig from './source.config';

// The Korean search tokenizer (garu-ko) ships a browser build that `fetch()`es
// its WASM/model and a node build that reads them from `fs` — neither works in
// the Cloudflare Workers (workerd) runtime where our search API runs. Instead we
// import the WASM as a module (compiled at startup, instantiated per isolate) and
// inline the ~1MB model as bytes. garu-ko's package `exports` map hides these
// internal files, so we alias directly to them.
const garuGlue = fileURLToPath(new URL('./node_modules/garu-ko/pkg/garu_wasm.js', import.meta.url));
const garuWasm = fileURLToPath(
  new URL('./node_modules/garu-ko/pkg/garu_wasm_bg.wasm', import.meta.url)
);
const garuModel = fileURLToPath(
  new URL('./node_modules/garu-ko/models/base.gmdl', import.meta.url)
);

// Load the garu model (`.gmdl`) as an inlined Uint8Array so it travels in the
// Worker bundle instead of being fetched/read at runtime, and assert the aliased
// garu-ko internals exist so a version bump that relocates them fails loudly.
function garuModelBytes(): Plugin {
  return {
    name: 'garu-model-bytes',
    enforce: 'pre',
    buildStart() {
      const pkg = fileURLToPath(new URL('./node_modules/garu-ko/package.json', import.meta.url));
      const { version } = JSON.parse(readFileSync(pkg, 'utf8')) as { version: string };
      for (const file of [garuGlue, garuWasm, garuModel]) {
        if (!existsSync(file)) {
          this.error(
            `[garu tokenizer] expected garu-ko internal file is missing: ${file} (garu-ko@${version}). ` +
              'garu-ko may have relocated its pkg/ or models/ files; pin garu-ko and update the aliases in vite.config.ts.'
          );
        }
      }
    },
    load(id) {
      if (id.replace(/\?.*$/, '') !== garuModel) return;
      // Preallocated decode is faster than `Uint8Array.from(atob(...), cb)`,
      // trimming the one-time first-search CPU cost on the Worker.
      const base64 = readFileSync(garuModel).toString('base64');
      return `const binary = atob(${JSON.stringify(base64)});
const bytes = new Uint8Array(binary.length);
for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
export default bytes;`;
    },
  };
}

// Several dependencies (@tanstack/*, seroval) ship `//# sourceMappingURL`
// comments without the referenced `.map` files. The Cloudflare SSR environment
// bundles these packages (it can't externalize them for workerd), so Vite reads
// each file, sees the comment, and warns it cannot find the map. The warning is
// harmless, so filter out just that message while leaving every other log intact.
const logger = createLogger();
const baseWarn = logger.warn.bind(logger);
logger.warn = (msg, options) => {
  if (typeof msg === 'string' && msg.includes('Failed to load source map')) {
    return;
  }
  baseWarn(msg, options);
};

export default defineConfig(({ command }) => ({
  customLogger: logger,
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
    alias: [
      { find: /^garu-runtime\/glue$/, replacement: garuGlue },
      { find: /^garu-runtime\/wasm$/, replacement: garuWasm },
      { find: /^garu-runtime\/model$/, replacement: garuModel },
    ],
  },
  build: {
    sourcemap: 'hidden',
    rolldownOptions: {
      output: {
        // Peel the large, rarely-changing vendor libraries out of the shared
        // entry chunk. This keeps the app chunk small and lets browsers cache
        // these dependencies separately across deploys.
        codeSplitting: {
          groups: [
            {
              name: 'react',
              test: /[\\/]node_modules[\\/](?:react|react-dom|scheduler)[\\/]/,
              priority: 30,
            },
            {
              name: 'tanstack',
              test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
              priority: 20,
            },
            {
              name: 'fumadocs',
              test: /[\\/]node_modules[\\/]fumadocs-(?:ui|core|mdx)[\\/]/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
  plugins: [
    garuModelBytes(),
    mdx(MdxConfig),
    tailwindcss(),
    cloudflare({
      viteEnvironment: {
        name: 'ssr',
      },
    }),
    tanstackStart(),
    viteReact(),
    // Upload source maps to Sentry on production builds only.
    command === 'build' &&
      process.env.SENTRY_AUTH_TOKEN != null &&
      sentryVitePlugin({
        org: 'webview-bundle',
        project: 'website',
        authToken: process.env.SENTRY_AUTH_TOKEN,
        sourcemaps: {
          filesToDeleteAfterUpload: [
            './**/*.map',
            '.*/**/public/**/*.map',
            './dist/**/client/**/*.map',
          ],
        },
      }),
  ],
}));
