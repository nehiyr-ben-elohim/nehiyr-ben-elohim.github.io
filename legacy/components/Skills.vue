<template>
  <section
    class="row skills-row"
    :id="path.resolve.split('#').join('')"
    ref="skills"
  >
    <CurrentStep :append="currentStep"></CurrentStep>

    <div class="row-inner">
      <VPlayer :append="curMediaURL"></VPlayer>

      <div class="skills-content">
        <header data-scrollbreak="50" class="skills-header-text">
          <span>{{ getSkillsHeaderText() }}</span>
        </header>

        <p data-scrollbreak="150" class="skills-speech">
          Pour une application Web complète, je sépare le front-end [visuel] du
          back-end [logique applicative]. Le front-end, étant principalement en
          <a href="#">HTML</a> - <a href="#">CSS [SASS/LESS]</a> -
          <a href="#">JS [VueJS/ReactJS]</a> avec un petit coup de
          <a href="#">Bootstrap</a> ou carrément <a href="#">VuetifyJS</a> pour
          le matérial design, communique avec le back-end [<a href="#"
            >PHP/Lumen/Laravel</a
          >
          ou <a href="#">NodeJS</a>] par <a href="#">AJAX [Axios/SocketIO]</a>.
          Je la préfère native donc je pars sur du <a href="#">Java Android</a>,
          avec <a href="#">Android Studio</a> ou du
          <a href="#">React Native</a> pour mes applications mobiles.
        </p>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import $ from "jquery";
import { mapGetters } from "vuex";
import { PATHS } from "@@/illuminate/config";
import { animateElements } from "@@/illuminate/utils";
import CurrentStep from "@/components/CurrentStep";
import VPlayer from "@/components/VPlayer";

export default {
  name: "Skills",

  // Required components
  components: { CurrentStep, VPlayer },

  // data
  data: () => ({
    // currentStep
    currentStep: {
      text: "compétences"
    },

    // curMediaURL
    curMediaURL: {
      show: false,
      URL: ""
    },

    // My path
    path: PATHS.SKILLS
  }),

  // computed
  computed: {
    ...mapGetters({
      // Current visible section's path
      x_current_path: "app/current_path"
    })
  },

  // watch
  watch: {
    // x_current_path
    x_current_path(val) {
      if (val === this.path.resolve) {
        animateElements(this.$refs["skills"]);
      }
    }
  },

  // methods
  methods: {
    // getSkillsHeaderText
    getSkillsHeaderText() {
      return "Compétences";
    },

    // getSkillsSpeech
    getSkillsSpeech() {
      return `
          pour une application Web complète, je sépare le front-end (visuel) du back-end (logique applicative). le front-end, étant principalement en <a href="#">HTML</a> - <a href="#">CSS (SASS)</a> - <a href="#">JS (VueJS)</a> avec un petit coup de <a href="#">Bootstrap</a> ou carrément <a href="#">VuetifyJS</a> pour le matérial design, communique avec le back-end <a href="#">(PHP ou NodeJS)</a> par <a href="#">AJAX</a>.
          je la préfère native donc je pars sur du <a href="#">Java Android</a>, avec <a href="#">Android Studio</a>, pour mes applications mobiles Android.
        `;
    },

    // initSkillsHover
    initSkillsHover() {
      const skills = ["skill-php"];

      skills.forEach(skill => {
        let $skill = $(`.${skill}`);

        $skill.on("mouseover", e => {
          this.curMediaURL.URL = $skill.data("mediaurl");
          this.curMediaURL.show = true;
        });
        $skill.on("mouseout", e => {
          this.curMediaURL.URL = "";
          this.curMediaURL.show = false;
        });
      });
    }
  },

  // mounted
  mounted() {
    this.initSkillsHover();
  }
};
</script>

<style lang="scss" scoped>
@import "./../assets/styles/components/skills.scss";
</style>
