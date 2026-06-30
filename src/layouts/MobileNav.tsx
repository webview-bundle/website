import { Dialog } from '@base-ui/react/dialog';
import { usePathname } from 'fumadocs-core/framework';
import { cn } from '../lib/cn';
import { LanguageDropdown } from './docs/LanguageDropdown';
import { CONTROL_BUTTON, SECTIONS } from './header-shared';
import { CloseIcon, GitHubIcon, MenuIcon } from './home/components/icons';
import { Logo } from './home/components/Logo';
import { ThemeToggle } from './home/components/ThemeToggle';
import { GITHUB_URL } from './home/data';

// Mobile navigation: a hamburger that opens a full-screen overlay with the site
// sections, and a footer row of language / theme / GitHub controls. Used by the
// shared header on small screens (the inline nav + controls take over from `md`).
export function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <Dialog.Root>
      <Dialog.Trigger aria-label="Open menu" className={cn(CONTROL_BUTTON, className)}>
        <MenuIcon className="size-[18px]" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed inset-0 z-50 flex h-dvh w-full flex-col bg-white px-4 py-3 transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 sm:px-6 dark:bg-[#09090a]">
          <div className="flex h-14 shrink-0 items-center justify-between">
            <Dialog.Title className="flex items-center gap-2">
              <Logo width={26} height={26} />
              <span className="font-mono text-[15px] font-semibold tracking-tight">
                webview-bundle
              </span>
            </Dialog.Title>
            <Dialog.Close aria-label="Close menu" className={CONTROL_BUTTON}>
              <CloseIcon className="size-[18px]" />
            </Dialog.Close>
          </div>

          <nav className="mt-6 flex flex-col gap-1 font-mono text-lg">
            {SECTIONS.map(section => (
              <Dialog.Close
                key={section.href}
                render={<a href={section.href}>{section.label}</a>}
                className={cn(
                  'rounded-md px-3 py-3 text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900',
                  pathname.startsWith(section.href) && 'text-brand dark:text-brand'
                )}
              />
            ))}
          </nav>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <LanguageDropdown menuPlacement="up" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub repository"
                className={CONTROL_BUTTON}
              >
                <GitHubIcon className="size-[15px]" />
              </a>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
