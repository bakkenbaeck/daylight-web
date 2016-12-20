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
          resolve(JSON.parse(location));
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

/*
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
*/