var gulp     = require('gulp');           // Сам Gulp JS
var cleanCSS = require('gulp-clean-css'); // Минификация CSS
var concat   = require('gulp-concat');    // Склейка файлов
var replace  = require('gulp-replace');   // Замена внутри файлов
var uglify   = require('gulp-uglify');    // Минификация JS

// Сборка проекта для тестирования
gulp.task('default', ['libs', 'core', 'app.css', 'app.js', 'watcher.css', 'watcher.js']);

gulp.task('watcher.css', function () {
    return gulp.watch('src/css/*.css', ['app.css']);
});

gulp.task('watcher.js', function () {
    return gulp.watch('src/js/**/*.js', ['app.js']);
});

gulp.task('app.css', function () {
    return gulp.src('src/css/*.css')
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('assets'));
});

gulp.task('app.js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('assets'));
});

gulp.task('core', function () {
    var core = [
        'bower_components/lemurro-client-framework7-core-frontend/dist/core.min.css',
        'bower_components/lemurro-client-framework7-core-frontend/dist/core.min.js'
    ];

    return gulp.src(core)
        .pipe(gulp.dest('assets'));
});

gulp.task('libs', function () {
    var libs = [
        'bower_components/framework7/packages/core/css/framework7.min.css',
        'bower_components/framework7/packages/core/js/framework7.min.js',
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

// Сборка проекта для релиза
gulp.task('build', ['build.libs', 'build.core', 'build.app.css', 'build.app.js', 'build.copy.assets', 'build.copy.pages', 'build.index.html']);

gulp.task('build.app.css', function () {
    return gulp.src('src/css/*.css')
        .pipe(concat('app.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('build/assets'));
});

gulp.task('build.app.js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/assets'));
});

gulp.task('build.core', function () {
    var core = [
        'bower_components/lemurro-client-framework7-core-frontend/dist/core.min.css',
        'bower_components/lemurro-client-framework7-core-frontend/dist/core.min.js'
    ];

    return gulp.src(core)
        .pipe(gulp.dest('build/assets'));
});

gulp.task('build.libs', function () {
    var libs = [
        'bower_components/framework7/packages/core/css/framework7.min.css',
        'bower_components/framework7/packages/core/js/framework7.min.js',
        'bower_components/inputmask/dist/inputmask/dependencyLibs/inputmask.dependencyLib.js',
        'bower_components/inputmask/dist/min/inputmask/inputmask.min.js',
        'bower_components/jsdeferred/jsdeferred.nodoc.js',
        'bower_components/localforage/dist/localforage.min.js',
        'bower_components/sweetalert2/dist/sweetalert2.min.css',
        'bower_components/sweetalert2/dist/sweetalert2.min.js'
    ];

    return gulp.src(libs)
        .pipe(gulp.dest('build/assets/plugins'));
});

gulp.task('build.copy.assets', function () {
    var options = [
        'assets/**/*',
        '!assets/app.min.css',
        '!assets/app.min.js',
        '!assets/core.min.css',
        '!assets/core.min.js',
        '!assets/plugins/*'
    ];

    return gulp.src(options)
        .pipe(gulp.dest('build/assets'));
});

gulp.task('build.copy.pages', function () {
    return gulp.src('pages/*')
        .pipe(gulp.dest('build/pages'));
});

gulp.task('build.index.html', function () {
    return gulp.src('index.html')
        .pipe(replace('<!-- cordova.js here -->', '<script type="text/javascript" src="cordova.js"></script>'))
        .pipe(replace("var pathServerAPI = 'http://lemurro-api.localhost/';", "var pathServerAPI = 'http://your.api.domain.tld/';"))
        .pipe(replace('var modeCordova   = false;', 'var modeCordova   = true;'))
        .pipe(gulp.dest('build'));
});