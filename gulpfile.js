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
    return gulp.src("applications/client/src/jsx/*.jsx").pipe(babel({
        plugins: ['transform-react-jsx']
    })).pipe(gulp.dest("build/tmp/js/"));
});

gulp.task("browserify",  function () {
    return gulp.src('build/tmp/js/*.js')
        .pipe(browserify({
             insertGlobals: true
        }))
        .pipe(gulp.dest('build/dist/public/js/'));
});

gulp.task('copy-static-content', function () {
    return gulp.src(['applications/client/public/**/*']).pipe(gulp.dest('build/dist/public'));
});

gulp.task('copy-static-html', function () {
    return gulp.src(['applications/client/views/*']).pipe(gulp.dest('build/dist/views'));
});

gulp.task('copy-server-classes', function () {
    return gulp.src(['applications/server/*'])
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/dist'));
});

gulp.task('default', gulp.series('clean', 'babel', 'browserify','copy-static-content','copy-static-html', 'copy-server-classes'), function () {});

gulp.task('watch', function(){ return gulp.watch('applications/**',gulp.series('default'))});