/**
 * Created by tommyZZM on 2015/5/16.
 */
module example {
    import alcanvas = alcedo.canvas;

    export class HelloWorld extends ExampleCycler {



        protected run(){
            console.log("run",this.stage.orientchanged);

            var sp:alcanvas.graphic.Rectangle = new alcanvas.graphic.Rectangle(0,0,100,100);
            sp.x = this.stage.stageWidth>>1;
            sp.y = this.stage.stageHeight>>1;
            this.stage.addChild(sp);
        }
    }
}