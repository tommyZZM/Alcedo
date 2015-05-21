/**
 * Created by tommyZZM on 2015/5/18.
 */
module game {
    export class PlayingScreen extends GUIScreen {
        public show(){
            trace("play screen show");
            stage.addEventListener(canvas.TouchEvent.TOUCH_BEGIN,this.ontapBegin,this);
            stage.addEventListener(canvas.TouchEvent.TOUCH_END,this.ontapEnd,this);

        }

        public hide(callback){
            callback();
        }

        private ontapBegin(){
            //trace("hi");
            alcedo.dispatchCmd(GameControl,GameControl.CTR_FLY_BEGIN)
        }

        private ontapEnd(){
            alcedo.dispatchCmd(GameControl,GameControl.CTR_FLY_RELEASE)
        }
    }
}