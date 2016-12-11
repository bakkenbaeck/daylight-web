'use strict';

const express = require('express');
const geoip = require('geo-from-ip');
const Handlebars = require('handlebars');
const fs = require('mz/fs');

const suntime = require('./suntime');

const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
  const now = new Date();
  //const now = new Date(2016, 11, 10, 9, 30);
  
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  //const {city, country, location} = geoip.allData(ip);
  const {city, country, location} = geoip.allData('185.55.105.254');
  const {theme, sunrise, sunset, minutes} = suntime.get(now, location);
  
  const position = (now - sunrise) / (sunset - sunrise);

  const {x, y} = suntime.getSunPosition(position)

  const data = {
    theme,
    sunrise: suntime.formateTime(sunrise),
    sunset: suntime.formateTime(sunset),
    city, 
    country,
    sunPosition: {
      x,
      y: Math.abs(y),
    },
    now: suntime.formateTime(now),
    sentence: suntime.generateSentence(minutes),
  }

  fs.readFile('./backend/template.hbs', 'utf8').then(html => {
    const template = Handlebars.compile(html);
    res.send(template(data));
  });
});


app.listen(23886, () => {
  console.log('Running on port 23886')
});