var gulp     = require('gulp');           // Сам Gulp JS
var cleanCSS = require('gulp-clean-css'); // Минификация CSS
var concat   = require('gulp-concat');    // Склейка файлов
var replace  = require('gulp-replace');   // Замена внутри файлов
var uglify   = require('gulp-uglify');    // Минификация JS

// Сборка проекта для тестирования
gulp.task('default', ['libs', 'app.css', 'app.js', 'watcher.css', 'watcher.js']);

// Сборка проекта для релиза
gulp.task('build', ['libs', 'app.css', 'app.js', 'copy.assets', 'copy.pages', 'index.html']);

gulp.task('watcher.css', function () {
    return gulp.watch('src/css/*.css', ['app.css']);
});

gulp.task('watcher.js', function () {
    return gulp.watch('src/js/**/*.js', ['app.js']);
});

gulp.task('app.css', function () {
    return gulp.src('src/css/*.css')
        .pipe(concat('app.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('assets'));
});

gulp.task('app.js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets'));
});

gulp.task('copy.assets', function () {
    return gulp.src('assets/**/*')
        .pipe(gulp.dest('build/assets'));
});

gulp.task('copy.pages', function () {
    return gulp.src('pages/*')
        .pipe(gulp.dest('build/pages'));
});

gulp.task('index.html', function () {
    return gulp.src('index.html')
        .pipe(replace('<!-- cordova.js here -->', '<script type="text/javascript" src="cordova.js"></script>'))
        .pipe(replace("var pathServerAPI = 'http://lemurro-api.localhost/';", "var pathServerAPI = 'http://your.api.domain.tld/';"))
        .pipe(replace('var modeCordova   = false;', 'var modeCordova   = true;'))
        .pipe(gulp.dest('build'));
});

gulp.task('libs', function () {
    var libs = [
        'bower_components/framework7/dist/css/framework7.min.css',
        'bower_components/framework7/dist/js/framework7.min.js',
        'bower_components/inputmask/dist/inputmask/dependencyLibs/inputmask.dependencyLib.js',
        'bower_components/inputmask/dist/min/inputmask/inputmask.min.js',
        'bower_components/jsdeferred/jsdeferred.nodoc.js',
        'bower_components/localforage/dist/localforage.min.js',
        'bower_components/sweetalert2/dist/sweetalert2.min.css',
        'bower_components/sweetalert2/dist/sweetalert2.min.js'
    ];

    return gulp.src(libs)
        .pipe(gulp.dest('assets/plugins'));
});