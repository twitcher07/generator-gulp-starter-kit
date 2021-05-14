'use strict';
const Generator = require('yeoman-generator');
const path = require('path');
const _ = require('lodash');
const crypto = require('crypto');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const config = require('./config');

function validURL(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // Protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // Query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // Fragment locator
  return Boolean(pattern.test(str));
}

function checkForChar(excludeCharArray, char) {
  excludeCharArray.some((badChar) => {
    return char === badChar;
  });
}

const getRandomChar = function () {
  const minChar = 33; // !
  const maxChar = 126; // ~
  const char = String.fromCharCode(crypto.randomInt(minChar, maxChar));
  if (["'", '"', '\\'].some((badChar) => char === badChar)) {
    return getRandomChar();
  }

  return char;
};

module.exports = class extends Generator {
  initializing() {
    this.pkg = require('../../package.json');
  }

  prompting() {
    // Branding
    this.log(`
      -----------------------------------------------------------------------------          
                                                                                                          
      Version  :   ${this.pkg.version}
      Author   :   ${this.pkg.author.name}                                                   
      Website  :   ${this.pkg.author.url}                                         
      Github   :   ${this.pkg.repository.url}          
                                                                                  
      -----------------------------------------------------------------------------          
    `);
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the finest ${chalk.red('gulp-starter-kit')} generator!`)
    );

    return this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: `What do you want to name this project? ${chalk.yellow(
          '(no special characters allowed)'
        )}`,
        default: this.appname,
        validate(input) {
          // Do async stuff
          if (/[~`!#$%^&*+=[\]\\';,/{}|\\":<>?]/g.test(input)) {
            // Pass the return value in the done callback
            return chalk.bgRed.white('No special characters allowed!');
          }

          return true;
        },
      },
      {
        type: 'list',
        name: 'projectType',
        message: 'Which type of project is this?',
        choices: [
          {
            name: `Craft CMS ${chalk.magenta(
              '(https://craftcms.com/docs/3.x/)'
            )}`,
            value: 'craft',
          },
          {
            name: `Bedrock Wordpress ${chalk.magenta(
              '(https://roots.io/bedrock/)'
            )}`,
            value: 'bedrock',
          },
          {
            name: 'Static HTML',
            value: 'html',
          },
        ],
        default: 'html',
        store: true,
      },
      {
        type: 'input',
        name: 'wordpressTemplateName',
        message: 'What do you want to call your custom wordpress theme?',
        default: (answers) => _.kebabCase(answers.projectName),
        when: (answers) => answers.projectType.includes('bedrock'),
      },
      {
        type: 'input',
        name: 'craftSiteName',
        message: 'What do you want to call your Craft site?',
        default: (answers) => answers.projectName,
        when: (answers) => answers.projectType.includes('craft'),
      },
      {
        type: 'input',
        name: 'siteUrl',
        message: 'What is the url for the site?',
        default() {
          return `http://${path.basename(process.cwd())}.test`;
        },
        validate(input) {
          if (validURL(input)) {
            return true;
          }

          return chalk.bgRed.white('Please enter a valid URL.');
        },
        when: (answers) =>
          answers.projectType.includes('craft') ||
          answers.projectType.includes('bedrock'),
      },
      {
        type: 'input',
        name: 'dbName',
        message: 'What is the name of the database?',
        validate(input) {
          if (input === '') {
            return chalk.bgRed.white('Database name cannot be blank.');
          }

          return true;
        },
        when: (answers) => answers.projectType.includes('bedrock'),
      },
      {
        type: 'input',
        name: 'dbUser',
        message: 'What is the username for the database?',
        default: 'root',
        when: (answers) => answers.projectType.includes('bedrock'),
      },
      {
        type: 'password',
        name: 'dbPassword',
        message(answers) {
          return `What is the password for ${answers.dbUser}?`;
        },
        default: '',
        when: (answers) => answers.projectType.includes('bedrock'),
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Which additional features would you like to include?',
        choices: [
          {
            name: `Vanilla Lazyload Javascript ${chalk.magenta(
              '(https://github.com/verlok/vanilla-lazyload)'
            )}`,
            value: 'includeLazyload',
            checked: false,
          },
          {
            name: `Bootstrap - ${chalk.magenta('v4.4.0')}`,
            value: 'includeBootstrap',
            checked: false,
          },
          {
            name: `Alpine.js ${chalk.magenta(
              '(https://github.com/alpinejs/alpine)'
            )}`,
            value: 'includeAlpine',
            checked: true,
          },
          {
            name: `Tailwind CSS - ${chalk.magenta(
              'v2.0.1 (https://github.com/tailwindlabs/tailwindcss/tree/v2.0.1)'
            )}`,
            value: 'includeTailwind',
            checked: true,
          },
        ],
        store: true,
      },
      {
        type: 'confirm',
        name: 'includeJQuery',
        message: 'Would you like to include jQuery(v 3.4)?',
        default: false,
        when: (answers) => !answers.features.includes('includeBootstrap'),
      },
    ]).then((answers) => {
      this.projectType = answers.projectType;
      this.wordpressTemplateName = answers.wordpressTemplateName;
      this.craftSiteName = answers.craftSiteName;
      this.siteUrl = answers.siteUrl;
      this.dbName = answers.dbName;
      this.dbUser = answers.dbUser;
      this.dbPassword = answers.dbPassword;

      const { features } = answers;
      const hasFeature = (feat) => features && features.includes(feat);

      // Manually deal with the response, get back and store the results.
      // we change a bit this way of doing to automatically do this in the self.prompt() method.
      this.includeBootstrap = hasFeature('includeBootstrap');
      this.includeTailwind = hasFeature('includeTailwind');
      this.includeAlpine = hasFeature('includeAlpine');
      this.includeLazyload = hasFeature('includeLazyload');
      this.includeJQuery = answers.includeJQuery;
      this.projectName = answers.projectName;
    });
  }

  writing() {
    const pkgJson = {
      dependencies: {},
      devDependencies: {},
    };

    const templateData = {
      appname: this.projectName,
      appnameKebabCase: () => {
        return _.kebabCase(this.projectName);
      },
      date: new Date().toISOString().split('T')[0],
      name: this.pkg.name,
      version: this.pkg.version,
      projectType: this.projectType,
      wordpressTemplateName: this.wordpressTemplateName,
      craftSiteName: this.craftSiteName,
      siteUrl: this.siteUrl,
      dbName: this.dbName,
      dbUser: this.dbUser,
      dbPassword: this.dbPassword,
      includeBootstrap: this.includeBootstrap,
      includeJQuery: this.includeJQuery,
      includeTailwind: this.includeTailwind,
      includeAlpine: this.includeAlpine,
      includeLazyload: this.includeLazyload,
      generateSalt: () => {
        const saltLength = 64;

        return Array(...Array(saltLength))
          .map(getRandomChar)
          .join('');
      },
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
    config.filesToRender.forEach((file) => {
      copyTpl(file.input, file.output, templateData);
    });

    // Copy Files
    config.filesToCopy.forEach((file) => {
      copy(file.input, file.output);
    });

    // Create extra directories
    config.dirsToCreate.forEach((item) => {
      mkdirp(item);
    });

    if (this.projectType === 'bedrock' || this.projectType === 'craft') {
      config[this.projectType].dirsToCreate(this).forEach((item) => {
        mkdirp(item);
      });

      config[this.projectType].filesToCopy.forEach((file) => {
        copy(file.input, file.output);
      });

      config[this.projectType].filesToRender(this).forEach((file) => {
        copyTpl(file.input, file.output, templateData);
      });
    } else if (this.projectType === 'html') {
      copyTpl('_index.html.ejs', 'src/index.html', templateData);
    }

    if (this.includeBootstrap) {
      pkgJson.dependencies = {
        bootstrap: '^4.4.0',
        'popper.js': '^1.15.0',
        jquery: '^3.4.1',
      };
    }

    if (this.includeJQuery && !_.has(pkgJson.dependencies, 'jquery')) {
      pkgJson.dependencies.jquery = '^3.4.1';
    }

    if (this.includeAlpine) {
      pkgJson.dependencies.alpinejs = '^2.7.1';
    }

    if (this.includeLazyload) {
      pkgJson.dependencies['vanilla-lazyload'] = '^17.1.3';
    }

    if (this.includeTailwind) {
      pkgJson.devDependencies['gulp-tailwindcss-export-config'] = '^1.0.1';
      pkgJson.devDependencies.tailwindcss = '^2.0.1';

      copy('tailwind.config.js', 'tailwind.config.js');
    }

    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  install() {
    this.npmInstall();

    if (this.projectType === 'bedrock' || this.projectType === 'craft') {
      this.spawnCommandSync('composer', ['install']);
    }
  }

  end() {
    if (this.projectType === 'bedrock' || this.projectType === 'craft') {
      this.log(
        yosay('allo!\nJust gonna build the frontend files for the first time.')
      );

      this.spawnCommandSync('npm', ['run', 'build:dev']);
    }

    if (this.projectType === 'html') {
      this.log(
        yosay(
          `Thanks for using Gulp Starter Kit!\nTry running 'npm run serve' to check out your new fancy project!\nCheers 🍻!`
        )
      );
    } else {
      this.log(yosay(`Thanks for using Gulp Starter Kit!\nCheers 🍻!`));
    }

    if (this.projectType === 'craft') {
      // Generate security key and app id in .env file
      // this.spawnCommandSync('php', ['craft', 'setup/security-key']);
      // this.spawnCommandSync('php', ['craft', 'setup/app-id']);

      this.log(
        yosay("g'day!\nGonna run you through `php craft install` process now.")
      );

      this.spawnCommandSync('php', ['craft', 'setup']);
    }
  }
};
