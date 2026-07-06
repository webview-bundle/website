import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// Minimal config: the site is statically generated (no ISR / on-demand
// revalidation), so no incremental cache override is needed.
export default defineCloudflareConfig({});
