/**
 * Created by tommyZZM on 2015/4/25.
 */
// 当开启GPU渲染时，Chrome的canvas绘制会锁定在30帧（不接电源的时候是这样。）
// 加入要打包成原生应用，首选考虑工具CocoonJS
// Dom元素操作尽量通过add Class操作
//
//
//

module example {
    export import canvas = alcedo.canvas;

    export class ExampleCycler extends alcedo.AppCycler {
        private canvas:alcedo.dom.DomElement;
        protected stage:alcedo.canvas.Stage;

        protected size = {
            width:320,
            height:480
        };

        protected cmdStartup() {
            alcedo.dom.ready(this.onDomReady, this);
        }

        protected onDomReady(){
            //alcedo.d$.query("body")[0].css({margin:0,padding:0,border: 0});
            this.canvas = alcedo.dom.query("#aperturetest1")[0];

            this.stage = new alcedo.canvas.Stage(alcedo.dom.query("#aperturetest1")[0],this.size.width,this.size.height,{
                background:"#ecf0f1",
                profiler:true,
                orient:true,
            });

            this.canvas.css({
                display: "block",
                width:alcedo.dom.width()+"px",
                height:alcedo.dom.height()+"px",
                padding:0,border:0,
                margin:"0 auto"});
            this.canvas.parent().css({
                display: "block",
                position:"relative",
                width:alcedo.dom.width()+"px",
                height:alcedo.dom.height()+"px",
                padding:0,
                border:0,
                margin:"0"
            });
            alcedo.dom.resize(this.onResize,this);

            this.run();
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
                this.canvas.parent().css_transform_rotate(-90)
            }else{
                this.canvas.parent().css({width:_domwidth+"px",height:_domheight+"px"});
                this.canvas.parent().css({top:"0px",left:"0px"});
                this.canvas.parent().css_transform_rotate(0)
            }
        }

        protected run(){

        }
    }

}