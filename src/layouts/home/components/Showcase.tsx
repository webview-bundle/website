import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../lib/cn';

type View = 'mobile' | 'desktop';
const VIEWS: { id: View; label: string }[] = [
  { id: 'mobile', label: 'Mobile' },
  { id: 'desktop', label: 'Desktop' },
];

// A dark "spotlight" band: the demo footage is dark-themed, so we frame it on a dark
// surface (in light mode too) to make it an intentional focal moment rather than a clash.
// On lg+ the 2-up cut (large desktop window + phone) always shows. Below lg we default to the
// single-device portrait cut, but a simple Mobile/Desktop tab lets viewers preview either.
// WebM (VP9) is primary with an H.264 mp4 fallback for browsers without VP9 (e.g. older iOS Safari).
export function Showcase() {
  const framesRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>('mobile'); // only affects the < lg layout

  // Play the currently visible video; pause the hidden one. Honors prefers-reduced-motion
  // (everything stays paused on its poster). Re-runs whenever the tab toggles.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    framesRef.current?.querySelectorAll('video').forEach(video => {
      if (video.offsetParent !== null && !reduce) {
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [view]);

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
      <div className="relative mx-auto max-w-[1500px] px-4 pt-8 pb-16 sm:px-6 sm:pb-24">
        {/* Mobile/Desktop toggle — only below lg, where a single cut is shown at a time. */}
        <div className="mb-5 flex justify-center lg:hidden">
          <div
            role="tablist"
            aria-label="Choose showcase view"
            className="inline-flex gap-0.5 rounded-full border border-white/10 bg-white/[0.03] p-0.5 font-mono text-[12px]"
          >
            {VIEWS.map(v => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={view === v.id}
                onClick={() => setView(v.id)}
                className={cn(
                  'rounded-full px-4 py-1.5 transition-colors',
                  view === v.id ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-zinc-200'
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={framesRef}
          className={cn(
            'mx-auto overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.04]',
            // < lg: portrait stays phone-sized; the desktop preview goes full width.
            view === 'mobile' ? 'max-w-[340px] sm:max-w-[400px]' : 'max-w-none',
            'lg:max-w-none'
          )}
        >
          {/* 2-up (desktop window + phone): wide screens only (lg+). */}
          <video
            className="hidden w-full lg:block"
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
          {/* Single desktop window: below lg, on the "Desktop" tab. */}
          <video
            className={cn('w-full lg:hidden', view === 'desktop' ? 'block' : 'hidden')}
            muted
            loop
            playsInline
            preload="metadata"
            poster="/showcase/desktop.jpg"
            aria-label="The webview-bundle app running on Electron and Tauri (desktop)"
          >
            <source src="/showcase/desktop.webm" type="video/webm" />
            <source src="/showcase/desktop.mp4" type="video/mp4" />
          </video>
          {/* Single phone (portrait): below lg, on the "Mobile" tab (default). */}
          <video
            className={cn('w-full lg:hidden', view === 'mobile' ? 'block' : 'hidden')}
            muted
            loop
            playsInline
            preload="metadata"
            poster="/showcase/vertical.jpg"
            aria-label="The same webview-bundle app running on iOS and Android (mobile)"
          >
            <source src="/showcase/vertical.webm" type="video/webm" />
            <source src="/showcase/vertical.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
