/**
 * Created by tommyZZM on 2015/5/18.
 */
module game{
    export class GUIScreen extends alcedo.EventDispatcher{

        public _ele:dom.DomElement;
        public set ele(ele:dom.DomElement){
            if(!this._ele){
                this._ele = ele;
                this.startUp()
            }
        }
        public get ele():dom.DomElement{
            return this._ele;
        }

        protected startUp(){

        }

        public show(callback?:Function){
            if(callback)callback();
        }

        public hide(callback:Function){
            callback();
        }

        protected onresize(){

        }

    }
}