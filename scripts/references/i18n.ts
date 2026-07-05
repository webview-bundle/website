// Localization for the generated reference docs.
//
// The generated API pages themselves are English (code and type signatures are
// language-neutral); what gets translated is the *sidebar structure* — the
// `---separator---` group labels in each `meta.json` / `meta.<locale>.json`.
//
// To add a language: add its code to `Locale` + `LOCALES`, then fill in the
// column for it in `LABELS`. Nothing else in the generator needs to change.
// Keep this list in sync with the site's own i18n (`src/lib/i18n.ts`).
import { ReflectionKind } from 'typedoc';

export type Locale = 'en' | 'ko';

// Default locale → `meta.json`; others → `meta.<locale>.json` (Fumadocs convention).
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALES: Locale[] = ['en', 'ko'];

// Every translatable label the generator emits into docs.
type LabelKey =
  | 'classes'
  | 'functions'
  | 'interfaces'
  | 'enumerations'
  | 'typeAliases'
  | 'variables'
  | 'remotes';

const LABELS: Record<LabelKey, Record<Locale, string>> = {
  classes: { en: 'Classes', ko: '클래스' },
  functions: { en: 'Functions', ko: '함수' },
  interfaces: { en: 'Interfaces', ko: '인터페이스' },
  enumerations: { en: 'Enumerations', ko: '열거형' },
  typeAliases: { en: 'Type Aliases', ko: '타입' },
  variables: { en: 'Variables', ko: '변수' },
  remotes: { en: 'Remotes', ko: '리모트' },
};

export function t(key: LabelKey, locale: Locale): string {
  return LABELS[key][locale];
}

// Export kinds in the order they appear in a package index and sidebar, each
// tied to its translatable label.
export const KIND_ORDER: { kind: number; label: LabelKey }[] = [
  { kind: ReflectionKind.Class, label: 'classes' },
  { kind: ReflectionKind.Function, label: 'functions' },
  { kind: ReflectionKind.Interface, label: 'interfaces' },
  { kind: ReflectionKind.Enum, label: 'enumerations' },
  { kind: ReflectionKind.TypeAlias, label: 'typeAliases' },
  { kind: ReflectionKind.Variable, label: 'variables' },
];

// Sort rank for a reflection kind (unknown kinds sort last).
export function kindRank(kind: number): number {
  const i = KIND_ORDER.findIndex(g => g.kind === kind);
  return i === -1 ? KIND_ORDER.length : i;
}

// Fumadocs meta filename for a locale.
export function metaFileName(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? 'meta.json' : `meta.${locale}.json`;
}
