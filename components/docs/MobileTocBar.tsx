'use client';

import { TOCPopover } from 'fumadocs-ui/layouts/notebook/page/slots/toc';
import { SidebarTrigger } from 'fumadocs-ui/layouts/notebook/slots/sidebar';
import { MenuIcon } from '../home/components/icons';

// On mobile, the table-of-contents bar gets a hamburger on its left that toggles
// the left navigation sidebar drawer. The default Fumadocs "On this page" popover
// is kept; its trigger is padded left to leave room for the hamburger, which is
// pinned over the bar's start edge.
export function MobileTocBar() {
  return (
    <>
      <TOCPopover trigger={{ className: 'max-md:ps-14' }} />
      <SidebarTrigger
        aria-label="Toggle navigation sidebar"
        className="fixed start-0 top-(--fd-docs-row-2) z-20 flex h-10 items-center px-4 text-fd-muted-foreground transition-colors hover:text-fd-foreground md:hidden"
      >
        <MenuIcon className="size-[18px]" />
      </SidebarTrigger>
    </>
  );
}
