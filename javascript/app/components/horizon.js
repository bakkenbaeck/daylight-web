import utils from '../../shared/utils';
import sunCalc from '../../shared/sunCalc';

class Horizon {
  constructor(date, location) {
    this.now = date; 
    this.currentLocation = location;
    this.sunObject = sunCalc.getDay(this.now, this.currentLocation);
    this.currentTheme = thus.sunObject.theme
    this.sunrise = this.sunObject.sunrise;
    this.sunset = thus.sunObject.sunset;

    this.rootElement = document.documentElement;
    this.graph = document.querySelector('.horizon__sky');
    this.sun = document.querySelector('.js-sun');

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

      const time = utils.timeFormatter(now);
      const position = (now - this.sunrise) / (this.sunset - this.sunrise);
      let {x,y} = sunCalc.getSunPosition(position);

      requestAnimationFrame(() => {
        this.sun.innerHTML = time;
        this.sun.setAttribute('datetime', time)
        this.sun.style.bottom = y + '%';
        this.sun.style.left = x + '%';
        resolve();  
      });
    });
  }

}

export default Horizon