import { createFileRoute } from '@tanstack/react-router';
import { createFromSource } from 'fumadocs-core/search/server';
import { docSource } from '../../doc';
import { createKoreanTokenizer } from '../../lib/korean-tokenizer';

// Bilingual, per-locale search. English uses Orama's default tokenizer; Korean
// gets ours (see `korean-tokenizer.ts`), since Orama ships no `ko` language —
// the default per-locale mapping would send `ko` to Orama language `ko` and
// throw "Language 'ko' is not supported".
const server = createFromSource(docSource, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  localeMap: {
    en: 'english',
    ko: { tokenizer: createKoreanTokenizer() },
  },
});

export const Route = createFileRoute('/api/search')({
  server: {
    handlers: {
      GET: ({ request }) => server.GET(request),
    },
  },
});
