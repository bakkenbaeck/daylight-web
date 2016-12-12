'use strict';
const fs = require('mz/fs')
const path = require('path');
const webpackConfig = require('./webpack');
const mainfestPath = path.join(__dirname, 'webpack.manifest.json');

webpackConfig.output.filename = '[name].[hash].js';
webpackConfig.plugins.push(
  function() {
    this.plugin('done', function(stats) {
      fs.unlink(mainfestPath, () => {
        const stat = stats.toJson();
        const result = {};
        for (var key in stat.assetsByChunkName) {
          const chunks = stat.assetsByChunkName[key];
          result[`/${key}.js`] = `/${Array.isArray(chunks) ? chunks[0] : chunks}`;
        }
        fs.writeFileSync(mainfestPath, JSON.stringify(result));
      });
    });
  }
);
module.exports = webpackConfig;