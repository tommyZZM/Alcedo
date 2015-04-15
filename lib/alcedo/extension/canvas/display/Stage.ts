/**
 * Created by tommyZZM on 2015/4/8.
 */
module alcedo{
    export module canvas{
        export class Stage extends DisplatObjectContainer{
            public static ENTER_FRAME:string = "Stage_ENTER_FRAME";
            public static ENTER_100MILLSECOND:string = "Stage_ENTER_100MILLSECOND";
            public static ENTER_SECOND:string = "Stage_ENTER_SECOND";

            public static RESIZED:string = "Stage_RESIZE";

            //private _canvas:dom.DomElement;

            public _stageWidth:number;
            public _stageHeight:number;

            private _maincontext:CanvasMainContext;
            private _ticker:Ticker;

            public _options:any;
            private _orientchanged:boolean;

            private _camera:Camera2D;

            public constructor(canvas:dom.DomElement,width:number=320,height:number=480,opts:any={}){
                super();
                //this._canvas = canvas;
                this._stageWidth = this.width = width;
                this._stageHeight = this.height = height;
                this._options = opts
                ;
                this._ticker = new Ticker(this);
                this._camera = new Camera2D(this);
                this._maincontext = new CanvasMainContext(this,canvas);
            }

            public _transform(){
                var wt = this._worldtransform;
                wt.identity();
                this._getMatrix(wt);
                this.eachChilder((child)=>{
                    child._transform();
                })
            }

            private _enterframe(){
                //TODO:广播EnterFrame;
                this.notify(this._notifymap,Stage.ENTER_FRAME);
                this.emit(Stage.ENTER_FRAME);
            }
            public enterframe(callback,thisOBject){
                this.registNotify(this._notifymap,Stage.ENTER_FRAME,callback,thisOBject)
            }

            public get canvas():dom.DomElement{
                return this._maincontext.canvas;
            }

            public get options():any{
                return this._options;
            }

            public resizecontext(){}//Dont Remove!! 该方法会在CanvasMainCOntext被覆盖重写,
            public get orientchanged():boolean{
                return this._orientchanged;
            }

            public viewPort():Rectangle{
                return Rectangle.identity(this._camera.viewfinder());
            }

            public camera():Camera2D{
                return this._camera;
            }

            /**
             * 定位系统
             */
            public left(offset:number=0):number{
                return this.x+offset
            }

            public right(offset:number=0):number{
                return this.x+this.width-offset;
            }

            public top(offset:number=0):number{
                return this.y+offset
            }

            public bottom(offset:number=0):number{
                return this.y+this.height-offset;
            }

            private _center:Point2D;
            public center(offsetx:number=0,offsety:number=0):Point2D{
                if(!this._center)this._center = Point2D.identity().clone();
                this._center.reset(this.width>>1+this.x+offsetx,this.height>>1+this.y+offsety);
                return this._center;
            }

        }
    }
}