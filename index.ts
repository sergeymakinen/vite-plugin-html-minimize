import {minify, Options as MinifierOptions} from "html-minifier-terser"
import {Plugin} from "vite"

const defaultOptions: MinifierOptions = {
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
}

export type Filter = RegExp | ((fileName: string) => boolean);

export interface Options {
  filter?: Filter;

  minifierOptions?: MinifierOptions;
}

const filterFileName = (fileName: string, filter: Filter | undefined) => {
  if (filter instanceof RegExp) {
    return filter.test(fileName)
  }
  if (typeof filter === "function") {
    return filter(fileName)
  }
  return true
}

export default (options: Options = {}): Plugin => {
  const {
    filter = /\.html?$/,
    minifierOptions = defaultOptions,
  } = options
  return {
    name: "html-minimize",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      for (const [, outBundle] of Object.entries(bundle)) {
        if (outBundle.type === "asset" && filterFileName(outBundle.fileName, filter)) {
          outBundle.source = minify(outBundle.source as string, minifierOptions)
        }
      }
    },
  }
}
