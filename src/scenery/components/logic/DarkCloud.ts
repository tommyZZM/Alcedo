/**
 * Created by tommyZZM on 2015/4/30.
 */
module game{
    export class DarkCloud extends LogicObject implements InLevel{
        public constructor(width,height){
            super();
            this._display = new alcedo.canvas.graphic.Rectangle(0,0,width,height);
            (<alcedo.canvas.DisplayGraphic>this._display).fillcolour = "#000";
        }
    }
}