import type { ComponentProps } from 'react';
import { useUiStrings } from '../../../lib/ui-strings';

type IconProps = ComponentProps<'svg'>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

// One icon per core value, in the same order as `t.features`.
const BoltIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
  </Icon>
);
const CodeIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
  </Icon>
);
const LayersIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="m3 16 9 5 9-5M3 12l9 5 9-5" />
  </Icon>
);
const ChipIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="7" y="7" width="10" height="10" rx="1.5" />
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
  </Icon>
);

const ICONS = [BoltIcon, CodeIcon, LayersIcon, ChipIcon];

export function Features() {
  const t = useUiStrings();
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-900"
    >
      {/* Faint grid lines, matching the hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px)',
          backgroundSize: '80px 100%',
        }}
      />
      {/* Ambient brand glow that slowly breathes behind the grid. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[130px] motion-safe:animate-[wvb-breathe_9s_ease-in-out_infinite]"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {t.features.map((feature, index) => {
            const FeatureIcon = ICONS[index] ?? BoltIcon;
            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white/80 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5 sm:p-9 dark:border-zinc-900 dark:bg-[#0c0c0e]/80 dark:hover:border-brand/40"
              >
                {/* Brand glow that warms the card from the corner on hover. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -bottom-16 size-56 rounded-full bg-brand/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />
                {/* Oversized watermark icon that fills the wide card. */}
                <FeatureIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-5 -bottom-5 size-32 text-zinc-100 transition-transform duration-500 group-hover:scale-110 dark:text-zinc-900"
                />
                <div className="relative">
                  <div className="flex size-11 items-center justify-center rounded-md bg-gradient-to-br from-brand/15 to-brand-2/15 text-brand ring-1 ring-brand/15 transition-transform duration-300 group-hover:scale-110">
                    <FeatureIcon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-[18px] font-semibold tracking-tight sm:text-[20px]">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 max-w-md text-[14.5px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
