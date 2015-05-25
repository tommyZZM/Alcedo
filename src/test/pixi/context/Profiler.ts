/**
 * Created by tommyZZM on 2015/4/11.
 */
module alcedo {
    export class Profiler extends AppObject {
        private _maincontext:MainContext;

        private _profilerdiv:dom.DomElement;

        private _rendertype:dom.DomElement;

        public constructor(context:MainContext){
            super();
            this._maincontext = context;

            this._profilerdiv = dom.query(
                "<div style='font-family:Microsoft Yahei;background-color: black;opacity: 0.6;color: #fff;line-height: 1.3;padding: 3px'>" +
                "<p style='margin: 0;'>FPS:<span class='fps'>60</span></p>" +
                "<p style='margin: 0;' class='rendertype'>...</p>"+
                "</div>")[0];
            this._profilerdiv.css({position:"absolute"});
            this._profilerdiv.addClass(canvasStyleClass.alcedo_canvas_profiler);
            this.visible = false;

            this._maincontext.stage.addEventListener(Stage.ENTER_MILLSECOND10,this.update,this);
            this._maincontext.container.prependChild(this._profilerdiv);

            this._rendertype = this._profilerdiv.find(".rendertype")[0];
        }

        public set renderType(renderer:PIXI.SystemRenderer|any){
            if(renderer instanceof PIXI.CanvasRenderer){
                this._rendertype.innerContent("Pixi Canvas")
                return;
            }
            if(renderer instanceof PIXI.WebGLRenderer){
                this._rendertype.innerContent("Pixi WebGL");
                //return;
            }
        }

        public set visible(visible:boolean){
            if(visible){
                this._profilerdiv.show();
            }else{
                this._profilerdiv.hide();
            }
        }

        private _updatedelay:number = 0;
        private update(e:any){
            this._updatedelay++;
            if(this._updatedelay<20){
                return;
            }
            this._updatedelay = 0;
            this._profilerdiv.find(".fps")[0].innerContent(e.fps)
        }
    }
}