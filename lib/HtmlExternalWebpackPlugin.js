const assert = require('assert')
const path = require('path')
const fs = require('fs-extra')
const _ = require('lodash')
const resolveFrom = require('resolve-from')
const importFrom = require('import-from')
const debug = require('debug')('html-external-webpack-plugin:main')
const {cdn, jsTag, cssTag, externalTag} = require('./util.js')

// 添加 css
// 添加 js, js可简写为一个包名, 自动扩展版本
// 自动添加 externals?
// 自定义操作 data

module.exports = class HtmlExternalWebpackPlugin {
  constructor(options = {}) {
    this.options = options

    // HtmlWebpackPlugin ref
    this.HtmlWebpackPlugin = this.options.HtmlWebpackPlugin
    assert(
      this.HtmlWebpackPlugin,
      'options.HtmlWebpackPlugin must be specified'
    )

    // context
    // require from where
    this.options.context = this.options.context || process.cwd()
    this.require = moduleId => importFrom(this.options.context, moduleId)
    this.resolve = moduleId => resolveFrom(this.options.context, moduleId)

    if (!this.options.css) this.options.css = []
    if (!this.options.js) this.options.js = []

    // js cdn choose
    const defaultCDN = 'jsdelivr'
    this.options.jsCDN = this.options.jsCDN || defaultCDN
    this.prefix = cdn[this.options.jsCDN]

    // auto add webpack config.externals js
    this.options.autoExternals = Boolean(this.options.autoExternals)

    // use function to handle data
    if (this.options.custom) {
      assert(
        typeof this.options.custom === 'function',
        'options.custom must be a function'
      )
    }

    // bind
    const methods = ['getJsTag', 'handleData', 'getUrlForPackage']
    for (let m of methods) {
      this[m] = this[m].bind(this)
    }

    debug('info: %O', {
      options: _.omit(this.options, 'HtmlWebpackPlugin'),
      prefix: this.prefix,
    })
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlExternalWebpackPlugin', compilation => {
      this.compiler = compiler
      this.compilation = compilation
      const hook = this.HtmlWebpackPlugin.getHooks(compilation).alterAssetTags
      hook.tapPromise('HtmlExternalWebpackPlugin', this.handleData)
    })
  }

  // https://github.com/jantimon/html-webpack-plugin/blob/master/typings.d.ts#L178
  async handleData(data) {
    // css
    data.assetTags.styles = [
      ...this.options.css.map(cssTag),
      ...data.assetTags.styles,
    ]

    let jsArr = []
    // external js
    if (this.options.autoExternals) {
      let externals = this.compiler.options.externals
      externals = Object.keys(externals)
      jsArr = jsArr.concat(externals)
    }
    // js
    jsArr = jsArr.concat(this.options.js)
    jsArr = await Promise.all(this.options.js.map(this.getJsTag))
    jsArr = jsArr.filter(Boolean)
    data.assetTags.scripts = [...jsArr, ...data.assetTags.scripts]

    // custom function
    if (this.options.custom) {
      data = await Promise.resolve(this.options.custom(data))
    }

    return data
  }

  // support
  // full url: http://xxx
  // url : /
  // package-name
  // {name, version, path}

  async getJsTag(js) {
    // full url: http://example.com/some/file.js
    if (typeof js === 'string' && /^https?:\/\//.test(js)) {
      return jsTag(js)
    }

    // url: '/some/file.js'
    if (typeof js === 'string' && /^\//.test(js)) {
      return jsTag(js)
    }

    if (typeof js === 'object') {
      const {name, version, path} = js
      assert(name, 'Object<{name,version,path}> name can not be empty')
      assert(version, 'Object<{name,version,path}> version can not be empty')
      assert(path, 'Object<{name,version,path}> path can not be empty')
      const url = `${this.prefix}/${name}@${version}/${path}`
      return jsTag(url)
    }

    // package
    const url = await this.getUrlForPackage(js)
    return jsTag(url)
  }

  async getUrlForPackage(name) {
    const pkgRoot = path.dirname(this.resolve(`${name}/package.json`))
    const pkg = this.require(`${name}/package.json`)
    const {version, jsdelivr, unpkg, browser, main} = pkg

    const order = ['jsdelivr', 'unpkg', 'browser', 'main']
    const available = key => typeof pkg[key] === 'string'
    let innerPath
    for (let key of order) {
      if (available(key)) {
        innerPath = pkg[key]
        break
      }
    }

    if (!innerPath) {
      const msg = `[HtmlExternalWebpackPlugin]: package ${name} has no jsdelivr,unpkg,browser,main field found, igored`
      return console.warn(msg)
    }

    const getMin = p => p.replace(/\.(\w+)$/, '.min.$1')
    if (await fs.exists(path.join(pkgRoot, getMin(innerPath)))) {
      innerPath = getMin(innerPath)
    }

    // normalize innerPath like moment './moment.js'
    const fullPath = path.join(pkgRoot, innerPath)
    innerPath = fullPath.slice(pkgRoot.length + 1)

    return `${this.prefix}/${name}@${version}/${innerPath}`
  }
}
