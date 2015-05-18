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

            private _stageWidth:number;
            public get stageWidth():number{
                return this._stageWidth
            }
            private _stageHeight:number;
            public get stageHeight():number{
                return this._stageHeight
            }

            private _maincontext:CanvasMainContext;
            private _touchcontext:TouchContext;

            public _options:any;
            private _orientchanged:boolean;

            //component
            private _ticker:Ticker;
            private _camera:Camera2D;
            //private _tweens:Tweens;

            private _enterframemap:Dict;

            public constructor(canvas:dom.DomElement,width:number=320,height:number=480,opts:any={}){
                super();
                this._enterframemap = new Dict();

                //Stage的宽高一旦被初始化之后就不会改变
                this._staticboundingbox.width = width;
                this._staticboundingbox.height = height;

                this.setStageWidth(width);
                this.setStageHeight(height);
                this._options = opts;
                this.initcomponent();

                this._maincontext = new CanvasMainContext(this,canvas);
                this.resizecontext();
                this.initcontext();
            }

            //只读
            public get width(){
                return this._staticboundingbox.width;
            }

            public get height(){
                return this._staticboundingbox.height;
            }

            //设置渲染宽度
            public setStageWidth(width:number){
                this._stageWidth = width;
            }

            //设置渲染高度
            public setStageHeight(height:number){
                this._stageHeight = height;
            }

            //初始化组件
            private initcomponent(){
                this._ticker = new Ticker(this);
                this._camera = new Camera2D(this);

                this._startTime = Date.now();
            }

            //初始化子Context
            private initcontext(){
                this._touchcontext = new TouchContext(this);
            }

            //渲染循环
            public render(renderer:CanvasRenderer){
                this._transform();//遍历显示对象树，计算每个显示对象变换矩阵
                this._render(renderer);//绘制每个显示对象
                this._distapchEnterFrame(renderer);//分发EnterFrame事件
            }

            private _startTime:number = 0;
            private _lastTime:number = 0;
            private _nowTime(){
                return Date.now()-this._startTime;
            }

            /**
             * 分发EnterFrame消息
             * @param renderer
             * @private
             */
            private _distapchEnterFrame(renderer){
                var nowTime:number = this._nowTime();
                var dt = nowTime-this._lastTime;
                //TODO:广播EnterFrame;
                AppNotifyable.notify(this._enterframemap,Stage.ENTER_FRAME,[{dt:dt,renderer:renderer}]);
                this.emit(Stage.ENTER_FRAME,{dt:dt});
                this._lastTime = nowTime;
            }
            public onenterframe(callback,thisOBject){
                AppNotifyable.registNotify(this._enterframemap,Stage.ENTER_FRAME,callback,thisOBject)
            }

            public get container():dom.DomElement{
                return this._maincontext["_canvascontainer"];
            }

            /**
             * 获得Canvas
             * @returns {alcedo.dom.DomElement}
             */
            public get canvas():dom.DomElement{
                return this._maincontext.canvas;
            }

            /**
             * 获得夹层
             * @returns {alcedo.dom.DomElement}
             */
            public get gasket():dom.DomElement{
                return this._maincontext.gasket;
            }

            /**
             * 获得UI层
             * @returns {alcedo.dom.DomElement}
             */
            public get canvasui():dom.DomElement{
                return this._maincontext.canvasui;
            }


            //Stage的设置
            public get options():any{
                return this._options;
            }

            //resize
            public resizecontext(){
                this._maincontext.resizecontext();
            }
            //获得轴向是否改变了
            public get orientchanged():boolean{
                return this._maincontext.checkorient();
            }

            //获得取景器
            public get viewPort():Rectangle{
                return this._camera.viewsafe();
            }

            //获得镜头
            public get camera():Camera2D{
                return this._camera;
            }

            public _transform(){
                var wt = this._worldtransform;
                wt.identity();
                this._getMatrix(wt);
                this.eachChilder((child)=>{
                    child._transform();
                })
            }

            public isInViewPort():boolean{
                return true;
                //nothing
            }

            addChild(child:DisplayObject){
                if(child instanceof Stage)return;//todo:error log here;
                super.addChild(child);
            }
        }
    }
}