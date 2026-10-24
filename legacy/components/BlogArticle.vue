<template>
  <article 
    :style="{ width: getWidth() }" 
    :ref="item.slug()" 
    class="blog-article-item">
    <div 
      :style="{ 'background-image': `url(${item.mediaURL})` }" 
      class="blog-article--inner">
      <a 
        @click.prevent.stop="loadItem" 
        :href="item.link()">
        <h3 class="blog-article--title">{{ item.title.toLowerCase() }}</h3>
      </a>
    </div>
  </article>
</template>

<script>
  import $ from 'jquery'
  import { persistDomRect, sweepScreen } from '@@/illuminate/utils'
  import { PROJECT_ITEM_DOMRECT_KEY, ARTICLE_ITEM_DOMRECT_KEY } from '@@/illuminate/config'

  export default {
    name: 'BlogArticle',

    // Required components
    components: {},

    // data
    data: () => ({}),

    // Props
    props: {

      // Single item
      item: { type: Object, default: () => {}, required: true },
    },

    // methods
    methods: {

      // loadItem
      loadItem () {
        const $designated = $(this.$refs[this.item.slug()])

        $designated.css({ 'z-index': '101' })

        persistDomRect((this.item.activityType === 'PROJECT') ? (PROJECT_ITEM_DOMRECT_KEY) : (ARTICLE_ITEM_DOMRECT_KEY), $designated).then(() => {
          sweepScreen().then(() => {
            this.$router.push({ path: this.item.link() })
          })
        })
      },

      // getWidth
      getWidth () {
        return (this.item.layout.x * $(document).width() / 100) * 0.75 + 'px'
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import './../assets/styles/components/blog-article.scss';
</style>
