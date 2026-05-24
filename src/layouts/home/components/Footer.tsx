import { DOCS_URL, GITHUB_URL } from '../data';
import { Logo } from './Logo';

const FOOTER_LINKS = [
  { label: 'docs', href: DOCS_URL },
  { label: 'github', href: GITHUB_URL },
  { label: 'discussions', href: `${GITHUB_URL}/discussions` },
  { label: 'changelog', href: `${GITHUB_URL}/releases` },
];

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Logo width={18} height={18} />
          <span className="font-mono text-[12px]">webview-bundle · MIT · 2026</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 font-mono text-[11.5px] text-zinc-500">
          {FOOTER_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
