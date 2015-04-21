/**
 * Created by tommyZZM on 2015/4/17.
 */
module game {
    export class MainGround extends alcedo.canvas.DisplatObjectContainer {
        public constructor(){
            super();
            this.init();
        }

        private _f$obj:LogicObject;
        public init(){
            var sp = new Sprite(<any>alcedo.proxy(TextureRepository).get("paopaoxieyanxiao"));
            sp.x = 100;
            sp.y = stage.height()/2;
            sp.pivotX(0.5);sp.pivotY(0.5)
            this.addChild(sp);
            this._f$obj = new game.LogicObject(sp);
            this._f$obj.direction = alcedo.canvas.Vector2D.identity(1,0);
            speed.plane = this._f$obj.speed = speed.plane_lazy;

            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,this.onEachTime,this)
            alcedo.addDemandListener(GameStateControl,CmdCatalog.STATE_START_PLAYING,this.resStartPlaying,this);
            alcedo.proxy(CameraManager).init(stage.camera());
            alcedo.proxy(CameraManager).lookAt(this._f$obj.b);
            stage.camera().focal = 1
        }

        private onEachTime(){
            this._f$obj.b.rotation++;
            //stage.camera().zoomTo(this._f$obj.b.x,this._f$obj.b.y,1,0.5);
        }

        /**
         * Response Command
         */

        /**开始游戏**/
        private resStartPlaying(){
            //trace(this._fuckobj.isInViewPort());
            speed.plane = speed.plane_active;
            this._f$obj.speed = speed.plane;
            this._f$obj.acceleration.y = 0.6;
        }

        /**重置位置**/
        public resReturnPos(){
            //TODO:
        }
    }
}