import SunCalc from "suncalc";

const _daylight = (sunObject) =>
  (sunObject.sunset - sunObject.sunriseEnd) / 60000;
const _daylightDiff = (x, y) => Math.abs(Math.round(x - y));

function getTheme(date, sun) {
  if (date >= sun.sunrise && date <= sun.sunriseEnd) {
    return "sunrise";
  } else if (date >= sun.sunriseEnd && date <= sun.sunsetStart) {
    return "daylight";
  } else if (date >= sun.sunsetStart && date <= sun.sunset) {
    return "sunset";
  } else if (date >= sun.night || date <= sun.nightEnd) {
    return "night";
  } else {
    return "twilight";
  }
}

function getDay(date, location) {
  const { latitude, longitude } = location;
  let yesterday = new Date();
  let tomorrow = new Date();
  yesterday.setDate(date.getDate() - 1);
  tomorrow.setDate(date.getDate() + 1);

  const days = {
    yesterday: SunCalc.getTimes(yesterday, latitude, longitude),
    date: SunCalc.getTimes(date, latitude, longitude),
    tomorrow: SunCalc.getTimes(tomorrow, latitude, longitude),
  };

  const daylight = {
    yesterday: _daylight(days.yesterday),
    date: _daylight(days.date),
    tomorrow: _daylight(days.tomorrow),
  };

  return {
    theme: getTheme(date, days.date),
    sunrise: days.date.sunrise,
    sunset: days.date.sunset,
    daylight: {
      today: {
        minutes: _daylightDiff(daylight.yesterday, daylight.date),
        positive: daylight.date > daylight.yesterday,
      },
      tomorrow: {
        minutes: _daylightDiff(daylight.tomorrow, daylight.date),
        positive: daylight.tomorrow > daylight.date,
      },
    },
  };
}

const getSunPosition = (progress) => {
  const position = Math.PI + progress * Math.PI;
  let x = 0;
  let y = 0;

  if (progress > 1 || progress < 0) {
    return { x, y };
  }

  x = 50 + Math.cos(position) * 50;
  y = Math.abs(Math.sin(position) * 100);
  return { x, y };
};

export { getSunPosition, getDay };
