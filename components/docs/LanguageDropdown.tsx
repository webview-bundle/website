'use client';

import { usePathname } from 'fumadocs-core/framework';
import { type ComponentProps, useState } from 'react';
import { cn } from '../../lib/cn';
import { switchLocalePath, type Locale } from '../../lib/i18n';
import { useLocale } from '../../lib/locale';
import { useUiStrings } from '../../lib/ui-strings';

const LANGUAGES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' },
];

function GlobeIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  );
}

function ChevronDownIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function LanguageDropdown({ menuPlacement = 'down' }: { menuPlacement?: 'down' | 'up' }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useUiStrings();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-label={t.language.select}
        aria-expanded={open}
        className="flex h-8 items-center gap-1 rounded-md border border-zinc-300 px-2 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
      >
        <GlobeIcon className="size-[15px]" />
        <ChevronDownIcon className={cn('size-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" aria-hidden="true" onClick={() => setOpen(false)} />
          <ul
            className={cn(
              'absolute z-50 min-w-36 overflow-hidden rounded-md border border-fd-border bg-fd-popover py-1 text-sm shadow-lg',
              menuPlacement === 'up' ? 'start-0 bottom-full mb-2' : 'end-0 mt-2'
            )}
          >
            {LANGUAGES.map(language => {
              const active = language.code === locale;
              return (
                <li key={language.code}>
                  <a
                    href={switchLocalePath(pathname, language.code)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 px-3 py-1.5 text-start',
                      active ? 'text-fd-foreground' : 'text-fd-foreground hover:bg-fd-accent'
                    )}
                  >
                    <span>{language.label}</span>
                    {active && <span className="text-brand">✓</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}