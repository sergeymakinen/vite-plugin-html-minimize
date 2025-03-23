# @sergeymakinen/vite-plugin-html-minimize

[![Test](https://github.com/sergeymakinen/vite-plugin-html-minimize/workflows/test/badge.svg)](https://github.com/sergeymakinen/vite-plugin-html-minimize/actions?query=workflow%3Atest)
[![npm](https://img.shields.io/npm/v/@sergeymakinen/vite-plugin-html-minimize)](https://www.npmjs.com/package/@sergeymakinen/vite-plugin-html-minimize)
[![codecov](https://codecov.io/gh/sergeymakinen/vite-plugin-html-minimize/branch/main/graph/badge.svg)](https://codecov.io/gh/sergeymakinen/vite-plugin-html-minimize)

This plugin is a HTML minimizer/minifier for Vite

## Usage

```js
// vite.config.js
import htmlMinimize from '@sergeymakinen/vite-plugin-html-minimize'

export default {
  plugins: [
    htmlMinimize({
      filter: /\.x?html?$/
    })
  ]
}
```

## Options

### `filter`

- **Type:** `RegExp | ((fileName: string) => boolean)`
- **Default:** `/\.html?$/`

  Regular expression or function to filter assets by file name.

### `minifierOptions`

- **Type:** `import('html-minifier-terser').Options`
- **Default:**
  ```js
  {
    collapseWhitespace: true,
    html5: true,
    keepClosingSlash: true,
    minifyCSS: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  }
  ```

  Minifier options passed to [html-minifier-terser](https://github.com/terser/html-minifier-terser#options-quick-reference).
