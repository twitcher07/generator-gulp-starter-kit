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
    },
    {
      input: 'sw.js',
      output: 'src/sw.js'
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
  ]
};