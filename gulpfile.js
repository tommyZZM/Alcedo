/**
 * Created by tommyZZM on 2015/5/24.
 */
var gulp = require('gulp');

var alcedo = require("./alcedoproj.js");

var server = require('gulp-easy-server');

require("./examples");

gulp.task('default', ["alcedo"]);

gulp.task('startserver', function() {
    gulp.src("./")
        .pipe(server({port:20210,index:"./example/index.html",bowser:"chrome"}));
});


gulp.task('alcedopixi', ["alcedopixi-proj","hellopixi"]);

alcedo.alcedoSourceCode("alcedo-all",{
    outdir:"./out",
    outfile:"alcedo.js"
},["dom","async","async-test","canvas-test"]);

alcedo.alcedoSourceCode("alcedopixi-proj",{
    outdir:"./test",
    outfile:"alcedo.js"
},["dom","net","beta-pixi"]);

alcedo.projectSourceCode("hellopixi",{
    src:["./test/src/**/*.ts"],
    outdir:"./test/scripts",
    outfile:"hellopixi.js",
    alcedo:"./test/alcedo.d.ts",
    reqdts:"./lib/pixi.d.ts"
});


