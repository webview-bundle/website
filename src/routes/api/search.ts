import { tokenizer as oramaTokenizer } from '@orama/orama/components';
import { createFileRoute } from '@tanstack/react-router';
import { createFromSource } from 'fumadocs-core/search/server';
import type { Garu } from 'garu-ko';
import { docSource } from '../../doc';

// Bilingual, per-locale search. English uses Orama's default tokenizer; Korean
// uses garu's real morphological analysis, so `먹다` matches `먹었다`/`먹지` and
// `학교` matches `학교에서` — particles and endings are stripped instead of being
// treated as word boundaries. The Korean tokenizer is composed with the default
// tokenizer (a union of both token sets) so English code and terms embedded in
// Korean pages still tokenize normally.
//
// (Without this, the default per-locale mapping sends `ko` to Orama language
// `ko`, which has no stemmer and throws "Language 'ko' is not supported".)
//
// garu-ko normally fetches/reads its WASM + model at runtime, which the workerd
// runtime forbids. Instead the WASM is imported as a pre-compiled module and the
// model is inlined as bytes (see vite.config.ts). Everything garu-related is
// dynamically imported so its ~1MB weight lands in a lazy chunk loaded only on
// the first search request, not at Worker startup.
let serverPromise: Promise<ReturnType<typeof createFromSource>> | undefined;

async function buildSearchServer() {
  const [glue, { default: garuWasmModule }, { default: garuModelBytes }, { createTokenizer }] =
    await Promise.all([
      import('garu-runtime/glue'),
      import('garu-runtime/wasm'),
      import('garu-runtime/model'),
      import('garu-orama-tokenizer'),
    ]);

  // `initSync` only *instantiates* a pre-compiled module (allowed on workerd);
  // compiling from bytes at runtime is not. Fail loudly if the build ever hands
  // us something other than a compiled module (e.g. a plugin regression).
  if (!(garuWasmModule instanceof WebAssembly.Module)) {
    throw new Error('garu WASM import did not resolve to a WebAssembly.Module');
  }

  // Instantiate the pre-compiled WASM into garu-ko's wasm-bindgen singleton,
  // then hand the model bytes to the analyzer. `GaruWasm` and `initSync` come
  // from the same glue module, so they share that singleton.
  glue.initSync({ module: garuWasmModule });
  const wasm = new glue.GaruWasm(garuModelBytes, false);
  const garu = { analyze: (text: string) => wasm.analyze(text) } as unknown as Garu;

  const korean = await createTokenizer({ garu });
  const base = oramaTokenizer.createTokenizer({ language: 'english' });
  const koreanTokenizer = {
    language: 'korean',
    normalizationCache: new Map<string, string>(),
    tokenize(raw: string, language?: string, prop?: string, withCache?: boolean): string[] {
      return [
        ...new Set([
          ...base.tokenize(raw, language, prop, withCache),
          ...korean.tokenize(raw, language, prop),
        ]),
      ];
    },
  };

  return createFromSource(docSource, {
    // https://docs.orama.com/docs/orama-js/supported-languages
    localeMap: {
      en: 'english',
      ko: { tokenizer: koreanTokenizer },
    },
  });
}

function getSearchServer() {
  // Reset on failure so a transient first-request error (e.g. a cold-start CPU
  // spike) doesn't permanently poison this isolate's cached search server.
  serverPromise ??= buildSearchServer().catch(error => {
    serverPromise = undefined;
    throw error;
  });
  return serverPromise;
}

export const Route = createFileRoute('/api/search')({
  server: {
    handlers: {
      GET: async ({ request }) => (await getSearchServer()).GET(request),
    },
  },
});
