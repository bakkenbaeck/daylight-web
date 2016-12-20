'use strict';

const glob = require('glob');
const imagemin = require('imagemin');
const fs = require('mz/fs');
const chalk = require('chalk');

const imageminGifsicle = require('imagemin-gifsicle');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');

const plugins = [
  imageminGifsicle(),
  imageminJpegtran({
    progressive: true,
  }),
  imageminOptipng(),
];

const {dest} = require('./contour').paths;

glob(`${dest}/**/*.{jpg,jpeg,png,gif}`, { ignore: [`${dest}/uploads/**/*.{jpg,jpeg,png,gif}`] }, (error, files) => {

  files.forEach(file => {
    fs.readFile(file).then(buffer => {
      imagemin.buffer(buffer, { plugins }).then(data => {

        const originalSize = buffer.length;
  			const optimizedSize = data.length;
        const saved = originalSize - optimizedSize;
  			const percent = originalSize > 0 ? Math.round(((saved / originalSize) * 100) * 100) / 100 : 0;

        fs.writeFile(file, data).then(() => {
          console.log(`${chalk.green('✓')} ${file.replace(dest, '')} reduced by ${percent}% ${chalk.gray('(' + saved + 'kb)')}`);
        });

      });
    });
  });

});
