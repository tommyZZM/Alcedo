/**
 * Created by tommyZZM on 2015/4/17.
 */
module game {
    export class PlayGround extends alcedo.canvas.DisplatObjectContainer {
        public constructor(){
            super();
            this.init();
        }

        private _myplane:LogicObject;

        public playlayer:alcedo.canvas.DisplatObjectContainer;
        public levellayer:alcedo.canvas.DisplatObjectContainer;

        public init(){
            speed.plane = speed.plane_lazy;
            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,this.onEachTime,this);

            alcedo.addDemandListener(GameStateControl,CmdCatalog.STATE_START_PLAYING,this.resStartPlaying,this);

            this.playlayer = new alcedo.canvas.DisplatObjectContainer();
            this.levellayer = new alcedo.canvas.DisplatObjectContainer();
            this.addChild(this.levellayer);
            this.addChild(this.playlayer);

            this._myplane = new game.He162S("paopaotucao");
            this._myplane.b.x = 100;
            this._myplane.b.y = stage.height()/2;
            this._myplane.b.pivotX(0.5);this._myplane.b.pivotY(0.5);
            this._myplane.speed = speed.plane;
            this.addPlayObject(this._myplane);

            alcedo.proxy(CameraManager).lookAt(this._myplane.b);
            stage.camera().focal = 1;
        }

        private onEachTime(e){
            //trace("MainGround eachtime");
            var i;
            for(i=0;i<this._gameobjects.length;i++){
                this._gameobjects[i].update(e);
            }
            if(this._myplane.b.y>=260){
                this._myplane.applyForce(new alcedo.canvas.Vector2D(0,-2));
            }
        }

        private _gameobjects = [];
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

        /**开始游戏**/
        private resStartPlaying(){
            //trace(this._fuckobj.isInViewPort());
            speed.plane = speed.plane_active;
            this._myplane.speed = speed.plane;
            this._myplane.velocity.y-=3;
            this._myplane.acceleration.y = 0.1;

            alcedo.proxy(LevelManager).startLevel(this._myplane.b.x);
        }






        /**重置位置**/
        public resReturnPos(){
            //TODO:
        }
    }
}