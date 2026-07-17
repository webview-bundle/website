import { llms } from 'fumadocs-core/source';
import { docSource } from '../doc';
import type { Locale } from './i18n';

// `llms.txt` support — plain-text views of the docs for LLMs to read.
// See https://llmstxt.org and https://fumadocs.dev/docs/integrations/llms.
//
// Every entry point takes an explicit locale. This is load-bearing: on an i18n
// source, both `llms().index()` and `getPages()` fall back to *every* language
// when the locale is omitted, so `/llms.txt` would serve English and Korean
// concatenated. Passing the locale keeps each file in one language, matching the
// URL it is served from (`/llms.txt` → `/docs/...`, `/ko/llms.txt` → `/ko/docs/...`).
//
// Note that a locale only has its own pages where a translation exists: fumadocs
// falls back to the default language per page, so the Korean files list the
// English text for pages with no `.ko.mdx` — the same content `/ko/docs/...`
// renders.

type DocPage = (typeof docSource)['$inferPage'];

function plainText(body: string): Response {
  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}

/**
 * Render one page for an LLM: a `# Title (url)` header, the description, then
 * the page body as Markdown with the MDX components stripped out.
 */
export async function getLLMText(page: DocPage): Promise<string> {
  const { title, description } = page.data;
  const parts = [`# ${title} (${page.url})`];
  if (description != null && description !== '') {
    parts.push(description);
  }
  // Requires `includeProcessedMarkdown` (see source.config.ts).
  parts.push(await page.data.getText('processed'));
  return parts.join('\n\n');
}

/** `llms.txt` — an index of every page in `locale`, as a Markdown link list. */
export function llmsIndexResponse(locale: Locale): Response {
  return plainText(llms(docSource).index(locale));
}

/** `llms-full.txt` — the full text of every page in `locale`, concatenated. */
export async function llmsFullResponse(locale: Locale): Promise<Response> {
  const pages = await Promise.all(docSource.getPages(locale).map(getLLMText));
  return plainText(pages.join('\n\n'));
}
