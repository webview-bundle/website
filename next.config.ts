import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static docs site: skip Next's image optimizer (no Cloudflare Images binding).
  images: { unoptimized: true },
};

const withMDX = createMDX();

export default withMDX(nextConfig);

// Wire `next dev` into the Cloudflare adapter so getCloudflareContext() works
// locally (Miniflare-backed bindings). Dev-only: skip during `next build`.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

if (process.env.NODE_ENV === 'development') {
  void initOpenNextCloudflareForDev();
}
