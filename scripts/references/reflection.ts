// Accessors over the TypeDoc in-memory reflection model: type/signature
// stringification and JSDoc-tag extraction. No MDX concerns here — these return
// plain strings, arrays, and booleans.
import { ReflectionKind } from 'typedoc';

// ---------------------------------------------------------------------------
// Type / signature stringification (reuses TypeDoc's Type#toString)
// ---------------------------------------------------------------------------

export function typeStr(type: any): string {
  const s = type?.toString?.();
  return s == null || s === '' ? 'unknown' : s;
}

// Collapse top-level object-type literals in a very long type string to `{ … }`.
// Pathological types — e.g. a Deno FFI `DynamicLibrary<{ …40 symbols… }>` — would
// otherwise render as a multi-line wall (and reflow unstably under formatting).
// Full detail stays available via the "View source" link.
export function collapseLongType(s: string, max = 200): string {
  if (s.length <= max) return s;
  let out = '';
  let depth = 0;
  for (const c of s) {
    if (c === '{') {
      if (depth === 0) out += '{ … }';
      depth++;
    } else if (c === '}') {
      if (depth > 0) depth--;
    } else if (depth === 0) {
      out += c;
    }
  }
  return out.length < s.length ? out : s;
}

// Type string for signatures and return values; collapses only pathological
// giant object literals. Type-alias definitions use full `typeStr` instead.
export function displayType(type: any): string {
  return collapseLongType(typeStr(type));
}

export function typeParamsStr(sig: any): string {
  const tps = sig?.typeParameters;
  if (tps == null || tps.length === 0) return '';
  const inner = tps
    .map((tp: any) => {
      let out = tp.name;
      if (tp.type != null) out += ` extends ${typeStr(tp.type)}`;
      if (tp.default != null) out += ` = ${typeStr(tp.default)}`;
      return out;
    })
    .join(', ');
  return `<${inner}>`;
}

export function paramStr(param: any): string {
  const rest = param.flags?.isRest === true ? '...' : '';
  const hasDefault = param.defaultValue != null;
  // A default already implies optionality, so don't also print `?`.
  const optional = hasDefault ? false : param.flags?.isOptional === true;
  let out = `${rest}${param.name}${optional ? '?' : ''}: ${typeStr(param.type)}`;
  if (hasDefault) out += ` = ${param.defaultValue}`;
  return out;
}

export function paramListStr(sig: any): string {
  return (sig.parameters ?? []).map(paramStr).join(', ');
}

// A method/property whose type is a function: `type.declaration.signatures`.
export function callSignaturesOf(reflection: any): any[] | null {
  if (Array.isArray(reflection?.signatures) && reflection.signatures.length > 0) {
    return reflection.signatures;
  }
  const decl = reflection?.type?.declaration;
  if (decl?.signatures != null && decl.signatures.length > 0) return decl.signatures;
  return null;
}

// Split an interface/class body into data properties and function members.
export function partitionMembers(children: any[]): { props: any[]; methods: any[] } {
  const props: any[] = [];
  const methods: any[] = [];
  for (const child of children) {
    if (child.kind === ReflectionKind.Constructor) continue;
    if (callSignaturesOf(child) != null) methods.push(child);
    else props.push(child);
  }
  return { props, methods };
}

// ---------------------------------------------------------------------------
// Comment / JSDoc tag extraction
// ---------------------------------------------------------------------------

// The comment that carries the docs for a reflection: functions/methods keep
// theirs on the call signature; everything else on the declaration.
export function commentOf(reflection: any): any {
  if (reflection?.comment != null) return reflection.comment;
  const sig = reflection?.signatures?.[0];
  return sig?.comment ?? null;
}

export function blockTags(comment: any, ...tags: string[]): any[] {
  const all = comment?.blockTags ?? [];
  return all.filter((t: any) => tags.includes(t.tag));
}

export function isDeprecated(comment: any): boolean {
  return blockTags(comment, '@deprecated').length > 0;
}

// The `@default` / `@defaultValue` value, unwrapped from any code fence TypeDoc
// stores it in and stripped of backticks (renders as plain text in TypeTable).
export function defaultTag(comment: any): string | undefined {
  const tag = blockTags(comment, '@default', '@defaultValue')[0];
  if (tag == null) return undefined;
  const raw = (tag.content ?? [])
    .map((c: any) => c.text)
    .join('')
    .trim()
    .replace(/^```[a-z]*\n?/i, '')
    .replace(/\n?```$/, '')
    .replace(/`+/g, '')
    .trim();
  return raw === '' ? undefined : raw;
}

// `@example` blocks, each already containing (or wrapped into) a code fence.
export function exampleBlocks(comment: any): string[] {
  return blockTags(comment, '@example').map(tag => {
    const body: string = (tag.content ?? [])
      .map((c: any) => c.text)
      .join('')
      .trim();
    if (body.includes('```')) return body;
    return `\`\`\`ts\n${body}\n\`\`\``;
  });
}
