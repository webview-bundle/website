'use client';

import { localizeHref } from '../../../lib/i18n';
import { useLocale } from '../../../lib/locale';
import { useUiStrings } from '../../../lib/ui-strings';
import { DOCS_URL, GITHUB_URL, PLATFORMS } from '../data';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { ArrowRightIcon, GitHubIcon } from './icons';

// The supported targets, shown as the hero eyebrow. Framework/platform names are
// proper nouns (same in every locale), so this needs no translation and doubles
// as an at-a-glance proof of the core promise: one bundle, every webview.
const TARGETS = PLATFORMS.map(platform => platform.name).join('  ·  ');

// Staggered page-load reveal. `both` fill holds each element in its start
// (hidden) state until its delay elapses; the whole thing is gated behind
// `motion-safe`, so reduced-motion users just see the final layout.
const RISE = 'motion-safe:animate-[wvb-rise_0.7s_cubic-bezier(0.22,1,0.36,1)_both]';

export function Hero() {
  const t = useUiStrings();
  const locale = useLocale();
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-900">
      {/* Blueprint grid — faint vertical rules, matching the rest of the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px)',
          backgroundSize: '80px 100%',
        }}
      />
      {/* Ambient blue→violet aura behind the headline — the same lighting the
          Showcase footage has, breathing slowly so the hero feels lit, not flat. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 size-[640px] rounded-full bg-brand/20 blur-[140px] motion-safe:animate-[wvb-breathe_11s_ease-in-out_infinite] dark:bg-brand/25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-1/3 size-[420px] rounded-full bg-brand-2/15 blur-[130px] motion-safe:animate-[wvb-breathe_13s_ease-in-out_infinite]"
      />

      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20">
        {/* Eyebrow — the supported targets, in the display face's mono sibling.
            `flex-wrap` + `max-w-full` keep the list from overflowing on the
            narrowest phones; it stays one line from ~360px up. */}
        <div
          className={`${RISE} inline-flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1 rounded-md border border-zinc-200/80 bg-white/50 px-3 py-1.5 font-mono text-[11px] text-zinc-500 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-white/[0.02] dark:text-zinc-400`}
        >
          <span className="size-1.5 shrink-0 rounded-full bg-brand" />
          <span className="min-w-0">{TARGETS}</span>
        </div>

        <h1
          className={`${RISE} mt-6 max-w-4xl bg-gradient-to-b from-zinc-900 to-zinc-700 bg-clip-text text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-transparent sm:text-5xl md:text-[68px] dark:from-white dark:to-zinc-300`}
          style={{ animationDelay: '0.06s' }}
        >
          {t.hero.titleA}
          <br />
          {/* The middle word is intentionally dimmed, but it is still a word of
              the sentence — keep it a solid, legible muted tone (clears the
              large-text contrast floor in both themes) rather than a gradient
              that fades sub-2:1 at the glyph edges. */}
          <span className="text-zinc-500 dark:text-zinc-400">{t.hero.titleB}</span> {t.hero.titleC}
        </h1>

        <p
          className={`${RISE} mt-6 max-w-2xl font-mono text-[15px] leading-relaxed text-zinc-600 sm:text-[16.5px] dark:text-zinc-400`}
          style={{ animationDelay: '0.14s' }}
        >
          {t.hero.subtitle}
        </p>

        <div
          className={`${RISE} mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap`}
          style={{ animationDelay: '0.2s' }}
        >
          <a
            href={localizeHref(DOCS_URL, locale)}
            className="group inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-b from-brand to-brand-hover px-5 py-2.5 font-mono text-[14px] font-medium text-white shadow-lg shadow-brand/30 ring-1 ring-white/10 ring-inset transition-all hover:shadow-brand/50 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {t.hero.getStarted}
            <ArrowRightIcon className="size-[13px] transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white/50 px-5 py-2.5 font-mono text-[14px] font-medium text-zinc-800 backdrop-blur-sm transition-colors hover:border-zinc-500 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-zinc-800 dark:bg-white/[0.02] dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-white/[0.04]"
          >
            <GitHubIcon className="size-[14px]" />
            {t.hero.github}
          </a>
        </div>
      </div>

      <div
        className={`${RISE} relative mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20`}
        style={{ animationDelay: '0.28s' }}
      >
        <ArchitectureDiagram />
      </div>
    </section>
  );
}