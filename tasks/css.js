'use strict';

const fs = require('fs');
const process = require('process');

const postcss = require('postcss');
const mkdirp = require('mkdirp');
const stylus = require('stylus');
const glob = require('glob');
const chalk = require('chalk');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const config = require('./contour');
const minify = (process.argv[2] && process.argv[2] === 'minify') ? true : false;

const { source, dest } = config.paths;

glob(`${source}/stylus/*.styl`, { ignore: ['node_modules/**'] }, (error, files) => {
  files.forEach(file => {
    fs.readFile(file, 'utf8', (error, content) => {
      compileStylus(file, content).then(css => postprocess(css)).then(css => {

        const outputPath = file.replace(`${source}/stylus`, dest).replace('.styl', '.css');

        fs.writeFile(outputPath, css, error => {
          if (error) { throw error; }
          console.log(`${chalk.green('✓')} ${file} ${chalk.gray('compiled to')} ${outputPath}` );
        });

      });
    });
  });
});


function compileStylus(filename, css) {
  return new Promise(resolve => {
    stylus(css)
      .set('filename', filename).set('include css', true)
      .set('paths', [`${source}/stylus`, 'node_modules'])
      .set('sourcemap', {
        inline: !minify
      }).render((error, css) => {
        if (error) { throw error; }
        resolve(css);
      });
  });
}

function postprocess(css) {
  const tasks = [autoprefixer({ browsers: ['last 2 versions'] })];
  if (minify) {
    tasks.push(cssnano);
  }

  return postcss(tasks).process(css).then(result => result.css);
}
