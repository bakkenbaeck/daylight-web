import Horizon from './components/horizon';

const app = document.getElementById('app');
let {latitude, longitude, sunrise, sunset, city, country} = app.dataset;

sunrise = new Date(sunrise); 
sunset = new Date(sunset);

const horizon = new Horizon(sunrise, sunset);
horizon.init();
