var gulp = require('gulp');
var concat  = require('gulp-concat');
var strip = require('gulp-strip-comments');
var minify = require('gulp-minify');
var headerfooter = require('gulp-header-footer');
var gulpSequence = require('gulp-sequence');

var header="\
/*\n\
    MIT LICENSE @2016 Ivan Lausuch <ilausuch@gmail.com>\n\
*/";

gulp.task('compile', function(){
    return gulp.src(['src/core/*.js','src/elements/*.js','src/angularElements/*.js'])
        .pipe(strip())
        .pipe(concat('autoForm.js'))
        .pipe(headerfooter({
            header:header,
            footer:'',
            filter: function(file){
                return true;
            }
          }))
        .pipe(gulp.dest('dist'));
});

gulp.task('minimize', function(){
    return gulp.src('dist/autoForm.js')
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task("build",function(cb){
    gulpSequence('compile','minimize',cb);
});
