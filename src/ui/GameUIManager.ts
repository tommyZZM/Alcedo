/**
 * Created by tommyZZM on 2015/4/11.
 */
module game{
    /**
     * UI
     */
    export class GameUIManager extends alcedo.AppProxyer{
        private static instanceable = true;

        public constructor(){
            super();
        }

        private _gameui:alcedo.dom.DomElement;
        public gamescreens:Dict;

        public init(){
            trace("GameUIManager init");
            this._gameui = alcedo.d$.query("#apertureui")[0];
            if(!this._gameui)return;
            this.gamescreens = new Dict();

            this.bindScreen("loading",LoadingScreen);

            //alcedo.d$.resize(this.onResize,this);
            this.onResize();
            alcedo.d$.resize(this.onResize,this);
            stage.addEventListener(alcedo.canvas.Stage.RESIZED,this.onResize,this);

            alcedo.addDemandListener(ScreenControl,CmdCatalog.TO_SCREEN,this.resToggleScreen,this);

            alcedo.dispatchCmd(ScreenControl,CmdCatalog.TO_SCREEN,["loading"]);
        }

        public ready(){
            //:加载完资源后执行此方法;
            this.bindScreen("start",StartScreen);
            this.bindScreen("playing",PlayingScreen);
            this.bindScreen("preto",PretoScreen);
            this.bindScreen("over",OverScreen);
        }

        private onResize(){
            var i,ele,width,
                centers:any = this._gameui.find(".center");
            for(i=0;i<centers.length;i++){
                ele = centers[i];
                width = ele.node.style.width?ele.node.style.width:ele.abscss()["width"];
                if(width==="auto")width = 0;
                width = alcedo.toValue(width);
                //trace("onResize",alcedo.toValue(width));
                ele.transition = 0;
                ele.css({left:(stageSize().width-width)/2+"px"})
            }

            this.gamescreens.forEach((screen)=>{
                //trace(screen.resize)
                screen.resize();
            })
        }

        private bindScreen(classname:string,screenClass:any){
            var screen = alcedo.d$.query("#apertureui")[0].find(".screen."+classname)[0];
            if(screen) {
                new screenClass(screen, this._gameui, screen.styleClass[1]);
            }else{
                warn("bindScreen fail",screenClass)
            }
        }

        private _currscreen:GameScreen;
        private resToggleScreen(data:any){
            var screenname = data.screenname;
            var screen = this.gamescreens.get(screenname);
            //trace("resToggleScreen",data,screen,this._currscreen == screen.hashIndex)

            if(!screen){
                warn("no such screen",data,screenname)
                return;
            }
            if(this._currscreen){

                if(this._currscreen.hashIndex == screen.hashIndex){return;}
                //alcedo.d$.query("#curtain")[0].removeClass("disactive");
                this._currscreen.disactive(()=>{
                    //alcedo.d$.query("#curtain")[0].addClass("disactive");
                    this._currscreen = screen;
                    trace("this._currscreen.disactive",this._currscreen,screen);
                    screen.active(data);
                });
            }else{
                screen.active(data);
                this._currscreen = screen;
            }
        }
    }

    export class GameScreen extends alcedo.EventDispatcher{
        public static ACTIVE:string = "GameScreen_Active";
        public static DISACTIVE:string = "GameScreen_Active";

        protected _isactive:boolean;

        private _root:alcedo.dom.DomElement;
        private _screen:alcedo.dom.DomElement;

        public constructor(screen:alcedo.dom.DomElement,root,name:string){
            super();
            this._screen = screen;
            this._screen.data("name",name);
            alcedo.proxy(GameUIManager).gamescreens.set(name,this);
            this._root = root;
            screen.index = 10
            //trace("aaa")
            this.init();
        }

        protected get screen():alcedo.dom.DomElement{
            return this._screen;
        }

        protected get root():alcedo.dom.DomElement{
            return this._root;
        }

        protected init(){

        }

        public active(data?:any){
            this._isactive = true;
            this.emit(GameScreen.ACTIVE,this.screen.data(name));
            //overridren
        }

        public disactive(callback:Function,thisObject?:any){
            this._isactive = false;
            this.emit(GameScreen.DISACTIVE,this.screen.data(name));
            //overridren
        }

        public resize(){

        }
    }

    export function stageSize():{width:number;height:number}{
        return {
            width:alcedo.toValue(stage.canvas.node.style.width||stage.canvas.abscss().width),
            height:alcedo.toValue(stage.canvas.node.style.height||stage.canvas.abscss().height)
        }
    }
}