var file = require("fs");
var gulp = require('gulp');

var ts   = require('gulp-typescript');
var tssort = require('gulp-typescript-easysort');
var concat   = require('gulp-concat');

var through = require('through');
var del = require('del');

var srcconfig = {
    "src":'./src/**/*.ts',
    "srcfiles":[],
    "out":"./out",
    "outfile":"alcedo.js",

    require_js:"./require/**/*.js",
    "require_dts":"./require/**/*.d.ts",

    "dts":true,

    colorjet:"./src-example/colorjet/**/*.ts",

    id:"src"
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
var getfilelist = function() {
    //获取文件并放进数组
    srcconfig.srcfiles = [];
    var onFile = function(file) {
        srcconfig.srcfiles.push(file.path)
    };

    var onEnd = function() {
        this.emit('end');
    };

    return through(onFile, onEnd);
};
gulp.task('src-sort', function() {
    return gulp.src(srcconfig.src)
        .pipe(tssort())
        .pipe(getfilelist())
});

//源码编译
gulp.task('src-compile',['src-sort'], function() {
    var alcedoTsFiles = srcconfig.srcfiles;
    var sourceTsFiles = Array.isArray(srcconfig.require_dts)?srcconfig.require_dts:[srcconfig.require_dts];
    sourceTsFiles = sourceTsFiles.concat(alcedoTsFiles);

    var tsResult = gulp.src(sourceTsFiles)
                       .pipe(ts(alcedosrcpoj));

    tsResult.dts.pipe(gulp.dest(srcconfig.out));
    return tsResult.js.pipe(gulp.dest(srcconfig.out));
});

//编译后与lib里的js合并
gulp.task('src-build',["src-compile"],function(){

    var buildfiles = [srcconfig.out+"/"+alcedosrcpoj.input.options.out];
    if(Array.isArray(srcconfig.require_js)){
        buildfiles = srcconfig.require_js.concat(buildfiles);
    }else{
        buildfiles = [srcconfig.require_js,buildfiles[0]]
    }

    gulp.src(buildfiles)
        .pipe(concat(alcedosrcpoj.input.options.out))
        .pipe(gulp.dest(srcconfig.out));
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
    srcconfig.require_dts = ["./out/alcedo.d.ts","./demo/require/**/*.d.ts"];
    srcconfig.require_js = "./demo/require/**/*.js";

    srcconfig.id = "colorjet";

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

//example
gulp.task('example-p2', function(){
    var example = (function(){
        var arr = process.argv.slice(2);
        var i = 0, li = arr.length;
        for (; i < li; i++) {
            var itemi = arr[i];
            var test = (/^-{1}(\w+)/.exec(itemi))
            if(test){
                return test[1];
            }
        }
    })();
    if(!example){
        return;
    }
    console.log("watching example",example);
    srcconfig.src = ['./src-example/ExampleCycler.ts','./src-example/p2physis/'+example+'/**/*.ts'];
    srcconfig.out = './example/p2physis/script/';
    srcconfig.outfile = example+".js";
    srcconfig.require_dts = ["./out/alcedo.d.ts","./example/p2physis/require/**/*.d.ts"];
    srcconfig.require_js = [];

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
   var server = require('gulp-easy-server');
}catch (e){
}
gulp.task('startserver', function() {
   if(server){
      gulp.src('./')
          .pipe(server({port:2099,index:"demo/test.html",bowser:"chrome"}));
   }
});

//devlope
gulp.task('default', ["alcedo"]);
