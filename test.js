/**
 * Created by tommyZZM on 2015/5/24.
 */
var gulp  = require('gulp');

var server    = require('gulp-easy-server');

gulp.task('startserver', function() {
    gulp.src("./")
        .pipe(server({port:2099,index:"index.html",bowser:"chrome"}));
});

gulp.task('default', function(){});
