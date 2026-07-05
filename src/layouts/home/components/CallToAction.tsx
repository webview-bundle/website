import { Fragment } from 'react';
import { localizeHref, useLocale } from '../../../lib/locale';
import { useUiStrings } from '../../../lib/ui-strings';
import { GITHUB_URL, INSTALL_COMMANDS } from '../data';
import { ArrowRightIcon, GitHubIcon } from './icons';

export function CallToAction() {
  const t = useUiStrings();
  const locale = useLocale();
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-900">
      {/* Faint vertical grid, matching the hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px)',
          backgroundSize: '80px 100%',
        }}
      />
      {/* Blue→violet wash rising from the base, so the closing frame glows in
          the same in-family pairing as the hero and the bundle artifact. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[420px] w-[820px] max-w-full -translate-x-1/2 translate-y-1/3 rounded-full bg-brand/15 blur-[140px] motion-safe:animate-[wvb-breathe_10s_ease-in-out_infinite]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-[38%] h-[300px] w-[460px] max-w-full -translate-x-1/2 translate-y-1/3 rounded-full bg-brand-2/12 blur-[130px] motion-safe:animate-[wvb-breathe_12s_ease-in-out_infinite]"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <div className="mb-4 font-mono text-[11px] tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
          {t.cta.eyebrow}
        </div>
        <h2 className="mx-auto max-w-3xl bg-gradient-to-b from-zinc-900 to-zinc-700 bg-clip-text text-3xl leading-[1.1] font-semibold tracking-tight break-keep text-balance text-transparent sm:text-[40px] md:text-[52px] dark:from-white dark:to-zinc-300">
          {t.cta.title.split('\n').map((line, index) => (
            <Fragment key={line}>
              {index > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </h2>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={localizeHref('/docs/guide/getting-started', locale)}
            className="group inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-b from-brand to-brand-hover px-5 py-2.5 font-mono text-[14px] font-medium text-white shadow-lg shadow-brand/30 ring-1 ring-white/10 ring-inset transition-all hover:shadow-brand/50 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {t.cta.getStarted}
            <ArrowRightIcon className="size-[13px] transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white/50 px-5 py-2.5 font-mono text-[14px] font-medium text-zinc-800 backdrop-blur-sm transition-colors hover:border-zinc-500 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-zinc-800 dark:bg-white/[0.02] dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-white/[0.04]"
          >
            <GitHubIcon className="size-[14px]" />
            {t.cta.github}
          </a>
        </div>

        {/* Proof that starting is genuinely three commands — framed as a real
            terminal, with the binary highlighted so the flow (install → pack →
            serve) reads at a glance. */}
        <div className="mx-auto mt-10 max-w-xl overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 text-left shadow-sm dark:border-zinc-800 dark:bg-[#0e0e0f]">
          {/* Terminal chrome — angular markers (one brand-lit, matching the
              page's square language) instead of the macOS traffic-light cliché;
              the path names where you run these. */}
          <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
            <span className="size-2.5 rounded-[2px] bg-brand/80" />
            <span className="size-2.5 rounded-[2px] bg-zinc-300 dark:bg-zinc-700" />
            <span className="size-2.5 rounded-[2px] bg-zinc-300 dark:bg-zinc-700" />
            <span className="ml-2 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              ~/my-app
            </span>
          </div>
          <pre className="overflow-x-auto px-5 py-4 font-mono text-[12px] leading-relaxed sm:text-[13px]">
            {INSTALL_COMMANDS.map(command => {
              const [binary, ...rest] = command.split(' ');
              return (
                <span key={command} className="block">
                  <span aria-hidden="true" className="text-zinc-400 select-none dark:text-zinc-600">
                    ${' '}
                  </span>
                  <span className="text-brand">{binary}</span>
                  <span className="text-zinc-700 dark:text-zinc-300"> {rest.join(' ')}</span>
                </span>
              );
            })}
          </pre>
        </div>
      </div>
    </section>
  );
}
