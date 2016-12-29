import App from './components/App';

const app = document.getElementById('app');
const { latitude, longitude, city, country } = app.dataset;
const userLocation = { 
  location: { latitude, longitude },
  city, country,
};

new App(userLocation);