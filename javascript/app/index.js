import App from './components/App';

const userLocation = JSON.parse(document.getElementById('app').dataset.location);

const app = new App(userLocation);
app.bootstrap();