import App from './components/App';
import Store from './utils/Store';

const app = new App();

const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    Store.get('userLocation')
      .then(location => resolve(location))
      .catch(() => {
        const location = document.getElementById('app').dataset.location;
        if (location) {
          const [city, country,latitude,longitude] = location.split(':'); 
          resolve({
            city, country,
            location: {
              latitude,longitude
            }
          });
        } else {
          reject();
        }
      });
  });
}

getUserLocation().then(userLocation => {
  app.bootstrap(userLocation);
}).catch(() => {
  app.getUserLocation().then(userLocation => {
    app.bootstrap(userLocation);
  });
});