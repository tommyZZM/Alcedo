/**
 * Created by tommyZZM on 2015/4/11.
 */
module alcedo{
    export module canvas{
        export class Camera2D extends AppProxyer{

            private _stage:Stage;

            private _position:Point2D;
            private _focal:number;
            private _yaw:Vector2D;

            private _buffer:number;

            private _vieworigin:Rectangle;
            private _viewfinder:Rectangle;
            private _viewsafe:Rectangle;

            public constructor(stage:Stage,buffer:number=1.2){
                super();
                this._focal = 1;
                this._yaw = new Vector2D(0.5,0.5);
                this._buffer = buffer>1?buffer:1;
                this._position = new Point2D();

                this._stage = stage;
                this._vieworigin = new Rectangle(stage.x,stage.y,stage.width(),stage.height());
                this._viewfinder = this._vieworigin.clone();
                this._viewsafe   = this._vieworigin.clone();

                //this.zoomToPoint(Point2D.identity(0,0),1,0);
            }

            public get x(){return this._position.x}
            public set x(x:number){
                this._position.x = x;
                this._stage.pivotOffsetX(this._position.x);
                this._updateView();
            }

            public get y(){return this._position.y}
            public set y(y:number){
                this._position.y = y;
                this._stage.pivotOffsetY(this._position.y);
                this._updateView();
            }

            public get focal(){return this._focal}
            public set focal(focal:number){
                this._focal = 1/focal;
                this._updateView();
            }

            public get yawX(){return this._yaw.x}
            public get yawY(){return this._yaw.y}
            public set yaw(yaw:number){
                this._yaw.x = yaw;
                this._yaw.y = yaw;
                this._updateView();
            }

            public zoomTo(x:number,y:number,focal:number,yawx:number=0.5,yawy:number=0.5){//,duration:number=0,callback?:Function,thisObject?:any
                this._position.x = x;
                this._stage.pivotOffsetX(this._position.x);

                this._position.y = y;
                this._stage.pivotOffsetY(this._position.y);

                this._focal = 1/focal;

                this._yaw.x = yawx;
                this._yaw.y = yawy;
                this._updateView();
            }

            private _updateView():void{
                //TODO:现在的Viewport计算不正确！
                this._stage.x = this._stage.width()*this._yaw.x;
                this._stage.y = this._stage.height()*this._yaw.y;
                this._stage.scaleALL(1/this._focal);

                this._viewfinder.width = this._focal*this._stage.width();
                this._viewfinder.height = this._focal*this._stage.height();

                this._viewfinder.x = this._position.x-this._viewfinder.width/2;
                this._viewfinder.y = this._position.y-this._viewfinder.height/2;

                var buffer = this._buffer;
                this._viewsafe.width = this._viewfinder.width*buffer;
                this._viewsafe.height = this._viewfinder.height*buffer;

                this._viewsafe.x = this._viewfinder.x-(this._viewfinder.width*(buffer-1))/2;
                this._viewsafe.y = this._viewfinder.y-(this._viewfinder.width*(buffer-1))/2;

                //trace(this._stage.x,this._stage.y,this._stage.width(),this._stage.height(),this._stage["_staticboundingbox"]);
            }

            public viewfinder():Rectangle{
                return this._viewfinder.clone();
            }

            public viewsafe():Rectangle{
                return this._viewsafe.clone();
            }
        }
    }
}