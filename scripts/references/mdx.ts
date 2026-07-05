// MDX text helpers: escaping for MDX/JSX/YAML contexts, frontmatter assembly,
// and rendering TypeDoc comment "display parts" into MDX prose or plain text.
import type { LinkResolver } from './types.ts';

// Escape the characters MDX treats as JSX/expression syntax, but leave inline
// code spans (`...`) untouched so type-y text like `Promise<T>` renders as-is.
// Entities render identically, so this is visually lossless.
export function escapeMdxText(input: string): string {
  return input
    .split(/(`[^`]*`)/g)
    .map((part, i) => {
      if (i % 2 === 1) return part; // inside a `...` span
      return part
        .replace(/[{}]/g, m => `\\${m}`)
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    })
    .join('');
}

// Single-quoted YAML scalar for frontmatter.
export function yamlQuote(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

// Escape a plain string for use inside a double-quoted JSX/HTML attribute.
export function htmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/[{}]/g, '');
}

// A short, plain-text description for frontmatter/cards: first sentence, no
// markdown, no brackets. A summary that is only a bullet list has no single
// sentence to lift, so fall back rather than quoting one list item.
export function frontmatterDescription(text: string, fallback: string): string {
  const firstLine = text.trimStart().split(/\r?\n/)[0] ?? '';
  if (/^[-*]\s/.test(firstLine)) return fallback;
  const flat = text
    .replace(/`+/g, '')
    .replace(/\[|\]/g, '') // drop stray markdown reference brackets
    .replace(/^[\s>*-]+/, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (flat === '') return fallback;
  const firstSentence = flat.split(/(?<=[.!?])\s/)[0] ?? flat;
  const clipped = firstSentence.length > 160 ? `${firstSentence.slice(0, 157)}…` : firstSentence;
  return clipped;
}

export function frontmatter(title: string, description: string): string {
  return [
    '---',
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description)}`,
    '---',
    '',
  ].join('\n');
}

// Resolve Markdown shortcut references — `[`Name`]` / `[Name]` with no
// destination — the same way `{@link Name}` is handled: link to Name's page
// when it is an export, else drop the brackets and keep inline code. Real
// links `[text](url)` and reference links `[text][id]` are left untouched.
export function resolveShortcutRefs(text: string, link: LinkResolver): string {
  return text.replace(/\[`?([A-Za-z_$][\w.$]*)`?\](?!\(|\[|:)/g, (_m, name) => {
    const href = link(name);
    return href == null ? `\`${name}\`` : `[\`${name}\`](${href})`;
  });
}

// Render a TypeDoc comment `summary` (array of display parts) to MDX prose,
// turning `{@link X}` into a link when X is an export on the same package.
export function renderParts(parts: any[] | undefined, link: LinkResolver): string {
  if (parts == null) return '';
  const joined = parts
    .map(part => {
      if (part.kind === 'inline-tag' && (part.tag === '@link' || part.tag === '@linkcode')) {
        const label = String(part.text ?? '').trim();
        const href = link(label);
        return href == null ? `\`${label}\`` : `[\`${label}\`](${href})`;
      }
      if (part.kind === 'code') return part.text; // already fenced/backticked
      return escapeMdxText(String(part.text ?? ''));
    })
    .join('');
  // Resolve shortcut refs on the joined string — TypeDoc splits `[`X`]` into a
  // `[` text part, a `X` code part, and a `]` text part, so this only matches
  // once the parts are back together.
  return resolveShortcutRefs(joined, link).trim();
}

// Plain text of a comment summary (no MDX escaping) — for TypeTable field
// values, which render as React text nodes, and for frontmatter.
export function plainParts(parts: any[] | undefined): string {
  if (parts == null) return '';
  return parts
    .map(part => (part.kind === 'inline-tag' ? String(part.text ?? '') : String(part.text ?? '')))
    .join('')
    .trim();
}

// Clean single-line text for <TypeTable> string fields. TypeTable renders
// description/returns/default/parameter text as raw React children (no Markdown
// pass), so strip inline code backticks and reference brackets, and flatten
// bullet lists and newlines into one readable line.
export function tableText(parts: any[] | undefined): string {
  return plainParts(parts)
    .replace(/\[`?([A-Za-z_$][\w.$]*)`?\](?!\(|\[|:)/g, '$1') // shortcut refs → bare name
    .replace(/`+/g, '')
    .replace(/\r?\n[ \t]*[-*]\s+/g, '; ') // bullet items → "; "
    .replace(/^[ \t]*[-*]\s+/, '') // leading bullet
    .replace(/\r?\n+/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim();
}
