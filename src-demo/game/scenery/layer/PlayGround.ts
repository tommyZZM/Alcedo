/**
 * Created by tommyZZM on 2015/4/17.
 */
module game {
    export class PlayGround extends SceneryGround {

        private _myplane:Entity;

        protected startUp(){
            this._myplane = new game.Entity(new JetBird());
            this.addChild(this._myplane.display);

            this._myplane.display.x = -100;
            this._myplane.display.y = stage.stageHeight+100;
            this._myplane.gravityenable = true;

            alcedo.core(WorldManager).addEntity(this._myplane);
            alcedo.core(CameraManager).lookAt(this._myplane);
            alcedo.core(GameControl).startUp(this._myplane);

            alcedo.addDemandListener(GameState,GameState.HELLO,this.resHello,this);
        }


        private resHello(){
            alcedo.core(CameraManager).yawX = 0.23;

            this._myplane.clearForce();
            this._myplane.x = 30;
            this._myplane.y = stage.height-100;
            this._myplane.applyMomentForce(new canvas.Vector2D(5,-5));
            alcedo.core(GameControl).enableAutoControl();
        }
    }
}