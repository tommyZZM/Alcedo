/**
 * Created by tommyZZM on 2015/4/17.
 */
module game {
    export class PlayGround extends SceneryGround {

        private _myplane:Entity;
        private _levelroot:canvas.DisplatObjectContainer;

        protected startUp(){
            this._myplane = new game.JetBird();

            this._myplane.display.x = -100;
            this._myplane.display.y = stage.stageHeight+100;
            this._myplane.gravityenable = true;

            //debug
            if(alcedo.core(GameCycler).debug){

            }

            alcedo.core(WorldManager).addEntity(this._myplane);
            alcedo.core(CameraManager).lookAt(this._myplane);
            alcedo.core(ParallaxManager).referenceObject(this._myplane);

            alcedo.addDemandListener(GameState,GameState.HELLO,this.resHello,this);
            alcedo.addDemandListener(GameState,GameState.PREPLAY,this.resPrePlay,this,1);
            alcedo.addDemandListener(GameState,GameState.PLAYING,this.resPlay,this);
            alcedo.addDemandListener(GameState,GameState.OVER,this.resOver,this);

            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,this.eachTime,this);

            this._levelroot = new alcedo.canvas.DisplatObjectContainer();
            this.addChild(this._levelroot);
            this.addChild(this._myplane.display);

            alcedo.core(LevelManager).startUp(this._levelroot);
            alcedo.core(GameControl).startUp(this._myplane);
        }

        private eachTime(){
            if(alcedo.core(GameState).isplaying){
                //检测小鸟的位置
                if(this._myplane.y>stage.height && this._myplane.velocity.y>0){
                    //TODO：掉落云雾的特效
                    alcedo.dispatchCmd(GameState,GameState.OVER,{scorx:0});
                }
            }
        }

        private resHello(){
            alcedo.core(CameraManager).yawX = 0.23;

            this._myplane.clearForce();
            this._myplane.velocity.reset();
            this._myplane.x = 30;
            this._myplane.y = screen.height-50;
            this._myplane.applyMomentForce(new canvas.Vector2D(5,-5));
            alcedo.core(GameControl).enableAutoControl();
            alcedo.core(LevelManager).reset();
        }

        private resPrePlay(){
            trace("resPrePlay");
            this._myplane.clearForce();
            this._myplane.velocity.reset();
            this._myplane.x = 0;
            this._myplane.y = stage.height-50;
            this._myplane.gravityenable = false;
            alcedo.core(GameControl).enableAutoControl(false);

            alcedo.core(LevelManager).reset().run();
        }

        private resPlay(){
            this._myplane.gravityenable = true;
            this._myplane.display["bird"].play(6);
            this._myplane.applyMomentForce(new canvas.Vector2D(10,-12));
        }

        private resOver(){
            alcedo.core(LevelManager).stop();
        }
    }
}