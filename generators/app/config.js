module.exports = {
  dirsToCreate: ['src/images', 'src/fonts'],
  filesToCopy: [
    {
      input: 'editorconfig',
      output: '.editorconfig'
    },
    {
      input: '_.npmrc',
      output: '.npmrc'
    },
    {
      input: 'favicon260x260.png',
      output: 'src/favicon260x260.png'
    },
    {
      input: 'sw.js',
      output: 'src/sw.js'
    },
    {
      input: 'src/js/modules/utilities.js',
      output: 'src/js/modules/utilities.js'
    }
  ],
  filesToRender: [
    {
      input: '_gitignore.ejs',
      output: '.gitignore'
    },
    {
      input: '_eslintrc.json.ejs',
      output: '.eslintrc'
    },
    {
      input: '_gulpfile.js.ejs',
      output: 'gulpfile.js'
    },
    {
      input: '_package.json.ejs',
      output: 'package.json'
    },
    {
      input: '_readme.md.ejs',
      output: 'README.md'
    },
    // Sass files
    {
      input: '_styles.scss.ejs',
      output: 'src/scss/styles.scss'
    },
    {
      input: '_variables.scss.ejs',
      output: 'src/scss/_variables.scss'
    },
    {
      input: '_mixins.scss.ejs',
      output: 'src/scss/_mixins.scss'
    },
    {
      input: '_functions.scss.ejs',
      output: 'src/scss/_functions.scss'
    },
    {
      input: '_base.scss.ejs',
      output: 'src/scss/_base.scss'
    },
    {
      input: '_typography.scss.ejs',
      output: 'src/scss/_typography.scss'
    },
    // Javascript files
    {
      input: 'src/js/_main.js.ejs',
      output: 'src/js/main.js'
    }
  ],
  bedrock: {
    dirsToCreate: el => [`web/app/themes/${el.wordpressTemplateName}/static/`],
    filesToCopy: [
      {
        input: 'bedrock/.env.example',
        output: '.env.example'
      },
      {
        input: 'bedrock/bedrock_license.md',
        output: 'bedrock_LICENSE.md'
      },
      {
        input: 'bedrock/bedrock_readme.md',
        output: 'bedrock_README.md'
      },
      {
        input: 'bedrock/_wp-cli.yml',
        output: 'wp-cli.yml'
      },
      {
        input: 'bedrock/_phpcs.xml',
        output: 'phpcs.xml'
      },
      {
        input: 'bedrock/_composer.json',
        output: 'composer.json'
      },
      {
        input: 'bedrock/config/application.php',
        output: 'config/application.php'
      },
      {
        input: 'bedrock/config/environments/development.php',
        output: 'config/environments/development.php'
      },
      {
        input: 'bedrock/config/environments/staging.php',
        output: 'config/environments/staging.php'
      },
      {
        input: 'bedrock/web/_index.php',
        output: 'web/index.php'
      },
      {
        input: 'bedrock/web/_wp-config.php',
        output: 'web/wp-config.php'
      },
      {
        input: 'bedrock/web/app/mu-plugins/bedrock-autoloader.php',
        output: 'web/app/mu-plugins/bedrock-autoloader.php'
      },
      {
        input: 'bedrock/web/app/mu-plugins/disallow-indexing.php',
        output: 'web/app/mu-plugins/disallow-indexing.php'
      },
      {
        input: 'bedrock/web/app/mu-plugins/register-theme-directory.php',
        output: 'web/app/mu-plugins/register-theme-directory.php'
      },
      {
        input: 'bedrock/web/app/plugins/.gitkeep',
        output: 'web/app/plugins/.gitkeep'
      },
      {
        input: 'bedrock/web/app/uploads/.gitkeep',
        output: 'web/app/uploads/.gitkeep'
      }
    ],
    filesToRender: el => [
      {
        input: 'bedrock/_style.css.ejs',
        output: `web/app/themes/${el.wordpressTemplateName}/style.css`
      },
      {
        input: 'bedrock/web/app/themes/timber-starter',
        output: `web/app/themes/${el.wordpressTemplateName}`
      },
      {
        input: '_env.ejs',
        output: '.env'
      }
    ]
  },
  craft: {
    dirsToCreate: el => [],
    filesToCopy: [
      // Root files
      {
        input: 'craft/.env.example',
        output: '.env.example'
      },
      {
        input: 'craft/_composer.json',
        output: 'composer.json'
      },
      {
        input: 'craft/craft',
        output: 'craft'
      },
      // Config Folder
      {
        input: 'craft/config',
        output: 'config'
      },
      // Modules folder
      {
        input: 'craft/modules',
        output: 'modules'
      },
      // Storage folder
      {
        input: 'craft/storage',
        output: 'storage'
      },
      // Template folder
      {
        input: 'craft/templates',
        output: 'templates'
      },
      // Web folder
      {
        input: 'craft/web',
        output: 'web'
      }
    ],
    filesToRender: el => [
      {
        input: '_env.ejs',
        output: '.env'
      }
    ]
  }
};
