// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://jeanjacquesakakpo.me',
  output: 'static',
  // historical URLs have no trailing slash: emit /x.html, served as /x
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  vite: {
    css: {
      preprocessorOptions: {
        // legacy SCSS still uses @import; migrating to @use is out of scope
        scss: { silenceDeprecations: ['import', 'slash-div'] },
      },
    },
  },
})
