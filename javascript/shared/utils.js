const leftPad = (int) => int >= 10 ? int : '0' + int;
const timeFormatter = date => `${leftPad(date.getHours())}:${leftPad(date.getMinutes())}`;

const generateSentence = (daylight, theme) => {
  const sentences = {
    day: {
      positive: [
        '<span class="muted">Today, you have</span> <b>{{min}} minutes</b> <span class="muted">more sunlight than yesterday. Enjoy!</span>',
        '<span class="muted">You’ve got</span> <b>{{min}} more minutes</b> <span class="muted">of sunlight today. How will you spend them?</span>',
        '<span class="muted">Happy days! This day is</span> <b>{{min}} minutes</b> <span class="muted">longer than yesterday. Will you make it count?</span>',
        '<span class="muted">Today brings you</span> <b>{{min}} extra minutes</b> <span class="muted">of daylight. Enjoy it while it’s there!</span>',
        '<span class="muted">You know what? You can enjoy</span> <b>{{min}} more minutes</b> <span class="muted">of daylight today!</span>',
      ],
      negative: [
        '<span class="muted">Buu, today it\'s</span> <b>{{min}} minutes</b> <span class="muted">less sunlight than yesterday..</span>',
      ]
    },
    night: {
      positive: [
        '<span>The sun has set, but don\'t worry. Tomorrow there is</span> <b>{{min}} more bright minutes</b> <span>for you.</span>',
      ],
      negative: [
        '<span>The sun has set, and that\'s pretty sad. Tomorrow there is</span> <b>{{min}} less bright minutes</b> <span>:(</span>'
      ]
    }
  } 

  let type = '';
  let context = '';
  let min = 0;

  if (theme === 'night') {
    type = 'night';
    context = daylight.tomorrow.positive ? 'positive' : 'negative';
    min = daylight.tomorrow.minutes;
  } else {
    type = 'day';
    context = daylight.today.positive ? 'positive' : 'negative';
    min = daylight.today.minutes;
  }

  const current = sentences[type][context];
  return current[Math.floor(Math.random() * current.length)].split('{{min}}').join(min);
}



module.exports = {leftPad, timeFormatter, generateSentence};