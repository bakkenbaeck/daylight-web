console.log('● Daylight by Bakken & Baæck.');

const date = new Date();
const hour = date.getHours();
const min = date.getMinutes();
let theme;

// Just average hour values -> theme
if (hour >= 7 && hour < 8) {
  theme = 'sunrise';
} else if (hour >= 8 && hour < 17) {
  theme = 'daylight';
} else if (hour >= 17 && hour < 18) {
  theme = 'sunset';
} else if (hour >= 18 && hour < 24) {
  theme = 'night';
} else if (hour == 24 || hour < 7) {
  theme = 'twilight';
}

console.log(hour, theme, min);

// Apply the theme to html
document.documentElement.classList.add('theme-' + theme);

// since animating to color: inherit does not work on safari we gotta toggle a class instead
setTimeout(() => {
  document.querySelector('.brand').classList.remove('is-colored');
}, 2900);