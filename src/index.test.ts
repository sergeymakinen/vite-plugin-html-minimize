import { NormalizedOutputOptions, OutputAsset, OutputBundle, OutputChunk, PluginContext } from 'rollup'
import htmlMinimize, { Options } from './index'

const mockAssetBundle = (fileName: string, source: string): OutputBundle => {
  const bundle: OutputBundle = {}
  const asset: OutputAsset = {
    fileName: fileName,
    name: fileName,
    needsCodeReference: false,
    source: source,
    type: 'asset',
  }

  bundle[fileName] = asset
  return bundle
}

const mockChunkBundle = (fileName: string, source: string): OutputBundle => {
  const bundle: OutputBundle = {}
  const chunk: OutputChunk = {
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
    map: null,
    moduleIds: [],
    modules: {},
    name: fileName,
    preliminaryFileName: '',
    referencedFiles: [],
    sourcemapFileName: null,
    type: 'chunk',
  }

  bundle[fileName] = chunk
  return bundle
}

async function generateBundle(bundle: OutputBundle, options?: Options): Promise<OutputBundle> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await htmlMinimize(options).generateBundle!.call(
    null as unknown as PluginContext,
    null as unknown as NormalizedOutputOptions,
    bundle,
    false,
  )
  return bundle
}

test('index.html is minimized', async () => {
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

  expect(((await generateBundle(mockAssetBundle('index.html', input)))['index.html'] as OutputAsset).source).toBe(
    output,
  )
  expect(((await generateBundle(mockAssetBundle('index.htm', input)))['index.htm'] as OutputAsset).source).toBe(output)
})

test('index.xml is not minimized because of filter', async () => {
  const input = `<div id="foo"></div>`

  expect(((await generateBundle(mockAssetBundle('index.xml', input)))['index.xml'] as OutputAsset).source).toBe(input)
})

test('index.xhtml is minimized with custom filter', async () => {
  const input = `<div id="foo"></div>`
  const output = `<div id=foo></div>`

  expect(
    (
      (
        await generateBundle(mockAssetBundle('index.xhtml', input), {
          filter: () => true,
        })
      )['index.xhtml'] as OutputAsset
    ).source,
  ).toBe(output)
})

test('chunks are ignored', async () => {
  const input = `<div id="foo"></div>`
  const chunk = (await generateBundle(mockChunkBundle('index.html', input)))['index.html']

  expect((chunk as OutputChunk).code).toBe(input)
  expect((chunk as OutputAsset).source).toBeUndefined()
})
