var gulp = require('gulp'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  config = require('./config');

/**
 * Gulp task js:*.
 * Concates the JS dependencies.
 * Outputs uglified and un-uglified JS files to dist.
 */

gulp.task('js:foundation', function () {
  // minified JS
  gulp.src([config.srcPath + '/js/' + config.name + '.js'])
    .pipe(uglify())
    .pipe(rename('foundation.' + config.name + '.min.js'))
    .pipe(gulp.dest(config.destPath));

  // unminified JS
  gulp.src([config.srcPath + '/js/' + config.name + '.js'])
    .pipe(rename('foundation.' + config.name + '.js'))
    .pipe(gulp.dest(config.destPath));
});

gulp.task('js:standalone', function () {
  // minified JS
  gulp.src(config.javascript.dependencies)
  .pipe(babel())
  .pipe(uglify())
  .pipe(concat('solo.' + config.name + '.min.js'))
  .pipe(gulp.dest(config.destPath));

  // unminified JS
  gulp.src(config.javascript.dependencies)
  .pipe(babel())
  .pipe(concat('solo.' + config.name + '.js'))
  .pipe(gulp.dest(config.destPath));

});



gulp.task('js:getDeps', function () {
  var execSync = require('child_process').execSync;

  var dependencyDirs = ['node_modules/foundation-sites/js/'],
    extension = '.js',
    deps = config.javascript.dependencies,
    toCheck = JSON.parse(JSON.stringify(config.javascript.dependencies.reverse())),
    camelize = function(input) {
      return input.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    };

  while (toCheck.length) {
    var curDeps = execSync('find ' + toCheck[0] + ' -exec grep @requires \'{}\' \\;').toString().split('\n');
    curDeps.pop();

    for (var c in curDeps) {
      var name = camelize(/@\w*\s([\w\.\-]*)/i.exec(curDeps[c])[1]),
        path;

      // check for files in dirs
      for (var d in dependencyDirs) {
        try {
          if (execSync('find ' + dependencyDirs[d] + name + extension).toString().indexOf('No such') === -1) {
            path = dependencyDirs[d] + name + extension;
            break;
          }
        } catch (err) {
          console.log('File not found:', dependencyDirs[d] + name + extension);
        }
      }

      if (deps.indexOf(path) === -1) { // detected file is not already listed as a dependency
        deps.push(path);
        toCheck.push(path);
      }
    }
    toCheck.shift();
  }
});
