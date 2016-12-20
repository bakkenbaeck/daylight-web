const config = require('./contour');
const {source, dest} = config.paths;

const entry = {};

config.tasks.webpack.entries.forEach(file => {
  entry[file] = `${source}/javascript/${file}`;
});

module.exports = {
  entry,
  output: {
    path: dest,
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
