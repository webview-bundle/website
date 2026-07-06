import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { localizeHref, type Locale } from '@/lib/i18n';

// Prefix internal `/docs/...` links with the active locale so translated pages
// link to their own language (`/ko/docs/...`) without the MDX carrying prefixes.
// Pure (locale is passed in from the server page), so no client hook is needed.
function makeLocalizedLink(locale: Locale) {
  const Anchor = defaultMdxComponents.a ?? 'a';
  return function LocalizedLink({ href, ...props }: ComponentProps<'a'>) {
    return <Anchor href={href == null ? href : localizeHref(href, locale)} {...props} />;
  };
}

// `<Card>` renders its own anchor (it doesn't go through the `a` override above),
// so localize its href the same way.
function makeLocalizedCard(locale: Locale) {
  return function LocalizedCard({ href, ...props }: ComponentProps<typeof Card>) {
    return <Card href={href == null ? href : localizeHref(href, locale)} {...props} />;
  };
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

// Register the fumadocs built-ins used across the docs plus the custom Badge, with
// locale-aware links/cards. Called from the (server) docs page with the active locale.
export function getMDXComponents(locale: Locale, components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    a: makeLocalizedLink(locale),
    img: props => <ImageZoom {...(props as ComponentProps<typeof ImageZoom>)} />,
    Callout,
    Card: makeLocalizedCard(locale),
    Cards,
    Tab,
    Tabs,
    TypeTable,
    Badge,
    ...components,
  };
}
