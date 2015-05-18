/**
 * Created by tommyZZM on 2015/5/18.
 */
module game{
    export class GUIScreen extends alcedo.EventDispatcher{

        public _ele:dom.DomElement;
        public set ele(ele:dom.DomElement){
            if(!this._ele){
                this._ele = ele;
            }
        }
        public get ele():dom.DomElement{
            return this._ele;
        }

        public show(callback?:Function){

        }

        public hide(callback:Function){

        }

        protected onresize(){

        }

    }
}