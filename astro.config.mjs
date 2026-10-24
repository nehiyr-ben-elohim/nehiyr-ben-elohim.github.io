// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://jeanjacquesakakpo.me',
  output: 'static',
  trailingSlash: 'ignore',
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
