/**
 * Created by tommyZZM on 2015/5/18.
 */
module game {
    export class OverScreen extends GUIScreen {

        private _btnsgroup:dom.DomElement;
        private _homebtn:GUIButton;
        private _restartbtn:GUIButton;

        public startUp(){
            this._btnsgroup = this._ele.find(".btns")[0];
            this._homebtn = new GUIButton(dom.query(".btn.home").first);
            this._restartbtn = new GUIButton(dom.query(".btn.restart").first);

            this._btnsgroup.css({top:(screen.height-100)/2});
            this._homebtn.ele.css({top:screen.height});
            this._restartbtn.ele.css({top:screen.height});

            this._homebtn.ele.addEventListener(dom.TouchEvent.TOUCH_TAP,this.onhome,this);
            this._restartbtn.ele.addEventListener(dom.TouchEvent.TOUCH_TAP,this.onrestart,this);

        }

        private onhome(){
            this._currbtn = this._homebtn;
            this._otherbtn = this._restartbtn;
            this.hide();
            alcedo.core(CurtainManager).show(()=>{
                alcedo.dispatchCmd(GameState,GameState.HELLO);
                alcedo.core(CurtainManager).hide(()=>{
                    alcedo.core(GUICycler).toggleToScreen("start");
                })
            },0.8);
        }

        private onrestart(){
            this._currbtn = this._restartbtn;
            this._otherbtn = this._homebtn;

            alcedo.core(GUICycler).toggleToScreen("playing");
            alcedo.core(CurtainManager).show(()=>{
                //TODO:发送开始游戏信号
                alcedo.dispatchCmd(GameState,GameState.PREPLAY);
                alcedo.core(CurtainManager).hide(()=>{
                    alcedo.dispatchCmd(GameState,GameState.PLAYING);
                },0.2)
            },0.8);
        }

        public show(){
            trace("over screen show");

            TweenMax.to(this._homebtn.node,1,{top:0,ease:Elastic.easeOut.config(0.9, 0.8)});
            TweenMax.to(this._restartbtn.node,1,{top:0,delay:0.3,ease:Elastic.easeOut.config(0.9, 0.8)});
        }

        private _currbtn;
        private _otherbtn;
        public hide(callback?){
            TweenMax.to(this._currbtn.node,0.6,{top:screen.height,ease:Back.easeIn.config(2)});
            TweenMax.to(this._otherbtn.node,0.7,{top:screen.height,delay:0.1,onComplete:()=>{
                if(callback)callback();
            }});
        }
    }
}