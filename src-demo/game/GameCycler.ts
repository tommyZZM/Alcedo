/**
 * Created by tommyZZM on 2015/5/18.
 */
module game{
    export class GameCycler extends alcedo.AppSubCore{
        public static instanceable:boolean = true;

        private _backGround:BackGround;
        private _playGround:PlayGround;
        private _frontGround:FrontGround;

        public debug:boolean = true;

        public startUp(){
            alcedo.core(CameraManager).startUp();
            alcedo.core(ParallaxManager).startUp();
            alcedo.core(WorldManager).startUp();

            this._backGround = new BackGround();
            this._playGround = new PlayGround();
            this._frontGround = new FrontGround();

            //初始化前景|舞台|背景
            stage.addChild(this._backGround);
            stage.addChild(this._playGround);
            stage.addChild(this._frontGround);

            alcedo.core(GameState).startUp();

            alcedo.dispatchCmd(GameState,GameState.HELLO);
            alcedo.core(GUICycler).toggleToScreen("start");
        }
    }
}