// Per-kind page-body renderers: turn a TypeDoc reflection into the MDX sections
// (Signature / Parameters / Returns / Properties / Methods / Examples) and the
// Fumadocs <TypeTable> blocks.
import { ReflectionKind } from 'typedoc';
import { plainParts, renderParts, tableText } from './mdx.ts';
import {
  blockTags,
  callSignaturesOf,
  commentOf,
  defaultTag,
  displayType,
  exampleBlocks,
  isDeprecated,
  paramListStr,
  partitionMembers,
  typeParamsStr,
  typeStr,
} from './reflection.ts';
import type { RenderCtx, TypeRow } from './types.ts';

// ---------------------------------------------------------------------------
// <TypeTable> emission
// ---------------------------------------------------------------------------

// JSON is valid JS, so `<TypeTable type={ {...} } />` embeds cleanly in MDX.
function typeTable(rows: Record<string, TypeRow>): string {
  const clean: Record<string, TypeRow> = {};
  for (const [name, row] of Object.entries(rows)) {
    const entry: TypeRow = { type: row.type };
    if (row.description != null && row.description !== '') entry.description = row.description;
    if (row.required != null) entry.required = row.required;
    if (row.default != null && row.default !== '') entry.default = row.default;
    if (row.deprecated === true) entry.deprecated = true;
    if (row.parameters != null && row.parameters.length > 0) entry.parameters = row.parameters;
    if (row.returns != null && row.returns !== '') entry.returns = row.returns;
    clean[name] = entry;
  }
  return `<TypeTable type={${JSON.stringify(clean)}} />`;
}

// A row for a function-typed member (interface method, class method, API field).
// `member` carries the declaration flags (optionality, deprecation); `sig` is
// its call signature.
function methodRow(member: any, sig: any): TypeRow {
  const comment = sig.comment ?? commentOf(member) ?? {};
  const params = (sig.parameters ?? []).map((p: any) => {
    const desc = tableText(p.comment?.summary);
    const typeText = typeStr(p.type);
    const name = `${p.name}${p.flags?.isOptional === true ? '?' : ''}`;
    return { name, description: desc === '' ? typeText : `${typeText} — ${desc}` };
  });
  const returnsTag = tableText(blockTags(comment, '@returns', '@return')[0]?.content);
  const retType = displayType(sig.type);
  return {
    type: `(${paramListStr(sig)}) => ${retType}`,
    description: tableText(comment.summary),
    required: member.flags?.isOptional !== true,
    deprecated: isDeprecated(commentOf(member) ?? sig.comment),
    parameters: params,
    returns: returnsTag === '' ? retType : `${retType} — ${returnsTag}`,
  };
}

// ---------------------------------------------------------------------------
// Shared sections
// ---------------------------------------------------------------------------

function sourceLine(reflection: any, ctx: RenderCtx): string {
  const url = ctx.sourceUrl(reflection);
  if (url == null || ctx.emittedSources.has(url)) return '';
  ctx.emittedSources.add(url);
  // A plain link on its own line — the formatter leaves standalone links intact.
  return `[View source ↗](${url})\n\n`;
}

function deprecatedCallout(comment: any, ctx: RenderCtx): string {
  const tags = blockTags(comment, '@deprecated');
  if (tags.length === 0) return '';
  const note = renderParts(tags[0].content, ctx.link);
  return `<Callout type="warn">Deprecated${note === '' ? '' : ` — ${note}`}</Callout>\n\n`;
}

// Lead prose shared by every page: summary + @remarks + @deprecated.
function leadBody(comment: any, ctx: RenderCtx): string {
  let out = '';
  out += deprecatedCallout(comment, ctx);
  const summary = renderParts(comment?.summary, ctx.link);
  if (summary !== '') out += `${summary}\n\n`;
  for (const remark of blockTags(comment, '@remarks')) {
    const text = renderParts(remark.content, ctx.link);
    if (text !== '') out += `${text}\n\n`;
  }
  return out;
}

function examplesSection(comment: any): string {
  const blocks = exampleBlocks(comment);
  if (blocks.length === 0) return '';
  return `## Examples\n\n${blocks.join('\n\n')}\n\n`;
}

// An `## Examples` section gathering the type-level examples plus each member's
// examples under a `### member` subheading — the compact <TypeTable> for methods
// has nowhere to show @example, so they would otherwise be lost.
function memberExamplesSection(reflection: any): string {
  const children = reflection.children ?? reflection.type?.declaration?.children ?? [];
  const top = exampleBlocks(commentOf(reflection));
  const perMember: { name: string; blocks: string[] }[] = [];
  for (const m of children) {
    const comments = new Set<any>();
    if (m.comment != null) comments.add(m.comment);
    for (const sig of callSignaturesOf(m) ?? []) if (sig.comment != null) comments.add(sig.comment);
    const blocks: string[] = [];
    for (const c of comments) blocks.push(...exampleBlocks(c));
    if (blocks.length > 0) {
      perMember.push({
        name: m.kind === ReflectionKind.Constructor ? 'constructor' : m.name,
        blocks,
      });
    }
  }
  if (top.length === 0 && perMember.length === 0) return '';
  let out = '## Examples\n\n';
  if (top.length > 0) out += `${top.join('\n\n')}\n\n`;
  for (const g of perMember) out += `### ${g.name}\n\n${g.blocks.join('\n\n')}\n\n`;
  return out;
}

