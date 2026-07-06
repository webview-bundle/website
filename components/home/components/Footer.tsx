'use client';

import { useUiStrings } from '../../../lib/ui-strings';
import { Logo } from './Logo';

export function Footer() {
  const t = useUiStrings();
  return (
    <footer className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Logo width={18} height={18} />
          <span className="font-mono text-[12px]">webview-bundle · MIT · 2026</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 font-mono text-[11.5px] text-zinc-500">
          {t.footer.map(item => (
            <a
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
