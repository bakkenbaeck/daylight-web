'use strict';

const fs = require('mz/fs')
const path = require('path');
const process = require('process');

const glob = require('glob');
const SVGO = require('svgo');
const SVGSpriter = require('svg-sprite');
const mkdirp = require('mkdirp');
const chalk = require('chalk');

const config = require('./contour');
const { source, templates } = config.paths;




optimizeSVG().then(svgs => {

  const path = `${templates}/_svg`;

  mkdirp(path, error => {
    if (error) { throw error; }

    Promise.all([inlineSVG(svgs.inline), SVGSprite(svgs.sprite)]).then(svg => {
      const [inline, sprite] = svg;

      const createFiles = [];
      if (inline) {
        createFiles.push(fs.writeFile(`${templates}/_svg/utils.${config.templatingLanguage}`, inline));
      }
      for (var folder in sprite) {
        if (sprite.hasOwnProperty(folder)) {
          createFiles.push(fs.writeFile(`${templates}/_svg/${folder}.${config.templatingLanguage}`, `<div aria-hidden="true" class="visuallyhidden">${sprite[folder]}</div>`));
        }
      }

      Promise.all(createFiles).then(() => {
        console.log(`${chalk.green('✓')} SVG's optimized`);
      });

    });

  });

});




function optimizeSVG() {
  const svgo = new SVGO(config.tasks.svgo.options);

  return new Promise(resolve => {
    glob(`${source}/svg/**/*.svg`, (error, files) => {
      const svgMap = { inline: [], sprite: [] };
      var counter = 0;

      files.forEach((file, index) => {
        fs.readFile(file, 'utf8').then(svg => {


          const folder = file.replace(`${source}/svg/`, '').split('/')[0];
          const name = path.basename(file, '.svg');

          svgo.optimize(svg, result => {
            svgMap[file.match('inline') ? 'inline' : 'sprite'].push({
              name,
              folder,
              svg: result.data,
            });

            counter++;

            if (files.length === counter) {
              resolve(svgMap);
            }
          });

        }).catch(error => { throw error });
      });
    });
  });
}

function inlineSVG(svgs) {
  return new Promise(resolve => {
    let inline = '';
    svgs.forEach(svg => {
      inline += `'${svg.name}': '${svg.svg}',`;
    });

    const markup = {
      twig: `
{% macro inline(options) %}
  {% set svg  = { ${inline} } %}
  {% if options.class is defined %}
    {{ (svg[options.name] | replace({'<svg ' : '<svg class="' ~ options.class ~ '"'})) | raw }}
  {% else %}
    {{ svg[options.name] | raw }}
  {% endif %}
{% endmacro %}
{% macro external(options) %}
  <svg class="{{ options.class is defined ? options.class : '' }}">
    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{ '#' ~ options.prefix ~ '-' ~ options.name}}"></use>
  </svg>
{% endmacro %}`,
      pug:
      `mixin inlineSVG(name)
  - function addClass(svg, classNames) { if (classNames) { return svg.replace('<svg ', '<svg class="' + classNames + '" '); } else { return svg; }  };
  - var svgs = { ${inline} }
  | !{addClass(svgs[name], attributes.class)}
mixin externalSVG(options)
  svg(class=attributes.class)
    use(xmlns:xlink="http://www.w3.org/1999/xlink", xlink:href='#'+options.prefix+'-'+options.name)
  `
    }

    resolve(markup[config.templatingLanguage]);
  });
}

const spriteConfig = {
  mode: {
    symbol: true
  },
  shape: {
    id: {
      generator: function(name) {
        return name;
      },
    },
  },
}

function SVGSprite(svgs) {
  return new Promise(resolve => {
    const sprite = {};
    const map = {};
    svgs.map(svg => {
      map[svg.folder] = map[svg.folder] || [];
      map[svg.folder].push(svg);
    });

    for (var folder in map) {
      if (map.hasOwnProperty(folder)) {
        var spriter = new SVGSpriter(spriteConfig);
        map[folder].forEach(svg => {
          spriter.add(path.join(process.cwd(), `${svg.folder}-${svg.name}`), `${svg.folder}-${svg.name}`, svg.svg);
        });
      }
      spriter.compile((error, result) => {
        sprite[folder] = result.symbol.sprite.contents;
      });
    }

    resolve(sprite);

  });
}
