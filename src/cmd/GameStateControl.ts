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
            this.addCmdHandler(CmdCatalog.STATE_PRE_PLAY,this.cmdPrePlay);
            this.addCmdHandler(CmdCatalog.STATE_PREPARE_PLAY,this.cmdPreparePlay);
        }

        private cmdPrePlay(){
            this.dispatchDemand(CmdCatalog.STATE_PRE_PLAY);

        }

        private cmdPreparePlay(){
            this.dispatchDemand(CmdCatalog.STATE_PREPARE_PLAY);

        }

        private cmdStartPlaying(){
            this.dispatchDemand(CmdCatalog.STATE_START_PLAYING);
        }
    }
}