/**
 * Created by tommyZZM on 2015/5/18.
 */
module game{
    export class StartScreen extends GUIScreen{

        private _title:dom.DomElement;
        private _startbtn:dom.DomElement;
        private _aboutbtn:dom.DomElement;

        public constructor(){
            super();
            this._title = dom.query(".start .title").first;
            this._startbtn = dom.query(".btn.start").first;
            this._aboutbtn = dom.query(".btn.about").first;

            this._title.css({top:-100});
            this._startbtn.css({top:100+client.height});
            this._aboutbtn.css({top:100+client.width});

            this._startbtn.node.addEventListener("touchstart",this.onstart.bind(this),true)
        }

        private onstart(){
            alcedo.core(GUIManager).toggleToScreen("playing")
        }

        public show(){
            var titletop = client.height/2-(alcedo.toValue(this._title.attr("height"))*1.3);
            trace(client.height/2,alcedo.toValue(this._title.attr("height")))

            TweenMax.to(this._title.node,0.39,{top:titletop});
            TweenMax.to(this._startbtn.node,1,{top:titletop-6,delay:0.3,ease:Elastic.easeOut.config(0.9, 0.8)});
            TweenMax.to(this._aboutbtn.node,1,{top:titletop,delay:0.6,ease:Elastic.easeOut.config(0.9, 0.8)});//

            stage.addEventListener(canvas.Stage.RESIZED,this.onresize,this)
            //trace(Elastic.easeOut)
            //TweenLite.to(box, 2.5, { ease: Elastic..config(1, 0.3), x: "400%" });
        }

        public hide(callback){
            TweenMax.to(this._title.node,0.6,{top:-100});
            TweenMax.to(this._startbtn.node,0.6,{top:100+client.height});
            TweenMax.to(this._aboutbtn.node,0.6,{top:100+client.width,onComplete:()=>{
                trace(callback)
                stage.removeEventListener(canvas.Stage.RESIZED,this.onresize,this);
                callback();
            }});
        }

        protected onresize(){
            trace("resize")
            var titletop = client.height/2-(alcedo.toValue(this._title.attr("height"))*1.3);
            TweenMax.to(this._title.node,0.5,{top:titletop});
            TweenMax.to(this._startbtn.node,0.5,{top:titletop-6});
            TweenMax.to(this._aboutbtn.node,0.5,{top:titletop});//
        }
    }
}