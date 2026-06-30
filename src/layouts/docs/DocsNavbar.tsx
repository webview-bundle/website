import { SiteHeader } from '../SiteHeader';

// The docs header is the shared site header, positioned in the notebook layout's
// header grid area and sticky below any banner.
export function DocsNavbar() {
  return <SiteHeader className="[grid-area:header] sticky top-(--fd-docs-row-1)" />;
}
