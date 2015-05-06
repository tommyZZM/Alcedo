/**
 * Created by tommyZZM on 2015/4/17.
 */
module game{
    export class FrontGround extends SceneryGround implements ISceneryLayer{

        private _clouds:FrontGroundClouds;
        protected init(){
            this._clouds = new FrontGroundClouds(0.1);
            this.addChild(this._clouds);
        }

        protected resResetScenery(e:any){
            //TODO:
            this._clouds.eachChilder((child)=>{
                child.x-=e.x;
            })
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