const path = require('path');

module.exports = {
  mode: 'production',
  entry: './dist/index.js',
  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dljsData.umd.min.js',
    library: 'dljsData',
    libraryTarget: 'umd',
  },
  externals: {
    '@tensorflow/tfjs': 'tf',
    '@tensorflow/tfjs-vis': 'tfvis',
  }
};
