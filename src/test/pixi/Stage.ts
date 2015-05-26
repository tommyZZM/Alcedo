/**
 * Created by tommyZZM on 2015/5/25.
 */
module alcedo{
    export class Stage extends EventDispatcher{
        public static ENTER_FRAME:string = "Stage_ENTER_FRAME";
        public static ENTER_MILLSECOND10:string = "Stage_ENTER_20MILLSECOND";
        public static ENTER_SECOND:string = "Stage_ENTER_SECOND";

        public static RESIZED:string = "Stage_RESIZED";

        private _options:any;
        private _enterframemap:Dict;

        private _root:PIXI.Container;

        private _maincontext:MainContext;

        public constructor(canvas:dom.DomElement,width:number=320,height:number=480,opts:any={}) {
            super();
            this._options = opts;

            this._width = width;
            this._height = height;

            this.setStageWidth(width);
            this.setStageHeight(height);
            this._enterframemap = new Dict();

            this._root = new PIXI.Container();

            this._maincontext = new MainContext(this,canvas);

            this.resizeContext();
        }

        private _stageWidth:number;
        public get stageWidth():number{
            return this._stageWidth
        }
        private _stageHeight:number;
        public get stageHeight():number{
            return this._stageHeight
        }

        //设置渲染宽度
        public setStageWidth(width:number){
            this._stageWidth = width;
        }

        //设置渲染高度
        public setStageHeight(height:number){
            this._stageHeight = height;
        }

        //只读
        private _width:number;
        public get width(){
            return this._width;
        }
        private _height:number;
        public get height(){
            return this._height;
        }

        //渲染循环
        public render(renderer:PIXI.SystemRenderer){
            renderer.render(this._root);

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

        //Dom
        public get warpper():dom.DomElement{
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
         * 获得UI层
         * @returns {alcedo.dom.DomElement}
         */
        public get canvasui():dom.DomElement{
            return this._maincontext.canvasui;
        }

        //resize
        public resizeContext(){
            this._maincontext.resizeContext();
        }
        //获得轴向是否改变了
        public get orientchanged():boolean{
            return this._maincontext.checkorient();
        }

        public get options():any{
            return this._options;
        }

        public get root():PIXI.Container{
            return this._root;
        }
    }
}