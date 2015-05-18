/**
 * Created by tommyZZM on 2015/5/18.
 */
module game{
    export class LoadingScreen extends GUIScreen{
        public constructor(){
            super();
        }

        public show(){
            //TODO:加载进度条
        }

        public hide(callback:Function){

            alcedo.core(CurtainManager).hide(callback);
        }
    }
}