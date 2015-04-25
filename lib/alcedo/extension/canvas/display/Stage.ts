/**
 * Created by tommyZZM on 2015/4/8.
 */
module alcedo{
    export module canvas{
        export class Stage extends DisplatObjectContainer{
            public static ENTER_FRAME:string = "Stage_ENTER_FRAME";
            public static ENTER_MILLSECOND10:string = "Stage_ENTER_20MILLSECOND";
            public static ENTER_SECOND:string = "Stage_ENTER_SECOND";

            public static RESIZED:string = "Stage_RESIZED";
            public static RESIZE:string = "Stage_RESIZE";

            //private _canvas:dom.DomElement;

            public _stageWidth:number;
            public _stageHeight:number;

            private _maincontext:CanvasMainContext;

            public _options:any;
            private _orientchanged:boolean;

            //component
            private _ticker:Ticker;
            private _camera:Camera2D;
            //private _tweens:Tweens;

            public constructor(canvas:dom.DomElement,width:number=320,height:number=480,opts:any={}){
                super();
                //this._canvas = canvas;
                this.setWidth(width);
                this.setHeight(height);
                this._options = opts;
                this.initcomponent();
                this._maincontext = new CanvasMainContext(this,canvas);
            }

            public width():any{
                return this._staticboundingbox.width;
            }
            private setWidth(width:number){
                this._staticboundingbox.width =width;
                this._stageWidth = width;
            }

            public height():any{
                return this._staticboundingbox.height;
            }
            private setHeight(height:number){
                this._staticboundingbox.height =height;
                this._stageHeight = height;
            }

            private initcomponent(){
                this._ticker = new Ticker(this);
                this._camera = new Camera2D(this);
                //this._tweens = (new Tweens()).init(this);

                this._startTime = Date.now();
            }

            public render(renderer:CanvasRenderer){
                this._render(renderer)
            }

            public _transform(){
                var wt = this._worldtransform;
                wt.identity();
                this._getMatrix(wt);
                this.eachChilder((child)=>{
                    child._transform();
                })
            }

            private _startTime:number = 0;
            private _lastTime:number = 0;
            private _nowTime(){
                return Date.now()-this._startTime;
            }

            /** @deprecated dont use outside*/
            public _enterframe(renderer){
                var nowTime:number = this._nowTime();
                var dt = nowTime-this._lastTime;
                //TODO:广播EnterFrame;
                this.notify(this._notifymap,Stage.ENTER_FRAME,[{dt:dt,renderer:renderer}]);
                this.emit(Stage.ENTER_FRAME,{dt:dt});
                this._lastTime = nowTime;
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
                return this._camera.viewsafe();
            }

            public camera():Camera2D{
                return this._camera;
            }

            //public tweens():Tweens{
            //    return this._tweens;
            //}

            addChild(child:DisplayObject){
                if(child instanceof Stage)return;//todo:error log here;
                super.addChild(child);
            }
        }
    }
}