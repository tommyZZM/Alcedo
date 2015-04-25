/**
 * Created by tommyZZM on 2015/4/25.
 */
module demo {
    export var stage:alcedo.canvas.Stage;

    export class ExampleCycler extends alcedo.AppCycler {
        private canvas:alcedo.dom.DomElement;
        private stage:alcedo.canvas.Stage;

        protected cmdStartup() {
            alcedo.d$.ready(this.onDomReady, this);
        }

        private onDomReady(){
            alcedo.d$.query("body")[0].css({margin:0,padding:0,border: 0});
            this.canvas = alcedo.d$.query("#aperturetest1")[0];

            this.stage = new alcedo.canvas.Stage(alcedo.d$.query("#aperturetest1")[0],320,480,{
                background:"#ecf0f1",
                profiler:true
            });
            stage = this.stage;

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

            alcedo.proxy(alcedo.net.AsyncAssetsLoader)
                .addEventListener(alcedo.net.AsyncRES.ASSETS_COMPLETE,this.onAssetLoaded,this);
            alcedo.proxy(alcedo.net.AsyncAssetsLoader).addConfig("res/resource.json");
            alcedo.proxy(alcedo.net.AsyncAssetsLoader).loadGroup("preload")
        }

        private onAssetLoaded(){
            this.run();
        }

        protected run(){

        }
    }

    export function AsyncRES():alcedo.net.AsyncAssetsRepository{
        return alcedo.proxy(alcedo.net.AsyncRES)
    }

    export function MovieClipRepository():alcedo.canvas.MovieClipRepository{
        return alcedo.proxy(alcedo.canvas.MovieClipRepository);
    }
    export function TextureRepository():alcedo.canvas.TextureRepository{
        return alcedo.proxy(alcedo.canvas.TextureRepository)
    }
}