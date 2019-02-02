const execa = require('execa')
const path = require('path')
const fs = require('fs-extra')

describe('webpack example', function() {
  it.skip('it works', async function() {
    await fs.remove(__dirname + '/webpack/dist')

    await execa(
      '../../node_modules/.bin/webpack',
      `--config config.js`.split(' '),
      {
        cwd: __dirname + '/webpack',
      }
    )

    let file = __dirname + '/webpack/dist/index.html'
    file = await fs.readFile(file, 'utf8')
    expect(file).toMatch(/moment/)
    expect(file).toMatch(
      'https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js'
    )
  })
})
