import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { i18n } from '@/lib/i18n';

// Bilingual docs source. English lives at the un-prefixed URLs (`/docs/...`) and
// Korean under `/ko` (`hideLocale: 'default-locale'`, see lib/i18n). Reads the
// fumadocs-mdx collections generated into .source by the createMDX Next plugin.
export const source = loader({
  baseUrl: '/docs',
  i18n,
  source: docs.toFumadocsSource(),
});
