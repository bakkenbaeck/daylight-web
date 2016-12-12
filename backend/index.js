'use strict';

process.env.TZ = 'Europe/Oslo';

const express = require('express');
const geoip = require('geo-from-ip');
const Handlebars = require('handlebars');
const fs = require('mz/fs');

const utils = require('../javascript/shared/utils');
const sunCalc = require('../javascript/shared/sunCalc');

const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
  const now = new Date();
  //const now = new Date(2016, 11, 13, 9, 0);
  
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  //const {city, country, location} = geoip.allData(ip);
  const {city, country, location} = geoip.allData('185.55.105.254');
  const {theme, sunrise, sunset, daylight} = sunCalc.getDay(now, location);
  const progress = (now - sunrise) / (sunset - sunrise);
  const {x, y} = sunCalc.getSunPosition(progress)

  const data = {
    theme,
    now: utils.timeFormatter(now),
    sunrise: {
      time: sunrise,
      display: utils.timeFormatter(sunrise),
    },
    sunset: {
      time: sunset,
      display: utils.timeFormatter(sunset),
    },
    city, 
    country,
    location,
    sunPosition: {x,y},
    sentence: utils.generateSentence(daylight, theme),
  }

  fs.readFile('./backend/template.hbs', 'utf8').then(html => {
    const template = Handlebars.compile(html);
    res.send(template(data));
  });
});


app.listen(23886, () => {
  console.log('Running on port 23886')
});