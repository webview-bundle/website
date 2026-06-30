import { usePathname } from 'fumadocs-core/framework';
import { FullSearchTrigger, SearchTrigger } from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { LanguageDropdown } from './docs/LanguageDropdown';
import { GitHubIcon } from './home/components/icons';
import { Logo } from './home/components/Logo';
import { ThemeToggle } from './home/components/ThemeToggle';
import { GITHUB_URL } from './home/data';

export interface HeaderLink {
  label: string;
  href: string;
}

// Shared site header for both the landing page and the docs, so the two share
// one design (logo, wordmark, nav links, search, language, GitHub, theme). The
// `className` positions it per context (landing: `sticky top-0`; docs: the
// notebook grid header area). All right-side controls are 32px tall so the
// search box lines up with the buttons next to it.
const CONTROL_BUTTON =
  'flex size-8 items-center justify-center rounded-md border border-zinc-300 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100';

export function SiteHeader({
  links,
  className,
  mobileMenu,
}: {
  links: HeaderLink[];
  className?: string;
  mobileMenu?: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        'z-30 border-b border-zinc-200/70 bg-white/85 backdrop-blur-md dark:border-zinc-900 dark:bg-[#09090a]/85',
        className
      )}
    >
      <div className="flex h-14 items-center gap-3 px-4 sm:gap-6 sm:px-6">
        <a href="/" className="flex shrink-0 items-center gap-2">
          <Logo width={26} height={26} />
          <span className="font-mono text-[15px] font-semibold tracking-tight">webview-bundle</span>
        </a>

        <nav className="hidden items-center gap-5 font-mono text-[13.5px] text-zinc-600 md:flex dark:text-zinc-400">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              data-active={link.href.startsWith('/docs') && pathname.startsWith(link.href)}
              className="transition-colors hover:text-zinc-900 data-[active=true]:text-brand dark:hover:text-zinc-100 dark:data-[active=true]:text-brand"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <FullSearchTrigger className="hidden h-8 w-56 rounded-md lg:inline-flex" hideIfDisabled />
          <SearchTrigger className={cn(CONTROL_BUTTON, 'lg:hidden')} hideIfDisabled />
          <LanguageDropdown />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className={CONTROL_BUTTON}
          >
            <GitHubIcon className="size-[15px]" />
          </a>
          <ThemeToggle />
          {mobileMenu}
        </div>
      </div>
    </header>
  );
}
