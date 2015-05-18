/**
 * Created by tommyZZM on 2015/5/18.
 */
module game{
    export class GUIButton{
        private _ele:dom.DomElement;
        public constructor(ele:dom.DomElement){
            this._ele = ele;
            this._ele.addEventListener(dom.TouchEvent.TOUCH_BEGIN,this.onTouchBegin,this);
            this._ele.addEventListener(dom.TouchEvent.TOUCH_END,this.onTouchEnd,this);
        }

        private onTouchBegin(){
            //trace("hrer");//
            TweenMax.to(this._ele.node,0.2,{scale:0.8});
        }

        private onTouchEnd(){
            TweenMax.to(this._ele.node,0.2,{scale:1});
        }

        public destruct(){
            this._ele.removeEventListener(dom.TouchEvent.TOUCH_BEGIN,this.onTouchBegin,this);
            this._ele.removeEventListener(dom.TouchEvent.TOUCH_END,this.onTouchEnd,this);
        }

        public get ele():dom.DomElement{
            return this._ele
        }

        public get node():HTMLElement{
            return this._ele.node;
        }
    }
}