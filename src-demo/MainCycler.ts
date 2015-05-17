/**
 * Created by tommyZZM on 2015/5/17.
 * 重构指南
 * 所有界面组件动画能够用CSS实现就尽量用CSS
 *
 */
module game{
    export import canvas = alcedo.canvas;
    export import dom = alcedo.dom;

    export class MainCycler extends alcedo.AppCycler{
        protected canvas:dom.DomElement;
        protected stage:canvas.Stage;

        protected cmdStartup(){
            this.canvas = alcedo.d$.query("#colorjet")[0];

            //初始化GameStage
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

            if(this.stage.orientchanged){
                this.canvas.css({width:_domheight+"px",height:_domwidth+"px"});
                this.canvas.parent().css({
                    width:_domheight+"px",
                    height:_domwidth+"px"
                });
                this.canvas.parent().css({left:(_domwidth-_domheight)/2+"px"});
                this.canvas.parent().css({top:(_domheight-_domwidth)/2+"px"});
                this.canvas.parent().rotate(-90)
            }else{
                this.canvas.parent().css({width:_domwidth+"px",height:_domheight+"px"});
                this.canvas.parent().css({top:"0px",left:"0px"});
                this.canvas.parent().rotate(0)
            }
        }
    }
}