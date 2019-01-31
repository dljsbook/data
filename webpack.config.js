const path = require('path');

module.exports = {
  mode: 'development',
  entry: './dist/index.js',
  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dljsbookData.umd.min.js',
    library: 'dljsbookData',
    libraryTarget: 'umd',
  },
  externals: {
    '@tensorflow/tfjs': 'tf',
    '@tensorflow/tfjs-vis': 'tfvis',
  }
};
