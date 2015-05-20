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

            //alcedo.core(canvas.MovieClipRepository)
            //    .praseMovieClipData(alcedo.core(net.AsyncRES).get("smallalcedo_json")
            //    ,alcedo.core(canvas.TextureRepository).get("smallalcedo_png"));
            //
            //var test = new JetBird();
            //stage.addChild(test);
            //test.x = stage.stageWidth/2;
            //test.y = stage.stageHeight/2;

            //var v = new alcedo.canvas.Vector2D(0,-5);
            //var pe = new alcedo.canvas.ParticleEmitter({initial:v,spread:20,max:30,rate:16});
            //pe.x = stage.width/2;
            //pe.y = stage.height/2;
            //
            //stage.addChild(pe);
            //pe.play();
            //pe.applyForce(new alcedo.canvas.Vector2D(0,0.09));
        }
    }
}