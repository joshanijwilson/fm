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
var browserify = require('gulp-browserify');
var insert = require('gulp-insert');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');


function merge() {
  var args = Array.prototype.slice.call(arguments, 0)
  return streamqueue.apply(null, [{objectMode: true}].concat(args));
}

var paths = {
  templates: ['src/**/*.html', '!src/index.html'],
  styles: ['src/index.less'],
  datepicker: [
    'bower_components/angular-strap/src/helpers/date-parser.js',
    'bower_components/angular-strap/src/helpers/dimensions.js',
    'bower_components/angular-strap/dist/modules/tooltip.js',
    'lib/hacked-datepicker.js',
    'bower_components/angular-strap/dist/modules/datepicker.tpl.js'
  ],
  angular: [
    'bower_components/angular/angular.js',
    'bower_components/angular-route/angular-route.js',
    'bower_components/angular-touch/angular-touch.js'
  ],
  angularMinified: [
    'bower_components/angular/angular.min.js',
    'bower_components/angular-route/angular-route.min.js',
    'bower_components/angular-touch/angular-touch.min.js'
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
    .pipe(templateCache({module: 'fm.templates', standalone: true}))
    .pipe(gulp.dest('build'));
});



// Concat datepicker.
gulp.task('build/datepicker.js', function() {
  return gulp.src(paths.datepicker)
    .pipe(ngmin())
    .pipe(concat('datepicker.js'))
    .pipe(gulp.dest('build'));
});



// Concat Angular bundle.
gulp.task('build/angular-bundle.js', function() {
  return gulp.src(paths.angular)
    .pipe(concat('angular-bundle.js'))
    .pipe(gulp.dest('build'));
});



// Concat Angular bundle - minified.
gulp.task('build/angular-bundle.min.js', function() {
  return gulp.src(paths.angularMinified)
    .pipe(concat('angular-bundle.min.js'))
    .pipe(gulp.dest('build'));
});



// The entire app bundle.
gulp.task('build/fm.js', ['build/templates.js', 'build/datepicker.js'], function() {
  return merge(
      gulp.src('build/templates.js'),
      gulp.src('build/datepicker.js'),
      gulp.src('lib/angular-locale_cs-cz.js'),
      gulp.src('src/index.js').pipe(browserify())
    )
    .pipe(concat('fm.js'))
    .pipe(insert.prepend('window.FM_BUNDLED = true;'))
    .pipe(gulp.dest('build'))
});



// The entire app bundle - minified.
gulp.task('build/fm.min.js', ['build/fm.js'], function() {
  return gulp.src('build/fm.js')
    .pipe(uglify())
    .pipe(concat('fm.min.js'))
    .pipe(gulp.dest('build'))
});



// LESS -> CSS.
gulp.task('build/fm.css', function () {
  return gulp.src(paths.styles)
    .pipe(less({}))
    .pipe(concat('fm.css'))
    .pipe(gulp.dest('build'));
});



// Minify CSS.
gulp.task('build/fm.min.css', ['build/fm.css'], function() {
  return gulp.src('build/fm.css')
    .pipe(minifyCSS({}))
    .pipe(concat('fm.min.css'))
    .pipe(gulp.dest('build'))
});



// The index.html with JS/CSS replaced.
gulp.task('build/index', function() {
  return gulp.src('src/index.html')
    .pipe(htmlreplace({
      'css'    : './fm.css',
      'js'     : './fm.js',
      'angular': './angular-bundle.js'
    }))
    .pipe(gulp.dest('build'));
});



// The index.html with minified JS/CSS.
gulp.task('build/index.min', function() {
  return gulp.src('src/index.html')
    .pipe(htmlreplace({
        'css'    : './fm.min.css',
        'js'     : './fm.min.js',
        'angular': './angular-bundle.min.js'
    }))
    .pipe(concat('index.min.html'))
    .pipe(gulp.dest('build'));
});



// Copy all the assets.
gulp.task('copy/cars', function() {
  return gulp.src(['cars/*_600.jpg'], {base: '.'})
    .pipe(gulp.dest('build'));
})

gulp.task('copy/assets', function() {
  return gulp.src(['src/loading.gif'])
    .pipe(gulp.dest('build'));
})

gulp.task('copy/bootstrap-fonts', function() {
  return gulp.src('bower_components/bootstrap/fonts/*', {base: '.'})
    .pipe(gulp.dest('build'));
});


gulp.task('build', ['build/fm.js', 'build/fm.css', 'build/angular-bundle.js', 'build/index', 'copy/assets', 'copy/cars']);
gulp.task('build.min', ['build/fm.min.js', 'build/fm.min.css', 'build/angular-bundle.min.js', 'build/index.min', 'copy/assets', 'copy/cars']);
