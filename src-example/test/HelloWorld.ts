/**
 * Created by tommyZZM on 2015/5/16.
 */
module example {
    export class HelloWorld extends ExampleCycler {

        protected run(){
            var v = new alcedo.canvas.Vector2D(0,-5);
            var pe = new alcedo.canvas.ParticleEmitter({initial:v,spread:20,max:30,rate:16});

            pe.play();
            pe.applyForce(new alcedo.canvas.Vector2D(0,0.09));

            var a = new alcedo.canvas.DisplatObjectContainer();
            a.addChild(pe);
            this.stage.addChild(a);
            a.x = this.stage.width/2;
            a.y = this.stage.height/2;

            pe.rotation = 10;
            trace(pe)
            return;


            var sp:any = new canvas.graphic.Circle(200,200);
            sp.radius = 10;
            this.stage.addChild(sp);
            sp.acceleration = new canvas.Vector2D();
            sp.velocity = new canvas.Vector2D(1,1);

            trace(sp.force);

            this.stage.addEventListener(canvas.Stage.ENTER_MILLSECOND10,()=>{
                sp.force = sp.velocity.normalize().clone();
                sp.force.length = 0.1;

                sp.acceleration = sp.force;

                sp.velocity.x+=sp.acceleration.x;
                sp.velocity.y+=sp.acceleration.y;

                sp.x+=sp.velocity.x;
                sp.y+=sp.velocity.y;

                sp.velocity.length = 1;

                //trace(sp.velocity.length)

                //trace(sp.x,sp.y);

            },this)
        }
    }
}