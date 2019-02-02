# html-external-webpack-plugin

> add external js,css to html-webpack-plugin

[![Build Status](https://img.shields.io/travis/magicdawn/html-external-webpack-plugin.svg?style=flat-square)](https://travis-ci.org/magicdawn/html-external-webpack-plugin)
[![Coverage Status](https://img.shields.io/codecov/c/github/magicdawn/html-external-webpack-plugin.svg?style=flat-square)](https://codecov.io/gh/magicdawn/html-external-webpack-plugin)
[![npm version](https://img.shields.io/npm/v/html-external-webpack-plugin.svg?style=flat-square)](https://www.npmjs.com/package/html-external-webpack-plugin)
[![npm downloads](https://img.shields.io/npm/dm/html-external-webpack-plugin.svg?style=flat-square)](https://www.npmjs.com/package/html-external-webpack-plugin)
[![npm license](https://img.shields.io/npm/l/html-external-webpack-plugin.svg?style=flat-square)](http://magicdawn.mit-license.org)

## Install

```sh
$ npm i html-external-webpack-plugin --save
```

## API

```js
const HtmlExternalWebpackPlugin = require('html-external-webpack-plugin')

// webpack.config.js
plugins: [
  new HtmlWebpackPlugin(),
  new HtmlExternalWebpackPlugin({
    HtmlWebpackPlugin,
    context: __dirname,

    css: [],
    js: [],
    jsCDN: '',
  }),
]
```

## options

| name                        | type       | desc                                     |
| --------------------------- | ---------- | ---------------------------------------- |
| `options.HtmlWebpackPlugin` |            | the `HtmlWebpackPlugin` reference        |
| `options.context`           | `String`   | the context dir for resolve dep          |
| `options.css`               | `[]String` | extra css to add                         |
| `options.js`                | `[]JsType` | extra js to add                          |
| `options.jsCDN`             | `String`   | available `unpkg` / `baidu` / `jsdelivr` |

### JsType

supported `JsType`

| type                     | desc                    | example                                                       |
| ------------------------ | ----------------------- | ------------------------------------------------------------- |
| `String` `fullUrl`       | the js src              | `https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js` |
| `String` `url`           | the js src              | `/npm/axios@0.18.0/dist/axios.min.js`                         |
| `Sytring` `package-name` | the package name        | `vue`                                                         |
| `Object`                 | `{name, version, path}` | `{ name: 'lodash', version: '4.0.0',path: '/lodash.min.js'}`  |

## Changelog

[CHANGELOG.md](CHANGELOG.md)

## License

the MIT License http://magicdawn.mit-license.org
