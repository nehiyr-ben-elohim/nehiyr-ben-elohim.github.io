<template>
  <section :class="{ 'menu-opened': x_menu_opened }" class="menu-wrapper">
    <div class="menu-overlay"></div>

    <div class="menu-content" id="js--menuContent">
      <div class="stuff">
        <LatestActivities />
      </div>

      <div class="menu-items">
        <ul class="navbar">
          <li
            v-for="(_, k) in NAVBAR_PATHS"
            :key="k"
            :class="{ active: x_current_path === _.resolve }"
            class="nav-item"
          >
            <a
              :class="{
                'dashed-text prefixed-text': x_current_path === _.resolve
              }"
              @click.stop="scrollTo($event, _.resolve)"
              :href="_.resolve"
            >
              {{ _.title.toLowerCase() }}
            </a>
          </li>
          <li class="nav-item latest-activities-opener">
            <a @click="openLatestActivities" href="javascript:void(0);">
              Latest activities
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import $ from "jquery";
import { mapGetters } from "vuex";
import { PATHS } from "@@/illuminate/config";
import { toArray } from "@@/illuminate/utils";
import LatestActivities from "@@/components/LatestActivities";

export default {
  name: "Menu",

  // Components
  components: { LatestActivities },

  // data
  data: () => ({
    // NAVBAR_PATHS
    NAVBAR_PATHS: toArray(PATHS).filter(item => item.inNavBar)
  }),

  // props
  props: {},

  // watch
  watch: {},

  // computed
  computed: {
    ...mapGetters({
      // Is the menu opened
      x_menu_opened: "app/menu_opened",

      // Current visible section's path
      x_current_path: "app/current_path"
    })
  },

  // methods
  methods: {
    // openLatestActivities
    openLatestActivities() {
      $("#js--menuContent").addClass("open-latest-activities");
    },

    // scrollTo destination with smooth animation
    scrollTo(e, hash) {
      if (hash.includes("#")) {
        e.preventDefault();

        const scrollToDest = () => {
          const $target = $(hash);

          $("html, body").animate(
            {
              scrollTop: $target.position().top
            },
            0,
            "easeOutCubic"
          );
        };

        scrollToDest();
        this.$store.commit("app/TOGGLE_MENU", null);
      } else {
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./../assets/styles/components/menu.scss";
</style>
