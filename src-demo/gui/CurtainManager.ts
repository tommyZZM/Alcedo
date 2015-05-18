/**
 * Created by tommyZZM on 2015/5/18.
 */
module game{
    export class CurtainManager extends alcedo.AppSubCore{
        private static instanceable = true;

        private curtain:dom.DomElement;
        public startUp(){
            this.curtain = dom.query("#curtain").first;
            this.curtain.css({width:dom.width(),height:dom.height(),background:"black"});
            trace("here",dom.width());
        }

        public show(callback?:Function,delay:number=0){
            this.curtain.css({height:dom.height()});
            TweenMax.to(this.curtain.node,1,{opacity:1,delay:delay,onComplete:()=>{
                if(callback)callback();
            }})
        }

        public hide(callback?:Function,delay:number=0){
            TweenMax.to(this.curtain.node,1,{opacity:0,delay:delay,onComplete:()=>{
                if(callback)callback();
                //trace("cur hrer");
                this.curtain.css({height:0});
            }})
        }
    }
}