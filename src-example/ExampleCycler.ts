/**
 * Created by tommyZZM on 2015/4/25.
 */
module example {
    export class ExampleCycler extends alcedo.AppCycler {
        private canvas:alcedo.dom.DomElement;
        protected stage:alcedo.canvas.Stage;

        protected size = {
            width:320,
            height:480
        };

        protected cmdStartup() {
            alcedo.d$.ready(this.onDomReady, this);
        }

        private onDomReady(){
            alcedo.d$.query("body")[0].css({margin:0,padding:0,border: 0});
            this.canvas = alcedo.d$.query("#aperturetest1")[0];

            this.stage = new alcedo.canvas.Stage(alcedo.d$.query("#aperturetest1")[0],this.size.width,this.size.height,{
                background:"#ecf0f1",
                profiler:true
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
            this.run();
        }

        protected run(){

        }
    }

}