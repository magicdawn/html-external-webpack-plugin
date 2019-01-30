const HtmlExternalWebpackPlugin = require('..')

describe('HtmlExternalWebpackPlugin', function() {
  let plugin
  beforeEach(() => {
    plugin = new HtmlExternalWebpackPlugin()
  })

  it('#getUrlForPackage', async () => {
    const url = await plugin.getUrlForPackage('lodash')
    expect(url).toMatch(/https:/)
    expect(url).toMatch('.min.js')
  })
})
