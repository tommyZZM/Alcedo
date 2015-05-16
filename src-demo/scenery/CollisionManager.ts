/**
 * Created by tommyZZM on 2015/5/10.
 */
module game{
    export class CollisionManager extends alcedo.AppProxyer{
        private static instanceable:boolean = true;

        public init(){
            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,this.onEachTime,this)
        }

        private _collisioncloud:Array<any>;
        public initClouds(clouds:Array<any>){
            this._collisioncloud = clouds;
            //trace("initClouds",this._collisioncloud);
        }

        private _powers:Array<LittlePower> = [];
        public registPower(power:LittlePower){
            if(this._powers.indexOf(power)<0){
                this._powers.push(power);
                //trace("registPower",this._powers);
            }
        }
        public unregistPower(power:LittlePower){
            var i =this._powers.indexOf(power)
            if(i >=0){
                this._powers.splice(i, 1);
                trace("unregistPower",this._powers);
            }
        }

        private onEachTime(){

        }
    }
}