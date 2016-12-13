import Horizon from './components/horizon';
import Store from './store';

class Sol {
  constructor() {

    const app = document.getElementById('app');
    const {latitude, longitude, city, country} = app.dataset;
    const location = { 
      location: {latitude, longitude},
      city, country
    };
    const now = new Date();

    Store.set('location', location);

    const horizon = new Horizon(now, location.location);
    horizon.init();

    this.getUserLocation().then(position => {
      if (location.city !== position.city) {
        Store.set('location', position);
        console.log('update ui with new location');
      }
    }).catch(error => {
      console.log(error);
    });

  }

  getUserLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        location => resolve(this.reverseGeocode(location.coords).then(location => location)),
        error => reject(error), 
        { enableHighAccuracy: false }
      );
    });
  }

  reverseGeocode(location) {
    return fetch(`http://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&addressdetails=1`)
      .then(resp => resp.json())
      .then(position => {
        return {
          location,
          city: position.address.city,
          country: position.address.country
        }
      });
  }

}

new Sol();




