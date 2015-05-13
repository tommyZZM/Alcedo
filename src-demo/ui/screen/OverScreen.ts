/**
 * Created by tommyZZM on 2015/5/6.
 */
module game {
    /**
     * 游戏结束界面
     */
    export class OverScreen extends GameScreen {
        private _restartbtn:GameButton;

        private _tohomebtn:GameButton;

        protected init() {
            this.screen.hide();

            this._tohomebtn = new GameButton(this.screen.find(".btn.tohome")[0],
                TextureRepository().get("homebtn"));
            //this._tohomebtn.e.transition = 260;
            this._tohomebtn.e.css({top:alcedo.px(stageSize().height+100)});

            this._restartbtn = new GameButton(this.screen.find(".btn.restart")[0],
                TextureRepository().get("restartbtn"));
            //this._restartbtn.e.transition = 260;
            this._restartbtn.e.css({top:alcedo.px(stageSize().height+100)});

            //this.screen.addClass("disactive");
            this.screen.show();

            this.resize();
        }

        public active() {
            super.active();
            //this.screen.show();
            //this.screen.removeClass("disactive");
            this._restartbtn.e.to({top: alcedo.percent(48)}, 360).then(()=>{
                this._restartbtn.e.to({top: alcedo.percent(52)}, 360).then(()=>{
                    this._restartbtn.e.to({top: alcedo.percent(50)}, 360)
                });

                this._tohomebtn.e.to({top: alcedo.percent(48)}, 360).then(()=>{
                    this._tohomebtn.e.to({top: alcedo.percent(52)}, 360).then(()=>{
                        this._tohomebtn.e.to({top: alcedo.percent(50)}, 360)
                        this.enableTouch(true);
                    })
                })
            })
        }

        public disactive(callback:Function,thisObject?:any) {
            super.disactive(callback,thisObject);

            this._tohomebtn.e.to({top:alcedo.px(stageSize().height+100)}, 260).then(()=>{
                this._restartbtn.e.to({top:alcedo.px(stageSize().height+100)}, 260).then(()=>{
                    //this.screen.hide();
                    this.enableTouch(false);
                    callback.apply(thisObject);

                })
            });
        }

        private enableTouch(boo:boolean=true){
            if(boo){
                this._restartbtn.e.addEventListener(alcedo.dom.TouchEvent.TOUCH_TAP,this.toReStart,this);
                this._tohomebtn.e.addEventListener(alcedo.dom.TouchEvent.TOUCH_TAP,this.toHome,this);
            }else{
                this._restartbtn.e.removeEventListener(alcedo.dom.TouchEvent.TOUCH_TAP,this.toReStart,this);
                this._tohomebtn.e.removeEventListener(alcedo.dom.TouchEvent.TOUCH_TAP,this.toHome,this);
            }
        }

        private toHome(){
            alcedo.dispatchCmd(GameStateControl,CmdCatalog.STATE_RESET_TO_HELLO);
            alcedo.dispatchCmd(ScreenControl,CmdCatalog.TO_SCREEN,["preto",{stateto:CmdCatalog.STATE_HELLO}]);
            //this._restartbtn.e.then(()=>{
            //    //todo:alcedo.dispatchCmd(RESTART)
            //
            //})
        }

        private toReStart(){
            alcedo.dispatchCmd(ScreenControl,CmdCatalog.TO_SCREEN,["preto",{stateto:CmdCatalog.STATE_PREPARE_PLAY}]);
            //this._restartbtn.e.then(()=>{
            //    //todo:alcedo.dispatchCmd(RESTART)
            //
            //})
        }
    }
}