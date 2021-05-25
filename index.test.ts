import {NormalizedOutputOptions, OutputAsset, OutputBundle, OutputChunk, PluginContext} from 'rollup'
import htmlMinimize, {Options} from './index'

const mockAssetBundle = (fileName: string, source: string): OutputBundle => {
  const bundle: OutputBundle = {}

  bundle[fileName] = {
    fileName: fileName,
    isAsset: true,
    name: fileName,
    source: source,
    type: 'asset',
  }
  return bundle
}

const mockChunkBundle = (fileName: string, source: string): OutputBundle => {
  const bundle: OutputBundle = {}

  bundle[fileName] = {
    code: source,
    dynamicImports: [],
    exports: [],
    facadeModuleId: null,
    fileName: fileName,
    implicitlyLoadedBefore: [],
    importedBindings: {},
    imports: [],
    isDynamicEntry: false,
    isEntry: false,
    isImplicitEntry: false,
    modules: {},
    name: fileName,
    referencedFiles: [],
    type: 'chunk',
  }
  return bundle
}
const generateBundle = (bundle: OutputBundle, options?: Options): OutputBundle => {
  htmlMinimize(options).generateBundle?.call(null as unknown as PluginContext, null as unknown as NormalizedOutputOptions, bundle, false)
  return bundle
}

test('index.html is minimized', () => {
  const input = `<div draggable="true">
  <script type="text/javascript">
    function hello() {
      console.log('hello')
    }
    hello()
  </script>
  <a id="foo"></a>
</div>`
  const output = `<div draggable=true><script>function hello(){console.log("hello")}hello()</script><a id=foo></a></div>`

  expect((generateBundle(mockAssetBundle('index.html', input))['index.html'] as OutputAsset).source).toBe(output)
  expect((generateBundle(mockAssetBundle('index.htm', input))['index.htm'] as OutputAsset).source).toBe(output)
})

test('index.xml is not minimized because of filter', () => {
  const input = `<div id="foo"></div>`

  expect((generateBundle(mockAssetBundle('index.xml', input))['index.xml'] as OutputAsset).source).toBe(input)
})

test('index.xhtml is minimized with custom filter', () => {
  const input = `<div id="foo"></div>`
  const output = `<div id=foo></div>`

  expect((generateBundle(mockAssetBundle('index.xhtml', input), {
    filter: () => true,
  })['index.xhtml'] as OutputAsset).source).toBe(output)
})

test('chunks are ignored', () => {
  const input = `<div id="foo"></div>`
  const chunk = generateBundle(mockChunkBundle('index.html', input))['index.html']

  expect((chunk as OutputChunk).code).toBe(input)
  expect((chunk as OutputAsset).source).toBeUndefined()
})
