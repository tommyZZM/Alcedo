/**
 * Created by tommyZZM on 2015/5/19.
 */
module game{
    export class WorldManager extends alcedo.AppSubCore{
        private static instanceable = true;

        public startUp(){
            stage.addEventListener(canvas.Stage.ENTER_MILLSECOND10,this.update,this);
        }

        private update(e){

        }

        //检查实体是否到达指定区域
        private precheckEntities(){

        }

        //碰撞检测
        private collisionCheck(){

        }

        private _ref:Entity;
        public referenceObject(ref:Entity){
            this._ref = ref;
        }

        private _entities:Array<any>;
        public addEntity(entity:Entity){

        }

        public removeEntity(entity:Entity){

        }
    }
}