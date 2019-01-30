const HtmlExternalWebpackPlugin = require('..')
const HtmlWebpackPlugin = require('html-webpack-plugin')

describe('HtmlExternalWebpackPlugin', function() {
  let plugin
  beforeEach(() => {
    plugin = new HtmlExternalWebpackPlugin({
      HtmlWebpackPlugin,
    })
  })

  it('#getUrlForPackage', async () => {
    const url = await plugin.getUrlForPackage('lodash')
    expect(url).toMatch(/https:/)
    expect(url).toMatch('.min.js')
  })
})
