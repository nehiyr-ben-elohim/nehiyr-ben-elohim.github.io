<template>
  <section
    class="row aboutme-row"
    :id="path.resolve.split('#').join('')"
    ref="aboutme"
  >
    <CurrentStep :append="currentStep"></CurrentStep>

    <div class="row-inner">
      <div class="speech-container">
        <div class="speech-title-wrapper">
          <h1 data-scrollbreak="50" class="speech-title">
            {{ getSpeechTitle() }}
          </h1>
        </div>
        <br />
        <div class="speech-text-wrapper">
          <h6 data-scrollbreak="150" class="speech-text">
            {{ getSpeechText() }}
          </h6>
          <ul class="speech-imgs">
            <li v-for="(_, k) in 8">
              <img
                :src="`/img/aboutme/${_}.png`"
                alt=""
                width="40px"
                height="40px"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import { mapGetters } from "vuex";
import { PATHS } from "@@/illuminate/config";
import { animateElements } from "@@/illuminate/utils";
import CurrentStep from "@/components/CurrentStep";

export default {
  name: "AboutMe",

  // Required components
  components: { CurrentStep },

  // Data
  data: () => ({
    // currentStep
    currentStep: {
      text: "à propos"
    },

    // My path
    path: PATHS.ABOUTME
  }),

  // mounted
  mounted() {},

  // watch
  watch: {
    // x_current_path
    x_current_path(val) {
      if (val === this.path.resolve) {
        animateElements(this.$refs["aboutme"]);
      }
    }
  },

  // computed
  computed: {
    ...mapGetters({
      // Current visible section's path
      x_current_path: "app/current_path"
    })
  },

  // Methods
  methods: {
    // getSpeechTitle
    getSpeechTitle() {
      return "appele-moi Jean-Jacques";
    },

    // getSpeechText
    getSpeechText() {
      return `
          je suis un développeur JavaScript Full Stack. j'aime travailler sur des projets innovants, pleins de défis. je suis collaboratif et perfectionniste.
        `;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./../assets/styles/components/aboutme.scss";
</style>
