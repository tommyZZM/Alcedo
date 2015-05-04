/**
 * Created by tommyZZM on 2015/4/19.
 */
module game{
    export class CmdCatalog{
        //Scenery
        public static RESET_SCENERY = "SceneryControl_RESET_SCENERY";//重置场景

        //Screen
        public static TO_SCREEN:string = "ScreenControl_TO_SCREEN";

        //GameState
        public static STATE_PRE_PLAY:string = "GameStateControl_STATE_PRE_PLAY";//还没开始游戏;
        public static STATE_PREPARE_PLAY:string = "GameStateControl_STATE_READY_PLAY";//准备开始游戏,重置游戏场景等;
        public static STATE_START_PLAYING:string = "GameStateControl_START_PLAYING";

        //GameControl
        public static CTR_FLY_BEGIN:string = "ON_FLY_BEGIN";//小灰机网上飞行;
        public static CTR_FLY_RELEASE:string = "ON_FLY_RELEASE";//小灰机网放松;
    }
}