// Render an interface/class/type's index signatures (`[key: K]: V`) as a code
// block — TypeDoc keeps these off `children`, so they are otherwise dropped.
function indexSignatureSection(sigs: any[] | undefined): string {
  if (sigs == null || sigs.length === 0) return '';
  const lines = sigs.map((s: any) => {
    const p = s.parameters?.[0];
    return `[${p?.name ?? 'key'}: ${typeStr(p?.type)}]: ${typeStr(s.type)};`;
  });
  return `## Index Signature\n\n\`\`\`ts\n${lines.join('\n')}\n\`\`\`\n\n`;
}

// Parameters + Returns for a single call signature.
function signatureDetail(sig: any, ctx: RenderCtx): string {
  let out = '';
  const params = sig.parameters ?? [];
  if (params.length > 0) {
    const rows: Record<string, TypeRow> = {};
    for (const p of params) {
      rows[p.name] = {
        type: typeStr(p.type),
        description: tableText(p.comment?.summary),
        required: p.flags?.isOptional !== true && p.defaultValue == null,
        default: p.defaultValue ?? undefined,
      };
    }
    out += `## Parameters\n\n${typeTable(rows)}\n\n`;
  }
  const retType = displayType(sig.type);
  const returnsDesc = renderParts(
    blockTags(sig.comment, '@returns', '@return')[0]?.content,
    ctx.link
  );
  out += `## Returns\n\n\`${retType}\`${returnsDesc === '' ? '' : ` — ${returnsDesc}`}\n\n`;
  return out;
}

function propertiesSection(props: any[], heading = 'Properties'): string {
  if (props.length === 0) return '';
  const rows: Record<string, TypeRow> = {};
  for (const p of props) {
    const comment = commentOf(p) ?? {};
    const gs = p.getSignature; // accessor
    const type = gs != null ? typeStr(gs.type) : typeStr(p.type);
    const flags: string[] = [];
    if (p.flags?.isStatic === true) flags.push('static');
    if (p.flags?.isReadonly === true) flags.push('readonly');
    const label = flags.length > 0 ? `${flags.join(' ')} ${type}` : type;
    rows[p.name] = {
      type: label,
      description: tableText((gs?.comment ?? comment).summary),
      required: p.flags?.isOptional !== true,
      default: defaultTag(comment),
      deprecated: isDeprecated(comment),
    };
  }
  return `## ${heading}\n\n${typeTable(rows)}\n\n`;
}

function methodsSection(methods: any[], heading = 'Methods'): string {
  if (methods.length === 0) return '';
  const rows: Record<string, TypeRow> = {};
  for (const m of methods) {
    const sig = (callSignaturesOf(m) ?? [])[0];
    if (sig == null) continue;
    rows[m.name] = methodRow(m, sig);
  }
  return `## ${heading}\n\n${typeTable(rows)}\n\n`;
}

// ---------------------------------------------------------------------------
// Per-kind renderers
// ---------------------------------------------------------------------------

function renderFunction(reflection: any, ctx: RenderCtx): string {
  let out = '';
  const sigs = reflection.signatures ?? [];
  out += leadBody(commentOf(reflection), ctx);
  out += sourceLine(reflection, ctx);
  sigs.forEach((sig: any, i: number) => {
    if (sigs.length > 1) out += `## Overload ${i + 1}\n\n`;
    out += `\`\`\`ts\nfunction ${reflection.name}${typeParamsStr(sig)}(${paramListStr(sig)}): ${displayType(sig.type)};\n\`\`\`\n\n`;
    // leadBody already printed signatures[0]'s summary; only add per-overload
    // summaries for the later overloads (i > 0) to avoid duplicating it.
    if (sigs.length > 1 && i > 0) {
      const s = renderParts(sig.comment?.summary, ctx.link);
      if (s !== '') out += `${s}\n\n`;
    }
    out += signatureDetail(sig, ctx);
    out += examplesSection(sig.comment);
  });
  return out;
}

function renderInterface(reflection: any, ctx: RenderCtx): string {
  let out = leadBody(commentOf(reflection), ctx);
  out += sourceLine(reflection, ctx);
  const extended = (reflection.extendedTypes ?? []).map((t: any) => `\`${typeStr(t)}\``);
  if (extended.length > 0) out += `**Extends:** ${extended.join(', ')}\n\n`;
  const { props, methods } = partitionMembers(reflection.children ?? []);
  out += propertiesSection(props);
  out += methodsSection(methods);
  out += indexSignatureSection(reflection.indexSignatures);
  out += memberExamplesSection(reflection);
  return out;
}

