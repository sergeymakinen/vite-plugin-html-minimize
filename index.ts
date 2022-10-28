import { minify, Options as MinifierOptions } from 'html-minifier-terser'
import { Plugin } from 'vite'

const defaultOptions: MinifierOptions = {
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

export interface Options {
  /**
   * Regular expression or function to filter assets by file name.
   * @default /\.html?$/
   */
  filter?: RegExp | ((fileName: string) => boolean)

  /**
   * Minifier options passed to html-minifier-terser.
   * @default { collapseWhitespace: true, keepClosingSlash: true, removeAttributeQuotes: true, removeComments: true, removeRedundantAttributes: true, removeScriptTypeAttributes: true, removeStyleLinkTypeAttributes: true, useShortDoctype: true }
   */
  minifierOptions?: MinifierOptions
}

const filterFileName = (fileName: string, filter: RegExp | ((fileName: string) => boolean) | undefined) => {
  if (filter instanceof RegExp) {
    return filter.test(fileName)
  }
  if (typeof filter === 'function') {
    return filter(fileName)
  }
  return true
}

export default (options: Options = {}): Plugin => {
  const { filter = /\.html?$/, minifierOptions = defaultOptions } = options

  return {
    name: 'html-minimize',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      for (const outBundle of Object.values(bundle)) {
        if (outBundle.type === 'asset' && filterFileName(outBundle.fileName, filter)) {
          outBundle.source = minify(outBundle.source as string, minifierOptions)
        }
      }
    },
  }
}
