<template>
  <li 
    v-if="item" 
    class="l-activity-item">
    <div class="header">
      <a :href="item.resolve" title="">
        <!-- Headings -->
        <div class="headings">
          <!-- Activity title -->
          <h5 class="title">{{ item.title }}</h5>

          <!-- Activity type -->
          <h6 class="type">{{ item.type }}</h6>
        </div>
        
        <!-- Activity timeline -->
        <div class="timing">
          <div class="timing-item">
            <span class="timing-item-date">{{ item.startedAt.getDate() }}</span>
            <span class="timing-item-month">{{ MONTHS[item.startedAt.getMonth()] }}</span>
          </div>
          <div class="timing-item">
            <span class="timing-item-date">{{ item.finishedAt.getDate() }}</span>
            <span class="timing-item-month">{{ MONTHS[item.finishedAt.getMonth()] }}</span>
          </div>
        </div>
      </a>
    </div>

    <!-- Activity techs -->
    <ul 
      v-if="item.techs" 
      class="techs">
      <li 
        v-for="(_, k) in item.techs" 
        class="tech-item">
        <a :href="`https://www.google.com/search?safe=active&source=${APP_URL}&q=${_}+wikipedia&oq=${_}+wikipedia`" :title="_" target="_blank">{{ _ }}</a>
      </li>
    </ul>
  </li>
</template>

<script>
  import { MONTHS, APP_URL } from '@@/illuminate/config'

  export default {
    name: 'ActivityItem',

    // Required components
    components: {},

    // data
    data: () => ({

      // APP_URL
      APP_URL: APP_URL,

      // MONTHS
      MONTHS: MONTHS,
    }),

    // Props
    props: {

      // Single item
      item: { type: Object, default: () => {}, required: true },
    },

    // methods
    methods: {},
  }
</script>

<style lang='scss' scoped>
  @import './../assets/styles/components/activityitem.scss';
</style>
