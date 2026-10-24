<template>
  <div class="vplayer-container" v-if="isActivated()">
    <video :src="getMediaURL()" autoplay="true" muted="true" loop="infinite"></video>

    <div class="vplayer-overlay"></div>
  </div>
</template>

<script>
  export default {
    name: 'VPlayer',

    // data
    data: () => ({}),

    // props
    props: {
      append: { type: Object, default: null },
    },

    // methods
    methods: {

      // getMediaURL
      getMediaURL () {
        return this.append.URL
      },

      // isActivated
      isActivated () {
        return this.append.show
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import './../assets/styles/mixins.scss';

  .vplayer-container {
    @include d-flex();
    @include bg($md-white-1000);

    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;

    video {
      @include w-100();
      @include h-100();
    }

    .vplayer-overlay {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba($md-white-1000, .75);
      z-index: 1;
    }
  }
</style>
