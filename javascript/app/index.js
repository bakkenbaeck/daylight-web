import Horizon from './components/horizon';

const app = document.getElementById('app');
const {latitude, longitude, city, country} = app.dataset;
const location = {latitude, longitude};
const now = new Date();

const horizon = new Horizon(now, location);
//horizon.init();
