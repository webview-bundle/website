import { DOCS_URL, GITHUB_URL } from '../data';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { ArrowRightIcon, GitHubIcon } from './icons';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-900">
      {/* Faint vertical grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px)',
          backgroundSize: '80px 100%',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20">
        <h1 className="max-w-4xl text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-5xl md:text-[68px]">
          Ship web
          <br />
          <span className="text-zinc-400 dark:text-zinc-600">inside</span> native.
        </h1>
        <p className="mt-6 max-w-2xl font-mono text-[15px] leading-relaxed text-zinc-600 sm:text-[16.5px] dark:text-zinc-400">
          A bundle format and runtime for delivering web resources to any webview-mounted platform —
          signed, versioned, and guaranteed to work offline.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={DOCS_URL}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-2.5 font-mono text-[14px] font-medium text-white transition-colors hover:bg-brand-hover"
          >
            Read the guide
            <ArrowRightIcon className="size-[13px]" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 px-5 py-2.5 font-mono text-[14px] font-medium text-zinc-800 transition-colors hover:border-zinc-500 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600"
          >
            <GitHubIcon className="size-[14px]" />
            GitHub
          </a>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <ArchitectureDiagram />
      </div>
    </section>
  );
}
