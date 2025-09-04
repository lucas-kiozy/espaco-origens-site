// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://lucas-kiozy.github.io/espaco-origens-site",
  base: "/espaco-origens-site/",
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
