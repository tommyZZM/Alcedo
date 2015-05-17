/**
 * Created by tommyZZM on 2015/4/5.
 */
module alcedo{
    export module canvas{
        export class Context2DRenderer extends CanvasRenderer{
            public constructor(){
                super();
            }

            protected render(){
                //transform
                this._stage._transform();
                this._canvasRenderContext.setTransform(1,0,0,1,0,0);//重置canvas的transform
                this._canvasRenderContext.globalAlpha = 1;
                this._canvasRenderContext.globalCompositeOperation = "source-over";

                if(this._renderoption.background){
                    this._canvasRenderContext.fillStyle = this._renderoption.background;
                    this._canvasRenderContext.fillRect(0,0,this._stage.stageWidth,this._stage.stageHeight);
                }else{
                    this._canvasRenderContext.clearRect(0,0,this._stage.stageWidth,this._stage.stageHeight);
                }

                //render
                //this._stage._debugdraw(this);
                this._stage.render(this);

                AppNotifyable.notify(this._mainlooptask,CanvasRenderer.MainLoop,[this]);

                animationFrame(this.render,this);
            }

            public setTransform(matrix:Matrix2D) {
                //在没有旋转缩放斜切的情况下，先不进行矩阵偏移，等下次绘制的时候偏移
                this._canvasRenderContext.setTransform(
                    matrix.a,
                    matrix.b,
                    matrix.c,
                    matrix.d,
                    matrix.tx,
                    matrix.ty);
            }

            /**
             * context 2d
             */
            private _smoothProperty:string;
            public executeMainLoop(stage:Stage,canvas:HTMLCanvasElement):void {
                this._stage = stage;
                this._canvas = canvas;
                this._canvasRenderContext = this._canvas.getContext("2d");

                this._renderoption = this._stage._options;
                //TODO:判断option是否合法

                //使用平滑设置
                if("imageSmoothingEnabled" in this._canvasRenderContext){
                    this._smoothProperty = "imageSmoothingEnabled";
                }
                else if("webkitImageSmoothingEnabled" in this._canvasRenderContext) {
                    this._smoothProperty = "webkitImageSmoothingEnabled";
                }
                else if("mozImageSmoothingEnabled" in this._canvasRenderContext) {
                    this._smoothProperty = "mozImageSmoothingEnabled";
                }
                else if("oImageSmoothingEnabled" in this._canvasRenderContext) {
                    this._smoothProperty = "oImageSmoothingEnabled";
                }
                else if ("msImageSmoothingEnabled" in this._canvasRenderContext) {
                    this._smoothProperty = "msImageSmoothingEnabled";
                }

                //混合设置
                this._canvasRenderContext.globalCompositeOperation = "source-over";
                this.smooth = true;

                animationFrame(this.render,this);
            }

            public set smooth(flag:boolean){
                this._canvasRenderContext[this._smoothProperty] = flag;
            }

            public clearScreen() {
                this._canvasRenderContext.clear()
            }


        }
    }
}