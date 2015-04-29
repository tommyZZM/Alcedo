/**
 * Created by tommyZZM on 2015/4/29.
 */
module game{
    export class GroundManager extends alcedo.AppProxyer{

        private static instanceable = true;

        private _stage:alcedo.canvas.Stage;

        public background:BackGround;
        public mainground:MainGround;
        public fronttground:FrontGround;

        public init(stage:alcedo.canvas.Stage){
            trace("game ready...");
            //TODO:游戏主函数
            this._stage = stage;

            //加载游戏主要管理模块
            alcedo.proxy(GameUIManager).init();
            alcedo.proxy(CameraManager).init(stage.camera());

            //加载游戏布景
            this.background = new BackGround();
            stage.addChild(this.background);

            this.mainground = new MainGround();
            stage.addChild(this.mainground);

            this.fronttground = new FrontGround();
            stage.addChild(this.fronttground);

            alcedo.proxy(LevelManager).init(this.mainground);

        }
    }
}