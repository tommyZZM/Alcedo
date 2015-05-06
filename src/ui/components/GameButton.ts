/**
 * Created by tommyZZM on 2015/4/13.
 */
module game {
    export class GameButton extends GameUIComponent{
        public constructor(ele:alcedo.dom.DomElement,texture:alcedo.canvas.Texture){

            super(ele,texture);

            //this.width = texture._sourceWidth;

            this._com.addEventListener(alcedo.dom.TouchEvent.TOUCH_BEGIN, ()=> {
                this._com.scale(0.8, 200);
            }, this);

            this._com.addEventListener(alcedo.dom.TouchEvent.TOUCH_END, ()=> {
                this._com.scale(1, 100);
            }, this);
        }
    }
}