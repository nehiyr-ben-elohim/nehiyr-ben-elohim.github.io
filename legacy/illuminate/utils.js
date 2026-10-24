import { SCROLL_BREAKED_CLASSNAME, SCROLL_BREAKED_TARGET_ATTR, MONTHS } from '@@/illuminate/config'

export const navigate = (activity, path) => {
  activity.$router.push({ path: path })
}

export const setFocus = htmlEltName => {
  setTimeout(() => {
    let field = document.getElementsByName(htmlEltName)[0]

    field.focus()
    field.select()
  }, 100)
}

export const requestApiKey = () => {
  return 'AIzaSyAYisMRVTrYKBSSRMt0z8QVgmIkEWJpBPM'
}

export const toArray = obj => {
  return Object.keys(obj).map(key => {
    return obj[key]
  })
}

export const slugify = str => {
  return str.toString().toLowerCase()
    .replace('ï', 'i')
    .replace('é', 'e')
    .replace('è', 'e')
    .replace('ê', 'e')
    .replace('à', 'a')
    .replace('â', 'a')
    .replace('ä', 'a')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export const animateElements = (parent) => {
  const $ = require('jquery')
  const $targets = $(parent).find(`[${SCROLL_BREAKED_TARGET_ATTR}]`)

  Array.from($targets).forEach((element, index) => {
    setTimeout(() => {
      $(element).addClass(SCROLL_BREAKED_CLASSNAME)
    }, parseInt($(element).attr(SCROLL_BREAKED_TARGET_ATTR)))
  })
}

export const revealBannerExpandedTitle = () => {
  const $ = require('jquery')
  const fn = () => {
    $('.content-header-title').addClass('reveal-title')
  }

  setTimeout(fn, 850)
}

export const previousObject = (arr, objectKey, objectKeyValue) => {
  let response = null

  if (arr[0][objectKey] !== objectKeyValue) {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i][objectKey] === objectKeyValue) {
        response = arr[i - 1]
        break
      }
    }
  }

  return response
}

export const nextObject = (arr, objectKey, objectKeyValue) => {
  let response = null

  if (arr[arr.length - 1][objectKey] !== objectKeyValue) {
    for (let i = 0; i < (arr.length - 1); i++) {
      if (arr[i][objectKey] === objectKeyValue) {
        response = arr[i + 1]
        break
      }
    }
  }

  return response
}

export const ajaxGet = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr.responseText)
        } else {
          reject(new Error(`Can't load activities. Status: ${xhr.status}`))
        }
      }
    }

    xhr.open('GET', url.toString().trim(), true)
    xhr.send()
  })
}

export const ajaxPost = (url, data) => {
  return new Promise((resolve, reject) => {
    const $ = require('jquery')

    $.ajax({
      url: url,
      type: 'POST',
      dataType: 'json',
      data: data,
      success: response => {
        resolve(response)
      },
      error: error => {
        reject(error)
      }
    })
  })
}

export const unixTimestampToDate = str => {
  return new Date(parseInt(str) * 1000)
}

const groupBy = (arr, attrName) => {
  let response = []

  arr.forEach(item => {
    let attrValue

    if (attrName === 'year') {
      attrValue = item.finishedAt.getFullYear()
    }
    if (attrName === 'month') {
      attrValue = item.finishedAt.getMonth()
    }

    if (!response.includes(attrValue)) {
      response.push(attrValue)
    }
  })

  response = response.map(attrValue => {
    let group = {
      entries: arr.filter(item => {
        if (attrName === 'year') {
          return item.finishedAt.getFullYear() === attrValue
        }
        if (attrName === 'month') {
          return item.finishedAt.getMonth() === attrValue
        }
      })
    }

    group[attrName] = attrValue

    return group
  })

  response = [ ...response ]
    .sort((item1, item2) => {
      return (parseInt(item1[attrName]) > parseInt(item2[attrName])) ? -1 : 1
    })
    .map(item => {
      item.entries.sort((item1, item2) => {
        return (parseInt(item1.finishedAt) > parseInt(item2.finishedAt)) ? -1 : 1
      })

      return item
    })

  return response
}

export const groupByYear = arr => {
  return groupBy(arr, 'year')
}

export const groupByMonth = arr => {
  return groupBy(arr, 'month')
}

export const persistDomRect = (domRectKey, $target) => {
  return new Promise(resolve => {
    const clientRect = $target.get(0).getBoundingClientRect()
    let clientRectPlain = {}

    for (const key in clientRect) {
      if (key !== 'toJSON') {
        clientRectPlain[key] = clientRect[key]
      }
    }

    window.localStorage[domRectKey] = JSON.stringify(clientRectPlain)
    resolve()
  })
}

export const sweepScreen = () => {
  return new Promise(resolve => {
    const $ = require('jquery')

    const $screenSweeper = $(`<div></div>`)
    $screenSweeper.css({
      'position': 'fixed',
      'top': 'unset',
      'bottom': '0',
      'left': '0',
      'right': '0',
      'width': '100%',
      'height': '0%',
      'z-index': '100',
      'background-color': '#FFF',
    })

    $('body').append($screenSweeper)
    $screenSweeper
      .delay(100)
      .animate({
        'height': '100%',
      }, 'fast', 'swing', () => {
        setTimeout(() => {
          resolve()
        }, 500)
        setTimeout(() => {
          $screenSweeper.remove()
        }, 600)
      })
  })
}

export const getFormattedDate = (date) => {
  return `${MONTHS[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`
}
