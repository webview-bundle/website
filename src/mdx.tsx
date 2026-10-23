import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { File, Folder, Files } from 'fumadocs-ui/components/files';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from './lib/cn';
import { codeIcons } from './lib/code-icons';
import { localizeHref, useLocale } from './lib/locale';

function FileTypeIcon({ name }: { name: keyof typeof codeIcons }) {
  const icon = codeIcons[name];
  return (
    <span aria-hidden="true" className="inline-flex size-4 shrink-0 items-center justify-center">
      <svg viewBox={icon.viewBox} style={{ width: 14, height: 14 }}>
        <path d={icon.d} fill={icon.fill} />
      </svg>
    </span>
  );
}

function IconTypeScript() {
  return <FileTypeIcon name="typescript" />;
}

function IconJson() {
  return <FileTypeIcon name="json" />;
}

function IconHtml() {
  return <FileTypeIcon name="html" />;
}

function IconRust() {
  return <FileTypeIcon name="rust" />;
}

function IconSwift() {
  return <FileTypeIcon name="swift" />;
}

function IconKotlin() {
  return <FileTypeIcon name="kotlin" />;
}

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
    TypeTable,
    File,
    Folder,
    Files,
    IconTypeScript,
    IconJson,
    IconHtml,
    IconRust,
    IconSwift,
    IconKotlin,
    Steps,
    Step,
    ...TabsComponents,
    ...components,
  } satisfies MDXComponents;
}
export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
