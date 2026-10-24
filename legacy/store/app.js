export const state = () => ({
  menu_opened: false,
  current_path: null,
})

export const actions = {}

export const getters = {
  menu_opened: state => state.menu_opened,
  current_path: state => state.current_path,
}

export const mutations = {

  // Toggle menu
  TOGGLE_MENU (state) {
    state.menu_opened = !state.menu_opened
  },

  // The visible section
  CURRENT_SECTION (state, params) {
    state.current_path = params.resolve
  },
}
