import { unixTimestampToDate, slugify, ajaxGet } from '@@/illuminate/utils'

export const state = () => ({
  items: [],
})

export const actions = {

  // Fetch activities from file
  fetch (store, params) {
    ajaxGet('/data/activities.json')
      .then(response => {
        store.commit('UPDATE_ACTIVITIES', { payload: JSON.parse(response) })
      })
      .catch(error => {
        store.commit('UPDATE_ACTIVITIES', { payload: [] })
        console.error(error)
      })
  },
}

export const getters = {

  // Get all items
  items: state => state.items,

  // Get all items
  all: state => {
    return () => {
      return [ ...state.items ]
        .sort((item1, item2) => {
          return (item1.finishedAt < item2.finishedAt) ? 1 : -1
        })
    }
  },

  // Get a single item by slug
  item: state => {
    return slug => {
      if (state.items.length) {
        return state.items.filter(item => item.slug() === slug)[0] || state.items[0]
      }
    }
  },

  // Get latest items
  latest: state => {
    return () => {
      return [...state.items]
        .sort((item1, item2) => {
          return (item1.finishedAt < item2.finishedAt) ? 1 : -1
        })
        .slice(0, 1)[0]
    }
  },
}

export const mutations = {

  // Sets activities
  UPDATE_ACTIVITIES (state, params) {
    state.items = params.payload
      .filter(item => item.show)
      .map(item => {
        // Slug
        item['slug'] = function () {
          return slugify(item.title)
        }

        // Build link URL
        item['link'] = function () {
          if (item.activityType === 'PROJECT') {
            return `/projects/${slugify(item.title)}`
          }
          if (item.activityType === 'BLOG') {
            return `/blog/${slugify(item.title)}`
          }
        }

        // Build dates
        item['startedAt'] = unixTimestampToDate(item['startedAt'])
        if (item['finishedAt'] === 'TODAY') {
          item['finishedAt'] = new Date()
        } else {
          item['finishedAt'] = unixTimestampToDate(item['finishedAt'])
        }

        // Reformat metadata
        item['metas'].map(meta => {
          if (meta.value === '__FUNCTION__') {
            switch (meta.title) {
              // Refer to techs to fill up tools
              case 'Tools':
                meta.value = function () {
                  return item.techs.join(', ')
                }
                break

              // Refer to type to fill scope
              case 'Scope':
                meta.value = function () {
                  return item.type
                }
                break
            }
          }

          return meta
        })

        return item
      })
  },
}
