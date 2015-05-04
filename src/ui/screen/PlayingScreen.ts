/**
 * Created by tommyZZM on 2015/4/14.
 */
module game{
    /**
     * 游戏界面
     */
    export class PlayingScreen extends GameScreen{

        private _canvastouchable:boolean;

        protected init() {
            stage.addEventListener(alcedo.canvas.TouchEvent.TOUCH_BEGIN,this.onCanvasTouchBegin,this);
            stage.addEventListener(alcedo.canvas.TouchEvent.TOUCH_END,this.onCanvasTouchEnd,this);
        }

        public active(){
            trace("Playing...");

            //TODO:计分面板

            //TODO:点击控制器
            this._canvastouchable = true;

            alcedo.dispatchCmd(GameStateControl,CmdCatalog.STATE_START_PLAYING)
        }

        private onCanvasTouchBegin(){
            if(!this._canvastouchable)return;
            alcedo.dispatchCmd(GameControl,CmdCatalog.CTR_FLY_BEGIN);
            trace("hi")
        }

        private onCanvasTouchEnd(){
            if(!this._canvastouchable)return;
            alcedo.dispatchCmd(GameControl,CmdCatalog.CTR_FLY_RELEASE);
            trace("bye")

        }

        public disactive(callback:Function,thisObject?:any){

            //TODO:关闭点击控制器
            this._canvastouchable = false;

            callback.apply(thisObject);
        }
    }
}