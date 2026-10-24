<template>
  <section 
    v-if="item" 
    ref="singleProjectPage" 
    class="row project-item-row">

    <!-- Banner -->
    <FloatingHeader 
      :p_expanded_data="item" 
      :p_height="'big'" 
      :p_dash_title="true" 
      :p_restricted="true">

      <!-- SES -->
      <div :style="sharedElementStyle" class="shared-element" ref="sharedElement"></div>
    </FloatingHeader>

    <!-- Metas donnees -->
    <div class="project-item-metas container">
      <ul class="metas-list">
        <ProjectMetaItem 
          v-for="(_, k) in item.metas" 
          :key="k" 
          :item="_"/>

        <li class="logo-client" v-if="!!item.clientLogo">
          <span class="img-wrapper">
            <img :src="`${item.clientLogo}`" alt="Client's logo">
          </span>
        </li>
      </ul>
    </div>

    <!-- The concept -->
    <div class="the-concept container">
      <ul class="actions" v-if="!!item.resolve">
        <li class="action-item">
          <a :href="item.resolve" target="_blank" class="btn btn-small">voir le site web</a>
        </li>

        <SocialLinks 
          :p_share_link="item.resolve" 
          :p_size="'small'" />
      </ul>

      <h4 class="title prefixed-text">{{ item.title }}, le concept</h4>

      <p class="description" v-html="item.concept"></p>
    </div>

    <!-- Project presentation -->
    <div class="report container">
      <!-- Title -->
      <h4 class="title prefixed-text">{{ item.report.title }}</h4>

      <!-- Description -->
      <p class="description">{{ item.report.description }}</p>

      <!-- Shoots -->
      <div 
        v-for="(_, k) in item.shoots" 
        :key="k" 
        class="shoot-item">

        <!-- Shood description -->
        <p class="shoot-description">{{ _.description }}</p>

        <!-- Shoot image -->
        <span class="img-wrapper shoot-media">
          <img :src="`${_.mediaURL}`" :alt="`Project shoot no ${k}`">
        </span>
      </div>
    </div>

    <!-- Adjacents projects -->
    <AdjacentProjects :p_center="item" />

    <!-- Contact form -->
    <Contact :p_step_indicator="false"></Contact>

    <!-- Footer -->
    <Foot />
  </section>
</template>

<script>
  import $ from 'jquery'
  import { mapGetters } from 'vuex'
  import { PROJECT_ITEM_DOMRECT_KEY } from '@@/illuminate/config'
  import { revealBannerExpandedTitle } from '@@/illuminate/utils'
  import FloatingHeader from '@/components/FloatingHeader'
  import ProjectMetaItem from '@/components/ProjectMetaItem'
  import SocialLinks from '@/components/SocialLinks'
  import Contact from '@/components/Contact'
  import Foot from '@/components/Foot'
  import AdjacentProjects from '@/components/AdjacentProjects'

  export default {
    name: 'ProjectItem',

    // Required components
    components: { FloatingHeader, ProjectMetaItem, SocialLinks, Contact, Foot, AdjacentProjects },

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

        // All projects
        'x_projects': 'projects/items',

        // Current visible section's path
        'x_project': 'projects/item',
      }),
    },

    // Watch
    watch: {

      // x_projects
      x_projects (val) {
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

      // Get item
      getItem () {
        // Fetch this slug project representation
        this.item = this.x_project(this.getRouterSlug())
      },

      // Process item
      processItem () {
        // Init sharing elements
        this.shareElements()

        // Add 'loaded' class
        setTimeout(() => {
          $(this.$refs['singleProjectPage']).addClass('loaded')
        }, 1000)
      },

      // shareElements
      shareElements () {
        this.sharedElementStyle = this.buildSharedElementStyle(this.getDomRect())
        this.animateSharedElements()
        revealBannerExpandedTitle()
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
        return JSON.parse(window.localStorage[PROJECT_ITEM_DOMRECT_KEY])
      },

      // Get this slug
      getRouterSlug () {
        return this.$router.history.current.params['slug']
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import './../../../assets/styles/components/project-single-item.scss';
</style>
