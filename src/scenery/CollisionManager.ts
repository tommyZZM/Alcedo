/**
 * Created by tommyZZM on 2015/5/10.
 */
module game{
    export class CollisionManager extends alcedo.AppProxyer{
        private static instanceable:boolean = true;

        public init(){
            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,this.onEachTime,this)
        }


        public importCollisionObject(){

        }

        private onEachTime(){

        }
    }
}