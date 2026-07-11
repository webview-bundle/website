import type { Tokenizer } from '@orama/orama';
import { tokenizer as oramaTokenizer } from '@orama/orama/components';

// A dependency-free Korean tokenizer for Orama.
//
// Orama has no `ko` language (its default map would throw "Language 'ko' is not
// supported"), and a real morphological analyzer (garu-ko) costs ~1MB of WASM +
// model in the Worker bundle to serve a docs-sized corpus. Two cheap properties
// replace it, because Korean glues its particles (조사) and endings (어미) onto
// the *end* of a word:
//
//   1. Orama's index is a radix tree and matches by prefix, so an indexed
//      `설치하세요` is already found by the query `설치`, and `번들을` by `번들`.
//      Inflection in the document therefore costs us nothing.
//   2. The reverse — a reader who *types* the inflected form, `번들을`, looking
//      for a page that says `번들` — is what this tokenizer adds: it strips a
//      trailing particle or ending, so both sides also index the bare stem.
//
// Tokens are additive (the raw word is always kept), so stripping can only add
// recall, never remove a match.
//
// Deliberately *not* done: character bigrams (the usual CJK trick). They buy
// mid-word matches, which Korean docs rarely need since they space their words,
// and they cost real precision — `오프라인` would rank `파이프라인` first, on the
// strength of the shared `프라` and `라인`.

// Precomposed Hangul syllables (가-힣). Jamo-only text (ㄱ, ㅏ) is rare outside
// IME state and is left to the base tokenizer.
const HANGUL_RUN = /[가-힣]+/g;

// Particles and endings, longest-first at build time so `번들에서는` strips
// `에서는` rather than the shorter `는`. Not exhaustive, and it doesn't need to
// be: this only has to catch what a reader is likely to type into a search box.
const SUFFIXES = [
  // 조사 (particles)
  '으로부터',
  '에서부터',
  '로부터',
  '에게서',
  '한테서',
  '에서는',
  '에서도',
  '에서의',
  '으로서',
  '으로써',
  '으로는',
  '으로도',
  '이라는',
  '이라고',
  '에게는',
  '에게도',
  '에서',
  '에게',
  '한테',
  '께서',
  '으로',
  '까지',
  '부터',
  '처럼',
  '보다',
  '마다',
  '조차',
  '밖에',
  '이나',
  '라는',
  '라고',
  '와는',
  '과는',
  '에는',
  '에도',
  '에만',
  '들의',
  '들을',
  '들이',
  '들은',
  '은',
  '는',
  '이',
  '가',
  '을',
  '를',
  '에',
  '의',
  '와',
  '과',
  '도',
  '만',
  '로',
  '들',
  // 어미 (verb / adjective endings)
  '하였습니다',
  '했습니다',
  '됐습니다',
  '있습니다',
  '없습니다',
  '되었다',
  '합니다',
  '됩니다',
  '입니다',
  '습니다',
  '해주세요',
  '하십시오',
  '하세요',
  '하려면',
  '하는',
  '하고',
  '하며',
  '하면',
  '하여',
  '해서',
  '했다',
  '하지',
  '하기',
  '되는',
  '되고',
  '된다',
  '되면',
  '되어',
  '있는',
  '없는',
  '한다',
  '했던',
  '었다',
  '았다',
  '였다',
].sort((a, b) => b.length - a.length);

// Stems shorter than this are dropped: a 1-character stem (`참고` → `참`) is far
// more likely to be an over-strip than a useful term.
const MIN_STEM = 2;

// The stem of a Hangul word, or undefined when no suffix applies.
function stem(word: string): string | undefined {
  for (const suffix of SUFFIXES) {
    if (word.length - suffix.length >= MIN_STEM && word.endsWith(suffix)) {
      return word.slice(0, -suffix.length);
    }
  }
  return undefined;
}

function koreanTokens(raw: string): string[] {
  const tokens: string[] = [];
  for (const [word] of raw.normalize('NFC').matchAll(HANGUL_RUN)) {
    tokens.push(word);
    const root = stem(word);
    if (root != null) {
      tokens.push(root);
    }
  }
  return tokens;
}

// Korean pages here are dense with English API names, code identifiers, and
// numbers (`.wvb`, `createBundle`, `v1`). Orama's English tokenizer treats
// Hangul as a separator, so it yields exactly those Latin tokens — stopword
// filtered — and we union them with the Korean ones.
export function createKoreanTokenizer(): Tokenizer {
  const base = oramaTokenizer.createTokenizer({ language: 'english' });

  return {
    language: 'korean',
    normalizationCache: new Map<string, string>(),
    // The incoming `language` is deliberately dropped rather than forwarded:
    // Orama's tokenizer throws LANGUAGE_NOT_SUPPORTED for any language that
    // isn't its own, so handing our `korean` to an `english` base would blow up
    // the moment a caller passes one (Orama leaves it undefined today, which is
    // the only reason forwarding it appeared to work). `prop` and `withCache`
    // still go through — they only drive the base's normalization cache.
    tokenize(raw: string, _language?: string, prop?: string, withCache?: boolean): string[] {
      return [
        ...new Set([...base.tokenize(raw, undefined, prop, withCache), ...koreanTokens(raw)]),
      ];
    },
  };
}
