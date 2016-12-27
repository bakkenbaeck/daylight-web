import sunCalc from '../../shared/sunCalc';
import Daylight from './Daylight';
import Store from './Store';

class App {
  constructor(userLocation) {
    this.now = new Date();
    this.timeInterval = null;
    this.userLocation = userLocation;
    this.rootElement = document.documentElement;
    
    this.daylight = new Daylight();
    this.sunObject = sunCalc.getDay(this.now, this.userLocation.locaton);
    
    this.update = this.update.bind(this);
    this.onVisibilitychange = this.onVisibilitychange.bind(this);
  
    this.startInterval();
    this._addEventListener();
  }

  _addEventListener() {
    document.addEventListener('visibilitychange', this.onVisibilitychange);
  }

  startInterval() {
    setTimeout(() => {
      this.update();
      this.timeInterval = setInterval(this.update, 60000);
    }, (60 - new Date().getSeconds()) * 1000);
  }

  onVisibilitychange() {
    if (document.hidden) {
      clearInterval(this.timeInterval);
    } else  {
      this.update();
      this.startInterval();
    }
  }

  update() {
    const now = new Date();
    const sunObject = sunCalc.getDay(now, this.userLocation.locaton);

    if (sunObject.theme !== this.sunObject.theme) {
      this.updateTheme(this.sunObject, sunObject);
    }

    if (this.now.toDateString() !== now.toDateString()) {
      this.daylight.render(now, sunObject);
      this.now = now;
      this.sunObject = sunObject;
    }

    const position = (now - this.sunObject.sunrise) / (this.sunObject.sunset - this.sunObject.sunrise);
    this.daylight.setSunPosition(now, sunCalc.getSunPosition(position));
  }

  updateTheme(oldSunobject, newSunobject) {
    this.rootElement.classList.remove(`theme-${oldSunobject.theme}`);
    this.rootElement.classList.add(`theme-${newSunobject.theme}`);
    
    if (this.sunObject.theme === 'night') {
      this.updateSentence(this.sunObject.daylight, this.sunObject.theme);
    }
    
    this.sunObject = newSunobject;
  }

  getUserLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        location => this.reverseGeocode(location.coords)
          .then(location => resolve(location))
          .catch(location => resolve(location)),
        error => reject(error), 
        { enableHighAccuracy: false }
      );
    });
  }

  reverseGeocode(location) {
    const data = {
      location: {
        latitude: location.latitude, 
        longitude: location.longitude,
      },
      city: null,
      country: null,
    }

    return new Promise((resolve, reject) => {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&addressdetails=1`;
      this.request = new XMLHttpRequest();
      this.request.onload = event => {
        const address = event.target.response.address;
        data.city = address.city;
        data.country = address.country;
        resolve(data);
      }
      this.request.onerror = event => reject(data);
      this.request.open('GET', url, true);
      this.request.responseType = 'json';
      this.request.send();
    });
  }

}

export default App