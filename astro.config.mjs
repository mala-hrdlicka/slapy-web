import { defineConfig, passthroughImageService } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://slapy-hrdlicka.cz',

  output: 'server',
  adapter: netlify({
    // 🆕 KRITICKÉ: vypnout Netlify Image CDN
    imageCDN: false,
  }),

  // 🆕 Vynutit Sharp jako image service
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },

  server: {
    port: 3000,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    keystatic({
      adminPath: '/admin',
      configFile: './keystatic.config.ts',
    }),
    sitemap(),
  ],
});
