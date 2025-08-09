// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const GITHUB_USER = 'lucas-kiozy';
const REPO_NAME = 'espaco-origens-site';

export default defineConfig({
  site: `https://${GITHUB_USER}.github.io`,
  base: `/${REPO_NAME}`, // caminho do projeto no Pages

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});
