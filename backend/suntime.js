const SunCalc = require('suncalc');

const leftPad = (int) => int >= 10 ? int : '0' + int;
const formateTime = date => `${leftPad(date.getHours())}:${leftPad(date.getMinutes())}`;

function get(date, location) {
  let yesterday = new Date();
  yesterday.setDate(date.getDate() - 1);

  const sun = {
    today: SunCalc.getTimes(date, location.latitude, location.longitude),
    yesterday: SunCalc.getTimes(yesterday, location.latitude, location.longitude) 
  }

  let theme = '';
  switch(date) {
    case date >= sun.today.sunrise && date <= sun.today.sunriseEnd:
      theme = 'sunrise';
      break;
    case date >= sun.today.sunriseEnd  && date <= sun.today.sunsetStart:
      theme = 'daylight';
      break;
    case date >= sun.today.sunsetStart && date <= sun.today.sunset:
      theme = 'sunset';
      break;
    case date >= sun.today.night:
      theme = 'night';
      break;
    default:
      theme = 'twilight';
      break;
  }

  const sunMinutes = {
    today: (sun.today.sunsetStart - sun.today.sunrise)  / 60000, 
    yesterday: (sun.yesterday.sunsetStart - sun.yesterday.sunrise) / 60000 
  }  

  return {
    theme, 
    minutes: Math.abs(Math.round(sunMinutes.yesterday - sunMinutes.today)),
    sunrise: formateTime(sun.today.sunrise),
    sunset: formateTime(sun.today.sunsetStart),
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

module.exports = {get, formateTime, generateSentence};