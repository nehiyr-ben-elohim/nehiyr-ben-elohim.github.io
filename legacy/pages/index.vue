<template>
  <div>
    <Menu />

    <FloatingHeader />

    <Landing />

    <AboutMe />

    <Projects 
      :p_step_indicator="true" 
      :p_latest="true" />

    <Skills />

    <!-- <Misc /> -->

    <Contact />

    <Foot />
  </div>
</template>

<script>
  import Landing from '@/components/Landing'
  import FloatingHeader from '@/components/FloatingHeader'
  import Menu from '@/components/Menu'
  import AboutMe from '@/components/AboutMe'
  import Projects from '@/components/Projects'
  import Skills from '@/components/Skills'
  import Misc from '@/components/Misc'
  import Contact from '@/components/Contact'
  import Foot from '@/components/Foot'

  export default {
    name: 'Homepage',

    // Mount view in default layout
    layout: 'default',

    // Required components
    components: { Landing, FloatingHeader, Menu, AboutMe, Projects, Skills, Misc, Contact, Foot },

    // Data
    data: () => ({}),
  }
</script>

<style lang='scss'>
</style>
