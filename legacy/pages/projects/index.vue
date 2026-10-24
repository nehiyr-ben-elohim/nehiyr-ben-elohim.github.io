<template>
  <div>
    <FloatingHeader
      :p_expanded_data="projectsHeaderData"
      :p_restricted="true" />

    <Projects
      :p_step_indicator="false"
      :p_featured="false" />

    <Contact :p_step_indicator="false" />

    <Foot />
  </div>
</template>

<script>
  import FloatingHeader from '@/components/FloatingHeader'
  import Projects from '@/components/Projects'
  import Contact from '@/components/Contact'
  import Foot from '@/components/Foot'
  import { revealBannerExpandedTitle } from '@@/illuminate/utils'

  export default {
    name: 'AllProjects',

    // View layout
    layout: 'default',

    // Required components
    components: { FloatingHeader, Projects, Contact, Foot },

    // Data
    data: () => ({

      // projectsHeaderData
      projectsHeaderData: {
        title: `tous mes projets, travaux, ...`,
        hints: [ `Certains d'entre eux ne sont pas disponibles en ligne`, `Certains d'entre eux sont encore en cours`, `Défiler vers le bas pour voir plus` ],
      },
    }),

    // mounted
    mounted () {
      revealBannerExpandedTitle()
    },
  }
</script>

<style lang='scss'>
</style>
