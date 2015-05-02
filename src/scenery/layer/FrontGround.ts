/**
 * Created by tommyZZM on 2015/4/17.
 */
module game{
    export class FrontGround extends alcedo.canvas.DisplatObjectContainer implements ISceneryLayer{

        public constructor(){
            super();
            this.init();
        }

        private _clouds:FrontGroundClouds;
        public init(){
            this._clouds = new FrontGroundClouds(0.1);
            this.addChild(this._clouds);
        }
    }

    class FrontGroundClouds extends ParallaxObject{

        private _propstexture:alcedo.canvas.Texture;

        protected _propmax:number = 6;

        protected preInitProps(){
            //trace(this._propmax);
            this._propmax = 6;
            this._propstexture = TextureRepository().get("fgcloud");
        }

        protected onCreateAProp(prop:alcedo.canvas.Sprite){
            prop.texture = this._propstexture;
            //trace(prop.texture)
            prop.scaleToWidth(stage.width())
            //prop.visible = false;
        }
    }
}