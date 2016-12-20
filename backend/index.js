'use strict';

const path = require('path');

const express = require('express');
const geoip = require('geo-from-ip');
const fs = require('mz/fs');

const app = express();
let index = '';

cacheIndex();

app.get('/app', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  try {
    const location = geoip.allData(ip);
    replaceContent(location).then(html => res.send(html))
  } catch(e) {
    replaceContent().then(html => res.send(html))
  };

  
});

function replaceContent(location = null) {
  return new Promise(resolve => resolve(index.replace('{{location}}', JSON.stringify(location))));
}

function cacheIndex() {
  fs.readFile(path.resolve(__dirname, '../public/app/index.html'), 'utf8').then(html => {
    index = html;
  })
}

app.use(express.static('public'));

app.listen(process.env.PORT || 5000, () => {
  console.log('Running on port ' + process.env.PORT || 5000);
});