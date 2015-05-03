/**
 * Created by tommyZZM on 2015/5/3.
 */
module game {
    /**
     * 游戏预备界面
     */
    export class PrepareScreen extends GameScreen {
        public active(callback?:Function,thisObject?:any){
            super.active();
            alcedo.d$.query("#curtain")[0].removeClass("disactive");
            alcedo.d$.query("#curtain")[0].then(()=>{
                alcedo.dispatchCmd(GameStateControl,CmdCatalog.STATE_PREPARE_PLAY);
            });

            //callback.apply(thisObject);
        }

        public disactive(callback:Function,thisObject?:any){
            super.disactive(callback);

            alcedo.d$.query("#curtain")[0].addClass("disactive");
            alcedo.d$.query("#curtain")[0].then(()=>{
                callback.apply(thisObject);
            })
        }
    }
}