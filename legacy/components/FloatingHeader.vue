<template>
  <header
    :class="{
      expanded: p_restricted,
      'big-size': p_height === 'big',
      'small-size': p_height === 'small',
      'dark-scheme': p_color_scheme === 'dark',
      'light-scheme': p_color_scheme === 'light'
    }"
    class="floating-header"
  >
    <div
      id="js--parallax-header"
      v-if="p_expanded_data && p_expanded_data.bg"
      :style="{ 'background-image': `url(${p_expanded_data.bg})` }"
      class="floating-header-backdrop"
    ></div>

    <!-- Brand wrapper -->
    <Logo />

    <!-- Right controls wrapper -->
    <div class="right-controls-wrapper">
      <!-- Menu toggler -->
      <div v-if="!p_restricted" class="menu-toggler-wrapper">
        <a
          href="javascript:void(0);"
          class="menu-toggler"
          :class="{ 'menu-opened': x_menu_opened }"
          @click="toggleMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </a>
      </div>

      <!-- Visite project site -->
      <div
        v-if="p_restricted && p_expanded_data && !!p_expanded_data.resolve"
        class="visit-site-wrapper"
      >
        <a
          target="_blank"
          title="Visit website"
          :href="p_expanded_data.resolve"
        >
          <span>voir le site web</span>
          <i class="material-icons dashed-text no-rotate-dash">open_in_new</i>
        </a>
      </div>

      <!-- Go home -->
      <div v-if="p_restricted" class="go-home-wrapper">
        <a :href="HOMEPAGE.resolve">accueil</a>
      </div>
    </div>

    <!-- Content when expanded -->
    <div
      v-if="p_restricted && p_expanded_data"
      class="expanded-content container"
    >
      <div class="expanded-content-inner">
        <h1
          :class="{ 'dashed-text no-rotate-dash': p_dash_title }"
          :data-nb-children="getExpandedDataTitle().split(' ').length"
          class="content-header-title"
          v-html="
            getExpandedDataTitle()
              .split(' ')
              .map(
                item =>
                  `<span ${item.includes('--') ? 'stroke' : ''}>${item
                    .split('--')
                    .join('')}</span>`
              )
              .join('')
          "
        ></h1>
        <h6 v-if="p_expanded_data.hints" class="content-header-hints">
          <span v-for="(_, k) in p_expanded_data.hints" :key="k">{{ _ }}</span>
        </h6>
      </div>
    </div>

    <!-- Dynamic content -->
    <slot></slot>
  </header>
</template>

<script>
/* eslint-disable */
import $ from "jquery";
import { mapGetters } from "vuex";
import { PATHS } from "@@/illuminate/config";
import Logo from "@@/components/Logo";

export default {
  name: "FloatingMenu",

  // Dependencies
  components: { Logo },

  // data
  data: () => ({
    // HOMEPAGE
    HOMEPAGE: PATHS.HOMEPAGE
  }),

  // Props
  props: {
    // p_restricted
    p_restricted: { type: Boolean, default: false, required: false },

    // p_color_scheme
    p_color_scheme: { type: String, default: "dark", required: false },

    // p_dash_title
    p_dash_title: { type: Boolean, default: false, required: false },

    // When expanded
    p_expanded_data: { type: Object, default: () => {}, required: false },

    // Height
    p_height: { type: String, default: "medium", required: false }
  },

  // computed
  computed: {
    ...mapGetters({
      x_menu_opened: "app/menu_opened"
    })
  },

  // Created
  created() {},

  // Mounted
  mounted() {
    $(document).ready(() => {
      if (this.p_expanded_data && this.p_expanded_data.bg) {
        $(document).on("scroll", this.parallaxHeader);
      }
    });
  },

  // methods
  methods: {
    // parallaxHeader
    parallaxHeader(e) {
      const st = e ? $(e.delegateTarget).scrollTop() : 0;

      // If scrolltop greater than 450 do nothing
      if (st >= 450) return false;

      const $target = $("#js--parallax-header");

      // If the masked text is not found throw error
      if (!$target)
        throw new Error("Invalid jQuery element in scroll event handler.");

      $target.css({ backgroundPosition: `50% ${st * 0.075}%` });
    },

    // getExpandedDataTitle
    getExpandedDataTitle() {
      return `> ${this.p_expanded_data.title}`;
    },

    // toggleMenu
    toggleMenu() {
      this.$store.commit("app/TOGGLE_MENU", null);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./../assets/styles/components/floatingheader.scss";
</style>
