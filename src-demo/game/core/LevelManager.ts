/**
 * Created by tommyZZM on 2015/5/21.
 */
module game {
    /**
     * 游戏关卡,地图管理器...
     */
    var CHECK_DELAY:number = 3;
    var MAX_LEVE_COUNT:number = 3;

    export class LevelManager extends alcedo.AppSubCore {

        private _root:alcedo.canvas.DisplatObjectContainer;
        private _levelobjs:Array<any>;
        private _levelspool:Dict;

        private _checkdelay:number = 0;

        private _levelpassed:number = 0;

        public startUp(root:canvas.DisplatObjectContainer){
            this._root = root;
            this._levelobjs = [];
            this._levelspool = new Dict();
            this._activelevels = [];
            var levels = alcedo.core(net.AsyncRES).find(/level_\w+/i);
            if(levels.length>0){
                for(var i=0;i<levels.length;i++){
                    levels[i].id = i;
                    this._levelobjs.push(levels[i])
                    this._levelspool.set(i+"",[])
                }
            }
            trace("LevelManager initilize",this._levelobjs);
            stage.addEventListener(alcedo.canvas.Stage.ENTER_SECOND,this.update,this);
        }

        private _activelevels:Array<any>;
        private update(e){

            var levelobj:any;
            var level:Level;
            var tmplevel:Level;
            //trace(this._checkdelay,CHECK_DELAY);
            if(this._checkdelay===CHECK_DELAY && this._runstate){

                if(this._activelevels.length<MAX_LEVE_COUNT){
                    levelobj = this._levelobjs.randomselect();
                    //trace(levelobj.id,this._levelspool.get(levelobj.id));
                    tmplevel = this._levelspool.get(levelobj.id).pop();
                    if(this._activelevels.length===0){
                        //首次创建
                        level = tmplevel||new Level(levelobj);
                        level.x = stage.viewPort.right+300;
                        this._root.addChild(level);
                        this._activelevels.push(level);
                    }else{
                        //trace("hi");
                        level = tmplevel||new Level(levelobj);
                        level.x = this._activelevels.last.x+this._activelevels.last.width+100;
                        this._root.addChild(level);
                        this._activelevels.push(level);
                    }
                    level.render();
                }

                var headlevel = this._activelevels.first;
                if(headlevel.right<stage.viewPort.x){
                    this._activelevels.shift();
                    headlevel.removeFromParent();
                    headlevel.clear();
                    this._levelspool.get(headlevel.levelconfig.id).push(headlevel);
                    //trace("remove and pool",headlevel.levelconfig.id,this._levelspool.get(headlevel.levelconfig.id))
                }
            }

            this._checkdelay++;
            if(this._checkdelay>CHECK_DELAY){
                this._checkdelay = 0;
            }
        }

        private _runstate:boolean;
        public run(){
            this._checkdelay = CHECK_DELAY;
            this._runstate = true;
            return this;
        }

        public stop(){
            this._runstate = false;
            return this;
        }

        public reset(){
            for(var i = 0;i<this._activelevels.length;i++){
                this._activelevels[i].clear();
            }
            this._activelevels = [];
            this._levelpassed = 0;
            this._root.removeChildren();
            return this;
        }

        public get root():canvas.DisplatObjectContainer{
            return this._root;
        }
    }
}