import $ from 'jquery'
import { PATHS } from '@@/illuminate/config'
import { toArray } from '@@/illuminate/utils'

class ScrollBreak {
  constructor () {
    this.breakpoints = []
    this.docHeight = 0
  }

  init () {
    this.breakpoints = toArray(PATHS)
      .filter(item => item.inNavBar && item.resolve.includes('#'))
      .map(item => item.resolve)
      .map(item => {
        return {
          id: item,
          el: item,
        }
      })

    this.docHeight = $(window).height()

    return this
  }

  _getTop (el) {
    let response = ($(el).position() && $(el).position().top)

    if ([ undefined, null, NaN ].includes(response)) {
      response = Infinity
    }

    return response
  }

  clearDesignated () {
    this.currentDesignated = null
  }

  watch (next) {
    const module = this

    this.clearDesignated()

    const onScrollFn = () => {
      const top = $(document).scrollTop()
      const target = (module.docHeight * 0.55) + top
      const designated = module.breakpoints
        .filter(item => target >= this._getTop(item.el))
        .reverse()
        .slice(0, 1)[0]

      if ((designated) && ((!this.currentDesignated) || (designated.id !== this.currentDesignated.id))) {
        next(designated.id)

        this.currentDesignated = designated
      }
    }

    $(document).on('scroll', onScrollFn)
    onScrollFn()

    return this
  }
}

export default new ScrollBreak()
