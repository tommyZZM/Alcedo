var file = require("fs");
var gulp = require('gulp');

var ts   = require('gulp-typescript');
var tssort = require('gulp-typescript-easysort');

var filelist = require('gulp-filelist');
var concat   = require('gulp-concat');
//var merge = require('merge2');
var del = require('del');

gulp.task('default', function(){
    console.log("gulp alcedo (build alcedo source code)");
    console.log("gulp colorjet (build [demo]colorjet source code)");

});

var srcconfig = {
    "src":'./src/**/*.ts',
    "out":"./out",
    "outfile":"alcedo.js",

    "alcedolib_dts":"./require/**/*.d.ts",
    alcedolib_js:"./require/**/*.js",

    "require_dts":"",
    "dts":true,

    colorjet:"./src-example/colorjet/**/*.ts"
};

var alcedosrcpoj = ts.createProject({
  target: 'ES5',
  declarationFiles: true,
  noExternalResolve: true,
  noEmitOnError :false,
  sortOutput :true,
  out :srcconfig.outfile
});

//alcedo源码排序
gulp.task('src-sort', function() {
    return gulp.src(srcconfig.src)
        .pipe(tssort())
        .pipe(filelist('alcedo-src-filelist.json'))
        .pipe(gulp.dest("tmp/"));
});

//alcedo源码编译
gulp.task('src-compile',['src-sort'], function() {
    var alcedoTsFiles = JSON.parse(file.readFileSync("./tmp/alcedo-src-filelist.json"));
    var sourceTsFiles = [srcconfig.alcedolib_dts,srcconfig.require_dts]
    sourceTsFiles = sourceTsFiles.concat(alcedoTsFiles)

    var tsResult = gulp.src(sourceTsFiles)
                       .pipe(ts(alcedosrcpoj));

    tsResult.dts.pipe(gulp.dest(srcconfig.out));
    return tsResult.js.pipe(gulp.dest(srcconfig.out));
});

//alcedo编译后与lib里的js合并
gulp.task('src-build',["src-compile"],function(){
    if(srcconfig.src === './src/**/*.ts'){
        gulp.src([srcconfig.alcedolib_js,srcconfig.out+"/"+alcedosrcpoj.input.options.out])
            .pipe(concat(alcedosrcpoj.input.options.out))
            .pipe(gulp.dest(srcconfig.out));
    }
    del("./tmp");
    console.log("success")
});

gulp.task('src-watch', ['src-build'], function() {
  gulp.watch(srcconfig.src, ['src-build']);
});

//var srcpath = './src/**/*.ts';
//对于alcedo的编译任务
gulp.task('alcedo', function(){
    srcconfig.src = './src/**/*.ts';
    gulp.start(['src-watch'])
});

//对于小灰机的编译任务
gulp.task('colorjet', function(){
    srcconfig.src = './src-demo/**/*.ts';
    srcconfig.out = "./demo/script/";
    srcconfig.outfile = "colorjet.js";
    srcconfig.require_dts = "./out/alcedo.d.ts";

    alcedosrcpoj = ts.createProject({
        target: 'ES5',
        declarationFiles: false,
        noExternalResolve: true,
        noEmitOnError :false,
        sortOutput :true,
        out :srcconfig.outfile
    });

    gulp.start(['src-watch'])
});

//debug
try{
    var server = require('gulp-server-livereload');

    gulp.task('colorjetrun', function() {
        gulp.src('./')
            .pipe(server({
                port:2010,
                defaultFile: 'demo/index.html',
                open:true
            }));
    });

}catch (e){}



