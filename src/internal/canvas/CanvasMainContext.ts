/**
 * Created by tommyZZM on 2015/4/6.
 */
module alcedo {
    export module canvas {
        /**
         *
         * 组合了DomContext、TouchContext、RenderContext
         */
        export var canvasStyleClass = {
            alcedo_canvas:"alcedo-canvas",
            alcedo_canvas_ui:"alcedo-canvas-ui",
            alcedo_canvas_container:"alcedo-canvas-container",
            alcedo_canvas_profiler:"alcedo-canvas-profiler",
        };

        export class CanvasMainContext extends EventDispatcher {
            //private static MainLoopTask:string = "CanvasMainContext_MainLoopTask";

            private _designwidth:number;
            private _designheight:number;
            private _designw2h:number;

            private _canvascontainer:dom.DomElement;
            private _canvas:dom.DomElement;
            private _canvasgasket:dom.DomElement;
            private _canvasui:dom.DomElement;
            private _profiler:Profiler;

            private _canvasrenderer:CanvasRenderer;

            private _stage:Stage;
            public static stage:Stage;

            public constructor(stage:Stage,canvas:dom.DomElement){
                super();
                this._stage = stage;
                this._designwidth = this._stage.stageWidth;
                this._designheight = this._stage.stageHeight;
                this._designw2h    = this._designwidth/this._designheight;

                this._canvas = canvas;
                this._canvas.addClass(canvasStyleClass.alcedo_canvas);

                this._canvascontainer = dom.query("<div></div>")[0];
                this._canvascontainer.addClass(canvasStyleClass.alcedo_canvas_container);
                this._canvascontainer.css({})
                this._canvascontainer.insertBefore(this._canvas);
                this._canvascontainer.appendChild(this._canvas);

                if(this._stage.options.profiler===true){
                    this._profiler = new Profiler(this);
                    this._profiler.visible = true;
                }

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
                    this._canvasui.css({position:"absolute"});//,width:"100%",height:"100%"
                    if(typeof this.canvas.index == "number"){
                        this._canvasui.css({"z-index":Math.add(this.canvas.index,1)})
                    }else{
                        //this._canvasui.css({"z-index":1})
                    }

                    //在ui层底部插入control gasket, 作为canvas的控制传导垫片
                    this._canvasgasket = dom.query("<div style='position: absolute;top:0;left: 0'></div>")[0];
                    this._canvasgasket.id = this._canvas.id+"_gasket";
                    this._canvasgasket.insertBefore(this._canvasui);
                    //this._canvasgasket.css({"z-index":Math.add(this._canvasui.index,1)})
                }
            }

            private run():void{
                this._canvasrenderer = CanvasRenderer.detecter();//default 2d(cpu|webgl)
                //TODO:if webgl3d || other reset this._canvasrender
                this._canvasrenderer.executeMainLoop(this._stage,<any>this._canvas.node);
                this._canvasrenderer.registMainLoopTask(this.mainloop,this);

                this._canvascontainer.css_transition = 10;
                this._canvascontainer.addEventListener(dom.StyleEvent.TRAN_SITION_END,this.onResizeComplete,this);
                //this._stage = new Stage();
            }

            private mainloop(renderer:CanvasRenderer):void {
                //(<any>this._stage)._enterframe(renderer);
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

            public resizecontext(){
                var currstylew2h = this.containerStyleW2h;

                if(this.stage.orientchanged){
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

                this._stage.emit(Stage.RESIZE);

                //trace(this._stage.stageWidth,this._stage.stageHeight)
                this._canvas.node["width"] = this._stage.stageWidth;
                this._canvas.node["height"] = this._stage.stageHeight;

                this._canvasui.css({width: this._canvas.styleWidth, height: 0});
                if(this._canvasgasket) {
                    this._canvasgasket.css({width: this._canvas.styleWidth, height: this._canvas.styleHeight});
                }
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

            public get containerStyleW2h():number{
                return toValue(this._canvas.abscss().width)/toValue(this._canvas.abscss().height)
            }
        }
    }
}