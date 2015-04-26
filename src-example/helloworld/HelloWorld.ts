/**
 * Created by tommyZZM on 2015/4/25.
 */
///<reference path="../ExampleCycler.ts"/>
module demo {
    export class HelloWorld extends ExampleCycler {
        protected run(){

            var sp = new alcedo.canvas.Sprite(TextureRepository().get("paopaohappy"))
            sp.x = stage.width()/2;
            sp.y = stage.height()/2;
            sp.pivotX(0.5);sp.pivotY(0.5);
            stage.addChild(sp);
            sp.rotation = 180;
            var splocaltoglobal = sp.localToGlobal(0,0)

            var cri = new alcedo.canvas.shape.Circle(splocaltoglobal.x,splocaltoglobal.y,5,"#e74c3c")
            stage.addChild(cri);

            return;
            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,()=>{
                sp.rotation++;
                var splocaltoglobal = sp.localToGlobal(0,0)

                cri.x = splocaltoglobal.x;
                cri.y = splocaltoglobal.y;
            },this)
        }
    }
}