module.exports = {
  entry: {
    index: './javascript/app/index.js'
  },
  output: {
    path: './public',
    publicPath: '/',
    filename: '[name].js',
  },
  stats: {
    colors: true,
    reasons: true
  },
  module: {
    loaders: [{
      test: /.js?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015']
      }
    }]
  },
  plugins: []
};