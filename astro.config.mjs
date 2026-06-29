import { defineConfig } from 'astro/config';

// Static site for Netlify. Trailing-slash + clean URLs.
export default defineConfig({
  site: 'https://lanegrasalsa.netlify.app',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
