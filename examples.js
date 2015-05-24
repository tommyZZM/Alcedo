/**
 * Created by tommyZZM on 2015/5/24.
 */
var alcedo = require("./alcedo.js");
var gulp = require('gulp');

//例子项目

gulp.task('example', ["example-bezier","example-particel","example-hello"]);

new alcedo.ProjectCreater({
    projectid:"example-bezier",
    src:["./src-example/display/BezierExample.ts","./src-example/ExampleCycler.ts"],
    outdir:"./example/scripts",
    outfile:"example-bezier.js"
});

new alcedo.ProjectCreater({
    projectid:"example-particel",
    src:["./src-example/display/ParticleExample.ts","./src-example/ExampleCycler.ts"],
    outdir:"./example/scripts",
    outfile:"example-particel.js"
});

new alcedo.ProjectCreater({
    projectid:"example-hello",
    src:["./src-example/tests/HelloWorld.ts","./src-example/ExampleCycler.ts"],
    outdir:"./example/scripts",
    outfile:"test.js"
});