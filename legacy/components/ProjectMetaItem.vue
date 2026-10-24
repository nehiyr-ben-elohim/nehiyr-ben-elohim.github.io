<template>
  <li class="details-item">
    <div class="details-item--title">
      <span>{{ item.title }}</span>
    </div>
    <div class="details-item--content">
      <span>{{ (typeof item.value === 'function') ? (item.value()) : (item.value) }}</span>
    </div>
  </li>
</template>

<script>
  export default {
    name: 'ProjectMetaItem',

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
    methods: {},
  }
</script>

<style lang='scss' scoped>
  @import './../assets/styles/components/project-meta-item.scss';
</style>
