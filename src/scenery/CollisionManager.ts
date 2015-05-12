/**
 * Created by tommyZZM on 2015/5/10.
 */
module game{
    export class CollisionManager extends alcedo.AppProxyer{
        private static instanceable:boolean = true;

        public init(){
            this._collisionobjs = [];
            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,this.onEachTime,this)
        }

        private _collisionobjs:Array<any>
        public importCollisionObject(obj:alcedo.canvas.DisplayObject){
            this._collisionobjs.push(obj);
        }

        private onEachTime(){

        }
    }
}