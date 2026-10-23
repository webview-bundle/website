import { useTheme } from 'next-themes';
import { cn } from '../../../lib/cn';
import { MoonIcon, SunIcon } from './icons';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className={cn(
        'flex size-8 items-center justify-center rounded-md border border-zinc-300 text-zinc-600 transition-colors',
        'hover:border-zinc-400 hover:text-zinc-900',
        'dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100',
        className
      )}
    >
      {/* Keep server and client markup identical; CSS selects the active theme. */}
      <SunIcon className="hidden size-[15px] dark:block" />
      <MoonIcon className="size-[15px] dark:hidden" />
    </button>
  );
}
