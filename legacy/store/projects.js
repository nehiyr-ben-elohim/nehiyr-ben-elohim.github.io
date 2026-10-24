import { unixTimestampToDate, slugify, ajaxGet, previousObject, nextObject } from '@@/illuminate/utils'

export const state = () => ({
  items: [],
})

export const actions = {

  // Fetch all projects from activities
  fetch (store, params) {
    ajaxGet('/data/activities.json')
      .then(response => {
        store.commit('UPDATE_PROJECTS', { payload: JSON.parse(response) })
      })
      .catch(error => {
        store.commit('UPDATE_PROJECTS', { payload: [] })
        console.error(error)
      })
  }
}

export const getters = {

  // Get a single item
  item: state => {
    return slug => {
      if (state.items.length) {
        return state.items.filter(item => item.slug() === slug)[0] || state.items[0]
      }
    }
  },

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

  // Get featured items
  featured: state => {
    return max => {
      return [ ...state.items ]
        .filter(item => item.featured)
        .sort((item1, item2) => {
          return (item1.finishedAt < item2.finishedAt) ? 1 : -1
        })
        .slice(0, max)
    }
  },

  // Prev item
  prev: state => {
    return current => {
      return previousObject(state.items, 'key', current.key)
    }
  },

  // Next item
  next: state => {
    return current => {
      return nextObject(state.items, 'key', current.key)
    }
  },
}

export const mutations = {

  // Sets projects
  UPDATE_PROJECTS (state, params) {
    state.items = params.payload
      .filter(activity => activity.activityType === 'PROJECT')
      .filter(item => item.show)
      .map(item => {
        // Slug
        item['slug'] = function () {
          return slugify(item.title)
        }

        // Build link URL
        item['link'] = function () {
          return `/projects/${slugify(item.title)}`
        }

        // Build dates
        item['startedAt'] = unixTimestampToDate(item['startedAt'])
        item['finishedAt'] = unixTimestampToDate(item['finishedAt'])

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
