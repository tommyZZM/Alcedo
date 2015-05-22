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

            this.debugArea(true);
        }

        public get right(){
            return this.x+this.width;
        }

        public get levelconfig(){
            return this._levelconfig;
        }

        //显示场景中的物体
        public render(){

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
}