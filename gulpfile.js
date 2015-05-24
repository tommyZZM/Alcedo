/**
 * Created by tommyZZM on 2015/5/24.
 */
var gulp = require('gulp');

var alcedo = require("./alcedo.js");

require("./examples");

gulp.task('default', ["startserver","alcedo"]);

gulp.task('startserver', function() {
    gulp.src("./")
        .pipe(alcedo.server({port:2099,index:"./example/index.html",bowser:"chrome"}));
});


