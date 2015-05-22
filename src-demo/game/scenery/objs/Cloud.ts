/**
 * Created by tommyZZM on 2015/5/22.
 */
module game{
    export class Cloud extends Entity{
        public velocitystatic= true;

        public constructor(width:number,height:number){
            super(new canvas.DisplatObjectContainer());
            this.display.alpha = 0.8;
            var could = new canvas.graphic.Rectangle(width,height);
            this.display.addChild(could);
            this.display.width = could.width;
            this.display.height = could.height;

            this._body = (new sat.Box(new sat.Vector(0,0),this.display.width
                ,this.display.height)).toPolygon();


            this.debugBody();
            this.disactive();
        }

        public sync(){
            super.sync();
            this._debugdisplay.x = this._body.pos.x;
            this._debugdisplay.y = this._body.pos.y;
            this._debugdisplay.rotation = this.display.rotation;

            //trace(this._body.pos.x, this._body.pos.y);
        }

        public active(){
            //trace("active");
            if (this._debugdisplay) {
                this._debugdisplay.fillcolour = "#f1c40f";
            }
        }

        public disactive(){
            if (this._debugdisplay) {
                this._debugdisplay.fillcolour = "#3498db";
            }
        }

        private _debugdisplay:any;
        private debugBody() {
            if (!alcedo.core(GameCycler).debug)return;
            var debug = new canvas.graphic.Rectangle(this.display.width
                ,this.display.height,"#3498db");

            //debug.pivotX = debug.pivotY = 0.5;
            debug.alpha = 0.9;
            this.display.addEventListener(canvas.DisplayObjectEvent.ON_ADD_TO_STAGE,()=>{
                (<any>this.display).root.addChild(debug)
            },this)
            this._debugdisplay = debug;
        }
    }
}