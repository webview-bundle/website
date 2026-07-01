import { createFileRoute } from '@tanstack/react-router';
import { createFromSource } from 'fumadocs-core/search/server';
import { docSource } from '../../doc';

// Korean is not a built-in Orama language, so the default per-locale mapping
// (`ko` → Orama language `ko`) throws "Language 'ko' is not supported". Give the
// Korean index a character-bigram tokenizer instead: Hangul runs are indexed as
// overlapping 2-character grams so a query like `번들` still matches `번들을`, while
// Latin/number runs are kept as whole words. Everything is lowercased so English
// terms inside Korean pages stay case-insensitive. English uses Orama's default.
const koreanTokenizer = {
  language: 'korean',
  normalizationCache: new Map<string, string>(),
  tokenize(raw: string): string[] {
    if (typeof raw !== 'string' || raw.length === 0) {
      return [];
    }
    const tokens: string[] = [];
    for (const run of raw.toLowerCase().match(/[가-힣]+|[0-9a-z]+/g) ?? []) {
      if (run.charCodeAt(0) >= 0xac00) {
        if (run.length === 1) {
          tokens.push(run);
        }
        for (let i = 0; i + 1 < run.length; i += 1) {
          tokens.push(run.slice(i, i + 2));
        }
      } else {
        tokens.push(run);
      }
    }
    return tokens;
  },
};

const server = createFromSource(docSource, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  localeMap: {
    en: 'english',
    ko: { tokenizer: koreanTokenizer },
  },
});

export const Route = createFileRoute('/api/search')({
  server: {
    handlers: {
      GET: async ({ request }) => server.GET(request),
    },
  },
});
