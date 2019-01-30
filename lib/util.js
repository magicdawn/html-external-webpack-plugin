const path = require('path')
const fs = require('fs-extra')

const cdn = (exports.cdn = {
  jsdelivr: 'https://cdn.jsdelivr.net/npm',
  unpkg: 'https://unpkg.com',
  baidu: 'https://code.bdstatic.com/npm',
})

const jsTag = (exports.jsTag = js => ({
  tagName: 'script',
  voidTag: false,
  attributes: {
    src: js,
  },
}))

// <link rel="stylesheet" href="/css/master.css">
const cssTag = (exports.cssTag = css => ({
  tagName: 'link',
  voidTag: true,
  attributes: {
    rel: 'stylesheet',
    href: css,
  },
}))
