/**
 * Created by tommyZZM on 2015/4/29.
 */
module game{
    /**
     * 游戏关卡,地图管理器...
     */
    export class LevelManager extends alcedo.AppProxyer {
        private static instanceable:boolean = true;

        private _levellayer:alcedo.canvas.DisplatObjectContainer;

        private _levespool:Array<any>;
        private _leveltmp:any;//debuguse

        private _currlevel:Level;

        private _off:boolean;

        public constructor(){
            super();
            stage.addEventListener(alcedo.canvas.Stage.ENTER_SECOND,this.checkLevels,this);
        }

        public init(mainground:PlayGround){
            this._levellayer = mainground.levellayer;
            this._leveltmp = new Level(AsyncRES().find(/level_\w+/i)[0]);
        }

        public startLevel(positionx:number){

            this._off = false;

            this._currlevel = this.selectOneLevel();
            this._currlevel.x = positionx+stage.width()/2+100;

            this._levellayer.addChildAt(this._currlevel,0);

            trace("startlevel",positionx,this._currlevel.width(),this._currlevel.height());
        }

        private checkLevels(){
            //检查当前场景是否已经从视图中离去;
            if(this._currlevel && !this._off){
                if(!this._currlevel.isInViewPort()&&this._currlevel.x<stage.viewPort().x)
                this._currlevel.x = stage.viewPort().right+600
            }
        }

        public resetAllLevel(){
            //重置关卡
            this._off = true;
            this._levellayer.removeChildren();
        }

        private selectOneLevel():Level{
            //创建关卡
            return this._leveltmp
        }

    }

    /**
     * 描述关卡的类
     */
    class Level extends alcedo.canvas.DisplatObjectContainer{

        private _levelconfig:any;

        public constructor(levelconfig){
            super();
            this._levelconfig = levelconfig;
            this.width(levelconfig.pixelwidth);
            this.height(levelconfig.pixelheight);

            //this.debugArea(true);
            this.renderLevel();
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



        /**
         * 创建场景
         */
        private renderLevel(){
            //TODO:按照地图数据渲染当前关卡

            trace(this._levelconfig);

            var i,objspool = this._levelconfig.objects;
            if(!objspool){warn("no objectis found",this._levelconfig);return;}

            for(var objs in objspool){
                switch (objs){
                    case "obstacle_darkcloud":{//绘制乌云
                        if(Array.isArray(objspool[objs])&&objspool[objs].length>0){
                            for(i=0;i<objspool[objs].length;i++){
                                this._renderdartcloud(objspool[objs][i]);
                            }
                        }
                    }
                }
            }
        }

        private _clouds:Array<any>;
        private _renderdartcloud(cloudobj){
            if(cloudobj.type!=LevelShapeType.Rect){return;}

            //trace("_renderdartcloud",cloudobj);
            var cloud = new DarkCloud(cloudobj.width,cloudobj.height);
            cloud.b.x = cloudobj.x,cloud.b.y = cloudobj.y;
            cloud.b.alpha = 0.6;
            this.addChild(cloud.b);
        }
    }

    /**
     *
     */
    export interface InLevel{

    }

    enum LevelObjectType{
        DarkCloud=1,//乌云
        WhiteCloud=2,//白色云彩
        ClourPower=3,//彩色能量
        RainBow=6//彩虹
    }

    enum LevelShapeType{
        Rect=1,
        Circle=2,
        PointLine=3,
        Uuknow=-1
    }
}