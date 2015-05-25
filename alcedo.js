var gulp = require('gulp');
var ts = require('gulp-typescript');
var tssort = require('gulp-typescript-easysort');
var concat = require('gulp-concat');
var _server = require('gulp-easy-server');
var through = require('through');
console.log("hello world!");
var projectHashDict = {};
var alcedocore = __dirname + "/src/core/**/*.ts";
var alcedomodules = {
    "canvas": __dirname + "/src/internal/canvas/**/*.ts",
    "dom": __dirname + "/src/internal/dom/**/*.ts",
    "net": __dirname + "/src/internal/net/**/*.ts",
    "beta-pixi": [__dirname + "/src/test/pixi/**/*.ts", __dirname + "/lib/pixi.d.ts"]
};
var alcedo;
(function (alcedo) {
    alcedo.server = _server;
    var ProjectCreater = (function () {
        function ProjectCreater(config) {
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
            if (!this.config.alcedo)
                this.config.alcedo = "./out/alcedo.d.ts";
            if (this.config.watch !== false)
                this.config.watch = true;
            this.createTasks();
        }
        ProjectCreater.prototype.createTasks = function () {
            //源文件排序
            //console.log("createTasks",this.config.src);
            var _this = this;
            gulp.task(this.taskname('src-sort'), function () {
                return gulp.src(_this.config.src)
                    .pipe(_this.preGetfilelist())
                    .pipe(tssort())
                    .pipe(_this.getfilelist());
            });
            gulp.task(this.taskname('src-compile'), [this.taskname('src-sort')], function () {
                var alcedoTsFiles = _this.srcfiles;
                var sourceTsFiles = Array.isArray(_this.config.reqdts) ? _this.config.reqdts : [_this.config.reqdts];
                if (!_this["sourcecode"]) {
                    sourceTsFiles.push(_this.config.alcedo);
                }
                sourceTsFiles = sourceTsFiles.concat(alcedoTsFiles);
                _this.tscproject = ts.createProject({
                    target: 'ES5',
                    declarationFiles: _this.config.outdts,
                    noExternalResolve: true,
                    noEmitOnError: false,
                    sortOutput: true,
                    out: _this.config.outfile
                });
                var tsResult = gulp.src(sourceTsFiles)
                    .pipe(ts(_this.tscproject));
                tsResult.dts.pipe(gulp.dest(_this.config.outdir));
                return tsResult.js.pipe(gulp.dest(_this.config.outdir));
            });
            gulp.task(this.taskname('src-build'), [this.taskname("src-compile")], function () {
                var buildfiles = [_this.config.outdir + "/" + _this.tscproject.input.options.out];
                if (Array.isArray(_this.config.reqjs)) {
                    buildfiles = _this.config.reqjs.concat(buildfiles);
                }
                else {
                    buildfiles = [_this.config.reqjs, buildfiles[0]];
                }
                gulp.src(buildfiles)
                    .pipe(concat(_this.tscproject.input.options.out))
                    .pipe(gulp.dest(_this.config.outdir));
                console.log(_this.projectid + " build success");
            });
            gulp.task(this.taskname('src-watch'), [this.taskname('src-build')], function () {
                gulp.watch(_this.config.src, [_this.taskname('src-build')]);
            });
            gulp.task(this.projectid, function () {
                gulp.start([_this.taskname('src-watch')]);
            });
        };
        ProjectCreater.prototype.taskname = function (name) {
            return name + "-" + this.config.projectid;
        };
        Object.defineProperty(ProjectCreater.prototype, "projectid", {
            get: function () {
                return this.config.projectid;
            },
            enumerable: true,
            configurable: true
        });
        ProjectCreater.prototype.preGetfilelist = function () {
            var _this = this;
            this.prefilelist = {};
            var files = [];
            var onFile = function (file) {
                _this.prefilelist[file.path] = file;
                files.push(file);
            };
            var onEnd = function () {
                for (var i = 0; i < files.length; i++) {
                    this.emit("data", files[i]);
                }
                this.emit('end');
            };
            return through(onFile, onEnd);
        };
        ProjectCreater.prototype.getfilelist = function () {
            var _this = this;
            this.srcfiles = [];
            var onFile = function (file) {
                if (file.path in _this.prefilelist) {
                    _this.srcfiles.push(file.path);
                }
            };
            var onEnd = function () {
                this.emit('end');
            };
            return through(onFile, onEnd);
        };
        ProjectCreater.alcedoSourceCodeCompile = function (name, opts, modules) {
            if (opts === void 0) { opts = {}; }
            var pushmodule = function (name) {
                if (Array.isArray(alcedomodules[name])) {
                    src = src.concat(alcedomodules[name]);
                }
                else if (typeof alcedomodules[name] === "string") {
                    src.push(alcedomodules[name]);
                }
            };
            var src = [];
            src.push(alcedocore);
            if (!modules) {
                pushmodule("canvas");
                pushmodule("dom");
                pushmodule("net");
            }
            else {
                for (var i in modules) {
                    pushmodule(modules[i]);
                }
            }
            var proj = new alcedo.ProjectCreater({
                projectid: name,
                outdts: true,
                src: src,
                outdir: opts.outdir || "./out",
                outfile: opts.outfile || "alcedo.js"
            });
            proj["sourcecode"] = true;
            this.alcedolib[name] = proj.config.outdir + "/" + proj.config.outfile;
            return proj;
        };
        ProjectCreater.alcedolib = {};
        return ProjectCreater;
    })();
    alcedo.ProjectCreater = ProjectCreater;
})(alcedo || (alcedo = {}));
alcedo.ProjectCreater.alcedoSourceCodeCompile("alcedo", "alcedo.js");
module.exports = alcedo;
