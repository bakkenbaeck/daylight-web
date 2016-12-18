import App from './components/App';

const app = document.getElementById('app');
const { latitude, longitude, city, country } = app.dataset;
const userLocation = { 
  locaton: { latitude, longitude },
  city, country,
};

new App(userLocation);