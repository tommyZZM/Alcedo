/**
 * Created by tommyZZM on 2015/4/14.
 */
module game{
    /**
     * 游戏界面
     */
    export class PlayingScreen extends GameScreen{

        protected init() {

        }

        public active(){
            trace("Playing...");
            alcedo.dispatchCmd(GameStateControl,CmdCatalog.STATE_START_PLAYING)
        }
    }
}