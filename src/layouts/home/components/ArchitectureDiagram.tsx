import { SOURCE_FILES, WEBVIEW_HOSTS } from '../data';
import { Logo } from './Logo';

// A tiny closed-padlock, marking the bundle's ed25519 signature.
function LockIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true" {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-center font-mono text-[10px] tracking-widest text-zinc-500 uppercase md:text-start dark:text-zinc-400">
      {children}
    </div>
  );
}

// A flow connector between two stages. Horizontal on `md+` (with a label above)
// and vertical when the diagram stacks on mobile. Three brand pulses travel along
// it on a stagger, so data visibly moves source → bundle → host.
function FlowConnector({ label }: { label: string }) {
  return (
    <>
      {/* Desktop: horizontal */}
      <div className="hidden shrink-0 flex-col items-center justify-center md:flex md:w-16 lg:w-24">
        <span className="mb-2 font-mono text-[9px] tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
          {label}
        </span>
        <div className="relative h-px w-full bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_7px_1px] shadow-brand/50 motion-safe:animate-[wvb-flow-x_2.4s_linear_infinite] motion-reduce:hidden"
              style={{ animationDelay: `${i * 0.8}s` }}
            />
          ))}
        </div>
      </div>
      {/* Mobile: vertical */}
      <div className="flex justify-center py-1 md:hidden">
        <div className="relative h-9 w-px bg-gradient-to-b from-zinc-300 to-transparent dark:from-zinc-700">
          {[0, 1].map(i => (
            <span
              key={i}
              className="absolute left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_7px_1px] shadow-brand/50 motion-safe:animate-[wvb-flow-y_2s_linear_infinite] motion-reduce:hidden"
              style={{ animationDelay: `${i * 1}s` }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export function ArchitectureDiagram() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-zinc-50/80 to-white p-6 sm:p-8 dark:border-zinc-900 dark:from-[#0e0e0f] dark:to-[#0a0a0b]">
      {/* Faint dot grid for depth. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      <div className="relative mb-7 font-mono text-[11px] tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
        Architecture
      </div>

      <div className="relative flex flex-col gap-1 md:flex-row md:items-center md:gap-0">
        {/* Your source */}
        <div className="md:flex-1">
          <ColumnLabel>your source</ColumnLabel>
          <div className="space-y-2">
            {SOURCE_FILES.map(file => (
              <div
                key={file}
                className="flex items-center gap-2.5 rounded-md border border-zinc-200 bg-white px-3 py-2 font-mono text-[11.5px] text-zinc-700 dark:border-zinc-800 dark:bg-[#141414] dark:text-zinc-300"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-brand/60" />
                {file}
              </div>
            ))}
          </div>
        </div>

        <FlowConnector label="pack" />

        {/* The bundle — the hero artifact of the diagram. A single signed .wvb
            file, lifted off the surface with a layered blue→violet aura and a
            gradient hairline border so it reads as the one physical thing every
            host receives. */}
        <div className="relative shrink-0 self-center py-2 md:py-0">
          <div className="relative size-40 motion-safe:animate-[wvb-float_7s_ease-in-out_infinite]">
            {/* A single blue→violet halo, breathing on one clock — the artifact
                reads as one confident object rather than several glows. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-br from-brand/25 to-brand-2/25 blur-2xl motion-safe:animate-[wvb-pulse_5s_ease-in-out_infinite]"
            />
            <div className="relative size-40 rounded-[14px] bg-gradient-to-br from-brand/60 via-zinc-200 to-brand-2/50 p-px dark:via-zinc-800">
              <div className="flex size-full flex-col items-center justify-center rounded-[13px] bg-white/90 backdrop-blur-sm dark:bg-[#141414]/95">
                <Logo width={44} height={44} className="mb-3" />
                <div className="font-mono text-[13px] font-medium">app.wvb</div>
                <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                  <span>2.1 MB</span>
                  <span className="text-zinc-300 dark:text-zinc-700">·</span>
                  <span className="inline-flex items-center gap-1 text-brand">
                    <LockIcon className="size-2.5" />
                    ed25519
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FlowConnector label="serve" />

        {/* Webview host */}
        <div className="md:flex-1">
          <ColumnLabel>webview host</ColumnLabel>
          <div className="space-y-2">
            {WEBVIEW_HOSTS.map(({ platform, runtime }) => (
              <div
                key={platform}
                className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 bg-white px-3 py-2 font-mono text-[11.5px] dark:border-zinc-800 dark:bg-[#141414]"
              >
                <span className="text-zinc-700 dark:text-zinc-300">{platform}</span>
                <span className="text-zinc-500 dark:text-zinc-400">{runtime}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
