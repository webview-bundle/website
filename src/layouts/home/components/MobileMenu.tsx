import { Dialog } from '@base-ui/react/dialog';
import { DOCS_URL, GITHUB_URL, NAV_ITEMS } from '../data';
import { CloseIcon, GitHubIcon, MenuIcon } from './icons';
import { Logo } from './Logo';

/**
 * Compact navigation for small screens. The hamburger button is hidden from
 * `md` up, where the inline nav in {@link Navbar} takes over.
 */
export function MobileMenu() {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label="Open menu"
        className="flex size-8 items-center justify-center rounded-md border border-zinc-300 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 md:hidden dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
      >
        <MenuIcon className="size-[18px]" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex h-dvh w-72 max-w-[82vw] flex-col gap-6 border-l border-zinc-200 bg-white p-6 shadow-xl transition-transform duration-300 data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full dark:border-zinc-900 dark:bg-[#09090a]">
          <div className="flex items-center justify-between">
            <Dialog.Title className="flex items-center gap-2 text-sm font-semibold">
              <Logo width={24} height={24} />
              <span className="font-mono tracking-tight">webview-bundle</span>
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close menu"
              className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            >
              <CloseIcon className="size-[18px]" />
            </Dialog.Close>
          </div>

          <nav className="flex flex-col gap-1 font-mono text-[15px] text-zinc-700 dark:text-zinc-300">
            {NAV_ITEMS.map(item => (
              <Dialog.Close
                key={item.href}
                render={<a href={item.href}>{item.label}</a>}
                className="rounded-md px-2 py-2 text-left transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              />
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <Dialog.Close
              render={<a href={DOCS_URL}>Get started</a>}
              className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
            />
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:border-zinc-500 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600"
            >
              <GitHubIcon className="size-4" />
              GitHub
            </a>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
