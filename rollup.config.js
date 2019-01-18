// rollup.config.js
import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'dljsbookData',
    globals: {
      vega: 'vega',
      '@tensorflow/tfjs-vis': 'tfvis',
      '@tensorflow/tfjs': 'tf',
      Papa: 'papaparse',
    }
  },
  plugins: [
    typescript({
    }),
  ],
  external: [
    '@tensorflow/tfjs',
    '@tensorflow/tfjs-vis',
    'vega',
    'vega-parser',
    'vega-embed',
    'papaparse',
  ],
}
