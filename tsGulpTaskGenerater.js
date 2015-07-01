/**
 * Created by tommyZZM on 2015/5/24.
 */
var gulp = require('gulp');
var ts = require('gulp-typescript');
var tssort = require('gulp-typescript-easysort');
var concat = require('gulp-concat');
var through = require('through');
//console.log("hello world!");
var projectHashDict = {};
var alcedo_modules = {
    "core": __dirname + "/src/core/**/*.ts",
    "dom": __dirname + "/src/internal/dom/**/*.ts",
    "async": __dirname + "/src/internal/async/**/*.ts",
    //test
    "canvas-test": __dirname + "/src/test/canvas/**/*.ts",
    "async-test": __dirname + "/src/test/async/**/*.ts",
    "pixi-test": [__dirname + "/src/test/pixi/**/*.ts", __dirname + "/lib/pixi.d.ts"]
};
var alcedo;
(function (alcedo) {
    //export var server = _server;
    var Project = (function () {
        function Project(config) {
            if (!config.projectid) {
                console.log("ProjectCreater require a unique projectid as name~");
                return;
            }
            projectHashDict[config.projectid] = this;
            this.config = config;
            this.srcfiles = [];
            if (!this.config.reqdts)
                this.config.reqdts = [];
            if (!this.config.reqjs)
                this.config.reqjs = [];
            if (this.config.watch !== false)
                this.config.watch = true;
            //console.log("constructor",this.config.src);
            this.createTasks();
        }
        Project.prototype.createTasks = function () {
            //源文件排序
            //console.log("createTasks",this.config.src);
            var _this = this;
            gulp.task(this.taskname('src-sort'), function () {
                //console.log("bala",this.config.src);
                return gulp.src(_this.config.src).pipe(_this.preGetfilelist()).pipe(tssort()).pipe(_this.getfilelist());
            });
            //源文件编译
            gulp.task(this.taskname('src-compile'), [this.taskname('src-sort')], function () {
                var sourceTsFiles = _this.srcfiles;
                //console.log("precomple",this.srcfiles);
                var sourceDTsFiles = Array.isArray(_this.config.reqdts) ? _this.config.reqdts : [_this.config.reqdts];
                sourceTsFiles = sourceDTsFiles.concat(sourceTsFiles);
                _this.tscproject = ts.createProject({
                    target: 'ES5',
                    declarationFiles: _this.config.outdts,
                    noExternalResolve: true,
                    noEmitOnError: false,
                    sortOutput: true,
                    out: _this.config.outfile
                });
                //console.log("compiling ",sourceTsFiles)
                var tsResult = gulp.src(sourceTsFiles).pipe(ts(_this.tscproject));
                tsResult.dts.pipe(gulp.dest(_this.config.outdir));
                return tsResult.js.pipe(gulp.dest(_this.config.outdir));
            });
            //合并js文件
            gulp.task(this.taskname('src-build'), [this.taskname("src-compile")], function () {
                var buildfiles = [_this.config.outdir + "/" + _this.tscproject.input.options.out];
                if (Array.isArray(_this.config.reqjs)) {
                    buildfiles = _this.config.reqjs.concat(buildfiles);
                }
                else {
                    buildfiles = [_this.config.reqjs, buildfiles[0]];
                }
                gulp.src(buildfiles).pipe(concat(_this.tscproject.input.options.out)).pipe(gulp.dest(_this.config.outdir));
                console.log(buildfiles, _this.projectid + " build success");
            });
            gulp.task(this.taskname('src-watch'), [this.taskname('src-build')], function () {
                gulp.watch(_this.config.src, [_this.taskname('src-build')]);
            });
            gulp.task(this.projectid, function () {
                if (_this.config.watch) {
                    gulp.start([_this.taskname('src-watch')]);
                }
                else {
                    gulp.start([_this.taskname('src-build')]);
                }
            });
        };
        Project.prototype.taskname = function (name) {
            return name + "-" + this.config.projectid;
        };
        Object.defineProperty(Project.prototype, "projectid", {
            get: function () {
                return this.config.projectid;
            },
            enumerable: true,
            configurable: true
        });
        Project.prototype.preGetfilelist = function () {
            var _this = this;
            this.prefilelist = {};
            var files = [];
            var onFile = function (file) {
                _this.prefilelist[file.path] = file;
                files.push(file);
            };
            var onEnd = function () {
                for (var i = 0; i < files.length; i++) {
                    //gutil.log(sortresult[i]);
                    this.emit("data", files[i]);
                }
                this.emit('end');
            };
            return through(onFile, onEnd);
        };
        Project.prototype.getfilelist = function () {
            var _this = this;
            this.srcfiles = [];
            var onFile = function (file) {
                //console.log("preGetfilelist",file.path in this.prefilelist);
                if (file.path in _this.prefilelist) {
                    _this.srcfiles.push(file.path);
                }
            };
            var onEnd = function () {
                this.emit('end');
            };
            return through(onFile, onEnd);
        };
        Project.compiletask = function (name, outfile, opts) {
            if (opts === void 0) { opts = {}; }
            //if(!opts.src)opts.src = [];
            if (opts.src && Array.isArray(opts.src)) {
                for (var i in opts.src) {
                    var m = opts.src[i];
                    if (m in alcedo_modules) {
                        opts.src[i] = alcedo_modules[m];
                    }
                }
            }
            else {
                return;
            }
            new Project({
                projectid: name,
                outdts: opts.outdts,
                src: opts.src,
                alcedo: opts.alcedo,
                outdir: opts.outdir,
                outfile: outfile,
                reqdts: opts.reqdts || "",
                watch: opts.watch === true ? opts.watch : false
            });
        };
        return Project;
    })();
    alcedo.Project = Project;
})(alcedo || (alcedo = {}));
//alcedo.Project.alcedoSourceCode("alcedo","alcedo.js");
exports.gulp = function (_gulp) {
    if (_gulp)
        gulp = _gulp;
};
//exports.alcedoSourceCode = alcedo.Project.alcedoSourceCode;
exports.task = alcedo.Project.compiletask;
//exports.server = _server;
