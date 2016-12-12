import SunGraph from './components/SunGraph';

const app = document.getElementById('app');
let {latitude, longitude, sunrise, sunset, city, country} = app.dataset;

sunrise = new Date(sunrise); 
sunset = new Date(sunset);

const graph = new SunGraph(sunrise, sunset);
graph.init();
