/**
 * Created by tommyZZM on 2015/4/5.
 */
module alcedo{
    export module canvas{
        export class TouchContext extends EventDispatcher{

            private _stage:Stage;
            private _gasket:dom.DomElement;
            private _canvas:dom.DomElement;

            public constructor(stage:Stage){
                super();
                this._stage = stage;

                this._gasket = stage.gasket;
                this._canvas = stage.canvas;

                this._gasket.addEventListener(alcedo.dom.TouchEvent.TOUCH_BEGIN,this.onTouchBegin,this);
                //TODO:touchmove
                this._gasket.addEventListener(alcedo.dom.TouchEvent.TOUCH_END,this.onTouchEnd,this);
                this._gasket.addEventListener(alcedo.dom.TouchEvent.TOUCH_TAP,this.onTouchTab,this);

            }

            private onTouchBegin(e){
                //trace("onTouchBegin",e);
                this.emitTouchEvent(e,alcedo.canvas.TouchEvent.TOUCH_BEGIN);
            }

            private onTouchEnd(e){
                //trace("onTouchEnd",e);
                this.emitTouchEvent(e,alcedo.canvas.TouchEvent.TOUCH_END);
            }

            private onTouchTab(e){
                //trace("onTouchTab",e);
                this.emitTouchEvent(e,alcedo.canvas.TouchEvent.TOUCH_TAP);
            }


            private emitTouchEvent(e,evnet:string){
                var touchseedling = TouchEvent.createSimpleTouchEvent(e.identifier,e.pageX,e.pageY);
                this._stage.emit(evnet,touchseedling)
            }
        }
    }

}