const path = require('path');

const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: {
    landing: ['./src/css/base.css', './src/css/landing.css'],
    app: ['./src/js/app.js', './src/css/base.css', './src/css/app.css'],
  },
  output: {
    path: path.resolve(__dirname, '_site'),
    filename: '[contenthash].js'
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
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, {loader: 'css-loader', options: { url: false }}]
      }
    ]
  },
  optimization: {
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
    ],
  },
  mode: process.env.ELEVENTY_ENV || 'production',
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({ filename: '[contenthash].css' }),
    new WebpackManifestPlugin({
      fileName: path.resolve(__dirname, 'src/_data/paths.json'),
      publicPath: '/',
    }),
  ]
};
