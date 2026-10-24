// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://nehiyr-ben-elohim.github.io',
  output: 'static',
  // URLs without trailing slash: emit /x.html, served as /x
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
})
