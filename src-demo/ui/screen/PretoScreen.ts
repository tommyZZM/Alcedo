/**
 * Created by tommyZZM on 2015/5/3.
 */
module game {
    /**
     * 游戏预备界面
     */
    export class PretoScreen extends GameScreen {

        public init(){

        }

        public active(data?:any){
            super.active(data);
            trace("PretoScreen active");
            Curtain.instance.show(()=>{
                if(data.stateto) {
                    alcedo.dispatchCmd(GameStateControl, data.stateto);
                }
            });
        }

        public disactive(callback:Function,thisObject?:any){
            super.disactive(callback);

            Curtain.instance.hide(()=>{
                callback.apply(thisObject);
            });
        }
    }
}