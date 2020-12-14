# Welcome to the Gulp Starter Kit.
# Table of Contents
1. [Requirements](#installation-requirements)
2. [Build Tools & Assets](#build-tools-&-assets)
3. [Getting Started](#getting-started)
4. [Build Commands](#build-commands)

# Installation requirements
* Node.js (at least version 10)
* NPM
<%_ if (includeBedrock) { -%>
* Composer
<%_ } -%>
* Gulp.js version 4

# Tools & Frontend Assets
## What's included:
<%_ if (includeBedrock) { -%>
* Bedrocks by Roots - WordPress boilerplate with modern development tools [Documentation](https://roots.io/bedrock/)
<%_ } -%>
* Gulp 4 - [Documentation](https://gulpjs.com/docs/en/getting-started/quick-start)
* Sass Compiling (using gulp-sass) - [Documentation](https://github.com/dlmanning/gulp-sass)
* PostCSS (using gulp-postcss) - [Documentation](https://github.com/postcss/gulp-postcss)
* Babel.js - [Documentation](https://babeljs.io/docs/en/)
* ESlint (using gulp-eslint) - [Documentation](https://github.com/adametry/gulp-eslint#readme)
* Webpack 4 (for javascript dependencies) - [Documentation](https://v4.webpack.js.org/concepts/)
<%_ if (includeHTML) { -%>
* BrowserSync - [Documentation](https://www.browsersync.io/docs)
<%_ } -%>
* Minification of CSS and JS for production use (using [clean-css](https://github.com/jakubpawlowicz/clean-css) and Webpack's built in optimization of ['production' mode](https://v4.webpack.js.org/configuration/mode/))
* Favicon Generation (using gulp-real-favicon) - [Documentation](https://github.com/RealFaviconGenerator/gulp-real-favicon)

<%_ if (includeJQuery || includeTailwind || includeBootstrap) { -%>
## Frontend assets:
<%_ } if (includeTailwind) { -%>
* Tailwind CSS - [Documentation](https://tailwindcss.com/docs/installation)
<%_ } if (includeJQuery) { -%>
* jQuery v 3.4 - [Documentation](https://api.jquery.com/)
<%_ } if (includeBootstrap) { -%> 
* Bootstrap 4.4.0 - [Documentation](https://getbootstrap.com/docs/4.4/getting-started/introduction/)
<%_ } -%>

# Getting Started
## Customizing output path
Change `"paths": { "distFolder": "dist/" }` in `package.json` to be where you want to output the frontend files. If you leave everything as is, it will create this folder structure **inside** the `distFolder`: 
```
/dist
  |
  |- /images
  |- /fonts
  |- /css
  |- /js
```
If more control over the folder structure is needed inside `gulpfile.js` you can edit:
```javascript
dist_css = path.join(dist_folder, '/css'),
dist_js = path.join(dist_folder, '/js'),
dist_img = path.join(dist_folder, '/images'),
dist_font = path.join(dist_folder, '/fonts'),
dist_html = path.join(dist_folder, '/**/*.{twig,html}'),
```

## Injecting links to CSS and Javascript from gulp build
First, make sure `dist_html` variable inside `gulpfile.js` points to the production path to either your html files if it's a static site, or points to the template files (php, twig, mustache, etc.).

Then place these html comments inside the template or html files:

For CSS:
```
<!-- inject:css -->
<!-- endinject -->
```

For Javascript:
```
<!-- inject:js -->
<!-- endinject -->
```
<%_ if (includeTailwind) { -%>
## Setting up PurgeCSS 
Make sure variable `templates_purgeCSS` in `gulpfile.js` contains globs to the html files or template files of your site. PurgeCSS will parse these files for the CSS selectors used and then extract them for the production version of the CSS file.
<%_ } -%> 

## Favicons
Overwrite `src/favicon260x260.png` or change the variable `const favicon = path.join(src_folder, 'favicon260x260.png')` to point to the master image for generating the favicons. Master favicon image should be at least 260x260.

Change these variables in `package.json` to match your site's design.
```json
{
	"favicon": {
		"themeColor": "#ffffff",
    	"backgroundColor": "#da532c"
	}
}
```

# Build Commands
## `gulp serve`
Probably the go-to command for development.

This compiles sass (and runs any postcss plugins), lints javascript, builds webpack, optimizes images, copies fonts, injects the link to CSS and javascript sources, and outputs all frontend files to the `distFolder`. 

<%_ if (includeHTML) { -%>
Also, it spins up a static server using browsersync. Frontend of the site can be accessed at http:localhost:3000.
<%_ } -%>

Then it watches these files for any changes:
```
src/**/*.html
src/css/**/*.scss
src/js/**/*.js
src/images/**/*.+(png|jpg|jpeg|gif|svg|ico)
src/fonts/**/*.{eot,svg,ttf,woff,woff2}
```

and then it will re-run commands depending on what changed in order to compile sass, build webpack, or copy over file changes.

## `npm run serve:dist`
This is the production version of `gulp serve`. It creates the production version of CSS and Javascript files by:
* Minifies CSS (clean-css) and JS (Webpack Terser Plugin)
* Omits source maps for CSS and JS
<%_ if (includeTailwind) { -%>
* Uses [purgeCSS](https://purgecss.com/) to remove unused CSS declarations. Which helps to drastically reduce the file size when using frameworks like tailwindCSS or bootstrap.
<%_ } -%>

## `npm run critical-css:dist`
Make sure `paths.criticalPages` in `package.json` contains an object of the pages you want to generate critical css for.
```json
{
	"paths": {
		"criticalPages": {
			// name for template 
			// (no spaces or special characters)    // direct URL 
			"name-of-template": 					<% if (includeBedrock) { %>"your-url.test"<% } else { %>"index.html"<% } %>
		}
	}
}
```
After running command, CSS that should be inlined can be found in <%_ if (includeBedrock) { %>`web/app/themes/<%= wordpressTemplateName %>` <% } else { %>`dist/css/critical/`<% } %> folder.

## `npm run build`
Builds out production version of frontend code.

## `gulp generate-favicon`
This uses gulp-real-favicon to generate the favicons using a master favicon image (`src/favicon260x260.png` is the default one).

These are the files generated out of the box:
```bash
android-chrome-192x192.png
android-chrome-256x256.png
apple-touch-icon.png
browserconfig.xml
favicon-16x16.png
favicon-32x32.png
favicon.ico
html_code.html ## contains the html that should be added to the head of your site
mstile-144x144.png
mstile-150x150.png
mstile-310x150.png
mstile-310x310.png
mstile-70x70.png
site.webmanifest ## customization of manifest items can be done inside gulpfile.js
```