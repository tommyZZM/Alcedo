/**
 * Created by tommyZZM on 2015/5/24.
 */
var gulp = require('gulp');

var alcedo = require("./tsGulpTaskGenerater.js");

var server = require('gulp-easy-server');

var ts     = require('gulp-typescript');

require("./examples");

gulp.task('default',["generaterCompile"], function(){
    gulp.watch("./tsGulpTaskGenerater.ts",["generaterCompile"])
});

gulp.task('generaterCompile',function(){
    var tscproject = ts.createProject({
        target: 'ES5',
        declarationFiles: false,
        noExternalResolve: true,
        noEmitOnError :false,
        sortOutput :true
    });

    //console.log("compiling ",sourceTsFiles)
    var tsResult = gulp.src(["./definitely/**/*.d.ts","./tsGulpTaskGenerater.ts"])
        .pipe(ts(tscproject));

    return tsResult.js.pipe(gulp.dest("./"));
});

gulp.task('startserver', function() {
    gulp.src("./")
        .pipe(server({port:20210,index:"./example/index.html",bowser:"chrome"}));
});

alcedo.task("alcedo","alcedo.js",{
    src:["core"],
    outdts:true,
    outdir:"./out/",
    watch:true
});

//gulp.task('alcedopixi', ["alcedopixi-proj","hellopixi"]);
//
//alcedo.alcedoSourceCode("alcedo-all",{
//    outdir:"./out",
//    outfile:"alcedo.js"
//},["dom","async","async-test","canvas-test"]);
//
//alcedo.alcedoSourceCode("alcedopixi-proj",{
//    outdir:"./test",
//    outfile:"alcedo.js"
//},["dom","net","beta-pixi"]);
//
//alcedo.projectSourceCode("hellopixi",{
//    src:["./test/src/**/*.ts"],
//    outdir:"./test/scripts",
//    outfile:"hellopixi.js",
//    alcedo:"./test/alcedo.d.ts",
//    reqdts:"./lib/pixi.d.ts"
//});


