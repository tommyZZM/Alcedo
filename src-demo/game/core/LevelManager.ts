/**
 * Created by tommyZZM on 2015/5/21.
 */
module game {
    /**
     * 游戏关卡,地图管理器...
     */
    export class LevelManager extends alcedo.AppSubCore {

        private _root:alcedo.canvas.DisplatObjectContainer;
        private _levelobjs:Array<any>;
        private _levels:Dict;

        private CHECK_DELAY:number = 20;
        private _checkdelay:number = 0;

        public startUp(root:canvas.DisplatObjectContainer){
            this._root = root;
            this._levelobjs = [];
            this._levels = new Dict();
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

        private currlevel:Level;
        private update(e){

            if(this._checkdelay===this.CHECK_DELAY && this._runstate){

            }

            this._checkdelay++;
            if(this._checkdelay>this.CHECK_DELAY){
                this._checkdelay = 0;
            }
        }

        private _runstate:boolean;
        public run(){
            this._runstate = true;

            trace(this._levelobjs.randomselect());
        }

        public stop(){

        }

        public reset(){
            this._levels.clear();

        }

        public get root():canvas.DisplatObjectContainer{
            return this._root;
        }
    }
}