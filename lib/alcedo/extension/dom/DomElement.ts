/**
 * Created by tommyZZM on 2015/4/6.
 */
module alcedo {
    export module dom {
        export class DomElement extends EventDispatcher{

            private _node:HTMLElement;

            private _apid:number;

            private _designedcss:any;

            private _domEventnotify:Dict;

            public constructor(ele:HTMLElement) {
                super();
                this._node = ele;//this.init(selector);
                if(this._node){
                    this._apid = +(ele.getAttribute("data-"+_elemark));
                    this._designedcss = this.abscss();
                    this._domEventnotify = new Dict();
                    if(this.tagname!="body")this.initevent();
                }

            }

            private initevent(){
                var touchcallback = (e,fn)=>{
                    e.preventDefault();
                    e.stopPropagation()
                    fn.call(this,e);
                };

                this._node.addEventListener("mousedown",(e)=>{touchcallback(e,this._onmouse)},false);
                this._node.addEventListener("mouseup",(e)=>{touchcallback(e,this._onmouse)},false);
                this._node.addEventListener("click",(e)=>{touchcallback(e,this._onmouse)},false);
                this._node.addEventListener("mouseenter",(e)=>{touchcallback(e,this._onmouse)},false);
                this._node.addEventListener("mouseleave",(e)=>{touchcallback(e,this._onmouse)},false);
                this._node.addEventListener("touchstart",(e)=>{touchcallback(e,this.ontouchbegin)},false);
                this._node.addEventListener("touchmove",(e)=>{touchcallback(e,this.ontouchmove)},false);
                this._node.addEventListener("touchend",(e)=>{touchcallback(e,this.ontouchend)},false);
                this._node.addEventListener("touchcancel",(e)=>{touchcallback(e,this.ontouchend)},false);
                this._node.addEventListener("tap",(e)=>{touchcallback(e,this.ontouchtap)},false);


                this._node.addEventListener("DOMSubtreeModified",this._onmodified.bind(this));

                this._node.addEventListener('transitionend',this._oncsstransitionend.bind(this),false);
            }

            /**
             * Event
             **/
            /**
             * Touch事件
             **/
            private _touchObserver:any;
            private ontouchbegin(e){
                this._touchObserver = {
                    startx:e.touches[0].clientX,
                    starty:e.touches[0].clientY,
                    ctrlKey:e.ctrlKey,
                    altKey:e.altKey,
                    shiftKey:e.shiftKey,
                    touchDown:true
                };
                this.emit(TouchEvent.TOUCH_BEGIN);
            }

            private ontouchmove(e){
                //if (Math.abs(e.touches[0].clientX - this._touchObserver.startx) > 20
                //    || Math.abs(e.touches[0].clientY - this._touchObserver.starty) > 20) {
                //    this._touchObserver.moved = true;
                //    this._touchObserver.lastx = e.touches[0].clientX - this._touchObserver.startx;
                //    this._touchObserver.lasty = e.touches[0].clientY - this._touchObserver.starty;
                //}
            }

            private ontouchend(e){
                this._touchObserver.touchDown = false;

                var lasttouch = e.changedTouches[0];
                this._touchObserver.moved =
                    !d$.compare(this._node,document.elementFromPoint(lasttouch.clientX,lasttouch.clientY));
                //trace(document.elementFromPoint(lasttouch.clientX,lasttouch.clientY))

                this.emit(TouchEvent.TOUCH_END);

                if (!this._touchObserver.moved) {
                    //create custom event
                    var evt;
                    if (window["CustomEvent"]) {
                        evt = new window["CustomEvent"]('tap', {
                            bubbles: true,
                            cancelable: true
                        });
                    } else {
                        evt = document.createEvent('Event');
                        evt.initEvent('tap', true, true);
                    }

                    //e.stopPropagation();
                    if (!e.target.dispatchEvent(evt)) {
                        e.preventDefault();
                    }
                }
            }

            private ontouchtap(e){
                this.emit(TouchEvent.TOUCH_TAP);
            }

            private _onmouse(e){
                //trace("_onmouse",e);
            }
            
            private _onmodified(e){
                //console.log(e);
            }

            private _csstransitionSleep:boolean;
            private _oncsstransitionend(e){
                if(!this._csstransitionSleep){
                    this._csstransitionSleep = true;
                    this.emit(StyleEvent.TRAN_SITION_END);
                    //trace(this.apid,this._lastindex,this.index());
                    this.index(0);
                }
                setTimeout(()=>{
                    this._csstransitionSleep = false; //防止重复出发transitionend事件,在下个时间点再允许事件触发
                },20);
            }

            /**
             * CSS style
             */
            //public get style():any{return this._node.style}
            public get styleClass():string[]{
                var result = this.node.className.split(" ")
                return result
            }

