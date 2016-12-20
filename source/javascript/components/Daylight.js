import {timeFormatter, generateSentence} from '../utils/utils';

class Daylight {
  constructor() {
    this.sun = document.querySelector('.js-sun');
    this.sentence = document.querySelector('.js-sentence');
    this.location = document.querySelector('.js-location');
    this.sunrise = document.querySelector('.js-sunrise');
    this.sunset = document.querySelector('.js-sunset');
    this.sunVisible = this.sun.classList.contains('show-time');
  }

  setSunPosition(time, position) {
    if (position.x <= 0 && position.y <= 0) {
      if (this.visibleSun) {
        this.visibleSun = false;
        this.sun.removeAttribute('style');
        this.sun.classList.remove('show-time');
      }
    } else {
      if (!this.visibleSun) {
        this.visibleSun = true;
        this.sun.classList.add('show-time');
      }
      requestAnimationFrame(() => {
        this.sun.dataset.time = timeFormatter(time);
        this.sun.style.bottom = `${position.y}%`;
        this.sun.style.left = `${position.x}%`  ;
      });
    }
  }

  updateSentence(daylight, theme) {
    this.sentence.innerHTML = generateSentence(daylight, theme);
  }

  setLocation(location) {
    this.location.textContent = `${location.city}, ${location.country}`; 
  }

  updateTimes(sunObject) {
    const sunrise = timeFormatter(sunObject.sunrise);
    const sunset = timeFormatter(sunObject.sunset);

    this.sunrise.textContent = sunrise;
    this.sunrise.setAttribute('datetime', sunrise);

    this.sunset.textContent = sunset;
    this.sunset.setAttribute('datetime', sunset);
  }

  render(sunObject, location = null) {
    this.updateSentence(sunObject.daylight, sunObject.theme);
    this.updateTimes(sunObject);
    if (location) {
      this.setLocation(location)
    }
  }

}

export default Daylight