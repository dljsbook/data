// rollup.config.js
import typescript from 'rollup-plugin-typescript';

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'dljsbookData',
  },
  plugins: [
    typescript(),
    // uglify(),
  ],
  external: [
    '@tensorflow/tfjs',
    '@tensorflow/tfjs-vis',
    'vega',
    'papaparse',
  ],
}
