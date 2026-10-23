import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins/rehype-code';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import { codeIcons } from './src/lib/code-icons';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    // Export each page's processed Markdown (as `_markdown`), which
    // `page.data.getText('processed')` reads to build the `/llms.txt` routes.
    // The `'raw'` alternative is not usable here: it reads the `.mdx` file from
    // disk at request time, and the Worker has no filesystem.
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      inline: 'tailing-curly-colon',
      icon: { extend: codeIcons },
    },
  },
});
