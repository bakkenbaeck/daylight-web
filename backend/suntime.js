const SunCalc = require('suncalc');

const leftPad = (int) => int >= 10 ? int : '0' + int;
const formateTime = date => `${leftPad(new Date(date).getHours())}:${leftPad(new Date(date).getMinutes())}`;

function get(date, location) {
  let yesterday = new Date();
  yesterday.setDate(date.getDate() - 1);

  const sun = {
    today: SunCalc.getTimes(date, location.latitude, location.longitude),
    yesterday: SunCalc.getTimes(yesterday, location.latitude, location.longitude) 
  }
  
  const sunMinutes = {
    today: (sun.today.sunsetStart - sun.today.sunrise)  / 60000, 
    yesterday: (sun.yesterday.sunsetStart - sun.yesterday.sunrise) / 60000 
  }  

  return {
    theme: getTheme(date, sun.today), 
    minutes: Math.abs(Math.round(sunMinutes.yesterday - sunMinutes.today)),
    sunrise: sun.today.sunrise,
    sunset: sun.today.sunset,
    positive: sunMinutes.yesterday < sunMinutes.today
  }
}

function generateSentence(min) {
  const sentences = [
    '<span class="muted">Today, you have</span> <b>{{min}} minutes</b> <span class="muted">more sunlight than yesterday. Enjoy!</span>',
    '<span class="muted">You’ve got</span> <b>{{min}} more minutes</b> <span class="muted">of sunlight today. How will you spend them?</span>',
    '<span class="muted">Happy days! This day is</span> <b>{{min}} minutes</b> <span class="muted">longer than yesterday. Will you make it count?</span>',
    '<span class="muted">Today brings you</span> <b>{{min}} extra minutes</b> <span class="muted">of daylight. Enjoy it while it’s there!</span>',
    '<span class="muted">You know what? You can enjoy</span> <b>{{min}} more minutes</b> <span class="muted">of daylight today!</span>',
  ];

  return sentences[Math.floor(Math.random() * sentences.length)].split('{{min}}').join(min);
}

function getTheme(date, sun) {
  if (date >= sun.sunrise && date <= sun.sunriseEnd) {
    return 'sunrise';
  } else if (date >= sun.sunriseEnd  && date <= sun.sunsetStart) {
    return 'daylight';
  } else if (date >= sun.sunsetStart && date <= sun.sunset) {
    return 'sunset';
  } else if (date >= sun.night) {
    return 'night';
  } else {
    return 'twilight';
  }
}

const getSunPosition = position => {
  const progress = (Math.PI + (position * Math.PI));
  return {
    x: 50 + Math.cos(progress) * 50,
    y: Math.sin(progress) * 100,
  }
}

module.exports = {get, formateTime, generateSentence, getSunPosition};