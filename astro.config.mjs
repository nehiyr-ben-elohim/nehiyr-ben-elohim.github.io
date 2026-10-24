// @ts-check
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://jeanjacquesakakpo.me',
  output: 'static',
  trailingSlash: 'ignore',
  vite: {
    css: {
      preprocessorOptions: {
        // legacy SCSS still uses @import; migrating to @use is out of scope
        scss: { silenceDeprecations: ['import'] },
      },
    },
  },
})
