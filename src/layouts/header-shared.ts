// Shared header constants used by both the desktop header (SiteHeader) and the
// mobile full-screen menu (MobileNav). Kept in a dependency-free module so the
// two components can import them without a circular reference.

export interface HeaderLink {
  label: string;
  href: string;
}

// The site navigation, identical on the landing page and the docs.
export const SECTIONS: HeaderLink[] = [
  { label: 'Guide', href: '/docs/guide' },
  { label: 'References', href: '/docs/references' },
  { label: 'Config', href: '/docs/config' },
  { label: 'Changelog', href: '/docs/changelog' },
];

// A 32px square icon button, so every header control lines up.
export const CONTROL_BUTTON =
  'flex size-8 items-center justify-center rounded-md border border-zinc-300 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100';
