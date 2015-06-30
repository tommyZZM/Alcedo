/**
 * Created by tommyZZM on 2015/5/25.
 */
module alcedo{
    export var canvasStyleClass = {
        alcedo_canvas:"alcedo-canvas",
        alcedo_canvas_ui:"alcedo-canvas-ui",
        alcedo_canvas_container:"alcedo-canvas-container",
        alcedo_canvas_profiler:"alcedo-canvas-profiler",
    };

    export class MainContext extends EventDispatcher {
        //private static MainLoopTask:string = "CanvasMainContext_MainLoopTask";

        private _designwidth:number;
        private _designheight:number;
        private _designw2h:number;

        private _canvascontainer:dom.DomElement;
        private _canvas:dom.DomElement;
        private _canvasgasket:dom.DomElement;
        private _canvasui:dom.DomElement;
        //private _profiler:Profiler;

        private _canvasrenderer:PIXI.WebGLRenderer|PIXI.CanvasRenderer;

        private _stage:Stage;
        public static stage:Stage;

        private _ticker:Ticker;
        private _profiler:Profiler;

        public constructor(stage:Stage,canvas:dom.DomElement){
            super();
            this._stage = stage;
            this._designwidth = this._stage.stageWidth;
            this._designheight = this._stage.stageHeight;
            this._designw2h    = this._designwidth/this._designheight;

            this._canvas = canvas;

            this._canvascontainer = dom.query("<div></div>")[0];
            this._canvascontainer.styleClass = this._canvas.styleClass;
            this._canvascontainer.insertBefore(this._canvas);
            this._canvascontainer.appendChild(this._canvas);

            this._ticker = new Ticker(this);
            if(this._stage.options.profiler===true){
                this._profiler = new Profiler(this);
                this._profiler.visible = true;
            }

            this._canvas.addClass(canvasStyleClass.alcedo_canvas);
            this._canvascontainer.addClass(canvasStyleClass.alcedo_canvas_container);

            this.createui();

            this.run();
        }

        //创建dom ui;
        private createui(){
            var id = "";
            if(this._stage.options.ui===true){
                this._canvasui = dom.query("<div></div>")[0];
                id = this._canvas.id+"_ui";
            }

            if(typeof this._stage.options.ui == "string"){
                this._canvasui = dom.query("#"+this._stage.options.ui)[0];
                id = this._stage.options.ui;
            }

            if(!this._canvasui){
                this._canvasui = dom.query("<div></div>")[0];
            }

            if(this._canvasui){
                this._canvasui.id = id;
                this._canvasui.insertBefore(this._canvas);
                this._canvasui.addClass(canvasStyleClass.alcedo_canvas_ui);
                this._canvasui.css({position:"absolute",width:"100%"});//,width:"100%",height:"100%"
                if(typeof this.canvas.index == "number"){
                    this._canvasui.css({"z-index":this.canvas.index+1})
                }else{
                    //this._canvasui.css({"z-index":1})
                }
            }
        }

        private run():void{
            //Improtant:new a PIXI Renderer
            this._canvasrenderer = PIXI.autoDetectRenderer(this._designwidth, this._designheight
                ,{
                    view:<HTMLCanvasElement>this.canvas.node,
                    antialiasing: this._stage.options.antialiasing,
                    transparent: false,
                    resolution: 1,
                    clearBeforeRendering:this._stage.options.clearBeforeRendering,
                    preserveDrawingBuffer:this._stage.options.preserveDrawingBuffer,
                    forceFXAA:this._stage.options.forceFXAA,
                    backgroundColor:this._stage.options.backgroundColor
                });
            if(this._profiler){
                this._profiler.renderType = this._canvasrenderer;
            }

            this._canvascontainer.css_transition = 10;
            this._canvascontainer.addEventListener(dom.StyleEvent.TRAN_SITION_END,this.onResizeComplete,this);

            this._mainloopcallback = this.mainloop.bind(this);

            this.mainloop();
        }

        private _mainloopcallback:FrameRequestCallback;
        private mainloop():void {
            requestAnimationFrame(this._mainloopcallback);

            this._stage.render(this._canvasrenderer);
        }

        public resizeContext(){
            var currstylew2h = this.containerStyleW2h;

            if(this.checkorient()){
                currstylew2h = 1/currstylew2h;
            }

            if(currstylew2h>this._designw2h){
                //this._stage._stageHeight = toValue(this._canvas.abscss().height);
                this._stage.setStageHeight(this._designheight);
                this._stage.setStageWidth(this._stage.stageHeight*currstylew2h);
            }else{
                this._stage.setStageWidth(this._designwidth);
                this._stage.setStageHeight(this._stage.stageWidth/currstylew2h);
            }

            //trace(this._stage.stageWidth,this._stage.stageHeight)
            this._canvas.node["width"] = this._stage.stageWidth;
            this._canvas.node["height"] = this._stage.stageHeight;

            this._canvascontainer.css({width: this._canvas.styleWidth, height: 0});
            //console.log("resized");
        }

        public onResizeComplete(){
            this._stage.emit(Stage.RESIZED);
        }

        public get container():dom.DomElement{
            return this._canvascontainer;
        }

        public get canvas():dom.DomElement{
            return this._canvas;
        }

        public get gasket():dom.DomElement{
            return this._canvasgasket;
        }

        public get canvasui():dom.DomElement{
            return this._canvasui
        }

        public get stage():Stage{
            return this._stage;
        }

        public checkorient():boolean{
            var currstylew2h = this.containerStyleW2h;

            if(this._stage.options.orient===true){
                if(this._designw2h>1){//Horizontal
                    if(!(currstylew2h>1)){
                        return true;
                    }
                }else{//Vertical
                    if(currstylew2h>1){
                        return true;
                    }
                }
            }
            return false;
        }

        public get containerStyleW2h():number{
            return toValue(this._canvas.abscss().width)/toValue(this._canvas.abscss().height)
        }
    }
}