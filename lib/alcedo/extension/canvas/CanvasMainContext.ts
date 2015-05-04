/**
 * Created by tommyZZM on 2015/4/6.
 */
module alcedo {
    export module canvas {
        /**
         *
         * 组合了DomContext、TouchContext、RenderContext
         */

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
                this._designwidth = this._stage.width();
                this._designheight = this._stage.height();
                this._designw2h    = this._designwidth/this._designheight;

                this._canvas = canvas;
                this._canvas.node["width"] = this._designwidth;
                this._canvas.node["height"] = this._designheight;

                this._canvascontainer = d$.query("<div></div>")[0];
                //this._canvascontainer.id = this._canvas.id+"_container";
                this._canvascontainer.insertBefore(this._canvas);
                this._canvascontainer.appendChild(this._canvas);

                this._profiler = new Profiler(this);
                if(this._stage.options.profiler===true){
                    this._profiler.visible = true;
                }

                this.createui();

                this.resizecontext();
                this._stage.resizecontext = this.resizecontext.bind(this);

                this.run();
            }

            //创建dom ui;
            private createui(){
                var id = "";
                if(this._stage.options.ui===true){
                    this._canvasui = d$.query("<div></div>")[0];
                    id = this._canvas.id+"_ui";
                }

                if(typeof this._stage.options.ui == "string"){
                    this._canvasui = d$.query("#"+this._stage.options.ui)[0];
                    id = this._stage.options.ui;
                    if(!this._canvasui){
                        this._canvasui = d$.query("<div></div>")[0];
                    }
                }

                if(this._canvasui){
                    this._canvasui.id = id;
                    this._canvasui.insertBefore(this._canvas);
                    this._canvasui.css({position:"absolute",overflow: "hidden",width:"100%",height:"100%"});
                    if(typeof this.canvas.index == "number"){
                        this._canvasui.css({"z-index":Math.add(this.canvas.index,1)})
                    }else{
                        this._canvasui.css({"z-index":1})
                    }

                    //在ui层底部插入control gasket, 作为canvas的控制传导垫片
                    var control_gasket = d$.query("<div style='position: absolute;top:0;left: 0'></div>")[0];
                    control_gasket.id = this._canvas.id+"_gasket";
                    this._canvasui.appendChild(control_gasket);
                    control_gasket.css({width:this._canvas.width(),height:this._canvas.height()});
                    this._canvasgasket = control_gasket;
                    this._canvasgasket.css({"z-index":Math.add(this._canvasui.index,1)})
                }
            }

            private run():void{
                this._canvasrenderer = CanvasRenderer.detecter();//default 2d(cpu|webgl)
                //TODO:if webgl3d || other reset this._canvasrender
                this._canvasrenderer.executeMainLoop(this._stage,<any>this._canvas.node);
                this._canvasrenderer.registMainLoopTask(this.mainloop,this);

                this._canvascontainer.transition = 100;
                this._canvascontainer.addEventListener(dom.StyleEvent.TRAN_SITION_END,this.onResizeComplete,this)
                //this._stage = new Stage();
            }

            private mainloop(renderer:CanvasRenderer):void {
                (<any>this._stage)._enterframe(renderer);
            }

            private resizecontext(){
                this._stage["_orientchanged"] = false;
                var currstylew2h = this.containerStyleW2h;

                if(this._stage.options.orient===true){
                    if(this._designw2h>1){//Horizontal
                        if(!(currstylew2h>1)){
                            this._stage["_orientchanged"] = true;
                            currstylew2h = 1/currstylew2h;
                        }
                    }else{//Vertical
                        if(currstylew2h>1){
                            this._stage["_orientchanged"] = true;
                            currstylew2h = 1/currstylew2h;
                        }
                    }
                }

                if(currstylew2h>this._designw2h){
                    //this._stage._stageHeight = toValue(this._canvas.abscss().height);
                    this._stage["setHeight"](this._designheight);
                    this._stage["setWidth"](this._stage._stageHeight*currstylew2h);
                }else{
                    this._stage["setWidth"](this._designwidth);
                    this._stage["setHeight"](this._stage._stageWidth/currstylew2h);
                }

                this._stage.emit(Stage.RESIZE);

                this._canvas.node["width"] = this._stage.width();
                this._canvas.node["height"] = this._stage.height();

                this._canvasgasket.css({width:this._canvas.width(),height:this._canvas.height()});
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