/**
 * Created by tommyZZM on 2015/5/20.
 */
module game{
    export class GameControl extends alcedo.AppSubCore{
        private static instanceable = true;

        private _plane:Entity;

        public startUp(plane:Entity){
            this._plane = plane;
            this._plane.addEventListener(Entity.ON_UPDATE,this.eachTime,this);
        }

        private eachTime(e){

            //trace(this._flystate)
            if(this._flystate) {
                this.flyingup();
            }
            this.autoControl();
        }

        public enableAutoControl(boo:boolean = true){
            this._autocontrol = boo;
        }

        private _flystate:boolean;
        public beginfly(){
            if(this._flystate)return;
            trace("beginfly");
            this._flystate = true;
            (<any>this._plane.display).bird.play(6);
        }

        private flyingup(){
            //TODO:FUCK
            this._plane.velocity.deg+=-3;
            //this._plane.speed+=0.01;
            this._plane.velocity.y-=0.1;

            //this._plane.speed+=0.01;
            //var circle_force = this._plane.velocity.normalize();
            //circle_force.length = 0.001;
            //trace(circle_force.x, circle_force.y)
            //var lock_velocity = this._plane.velocity.length;
            //this._plane.applyForce(circle_force);

        }

        public endfly(){
            if(!this._flystate)return;
            trace("beginfly");
            this._flystate = false;
            (<any>this._plane.display).bird.playToAndStop(1)
        }

        private _autocontrol:boolean;
        private _autoflyup:boolean;
        private autoControl(){
            if(!this._autocontrol)return;

            if(this._plane.y>stage.height*0.6 && ! this._autoflyup){
                this._autoflyup = true;
            }

            if(this._plane.velocity.deg>-30 && this._autoflyup ){
                this.beginfly()
            }else{
                this._autoflyup = false;
                this.endfly()
            }
        }

    }
}