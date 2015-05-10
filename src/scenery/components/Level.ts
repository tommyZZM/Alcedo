/**
 * Created by tommyZZM on 2015/5/10.
 */
module game{
    /**
     * 描述关卡的类
     */
    export class Level extends alcedo.canvas.DisplatObjectContainer{

        private _levelconfig:any;

        public constructor(levelconfig){
            super();
            this._levelconfig = levelconfig;
            this.width(levelconfig.pixelwidth);
            this.height(levelconfig.pixelheight);

            this._clouds = [];
            this._powers = [];

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

        //激活激活之后整个关卡场景将启动碰撞检测;
        private _activestate:boolean;
        public active(){
            this._activestate = true;
        }

        //关闭碰撞检测
        public disactive(){
            this._activestate = false;
        }

        public get isactive():boolean{
            return this._activestate;
        }

        /**
         * 创建场景
         */
        private renderLevel(){
            //TODO:按照地图数据渲染当前关卡

            trace(this._levelconfig);

            var i,objscollect = this._levelconfig.objects;
            if(!objscollect){warn("no objectis found",this._levelconfig);return;}

            for(var objs in objscollect){
                switch (objs){
                    case "obstacle_darkcloud":{//绘制乌云
                        if(Array.isArray(objscollect[objs])&&objscollect[objs].length>0){
                            for(i=0;i<objscollect[objs].length;i++){
                                this._renderdartcloud(objscollect[objs][i]);
                            }
                        }
                        break;
                    }
                    case "clourpower":{
                        if(Array.isArray(objscollect[objs])&&objscollect[objs].length>0){
                            for(i=0;i<objscollect[objs].length;i++){
                                this._rendercolourpower(objscollect[objs][i]);
                            }
                        }
                        break;
                    }
                    default :{
                        break;
                    }
                }
            }
        }

        private _clouds:Array<any>;
        private _renderdartcloud(obj){
            if(obj.type!=LevelShapeType.Rect){return;}

            //trace("_renderdartcloud",cloudobj);
            var cloud = new DarkCloud(obj.width,obj.height);
            cloud.b.x = obj.x;
            cloud.b.y = obj.y;
            cloud.b.alpha = 0.6;
            this._clouds.push(cloud);

            this.addChild(cloud.b);
        }

        private _powers:Array<any>;
        private _rendercolourpower(obj){
            if(obj.type!=LevelShapeType.PointLine){return;}

            switch (obj.type){
                case LevelShapeType.PointLine:{
                    var powergroup = new ColourPowerGroup(obj.points);
                    this._powers.push(powergroup);
                }
            }
        }
    }
}