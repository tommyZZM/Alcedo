/**
 * Created by tommyZZM on 2015/5/20.
 */
module game{
    export class GameControl extends alcedo.AppSubCore{
        private static instanceable = true;

        public static CTR_FLY_BEGIN:string = "CTR_FLY_BEGIN";
        public static CTR_FLY_RELEASE:string = "CTR_FLY_RELEASE";

        private _plane:Entity;

        private _speedmax:number = 6.9;

        public startUp(plane:Entity,opts?:any){
            this._plane = plane;
            this._plane.addEventListener(Entity.ON_UPDATE,this.eachTime,this);

            this.addCmdHandler(GameControl.CTR_FLY_BEGIN,this.beginfly);
            this.addCmdHandler(GameControl.CTR_FLY_RELEASE,this.endfly);
        }

        private eachTime(e){

            if(this._plane.speed>this._speedmax){
                this._plane.speed = this._speedmax;
            }
            //trace(this._flystate)
            if(this._flystate) {
                this.flyingup(e);
            }
            this.autoControl();
        }

        public enableAutoControl(boo:boolean = true){
            this._autocontrol = boo;
            this._flystate = false;
        }

        private _flystate:boolean;
        public beginfly(){
            if(this._flystate)return;
            //trace("beginfly");
            //trace(this._plane.curForce.x, this._plane.curForce.y)
            this._flystate = true;
            (<any>this._plane.display).bird.play(6);
        }

        private flyingup(e){
            //TODO:FUCK
            //this._plane.velocity.deg+=-3;
            //this._plane.speed+=0.01;
            //this._plane.velocity.y-=0.1;

            //this._plane.speed+=0.01;
            var circle_force = this._plane.velocity.normalize().clone();
            circle_force.length = 0.2*e.delay;
            circle_force.y-=0.1;
            circle_force.x*=0.9;
            //trace(circle_force.y)
            //var lock_velocity = this._plane.velocity.length;
            this._plane.applyMomentForce(circle_force);

            //trace(this._plane.velocity.x, this._plane.velocity.y);
            //trace(this._plane.speed,this._plane.velocity.deg)

        }

        public endfly(){
            if(!this._flystate)return;
            //trace("endfly");
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