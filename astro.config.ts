import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://samuelsorial.com',
  output: 'static',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/archive/') && !page.endsWith('/blog/') && !page.includes('/tags/') })],
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
