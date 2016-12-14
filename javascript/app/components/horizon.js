import utils from '../../shared/utils';
import sunCalc from '../../shared/sunCalc';

class Horizon {
  constructor(date, location) {
    this.now = date; 
    this.currentLocation = location;
    this.sunObject = sunCalc.getDay(this.now, this.currentLocation);
    this.currentTheme = this.sunObject.theme;
    this.sunrise = this.sunObject.sunrise;
    this.sunset = this.sunObject.sunset;

    this.rootElement = document.documentElement;
    this.graph = document.querySelector('.horizon__sky');
    this.sun = document.querySelector('.js-sun');
    this.sunriseElement = document.querySelector('.js-sunrise');
    this.sunsetElement = document.querySelector('.js-sunset');

    this.update = this.update.bind(this);
  }

  init() {
    this.update().then(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.update();
          setInterval(this.update, 60000);
        }, (60 - new Date().getSeconds()) * 1000);
      });
    });
  }

  update() {
    return new Promise(resolve => {
      const now = new Date();
      const sunObject = sunCalc.getDay(now, this.currentLocation);
      
      if (sunObject.theme !== this.currentTheme) {
        this.rootElement.classList.remove(`theme-${this.currentTheme}`);
        this.rootElement.classList.add(`theme-${sunObject.theme}`);
        this.currentTheme = sunObject.theme;
      }

      if (this.now.toDateString() !== now.toDateString()) {
        this.now = now;
        this.sunObject = sunCalc.getDay(now, this.currentLocation);
        this.sunrise = this.sunObject.sunrise;
        this.sunset = this.sunObject.sunset;
        this.updateHorizen();
      }

      const time = utils.timeFormatter(now);
      const position = (now - this.sunrise) / (this.sunset - this.sunrise);
      let {x,y} = sunCalc.getSunPosition(position);

      if (x === 0 && y === 0) { return resolve(); }

      requestAnimationFrame(() => {
        this.sun.dataset.time = time;
        this.sun.style.bottom = y + '%';
        this.sun.style.left = x + '%';
        resolve();  
      });
    });
  }

  updateHorizen() {
    const sunset = utils.timeFormatter(this.sunset);
    const sunrise = utils.timeFormatter(this.sunrise);

    this.sunsetElement.textContent = sunset;
    this.sunsetElement.setAttribute('datetime', sunset);

    this.sunriseElement.textContent = sunrise;
    this.sunriseElement.setAttribute('datetime', sunrise);
  }

  updateUI(location) {
    return new Promise(resolve => {
      this.currentLocation = location;
      this.sunObject = sunCalc.getDay(new Date(), this.currentLocation);
      this.currentTheme = this.sunObject.theme;
      this.sunrise = this.sunObject.sunrise;
      this.sunset = this.sunObject.sunset;
      this.updateHorizen();
      resolve(utils.generateSentence(this.sunObject.daylight, this.currentTheme));
    });
  }


}

export default Horizon