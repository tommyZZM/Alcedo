/**
 * Created by tommyZZM on 2015/5/21.
 */
module game {
    /**
     * 游戏关卡,地图管理器...
     */
    var CHECK_DELAY:number = 20;
    var MAX_LEVE_COUNT:number = 3;

    export class LevelManager extends alcedo.AppSubCore {

        private _root:alcedo.canvas.DisplatObjectContainer;
        private _levelobjs:Array<any>;
        private _levels:Dict;

        private _checkdelay:number = 0;

        private _levelpassed:number = 0;

        public startUp(root:canvas.DisplatObjectContainer){
            this._root = root;
            this._levelobjs = [];
            this._levels = new Dict();
            this._activelevels = [];
            var levels = alcedo.core(net.AsyncRES).find(/level_\w+/i);
            if(levels.length>0){
                for(var i=0;i<levels.length;i++){
                    levels[i].id = i;
                    this._levelobjs.push(levels[i])
                    this._levels.set(i+"",[])
                }
            }
            trace("LevelManager initilize",this._levelobjs);
            stage.addEventListener(alcedo.canvas.Stage.ENTER_SECOND,this.update,this);
        }

        private _activelevels:Array<any>;
        private update(e){

            var levelobj:any;
            var level:Level;
            if(this._checkdelay===CHECK_DELAY && this._runstate){

                if(this._activelevels.length<MAX_LEVE_COUNT){
                    levelobj = this._levelobjs.randomselect();
                    if(this._activelevels.length===0){

                        level = new Level(levelobj)
                        level.x = 660;
                        this._root.addChild(level)
                        trace("start..");

                        //首次创建
                    }else{

                    }
                }
            }

            this._checkdelay++;
            if(this._checkdelay>CHECK_DELAY){
                this._checkdelay = 0;
            }
        }

        private _runstate:boolean;
        public run(){
            this._checkdelay = CHECK_DELAY
            this._runstate = true;
        }

        public stop(){

        }

        public reset(){
            this._activelevels = [];
            this._levelpassed = 0;
        }

        public get root():canvas.DisplatObjectContainer{
            return this._root;
        }
    }
}