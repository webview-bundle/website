import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';

// Route handlers run on Node/workerd; force the Node runtime (never edge).
export const runtime = 'nodejs';

// Bilingual search over the fumadocs source. English uses Orama's built-in
// tokenizer. Korean can't: Orama has no Korean stemmer, and its English/default
// normalizer strips non-Latin characters — so a Korean index built with it comes
// out empty and every query returns nothing. Instead we use a lightweight
// tokenizer that lowercases and splits on whitespace + punctuation, keeping the
// Hangul intact. This is eojeol-level (word-level) matching — not morphological,
// so particles/endings aren't stripped — but it makes Korean search work with no
// extra dependency or WASM.
const koreanTokenizer = {
  language: 'korean',
  normalizationCache: new Map<string, string>(),
  tokenize(raw: string): string[] {
    if (!raw) return [];
    return raw
      .toLowerCase()
      .split(/[\s\p{P}\p{S}]+/u)
      .filter(Boolean);
  },
};

export const { GET } = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  localeMap: {
    en: 'english',
    ko: { tokenizer: koreanTokenizer },
  },
});
