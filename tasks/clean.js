'use strict';

const path = require('path');
const fs = require('mz/fs');

const glob = require('glob');
const chalk = require('chalk');

const config = require('./contour');
const {dest} = config.paths;

glob('**/**', {
  cwd: path.join(process.cwd(), dest),
  ignore: ['**/*.php', '.htaccess', ...config.tasks.clean.ignore]
}, (error, files) => {

  const allFiles = files.filter(file => fs.statSync(path.join(dest, file)).isFile());
  let counter = 0;
  allFiles.forEach(file => {
    fs.unlink(path.join(dest, file)).then(() => {
      counter++;
      if (counter === allFiles.length) {
        console.log(`${chalk.green('✓')} Cleaned public directory`);
      }
    });
  });

});
