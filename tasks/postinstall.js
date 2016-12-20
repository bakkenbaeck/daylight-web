'use strict';

const path = require('path');
const exec = require('child_process').exec;

const fs = require('mz/fs');
const fse = require('fs-extra')
const inquirer = require('inquirer');
const chalk = require('chalk');

try {
  require('./contour');
  return;
} catch(e) {
  configure();
}



function configure() {
  let settings = require('../skeleton/contour.js');

  console.log(`Let's get this project started! ✨`);

  const questions = [
    {
      type: 'confirm',
      name: 'isCraft',
      message: 'Is this a Craft project?',
      when: !process.env.NO_CRAFT
    },
    {
      type: 'confirm',
      name: 'useProxy',
      message: 'Do you want to use a proxy for local development?',
      when: !process.env.NO_PROXY

    },
    {
      type: 'input',
      name: 'proxy',
      message: `What's the proxy url?`,
      when: answers => answers.useProxy,
    },
    {
      type: 'list',
      name: 'templatingLanguage',
      message: 'What templating language would you like to use?',
      choices: ['Twig', 'Pug', 'none'],
      when: answers => !answers.isCraft,
      filter: val => {
        return val === 'none' ? 'html' : val.toLowerCase();
      }
    },
  ];

  inquirer.prompt(questions).then(answers => {

    settings.templatingLanguage = answers.templatingLanguage ? answers.templatingLanguage : 'craft';
    settings.proxy = answers.proxy ? answers.proxy : null;

    if (answers.isCraft) {
      answers.templatingLanguage = 'twig';
    }

    fs.writeFile(path.join(__dirname, 'contour.js'), `module.exports = ${JSON.stringify(settings, null, 2)}`).then(() => {
      fse.move(path.join(__dirname, `../skeleton/${answers.templatingLanguage}`), path.join(__dirname, '../templates'), error => {
        if (error) { throw error; }
        fse.remove(path.join(__dirname, '../skeleton'), error => {
          if (error) { throw error; }
          console.log(`${chalk.green('✓')} Project configured! 🤓`);
        });
      });
    }).catch(error => {
      throw error;
    });

  });

}
