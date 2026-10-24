<template>
  <div class="nextstep-wrapper">
    <div 
      :class="{'animated': animateNextStep()}"
      class="nextstep-inner"
      >
      <h5 class="nextstep-text">{{ getText() }}</h5>
      <i class="material-icons nextstep-icon">arrow_downward</i>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NextStep',

    // data
    data: () => ({}),

    // methods
    methods: {

      // getText
      getText () {
        return this.append.text
      },

      // animateNextStep
      animateNextStep () {
        return this.append.show
      },
    },

    // props
    props: {
      append: { type: Object, default: null },
    },
  }
</script>

<style lang='scss' scoped>
  @import './../assets/styles/components/nextstep.scss';
</style>
