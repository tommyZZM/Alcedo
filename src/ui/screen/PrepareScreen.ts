/**
 * Created by tommyZZM on 2015/5/3.
 */
module game {
    /**
     * 游戏预备界面
     */
    export class PrepareScreen extends GameScreen {

        public init(){

        }

        public active(callback?:Function,thisObject?:any){
            super.active();
            Curtain.instance.show(()=>{
                trace("hrere")
                alcedo.dispatchCmd(GameStateControl,CmdCatalog.STATE_PREPARE_PLAY);
            })
            //this._curtain.show();
            //this._curtain.removeClass("disactive");
            //this._curtain.then(()=>{
            //
            //});

            //callback.apply(thisObject);
        }

        public disactive(callback:Function,thisObject?:any){
            super.disactive(callback);

            Curtain.instance.hide(()=>{
                callback.apply(thisObject);
            });
        }
    }
}