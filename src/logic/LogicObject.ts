/**
 * Created by tommyZZM on 2015/4/20.
 */
module game{
    export class LogicObject extends alcedo.AppObject{

        private _display:alcedo.canvas.Sprite;

        private _speed:alcedo.canvas.Vector2D;//速度哦

        private _dspeed:alcedo.canvas.Vector2D;//加速度哦


        public constructor(displayobject:alcedo.canvas.Sprite){

            this._speed = new alcedo.canvas.Vector2D();
            this._dspeed = new alcedo.canvas.Vector2D();

            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,this.onEachTime,this);
        }

        private onEachTime(){
            if(this._display.isInViewPort()){
                this._display.x += this._speed.x;
                this._display.y += this._speed.y;
            }
        }

        public body():alcedo.canvas.Sprite{
            return this._display;
        }

    }
}