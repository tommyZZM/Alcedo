/**
 * Created by tommyZZM on 2015/4/14.
 */
module game{
    /**
     * 游戏开始界面
     */
    export class StartScreen extends GameScreen{
        private _startbtnpos:number;

        private _title:GameUIComponent;
        private _startbtn:GameButton;
        private _aboutbtn:GameButton;

        protected init() {
            this.screen.hide();
            this._title = new GameUIComponent(this.screen.find(".title")[0],TextureRepository().get("title"));
            this._title.e.css({"margin-top":alcedo.px(-this._title.height)});
            this._title.e.show();

            this._startbtn = new GameButton(this.screen.find(".btn.startgame")[0],
                TextureRepository().get("startbtn"));

            this._aboutbtn = new GameButton(this.screen.find(".btn.about")[0],
                TextureRepository().get("aboutbtn"));
            this._startbtn.e.css({top:alcedo.px(stageSize().height)}).hide();
            this._aboutbtn.e.css({top:alcedo.px(stageSize().height)}).hide();

            this.resize();
        }

        public active(){
            super.active();

            this.screen.show();
            //TODO:why?where? why need then
            this._title.e.to({"margin-top": alcedo.px(stageSize().height * 0.08)}, 360).then(()=> {//TODO:screen index????
                //trace("transionend",this.screen.index(),this._startbtn.e);
                this._startbtn.e.show().to({"margin-top": alcedo.px(-10), top: 0}, 360)
                    .then(()=> {
                        //trace("transionend", this.screen.index());
                        this._startbtn.e.to({"margin-top": alcedo.px(10), top: 0}, 320)
                            .then(()=> {
                                this._startbtn.e.to({"margin-top": 0, top: 0}, 300);
                                this.enableTouch();
                                //trace(this.className, "actived", this.screen.index())
                            });
                        this._aboutbtn.e.show().to({top: 0}, 320)
                    });
            });
        }

        public disactive(callback:Function,thisObject?:any){
            super.disactive(callback,thisObject);
            this.enableTouch(false);

            this._title.e.to({"margin-top":alcedo.px(-this._title.height)},260);
            this._startbtn.e.to({top:alcedo.px(stageSize().height)},260);
            this._aboutbtn.e.to({top:alcedo.px(stageSize().height)},260).then(()=>{
                this.screen.hide();
                callback.apply(thisObject);
            });
        }

        private enableTouch(boo:boolean=true){
            if(boo){
                this._startbtn.e.addEventListener(alcedo.dom.TouchEvent.TOUCH_TAP,this.toStart,this);
                this._aboutbtn.e.addEventListener(alcedo.dom.TouchEvent.TOUCH_TAP,this.toAbout,this);
            }else{
                this._startbtn.e.removeEventListener(alcedo.dom.TouchEvent.TOUCH_TAP,this.toStart,this);
                this._aboutbtn.e.removeEventListener(alcedo.dom.TouchEvent.TOUCH_TAP,this.toAbout,this);
            }
        }

        private toStart(){
            this._startbtn.e.then(()=>{
                trace("toStart");
                alcedo.dispatchCmd(ScreenControl,CmdCatalog.TO_SCREEN,["prepare"]);
            })
        }

        private toAbout(){
            this._aboutbtn.e.then(()=>{
                trace("toAbout");
                alcedo.dispatchCmd(ScreenControl,CmdCatalog.TO_SCREEN,["about"]);
            })
        }


        public resize(){
            this._title.width = stageSize().height*0.9;
            this._startbtn.width = stageSize().height*0.5;
            this._aboutbtn.width = stageSize().height*0.3;

            if(this._isactive){
                this._title.e.to({"margin-top":alcedo.px(stageSize().height*0.08)},360)
            }else{
                this._title.e.to({"margin-top":alcedo.px(-this._title.height)},260);
                this._startbtn.e.to({top:alcedo.px(stageSize().height)},260);
                this._aboutbtn.e.to({top:alcedo.px(stageSize().height)},260);
            }

            this._startbtnpos = stageSize().height*0.29;



            //this._startbtn.e.to({"margin-top":alcedo.px(this._startbtnpos),top:0},100)
        }
    }
}