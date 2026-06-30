import { SiteHeader } from '../SiteHeader';

// Section links for the docs; the rest of the header is shared with the landing
// page through {@link SiteHeader}. Positioned in the notebook layout's header
// grid area and sticky below any banner.
const SECTIONS = [
  { label: 'Guide', href: '/docs/guide' },
  { label: 'References', href: '/docs/references' },
  { label: 'Config', href: '/docs/config' },
  { label: 'Changelog', href: '/docs/changelog' },
];

export function DocsNavbar() {
  return (
    <SiteHeader links={SECTIONS} className="[grid-area:header] sticky top-(--fd-docs-row-1)" />
  );
}
