'use strict';

const path = require('path');

const glob = require('glob');
const revHash = require('rev-hash');
const fs = require('mz/fs')
const chalk = require('chalk');

const config = require('./contour');
const {dest} = config.paths;

const mainfestPath = path.join(__dirname, 'webpack.manifest.json');
let revMap = {};

try {
  revMap = require(mainfestPath);
  fs.unlink(mainfestPath, () => {});
} catch(e) {}



revFiles().then(() => {
  glob('**/*+(.html|.css|.js)', {
    cwd: path.join(process.cwd(), dest),
  }, (error, files) => {
    files.forEach(file => {
      const filePath = `./${path.join(dest, file)}`;
      fs.readFile(filePath, 'utf8').then(buffer => revReplace(buffer)).then(content => fs.writeFile(filePath, content)).then(() => {
        console.log(`${chalk.green('✓')} ${chalk.gray('Path\'s updated in')} ${filePath}`);
      });
    });
  });
});


function revFiles() {
  return new Promise(resolve => {
    glob('**/**', {
      cwd: path.join(process.cwd(), dest),
      ignore: ['**/*.html', '**/*.php', '**/*.js', '**/*.map', ...config.tasks.filerev.ignore]
    }, (error, files) => {

      const allFiles = files.filter(file => fs.statSync(path.join(dest, file)).isFile());
      let counter = 0;
      allFiles.forEach(file => {
        const filePath = `./${path.join(dest, file)}`;
        fs.readFile(filePath).then(buffer => {
          const fileExt = path.extname(filePath);
          const hashedFile = file.replace(fileExt, `.${revHash(buffer)}${fileExt}`);
          const newPath = `./${path.join(dest, hashedFile)}`;

          revMap[`/${file}`] = `/${hashedFile}`;

          fs.rename(filePath, newPath).then(() => {
            console.log(`${chalk.green('✓')} ${file} ${chalk.gray('changed to')} ${hashedFile}` );
            counter++;
            if(counter === allFiles.length) {
              resolve();
            }
          }).catch(error => {
            throw error;
          })

        });

      });
    });
  });
}

function revReplace(string) {
  return new Promise(resolve => {
    Object.keys(revMap).forEach(file => {
      string = string.replace(new RegExp(file, 'ig'), revMap[file]);
    });
    resolve(string);
  });
}
