<template>
  <section class="latest-activities-wrapper">
    <h6 class="latest-activities-wrapper--title prefixed-text">
      My recents activities
    </h6>
    <a
      @click="closeLatestActivities"
      class="latest-activities-wrapper--title latest-activities-wrapper--close"
      href="javascript:void(0);"
    >
      &lt; goto menu
    </a>

    <ul class="latest-activities">
      <li v-for="(_, k) in activitiesGroup" :key="k" class="l-activity-group">
        <!-- Activity group year -->
        <header class="l-activity-group--header">{{ _.year }}</header>

        <!-- Activity group entries -->
        <ul class="l-activity-group--entries">
          <!-- Activity item -->
          <ActivityItem v-for="(__, kk) in _.entries" :key="kk" :item="__" />
        </ul>
      </li>
    </ul>
  </section>
</template>

<script>
/* eslint-disable */
import $ from "jquery";
import { mapGetters } from "vuex";
import { groupByYear } from "@@/illuminate/utils";
import ActivityItem from "@@/components/ActivityItem";

export default {
  name: "LatestActivities",

  // Required components
  components: { ActivityItem },

  // data
  data: () => ({
    // activitiesGroup
    activitiesGroup: []
  }),

  // computed
  computed: {
    ...mapGetters({
      // All activities
      x_activities: "activities/items",

      // All activities
      x_all_activities: "activities/all"
    })
  },

  // watch
  watch: {
    // x_activities
    x_activities(val) {
      this.getActivities();
    }
  },

  // Created
  created() {
    this.getActivities();
  },

  // mounted
  mounted() {},

  // methods
  methods: {
    // Get activities
    getActivities() {
      this.activitiesGroup = groupByYear([...this.x_all_activities()]);
    },

    // closeLatestActivities
    closeLatestActivities() {
      $("#js--menuContent").removeClass("open-latest-activities");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./../assets/styles/components/latestactivities.scss";
</style>
