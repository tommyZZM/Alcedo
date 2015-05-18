/**
 * Created by tommyZZM on 2015/5/17.
 * 重构指南
 * 所有界面组件动画能够用CSS实现就尽量用CSS
 *
 */
module game{
    export import canvas = alcedo.canvas;
    export import dom = alcedo.dom;
    export import net = alcedo.net;

    export var stage:canvas.Stage;

    export class MainCycler extends alcedo.AppCycler{
        protected stage:canvas.Stage;

        protected cmdStartup(){

            //初始化GameStage
            this.stage = new alcedo.canvas.Stage(dom.query("#colorjet")[0],640,480,{
                background:"#8edced",
                profiler:true,
                orient:true,
                ui:"colorjet-ui"
            });
            stage = this.stage;

            dom.resize(this.onResize,this);

            alcedo.core(GUIManager).startUp();

            alcedo.core(net.AsyncAssetsLoader).addEventListener(net.AsyncRESEvent.ASSETS_COMPLETE,this.onAssetLoaded,this);
            alcedo.core(net.AsyncAssetsLoader).addConfig("res/resource.json");
            alcedo.core(net.AsyncAssetsLoader).loadGroup("preload","bgcloud","fgcloud","levels","character");
        }

        //资源加载完成
        private onAssetLoaded(){
            trace("loadcomplete");
            alcedo.core(GameCycler).startUp();
            alcedo.core(GUIManager).toggleToScreen("start");
        }

        //屏幕适配解决方案
        private onResize(){
            var _domwidth = alcedo.dom.width();
            var _domheight = alcedo.dom.height();

            this.stage.canvas.css({width:_domwidth+"px",height:_domheight+"px"});
            //trace(this.stage.orientchanged)
            if(this.stage.orientchanged){
                this.stage.canvas.css({width:_domheight+"px",height:_domwidth+"px"});
                this.stage.container.css({
                    width:_domheight+"px",
                    height:_domwidth+"px"
                });
                this.stage.container.css({left:(_domwidth-_domheight)/2+"px"});
                this.stage.container.css({top:(_domheight-_domwidth)/2+"px"});
                this.stage.container.css_transform_rotate(-90)
            }else{
                this.stage.container.css({width:_domwidth+"px",height:_domheight+"px"});
                this.stage.container.css({top:"0px",left:"0px"});
                this.stage.container.css_transform_rotate(0)
            }
            this.stage.resizecontext();
            //trace(this.stage.orientchanged)
        }
    }

    export class client{
        public static get width():number{
            if(dom.height()>dom.width()){
                return dom.height()
            }
            return dom.width()
        }

        public static get height():number{
            if(dom.height()>dom.width()){
                return dom.width()
            }
            return dom.height()
        }
    }
}