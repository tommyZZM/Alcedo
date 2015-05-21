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

        }

        public show(){
            trace("over screen show");

            TweenMax.to(this._homebtn.node,1,{top:0,ease:Elastic.easeOut.config(0.9, 0.8)});
            TweenMax.to(this._restartbtn.node,1,{top:0,delay:0.3,ease:Elastic.easeOut.config(0.9, 0.8)});
        }
    }
}