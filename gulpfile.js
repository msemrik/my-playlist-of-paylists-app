var gulp = require('gulp');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function () {
    return gulp.src(['build/dist/*','build/tmp/*'], {allowEmpty: true,read: false})
        .pipe(clean({force: true}));
});

gulp.task("babel", function () {
    return gulp.src("applications/client/src/jsx/*.jsx")
        .pipe(sourcemaps.init())

        .pipe(babel({
        plugins: ['transform-react-jsx']
    }))
        .on('error', swallowError)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/tmp/js/"));
});

gulp.task("browserify",  function () {
    return gulp.src('build/tmp/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(browserify({
             insertGlobals: true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/dist/public/js/'));
});

gulp.task('copy-static-content', function () {
    return gulp.src(['applications/client/public/**/*'])
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/dist/public'));
});

gulp.task('copy-static-html', function () {
    return gulp.src(['applications/client/views/*']).pipe(gulp.dest('build/dist/views'));
});

gulp.task('copy-server-classes', function () {
    return gulp.src(['applications/server/**'])
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/dist'));
});

gulp.task('default', gulp.series('clean', 'babel', 'browserify','copy-static-content','copy-static-html', 'copy-server-classes'), function () {});

gulp.task('watch', function(){ return gulp.watch('applications/**',gulp.series('default'))});


function swallowError (error) {

    // If you want details of the error in the console
    console.log(error.toString())

    this.emit('end')
}

