/**
 * Created by tommyZZM on 2015/4/11.
 */
module alcedo {
    export module canvas {
        /**
         * 当前canvas配置熟悉显示
         */
        export class Profiler extends AppObject {
            private _maincontext:CanvasMainContext;

            private _profilerdiv:dom.DomElement;

            public constructor(context:CanvasMainContext){
                super();
                this._maincontext = context;

                this._profilerdiv = dom.query(
                    "<div style='font-family:Microsoft Yahei;background-color: black;opacity: 0.6;color: #fff;line-height: 1.3;padding: 3px'>" +
                    "<p style='margin: 0;'>FPS:<span class='fps'>60</span></p>" +
                    "<p style='margin: 0;'>Canvas</p>"+
                    "</div>")[0];
                this._profilerdiv.css({position:"absolute"});

                this._profilerdiv.addClass(canvasStyleClass.alcedo_canvas_profiler);
                //this._profilerdiv.id = this._maincontext.canvas.id+"_profiler";

                this._maincontext.stage.addEventListener(Stage.ENTER_SECOND,this.update,this);

                this.visible = false;
                this._maincontext.container.prependChild(this._profilerdiv);
            }

            public set visible(visible:boolean){
                if(visible){
                    this._profilerdiv.show();
                }else{
                    this._profilerdiv.hide();
                }
            }

            private update(e:any){
                //trace(e.fps);
                this._profilerdiv.find(".fps")[0].innerContent(e.fps)
            }
        }
    }
}