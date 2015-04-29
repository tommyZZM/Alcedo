/**
 * Created by tommyZZM on 2015/4/29.
 */
module game{
    export class MainManager extends alcedo.AppProxyer{

        private static instanceable = true;


        private _stage:alcedo.canvas.Stage;

        private _background:BackGround;
        private _mainground:MainGround;
        private _fronttground:FrontGround;

        public init(stage:alcedo.canvas.Stage){
            trace("game ready...");
            //TODO:游戏主函数
            this._stage = stage;

            //加载游戏主要管理模块
            alcedo.proxy(GameUIManager).init();
            alcedo.proxy(LevelManager).init();
            alcedo.proxy(CameraManager).init(stage.camera());

            //加载游戏布景
            this._background = new BackGround();
            stage.addChild(this._background);

            this._mainground = new MainGround();
            stage.addChild(this._mainground);

            this._fronttground = new FrontGround();
            stage.addChild(this._fronttground);

        }
    }
}