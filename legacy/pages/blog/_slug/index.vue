<template>
  <section 
    v-if="item" 
    ref="singleArticlePage" 
    class="row article-item-row">

    <!-- Banner -->
    <FloatingHeader 
      :p_height="'small'" 
      :p_restricted="true" />

    <section class="article-content">
      <!-- Headings -->
      <div class="article-headings">
        <div class="article-headings-inner container">
          <div class="article-headings-1">
            <!-- Article title -->
            <h1 class="article-title">{{ item.title }}</h1>
          </div>

          <div class="article-headings-2">
            <!-- Scope -->
            <h5 class="article-scope">{{ item.type }}</h5>

            <!-- Date -->
            <h5 class="article-finishedAt">{{ getFormattedDate(item.finishedAt) }}</h5>
          </div>
        </div>
      </div>

      <!-- Banner and reader -->
      <div class="article-banner">
        <div class="article-media-wrapper">
          <!-- SES -->
          <div :style="sharedElementStyle" class="shared-element" ref="sharedElement"></div>
          <!-- <div :style="{ 'background-image': `url(${item.mediaURL})` }" class="article-media"></div> -->
        </div>

        <!-- Read on Medium -->
        <a :href="item.resolve" title="Read on Medium" class="read-on">Read on Medium</a>
      </div>
    </section>

    <!-- Contact form -->
    <Contact :p_step_indicator="false"></Contact>

    <!-- Footer -->
    <Foot />
  </section>
</template>

<script>
  import $ from 'jquery'
  import { mapGetters } from 'vuex'
  import { ARTICLE_ITEM_DOMRECT_KEY } from '@@/illuminate/config'
  import { getFormattedDate } from '@@/illuminate/utils'
  import FloatingHeader from '@/components/FloatingHeader'
  import Contact from '@/components/Contact'
  import Foot from '@/components/Foot'

  export default {
    name: 'BlogArticle',

    // Required components
    components: { FloatingHeader, Contact, Foot },

    // data
    data: () => ({

      // Item
      item: null,

      // Shared element
      sharedElementStyle: {},
    }),

    // computed
    computed: {
      ...mapGetters({

        // All activities
        'x_activities': 'activities/items',

        // Single activity
        'x_activity': 'activities/item',
      }),
    },

    // Watch
    watch: {

      // x_activities
      x_activities (val) {
        if (val.length) {
          this.getItem()
          this.processItem()
        }
      },
    },

    // created
    created () {
      this.getItem()
    },

    // mounted
    mounted () {
      if (this.item) {
        this.processItem()
      }
    },

    // props
    props: {},

    // methods
    methods: {

      // getFormattedDate
      getFormattedDate (date) {
        return getFormattedDate(date)
      },

      // Get item
      getItem () {
        // Fetch this slug activity representation
        this.item = this.x_activity(this.getRouterSlug())
      },

      // Process item
      processItem () {
        // Init sharing elements
        this.shareElements()
      },

      // shareElements
      shareElements () {
        this.sharedElementStyle = this.buildSharedElementStyle(this.getDomRect())
        this.animateSharedElements()
      },

      // animateSharedElements
      animateSharedElements () {
        const fn = () => {
          const $sharedElement = $(this.$refs['sharedElement'])

          $sharedElement.animate({
            'left': '0',
            'top': '0',
            'right': '0',
            'bottom': '0',
            'width': '100%',
            'height': '100%',
          }, 450, 'easeOutQuint')
        }

        setTimeout(fn, 350)
      },

      // buildSharedElementStyle
      buildSharedElementStyle (domRect) {
        return {
          'position': `absolute`,
          'z-index': `1`,
          'display': `inline-flex`,
          'justify-content': `center`,
          'align-items': `center`,
          'background-color': `transparent`,
          'background-image': `url(${this.item.mediaURL})`,
          'background-size': `cover`,
          'background-position': `center`,
          'overflow': `hidden`,
          'top': `${domRect.top}px`,
          'left': `${domRect.left}px`,
          'width': `${domRect.width}px`,
          'height': `${domRect.height}px`,
        }
      },

      // Get this docRect
      getDomRect () {
        return JSON.parse(window.localStorage[ARTICLE_ITEM_DOMRECT_KEY])
      },

      // Get this slug
      getRouterSlug () {
        return this.$router.history.current.params['slug']
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import './../../../assets/styles/components/article-single-item.scss';
</style>
