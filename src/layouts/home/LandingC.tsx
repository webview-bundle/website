// oxlint-disable jsx_a11y/anchor-is-valid
// Variation C — hybrid: architecture diagram hero + vertical narrative

export function LandingC() {
  const isDark = true;
  return (
    <div className={isDark ? 'dark' : ''}>
      <div
        className="min-h-full bg-white font-sans text-zinc-900 antialiased dark:bg-[#09090a] dark:text-zinc-100"
        style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
      >
        {/* Nav */}
        <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/85 backdrop-blur-md dark:border-zinc-900 dark:bg-[#09090a]/85">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-6">
            <a href="#" className="flex items-center gap-2">
              {/*<Logo size={26} accent={ACCENT.base} />*/}
              <span className="text-[15px] font-mono font-semibold tracking-tight">
                webview-bundle
              </span>
              {/*<span className="ml-1 rounded border border-zinc-300 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:border-zinc-800">*/}
              {/*  v0.4*/}
              {/*</span>*/}
            </a>
            <nav className="hidden items-center gap-6 font-mono text-[13.5px] text-zinc-600 dark:text-zinc-400 md:flex">
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                Docs
              </a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                How it works
              </a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                Platforms
              </a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                Reference
              </a>
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <button
                // onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="rounded-md border border-zinc-300 p-1.5 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                  </svg>
                )}
              </button>
              <a
                href="#"
                className="hidden rounded-md px-3.5 py-1.5 text-[13px] font-medium text-white md:inline-flex"
                style={{ backgroundColor: 'var(--color-fd-accent)' }}
              >
                Get started
              </a>
            </div>
          </div>
        </header>

        {/* Hero — headline + architecture figure */}
        <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-900">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px)',
              backgroundSize: '80px 100%',
            }}
          />
          <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-12">
            {/*<div*/}
            {/*  className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]"*/}
            {/*  style={{ color: 'var(--color-fd-accent)' }}*/}
            {/*>*/}
            {/*  <span*/}
            {/*    className="h-px w-8"*/}
            {/*    style={{ backgroundColor: 'var(--color-fd-accent)' }}*/}
            {/*  ></span>*/}
            {/*  A web resource delivery system*/}
            {/*</div>*/}
            <h1 className="text-balance max-w-4xl text-[48px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[68px]">
              Ship web
              <br />
              <span className="text-zinc-400 dark:text-zinc-600">inside</span> native.
            </h1>
            <p className="mt-6 max-w-2xl text-[16.5px] font-mono leading-relaxed text-zinc-600 dark:text-zinc-400">
              A bundle format and runtime for delivering web resources to any webview-mounted
              platform — signed, versioned, and guaranteed to work offline.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-[14px] font-mono font-medium text-white"
                style={{ backgroundColor: 'var(--color-fd-accent)' }}
              >
                Read the guide
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-md border border-zinc-300 px-5 py-2.5 text-[14px] font-mono font-medium text-zinc-800 hover:border-zinc-500 dark:border-zinc-800 dark:text-zinc-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.08 1.84 2.82 1.31 3.51 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12Z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>

          {/* Architecture figure */}
          <div className="relative mx-auto max-w-6xl px-6 pb-20">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-8 dark:border-zinc-900 dark:bg-[#0e0e0f]">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                  Architecture
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* source */}
                <div>
                  <div className="mb-3 font-mono text-[10.5px] uppercase tracking-widest text-zinc-500">
                    your source
                  </div>
                  <div className="space-y-2">
                    {['app/main.tsx', 'styles/app.css', 'assets/*.png', 'package.json'].map(f => (
                      <div
                        key={f}
                        className="flex items-center gap-2 rounded border border-zinc-200 bg-white px-3 py-1.5 font-mono text-[11.5px] text-zinc-700 dark:border-zinc-800 dark:bg-[#141414] dark:text-zinc-300"
                      >
                        <span className="h-1.5 w-1.5 rounded-sm bg-zinc-400"></span>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                {/* bundle */}
                <div className="relative">
                  <div className="mb-3 flex items-center justify-between font-mono text-[10.5px] tracking-widest text-zinc-500">
                    <span className="uppercase">bundle</span>
                  </div>
                  <div className="flex aspect-[4/3] items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-white dark:border-zinc-800 dark:bg-[#141414]">
                    <div className="text-center">
                      <div
                        className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-md text-white"
                        style={{ backgroundColor: 'var(--color-fd-accent)' }}
                      >
                        {/*<Logo size={28} accent="rgba(255,255,255,0.85)" />*/}
                      </div>
                      <div className="font-mono text-[12px] font-medium">app.wvb</div>
                      <div className="font-mono text-[10.5px] text-zinc-500">2.1 MB · ed25519</div>
                    </div>
                  </div>
                  {/* arrows (desktop only) */}
                  <svg
                    className="absolute top-1/2 -left-5 hidden -translate-y-1/2 md:block"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3 10h12M11 5l5 5-5 5" className="text-zinc-400" />
                  </svg>
                  <svg
                    className="absolute top-1/2 -right-5 hidden -translate-y-1/2 md:block"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3 10h12M11 5l5 5-5 5" className="text-zinc-400" />
                  </svg>
                </div>
                {/* runtime */}
                <div>
                  <div className="mb-3 font-mono text-[10.5px] uppercase tracking-widest text-zinc-500">
                    webview host
                  </div>
                  <div className="space-y-2">
                    {[
                      ['iOS', 'WKWebView'],
                      ['Android', 'WebView'],
                      ['Desktop', 'Tauri / Electron'],
                      ['RN', 'react-native-webview'],
                    ].map(([p, r]) => (
                      <div
                        key={p}
                        className="flex items-center justify-between rounded border border-zinc-200 bg-white px-3 py-1.5 font-mono text-[11.5px] dark:border-zinc-800 dark:bg-[#141414]"
                      >
                        <span className="text-zinc-700 dark:text-zinc-300">{p}</span>
                        <span className="text-zinc-500">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-zinc-200 pt-4 text-center font-mono text-[10.5px] uppercase tracking-widest text-zinc-500 dark:border-zinc-900">
                deterministic · signed · offline
              </div>
            </div>
          </div>
        </section>

        {/* Narrative features — vertical with big numbers */}
        <section className="border-b border-zinc-200 dark:border-zinc-900">
          <div className="mx-auto max-w-5xl px-6 py-20">
            {[
              {
                n: '01',
                t: 'Offline-first, by default.',
                d: "Every bundle carries its full dependency graph. Mount it once and the app keeps working — subway, plane, dead network, doesn't matter.",
                code: 'await mount("app.wvb", { offline: true });',
              },
              {
                n: '02',
                t: 'Written in web code.',
                d: 'Author with React, Vue, Svelte, or vanilla HTML. The build step emits a single .wvb artifact from any bundler output — no custom toolchain to learn.',
                code: 'wvb build ./dist --sign ed25519',
              },
              {
                n: '03',
                t: 'Cross-platform contract.',
                d: 'One bundle format, identical runtime behavior on iOS WKWebView, Android WebView, Tauri, and Electron. No per-host packaging branches.',
                code: '// Same bundle. Every host.',
              },
              {
                n: '04',
                t: 'Native where it matters.',
                d: 'A typed bridge exposes host capabilities to your web code. Streaming IPC with cancellation and backpressure, adapters for Swift, Kotlin, and Rust.',
                code: 'const result = await native.fs.read(path);',
              },
            ].map((item, i) => (
              <div
                key={item.n}
                className={`grid grid-cols-1 gap-8 py-12 md:grid-cols-[auto_1fr_1fr] md:gap-14 ${i !== 0 ? 'border-t border-zinc-200 dark:border-zinc-900' : ''}`}
              >
                <div className="font-mono text-[56px] font-semibold leading-none tracking-tight text-zinc-300 dark:text-zinc-800">
                  {item.n}
                </div>
                <div>
                  <h3 className="text-[26px] font-semibold tracking-tight">{item.t}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {item.d}
                  </p>
                </div>
                <div className="flex items-center">
                  <pre className="w-full overflow-x-auto rounded-md bg-zinc-100 px-4 py-3 font-mono text-[12.5px] text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                    {item.code}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Platforms band */}
        <section className="border-b border-zinc-200 dark:border-zinc-900">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="mb-6 flex items-baseline justify-between">
              <div className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                Runs on
              </div>
              <a
                href="#"
                className="font-mono text-[11.5px] text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
              >
                compatibility matrix →
              </a>
            </div>
            <div className="grid grid-cols-2 gap-px bg-zinc-200 dark:bg-zinc-900 md:grid-cols-5">
              {['iOS', 'Android', 'macOS', 'Windows', 'Linux'].map(p => (
                <div key={p} className="bg-white px-6 py-6 dark:bg-[#09090a]">
                  <div className="font-mono text-[11px] text-zinc-500">platform</div>
                  <div className="mt-1 text-[18px] font-semibold tracking-tight">{p}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-b border-zinc-200 dark:border-zinc-900">
          <div className="mx-auto max-w-6xl px-6 py-24 text-center">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Start now
            </div>
            <h2 className="text-balance mx-auto max-w-2xl text-[40px] font-semibold leading-[1.1] tracking-tight md:text-[52px]">
              Three commands from zero to a mounted bundle.
            </h2>
            <div className="mx-auto mt-10 max-w-xl rounded-lg border border-zinc-200 bg-zinc-50 p-5 text-left dark:border-zinc-900 dark:bg-[#0e0e0f]">
              <pre className="font-mono text-[13px] leading-relaxed text-zinc-800 dark:text-zinc-200">
                <span className="text-zinc-400">$</span> npm install -g webview-bundle{'\n'}
                <span className="text-zinc-400">$</span> wvb init my-app{'\n'}
                <span className="text-zinc-400">$</span> wvb build ./my-app --out app.wvb
              </pre>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/*<Logo size={18} accent={ACCENT.base} />*/}
              <span className="font-mono text-[12px]">webview-bundle · MIT · 2026</span>
            </div>
            <div className="flex gap-6 font-mono text-[11.5px] text-zinc-500">
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                docs
              </a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                github
              </a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                discussions
              </a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                changelog
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
