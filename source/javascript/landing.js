const date = new Date();
const hour = date.getHours();
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

// Apply the theme to html
document.documentElement.classList.add('theme-' + theme);

// since animating to color: inherit does not work on safari we gotta toggle a class instead
setTimeout(() => {
  document.querySelector('.sun').classList.remove('is-colored');
}, 2900);

/*
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
*/