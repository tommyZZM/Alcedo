/**
 * Created by tommyZZM on 2015/5/16.
 */
module example {
    import alcanvas = alcedo.canvas;

    export class HelloWorld extends ExampleCycler {

        protected size = {
            width:480,
            height:320
        };

        protected run(){
            console.log("run",this.stage.orientchanged);

            var sp:alcanvas.graphic.Rectangle = new alcanvas.graphic.Rectangle(0,0,100,100);
            sp.x = 0;
            sp.y = 0;
            this.stage.addChild(sp);

            trace(sp)
        }
    }
}