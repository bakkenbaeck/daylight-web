const leftPad = (int) => (int >= 10 ? int : "0" + int);
const timeFormatter = (date) =>
  `${leftPad(date.getHours() ? date.getHours() : 0)}:${leftPad(
    date.getMinutes() ? date.getMinutes() : 0
  )}`;

const generateSentence = (daylight, theme) => {
  const minutes =
    theme === "night" ? daylight.tomorrow.minutes : daylight.today.minutes;
  const minuteString = minutes > 1 ? "minutes" : "minute";

  const sentences = {
    day: {
      positive: {
        minutes: [
          `<span class="muted">Today is</span> <b>${minutes} ${minuteString}</b> <span class="muted">longer than yesterday. Happy days!</span>`,
          `<span class="muted">The sun is out for</span> <b>${minutes} more ${minuteString}</b> <span class="muted">today. Enjoy!</span>`,
          `<b>${minutes} extra ${minuteString}</b> <span class="muted">of sunshine today. Make them count!</span>`,
          `<span class="muted">Make sure to soak up that vitamin D.</span> <b>${minutes} more ${minuteString}</b> <span class="muted">of daylight today!</span>`,
          `<span class="muted">Smile! Today has</span> <b>${minutes} more ${minuteString}</b> <span class="muted">of daylight than yesterday! </span>`,
          `<b>${minutes} more ${minuteString}</b> <span class="muted">of daylight today. Just let it sink in…</span>`,
          `<span class="muted">Today is</span> <b>${minutes} ${minuteString} longer</b>. <span class="muted">It’s getting better and better!</span>`,
          `<span class="muted">Bring out your shorts, because today has</span> <b>${minutes} more ${minuteString}</b> <span class="muted">of sunlight.</span>`,
          `<span class="muted">Have a great day and enjoy those</span> <b>${minutes} extra ${minuteString}</b> <span class="muted">of daylight.</span>`,
          `<span class="muted">After darkness comes daylight.</span> <b>${minutes} more ${minuteString}</b> <span class="muted">to be precise!</span>`,
        ],
        seconds: [
          `<span class="muted">Little less than</span> <b>a minute</b> <span class="muted">of extra sunlight today. It’s getting better!</span>`,
          `<span class="muted">We’ve reached the tipping point: we’ll have more sunlight every day now!</span>`,
          `<b>About a minute</b> <span class="muted">of extra light. You’ll start noticing the difference soon!</span>`,
          `<span class="muted">There’s</span> <b>about a minute</b> <span class="muted">of extra light at the end of this tunnel.</span>`,
          `<span class="muted">We’ll have</span> <b>about a minute</b> <span class="muted">of extra light today. It’s upwards from here.</span>`,
        ],
      },
      negative: {
        minutes: [
          `<span class="muted">The sun will be out</span> <b>${minutes} ${minuteString} less</b> <span class="muted">today. Keep your head up!</span>`,
          `<b>${minutes} ${minuteString} less</b> <span class="muted">sunlight today, unfortunately. It’ll get better!</span>`,
          `<span class="muted">Sadly, the day will be</span> <b>${minutes} ${minuteString} shorter</b><span class="muted">. Make the most out of it!</span>`,
        ],
        seconds: [
          `<span class="muted">Unfortunately, the day is a little bit shorter today. Make the most out of it!</span>`,
          `<span class="muted">Sadly, today is a tiny bit shorter than yesterday. Enjoy it while it lasts!</span>`,
          `<span class="muted">Today is shorter than yesterday. But fear not, brighter times ahead!</span>`,
        ],
      },
    },
    night: {
      positive: {
        minutes: [
          `<span class="muted">Get a good night’s sleep: tomorrow there’ll be</span> <b>${minutes} more ${minuteString}</b> <span class="muted">of sunlight.</span>`,
          `<span class="muted">Lights out. Enjoy</span> <b>${minutes} more ${minuteString}</b> <span class="muted">of sunlight tomorrow!</span>`,
          `<span class="muted">Bring out those pyjamas.</span> <b>${minutes} more ${minuteString}</b> <span class="muted">of light await tomorrow.</span>`,
          `<span class="muted">The sun has set for today. Embrace those</span> <b>${minutes} ${minuteString}</b> <span class="muted">of extra daylight tomorrow.</span>`,
          `<span class="muted">The sun has set. Soak up the extra vitamin D tomorrow!</span>`,
        ],
        seconds: [
          `<span class="muted">Get a good night’s sleep: tomorrow there’ll be more sunlight for you.</span>`,
          `<span class="muted">Bring out those pyjamas. More daylight awaits tomorrow!</span>`,
          `<span class="muted">The sun has set. Soak up the extra vitamin D tomorrow!</span>`,
        ],
      },
      negative: {
        minutes: [
          `<span class="muted">Unfortunately, tomorrow will be</span> <b>${minutes} ${minuteString}</b> <span class="muted">shorter than today. Make the most out of it!</span>`,
          `<span class="muted">Sadly, tomorrow will be</span> <b>${minutes} ${minuteString}</b> <span class="muted">shorter than today. Enjoy it while it lasts!</span>`,
          `<span class="muted">Tomorrow will be</span> <b>${minutes} ${minuteString}</b> <span class="muted">shorter than today. But fear not, brighter times ahead!</span>`,
        ],
        seconds: [
          `<span class="muted">Unfortunately, tomorrow will be a little bit shorter than today. Make the most out of it!</span>`,
          `<span class="muted">Sadly, tomorrow will be a tiny bit shorter than today. Enjoy it while it lasts!</span>`,
          `<span class="muted">Tomorrow will be shorter than today. But fear not, brighter times ahead!</span>`,
        ],
      },
    },
  };

  const phase = theme === "night" ? "night" : "day";
  const feeling = daylight[theme === "night" ? "tomorrow" : "today"].positive
    ? "positive"
    : "negative";
  const sunLength = minutes >= 1 ? "minutes" : "seconds";

  let sentenceArray = sentences[phase][feeling][sunLength];
  return sentenceArray[Math.floor(Math.random() * sentenceArray.length)];
};

export { timeFormatter, generateSentence };
