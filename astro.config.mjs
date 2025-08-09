// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://lucas-kiozy.github.io',
  base: '/espaco-origens-site', // caminho do repositório no Pages
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
