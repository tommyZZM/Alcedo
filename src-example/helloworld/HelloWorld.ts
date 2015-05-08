/**
 * Created by tommyZZM on 2015/4/25.
 */
///<reference path="../ExampleCycler.ts"/>
module demo {
    export class HelloWorld extends ExampleCycler {
        protected run(){

            var points = [
                new alcedo.canvas.Point2D(100,100),
                new alcedo.canvas.Point2D(stage.width()/2-80,stage.height()/2-20),
                new alcedo.canvas.Point2D(stage.width()/2+80,stage.height()/2+20),
                new alcedo.canvas.Point2D(stage.width()-100,stage.height()-100)
            ]
            var bz = new alcedo.canvas.Bezier2D(points,20);

            bz.eachPointsOnCurve((point)=>{
                var sp = new alcedo.canvas.graphic.Circle(point.x,point.y,5,"#3498db");
                stage.addChild(sp);
            });

            points.forEach((point)=>{
                var sp = new alcedo.canvas.graphic.Circle(point.x,point.y,5,"#e67e22");
                stage.addChild(sp);
            })

            //var sp = new alcedo.canvas.Sprite(TextureRepository().get("paopaohappy"))
            //sp.x = stage.width()/2;
            //sp.y = stage.height()/2;
            //sp.pivotX(0.5);sp.pivotY(0.5);
            //stage.addChild(sp);
            //sp.rotation = 180;
            //var splocaltoglobal = sp.localToGlobal(0,0)
            //
            //var cri = new alcedo.canvas.shape.Circle(splocaltoglobal.x,splocaltoglobal.y,5,"#e74c3c")
            //stage.addChild(cri);
            //
            //return;
            //stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,()=>{
            //    sp.rotation++;
            //    var splocaltoglobal = sp.localToGlobal(0,0)
            //
            //    cri.x = splocaltoglobal.x;
            //    cri.y = splocaltoglobal.y;
            //},this)
        }
    }
}