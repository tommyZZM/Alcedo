/**
 * Created by tommyZZM on 2015/4/29.
 */
module game{
    export class LevelManager extends alcedo.AppProxyer {
        private static instanceable:boolean = true;

        public init(){
            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,this.onEachTime,this)
        }

        private onEachTime(){
            //console.log(stage.camera().viewfinder().x);
        }
    }
}