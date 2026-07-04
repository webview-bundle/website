import { localizeHref, useLocale } from '../../../lib/locale';
import { useUiStrings } from '../../../lib/ui-strings';
import { PLATFORMS } from '../data';
import { AndroidLogo, AppleLogo, DenoLogo, ElectronLogo, TauriLogo } from './logos';

// Brand mark per supported framework/platform (keyed by display name).
const LOGOS = {
  Electron: ElectronLogo,
  Tauri: TauriLogo,
  Android: AndroidLogo,
  iOS: AppleLogo,
  'Deno Desktop': DenoLogo,
} as const;

export function Platforms() {
  const t = useUiStrings();
  const locale = useLocale();
  return (
    <section id="platforms" className="border-b border-zinc-200 dark:border-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-baseline justify-between">
          <div className="font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
            {t.platforms.eyebrow}
          </div>
          <a
            href={localizeHref(
              '/docs/guide/getting-started/platform-and-framework-support',
              locale
            )}
            className="font-mono text-[11.5px] text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {t.platforms.matrix}
          </a>
        </div>
        <div className="grid grid-cols-2 gap-px bg-zinc-200 sm:grid-cols-3 md:grid-cols-5 dark:bg-zinc-900">
          {PLATFORMS.map(platform => {
            const Logo = LOGOS[platform.name as keyof typeof LOGOS];
            return (
              <div
                key={platform.name}
                className="flex flex-col items-center gap-3 bg-white px-4 py-8 dark:bg-[#09090a]"
              >
                {Logo != null && <Logo className="size-8 text-zinc-800 dark:text-zinc-200" />}
                {/* Name + a fixed-height badge slot below it, so every framework
                    name stays on the same baseline whether or not it has a badge. */}
                <div className="flex flex-col items-center gap-2">
                  <div className="text-[14px] font-medium tracking-tight text-zinc-800 dark:text-zinc-200">
                    {platform.name}
                  </div>
                  <div className="flex h-[18px] items-center">
                    {platform.experimental === true && (
                      <span className="rounded-sm border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-amber-700 uppercase dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
                        {t.platforms.experimental}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
