/**
 * Created by tommyZZM on 2015/5/24.
 */
var gulp = require('gulp');

var alcedo = require("./alcedoproj.js");

require("./examples");

gulp.task('default', ["alcedo"]);

gulp.task('startserver', function() {
    gulp.src("./")
        .pipe(alcedo.server({port:20210,index:"./example/index.html",bowser:"chrome"}));
});


gulp.task('alcedopixi', ["alcedopixi-proj","hellopixi"]);

alcedo.ProjectCreater.alcedoSourceCodeCompile("alcedopixi-proj",{
    outdir:"./test",
    outfile:"alcedo.js"
},["dom","net","beta-pixi"]);

new alcedo.ProjectCreater({
    projectid:"hellopixi",
    src:["./test/src/**/*.ts"],
    outdir:"./test/scripts",
    outfile:"hellopixi.js",
    alcedo:"./test/alcedo.d.ts",
    reqdts:"./lib/pixi.d.ts"
});


