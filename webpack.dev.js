const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map', // Best for debugging
  devServer: {
    static: './dist',
    watchFiles: ['./index.html'], // Watch HTML for changes too
    hot: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        // style-loader injects CSS into the DOM for faster updates
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
});