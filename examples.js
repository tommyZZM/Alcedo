/**
 * Created by tommyZZM on 2015/5/24.
 */
var alcedo = require("./alcedoproj.js");
var gulp = require('gulp');

//例子项目

gulp.task('example', ["example-bezier","example-particel","example-hello","example-color-particel"]);

newExample("example-bezier","./src-example/display/BezierExample.ts");
newExample("example-particel","./src-example/display/ParticleExample.ts");
newExample("example-color-particel","./src-example/display/ColourfulParticleExample.ts");

new alcedo.ProjectCreater({
    projectid:"example-hello",
    src:["./src-example/tests/HelloWorld.ts","./src-example/ExampleCycler.ts"],
    outdir:"./example/scripts",
    outfile:"test.js"
});

function newExample(name,script){
    new alcedo.ProjectCreater({
        projectid:name,
        src:Array.isArray(script)?["./src-example/ExampleCycler.ts"].concat(script):["./src-example/ExampleCycler.ts",script],
        outdir:"./example/scripts",
        outfile:name+".js"
    });
}