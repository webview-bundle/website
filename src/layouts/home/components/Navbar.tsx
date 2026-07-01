import { SiteHeader } from '../../SiteHeader';

// The landing page uses the same header as the docs (see {@link SiteHeader}),
// sticky to the viewport top.
export function Navbar() {
  return <SiteHeader className="sticky top-0" />;
}
