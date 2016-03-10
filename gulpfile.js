// Requirements
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var minify_css = require('gulp-minify-css');
var compressor = require('gulp-compressor');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var rimraf = require('rimraf').sync;

// Defines paths
var srcpath = 'src';
var destpath = 'dist';
var buildpath = 'build';
var foundationpath = 'node_modules/foundation-sites';
var contextpath = buildpath;


var projectName = 'contextMenu';
var foundationJsDeps = [
  foundationpath + '/js/foundation.core.js',
  foundationpath + '/js/foundation.util.*.js',
  foundationpath + '/js/foundation.dropdownMenu.js'
];

var jsDeps = foundationJsDeps;
jsDeps.push(destpath+'/js/foundation.contextMenu.js');

var compatibility = ['last 2 versions', 'ie 10', 'Android >= 4.1'];


/***************************************************
 * default
 *  calls build
 ***************************************************/
gulp.task('default', ['build:all']);

/***************************************************
 * default
 *  calls build
 ***************************************************/
gulp.task('build:all', function() {
    runSequence('build:foundation', 'build:standalone');
});


/***************************************************
 * build:foundation
 *  output is stored in the destpath
 ***************************************************/
gulp.task('build:foundation', ['js:foundation', 'css:foundation'], function() {
});

/***************************************************
 * js:foundation
 *  uglify and send to dist folder
 ***************************************************/
gulp.task('js:foundation', function () {
  // minified JS
  gulp.src([srcpath+'/js/'+projectName+'.js'])
    .pipe(uglify())
    .pipe(rename('foundation.'+projectName+'.min.js'))
    .pipe(gulp.dest(destpath+'/js/'));

  // unminified JS
  gulp.src([srcpath+'/js/'+projectName+'.js'])
    .pipe(rename('foundation.'+projectName+'.js'))
    .pipe(gulp.dest(destpath+'/js/'));
});

/***************************************************
 * scss:foundation
 *   use sass, minify and autoprefixer and send to dist folder
 ***************************************************/
gulp.task('scss:foundation', function () {
  return sass(srcpath+'/css/'+projectName+'.scss', {sourcemap: false})
    .pipe(rename(projectName+'.css'))
    .pipe(gulp.dest(buildpath));
});

/***************************************************
 * css:standalone
 *   concat CSS and autoprefix, send to dist folder
 ***************************************************/
gulp.task('css:foundation', ['scss:foundation'], function () {
  // minified CSS
  gulp.src([buildpath+'/'+projectName+'.css'])
  .pipe(autoprefixer({
    browsers: compatibility
  }))
  .pipe(minify_css())
  .pipe(concat('foundation.'+projectName+'.min.css'))
  .pipe(gulp.dest(destpath));

  // unminified CSS
  gulp.src([buildpath+'/'+projectName+'.css'])
  .pipe(autoprefixer({
    browsers:compatibility
  }))
  .pipe(rename('foundation.'+projectName+'.css'))
  .pipe(gulp.dest(destpath));
});


/***************************************************
 * build:standalone
 *  output is stored in the destpath
 ***************************************************/
gulp.task('build:standalone', ['css:standalone', 'js:standalone']);

/***************************************************
 * js:standalone
 *  uglify and send to dist folder
 ***************************************************/
gulp.task('js:standalone', function () {
  // minified JS
  gulp.src(jsDeps)
  .pipe(babel())
  .pipe(uglify())
  .pipe(concat('solo.'+projectName+'.min.js'))
  .pipe(gulp.dest(destpath));

  // unminified JS
  gulp.src(jsDeps)
  .pipe(babel())
  .pipe(concat('solo.'+projectName+'.js'))
  .pipe(gulp.dest(destpath));

});

/***************************************************
 * scss:standalone
 *   use sass and autoprefixer and send to dist folder
 ***************************************************/
gulp.task('scss:standalone', function () {
  return sass(srcpath+'/foundation.scss', {sourcemap: false, defaultEncoding: 'UTF-8'})
    .pipe(gulp.dest(buildpath));
});

/***************************************************
 * css:standalone
 *   concat CSS and autoprefix, send to dist folder
 ***************************************************/
gulp.task('css:standalone', ['scss:standalone'], function () {
  // minified CSS
  gulp.src([buildpath+'/*.css', contextpath+'/dist/css/contextMenu.css'])
  .pipe(autoprefixer({
    browsers: compatibility
  }))
  .pipe(minify_css())
  .pipe(concat('solo.'+projectName+'.min.css'))
  .pipe(gulp.dest(destpath));

  // unminified CSS
  gulp.src([buildpath+'/*.css', contextpath+'/dist/css/contextMenu.css'])
  .pipe(concat('solo.'+projectName+'.css'))
  .pipe(autoprefixer({
    browsers:compatibility
  }))
  .pipe(gulp.dest(destpath));
});

/***************************************************
 * clean
 *  deletes the build folder
 ***************************************************/
gulp.task('clean', function () {
  rimraf(buildpath);
  rimraf(destpath);
});