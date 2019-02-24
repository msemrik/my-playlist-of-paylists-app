var gulp = require('gulp');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify-es').default;
var terser = require('gulp-terser');
const concat = require('gulp-concat');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');


// var minify = require('gulp-minify');

gulp.task('clean', function () {
    return gulp.src(['build/dist/*','build/tmp/*','applications/client/public/js/*'], {allowEmpty: true,read: false})
        .pipe(clean({force: true}));
});

gulp.task("babel", function () {
    return gulp.src("applications/client/src/jsx/*.jsx")
        .pipe(sourcemaps.init())

        .pipe(babel({
        plugins: ['transform-react-jsx']
    }))
        .on('error', swallowError)
        // .pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("build/tmp/js/"));
});

gulp.task("browserify",  function () {
    return gulp.src('build/tmp/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(browserify({
             insertGlobals: true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/dist/public/js/'));
});

gulp.task('copy-static-content', function () {
    return gulp.src(['applications/client/public/**/*'])
        // .pipe(sourcemaps.init())
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/dist/public'));
});

gulp.task('copy-static-html', function () {
    return gulp.src(['applications/client/views/*']).pipe(gulp.dest('build/dist/views'));
});

gulp.task('copy-server-classes', function () {
    return gulp.src(['applications/server/*'])
        .pipe(sourcemaps.init())
        // .pipe(sourcemaps.identityMap())
        // .pipe(uglify({compress:false, ecma: 5,mangle:true}/*{noSource: true, ext:'.js'}*/))
        .pipe(uglify({
            mangle: true,
            output: {
                beautify: true
            }
        }))
        // .pipe(terser())
        // .pipe(sourcemaps.mapSources(function(sourcePath, file) {
            // source paths are prefixed with '../src/'
            // return '/home/msemrik/Desarrollo/Codigos/my-playlist-of-paylists-app/applications/server/' + sourcePath;
        // }))
        // .pipe(sourcemaps.write('../../applications/server'))
        .pipe(sourcemaps.write('.' , {includeContent:false}))
        .pipe(gulp.dest('build/dist'));
});


gulp.task('copy-server-classes2', function () {
    return gulp.src(['applications/server/configuration/*'])
        .pipe(sourcemaps.init({loadMaps:true}))
        // .pipe(sourcemaps.identityMap())
        // .pipe(uglify({compress:false}/*{noSource: true, ext:'.js'}*/))
        // .pipe(sourcemaps.mapSources(function(sourcePath, file) {
        // source paths are prefixed with '../src/'
        // return '/home/msemrik/Desarrollo/Codigos/my-playlist-of-paylists-app/applications/server/' + sourcePath;
        // }))
        // .pipe(sourcemaps.write('../../applications/server'))
        .pipe(sourcemaps.write('.',{includeContent:false}  ))
        .pipe(gulp.dest('build/dist/configuration'));
});


gulp.task('default', gulp.series('clean', 'babel'/*, 'browserify'*/,'copy-static-content','copy-static-html', 'copy-server-classes'), function () {});

// gulp.task('default', gulp.series('clean', 'copy-server-classes', 'copy-server-classes2'), function () {});

gulp.task('watch', function(){ return gulp.watch('applications/**', {delay:5000} ,gulp.series('default'))});


function swallowError (error) {

    // If you want details of the error in the console
    console.log(error.toString())

    this.emit('end')
}

gulp.task('webpack', function () {
    return gulp.src('applications/client/src/jsx/*')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('dist2'));
});