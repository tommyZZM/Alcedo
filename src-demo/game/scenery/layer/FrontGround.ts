/**
 * Created by tommyZZM on 2015/4/17.
 */
module game{
    export class FrontGround extends SceneryGround {
        private _clouds:any;
        protected startUp(){
            this._clouds = alcedo.core(ParallaxManager).addParallaxSceneryAt(this
                ,alcedo.core(canvas.TextureRepository).get("fgcloud")
                ,{
                    name:"clouds2",
                    depth:5,
                    beginx:0
                });
            this.addChild(this._clouds);
            //trace(this._clouds);
        }
    }
}