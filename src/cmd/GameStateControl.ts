/**
 * Created by tommyZZM on 2015/4/19.
 */
module game{
    /**
     * 游戏状态控制器
     *
     */
    export enum GameState{
        PRE=1,
        PREPARE=2,
        PLAYING =3,
        OVER = 4
    }

    export class GameStateControl extends alcedo.AppCmder{

        public constructor(){
            super();
            this.addCmdHandler(CmdCatalog.STATE_START_PLAYING,this.cmdStartPlaying);
            this.addCmdHandler(CmdCatalog.STATE_HELLO,this.cmdHello);
            this.addCmdHandler(CmdCatalog.STATE_PREPARE_PLAY,this.cmdPreparePlay);
            this.addCmdHandler(CmdCatalog.STATE_OVER_PLAY,this.cmdGameOver);

        }

        private cmdHello(){
            this.dispatchDemand(CmdCatalog.STATE_HELLO);

        }

        private cmdPreparePlay(){
            this.dispatchDemand(CmdCatalog.STATE_PREPARE_PLAY);

        }

        private cmdStartPlaying(){
            this.dispatchDemand(CmdCatalog.STATE_START_PLAYING);
        }

        private cmdGameOver(){
            this.dispatchDemand(CmdCatalog.STATE_OVER_PLAY);
        }
    }
}