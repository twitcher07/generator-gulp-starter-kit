const gulp = require('gulp');
const log = require('fancy-log');
const chalk = require('chalk');
const each = require('gulp-each');
const ejslint = require('ejs-lint');

gulp.task('lint:ejs', (done) => {
  return gulp.src('./generators/**/*.ejs', { base: './' }).pipe(
    each((content, file, callback) => {
      const lint = ejslint(content);

      // If there isn't a syntax error ejs-lint responds with
      // 'undefined' because it uses node-syntax-error object
      // https://github.com/browserify/syntax-error#attributes
      if (typeof lint !== 'undefined') {
        console.error(`${chalk.red('Error found in file:')} ${file.relative}`);
        console.error(chalk.red('-------------------------------------------'));
        console.error(ejslint(content));
      }

      callback();
    })
  );
});
