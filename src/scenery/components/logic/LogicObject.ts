/**
 * Created by tommyZZM on 2015/4/20.
 */
module game{
    //TODO: 20150422 物体的旋转角度和方向对应 done
    export class LogicObject extends alcedo.AppObject{

        protected _display:alcedo.canvas.Sprite;

        protected _mass:number = 1;

        protected _velocity:alcedo.canvas.Vector2D;//速度哦
        protected _maxspeed:number;

        public acceleration:alcedo.canvas.Vector2D;//加速度哦

        public constructor(displayobject?:alcedo.canvas.Sprite){
            super();
            this._display = displayobject;
            //this._direction = new alcedo.canvas.Vector2D(1,0);
            this._velocity = new alcedo.canvas.Vector2D();
            this.acceleration = new alcedo.canvas.Vector2D(0,0);
            //this._isobjactive = true;

            //stage.addEventListener(alcedo.canvas.Stage.ENTER_SECOND,this.onCheckTime,this);
        }

        public update(e:alcedo.canvas.ITickerEvent){
            if( this._velocity.length){
                if(this._velocity.length>=this._maxspeed){
                    this._velocity.length = this._maxspeed;
                }
                this.updateVelocity();
                this._velocity.x+=this.acceleration.x*e.delay;
                this._display.x += this._velocity.x*e.delay;
                this._velocity.y+=this.acceleration.y*e.delay;
                this._display.y+=this._velocity.y*e.delay;
                //trace(this._velocity.length);
            }

            this.b.rotation = this.velocity.toDeg()
        }

        //TODO:突变力和渐变力;
        public applyForce(vector:alcedo.canvas.Vector2D){
            this._velocity.add(vector.divide(alcedo.canvas.Vector2D.identity(this._mass,this._mass)));
            //trace(this._velocity.y,vector.y);
        }

        public resetObjct(){
            //TODO:重置物体
        }

        /**
         * [物体运动]
         * @returns {alcedo.canvas.Vector2D}
         */
        public get velocity():alcedo.canvas.Vector2D{
            return this._velocity
        }

        public get speed():number{
            return this._velocity.length;
        }

        public set speed(value:number){
            this._velocity.length =value;
        }

        public set direction(degree:number){

        }

        public get direction(){
            return 0
        }

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