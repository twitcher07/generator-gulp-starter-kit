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
        message: 'What do you want to name this project?',
        default: this.appname
      },
      {
        type: 'confirm',
        name: 'includeBedrock',
        message: 'Is this a bedrock wordpress project?',
        default: false
      },
      {
        type: 'confirm',
        name: 'includeHTML',
        message: 'Is this a static HTML project? (This will include an HTML5 boilerplate file)',
        default: false,
        when: answers => !answers.includeBedrock
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
        when: answers => answers.includeBedrock
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Which additional features would you like to include?',
        choices: [
          {
            name: 'Bootstrap',
            value: 'includeBootstrap',
            checked: false
          },
          {
            name: 'Tailwind CSS',
            value: 'includeTailwind',
            checked: false
          }
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
        const features = answers.features;
        const hasFeature = feat => features && features.includes(feat);

        // manually deal with the response, get back and store the results.
        // we change a bit this way of doing to automatically do this in the self.prompt() method.
        this.includeBedrock = answers.includeBedrock;
        this.wordpressTemplateName = answers.wordpressTemplateName;
        this.includeBootstrap = hasFeature('includeBootstrap');
        this.includeTailwind = hasFeature('includeTailwind');
        this.includeJQuery = answers.includeJQuery;
        this.includeHTML = answers.includeHTML;
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
      includeTailwind: this.includeTailwind
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
