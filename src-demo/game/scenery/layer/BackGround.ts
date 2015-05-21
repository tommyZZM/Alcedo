/**
 * Created by tommyZZM on 2015/4/17.
 */
module game{
    export class BackGround extends SceneryGround {
        private _clouds:any;
        protected startUp(){
            this._clouds = alcedo.core(ParallaxManager).addParallaxSceneryAt(this
                ,alcedo.core(canvas.TextureRepository).find(/bgcloud\d{2}/)
                ,{
                    name:"clouds",
                    depth:2,
                    widthprecent:1.6,
                    offsety:10
                });
            this.addChild(this._clouds)
            //trace(this._clouds);
        }
    }
}