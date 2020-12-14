'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const config = require('./config');

module.exports = class extends Generator {

  initializing() {
    this.pkg = require('../../package.json');
  }

  prompting() {

    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the finest ${chalk.red('gulp-starter-kit')} generator!`)
    );

    return this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What do you want to name this project? (no spaces allowed)',
        default: this.appname,
        validate(input) {
          // Do async stuff
          if (input.indexOf(' ') >= 0 || /[~`!#$%^&*+=[\]\\';,/{}|\\":<>?]/g.test(input)) {
              // Pass the return value in the done callback
              return `${chalk.styles.red.open}
                No whitespaces or special-chars allowed!${chalk.styles.red.close}`;
          }
            return true;
        }
      },
      {
        type: 'list',
        name: 'projectType',
        message: 'Which type of project is this?',
        choices: [
          {
            name: `Craft CMS ${chalk.magenta('(https://craftcms.com/docs/3.x/)')}`,
            value: 'craft'
          },
          {
            name: `Bedrock Wordpress ${chalk.magenta('(https://roots.io/bedrock/)')}`,
            value: 'bedrock'
          },
          {
            name: 'Static HTML',
            value: 'html'
          },
        ],
        default: 'html'
      },
      {
        type: 'input',
        name: 'wordpressTemplateName',
        message: 'What do you want to call your custom wordpress theme?',
        default: answers => answers.projectName.toString().toLowerCase()
                  .replace(/\s+/g, '-')           // Replace spaces with -
                  .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                  .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                  .replace(/^-+/, '')             // Trim - from start of text
                  .replace(/-+$/, ''),
        when: answers => answers.projectType.includes('bedrock')
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Which additional features would you like to include?',
        choices: [
          {
            name: `Vanilla Lazyload Javascript ${chalk.magenta('(https://github.com/verlok/vanilla-lazyload)')}`,
            value: 'includeLazyload',
            checked: false
          },
          {
            name: `Bootstrap - ${chalk.magenta('v4.4.0')}`,
            value: 'includeBootstrap',
            checked: false
          },
          {
            name: `Alpine.js ${chalk.magenta('(https://github.com/alpinejs/alpine)')}`,
            value: 'includeAlpine',
            checked: true
          },
          {
            name: `Tailwind CSS - ${chalk.magenta('v2.0.1 (https://github.com/tailwindlabs/tailwindcss/tree/v2.0.1)')}`,
            value: 'includeTailwind',
            checked: true
          },
        ]
      },
      {
        type: 'confirm',
        name: 'includeJQuery',
        message: 'Would you like to include jQuery(v 3.4)?',
        default: false,
        when: answers => !answers.features.includes('includeBootstrap')
      }
    ]).then(answers => {
        this.projectType = answers.projectType;
        this.includeBedrock = answers.includeBedrock;
        this.wordpressTemplateName = answers.wordpressTemplateName;
        this.includeHTML = answers.includeHTML;

        const features = answers.features;
        const hasFeature = feat => features && features.includes(feat);

        // manually deal with the response, get back and store the results.
        // we change a bit this way of doing to automatically do this in the self.prompt() method.
        this.includeBootstrap = hasFeature('includeBootstrap');
        this.includeTailwind = hasFeature('includeTailwind');
        this.includeAlpine = hasFeature('includeAlpine');
        this.includeJQuery = answers.includeJQuery;
        this.projectName = answers.projectName;
      });
    }

  writing() {
    const templateData = {
      appname: this.projectName,
      date: new Date().toISOString().split('T')[0],
      name: this.pkg.name,
      version: this.pkg.version,
      includeBedrock: this.includeBedrock,
      wordpressTemplateName: this.wordpressTemplateName,
      includeHTML: this.includeHTML,
      includeBootstrap: this.includeBootstrap,
      includeJQuery: this.includeJQuery,
      includeTailwind: this.includeTailwind,
      includeAlpine: this.includeAlpine
    };

    const copy = (input, output) => {
      this.fs.copy(this.templatePath(input), this.destinationPath(output));
    };

    const copyTpl = (input, output, data) => {
      this.fs.copyTpl(
        this.templatePath(input),
        this.destinationPath(output),
        data
      );
    };

    // Render Files
    config.filesToRender.forEach(file => {
      copyTpl(file.input, file.output, templateData);
    });

    // Copy Files
    config.filesToCopy.forEach(file => {
      copy(file.input, file.output);
    });

    // Create extra directories
    config.dirsToCreate.forEach(item => {
      mkdirp(item);
    });

    if(this.includeBedrock) {

      config.bedrock.dirsToCreate(this).forEach(item => {
        mkdirp(item);
      });
      
      config.bedrock.filesToCopy.forEach(file => {
        copy(file.input, file.output);
      });

      config.bedrock.filesToRender(this).forEach(file => {
        copyTpl(file.input, file.output, templateData);
      });
    }

    if (this.includeHTML) {
      copyTpl('index.html', 'src/index.html', templateData);
    }

    if (this.includeTailwind) {
      copy('tailwind.config.js', 'tailwind.config.js');
    }

    let cssFile = 'styles.scss';
    copyTpl(cssFile, `src/scss/${cssFile}`, templateData);
  }

  install() {
    if (this.includeBedrock) {
      this.spawnCommand('composer', ['install'])
    }

    this.npmInstall();
  }
};
