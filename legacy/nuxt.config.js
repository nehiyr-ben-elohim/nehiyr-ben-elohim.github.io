module.exports = {


  // Headers of the page
  head: {
    title: 'Jean-jacques AKAKPO',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'This is just another portfolio. Period.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },


  // CSS file
  css: [
    '@/assets/styles/main.scss'
  ],


  // Modules
  modules: [
    [ '@nuxtjs/google-analytics', { id: 'UA-104432529-1' } ],
  ],


  // Plugins
  plugins: [
    '@@/plugins/app.assets.js',
  ],


  // Customize the progress bar color
  loading: { color: '#000' },
  

  // Build configuration
  mode: 'spa',
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
