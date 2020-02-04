import json from '@rollup/plugin-json'
import progress from 'rollup-plugin-progress'
import sourceMaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

const IS_PROD = process.env.NODE_ENV === 'production'

export default {
  input: {
    index: 'src/index.ts',
    runtime: 'src/runtime.ts',
  },
  output: {
    entryFileNames: '[name].js',
    format: 'cjs',
    dir: 'dist',
    sourcemap: true,
  },
  external: [...Object.keys(pkg.dependencies || {}), '@babel/core'],
  plugins: [
    progress(),
    json(),
    typescript({
      typescript: require('typescript'),
      clean: IS_PROD,
      objectHashIgnoreUnknownHack: true,
    }),
    sourceMaps(),
    IS_PROD &&
      terser({
        sourcemap: true,
        output: { comments: false },
        compress: {
          keep_infinity: true,
          pure_getters: true,
          passes: 2,
        },
        warnings: true,
      }),
  ].filter(Boolean),
}
