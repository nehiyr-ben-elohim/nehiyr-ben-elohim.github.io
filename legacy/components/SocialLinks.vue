<template>
  <ul 
    :class="`size-${p_size}`" 
    class="social-links">

    <!-- Profile links -->
    <li 
      v-if="!p_share_link" 
      v-for="_ in socialProfiles"
      class="social-link-wrapper dashed-text no-rotate-dash">
      <a 
        :href="_.resolve" 
        class="social-link" 
        target="_blank">
        <img :src="`${_.mediaURL}`" :title="_.title" class="social-link-media">
      </a>
    </li>

    <!-- Links for sharing -->
    <li 
      v-if="p_share_link" 
      v-for="_ in socialSharing"
      class="social-link-wrapper dashed-text no-rotate-dash">
      <a 
        :href="`${_.baseURI}${p_share_link}`" 
        class="social-link" 
        target="_blank">
        <img :src="`${_.mediaURL}`" :title="_.title" class="social-link-media">
      </a>
    </li>
  </ul>
</template>

<script>
  import { APP_URL, PROJECT_SHARE_STARTER } from '@@/illuminate/config'

  export default {
    name: 'SocialLinks',

    // Components
    components: {},

    // data
    data: () => ({

      // Social links for my profile
      socialProfiles: [
        {
          resolve: 'https://twitter.com/AkakpoJacques',
          mediaURL: '/img/brands/twitter.svg',
          title: 'Follow me on Twitter'
        },
        {
          resolve: 'https://www.linkedin.com/in/jeanjacques-akakpo',
          mediaURL: '/img/brands/linkedin.svg',
          title: 'Connect with me on LinkedIn'
        },
        {
          resolve: 'skype:jeanjacques.akakpo?userinfo',
          mediaURL: '/img/brands/skype.svg',
          title: 'Call me on Skype'
        },
        {
          resolve: 'https://github.com/phareal',
          mediaURL: '/img/brands/github.svg',
          title: 'Join me on GitHub'
        }
      ],

      // Social links for sharing
      socialSharing: [
        {
          baseURI: `https://www.facebook.com/sharer/sharer.php?u=`,
          mediaURL: '/img/brands/facebook.svg',
          title: 'Share on Facebook'
        },
        {
          baseURI: `https://twitter.com/home?status=${PROJECT_SHARE_STARTER}`,
          mediaURL: '/img/brands/twitter.svg',
          title: 'Share on Twitter'
        },
        {
          baseURI: `https://www.linkedin.com/shareArticle?mini=true&title=&summary=${PROJECT_SHARE_STARTER}&source=${APP_URL}&url=`,
          mediaURL: '/img/brands/linkedin.svg',
          title: 'Post on LinkedIn'
        },
        {
          baseURI: `whatsapp://send?text=${PROJECT_SHARE_STARTER}`,
          mediaURL: '/img/brands/whatsapp.svg',
          action: `share/whatsapp/share`,
          title: 'Share on WhatsApp'
        },
        {
          baseURI: `https://telegram.me/share/url?text=${PROJECT_SHARE_STARTER}&url=`,
          action: `share/telegram/share`,
          mediaURL: '/img/brands/telegram.svg',
          title: 'Share on Telegram'
        },
      ],
    }),

    // props
    props: {

      // p_size
      p_size: { type: String, default: 'big', required: false },

      // p_share_link
      p_share_link: { type: String, default: '', required: false },
    },

    // watch
    watch: {},

    // computed
    computed: {},

    // methods
    methods: {

      // Resolve social link
      shareVia (item) {
        console.log(`Share link : ${this.p_share_link} via ${item.baseURI}`)
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import './../assets/styles/components/social-links.scss';
</style>
