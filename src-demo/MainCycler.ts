/**
 * Created by tommyZZM on 2015/5/17.
 */
module game{
    export import canvas = alcedo.canvas;
    export import dom = alcedo.dom;

    export class MainCycler extends alcedo.AppCycler{
        protected canvas:dom.DomElement;
        protected stage:canvas.Stage;

        protected cmdStartup(){
            this.canvas = alcedo.d$.query("#colorjet")[0];

            //≥ı ºªØGameStage
            this.stage = new alcedo.canvas.Stage(this.canvas,640,480,{
                background:"#ecf0f1",
                profiler:true,
                orient:true,
                ui:"colorjet-ui"
            });

            alcedo.d$.resize(this.onResize,this);
        }

        private onResize(){
            var _domwidth = alcedo.dom.width();
            var _domheight = alcedo.dom.height();

            this.canvas.css({width:_domwidth+"px",height:_domheight+"px"});
            this.stage.resizecontext();
        }
    }
}