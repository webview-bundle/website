import { SiteHeader } from '../../SiteHeader';
import { NAV_ITEMS } from '../data';
import { MobileMenu } from './MobileMenu';

// The landing page shares the docs header (see {@link SiteHeader}); it keeps the
// marketing nav items and the mobile menu, and is sticky to the viewport top.
export function Navbar() {
  return <SiteHeader links={NAV_ITEMS} className="sticky top-0" mobileMenu={<MobileMenu />} />;
}
