/**
 * Created by tommyZZM on 2015/4/7.
 * a easy demo for alcedo frame work;
 */
module game{
    export var stage:alcedo.canvas.Stage;

    export class ColourJetCyc extends alcedo.AppCycler{
        private canvas:alcedo.dom.DomElement;
        private stage:alcedo.canvas.Stage;

        protected cmdStartup(){
            alcedo.d$.ready(this.onDomReady,this);
        }

        private onDomReady(){
            alcedo.d$.query("body")[0].css({margin:0,padding:0,border: 0});
            this.canvas = alcedo.d$.query("#aperturetest1")[0];

            this.stage = new alcedo.canvas.Stage(alcedo.d$.query("#aperturetest1")[0],480,320,{
                background:"#16a085",
                orient:true,
                profiler:true,
                ui:"apertureui"
            });
            stage = this.stage;

            this.canvas.css(
                {display: "block",width:alcedo.dom.width()+"px",height:alcedo.dom.height()+"px",padding:0,border:0,margin:"0 auto"});
            this.canvas.parent().css(
                {display: "block",position:"relative",width:alcedo.dom.width()+"px",height:alcedo.dom.height()+"px",padding:0,border:0,margin:"0"});
            alcedo.d$.resize(this.onResize,this);

            //加载资源 //TODO:加载界面;
            alcedo.proxy(AsyncAssetsLoader).addEventListener(alcedo.net.AsyncRESEvent.ASSETS_COMPLETE,this.onAssetLoaded,this);
            alcedo.proxy(alcedo.net.AsyncAssetsLoader).addConfig("res/resource.json");
            alcedo.proxy(alcedo.net.AsyncAssetsLoader).loadGroup("preload","bgcloud","levels");
        }

        private onAssetLoaded(){
            alcedo.proxy(GroundManager).init(this.stage);
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

    export var AsyncAssetsLoader:any = alcedo.net.AsyncAssetsLoader;
    //export var AsyncRES:any = alcedo.net.AsyncRES;

    export function TextureRepository():alcedo.canvas.TextureRepository{
        return <any>alcedo.proxy(alcedo.canvas.TextureRepository);
    }

    export function AsyncRES():alcedo.net.AsyncRES{
        return alcedo.proxy(alcedo.net.AsyncRES);
    }

}