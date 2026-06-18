import { useEffect, useRef } from 'react';

const PLATFORMS = ['Electron', 'Tauri', 'iOS', 'Android'];

// A dark "spotlight" band: the demo footage is dark-themed, so we frame it on a dark
// surface (in light mode too) to make it an intentional focal moment rather than a clash.
// Desktop gets the 2-up cut (a large, legible desktop window + a phone); phones get the
// single-device portrait cut, since a desktop window is unreadable at phone width. WebM (VP9)
// is primary with an H.264 mp4 fallback for browsers without VP9 (e.g. older iOS Safari).
export function Showcase() {
  const framesRef = useRef<HTMLDivElement>(null);

  // Respect users who prefer reduced motion: hold the poster frame instead of looping.
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    framesRef.current?.querySelectorAll('video').forEach(video => {
      video.autoplay = false;
      video.pause();
      video.currentTime = 0;
    });
  }, []);

  return (
    <section
      id="demo"
      className="relative overflow-hidden border-b border-zinc-200 bg-[#070a12] dark:border-zinc-900"
    >
      {/* Blue/violet glow echoing the footage's own lighting. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 520px at 22% 12%, rgba(37,99,235,0.16), transparent 60%), radial-gradient(760px 520px at 88% 96%, rgba(109,92,246,0.13), transparent 60%)',
        }}
      />
      {/* Faint vertical grid lines, matching the hero. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px)',
          backgroundSize: '80px 100%',
        }}
      />

      {/* Heading column — aligned to the page's content width. */}
      <div className="relative mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <div className="font-mono text-[11px] tracking-widest text-blue-300/80 uppercase">
            Live demo
          </div>
          <div className="font-mono text-[11.5px] text-zinc-400">one .wvb → every webview</div>
        </div>

        <h2 className="max-w-2xl text-3xl leading-[1.08] font-semibold tracking-[-0.02em] text-balance text-white sm:text-[40px]">
          One bundle. Every webview.
        </h2>
        <p className="mt-4 max-w-xl font-mono text-[14px] leading-relaxed text-zinc-400">
          The same signed <code className="text-zinc-200">.wvb</code> — a Hacker News reader —
          running unmodified on Electron, Tauri, iOS, and Android.
        </p>
      </div>

      {/* Video — intentionally wider than the text column so the UI stays legible. */}
      <div className="relative mx-auto max-w-[1500px] px-4 pt-10 pb-16 sm:px-6 sm:pb-24">
        <div
          ref={framesRef}
          className="mx-auto max-w-[300px] overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.04] sm:max-w-[380px] lg:max-w-none"
        >
          {/* Wide screens: desktop window + phone (2-up). Below lg it would be too cramped. */}
          <video
            className="hidden w-full lg:block"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/showcase/landscape.jpg"
            aria-label="The same webview-bundle app running on Electron, Tauri, iOS, and Android"
          >
            <source src="/showcase/landscape.webm" type="video/webm" />
            <source src="/showcase/landscape.mp4" type="video/mp4" />
          </video>
          {/* Phones & tablets: single device, portrait (always legible, never cramped) */}
          <video
            className="block w-full lg:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/showcase/vertical.jpg"
            aria-label="The same webview-bundle app running on Electron, Tauri, iOS, and Android"
          >
            <source src="/showcase/vertical.webm" type="video/webm" />
            <source src="/showcase/vertical.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 lg:justify-start">
          {PLATFORMS.map(platform => (
            <span
              key={platform}
              className="flex items-center gap-2 font-mono text-[11.5px] text-zinc-400"
            >
              <span className="size-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_1px_rgba(59,130,246,0.7)]" />
              {platform}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
