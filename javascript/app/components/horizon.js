import utils from '../../shared/utils';
import sunCalc from '../../shared/sunCalc';

class Horizon {
  constructor(sunrise, sunset) {
    this.sunrise = sunrise;
    this.sunset = sunset;

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