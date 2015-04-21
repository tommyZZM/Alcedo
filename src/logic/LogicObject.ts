/**
 * Created by tommyZZM on 2015/4/20.
 */
module game{
    export class LogicObject extends alcedo.AppObject{

        private _display:alcedo.canvas.Sprite;

        private _direction:alcedo.canvas.Vector2D;//方向

        private _velocity:alcedo.canvas.Vector2D;//速度哦

        private _dvelocity:alcedo.canvas.Vector2D;//加速度哦


        public constructor(displayobject:alcedo.canvas.Sprite){
            super();
            this._display = displayobject;
            this._direction = new alcedo.canvas.Vector2D(1,0);
            this._velocity = new alcedo.canvas.Vector2D();
            //this._dvelocity = new alcedo.canvas.Vector2D();

            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,this.onEachTime,this);
        }

        private onEachTime(){
            if(this._display.isInViewPort() && this._velocity.length){
                this.updateVelocity();
                this._display.x += this._velocity.x;
                this._display.y += this._velocity.y;
            }
        }

        public get speed():number{
            return this._velocity.length;
        }

        public set speed(value:number){
            this._velocity.length =value;
            //trace(value,this._velocity.length);
        }

        public set direction(direction:alcedo.canvas.Vector2D){
            this._direction.resetAs(direction);
            this._direction.unitlize();
        }

        private updateVelocity(){
            var _s = this._velocity.length
            //trace(_s);
            if(!_s)return;
            this._velocity.resetAs(this._direction)
            this._velocity.length = _s;
        }



        public get b():alcedo.canvas.Sprite{
            return this._display;
        }

    }
}