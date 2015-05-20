/**
 * Created by tommyZZM on 2015/5/20.
 */
module game{
    export class Entity extends alcedo.EventDispatcher{
        protected _display:alcedo.canvas.DisplayObject;

        protected _velocity:alcedo.canvas.Vector2D;//速度哦

        protected _acceleration:alcedo.canvas.Vector2D;//加速度哦

        protected _body:sat.Circle;

        protected _mass:number = 1;

        public constructor(){
            super();
        }

        public step(e){
            this._applyForce(this._force);

            if(this._forcemoment.length>0){
                this._applyForce(this._forcemoment);
                this._forcemoment.reset();
            }

            if( this._velocity.length){
                this._velocity.x+=this._acceleration.x*e.delay;
                this._display.x += this._velocity.x*e.delay;
                this._velocity.y+=this._acceleration.y*e.delay;
                this._display.y+=this._velocity.y*e.delay;
            }

            this._display.rotation = this._velocity.deg
        }

        public sync(){
            this._body.pos.x = this._display.x-this._display.pivotOffsetX;
            this._body.pos.y = this._display.y-this._display.pivotOffsetY;
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

        /**
         * Get
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

        public get display(){
            return this._display
        }

        public get right(){
            return this.display.actualBound().right
        }

        public get right(){
            return this.display.actualBound().right
        }

        public get body(){
            return this._body;
        }
    }
}