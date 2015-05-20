/**
 * Created by tommyZZM on 2015/4/25.
 */
///<reference path="../ExampleCycler.ts"/>
module example {
    export class ParticleExample extends ExampleCycler {
        protected run(){

            var v = new alcedo.canvas.Vector2D(0,-5);
            var pe = new alcedo.canvas.ParticleEmitter({initial:v,spread:20,max:30,rate:16});
            pe.x = this.stage.width/2;
            pe.y = this.stage.height/2;

            this.stage.addChild(pe);
            pe.play();
            pe.applyForce(new alcedo.canvas.Vector2D(0,0.09));
        }
    }
}