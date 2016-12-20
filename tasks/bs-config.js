const config = require('./contour');

const bsOptions = {
  ui: false,
  files: ['public'],
  server: 'public',
  proxy: config.proxy,
  ghostMode: false,
  open: false,
  reloadOnRestart: false,
  notify: true,
}

if (config.proxy) {
  bsOptions.server = false;
}

if (config.templatingLanguage === 'craft') {
  bsOptions.files.push('templates');
}

module.exports = bsOptions;
