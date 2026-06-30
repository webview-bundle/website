import { usePathname } from 'fumadocs-core/framework';
import { FullSearchTrigger, SearchTrigger } from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import { cn } from '../lib/cn';
import { LanguageDropdown } from './docs/LanguageDropdown';
import { CONTROL_BUTTON, SECTIONS } from './header-shared';
import { GitHubIcon } from './home/components/icons';
import { Logo } from './home/components/Logo';
import { ThemeToggle } from './home/components/ThemeToggle';
import { GITHUB_URL } from './home/data';
import { MobileNav } from './MobileNav';

// Shared site header for both the landing page and the docs. Desktop (`md`+):
// logo, section links, search, language, GitHub, theme. Mobile (`< md`):
// logo, search icon, and a hamburger that opens the full-screen {@link MobileNav}.
// `className` positions it per context (landing: `sticky top-0`; docs: the
// notebook layout's header grid area).
export function SiteHeader({ className }: { className?: string }) {
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
          {SECTIONS.map(section => (
            <a
              key={section.href}
              href={section.href}
              data-active={pathname.startsWith(section.href)}
              className="transition-colors hover:text-zinc-900 data-[active=true]:text-brand dark:hover:text-zinc-100 dark:data-[active=true]:text-brand"
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <FullSearchTrigger className="hidden h-8 w-56 rounded-md lg:inline-flex" hideIfDisabled />
          <SearchTrigger className={cn(CONTROL_BUTTON, 'lg:hidden')} hideIfDisabled />

          {/* Desktop controls; on mobile these live inside the full-screen menu. */}
          <div className="hidden items-center gap-2 md:flex">
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
          </div>

          <MobileNav className="md:hidden" />
        </div>
      </div>
    </header>
  );
}
