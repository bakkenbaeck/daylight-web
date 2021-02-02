const path = require('path');

const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
  entry: {
    app: './src/js/app.js',
  },
  output: {
    path: path.resolve(__dirname, '_site'),
    filename: process.env.ELEVENTY_ENV === 'production' ? '[name].[contenthash].js' : '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', {
              useBuiltIns: "usage",
              targets: "> 0.25%, not dead, not ie > 0",
              corejs: 3,
            }]]
          }
        }
      }
    ]
  },
  mode: process.env.ELEVENTY_ENV || 'production',
  devtool: 'source-map',
  plugins: [
    new WebpackManifestPlugin({
      fileName: path.resolve(__dirname, 'src/_data/paths.json'),
      publicPath: '/',
    }),
  ]
};
