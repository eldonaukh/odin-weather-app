const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map', // Lightweight maps for production errors
  output: {
    // [contenthash] ensures browsers download new files only when code changes
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/[name].[hash][ext]',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        // Use MiniCssExtractPlugin instead of style-loader in production
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  optimization: {
    minimizer: [
      `...`, // Keeps default JS minifier (Terser)
      new CssMinimizerPlugin(), // Minifies CSS
    ],
    splitChunks: {
      chunks: 'all', // Splits vendor code (node_modules) into separate files
    },
  },
});