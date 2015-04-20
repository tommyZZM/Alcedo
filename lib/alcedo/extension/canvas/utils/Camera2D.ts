/**
 * Created by tommyZZM on 2015/4/11.
 */
module alcedo{
    export module canvas{
        export class Camera2D extends AppProxyer{

            private _stage:Stage;

            private _position:Point2D;
            private _focal:number;
            private _pivot:number;

            private _buffer:number;

            private _vieworigin:Rectangle;
            private _viewfinder:Rectangle;
            private _viewsafe:Rectangle;

            public constructor(stage:Stage,buffer:number=1.2){
                super();
                this._focal = 1;
                this._pivot = 0;
                this._buffer = buffer>1?buffer:1;
                this._position = new Point2D();

                this._stage = stage;
                this._vieworigin = new Rectangle(stage.x,stage.y,stage.width(),stage.height());
                this._viewfinder = this._vieworigin.clone();
                this._viewsafe   = this._vieworigin.clone();

                //this.zoomToPoint(Point2D.identity(0,0),1,0);
            }

            public set x(x:number){
                this._position.x = x;
                this._stage.pivotOffsetX(this._position.x);
                this._updateViewSafe();
            }

            public set y(y:number){
                this._position.y = y;
                this._stage.pivotOffsetY(this._position.y);
                this._updateViewSafe();
            }

            public focal(focal:number,pivot:number = 0.5){
                this._focal = 1/focal;
                this._pivot = pivot;

                this._stage.x = this._stage.width()*this._pivot;
                this._stage.y = this._stage.height()*this._pivot;
                this._stage.scale(1/this._focal);

                this._updateViewSafe();
            }

            public zoomTo(x:number,y:number,focal:number,pivot:number=0.5){//,duration:number=0,callback?:Function,thisObject?:any
                this.x = x;
                this.y = y;
                this.focal(focal,pivot);
            }

            private _updateViewSafe():void{
                //TODO:现在的Viewport计算不正确！
                this._viewfinder.width = this._focal*this._stage.width();
                this._viewfinder.height = this._focal*this._stage.height();

                this._viewfinder.x = this._position.x-this._viewfinder.width/2;
                this._viewfinder.y = this._position.y-this._viewfinder.height/2;

                var buffer = this._buffer;
                this._viewsafe.width = this._viewfinder.width*buffer;
                this._viewsafe.height = this._viewfinder.height*buffer;

                this._viewsafe.x = this._viewfinder.x-(this._viewfinder.width*(buffer-1))/2;
                this._viewsafe.y = this._viewfinder.y-(this._viewfinder.width*(buffer-1))/2;

                //trace(this._viewfinder.x,this._viewsafe.x);
            }

            public viewfinder():Rectangle{
                return Rectangle.identity(this._viewfinder);
            }

            public viewsafe():Rectangle{
                return Rectangle.identity(this._viewsafe);
            }
        }
    }
}