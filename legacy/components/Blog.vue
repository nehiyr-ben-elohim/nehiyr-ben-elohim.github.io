<template>
  <section class="row blog-row">
    <div class="row-inner">
      <div class="blog-content" id="js--blog-content">

        <!-- Blog header -->
        <div class="blog-header" id="js--blog-header">
          <div class="blog-header-inner container">

            <!-- Selectors -->
            <div class="blog-search-selectors">
              <i class="material-icons blog-search-icon">event</i>

              <!-- Current year -->
              <div class="blog-search-year">
                <div class="search-params-list-wrapper">
                  <ul
                    :style="{ 'transform': `translate(0, ${-20 * years.indexOf(blogSearch.year)}px)` }"
                    class="search-params-list">
                    <li
                      v-for="(_, k) in years"
                      :class="{ 'active-param': _ === blogSearch.year }"
                      :key="k"><h5 class="blog-search-content">{{ _ }}</h5>
                    </li>
                  </ul>
                </div>
                <label class="blog-search-label">year</label>
              </div>

              <!-- Current month -->
              <div class="blog-search-month">
                <div class="search-params-list-wrapper">
                  <ul
                    :style="{ 'transform': `translate(0, ${-20 * months.indexOf(blogSearch.month)}px)` }"
                    class="search-params-list">
                    <li
                      v-for="(_, k) in months"
                      :class="{ 'active-param': _ === blogSearch.month }"
                      :key="k"><h5 class="blog-search-content">{{ getMonthFullName(_) }}</h5>
                    </li>
                  </ul>
                </div>
                <label class="blog-search-label">month</label>
              </div>
            </div>

            <!-- Searchbar -->
            <div
              v-if="false"
              class="blog-search-searchbar">
              <div class="searchbar">
                <input
                  class="searchbar-input"
                  type="text"
                  name="q"
                  placeholder="Search for..."
                  v-model="blogSearch.query">

                <i class="material-icons searchbar-icon">search</i>
              </div>
            </div>

            <!-- Logo -->
            <Logo />
          </div>
        </div>

        <!-- Articles list -->
        <div class="blog-articles-list container">
          <BlogArticleGroup
            v-for="(_) in addTheEnd(articlesGroupedByYear)" 
            :key="`key-${_.year}`" 
            :item="_">

            <!-- Group entries -->
            <div
              class="articles-by-month"
              v-for="(__) in groupByMonth(_.entries)"
              :key="`key-${_.year}--${__.month}`">

              <!-- Group month -->
              <h6 class="group-month">{{ getMonthName(__.month) }}</h6>

              <!-- Articles in this month -->
              <div class="group-entries">
                <BlogArticle 
                  v-for="(___) in __.entries" 
                  :key="___.key" 
                  :ref="`article-item-${___.key}`" 
                  :item="___" />
              </div>
            </div>
          </BlogArticleGroup>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import $ from 'jquery'
  import BlogArticleGroup from '@@/components/BlogArticleGroup'
  import BlogArticle from '@@/components/BlogArticle'
  import Logo from '@@/components/Logo'
  import { mapGetters } from 'vuex'
  import { groupByYear, groupByMonth } from '@@/illuminate/utils'
  import { MONTHS, MONTHS_FULLNAME } from '@@/illuminate/config'

  export default {
    name: 'Blog',

    // Required components
    components: { BlogArticleGroup, BlogArticle, Logo },

    // Props
    props: {},

    // Data
    data: () => ({

      // articlesGroupedByYear
      articlesGroupedByYear: [],

      // Blog search
      blogSearch: {
        year: 0,
        month: 0,
        query: '',
      },

      // All years
      years: [],

      // breakpoints
      breakpoints: [],

      // Fix header on scroll [ targetTop ]
      targetTop: 0,

      // All months
      months: new Array(12).fill(0).map((item, k) => item + k),
    }),

    // computed
    computed: {
      ...mapGetters({

        // All activities
        'x_activities': 'activities/items',

        // All activities
        'x_all_activities': 'activities/all',

        // Latest activity
        'x_latest_activity': 'activities/latest',
      }),
    },

    // watch
    watch: {

      // x_activities
      x_activities () {
        this.getActivities()
      },

      // blogSearch
      blogSearch: {
        handler: function (val) {
          this.searchArticles(val)
        },
        deep: true
      },
    },

    // Created
    created () {
      this.getActivities()
    },

    // Mounted
    mounted () {},

    // Destroyed
    destroyed () {
      $(document).off('scroll', this.setBlogSearchOnScroll_fn)
      $(document).off('scroll', this.fixHeaderOnScroll_fn)
    },

    // Methods
    methods: {

      // Add the end
      addTheEnd (arr) {
        return [ ...arr, {
          year: 'the end',
          entries: [],
        } ]
      },

      // setBlogSearchOnScroll_fn
      setBlogSearchOnScroll_fn () {
        const docHeight = $(window).height()
        const getTop = el => {
          let response = ($(el).offset() && $(el).offset().top)

          if ([ undefined, null, NaN ].includes(response)) {
            response = Infinity
          }

          return response
        }

        const top = $(document).scrollTop()
        const target = (docHeight * 0.55) + top
        let designated = this.breakpoints
          .filter(item => target >= getTop(item.get(0)['$el']))
          .reverse()
          .slice(0, 1)[0]

        if (designated) {
          designated = [ ...this.x_all_activities() ].filter(item => designated.get(0) === this.$refs[`article-item-${item.key}`][0])[0]

          this.blogSearch.year = designated.finishedAt.getFullYear()
          this.blogSearch.month = designated.finishedAt.getMonth()
        }
      },

      // Set blog search on scroll
      setBlogSearchOnScroll () {
        $(document).ready($ => {
          this.breakpoints = [ ...this.x_all_activities() ].map(item => $(this.$refs[`article-item-${item.key}`]))

          $(document).on('scroll', this.setBlogSearchOnScroll_fn)
          this.setBlogSearchOnScroll_fn()
        })
      },

      // Search activities
      searchArticles (query) {
        this.articlesGroupedByYear = this.articlesGroupedByYear.filter(byYear => {
          return byYear.entries.filter(item => query.query === '' || item.title.toLowerCase().includes(query.query.toLowerCase())).length
        })
      },

      // groupByMonth
      groupByMonth (arr) {
        return groupByMonth(arr)
      },

      // getMonthName
      getMonthName (key) {
        return MONTHS[key]
      },

      // fixHeaderOnScroll_fn
      fixHeaderOnScroll_fn () {
        const $parent = $('#js--blog-content')
        const className = 'fix-blog-header'

        const fixHeader = () => {
          if (!$parent.hasClass(className)) {
            $parent.addClass(className)
          }
        }
        const unfixHeader = () => {
          if ($parent.hasClass(className)) {
            $parent.removeClass(className)
          }
        }

        if ($(document).scrollTop() >= this.targetTop) {
          fixHeader()
        } else {
          unfixHeader()
        }
      },

      // Fix blog header on scroll
      fixHeaderOnScroll () {
        $(document).ready($ => {
          const $target = $('#js--blog-header')
          this.targetTop = $target.offset().top

          $(document).on('scroll', this.fixHeaderOnScroll_fn)
          this.fixHeaderOnScroll_fn()
        })
      },

      // getMonthFullName
      getMonthFullName (key) {
        return MONTHS_FULLNAME[key]
      },

      // domStuff
      domStuff () {
        this.fixHeaderOnScroll()
        this.setBlogSearchOnScroll()
      },

      // Get activities
      getActivities () {
        this.articlesGroupedByYear = groupByYear([ ...this.x_all_activities() ])

        this.years = this.articlesGroupedByYear
          .filter(byYear => parseInt(byYear.year))
          .map(byYear => byYear.year)

        if (this.x_latest_activity()) {
          this.blogSearch = {
            ...this.blogSearch,
            year: { ...this.x_latest_activity() }.finishedAt.getFullYear(),
            month: { ...this.x_latest_activity() }.finishedAt.getMonth(),
          }
        }

        this.domStuff()
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import './../assets/styles/components/blog.scss';
</style>
