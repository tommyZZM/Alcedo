/**
 * Created by tommyZZM on 2015/4/19.
 */
module game{
    /**
     * 游戏状态控制器
     *
     */
    export class GameStateControl extends alcedo.AppCmder{

        public constructor(){
            super();
            this.addCmdHandler(CmdCatalog.STATE_START_PLAYING,this.cmdStartPlaying);
        }

        private cmdStartPlaying(sceenname){
            this.dispatchDemand(CmdCatalog.STATE_START_PLAYING,sceenname);
        }
    }
}