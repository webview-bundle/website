// Shared types for the reference generator. TypeDoc reflections are loosely
// typed here (`any`) — the generator reads a small, stable slice of the model.

export type LinkResolver = (label: string) => string | null;

export interface PackageTarget {
  name: string;
  slug: string;
  description: string;
  dir: string;
  entry: string;
  // A tsconfig on disk, or null when the package ships none (Deno packages use
  // deno.json) — convertPackage then writes a synthetic one.
  tsconfig: string | null;
}

export interface ExportGroup {
  name: string;
  slug: string;
  reflections: any[]; // same name, e.g. a `const` + its `type` (enum pattern)
  primaryKind: number; // best kind for sidebar grouping + index card
  summary: string; // plain-text lead for index cards + frontmatter
}

export interface TypeRow {
  type: string;
  description?: string;
  required?: boolean;
  default?: string;
  deprecated?: boolean;
  parameters?: { name: string; description: string }[];
  returns?: string;
}

export interface RenderCtx {
  link: LinkResolver; // resolve an export name to a relative page href
  sourceUrl: (reflection: any) => string | null;
  emittedSources: Set<string>; // dedupe "View source" links within one page
}
