import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cambia `site` por el dominio final antes de publicar (Open Graph y sitemap).
export default defineConfig({
  site: 'https://myelitehealth.com',
  output: 'static',
  integrations: [sitemap()],
});
