/**
 * Created by tommyZZM on 2015/5/21.
 */
module game {
    /**
     * 描述关卡的类
     */
    export class Level extends alcedo.canvas.DisplatObjectContainer {
        private _levelconfig:any;

        public constructor(levelconfig){
            super();
            if(!levelconfig)warn("level config invaild");
            this._levelconfig = levelconfig;
            this.width = this._levelconfig.pixelwidth;
            this.height = this._levelconfig.pixelheight;
            this._clouds = [];
            this._powers = [];
        }

        public get right(){
            return this.x+this.width;
        }

        public get levelconfig(){
            return this._levelconfig;
        }

        //显示场景中的物体
        private _clouds:Array<any>;
        private _powers:Array<any>;
        public render(){
            trace(this._levelconfig)

            var i=0;
            var cloudsdata = this._levelconfig.objects.obstacle_darkcloud;
            if(Array.isArray(cloudsdata)){
                for(i=0;i<cloudsdata.length;i++){
                    var cloud = new Cloud(cloudsdata[i].width,cloudsdata[i].height);
                    cloud.x = cloudsdata[i].x;
                    cloud.y = cloudsdata[i].y;
                    this._clouds.push(cloud);
                    alcedo.core(WorldManager).addEntity(cloud);
                    this.addChild(cloud.display);
                }
            }

            var colourpowerdata = this._levelconfig.objects.colourpower;
            if(Array.isArray(colourpowerdata)){
                for(var i=0;i<colourpowerdata.length;i++){
                    var colourpower = colourpowerdata[i];
                    if(!colourpower.bezier){
                        var sc = colourpower.points.length-1;
                        colourpower.bezier = BezierMaker.create(colourpower.points,sc*8);
                    }

                    var curve = colourpower.bezier.curve;
                    for(var j=0;j<curve.length;j++){
                        var singlepower = new ColourPower();
                        singlepower.x = curve[j].x;
                        singlepower.y = curve[j].y;
                        this._powers.push(singlepower);
                        alcedo.core(WorldManager).addEntity(singlepower);
                        this.addChild(singlepower.display);
                    }
                }
            }
        }

        public clear(){
            for(var i=0;i<this._clouds.length;i++){
                alcedo.core(WorldManager).removeEntity(this._clouds[i]);
            }
            for(var i=0;i<this._powers.length;i++){
                alcedo.core(WorldManager).removeEntity(this._powers[i]);
            }
            this.removeChildren();
            this._clouds = [];
            this._powers = [];
        }

        private _debugdraw:alcedo.canvas.graphic.Rectangle;
        private debugArea(active:boolean){
            if(!this._debugdraw) {
                this._debugdraw = new alcedo.canvas.graphic.Rectangle(this._levelconfig.pixelwidth, this._levelconfig.pixelheight, "#27AE60");
                this.addChild(this._debugdraw);
                this._debugdraw.alpha = 0.2
            }
            this._debugdraw.visible = active;
            this.setChildIndex(this._debugdraw,0)
        }
    }
}