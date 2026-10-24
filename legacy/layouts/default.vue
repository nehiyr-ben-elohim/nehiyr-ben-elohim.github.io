<template>
  <nuxt/>
</template>

<script>
  import ScrollBreak from '@@/illuminate/scroll-break'
  
  export default {

    // Middleware
    middleware: 'default',

    // Data
    data: () => ({

      // ScrollBreak instance
      scrollBreakInstance: null,
    }),

    // Watch
    watch: {

      $route (from, to) {
        this.scrollBreakInstance.init()
        this.scrollBreakInstance.clearDesignated()
        this.$store.commit('app/CURRENT_SECTION', { resolve: null })
      },
    },

    // Mounted
    mounted () {
      this.scrollBreakInstance = ScrollBreak.init()
      this.scrollBreakInstance.watch(resolve => {
        this.$store.commit('app/CURRENT_SECTION', { resolve: resolve })
      })
    },
  }
</script>

<style></style>
