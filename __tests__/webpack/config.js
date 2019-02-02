const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlExternalWebpackPlugin = require('../../index.js')

module.exports = {
  mode: 'development',
  entry: __dirname + '/entry.js',

  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/template.html',
    }),

    new HtmlExternalWebpackPlugin({
      HtmlWebpackPlugin,
      context: __dirname,
      js: [
        'lodash',
        'https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js',
        'https://cdn.jsdelivr.net/npm/moment@2.24.0/min/moment.min.js',
      ],
    }),

    new HtmlExternalWebpackPlugin({
      HtmlWebpackPlugin,
      context: __dirname,
      custom(data) {
        console.log('Calling custom function')
        return data
      },
    }),
  ],
}
