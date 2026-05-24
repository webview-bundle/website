import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import mdx from 'fumadocs-mdx/vite';
import { defineConfig } from 'vite';
import * as MdxConfig from './source.config';

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  build: {
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
  ],
});
