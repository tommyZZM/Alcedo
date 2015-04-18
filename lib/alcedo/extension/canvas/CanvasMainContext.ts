/**
 * Created by tommyZZM on 2015/4/6.
 */
module alcedo {
    export module canvas {
        /**
         *
         * 组合了DomContext、TouchContext、RenderContext
         */

        export class CanvasMainContext extends AppProxyer {
            //private static MainLoopTask:string = "CanvasMainContext_MainLoopTask";

            private _designwidth:number;
            private _designheight:number;
            private _designw2h:number;

            private _canvascontainer:dom.DomElement;
            private _canvas:dom.DomElement;
            private _canvasui:dom.DomElement;
            private _profiler:Profiler;

            private _canvasrenderer:CanvasRenderer;

            private _stage:Stage;
            public static stage:Stage;

            public constructor(stage:Stage,canvas:dom.DomElement){
                super();
                this._stage = stage;
                this._designwidth = this._stage._stageWidth;
                this._designheight = this._stage._stageHeight;
                this._designw2h    = this._designwidth/this._designheight;

                this._canvas = canvas;
                this._canvas.node["width"] = this._stage._stageWidth;
                this._canvas.node["height"] = this._stage._stageHeight;

                this._canvascontainer = d$.query("<div></div>")[0];
                this._canvascontainer.id = this._canvas.id+"_container";
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

            private createui(){
                if(this._stage.options.ui===true){
                    this._canvasui = d$.query("<div'></div>")[0];
                    this._canvasui.id = this._canvas.id+"_ui";
                    this._canvasui.css({position:"absolute",overflow: "hidden",width:"100%",height:"100%"});
                    this._canvasui.insertBefore(this._canvas)
                }

                if(typeof this._stage.options.ui == "string"){
                    this._canvasui = d$.query("#"+this._stage.options.ui)[0];
                    if(this._canvasui){
                        this._canvasui.id = this._stage.options.ui;
                        this._canvasui.insertBefore(this._canvas);
                        this._canvasui.css({position:"absolute",overflow: "hidden",width:"100%",height:"100%"});
                    }
                }

                if(this._canvasui){
                    if(this.canvas.index()){
                        this._canvasui.css({"z-index":Math.add(this.canvas.index(),1)})
                    }else{
                        this._canvasui.css({"z-index":1})
                    }
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

            private mainloop():void {
                (<any>this._stage)._enterframe();
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
                    this._stage._stageHeight = this._designheight;
                    this._stage._stageWidth = this._stage._stageHeight*currstylew2h;
                }else{
                    this._stage._stageWidth = this._designwidth;
                    this._stage._stageHeight = this._stage._stageWidth/currstylew2h;
                }

                this._stage.emit(Stage.RESIZE);

                this._canvas.node["width"] = this._stage._stageWidth;
                this._canvas.node["height"] = this._stage._stageHeight;
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

            public get stage():Stage{
                return this._stage;
            }

            public get containerStyleW2h():number{
                return toValue(this._canvas.abscss().width)/toValue(this._canvas.abscss().height)
            }
        }
    }
}