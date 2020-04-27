// generated on <%= date %> using <%= name %> <%= version %>


const $ = require('gulp-load-plugins')({ pattern: ['*'] });

const gulp                      = require('gulp'),
      fs                        = require('fs'),
      path                      = require('path'),
      autoprefixer              = require('gulp-autoprefixer'),
      webpack                   = require('webpack'),
      webpackStream             = require('webpack-stream'),
      browserSync               = $.browserSync.create(),

      // Paths to source of assets
      src_folder                = 'src/',
      src_asset_scss            = path.join(src_folder, '/scss/**/*.scss'),
      src_asset_js              = path.join(src_folder, '/js/**/*.js'),
      src_asset_img             = path.join(src_folder, '/images/**/*.+(png|jpg|jpeg|gif|svg|ico)'),
      src_asset_font            = path.join(src_folder, '/fonts/**/*.{eot,svg,ttf,woff,woff2}'),
      src_asset_html            = path.join(src_folder, '/**/*.html'),
      // Add any other assets that just need to be copied over to dist folder
      src_generic_assets        = [
                                    path.join(src_folder, 'favicon260x260.png'),
                                    path.join(src_folder, 'site.webmanifest'),
                                  ],

      // Paths you want to output assets to
      dist_folder               = 'dist/', // change to whatever root you want it to be.
      dist_css                  = path.join(dist_folder, '/css'),
      dist_js                   = path.join(dist_folder, '/js'),
      dist_img                  = path.join(dist_folder, '/images'),
      dist_html                 = path.join(dist_folder, '/**/*.{twig,html}'),
      node_modules_folder       = './node_modules/',
      dist_node_modules_folder  = path.join(dist_folder, '/node_modules'),

      templates_purgeCSS        = [
                                    path.join(src_folder, '/**/*.{twig,html}')
                                  ],

      node_dependencies         = Object.keys(require('./package.json').dependencies || {});

const isProd = process.env.NODE_ENV === 'production';

const dist_generic_assets = [];

src_generic_assets.forEach((el) => {
  dist_generic_assets.push(el.replace(src_folder, dist_folder));
});

// Clean generated assets
gulp.task('clean', (cb) => {

  const all_dist = [dist_css, dist_js, dist_img, dist_html].concat(dist_generic_assets);

  log(`Deleting Files: ${all_dist}`);

  $.del(all_dist);

  cb();
});

gulp.task('generic-assets', () => {
  return gulp.src(src_generic_assets, {
    since: gulp.lastRun('generic-assets')
  })
    .pipe(gulp.dest(dist_folder))
    .pipe(browserSync.stream());
});

gulp.task('html', () => {
  return gulp.src(src_asset_html, {
      base: src_folder,
      since: gulp.lastRun('html')
    })
    .pipe(gulp.dest(dist_folder));
});

gulp.task('inject-css-js', () => {
  const sources = gulp.src([path.join(dist_css, '**/*.css'), path.join(dist_js, '**/*.js')], {read: false});

  return gulp.src(dist_html)
    .pipe($.inject(sources, {
      ignorePath: '/dist'
    }))
    .pipe(gulp.dest(dist_folder))
    .pipe(browserSync.stream());
});
<%_ if (includeTailwind) { -%>

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
const tailwindExtractor = (content) => {
  return content.match(/[A-z0-9-:\/]+/g);
}

const postcss_purgecss = purgecss({
  content: templates_purgeCSS,
  extractors: [{
    extractor: tailwindExtractor,
    extensions: ["html", "twig", "css", "js"]
  }],
  whitelist: [
    // whitelist css selectors
    'show', 
  ],
  whitelistPatterns: [
    // whitelist using regex patterns
    /flickity-.*\b/ 
  ]
});
<%_ } -%>

gulp.task('postcss', () => {
  const f = $.filter(['.tmp/css/**/*.css'], {restore: true});

  return gulp.src(['.tmp/css/**/*.*'])
    .pipe(f)
    .pipe($.postcss([
          <%_ if (includeTailwind) { -%>
          $.tailwindcss(),
          isProd ? postcss_purgecss : false,
          <%_ } -%>
          $.autoprefixer(),
          isProd ? $.postcssClean() : false
        ].filter(Boolean)))
    .pipe(f.restore)
    .pipe($.if(isProd, $.rename({ suffix: '.min' })))
    .pipe($.size({gzip: true, showFiles: true}))
    .pipe(gulp.dest(dist_css))
    .pipe(browserSync.stream());
});

