import { type ComponentProps, useState } from 'react';
import { cn } from '../../lib/cn';

interface Language {
  code: string;
  label: string;
  available: boolean;
}

// English ships today; Korean docs are planned (the project already maintains a
// Korean README). This is a placeholder switcher until translated docs land.
const LANGUAGES: Language[] = [
  { code: 'en', label: 'English', available: true },
  { code: 'ko', label: '한국어', available: false },
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

export function LanguageDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative max-md:hidden">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-label="Select language"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-md border border-zinc-300 px-2 py-1.5 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
      >
        <GlobeIcon className="size-[15px]" />
        <ChevronDownIcon className={cn('size-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" aria-hidden="true" onClick={() => setOpen(false)} />
          <ul className="absolute end-0 z-50 mt-2 min-w-36 overflow-hidden rounded-md border border-fd-border bg-fd-popover py-1 text-sm shadow-lg">
            {LANGUAGES.map(language => (
              <li key={language.code}>
                <button
                  type="button"
                  disabled={!language.available}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 px-3 py-1.5 text-start',
                    language.available
                      ? 'text-fd-foreground hover:bg-fd-accent'
                      : 'cursor-not-allowed text-fd-muted-foreground'
                  )}
                >
                  <span>{language.label}</span>
                  {language.available ? (
                    <span className="text-brand">Active</span>
                  ) : (
                    <span className="text-[10px] tracking-wide uppercase">Soon</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
