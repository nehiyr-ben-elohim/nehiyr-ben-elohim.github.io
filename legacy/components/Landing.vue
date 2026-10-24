<template>
  <section
    class="row landing-row"
    :id="path.resolve.split('#').join('')"
    ref="landing"
  >
    <CurrentStep :append="currentStep"></CurrentStep>

    <div class="row-inner">
      <div class="landing-header-text-wrapper">
        <div id="js--masked-text" class="d-inline-flex masked-text dashed-text">
          <h1
            data-scrollbreak="600"
            class="landing-header-text landing-header-text--1"
          >
            {{ getLandingHeaderText().split(" ")[0] }}
          </h1>
          <h1
            data-scrollbreak="750"
            class="landing-header-text landing-header-text--2"
          >
            {{ getLandingHeaderText().split(" ")[1] }}
          </h1>
        </div>
      </div>

      <div class="what-is-it-wrapper">
        <h6 data-scrollbreak="1350" class="what-is-it--text">
          {{ getWhatIsItText() }}
        </h6>
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

export default {
  name: "Landing",

  // Required components
  components: { CurrentStep },

  // data
  data: () => ({
    // currentStep
    currentStep: {
      text: "bienvenue"
    },

    // My path
    path: PATHS.LANDING
  }),

  // mounted
  mounted() {
    this.animateItems();
  },

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
        animateElements(this.$refs["landing"]);
      }
    }
  },

  // methods
  methods: {
    // animateItems
    animateItems() {
      $(document).ready(() => {
        // Animate the Masked text background on scroll
        this.parallaxBackground();
        $(document).on("scroll", this.parallaxBackground);
      });
    },

    // getLandingHeaderText
    getLandingHeaderText() {
      return "hello world!";
    },

    // getWhatIsItText
    getWhatIsItText() {
      return "Ceci est juste un autre portfolio. Point.";
    },

    // onScroll
    parallaxBackground() {
      const st = $(document).scrollTop();

      // If scrolltop greater than 450 do nothing
      if (st >= 450) return false;

      let $maskedText = $("#js--masked-text");

      // If the masked text is not found throw error
      if (!$maskedText)
        throw new Error("Invalid jQuery element in scroll event handler.");

      $maskedText
        .find(".landing-header-text")
        .css({ backgroundPosition: `50% ${st}%` });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./../assets/styles/components/landing.scss";
</style>
