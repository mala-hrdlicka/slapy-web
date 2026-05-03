import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

export default defineConfig({
  // 1. ZÁKLADNÍ NASTAVENÍ (včetně tvé ostré domény pro sitemapu)
  site: 'https://slapy-hrdlicka.cz',
  output: 'server',

  // 2. ADAPTÉR (nastavení pro Netlify)
  adapter: netlify({
    imageCDN: false, // Vypnutí Netlify Image CDN pro lepší kompatibilitu
  }),

  // 3. INTEGRACE (všechny hezky pohromadě)
  integrations: [
    react(),
    keystatic({
      // Všimni si: tady máš nastavenou adminPath na '/admin', ne '/keystatic'
      adminPath: '/admin',
      configFile: './keystatic.config.ts',
    }),
    sitemap({
      // Odfiltrujeme cestu k administraci. Protože máš nahoře adminPath: '/admin',
      // musíme filtrovat '/admin' (a raději i '/keystatic', kdyby se něco generovalo přes API)
      filter: (page) => !(page.includes('/admin') || page.includes('/keystatic')),
    }),
  ],

  // 4. OBRÁZKY A BUILD (vynucení Sharp servisy)
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  build: {
    inlineStylesheets: 'auto',
  },

  // 5. VITE A SERVER
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    port: 3000,
  },
});
