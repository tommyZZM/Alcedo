/**
 * Created by tommyZZM on 2015/5/20.
 */
module game{
    export class Entity extends alcedo.EventDispatcher{
        public static ON_UPDATE:string = "Entity.ON_UPDAATE";

        protected _display:alcedo.canvas.DisplayObject;

        protected _velocity:alcedo.canvas.Vector2D;//速度哦

        protected _acceleration:alcedo.canvas.Vector2D;//加速度哦

        protected _force:alcedo.canvas.Vector2D;

        protected _body:sat.Polygon;

        protected _mass:number = 1;

        public gravityenable:boolean;

        public constructor(display?:alcedo.canvas.DisplayObject,opts?:any){
            super();
            this._display = display;
            this._velocity = new alcedo.canvas.Vector2D();
            this._acceleration = new alcedo.canvas.Vector2D();
            this._force = new alcedo.canvas.Vector2D();

            //this._body = new SAT.Circle(new SAT.Vector(0,0),0);
        }

        public sync(){
            if(!this._body || !this._display)return;
            this._body.pos["x"] = this._display.globalx;
            this._body.pos["y"] = this._display.globaly;
            if(this._body instanceof sat.Polygon){
                this._body["offset"].x = -this.display.pivotOffsetX*this.display.scaleX;
                this._body["offset"].y = -this.display.pivotOffsetY*this.display.scaleY;
                this._body.setAngle(this.display.rotation * alcedo.Constant.DEG_TO_RAD);
            }
        }

        //TODO:突变力和渐变力;
        public applyForce(force:alcedo.canvas.Vector2D){
            this._force.add(force);
        }

        public applyMomentForce(force:alcedo.canvas.Vector2D){
            var momentforce = force;
            this._velocity.add(momentforce.divide(this._mass));
        }

        public clearForce(){
            this._force.reset();
        }

        /**
         * Get
         * @returns {alcedo.canvas.Vector2D}
         */
        public get curForce():alcedo.canvas.Vector2D{
            return this._force;
        }

        public get velocity():alcedo.canvas.Vector2D{
            return this._velocity
        }

        public get  acceleration():canvas.Vector2D{
            return this._acceleration;
        }

        public get speed():number{
            return this._velocity.length;
        }

        public set speed(value:number){
            this._velocity.length =value;
        }

        public get display():any{
            return this._display
        }

        public set x(value:number){
            this._display.x = value
        }
        public get x():number{
            return this.display.x;
        }

        public set y(value:number){
            this._display.y = value
        }
        public get y():number{
            return this.display.y;
        }

        public get left(){
            return this.display.actualBound().x
        }

        public get right(){
            return this.display.actualBound().right
        }

        public get body(){
            return this._body;
        }
    }
}