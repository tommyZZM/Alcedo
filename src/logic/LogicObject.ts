/**
 * Created by tommyZZM on 2015/4/20.
 */
module game{
    //TODO: 20150422 物体的旋转角度和方向对应
    export class LogicObject extends alcedo.AppObject{

        private _display:alcedo.canvas.Sprite;

        //private _direction:alcedo.canvas.Vector2D;//方向

        private _velocity:alcedo.canvas.Vector2D;//速度哦

        public acceleration:alcedo.canvas.Vector2D;//加速度哦

        public constructor(displayobject:alcedo.canvas.Sprite){
            super();
            this._display = displayobject;
            //this._direction = new alcedo.canvas.Vector2D(1,0);
            this._velocity = new alcedo.canvas.Vector2D();
            this.acceleration = new alcedo.canvas.Vector2D(0,0);
            this._isobjactive = true;

            stage.addEventListener(alcedo.canvas.Stage.ENTER_MILLSECOND10,this.onEachTime,this);
            stage.addEventListener(alcedo.canvas.Stage.ENTER_SECOND,this.onCheckTime,this);
        }

        private onEachTime(e:alcedo.canvas.ITickerEvent){
            if( this._velocity.length){
                this.updateVelocity();
                this._velocity.x+=this.acceleration.x*e.delay;
                this._display.x += this._velocity.x*e.delay;
                this._velocity.y+=this.acceleration.y*e.delay;
                this._display.y+=this._velocity.y*e.delay;
            }
        }

        private _isobjactive:boolean;
        private onCheckTime(){
            this._isobjactive = this._display.isInViewPort();
        }

        public resetObjct(){
            //TODO:重置物体
        }

        public get velocity():alcedo.canvas.Vector2D{
            return this._velocity
        }

        public get speed():number{
            return this._velocity.length;
        }

        public set speed(value:number){
            this._velocity.length =value;
            //trace(value,this._velocity.length);
        }

        //public set direction(direction:alcedo.canvas.Vector2D){
        //    this._direction.resetAs(direction);
        //    this._direction.unitlize();
        //}

        private updateVelocity(){
            var _s = this._velocity.length;
            //trace(_s);
            if(!_s)return;
            this._velocity.length = _s;
        }

        public get b():alcedo.canvas.Sprite{
            return this._display;
        }

    }
}