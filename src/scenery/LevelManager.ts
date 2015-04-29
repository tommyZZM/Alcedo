/**
 * Created by tommyZZM on 2015/4/29.
 */
module game{
    /**
     * 游戏关卡,地图管理器...
     */
    export class LevelManager extends alcedo.AppProxyer {
        private static instanceable:boolean = true;

        private _mainground:MainGround;

        private _levespool:Array<any>;
        private _leveltmp:any;//debuguse

        private _currlevel:LevelObject;

        public init(mainground:MainGround){
            this._mainground = mainground;
            this._leveltmp = new LevelObject(AsyncRES().find(/level_\w+/i)[0]);
        }

        public startLevel(positionx:number){
            trace("startlevel",positionx);

            this._currlevel = this.selectOneLevel();
            this._currlevel.x = positionx+stage.width()/2+200;

            this._mainground.addChildAt(this._currlevel,0);
        }

        public resetAllLevel(){
            //重置关卡
        }

        private selectOneLevel():LevelObject{
            //创建关卡
            return this._leveltmp
        }

    }

    class LevelObject extends alcedo.canvas.DisplatObjectContainer{

        private _levelconfig:any;

        public constructor(levelconfig){
            super();
            this._levelconfig = levelconfig;

            this.debugArea(true);
        }

        private _debugdraw:alcedo.canvas.graphic.Rectangle;
        private debugArea(active:boolean){
            if(!this._debugdraw) {
                this._debugdraw = new alcedo.canvas.graphic.Rectangle(0, 0, this._levelconfig.pixelwidth, this._levelconfig.pixelheight, "#27AE60");
                this.addChild(this._debugdraw);
                this._debugdraw.alpha = 0.2
            }
            this._debugdraw.visible = active;
            this.setChildIndex(this._debugdraw,0)
        }

    }

    class LevelDebugRectangle{

    }
}