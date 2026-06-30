import { usePathname } from 'fumadocs-core/framework';
import { FullSearchTrigger, SearchTrigger } from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import { GitHubIcon } from '../home/components/icons';
import { Logo } from '../home/components/Logo';
import { ThemeToggle } from '../home/components/ThemeToggle';
import { GITHUB_URL } from '../home/data';
import { LanguageDropdown } from './LanguageDropdown';

// The docs share the landing page's header. Section links sit on the left; the
// search bar, language dropdown, GitHub link, and theme toggle sit on the right.
const SECTIONS = [
  { label: 'Guide', href: '/docs/guide' },
  { label: 'References', href: '/docs/references' },
  { label: 'Config', href: '/docs/config' },
  { label: 'Changelog', href: '/docs/changelog' },
];

export function DocsNavbar() {
  const pathname = usePathname();

  return (
    <header className="[grid-area:header] sticky top-(--fd-docs-row-1) z-30 border-b border-zinc-200/70 bg-white/85 backdrop-blur-md dark:border-zinc-900 dark:bg-[#09090a]/85">
      <div className="flex h-14 items-center gap-3 px-4 sm:gap-6 sm:px-6">
        <a href="/" className="flex shrink-0 items-center gap-2">
          <Logo width={26} height={26} />
          <span className="font-mono text-[15px] font-semibold tracking-tight max-sm:hidden">
            webview-bundle
          </span>
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
          <FullSearchTrigger className="w-56 max-md:hidden" hideIfDisabled />
          <SearchTrigger
            className="rounded-md border border-zinc-300 p-1.5 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 md:hidden dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
            hideIfDisabled
          />
          <LanguageDropdown />
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
        </div>
      </div>
    </header>
  );
}
