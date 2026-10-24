<template>
  <div class="container">
    <div class="adjacents-row">
      <span 
        v-if="prev" 
        class="adjacents-control adjacents-control-prev">
        < préc.
      </span>

      <!-- Previous project -->
      <div class="adjacents-project-item">
        <ProjectItem 
          :p_mini="true" 
          :p_item="prev" />
      </div>

      <!-- Next project -->
      <div class="adjacents-project-item">
        <ProjectItem 
          :p_mini="true" 
          :p_item="next" />
      </div>

      <span 
        v-if="next" 
        class="adjacents-control adjacents-control-next">
        suiv. >
      </span>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ProjectItem from '@/components/ProjectItem'

  export default {
    name: 'AdjacentProjects',

    // Required components
    components: { ProjectItem },

    // data
    data: () => ({

      // Prev item
      prev: null,

      // Next item
      next: null,
    }),

    // computed
    computed: {
      ...mapGetters({

        // Get the prev project relative to current
        'x_prev': 'projects/prev',

        // Get the next project relative to current
        'x_next': 'projects/next',
      }),
    },

    // created
    created () {
      // Get objects
      this.prev = this.x_prev(this.p_center)
      this.next = this.x_next(this.p_center)
    },

    // mounted
    mounted () {},

    // watch
    watch: {},

    // methods
    methods: {},

    // props
    props: {
      p_center: { type: Object, default: () => {}, required: true },
    },
  }
</script>

<style lang='scss' scoped>
  @import './../assets/styles/components/adjacents-projects.scss';
</style>
