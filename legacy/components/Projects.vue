<template>
  <section 
    :id="path.resolve.split('#').join('')" 
    class="row projects-row">
    <CurrentStep 
      v-if="p_step_indicator" 
      :append="currentStep"></CurrentStep>

    <div class="row-inner">
      <div 
        :class="{ 'show-all': !p_featured }" 
        class="projects-list">
        <ProjectItem 
          v-for="(_) in projects" 
          :key="_.key" 
          :p_item="_"/>
      </div>

      <div 
        v-if="p_featured" 
        class="projects-more">
        <a :href="ALL_PROJECTS_PATH.resolve" class="btn">{{ getMoreProjectsText() }}</a>
      </div>
    </div>
  </section>
</template>

<script>
  import $ from 'jquery'
  import { mapGetters } from 'vuex'
  import { PATHS } from '@@/illuminate/config'
  import CurrentStep from '@/components/CurrentStep'
  import ProjectItem from '@/components/ProjectItem'
  
  export default {
    name: 'Projects',

    // Required components
    components: { CurrentStep, ProjectItem },

    // data
    data: () => ({
      // currentStep
      currentStep: {
        text: 'projets'
      },

      // projects
      projects: [],

      // My path
      path: PATHS.WORKS,

      // All projects path
      ALL_PROJECTS_PATH: PATHS.ALL_WORKS,
    }),

    // computed
    computed: {
      ...mapGetters({

        // All projects
        'x_projects': 'projects/items',

        // Latest projects
        'x_featured_projects': 'projects/featured',

        // All projects fn
        'x_all_projects': 'projects/all',
      }),
    },

    // watch
    watch: {

      // x_projects
      x_projects (val) {
        this.getProjects()
        this.processProjects()
      },
    },

    // created
    created () {
      this.getProjects()
      this.processProjects()
    },

    // mounted
    mounted () {},

    // props
    props: {

      // Show only latest projects ?
      p_featured: { type: Boolean, default: true, required: false },

      // Show step indicator ?
      p_step_indicator: { type: Boolean, default: true, required: false },
    },

    // methods
    methods: {

      // Process projects
      processProjects () {
        if (this.projects.length) {
          setTimeout(this.revealObservables, 500)
        }
      },

      // Get projects
      getProjects () {
        if (this.p_featured) {
          this.projects = [ ...this.x_featured_projects(6) ]
        } else {
          this.projects = [ ...this.x_all_projects() ]
        }
      },

      // revealObservables
      revealObservables () {
        // Do not continue if browser do not support this feature
        if (!window.IntersectionObserver) {
          console.error('Your browser doesn\'t support window.IntersectionObserver. Skipping this feature.')

          return false
        }

        const options = { root: null, rootMargin: '0px', threshold: 0.4 }
        const observed = (entries, observerMaster) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) $(entry.target).addClass('reveal')
          })
        }
        const observer = new IntersectionObserver(observed, options)

        // Observe all project items
        document.querySelectorAll('.project-item').forEach((element, index) => {
          observer.observe(element)
        })
      },

      // getMoreProjectsText
      getMoreProjectsText () {
        return 'tout voir'
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import './../assets/styles/components/projects.scss';
</style>
