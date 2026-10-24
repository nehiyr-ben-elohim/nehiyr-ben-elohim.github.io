<template>
  <div class="curstep-wrapper">
    <div class="curstep-inner">
      <h5 class="curstep-text dashed-text">{{ getText() }}</h5>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CurrentStep',

    // data
    data: () => ({}),

    // methods
    methods: {

      // getText
      getText () {
        return this.append.text
      },
    },

    // props
    props: {
      append: {
        type: Object,
        default: null
      }
    },
  }
</script>

<style lang='scss' scoped>
  @import './../assets/styles/components/curstep.scss';
</style>
