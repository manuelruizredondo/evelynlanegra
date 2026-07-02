import { defineConfig } from 'astro/config';

// Static site for Netlify. Trailing-slash + clean URLs.
// Nota: el sitemap se genera con scripts/gen-sitemap.mjs (postbuild), porque
// @astrojs/sitemap falla con esta config i18n (prefixDefaultLocale:false).
export default defineConfig({
  site: 'https://evelynlanegra.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'it'],
    routing: { prefixDefaultLocale: false },
  },
});