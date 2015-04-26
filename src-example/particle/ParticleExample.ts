/**
 * Created by tommyZZM on 2015/4/25.
 */
///<reference path="../ExampleCycler.ts"/>
module demo {
    export class ParticleExample extends ExampleCycler {
        protected run(){

            var v = new alcedo.canvas.Vector2D(0,-5);
            var pe = new alcedo.canvas.ParticleEmitter(v,{spread:20,max:20,rate:10});
            pe.x = stage.width()/2;
            pe.y = stage.height()/2;

            stage.addChild(pe);
            pe.play();
            pe.applyForce(new alcedo.canvas.Vector2D(0,0.09));

            trace(v.toDeg())
        }
    }
}