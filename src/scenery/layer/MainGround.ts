/**
 * Created by tommyZZM on 2015/4/17.
 */
module game {
    export class MainGround extends alcedo.canvas.DisplatObjectContainer {
        public constructor(){
            super();
            this.init();
        }

        private _fuckobj:alcedo.canvas.Sprite;
        public init(){
            var sp = new Sprite(<any>alcedo.proxy(TextureRepository).get("paopaoxieyanxiao"));
            sp.addEventListener(alcedo.canvas.DisplayObjectEvent.ON_ADD_TO_STAGE,()=>{trace("added...")});
            this.addChild(sp);
            sp.x = 100;
            sp.y = stage.height()/2;
            sp.pivotX(0.5);
            sp.pivotY(0.5);
            sp.scale(1);
            this._fuckobj = sp;

            alcedo.addDemandListener(GameStateControl,CmdCatalog.STATE_START_PLAYING,this.resStartPlaying,this);

            stage.addEventListener(alcedo.canvas.Stage.ENTER_10MILLSECOND,()=>{
                this._fuckobj.x+=3;
                stage.camera().zoomTo(this._fuckobj.x,this._fuckobj.y,1,0.5);
                this._fuckobj.rotation+=2;
            },this);
        }

        private resStartPlaying(){
            trace(this._fuckobj.isInViewPort());
            //sp.visible = false;
        }
    }
}