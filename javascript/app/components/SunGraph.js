import utils from '../../shared/utils';
import sunCalc from '../../shared/sunCalc';

class SunGraph {
  constructor(sunrise, sunset) {
    this.sunrise = sunrise;
    this.sunset = sunset;

    this.graph = document.querySelector('.graph__sun');
    this.sun = document.querySelector('.graph__current');
    const {height, width} = this.graph.getBoundingClientRect();
    this.props = {height, width};

    this.update = this.update.bind(this);
  }

  init() {
    this.sun.classList.remove('graph__current--static');
    this.sun.removeAttribute('style');
    this.update().then(() => {
      requestAnimationFrame(() => {
        this.sun.style.willChange = 'transform';
        this.sun.style.transition = 'transform 1s linear';

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

      x = ((this.props.width / 100) * x);
      y = ((this.props.height / 100) * y);

      requestAnimationFrame(() => {
        this.sun.innerHTML = time;
        this.sun.setAttribute('datetime', time)
        this.sun.style.transform = `translate(${x}px, ${-y}px)`;
        resolve();  
      });
    });
  }

}

export default SunGraph