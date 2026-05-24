import { DOCS_URL, PLATFORMS } from '../data';

export function Platforms() {
  return (
    <section id="platforms" className="border-b border-zinc-200 dark:border-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-baseline justify-between">
          <div className="font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
            Runs on
          </div>
          <a
            href={DOCS_URL}
            className="font-mono text-[11.5px] text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            compatibility matrix →
          </a>
        </div>
        <div className="grid grid-cols-2 gap-px bg-zinc-200 sm:grid-cols-3 md:grid-cols-5 dark:bg-zinc-900">
          {PLATFORMS.map(platform => (
            <div key={platform} className="bg-white px-6 py-6 dark:bg-[#09090a]">
              <div className="font-mono text-[11px] text-zinc-500">platform</div>
              <div className="mt-1 text-[18px] font-semibold tracking-tight">{platform}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
