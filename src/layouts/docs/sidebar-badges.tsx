import type * as PageTree from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';

// Sidebar entries (by URL) that should carry a small "Experimental" badge.
const EXPERIMENTAL_URLS = new Set(['/docs/guide/platforms/deno', '/docs/references/deno']);

function ExperimentalBadge() {
  return (
    <span className="ms-1.5 inline-flex shrink-0 items-center rounded-sm border border-amber-300 bg-amber-50 px-1 text-[9px] font-medium tracking-wide text-amber-700 uppercase dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
      Experimental
    </span>
  );
}

function withBadge(name: ReactNode): ReactNode {
  return (
    <>
      {name}
      <ExperimentalBadge />
    </>
  );
}

function visit(node: PageTree.Node): PageTree.Node {
  if (node.type === 'folder') {
    const folder = { ...node, children: node.children.map(visit) };
    const url = node.index?.url;
    return url != null && EXPERIMENTAL_URLS.has(url)
      ? { ...folder, name: withBadge(folder.name) }
      : folder;
  }
  if (node.type === 'page' && EXPERIMENTAL_URLS.has(node.url)) {
    return { ...node, name: withBadge(node.name) };
  }
  return node;
}

// Tag the Deno (experimental) entries in the sidebar tree with a small badge.
// Applied client-side after the serialized tree is loaded, so the ReactNode name
// is fine — the over-the-wire payload still carries plain-string names.
export function withExperimentalBadges(root: PageTree.Root): PageTree.Root {
  return { ...root, children: root.children.map(visit) };
}
