'use strict';

const fs = require('mz/fs');
const fse = require('fs-extra');
const chalk = require('chalk');

const {source, dest} = require('./contour').paths;
const path = `${source}/static`;

fs.exists(path).then(folder => {
  if (!folder) { return; }
  copy();
});


function copy() {
  fse.copy(path, dest, (err) => {
    if (err) return console.error(err)
    console.log(`${chalk.green('✓')} static directory ${chalk.gray('copied to')} public`);
  });
}