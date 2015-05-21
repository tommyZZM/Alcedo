/**
 * Created by tommyZZM on 2015/5/19.
 */
module game{
    export class WorldManager extends alcedo.AppSubCore{
        private static instanceable = true;

        public startUp(){
            this._entities =[];
            stage.addEventListener(canvas.Stage.ENTER_MILLSECOND10,this.update,this);
            trace("start",this)
        }

        private update(e){
            this.updateEntitiesPos(e);//物体运动
            this.precheckEntities();//筛选并激活物体
            this.collisionCheck();//对激活物体进行碰撞检测
        }

        private updateEntitiesPos(e){
            for(var i=0;i<this._entities.length;i++){
                var entitie = this._entities[i];

                if(entitie.static){continue;}//对于静态物体，不更新位置.

                if(entitie.gravityenable){
                    entitie.applyMomentForce(canvas.Vector2D.identity(0,0.09*e.delay))
                }
                entitie._acceleration = entitie._force.divide(entitie._mass);

                entitie._velocity.x+=(entitie._acceleration.x*e.delay);
                entitie._display.x += entitie._velocity.x*e.delay;
                entitie._velocity.y+=entitie._acceleration.y*e.delay;
                entitie._display.y+=entitie._velocity.y*e.delay;

                entitie._display.rotation = entitie._velocity.deg;

                //trace(entitie.speed);

                entitie.sync();
                entitie.emit(Entity.ON_UPDATE,e);
            }
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
            trace("add",this)
            this._entities.push(entity)
        }

        public removeEntity(entity:Entity){

        }


    }
}