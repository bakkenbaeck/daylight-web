const leftPad = (int) => int >= 10 ? int : '0' + int;
const formateTime = date => `${leftPad(date.getHours())}:${leftPad(date.getMinutes())}`;

const getSunPosition = position => {
  const progress = (Math.PI + (position * Math.PI));
  return {
    x: 50 + Math.cos(progress) * 50,
    y: Math.sin(progress) * 100,
  }
}

const sunrise = new Date(2016, 11, 11, 09, 08);
const sunset = new Date(2016, 11, 11, 15, 13);


class SunGraph {
  constructor() {
    this.graph = document.querySelector('.graph__sun');
    this.sun = document.querySelector('.graph__current');
    const {height, width} = this.graph.getBoundingClientRect();
    this.props = {height, width};
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
        }, new Date().getSeconds() * 1000);
      });
    });
  }

  update() {
    return new Promise(resolve => {
      const now = new Date();

      if (now >= sunset || now <= sunrise) { return resolve(); }

      const time = formateTime(now);
      const position = (now - sunrise) / (sunset - sunrise);

      let {x,y} = getSunPosition(position);
      x = ((this.props.width / 100) * x);
      y = ((this.props.height / 100) * y);

      requestAnimationFrame(() => {
        this.sun.innerHTML = time;
        this.sun.setAttribute('datetime', time)
        this.sun.style.transform = `translate(${x}px, ${y}px)`;
        resolve();  
      });
    });
  }

}


const graph = new SunGraph();
graph.init();