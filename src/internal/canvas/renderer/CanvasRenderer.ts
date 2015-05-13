/**
 * Created by tommyZZM on 2015/4/5.
 */
module alcedo{
    export module canvas{
        export class CanvasRenderer extends AppProxyer{
            public static MainLoop:string = "CanvasRenderer_MainLoop";

            protected _stage:Stage;
            protected _canvas:HTMLCanvasElement;
            protected _canvasRenderContext:any;

            protected _renderoption:any;

            protected _mainlooptask:Dict;

            public constructor(){
                super();
                this._mainlooptask = new Dict();
            }

            protected render(){
                //TODO:绘制canvas
            }

            public executeMainLoop(stage:Stage,canvas:HTMLCanvasElement):void {
                //this._stage = stage;
                //this._canvas = <any>stage.canvas;
            }

            public clearScreen() {

            }

            public registMainLoopTask(task:Function, thisObject:any,priority?:number){
                this.registNotify(this._mainlooptask,CanvasRenderer.MainLoop,task,thisObject,null,priority);
            }

            public unregistMainLoopTask(task:Function, thisObject:any){
                this.unregistNotify(this._mainlooptask,CanvasRenderer.MainLoop,task,thisObject);
            }

            public setTransform(matrix:Matrix2D){

            }

            public get context(){
                return this._canvasRenderContext
            }

            public set smooth(flag:boolean){

            }

            public static detecter():CanvasRenderer{
                var webglsupport:boolean = ( function () {
                    try {
                        var canvas = document.createElement( 'canvas' );
                        return !! window["WebGLRenderingContext"] && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );
                    } catch( e ) {
                        return false;
                    }
                })();

                if(webglsupport){
                    //return a$.savaProxy(new );
                }else{
                    //return new Context2DRenderer(width,height,args);
                }
                return new Context2DRenderer();
            }
        }
    }

}