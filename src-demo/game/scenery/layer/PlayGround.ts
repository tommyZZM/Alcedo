/**
 * Created by tommyZZM on 2015/4/17.
 */
module game {
    export class PlayGround extends SceneryGround {
        //public constructor(){
        //    super();
        //    this.init();
        //}

        private _gameobjects:Array<any>;

        private _myplane:He162S;

        public playlayer:alcedo.canvas.DisplatObjectContainer;
        public levellayer:alcedo.canvas.DisplatObjectContainer;

        protected startUp(){
            this._gameobjects = [];

            //speed.plane = speed.plane_lazy;
            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,this.onEachTime,this);

            //this.playlayer = new alcedo.canvas.DisplatObjectContainer();
            //this.levellayer = new alcedo.canvas.DisplatObjectContainer();
            //this.addChild(this.levellayer);
            //this.addChild(this.playlayer);
            //
            //this._myplane = new game.He162S("paopaotucao");
            //this._myplane.b.x = 0;
            //this._myplane.b.y = stage.stageHeight;
            //this._myplane.b.pivotX=0.5;this._myplane.b.pivotY=0.5;
            ////this._myplane.speed = 0;
            //this.addPlayObject(this._myplane);
            //
            //
            //alcedo.core(CameraManager).lookAt(this._myplane.b);
            //stage.camera.focal = 1;
            //
            //this.resHello()
            ////trace(this.className,"init");
        }

        private onEachTime(e){
            var i;
            for(i=0;i<this._gameobjects.length;i++){
                this._gameobjects[i].update(e);
            }

            //if(this._gamestate == GameState.PLAYING){
            //    if(this._myplane.b.y>stage.height() && this._myplane.velocity.y>0){
            //        //TODO：掉落云雾的特效
            //        alcedo.dispatchCmd(GameStateControl,CmdCatalog.STATE_OVER_PLAY);
            //    }
            //}
        }

        public addPlayObject(obj:LogicObject){
            this.playlayer.addChild(obj.b);
            this._gameobjects.push(obj);
        }

        public removeObject(obj:LogicObject){
            this.removeChild(obj.b);
            var index = this._gameobjects.indexOf(obj);
            this._gameobjects.splice(index,1);
        }

        /**
         * Response Command
         */

        /**还没开始游戏的状态**/
        private resHello(){
            this.levellayer.removeChildren();

            alcedo.core(CameraManager).yawX = 0.23;
            this._myplane.clearForce();

            this._myplane.b.x = 0;
            this._myplane.b.y = stage.stageHeight-100;
            this._myplane.applyForce(new alcedo.canvas.Vector2D(6,-6),false);
            this._myplane.applyForce(new alcedo.canvas.Vector2D(0,0.1));
            this._myplane.autofly();
            this._myplane.maxspeed = 6;

            trace(this._myplane.b.y);

            trace("resHello");
            //alcedo.dispatchCmd(GameSceneryControl,CmdCatalog.RESET_SCENERY,[lastplanex-this._myplane.b.x]);
            //
            //alcedo.dispatchCmd(ScreenControl,CmdCatalog.TO_SCREEN,["start"]);
        }
    }
}