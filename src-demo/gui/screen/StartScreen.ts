/**
 * Created by tommyZZM on 2015/5/18.
 */
module game{
    export class StartScreen extends GUIScreen{

        private _title:dom.DomElement;
        private _startbtn:GUIButton;
        private _aboutbtn:GUIButton;

        public startUp(){
            this._title = dom.query(".start .title").first;
            this._startbtn = new GUIButton(dom.query(".btn.start").first);
            this._aboutbtn = new GUIButton(dom.query(".btn.about").first);

            this._title.css({top:-100});
            this._startbtn.ele.css({top:100+screen.height});
            this._aboutbtn.ele.css({top:100+screen.width});

            this._startbtn.ele.addEventListener(dom.TouchEvent.TOUCH_TAP,this.onstart,this);
        }

        private onstart(){
            alcedo.core(GUICycler).toggleToScreen("playing");
            alcedo.core(CurtainManager).show(()=>{
               //TODO:发送开始游戏信号
                alcedo.dispatchCmd(GameState,GameState.PREPLAY);
                alcedo.core(CurtainManager).hide(()=>{
                    alcedo.dispatchCmd(GameState,GameState.PLAYING);
                },0.2)
            },0.8);

        }

        public show(callback){
            var titletop = screen.height/2-(alcedo.toValue(this._title.attr("height"))*1.3);
            trace(screen.height/2,alcedo.toValue(this._title.attr("height")))

            TweenMax.to(this._title.node,0.39,{top:titletop});
            TweenMax.to(this._startbtn.node,1,{top:titletop-6,delay:0.3,ease:Elastic.easeOut.config(0.9, 0.8)});
            TweenMax.to(this._aboutbtn.node,1,{top:titletop,delay:0.6,ease:Elastic.easeOut.config(0.9, 0.8),onComplete:()=>{
                if(callback)callback();
            }});//

            stage.addEventListener(canvas.Stage.RESIZED,this.onresize,this)
            //trace(Elastic.easeOut)
            //TweenLite.to(box, 2.5, { ease: Elastic..config(1, 0.3), x: "400%" });
        }

        public hide(callback){
            TweenMax.to(this._title.node,0.3,{top:-100,delay:0.1});
            TweenMax.to(this._startbtn.node,0.5,{top:100+screen.height,delay:0.3,onComplete:()=>{
                stage.removeEventListener(canvas.Stage.RESIZED,this.onresize,this);
                if(callback)callback();
            },ease:Back.easeIn.config(2)});
            TweenMax.to(this._aboutbtn.node,0.5,{top:100+screen.width,delay:0.2,ease:Back.easeIn.config(2)});
        }

        protected onresize(){
            trace("resize")
            var titletop = screen.height/2-(alcedo.toValue(this._title.attr("height"))*1.3);
            TweenMax.to(this._title.node,0.5,{top:titletop});
            TweenMax.to(this._startbtn.node,0.5,{top:titletop-6});
            TweenMax.to(this._aboutbtn.node,0.5,{top:titletop});//
        }
    }
}