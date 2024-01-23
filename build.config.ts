import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  declaration: 'compatible',
  entries: ['src/index'],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
