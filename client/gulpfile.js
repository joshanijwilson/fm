// TODO(vojta): build css / less
// TODO(vojta): add sha to built files
// TODO(vojta): montage module loader?
// TODO(vojta): replace libs with cdn / min-bundled versions

var gulp = require('gulp');

var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var streamqueue = require('streamqueue');
var htmlreplace = require('gulp-html-replace');
var clean = require('gulp-clean');
var ngmin = require('gulp-ngmin');


function multipleSrc() {
  var args = Array.prototype.slice.call(arguments, 0)
      .map(function(pattern) {
        return gulp.src(pattern);
      });

  return streamqueue.apply(null, [{objectMode: true}].concat(args));
}

var paths = {
  scripts: ['*.js', '!*_test.js', '!app.js', '!gulpfile.js', '!karma.conf.js', '!hacked-datapicker.js'],
  templates: ['./*.html', '!index.html'],
  init: ['app.js'],
  datepicker: [
    'bower_components/angular-strap/src/helpers/date-parser.js',
    'bower_components/angular-strap/src/helpers/dimensions.js',
    'bower_components/angular-strap/dist/modules/tooltip.js',
    'hacked-datepicker.js',
    'bower_components/angular-strap/dist/modules/datepicker.tpl.js'
  ]
};



// Remove entire build folder.
gulp.task('clean', function () {
  return gulp.src('build', {read: false, force: false})
    .pipe(clean());
});



// Compile Angular templates into a single JS file.
gulp.task('build/templates.js', function () {
  return gulp.src(paths.templates)
    .pipe(templateCache({module: 'fm'}))
    .pipe(gulp.dest('build'));
});



// Concat datepicker.
gulp.task('build/datepicker.js', function() {
  return gulp.src(paths.datepicker)
    .pipe(ngmin())
    .pipe(concat('datepicker.js'))
    .pipe(gulp.dest('build'));
});



// The entire app bundle.
gulp.task('build/fm.js', ['build/templates.js', 'build/datepicker.js'], function() {
  return multipleSrc(
    paths.scripts,
    'build/datepicker.js',
    'app.js',
    'build/templates.js'
  ).pipe(concat('fm.js'))
   .pipe(gulp.dest('build'));
});



// The entire app bundle - minified.
gulp.task('build/fm.min.js', ['build/fm.js'], function() {
  return gulp.src('build/fm.js')
    .pipe(uglify())
    .pipe(concat('fm.min.js'))
    .pipe(gulp.dest('build'))
});



// The index.html with JS/CSS replaced.
gulp.task('build/index', function() {
  return gulp.src('index.html')
    .pipe(htmlreplace({
      'css': '../app.css',
      'js' : './fm.js'
    }))
    .pipe(gulp.dest('build'));
});



// The index.html with minified JS/CSS.
gulp.task('build/index.min', function() {
  return gulp.src('index.html')
    .pipe(htmlreplace({
        'css': '../app.css',
        'js': './fm.min.js'
    }))
    .pipe(concat('index.min.html'))
    .pipe(gulp.dest('build'));
});



// Copy all the assets.
gulp.task('copy/assets', function() {
  return gulp.src(['cars/*_600.jpg', 'loading.gif'], {base: '.'})
  .pipe(gulp.dest('build'));
})



gulp.task('build', ['build/fm.js', 'build/angular-bundle.js', 'build/index', 'copy/assets']);
gulp.task('build.min', ['build/fm.min.js', 'build/angular-bundle.min.js', 'build/index.min', 'copy/assets']);
