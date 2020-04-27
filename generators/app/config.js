module.exports = {
  dirsToCreate: ['src/images', 'src/fonts'],
  filesToCopy: [
    {
      input: 'gitignore',
      output: '.gitignore'
    },
    {
      input: 'editorconfig',
      output: '.editorconfig'
    },
    {
      input: 'favicon260x260.png',
      output: 'src/favicon260x260.png'
    }
  ],
  filesToRender: [
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
      input: 'styles.scss',
      output: 'src/scss/styles.scss'
    },
    {
      input: 'main.js',
      output: 'src/js/main.js'
    },
    {
      input: 'site.webmanifest',
      output: 'src/site.webmanifest'
    }
  ]
};