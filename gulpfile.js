var gulp     = require('gulp');           // Сам Gulp JS
var cleanCSS = require('gulp-clean-css'); // Минификация CSS
var concat   = require('gulp-concat');    // Склейка файлов
var replace  = require('gulp-replace');   // Замена внутри файлов
var uglify   = require('gulp-uglify');    // Минификация JS

// Сборка проекта для тестирования
gulp.task('default', ['watcher', 'js', 'css', 'libs']);

// Сборка проекта для релиза
gulp.task('build', ['libs'], function () {
    // Копируем необходимые файлы
    gulp.src(['assets/**/*', '!assets/bootstrap.js', '!assets/bootstrap.css'])
        .pipe(gulp.dest('build/assets'));
    gulp.src('pages/*')
        .pipe(gulp.dest('build/pages'));

    // Проводим замены в файле home.html
    gulp.src('index.html')
        .pipe(replace('<!-- cordova.js here -->', '<script type="text/javascript" src="cordova.js"></script>'))
        .pipe(replace("var pathServerAPI = 'http://lemurro-server.localhost/';", "var pathServerAPI = 'http://lemurro.dimns.ru/';"))
        .pipe(replace('var modeCordova   = false;', 'var modeCordova   = true;'))
        .pipe(replace('var modeWeb       = true;', 'var modeWeb       = false;'))
        .pipe(gulp.dest('build'));

    // bootstrap.js
    gulp.src('src/js/**/*.js')
        .pipe(concat('bootstrap.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/assets'));

    // bootstrap.css
    gulp.src('src/css/*.css')
        .pipe(concat('bootstrap.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('build/assets'));
});

gulp.task('watcher', function () {
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/css/*.css', ['css']);
});

gulp.task('js', function () {
    // bootstrap.js
    gulp.src('src/js/**/*.js')
        .pipe(concat('bootstrap.js'))
        .pipe(gulp.dest('assets'));
});

gulp.task('css', function () {
    // bootstrap.css
    gulp.src('src/css/*.css')
        .pipe(concat('bootstrap.css'))
        .pipe(gulp.dest('assets'));
});

// Перенос необходимых библиотек
gulp.task('libs', function () {
    var libs = [
        'bower_components/framework7/dist/css/framework7.min.css',
        'bower_components/framework7/dist/js/framework7.min.js',
        'bower_components/hammerjs/hammer.min.js',
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