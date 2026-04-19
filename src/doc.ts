import { loader } from 'fumadocs-core/source';
import { docs } from '~source/server';

export const docSource = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
