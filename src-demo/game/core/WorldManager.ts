/**
 * Created by tommyZZM on 2015/5/19.
 */
module game{
    export class WorldManager extends alcedo.AppSubCore{
        private static instanceable = true;

        public startUp(){
            this._entities =[];
            stage.addEventListener(canvas.Stage.ENTER_MILLSECOND10,this.update,this);
            //trace("start",this)
        }

        private update(e){
            this.updateEntitiesPos(e);//物体运动
            this.precheckEntities();//筛选并激活物体
            this.collisionCheck();//对激活物体进行碰撞检测
        }

        private updateEntitiesPos(e){
            for(var i=0;i<this._entities.length;i++){
                var entitie = this._entities[i];

                if(entitie.velocitystatic){
                    entitie.sync();
                    entitie.emit(Entity.ON_UPDATE,e);
                    continue;
                }//对于静态物体，不更新位置.

                if(entitie.gravityenable){
                    entitie.applyMomentForce(canvas.Vector2D.identity(0,0.09*e.delay))
                }
                entitie._acceleration = entitie._force.divide(entitie._mass);

                entitie._velocity.x+=(entitie._acceleration.x*e.delay);
                entitie._display.x += entitie._velocity.x*e.delay;
                entitie._velocity.y+=entitie._acceleration.y*e.delay;
                entitie._display.y+=entitie._velocity.y*e.delay;

                entitie._display.rotation = entitie._velocity.deg;

                //trace(entitie);

                //trace(entitie.speed);

                entitie.sync();
                entitie.emit(Entity.ON_UPDATE,e);
            }
        }

        //检查实体是否到达指定区域
        private _activedEntities;
        private precheckEntities(){
            //trace("precheckEntities",this._activedEntities);
            this._activedEntities = [];
            for(var i=0;i<this._entities.length;i++){
                //筛选合适物体
                var entitie = this._entities[i];

                if(entitie instanceof JetBird){
                    this._testbird = entitie;
                }else if(entitie instanceof Cloud){
                    var globalx = entitie.display.globalx;
                    //trace(globalx);
                    if(globalx<stage.viewPort.right && globalx>stage.viewPort.x){
                        this._activedEntities.push(entitie)
                    }
                }
            }
        }

        //碰撞检测
        private _testbird:JetBird;
        //private _resoponse:sat.Response = new sat.Response();
        private collisionCheck(){
            if(!alcedo.core(GameState).isplaying)return;
            for(var i=0;i<this._activedEntities.length;i++){
                var entitie = this._activedEntities[i];

                if(entitie instanceof Cloud){
                    //trace(entitie.hashIndex,entitie.body.pos.x,entitie.body);
                    //trace(entitie.body,entitie.body.pos.x,this._testbird.x);
                    //this._resoponse.clear();
                    if(SAT.testPolygonPolygon(this._testbird.body,entitie.body)){
                        //trace(this.resoponse,this.resoponse.bInA,this.resoponse.aInB)
                        entitie.active();
                        //trace("hit");
                    }else{
                        entitie.disactive();
                    }
                }
            }
        }

        private _ref:Entity;
        public referenceObject(ref:Entity){
            this._ref = ref;
        }

        private _entities:Array<any>;
        public addEntity(entity:Entity){
            //trace("add",this)/
            var index = this._entities.indexOf(entity);
            if(index<0) {
                this._entities.push(entity)
            }
            //trace(this._entities);
        }

        public removeEntity(entity:Entity){
            var index = this._entities.indexOf(entity);
            if(index>=0){
                this._entities.splice(index,1);
            }
            //trace("removeEntity...",this._entities);
        }


    }
}