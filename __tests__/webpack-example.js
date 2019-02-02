const execa = require('execa')
const path = require('path')
const fs = require('fs-extra')
const webpack = require('webpack')
const config = require('./webpack/config.js')

describe('webpack example', function() {
  it('it works', async function() {
    const stats = await new Promise((resolve, reject) => {
      webpack(config, (err, stats) => {
        if (err) reject(err)
        else resolve(stats)
      })
    })

    const info = stats.toJson()
    if (stats.hasErrors()) {
      console.error(info.errors)
    }
    if (stats.hasWarnings()) {
      console.warn(info.warnings)
    }

    let file = __dirname + '/webpack/dist/index.html'
    file = await fs.readFile(file, 'utf8')
    expect(file).toMatch(/moment/)
    expect(file).toMatch(
      'https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js'
    )
  })
})
