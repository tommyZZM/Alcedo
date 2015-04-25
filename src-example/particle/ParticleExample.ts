/**
 * Created by tommyZZM on 2015/4/25.
 */
    ///<reference path="../ExampleCycler.ts"/>
module demo {
    export class ParticleExample extends ExampleCycler {
        protected run(){

            var pe = new alcedo.canvas.ParticleEmitter();
            pe.x = stage.width()/2;
            pe.y = stage.height()/2-100;

            stage.addChild(pe);
            pe.play();
        }
    }
}