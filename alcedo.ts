/**
 * Created by tommyZZM on 2015/5/24.
 */
var gulp:any  = require('gulp');

var ts:any        = require('gulp-typescript');
var tssort:any   = require('gulp-typescript-easysort');
var concat:any    = require('gulp-concat');
var _server:any    = require('gulp-easy-server');

var through:any  = require('through');

//gulp.task('startserver', function() {
//    gulp.src("./")
//        .pipe(server({port:2099,index:alcedo.debugserver.index,bowser:"chrome"}));
//});
console.log("hello world!");
 through
var projectHashDict = {};

module alcedo{

    export var server = _server;

    export class ProjectCreater{
        private config:any;
        private srcfiles:any;
        private tscproject:any;

        public constructor(config:{
            projectid:string;
            outdts?:boolean;
            src:Array<any>|string;
            outdir:string;
            outfile:string;
            reqdts?:Array<any>;
            reqjs?:Array<any>;
            watch?:boolean
        }){
            if(!config.projectid){
                console.log("ProjectCreater require a unique projectid as name~");
                return;
            }

            projectHashDict[config.projectid] = this;
            //if(projectHashDict[config.projectid]){
            //    console.log(config.projectid,"has been taken.");
            //    return;
            //}else{
            //    projectHashDict[config.projectid] = this;
            //}

            this.config = config;
            this.srcfiles = [];

            if(!this.config.reqdts)this.config.reqdts = [];
            if(!this.config.reqjs)this.config.reqjs = [];
            if(this.config.watch!==false)this.config.watch = true;

            //console.log("constructor",this.config.src);

            this.createTasks();
        }

        private createTasks(){
            //源文件排序
            //console.log("createTasks",this.config.src);

            gulp.task(this.taskname('src-sort'), ()=>{
                //console.log("bala",this.config.src);
                return gulp.src(this.config.src)
                    .pipe(this.preGetfilelist())
                    .pipe(tssort())
                    .pipe(this.getfilelist())
            });

            //源文件编译
            gulp.task(this.taskname('src-compile'),[this.taskname('src-sort')], ()=>{
                var alcedoTsFiles = this.srcfiles;
                //console.log("precomple",this.srcfiles);
                var sourceTsFiles = Array.isArray(this.config.reqdts)?this.config.reqdts:[this.config.reqdts];
                if (!this["sourcecode"]) {
                    sourceTsFiles.push("./out/alcedo.d.ts");
                }

                sourceTsFiles = sourceTsFiles.concat(alcedoTsFiles);

                this.tscproject = ts.createProject({
                    target: 'ES5',
                    declarationFiles: this.config.outdts,
                    noExternalResolve: true,
                    noEmitOnError :false,
                    sortOutput :true,
                    out :this.config.outfile
                });

                //console.log("compiling ",sourceTsFiles)
                var tsResult = gulp.src(sourceTsFiles)
                    .pipe(ts(this.tscproject));

                tsResult.dts.pipe(gulp.dest(this.config.outdir));
                return tsResult.js.pipe(gulp.dest(this.config.outdir));
            });

            //合并js文件
            gulp.task(this.taskname('src-build'),[this.taskname("src-compile")],()=>{

                var buildfiles = [this.config.outdir+"/"+this.tscproject.input.options.out];
                if(Array.isArray(this.config.reqjs)){
                    buildfiles = this.config.reqjs.concat(buildfiles);
                }else{
                    buildfiles = [this.config.reqjs,buildfiles[0]]
                }

                gulp.src(buildfiles)
                    .pipe(concat(this.tscproject.input.options.out))
                    .pipe(gulp.dest(this.config.outdir));
                console.log(this.projectid+" build success")
            });

            gulp.task(this.taskname('src-watch'), [this.taskname('src-build')], ()=>{
                gulp.watch(this.config.src, [this.taskname('src-build')]);
            });

            gulp.task(this.projectid,()=>{
                gulp.start([this.taskname('src-watch')])
            })
        }

        public get task(){
            return this.taskname('src-watch');
        }

        private taskname(name:string){
            return name+"-"+this.config.projectid;
        }

        private get projectid(){
            return this.config.projectid;
        }

        private prefilelist:any;
        private preGetfilelist(){
            this.prefilelist = {};
            var files = [];
            var onFile = (file)=>{
                this.prefilelist[file.path]= file;
                files.push(file)
            };

            var onEnd = function() {
                for(var i=0;i<files.length;i++){
                    //gutil.log(sortresult[i]);
                    this.emit("data",files[i])
                }
                this.emit('end');
            };

            return through(onFile, onEnd);
        }

        private getfilelist(){
            this.srcfiles = [];
            var onFile = (file)=>{
                //console.log("preGetfilelist",file.path in this.prefilelist);
                if(file.path in this.prefilelist){
                    this.srcfiles.push(file.path);
                }
            };

            var onEnd = function() {
                this.emit('end');
            };

            return through(onFile, onEnd);
        }
    }
}

var sourcecodetask:any = new alcedo.ProjectCreater({
    projectid:"alcedo",
    outdts:true,
    src:__dirname+"/src/**/*.ts",
    outdir:"./out",
    outfile:"alcedo.js"
});
sourcecodetask.sourcecode = true;

module.exports = alcedo;