gulp.task('sass', gulp.series(() => {
  return gulp.src(src_asset_scss, { since: gulp.lastRun('sass') })
    .pipe($.sourcemaps.init())
      .pipe($.plumber())
      .pipe($.dependents())
      .pipe($.sass())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/css'))
}, 'postcss'));

// Lint JavaScript
gulp.task('lint', () => {
  return gulp.src(src_asset_js, { since: gulp.lastRun('lint') })
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
});

gulp.task('js', gulp.series('lint', () => {
  return gulp.src(src_asset_js, { since: gulp.lastRun('js') })
    .pipe($.plumber())
    .pipe(webpackStream({
      mode: isProd ? 'production' : 'development',
      output: {
        filename: isProd ? '[name].min.js' : '[name].js'
      },
      devtool: isProd ? false : 'inline-cheap-source-map',
      module: {
        rules: [
          { 
            test: /\.js$/, 
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }<%_ if (includeJQuery || includeBootstrap) { -%>,
          {
            // expose jquery for use outside webpack
            test: require.resolve('jquery'),
            use: [{
              loader: 'expose-loader',
              options: 'jQuery'
            },{
              loader: 'expose-loader',
              options: '$'
            }]
          }
          <%_ } -%>
        ]
      }
    }, webpack ))
    .pipe(gulp.dest(dist_js))
    .pipe(browserSync.stream());
}));

gulp.task('images', () => {
  return gulp.src(src_asset_img, { since: gulp.lastRun('images') })
    .pipe($.plumber())
    .pipe($.imagemin())
    .pipe($.size({gzip: true, showFiles: true}))
    .pipe(gulp.dest(dist_img))
    .pipe(browserSync.stream());
});

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

gulp.task('generate-favicon', function(done) {
  $.realFavicon.generateFavicon({
    masterPicture: src_folder + 'favicon260x260.png',
    dest: dist_folder,
    iconsPath: '/',
    design: {
      ios: {
        pictureAspect: 'noChange',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        }
      },
      desktopBrowser: {
        design: 'raw'
      },
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#da532c',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
          }
        }
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#ffffff',
        manifest: {
          display: 'standalone',
          orientation: 'notSet',
          existingManifest: $.realFavicon.escapeJSONSpecialChars(fs.readFileSync(path.join(src_folder, 'site.webmanifest'), 'utf8')),
          onConflict: 'override',
          declared: false
        },
        assets: {
          legacyIcon: false,
          lowResolutionIcons: false
        }
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false,
      readmeFile: false,
      htmlCodeFile: false,
      usePathAsIs: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function() {
    // Patch the original manifest
    gulp.src(path.join(src_folder, 'manifest.json')).pipe(gulp.dest(src_folder))
      .on('finish', function() {
        done();
    });
  });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function() {
  return gulp.src(dist_html)
    .pipe($.realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(gulp.dest(dist_folder));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  $.realFavicon.checkForUpdates(currentVersion, function(err) {
    if (err) {
      throw err;
    }
  });

  done();
});

gulp.task('browser-sync', () => {
  return browserSync.init({
    server: {
      baseDir: [ 'dist' ]
    },
    port: 3000,
    open: false
  });
});

gulp.task('watch', () => {
  
  const watchVendor = [];

  node_dependencies.forEach(dependency => {
    watchVendor.push(node_modules_folder + dependency + '/**/*.*');
  });

  gulp.watch(src_asset_html, gulp.series('html', 'sass', 'inject-css-js')).on('change', browserSync.reload);
  gulp.watch(src_asset_scss, gulp.series('sass')).on('change', browserSync.reload);
  gulp.watch(src_asset_js, gulp.series('js')).on('change',browserSync.reload);
  gulp.watch(src_asset_img, gulp.series('images')).on('change', browserSync.reload);
});

gulp.task('build', gulp.series('clean', gulp.parallel('generic-assets', 'html', 'images', 'sass', 'js'), 'inject-css-js'));

gulp.task('serve', gulp.series('build', gulp.parallel('browser-sync', 'watch')));

gulp.task('default', gulp.series('build'));
