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

        public show(){
            this.curtain.css({height:dom.height()});
        }

        public hide(callback?:Function){
            TweenMax.to(this.curtain.node,1,{opacity:0,onComplete:()=>{
                callback();
                this.curtain.css({height:0});
            }})
        }
    }
}