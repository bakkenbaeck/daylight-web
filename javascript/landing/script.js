console.log('● Daylight by Bakken & Baæck.');

const date = new Date();
const hour = date.getHours();
let theme;

// Just average hour values -> theme
if (hour <= 8) {
  theme = 'sunrise';
} else if (hour <= 17) {
  theme = 'daylight';
} else if (hour <= 18) {
  theme = 'sunset';
} else if (hour <= 24) {
  theme = 'night';
} else {
  theme = 'twilight';
}

// Apply the theme to html
document.documentElement.classList.add('theme-' + theme);

// since animating to color: inherit does not work on safari we gotta toggle a class instead
setTimeout(() => {
  document.querySelector('.brand').classList.remove('is-colored');
}, 2900);