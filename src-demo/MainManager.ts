/**
 * Created by tommyZZM on 2015/4/29.
 * gulp > <!a
 */
module game{
    export class MainManager extends alcedo.AppProxyer{

        private static instanceable = true;

        private _stage:alcedo.canvas.Stage;

        public background:BackGround;
        public playground:PlayGround;
        public fronttground:FrontGround;

        public init(stage:alcedo.canvas.Stage){
            trace("game ready...");
            //TODO:游戏主函数
            this._stage = stage;

            //加载游戏主要管理模块
            alcedo.proxy(GameUIManager).init();
            alcedo.proxy(CameraManager).init(stage.camera());

            //me

            alcedo.proxy(AsyncAssetsLoader).addEventListener(alcedo.net.AsyncRESEvent.ASSETS_COMPLETE,this.onAssetLoaded,this);
            alcedo.proxy(alcedo.net.AsyncAssetsLoader).addConfig("demo/res/resource.json");
            alcedo.proxy(alcedo.net.AsyncAssetsLoader).loadGroup("preload","bgcloud","fgcloud","levels","character");
        }

        private onAssetLoaded(){
            this.background = new BackGround();
            stage.addChild(<any>this.background);

            this.playground = new PlayGround();
            stage.addChild(<any>this.playground);

            this.fronttground = new FrontGround();
            stage.addChild(<any>this.fronttground);

            alcedo.proxy(LevelManager).init(this.playground);

            alcedo.proxy(GameUIManager).ready();

            alcedo.dispatchCmd(ScreenControl,CmdCatalog.TO_SCREEN,["preto",{stateto:CmdCatalog.STATE_HELLO}])
            //Curtain.instance.hide(()=>{
            //    alcedo.dispatchCmd(GameStateControl,CmdCatalog.STATE_HELLO);
            //});
        }
    }

    export interface ISceneryLayer{

    }

    export function MovieClipRepository():alcedo.canvas.MovieClipRepository{
        return alcedo.proxy(alcedo.canvas.MovieClipRepository);
    }
}
