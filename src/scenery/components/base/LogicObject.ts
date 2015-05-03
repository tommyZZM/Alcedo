/**
 * Created by tommyZZM on 2015/4/20.
 */
module game{
    //TODO: 20150422 物体的旋转角度和方向对应 done
    export class LogicObject extends alcedo.AppObject{

        protected _display:alcedo.canvas.Sprite|alcedo.canvas.DisplayGraphic;

        protected _mass:number = 1;

        protected _velocity:alcedo.canvas.Vector2D;//速度哦
        protected _maxspeed:number;

        public acceleration:alcedo.canvas.Vector2D;//加速度哦
        public acceleration_degree:number=0;

        public constructor(displayobject?:alcedo.canvas.Sprite){
            super();
            this._display = displayobject;
            //this._direction = new alcedo.canvas.Vector2D(1,0);
            this._velocity = new alcedo.canvas.Vector2D();
            this.acceleration = new alcedo.canvas.Vector2D(0,0);

            this._forcemoment = new alcedo.canvas.Vector2D();
            this._force = new alcedo.canvas.Vector2D();
            //this._isobjactive = true;

            //stage.addEventListener(alcedo.canvas.Stage.ENTER_SECOND,this.onCheckTime,this);
        }

        public update(e:alcedo.canvas.ITickerEvent){
            this._applyForce(this._force);

            if(this._forcemoment.length>0){
                this._applyForce(this._forcemoment);
                this._forcemoment.reset();
            }

            if( this._velocity.length){
                if(this._velocity.length>=this._maxspeed){
                    this._velocity.length = this._maxspeed;
                }
                //this.updateVelocity();
                this._velocity.x+=this.acceleration.x*e.delay;
                this._display.x += this._velocity.x*e.delay;
                this._velocity.y+=this.acceleration.y*e.delay;
                this._display.y+=this._velocity.y*e.delay;
            }

            this.velocity.deg+=this.acceleration_degree;

            this.b.rotation = this.velocity.deg
        }

        //TODO:突变力和渐变力;
        private _force:alcedo.canvas.Vector2D;
        private _forcemoment:alcedo.canvas.Vector2D;
        public applyForce(force:alcedo.canvas.Vector2D,continute:boolean = true){
            if(continute){
                this._force.add(force);
            }else{
                this._forcemoment.add(force);
            }
        }

        public clearForce(){
            this._force.reset();
            this._forcemoment.reset();
        }

        private _applyForce(vector:alcedo.canvas.Vector2D){
            this._velocity.add(vector.divide(alcedo.canvas.Vector2D.identity(this._mass,this._mass)));
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

        public set maxspeed(value:number){
            this._maxspeed = value;
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

        /**
         * 物体显示与边界
         * @returns {alcedo.canvas.Sprite}
         */

        public get b():alcedo.canvas.DisplayObject{
            return this._display;
        }

        public shape():any{
            //返回形状 TODO:扩展shape模块
        }

    }
}