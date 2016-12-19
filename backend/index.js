'use strict';

const path = require('path');

const express = require('express');
const geoip = require('geo-from-ip');
const fs = require('mz/fs');

const app = express();
let index = '';

cacheIndex();

app.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  //const {city, country, location} = geoip.allData(ip);

  replaceContent(geoip.allData('185.55.105.254')).then(html => res.send(html))
});

function replaceContent(location) {
  return new Promise(resolve => resolve(index.replace('{{location}}', JSON.stringify(location))));
}

function cacheIndex() {
  fs.readFile(path.resolve(__dirname, '../public/index.html'), 'utf8').then(html => {
    index = html;
  })
}

app.use(express.static('public'));

app.listen(23886, () => {
  console.log('Running on port 23886')
});