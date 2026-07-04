import { localizeHref, useLocale } from '../../../lib/locale';
import { useUiStrings } from '../../../lib/ui-strings';
import { GITHUB_URL, INSTALL_COMMANDS } from '../data';
import { ArrowRightIcon, GitHubIcon } from './icons';

export function CallToAction() {
  const t = useUiStrings();
  const locale = useLocale();
  return (
    <section className="border-b border-zinc-200 dark:border-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <div className="mb-4 font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
          {t.cta.eyebrow}
        </div>
        <h2 className="mx-auto max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-[40px] md:text-[52px]">
          {t.cta.title}
        </h2>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={localizeHref('/docs/guide/getting-started', locale)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-2.5 font-mono text-[14px] font-medium text-white transition-colors hover:bg-brand-hover"
          >
            {t.cta.getStarted}
            <ArrowRightIcon className="size-4" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 px-5 py-2.5 font-mono text-[14px] font-medium text-zinc-800 transition-colors hover:border-zinc-500 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600"
          >
            <GitHubIcon className="size-[15px]" />
            {t.cta.github}
          </a>
        </div>

        {/* Proof that starting is genuinely three commands. */}
        <div className="mx-auto mt-10 max-w-xl rounded-lg border border-zinc-200 bg-zinc-50 p-5 text-left dark:border-zinc-900 dark:bg-[#0e0e0f]">
          <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-zinc-800 sm:text-[13px] dark:text-zinc-200">
            {INSTALL_COMMANDS.map(command => (
              <span key={command} className="block">
                <span className="text-zinc-400">$</span> {command}
              </span>
            ))}
          </pre>
        </div>
      </div>
    </section>
  );
}
