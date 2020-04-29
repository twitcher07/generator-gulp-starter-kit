module.exports = {
  dirsToCreate: ['src/images', 'src/fonts'],
  filesToCopy: [
    {
      input: 'editorconfig',
      output: '.editorconfig'
    },
    {
      input: 'favicon260x260.png',
      output: 'src/favicon260x260.png'
    },
    {
      input: 'sw.js',
      output: 'src/sw.js'
    }
  ],
  filesToRender: [
    {
      input: 'gitignore',
      output: '.gitignore'
    },
    {
      input: 'eslintrc.json',
      output: '.eslintrc'
    },
    {
      input: 'gulpfile.js',
      output: 'gulpfile.js'
    },
    {
      input: '_package.json',
      output: 'package.json'
    },
    {
      input: '_readme.md',
      output: 'README.md'
    },
    {
      input: 'styles.scss',
      output: 'src/scss/styles.scss'
    },
    {
      input: 'main.js',
      output: 'src/js/main.js'
    }
  ],
  bedrock: {
    dirsToCreate: (el) => [`web/app/themes/${el.wordpressTemplateName}/static/`],
    filesToCopy: [
      {
        input: 'bedrock/env',
        output: '.env'
      },
      {
        input: 'bedrock/env',
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
        input: 'bedrock/web/app/themes/.gitkeep',
        output: 'web/app/themes/.gitkeep'
      },
      {
        input: 'bedrock/web/app/uploads/.gitkeep',
        output: 'web/app/uploads/.gitkeep'
      }
    ],
    filesToRender: (el) => [
      {
        input: 'bedrock/style.css',
        output: `web/app/themes/${el.wordpressTemplateName}/style.css`
      }
    ] 
  }
};