            public css(cssprops:any):DomElement {
                if(cssprops){
                    for(var prop in cssprops){
                        this._node.style[prop+""] = cssprops[prop+""];
                    }
                    //this.notify(this._domEventnotify,"onstylechanged");
                }
                return this;
            }
            //public onStyleChanged(callback:Function,thisArg?,param?:Array<any>){
            //    this.registNotify(this._domEventnotify,"onstylechanged",callback,thisArg,param);
            //}

            public abscss():any{
                var result;
                if(window.getComputedStyle){
                    result = window.getComputedStyle(this._node,null);
                }else{
                    result = this._node.style
                }
                return result;
            }

            //显示和隐藏
            private _display:string;
            public show():DomElement{
                //console.log("show",this,this._display);
                if(this._display){
                    this.css({display:this._display});
                }else{
                    this.css({display:"block"})
                }
                //this.transition = this._lasttransition;
                return this;
            }

            public hide():DomElement{
                this._display = this.abscss().display;
                //console.log("hide",this,this._display);
                this.css({display:"none"});
                return this;
            }

            private _lastindex:string|number;
            public index(index?:string|number):string|number{
                var result = this.abscss()["z-index"];
                if(!index && index!==0){
                    if(!Number(result))return 0;
                    return +result;
                }

                this.css({"z-index":index});
                return index;
            }


            //CSS3动画效果
            public to(cssprops:any, transition:number = 660):DomElement {
                //this.index();
                this.index(999);
                this.transition = transition;
                this.css(cssprops);
                return this;
            }

            private _rotation:number;
            public rotate(angle:number, transition:number = 660):DomElement{
                this.transition = transition;
                if (angle == 0 || angle ||angle!=this._rotation) {
                    var rotate = angle;// - this._rotation;
                    //trace(this._rotation);
                    this._node.style.transform = "rotate(" + angle + "deg)";
                    this._node.style["-webkit-transform"] = "rotate(" + angle + "deg)";
                    this._rotation = rotate;
                }
                return this;
            }

            public scale(scale:number, transition:number = 660):DomElement{
                this.transition = transition;
                this._node.style.transform = "scale(" + scale + ","+scale+")";
                this._node.style["-webkit-transform"] = "scale(" + scale + ","+scale+")";
                return this;
            }

            public translate(x:number,y:number,transition:number = 660):DomElement{
                this.transition = transition;
                this._node.style.transform = "translate(" + x + "px,"+y+"px)";
                this._node.style["-webkit-transform"] = "translate(" + x + "px,"+y+"px)";
                return this;
            }

            private _lasttransition:number;
            public set transition(ms:number){
                if(ms<=0 || !ms){
                    delete this._node.style["transition-duration"];
                    delete this._node.style["-webkit-transition-duration"];
                }else{
                    this._node.style["transition-duration"]= ms + "ms";
                    this._node.style["-webkit-transition-duration"] = ms + "ms";
                }
                this._lasttransition = ms;
            }

            public then(fn:(_this?:DomElement)=>void,waittime_ms:number = 0):void{
                this.addEventListener(StyleEvent.TRAN_SITION_END,()=>{
                    this.removeEventListener(StyleEvent.TRAN_SITION_END, <any>arguments.callee,this);
                    if(waittime_ms>100){
                        setTimeout(fn,waittime_ms,this);
                    }else{
                        fn(this);
                    }
                },this);
            }

            /**
             * Html Document Object Model
             */
            public appendChild(ele:DomElement):DomElement{
                this.node.appendChild(ele.node);
                return ele;
            }

            public prependChild(ele:DomElement):DomElement{
                this.node.insertBefore(<any>ele.node,<any>this.node.children[0]);
                return ele;
            }

            public insertBefore(ele:DomElement):DomElement{
                ele.node.parentElement.insertBefore(<any>this.node,<any>ele.node);
                return ele;
            }

            public removeChild(ele:DomElement):DomElement{
                this.node.removeChild(ele.node);
                return ele;
            }

            public parent():DomElement{
                var parent:DomElement;
                if(this._node.parentElement){
                    parent = d$.query(this._node.parentElement)[0]
                }
                return parent
            }

            public find(selector:string):DomElement[]{
                var results:any = [],
                    eles = Sizzle(selector,this.node);
                //console.log(selector,eles)
                for(var i=0;i<eles.length;i++){
                    results.push(d$.htmlele2domele(eles[i]));
                }
                return results;
            }

            public innerContent(anything:string){
                this.node.innerText = anything
            }

            /**
             * Html Document Object Model Data
             */

            public data(key,value?:string):any{
                if(value)this._node.setAttribute("data-"+key,value);
                return this._node.getAttribute("data-"+key);
            }

            public set id(id:string){
                if(!document.getElementById(id) || d$.compare(this._node,document.getElementById(id))){
                    this._node.id = id;
                }else{
                    warn("duplicate id assignment. ",id);
                }
            }
            public get id(){return this._node.id}

            public get apid():number{
                return this._apid;
            }

            public get node():HTMLElement|any {
                return this._node;
            }

            public get tagname():string {
                return this.node.nodeName.toLowerCase();
            }
        }

    }
}