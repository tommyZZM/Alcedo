/**
 * Created by tommyZZM on 2015/5/18.
 */
module game{
    export class GameCycler extends alcedo.AppSubCore{
        public static instanceable:boolean = true;

        private _backGround:BackGround;
        private _playGround:PlayGround;
        private _frontGround:FrontGround;

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

            alcedo.core(canvas.MovieClipRepository)
                .praseMovieClipData(alcedo.core(net.AsyncRES).get("smallalcedo_json")
                ,alcedo.core(canvas.TextureRepository).get("smallalcedo_png"));

            //var test = new alcedo.canvas.MovieClip(alcedo.core(canvas.MovieClipRepository).get("smallalcedo"));
            //stage.addChild(test);
            //test.play();
            //test.x = stage.stageWidth/2;
            //test.y = stage.stageHeight/2;
            //trace(test);
        }
    }
}