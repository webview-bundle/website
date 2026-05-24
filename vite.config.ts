import { cloudflare } from '@cloudflare/vite-plugin';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import mdx from 'fumadocs-mdx/vite';
import { createLogger, defineConfig } from 'vite';
import * as MdxConfig from './source.config';

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
