<template>
  <div 
    class="articles-by-year">

    <!-- Group year -->
    <h6 class="group-year">{{ item.year }}</h6>

    <!-- Binded content -->
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'BlogArticleGroup',

    // Required components
    components: {},

    // data
    data: () => ({}),

    // Props
    props: {

      // Single item
      item: { type: Object, default: () => {}, required: true },
    },

    // Mounted
    mounted () {},

    // methods
    methods: {},
  }
</script>

<style lang='scss' scoped>
  @import './../assets/styles/components/blog-article-group.scss';
</style>
