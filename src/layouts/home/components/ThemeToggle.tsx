import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '../../../lib/cn';
import { MoonIcon, SunIcon } from './icons';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid a hydration mismatch: the resolved theme is only known on the client.
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className={cn(
        'flex size-8 items-center justify-center rounded-md border border-zinc-300 text-zinc-600 transition-colors',
        'hover:border-zinc-400 hover:text-zinc-900',
        'dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100',
        className
      )}
    >
      {isDark ? <SunIcon className="size-[15px]" /> : <MoonIcon className="size-[15px]" />}
    </button>
  );
}
