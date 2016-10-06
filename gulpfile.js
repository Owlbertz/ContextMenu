var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  rimraf = require('rimraf').sync,
  requireDir = require('require-dir'),
  browser = require('browser-sync'),
  config = require('./gulp/config'),
  exec = require('child_process').exec,
  port = process.env.SERVER_PORT || 3000;

requireDir('./gulp');



/**
 * Gulp task default.
 * Calls build:all.
 */
gulp.task('default', ['serve', 'watch']);

/**
 * Gulp task build:all.
 * Calls build:foundation and build:standalone.
 */
gulp.task('build:all', ['build:foundation', 'build:standalone']);

/**
 * Gulp task build:foundation.
 * Calls js:foundation and css:foundation.
 */
gulp.task('build:foundation', ['js:foundation', 'css:foundation']);

/**
 * Gulp task build:standalone.
 * Calls js:standalone and css:standalone.
 */
gulp.task('build:standalone', ['js:standalone', 'css:standalone']);

/**
 * Gulp task dist.
 * Copies the built files into the dist folder.
 */
gulp.task('dist', ['js:min', 'css:min'], function() {
  // uninified files
  gulp.src([config.buildPath + 'assets/*'])
    .pipe(gulp.dest(config.destPath));
});

/**
 * Gulp task copy:assets.
 * Copies assets into visual test folder.
 */
gulp.task('copy:assets', ['build:all'], function() {
  gulp.src([config.buildPath + 'assets/*', './node_modules/{jquery,foundation-sites}/**/*'])
    .pipe(gulp.dest(config.testPath + 'assets/'));
});

/**
 * Gulp task watch.
 * Watch files for changes and reloads the browser.
 */
gulp.task('watch', function() {
  gulp.watch('js/**/*', [[['js:foundation'], 'js:standalone'], browser.reload]);
  gulp.watch('scss/**/*', [[['css:foundation'], 'css:standalone'], browser.reload]);
  gulp.watch(config.testPath + '*.html', [browser.reload]);
});

/**
 * Gulp task serve.
 * Starts a BrowerSync instance.
 */
gulp.task('serve', ['build:all', 'copy:assets'], function() {
  browser.init({server: config.testPath, port: port});
});

/**
 * Gulp task clean.
 * Deletes the build folder.
 */
gulp.task('clean', function () {
  rimraf(config.buildPath);
});

/**
 * Gulp task publish.
 * Publishes the visual tests to gh-pages.
 */
gulp.task('publish', function(cb) {
  exec('git subtree push --prefix ' + config.testPath + ' origin gh-pages', function(error, stdout, stderr) {
    console.log(stdout);
    cb();
  });
});