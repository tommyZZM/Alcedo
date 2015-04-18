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
                this._vieworigin = new Rectangle(stage.x,stage.y,stage._stageWidth,stage._stageHeight);
                this._viewfinder = this._vieworigin.clone();
                this._viewsafe   = this._vieworigin.clone();
                this._updatingObj = {x:this._stage.x,y:this._stage.y,scale:this._stage.scaleX}

                this._stage.addEventListener(Stage.RESIZE,this._updateViewPort,this);

                //this.zoomToPoint(Point2D.identity(0,0),1,0);
            }

            public zoomTo(x:number,y:number,focal:number,pivot:number=0.5,duration:number=0){
                this._focal = 1/focal;
                this._pivot = pivot;
                this._position.x = x;
                this._position.y = y;
                this._updateViewPort(duration);
            }

            public zoomToPoint(point:Point2D,focal:number,offset:number=0.5,duration:number=0){
                this.zoomTo(point.x,point.y,focal,offset,duration);
            }

            /**
             * 跟随指定对象
             * @param target
             * @param focal
             * @param offset
             * @param duration
             */
            public followTarget(target:DisplayObject,offset:number=0.5){

            }

            private _updateViewPort(duration:number){
                this._viewfinder.width = this._focal*this._stage._stageWidth;
                this._viewfinder.height = this._focal*this._stage._stageHeight;

                this.resetUpdatingObj();
                if(duration>100){
                    this._stage.tweens().from(this._updatingObj)
                        .to({x:this._position.x + this._stage._stageWidth*this._pivot,
                            y:this._position.y + this._stage._stageHeight*this._pivot,scale:1/this._focal
                        },1000,(target)=>{
                            trace(target,target.x,target.y,target.scale);
                            this._stage.x = target.x;
                            this._stage.y = target.y;
                            this._stage.scale(target.scale);
                        });
                }else{
                    this._stage.x = this._position.x + this._stage._stageWidth*this._pivot;
                    this._stage.y = this._position.y + this._stage._stageHeight*this._pivot;
                    this._stage.scale(1/this._focal);
                }

                this._viewfinder.x = -this._stage.x;
                this._viewfinder.y = -this._stage.y;

                this._updateViewSafe();
            }

            private _updateViewSafe():void{
                var buffer = this._buffer;
                this._viewsafe.width = this._viewfinder.width*buffer;
                this._viewsafe.height = this._viewfinder.height*buffer;

                this._viewsafe.x = this._viewfinder.x-(this._viewfinder.width*(buffer-1))/2;
                this._viewsafe.y = this._viewfinder.y-(this._viewfinder.width*(buffer-1))/2;
            }

            public viewfinder():Rectangle{
                return Rectangle.identity(this._viewfinder);
            }

            public viewsafe():Rectangle{
                return Rectangle.identity(this._viewsafe);
            }

            private _updatingObj:any;
            private resetUpdatingObj(){
                this._updatingObj.x = this._stage.x;
                this._updatingObj.y = this._stage.y;
                this._updatingObj.scale = this._stage.scaleX
            }
        }
    }
}