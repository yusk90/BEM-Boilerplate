var gulp = require('gulp'),
    concatCSS = require('gulp-concat-css'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    autoprefixer = require('autoprefixer'),
    postcss = require('gulp-postcss'),
    flatten = require('gulp-flatten'),
    mustache = require('gulp-mustache'),
    webpack = require('webpack'),
    gutil = require('gulp-util'),
    rework = require('gulp-rework'),
    reworkUrl = require('rework-plugin-url'),
    clean = require('del'),
    params = {
        out: 'public/',
        images: 'public/images/',
        fonts: 'public/fonts/',
        css: 'public/css/',
        js: 'public/js'
    };

gulp.task('clean', function () {
    return clean(params.out);
});

gulp.task('html', function () {
    return gulp.src('html/*.html')
    .pipe(mustache())
    .pipe(gulp.dest(params.out))
    .pipe(reload({ stream: true }));
});

gulp.task('favicon', function () {
    return gulp.src('html/favicon.ico')
    .pipe(gulp.dest(params.out))
    .pipe(reload({ stream: true }));
});

gulp.task('style', function () {
    return gulp.src('blocks/style.css')
    .pipe(concatCSS('style.css', {
        rebaseUrls: false
    }))
    .pipe(postcss([autoprefixer({
        browsers: ['last 2 versions', 'ie >= 8', 'Opera >= 12', 'Safari 6']
    })]))
    .pipe(rework(reworkUrl(function (url) {
        if (url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
            return 'images/' + url;
        } else if (url.match(/\.(ttf|otf|eot|woff|woff2|svg)/) != null) {
            return url.replace('../../', '');
        }
        return url;
    })))
    .pipe(gulp.dest(params.out))
    .pipe(reload({ stream: true }));
});

gulp.task('css', function () {
    return gulp.src('css/*.css')
    .pipe(gulp.dest(params.css))
    .pipe(reload({ stream: true }));
});

gulp.task('js', function (done) {
    webpack(require('./webpack.config.js'), function (err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({
            colors: true
        }));
        reload();
        done();
    });
});

gulp.task('fonts', function () {
    return gulp.src('fonts/**/*')
    .pipe(gulp.dest(params.fonts))
    .pipe(reload({ stream: true }));
});

gulp.task('images', function () {
    return gulp.src('blocks/**/*.{png,jpg,jpeg,svg,gif}')
    .pipe(flatten())
    .pipe(gulp.dest(params.images))
    .pipe(reload({ stream: true }));
});

gulp.task('server', function () {
    browserSync.init({
        server: params.out,
        // browser: 'chrome' // Windows
        browser: 'google-chrome' // Linux
    });
});

gulp.task('watch', function () {
    gulp.watch('html/**/*', gulp.parallel('html'));
    gulp.watch(['blocks/**/*.css', 'blocks/style.css'], gulp.parallel('style'));
    gulp.watch(['blocks/**/*.{png,jpg,jpeg,svg,gif}'], gulp.parallel('images'));
    gulp.watch('css/**/*', gulp.parallel('css'));
    gulp.watch('fonts/**/*', gulp.parallel('fonts'));
});

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('html', 'style', 'css', 'js', 'fonts', 'images', 'favicon')
));

gulp.task('default', gulp.series('build', gulp.parallel('server', 'watch')));
