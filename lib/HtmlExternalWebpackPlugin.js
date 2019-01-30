const assert = require('assert')
const path = require('path')
const fs = require('fs-extra')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {cdn, jsTag, cssTag, externalTag} = require('./util.js')

// 添加 css
// 添加 js, js可简写为一个包名, 自动扩展版本
// 自动添加 externals?
// 自定义操作 data

module.exports = class HtmlExternalWebpackPlugin {
  constructor(options = {}) {
    this.options = options

    if (!this.options.css) this.options.css = []
    if (!this.options.js) this.options.js = []

    // js cdn choose
    const defaultCDN = 'jsdelivr'
    this.options.jsCDN = this.options.jsCDN || defaultCDN
    this.prefix = cdn[this.options.cdn]

    // auto add webpack config.externals js
    this.options.autoExternals = Boolean(this.options.autoExternals)

    // use function to handle data
    if (this.options.custom) {
      assert(
        typeof this.options.custom === 'function',
        'options.custom must be a function'
      )
    }
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlExternalWebpackPlugin', compilation => {
      this.compiler = compiler
      this.compilation = compilation
      const hook = HtmlWebpackPlugin.getHooks(compilation).alterAssetTags
      hook.tapPromise('HtmlExternalWebpackPlugin', this.handleData.bind(this))
    })
  }

  // https://github.com/jantimon/html-webpack-plugin/blob/master/typings.d.ts#L178
  async handleData(data) {
    // css
    data.assetTags.styles = [
      ...this.options.css.map(cssTag),
      ...data.assetTags.styles,
    ]

    // external js
    if (this.options.autoExternals) {
      let externals = this.compiler.options.externals
      externals = Object.keys(externals)

      data.assetTags.scripts = [
        ...(await Promise.all(externals.map(this.getJsTag))),
        ...data.assetTags.scripts,
      ]
    }

    // js
    data.assetTags.scripts = [
      ...(await Promise.all(this.options.js.map(this.getJsTag))),
      ...data.assetTags.scripts,
    ]

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
    const url = this.getUrlForPackage(js)
    return jsTag(url)
  }

  async getUrlForPackage(name) {
    const pkg = require(`${name}/package.json`)
    const pkgRoot = path.dirname(require.resolve(`${name}/package.json`))
    const {version, jsdelivr, unpkg, browser, main} = pkg

    let innerPath = jsdelivr || unpkg || browser || main
    if (!innerPath) {
      const msg = `[HtmlExternalWebpackPlugin]: package ${name} has no jsdelivr,unpkg,browser,main field found, igored`
      return console.warn(msg)
    }

    const getMin = p => p.replace(/\.(\w+)$/, '.min.$1')
    if (await fs.exists(path.join(pkgRoot, getMin(innerPath)))) {
      innerPath = getMin(innerPath)
    }

    return `${cdn.jsdelivr}/${name}@${version}/${innerPath}`
  }
}
