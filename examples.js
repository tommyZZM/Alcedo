/**
 * Created by tommyZZM on 2015/5/24.
 */
var alcedo = require("./alcedoproj.js");
var gulp = require('gulp');

//例子项目

gulp.task('example', ["example-bezier"
    ,"example-particel","example-hello","example-color-particel",
    "example-sat"
    ]);

newExample("example-bezier","./src-example/display/BezierExample.ts");
newExample("example-particel","./src-example/display/ParticleExample.ts");
newExample("example-color-particel","./src-example/display/ColourfulParticleExample.ts");
newExample("example-movieclip","./src-example/display/MovieClipExample.ts");

newExample("example-sat",["./src-example/tests/HelloSat.ts","./example/sat/script/SAT.d.ts"],"./example/sat/script");

alcedo.projectSourceCode("example-hello",{
    src:["./src-example/tests/HelloWorld.ts","./src-example/ExampleCycler.ts"],
    outdir:"./example/scripts",
    outfile:"test.js"
});

function newExample(name,script,outdir){
    alcedo.projectSourceCode(name,{
        src:Array.isArray(script)?["./src-example/ExampleCycler.ts"].concat(script):["./src-example/ExampleCycler.ts",script],
        outdir:outdir||"./example/scripts",
        outfile:name+".js"
    });
}