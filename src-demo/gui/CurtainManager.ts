/**
 * Created by tommyZZM on 2015/5/18.
 */
module game{
    export class CurtainManager extends alcedo.AppSubCore{
        private static instanceable = true;

        private curtain:dom.DomElement;
        public startUp(){
            this.curtain = dom.query("#curtain").first;
            this.curtain.css({width:screen.width,height:screen.height,background:"black"});
        }

        public show(callback?:Function,delay:number=0){
            this.curtain.css({height:screen.height});
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