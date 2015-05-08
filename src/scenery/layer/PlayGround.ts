/**
 * Created by tommyZZM on 2015/4/17.
 */
module game {
    export class PlayGround extends SceneryGround implements ISceneryLayer{
        //public constructor(){
        //    super();
        //    this.init();
        //}

        private _gameobjects:Array<any>;

        private _myplane:He162S;

        public playlayer:alcedo.canvas.DisplatObjectContainer;
        public levellayer:alcedo.canvas.DisplatObjectContainer;

        private _gamestate:GameState;

        protected init(){
            this._gameobjects = [];

            //speed.plane = speed.plane_lazy;
            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,this.onEachTime,this);

            alcedo.addDemandListener(GameStateControl,CmdCatalog.STATE_RESET_TO_HELLO,this.resResetToHello,this)
            alcedo.addDemandListener(GameStateControl,CmdCatalog.STATE_HELLO,this.resHello,this);
            alcedo.addDemandListener(GameStateControl,CmdCatalog.STATE_PREPARE_PLAY,this.resPreparePlay,this)
            alcedo.addDemandListener(GameStateControl,CmdCatalog.STATE_START_PLAYING,this.resStartPlaying,this);
            alcedo.addDemandListener(GameStateControl,CmdCatalog.STATE_OVER_PLAY,this.resOverPlay,this);

            this.playlayer = new alcedo.canvas.DisplatObjectContainer();
            this.levellayer = new alcedo.canvas.DisplatObjectContainer();
            this.addChild(this.levellayer);
            this.addChild(this.playlayer);

            this._myplane = new game.He162S("paopaotucao");
            this._myplane.b.x = 0;
            this._myplane.b.y = stage.height();
            this._myplane.b.pivotX(0.5);this._myplane.b.pivotY(0.5);
            //this._myplane.speed = 0;
            this.addPlayObject(this._myplane);

            ParallaxObject.referenceObject = this._myplane;

            alcedo.proxy(CameraManager).lookAt(this._myplane.b);
            stage.camera().focal = 1;

            //trace(this.className,"init");
        }

        private onEachTime(e){
            //trace("MainGround eachtime");
            var i;
            for(i=0;i<this._gameobjects.length;i++){
                this._gameobjects[i].update(e);
            }

            if(this._gamestate == GameState.PLAYING){
                if(this._myplane.b.y>stage.height() && this._myplane.velocity.y>0){
                    //TODO：掉落云雾的特效
                    alcedo.dispatchCmd(GameStateControl,CmdCatalog.STATE_OVER_PLAY);
                }
            }
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
            this._gamestate = GameState.PRE;

            alcedo.proxy(CameraManager).yawX = 0.23;
            this._myplane.clearForce();

            var lastplanex = this._myplane.b.x;

            this._myplane.b.x = 0;
            this._myplane.b.y = stage.height()-100;
            this._myplane.applyForce(new alcedo.canvas.Vector2D(2,-2),false);
            this._myplane.applyForce(new alcedo.canvas.Vector2D(0,0.1));
            this._myplane.autofly();
            this._myplane.maxspeed = 6;

            trace("resHello");
            alcedo.dispatchCmd(GameSceneryControl,CmdCatalog.RESET_SCENERY,[lastplanex-this._myplane.b.x]);

            alcedo.dispatchCmd(ScreenControl,CmdCatalog.TO_SCREEN,["start"]);
        }

        private resPreparePlay(){
            this._gamestate = GameState.PREPARE;
            var lastplanex = this._myplane.b.x;

            this._myplane.b.x = 100;
            this._myplane.b.y = stage.height()-100;

            this._myplane.clearForce();
            this._myplane.speed = 0;
            this._myplane.readyfly();

            alcedo.dispatchCmd(ScreenControl,CmdCatalog.TO_SCREEN,["playing"]);

            alcedo.dispatchCmd(GameSceneryControl,CmdCatalog.RESET_SCENERY,[lastplanex-this._myplane.b.x]);
        }

        /**开始游戏**/
        private resStartPlaying(){
            this._gamestate = GameState.PLAYING;

            this._myplane.applyForce(new alcedo.canvas.Vector2D(5.6,-5.6),false);
            this._myplane.applyForce(new alcedo.canvas.Vector2D(0,0.1));

            alcedo.proxy(LevelManager).startLevel(this._myplane.b.x);

        }

        /**游戏结束游戏**/
        private resOverPlay(){
            trace("over");
            this._gamestate = GameState.OVER;
            this._myplane.clearForce();

            alcedo.dispatchCmd(ScreenControl,CmdCatalog.TO_SCREEN,["over"]);
        }

        private resResetToHello(){

            alcedo.proxy(LevelManager).turnOffLevel();
        }

        /**重置位置**/
        protected resResetScenery(e:any){
            //TODO:
            //trace(this._myplane.b.x);
        }
    }
}