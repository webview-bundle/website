import { GITHUB_URL, NAV_ITEMS } from '../data';
import { GitHubIcon } from './icons';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/85 backdrop-blur-md dark:border-zinc-900 dark:bg-[#09090a]/85">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:gap-8 sm:px-6">
        <a href="/" className="flex items-center gap-2">
          <Logo width={26} height={26} />
          <span className="font-mono text-[15px] font-semibold tracking-tight">webview-bundle</span>
        </a>

        <nav className="hidden items-center gap-6 font-mono text-[13.5px] text-zinc-600 md:flex dark:text-zinc-400">
          {NAV_ITEMS.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="rounded-md border border-zinc-300 p-1.5 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            <GitHubIcon className="size-[15px]" />
          </a>
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
