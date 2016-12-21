'use strict';

const path = require('path');

const express = require('express');
const geoip = require('geo-from-ip');
const fs = require('mz/fs');

const app = express();
let index = '';

cacheIndex();

app.get('/app', (req, res) => {
  let ipAddr = req.headers["x-forwarded-for"];
  if (ipAddr){
    const list = ipAddr.split(",");
    ipAddr = list[list.length-1];
  } else {
    ipAddr = req.connection.remoteAddress;
  }

  let location = null;
  try {
    location = geoip.allData(ipAddr);
    location = `${location.city}:${location.country}:${location.location.latitude}:${location.location.longitude}`;
  } catch(e) {}

  replaceContent(location).then(html => res.send(html));
});

// lets encrypt cert endpoint
app.get('/.well-known/acme-challenge/:content', (req, res) => {
  res.send(process.env.LETSENCRYPT_TOKEN);
});

function replaceContent(location = null) {
  return new Promise(resolve => resolve(index.replace('[[location]]', location)));
}

function cacheIndex() {
  fs.readFile(path.resolve(__dirname, '../public/app/index.html'), 'utf8').then(html => {
    index = html;
  })
}

app.use(express.static('public'));

app.listen(process.env.PORT || 4000, () => {
  console.log('Running on port ' + process.env.PORT || 4000);
});
