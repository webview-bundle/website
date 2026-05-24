import { INSTALL_COMMANDS } from '../data';

export function CallToAction() {
  return (
    <section className="border-b border-zinc-200 dark:border-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <div className="mb-4 font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
          Start now
        </div>
        <h2 className="mx-auto max-w-2xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-[40px] md:text-[52px]">
          Three commands from zero to a mounted bundle.
        </h2>
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
