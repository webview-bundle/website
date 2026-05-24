import { FEATURES } from '../data';
import { cn } from '../../../lib/cn';

export function Features() {
  return (
    <section id="how-it-works" className="border-b border-zinc-200 dark:border-zinc-900">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        {FEATURES.map((feature, index) => (
          <div
            key={feature.number}
            className={cn(
              'grid grid-cols-1 gap-6 py-10 md:grid-cols-[auto_1fr_1fr] md:gap-14 md:py-12',
              index !== 0 && 'border-t border-zinc-200 dark:border-zinc-900'
            )}
          >
            <div className="font-mono text-[40px] leading-none font-semibold tracking-tight text-zinc-300 sm:text-[56px] dark:text-zinc-800">
              {feature.number}
            </div>
            <div>
              <h3 className="text-[22px] font-semibold tracking-tight sm:text-[26px]">
                {feature.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
            <div className="flex items-center">
              <pre className="w-full overflow-x-auto rounded-md bg-zinc-100 px-4 py-3 font-mono text-[12.5px] text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                {feature.code}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
