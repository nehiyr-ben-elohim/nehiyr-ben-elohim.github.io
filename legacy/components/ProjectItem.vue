<template>
  <article 
    v-if="p_item" 
    :id="p_item.slug()" 
    :class="{ 'project-item-mini': p_mini }" 
    class="project-item">
    <a 
      class="project-item-link" 
      @click.prevent.stop="loadProject(p_item)" 
      :href="p_item.link()">
      <span class="img-wrapper">
        <img src="" alt="" :style="{ 'background-image': `url(${p_item.mediaURL})` }" class="img-fluid project-item--image">
      </span>
      <div class="project-item-inner">
        <p class="project-item-desc">{{ p_item.description }}</p>
        <div class="project-item-footer">
          <p class="project-item-techs">{{ p_item.techs.join(', ') }}</p>
          <header class="project-item-name dashed-text">{{ p_item.title }}</header>
        </div>
      </div>
    </a>
  </article>
</template>

<script>
  import $ from 'jquery'
  import { persistDomRect } from '@@/illuminate/utils'
  import { PROJECT_ITEM_DOMRECT_KEY } from '@@/illuminate/config'

  export default {
    name: 'ProjectItem',

    // Required components
    components: {},

    // data
    data: () => ({}),

    // computed
    computed: {},

    // created
    created () {},

    // mounted
    mounted () {},

    // props
    props: {

      // Item
      p_item: { type: Object, default: () => {}, required: false },

      // Minimal version
      p_mini: { type: Boolean, default: false, required: false },
    },

    // methods
    methods: {

      // loadProject
      loadProject (item) {
        persistDomRect(PROJECT_ITEM_DOMRECT_KEY, $('.project-item#' + item.slug()).find('.img-wrapper')).then(() => {
          this.$router.push({ path: item.link() })
        })
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import './../assets/styles/components/project-item.scss';
</style>
