/**
 * Created by tommyZZM on 2015/4/20.
 */
module game{
    /**
     * 游戏状态控制器
     *
     */
    export class GameSceneryControl extends alcedo.AppCmder{

        public constructor(){
            super();
            this.addCmdHandler(CmdCatalog.RESET_SCENERY,this.cmdResetScenery);
        }

        private cmdResetScenery(x){
            //trace(x);
            this.dispatchDemand(CmdCatalog.RESET_SCENERY,{x:x});
        }
    }
}