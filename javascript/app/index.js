import Horizon from './components/horizon';
import Store from './store';

class Sol {
  constructor() {
    const app = document.getElementById('app');
    const {latitude, longitude, city, country} = app.dataset;
    const now = new Date();

    this.sentence = document.querySelector('.js-sentence');
    this.place = document.querySelector('.js-place');

    this.location = { 
      location: {latitude, longitude},
      city, country
    };

    this.horizon = new Horizon(now, this.location.location);
    this.horizon.init();

    Store.get('location').catch(() => Store.set('location', this.location));

    this.getUserLocation().then(position => {
      if (this.location.city !== position.city) {
        Store.set('location', position);
        this.location = position;
        this.updateUI();
      }
    }).catch(error => {
      console.log(error);
    });

  }

  updateUI() {
    this.place.textContent = `${this.location.city}, ${this.location.country}`;
    this.horizon.updateUI(this.location.location).then(sentence => {
      this.sentence.innerHTML = sentence;
    })
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
          location: {
            latitude: position.lat, 
            longitude: position.lon,
          },
          city: position.address.city,
          country: position.address.country
        }
      });
  }

}

new Sol();




