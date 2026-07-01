// Type declarations for the garu-ko internals we import via Vite aliases
// (see `resolve.alias` in vite.config.ts). These bypass garu-ko's `exports`
// map so the Korean tokenizer can run in the Cloudflare Workers runtime.

declare module 'garu-runtime/glue' {
  /** wasm-bindgen synchronous init. Accepts a pre-compiled module. Idempotent. */
  export function initSync(input: { module: WebAssembly.Module } | WebAssembly.Module): unknown;

  /** The garu-ko WASM analyzer, constructed from the model bytes. */
  export class GaruWasm {
    constructor(modelData: Uint8Array, normalizeJamo: boolean);
    analyze(text: string): { tokens: { pos: string; text: string }[] };
    free(): void;
  }
}

declare module 'garu-runtime/wasm' {
  const wasmModule: WebAssembly.Module;
  export default wasmModule;
}

declare module 'garu-runtime/model' {
  const modelBytes: Uint8Array;
  export default modelBytes;
}
