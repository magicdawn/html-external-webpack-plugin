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

  it('#getJsTag', async () => {
    expect(
      await plugin.getJsTag(
        'https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js'
      )
    ).toBeTruthy()

    expect(
      await plugin.getJsTag('/npm/axios@0.18.0/dist/axios.min.js')
    ).toBeTruthy()

    expect(await plugin.getJsTag('lodash')).toBeTruthy()

    expect(
      await plugin.getJsTag({
        name: 'lodash',
        version: '4.0.0',
        path: '/lodash.min.js',
      })
    ).toBeTruthy()
  })
})