function renderClass(reflection: any, ctx: RenderCtx): string {
  let out = leadBody(commentOf(reflection), ctx);
  out += sourceLine(reflection, ctx);
  const extended = (reflection.extendedTypes ?? []).map((t: any) => `\`${typeStr(t)}\``);
  if (extended.length > 0) out += `**Extends:** ${extended.join(', ')}\n\n`;

  const children = reflection.children ?? [];
  const ctor = children.find((c: any) => c.kind === ReflectionKind.Constructor);
  if (ctor != null) {
    const sig = ctor.signatures?.[0];
    if (sig != null) {
      out += `## Constructor\n\n\`\`\`ts\nnew ${reflection.name}${typeParamsStr(sig)}(${paramListStr(sig)});\n\`\`\`\n\n`;
      const params = sig.parameters ?? [];
      if (params.length > 0) {
        const rows: Record<string, TypeRow> = {};
        for (const p of params) {
          rows[p.name] = {
            type: typeStr(p.type),
            description: tableText(p.comment?.summary),
            required: p.flags?.isOptional !== true && p.defaultValue == null,
            default: p.defaultValue ?? undefined,
          };
        }
        out += `${typeTable(rows)}\n\n`;
      }
    }
  }

  const { props, methods } = partitionMembers(children);
  out += propertiesSection(props);
  out += methodsSection(methods);
  out += indexSignatureSection(reflection.indexSignatures);
  out += memberExamplesSection(reflection);
  return out;
}

function renderEnum(reflection: any, ctx: RenderCtx): string {
  let out = leadBody(commentOf(reflection), ctx);
  out += sourceLine(reflection, ctx);
  const rows: Record<string, TypeRow> = {};
  for (const member of reflection.children ?? []) {
    rows[member.name] = {
      type: typeStr(member.type),
      description: plainParts(commentOf(member)?.summary),
      required: true,
    };
  }
  out += `## Members\n\n${typeTable(rows)}\n\n`;
  return out;
}

function renderTypeAlias(reflection: any, ctx: RenderCtx): string {
  let out = leadBody(commentOf(reflection), ctx);
  out += sourceLine(reflection, ctx);
  // Object-like type literal → show its members as a table too.
  const decl = reflection.type?.declaration;
  out += `## Type\n\n\`\`\`ts\ntype ${reflection.name}${typeParamsStr({ typeParameters: reflection.typeParameters })} = ${typeStr(reflection.type)};\n\`\`\`\n\n`;
  if (decl?.children != null && decl.children.length > 0) {
    const { props, methods } = partitionMembers(decl.children);
    out += propertiesSection(props);
    out += methodsSection(methods);
  }
  out += indexSignatureSection(decl?.indexSignatures);
  out += examplesSection(commentOf(reflection));
  return out;
}

function renderVariable(reflection: any, ctx: RenderCtx): string {
  let out = leadBody(commentOf(reflection), ctx);
  out += sourceLine(reflection, ctx);
  const decl = reflection.type?.declaration;
  if (decl?.signatures != null && decl.signatures.length > 0) {
    // Function-typed const (arrow function): render like a function.
    for (const sig of decl.signatures) {
      out += `\`\`\`ts\nconst ${reflection.name}: ${typeParamsStr(sig)}(${paramListStr(sig)}) => ${displayType(sig.type)};\n\`\`\`\n\n`;
      out += signatureDetail(sig, ctx);
      out += examplesSection(sig.comment);
    }
    return out;
  }
  if (decl?.children != null && decl.children.length > 0) {
    // Inline object literal (e.g. `platform`, an enum-like const): tabulate it.
    const { props, methods } = partitionMembers(decl.children);
    out += propertiesSection(props);
    out += methodsSection(methods);
    out += indexSignatureSection(decl.indexSignatures);
    out += memberExamplesSection(reflection);
    return out;
  }
  // Typed by a named export (e.g. `const remote: RemoteApi`, or a `typeof fn`
  // alias): link across to that export's page.
  const type = typeStr(reflection.type);
  const targetName = reflection.type?.name ?? reflection.type?.queryType?.name;
  const href = targetName != null ? ctx.link(targetName) : null;
  out +=
    href == null
      ? `**Type:** \`${type}\`\n\n`
      : `**Type:** [\`${type}\`](${href})\n\nSee [\`${type}\`](${href}) for the full member list.\n\n`;
  out += examplesSection(commentOf(reflection));
  return out;
}

export function renderReflection(reflection: any, ctx: RenderCtx): string {
  switch (reflection.kind) {
    case ReflectionKind.Function:
      return renderFunction(reflection, ctx);
    case ReflectionKind.Interface:
      return renderInterface(reflection, ctx);
    case ReflectionKind.Class:
      return renderClass(reflection, ctx);
    case ReflectionKind.Enum:
      return renderEnum(reflection, ctx);
    case ReflectionKind.TypeAlias:
      return renderTypeAlias(reflection, ctx);
    case ReflectionKind.Variable:
      return renderVariable(reflection, ctx);
    default:
      return leadBody(commentOf(reflection), ctx) + sourceLine(reflection, ctx);
  }
}
