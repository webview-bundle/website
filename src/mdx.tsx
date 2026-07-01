import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from './lib/cn';
import { useLocale } from './lib/locale';
import { localizeHref } from './lib/locale';

// Prefix internal `/docs/...` links with the active locale so translated pages
// link to their own language (`/ko/docs/...`) without the MDX carrying prefixes.
function LocalizedLink({ href, ...props }: ComponentProps<'a'>) {
  const locale = useLocale();
  const Anchor = defaultMdxComponents.a ?? 'a';
  return <Anchor href={href == null ? href : localizeHref(href, locale)} {...props} />;
}

// `<Card>` renders its own anchor (it doesn't go through the `a` override above),
// so localize its href the same way.
function LocalizedCard({ href, ...props }: ComponentProps<typeof Card>) {
  const locale = useLocale();
  return <Card href={href == null ? href : localizeHref(href, locale)} {...props} />;
}

const BADGE_TONES = {
  amber:
    'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
  brand: 'border-brand/30 bg-brand/10 text-brand',
  zinc: 'border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
};

// Small inline status badge, e.g. `<Badge>Experimental</Badge>` under a page title.
function Badge({
  children,
  tone = 'amber',
}: {
  children: ReactNode;
  tone?: keyof typeof BADGE_TONES;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-1.5 py-0.5 align-middle text-[11px] font-medium tracking-wide uppercase',
        BADGE_TONES[tone]
      )}
    >
      {children}
    </span>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    a: LocalizedLink,
    img: props => <ImageZoom {...props} />,
    Callout,
    Card: LocalizedCard,
    Cards,
    Badge,
    ...TabsComponents,
    ...components,
  } satisfies MDXComponents;
}
export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
