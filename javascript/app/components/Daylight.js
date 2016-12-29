import utils from '../../shared/utils';

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
        this.sun.classList.remove('show-time');
      }
    } else {
      if (!this.visibleSun) {
        this.visibleSun = true;
        this.sun.classList.add('show-time');
      }
      requestAnimationFrame(() => {
        this.sun.dataset.time = utils.timeFormatter(time);
        this.sun.style.bottom = `${position.y}%`;
        this.sun.style.left = `${position.x}%`  ;
      });
    }
  }

  updateSentence(daylight, theme) {
    utils.generateSentence(daylight, theme);
  }

  updateLocation(location) {
    this.location.textContent = `${location.city}, ${location.country}`; 
  }

  updateTimes(sunObject) {
    const sunrise = utils.timeFormatter(sunObject.sunrise);
    const sunset = utils.timeFormatter(sunObject.sunset);

    this.sunrise.textContent = sunrise;
    this.sunrise.setAttribute('datetime', sunrise);

    this.sunset.textContent = sunset;
    this.sunset.setAttribute('datetime', sunset);
  }

  render(sunObject) {
    this.updateSentence(sunObject.daylight, sunObject.theme);
    this.updateTimes(sunObject);
  }

}

export default Daylight