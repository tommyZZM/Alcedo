/**
 * Created by tommyZZM on 2015/4/17.
 */
module game {
    /**
     * 游戏加载界面
     */
    export class LoadingScreen extends GameScreen {
        public active(callback?:Function,thisObject?:any){
            super.active();
            //callback.apply(thisObject);
        }

        public disactive(callback:Function,thisObject?:any){
            super.disactive(callback);

            callback.apply(thisObject);
        }
    }
}