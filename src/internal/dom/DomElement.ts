/**
 * Created by tommyZZM on 2015/4/6.
 */
module alcedo {
    var testMoblileDeviceType = function () {
        if (!this["navigator"]) {
            return true
        }
        var ua = navigator.userAgent.toLowerCase();
        return (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
    };

    export module dom {
        var pixable_css_prop = ["width","height","top"];
        var _rcssprop:RegExp = /^(\d+\.?\d+)(\w+)$/i;

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
                //TODO:点击事件可能会有BUG,待优化.
                if(testMoblileDeviceType()){
                    this._node.addEventListener("touchstart",(e)=>{this.ontouchbegin(e)},false);
                    this._node.addEventListener("touchmove",(e)=>{this.ontouchmove(e)},false);
                    this._node.addEventListener("touchend",(e)=>{this.ontouchend(e)},false);
                    this._node.addEventListener("touchcancel",(e)=>{this.ontouchend(e)},false);
                    this._node.addEventListener("tap",(e)=>{this.ontouchtap(e)},false);
                }else{
                    this._node.addEventListener("mousedown",(e)=>{this.onmousedown(e)},false);
                    this._node.addEventListener("mouseup",(e)=>{this.onmouseup(e)},false);
                    this._node.addEventListener("click",(e)=>{this.onmouseclick(e)},false);
                }

                this._node.addEventListener("DOMSubtreeModified",this._onmodified.bind(this));

                this._node.addEventListener('transitionend',this._oncsstransitionend.bind(this),false);
                this._node.addEventListener("webkitTransitionEnd",this._oncsstransitionend.bind(this),false)
            }

            /**
             * Event
             **/
            private onmousedown(e){
                e.identifier = 0;
                //e.target = this;
                this.emit(TouchEvent.TOUCH_BEGIN,e);
            }

            private onmouseup(e){
                e.identifier = 0;
                //e.target = this;
                this.emit(TouchEvent.TOUCH_END,e);
            }

            private onmouseclick(e){
                e.identifier = 0;
                //e.target = this;
                this.emit(TouchEvent.TOUCH_TAP,e);
            }

            /**
             * Touch事件
             **/
            private emitTouchEvent(e:any,event:string){
                if(e.changedTouches){
                    var l = e.changedTouches.length;
                    for (var i:number = 0; i < l; i++) {
                        var touchtarget:any= e.changedTouches[i];
                        touchtarget.type = event;
                        //e.changedTouches[i].target = this;
                        this.emit(event,e.changedTouches[i]);
                    }
                }
            }

            private ontouchbegin(e){
                //trace("ontouchbegin",e);
                this.emitTouchEvent(e,TouchEvent.TOUCH_BEGIN)
            }

            private ontouchmove(e){

            }

            private ontouchend(e){
                //trace("ontouchend",e);
                this.emitTouchEvent(e,TouchEvent.TOUCH_END);

                var lasttouch,l = e.changedTouches.length;
                for (var i:number = 0; i < l; i++) {
                    lasttouch = e.changedTouches[i];
                    if(dom.compare(this._node,document.elementFromPoint(lasttouch.clientX,lasttouch.clientY))){
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
                        evt.touchTarget = lasttouch;
                        evt.touchTarget.type = TouchEvent.TOUCH_TAP;

                        //e.stopPropagation();
                        if (!e.target.dispatchEvent(evt)) {
                            e.preventDefault();
                        }
                    }
                }
            }

            private ontouchtap(e){
                //trace("ontouchtap",this.node);
                this.emit(TouchEvent.TOUCH_TAP,e.touchTarget);
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
                    this.index = this._lastindex;
                }
                setTimeout(()=>{
                    this._csstransitionSleep = false; //防止重复出发transitionend事件,在下个时间点再允许事件触发
                },20);
            }

            /**
             * CSS style
             */
            //CSS 类
            public hasClass(className):boolean {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                return !!this._node.className.match(reg);
            }

            public addClass(className) {
                if (!this.hasClass(className)) {
                    if(!this._node.className){
                        this._node.className += className;
                    }else{
                        this._node.className += " " + className;
                    }
                }
            }

            public removeClass(className) {
                if (this.hasClass(className)) {
                    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                    this._node.className = this._node.className.replace(reg, '');
                    if(this._node.className===''){
                        this._node.removeAttribute("class");
                    }
                }
            }
            public get styleClass():string{
                return this._node.className
            }

            public set styleClass(calss:string){
                this._node.className = calss;
            }

            //CSS 属性
            public css(cssprops:any):DomElement {
                if(cssprops){
                    for(var prop in cssprops){
                        var unit = "";
                        if((pixable_css_prop.indexOf(prop+"")>=0) && (typeof cssprops[prop+""]==="number")){
                            unit = "px";
                        }
                        this._node.style[prop+""] = cssprops[prop+""]+unit;
                    }
                    //this.notify(this._domEventnotify,"onstylechanged");
                }
                return this;
            }

            public abscss():any{
                var result;
                if(window.getComputedStyle){
                    result = window.getComputedStyle(this._node,null);
                }else{
                    result = this._node.style
                }
                return result;
            }

            private getcsspropvalue(name:string):any{
                //var result:any = this.css()[name];
                var result:any = this.node.style[name];
                if(!result||result=="auto")result = this.abscss()[name];
                return result
            }

            public get styleWidth():string{
                return this.getcsspropvalue("width")
            }

            public get styleHeight():string{
                return this.getcsspropvalue("height")
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

            public get index():string|number{
                var result = this.node.style["z-index"];
                if(!result)result = this.abscss()["z-index"];

                return <any>result;
            }

            public set index(index:string|number){
                this.css({"z-index":index});
            }


            //CSS3动画效果
            public css_transform_to(cssprops:any, transition:number = 660):DomElement {
                if(this._lastindex!=this.index)this._lastindex = this.index;

                this.css_transition = transition;
                this.css(cssprops);
                return this;
            }

            private _rotation:number;
            public css_transform_rotate(angle:number, transition:number = 660):DomElement{
                this.css_transition = transition;
                if (angle == 0 || angle ||angle!=this._rotation) {
                    var rotate = angle;// - this._rotation;
                    //trace(this._rotation);
                    this._node.style.transform = "rotate(" + angle + "deg)";
                    this._node.style["-webkit-transform"] = "rotate(" + angle + "deg)";
                    this._rotation = rotate;
                }
                return this;
            }

            public css_transform_scale(scale:number, transition:number = 660):DomElement{
                this.css_transition = transition;
                this._node.style.transform = "scale(" + scale + ","+scale+")";
                this._node.style["-webkit-transform"] = "scale(" + scale + ","+scale+")";
                return this;
            }

            public css_transform_translate(x:number,y:number,transition:number = 660):DomElement{
                this.css_transition = transition;
                this._node.style.transform = "translate(" + x + "px,"+y+"px)";
                this._node.style["-webkit-transform"] = "translate(" + x + "px,"+y+"px)";
                return this;
            }

            private _lasttransition:number;
            public set css_transition(ms:number){
                if(ms<=0 || !ms){
                    delete this._node.style["transition-duration"];
                    delete this._node.style["-webkit-transition-duration"];
                }else{
                    this._node.style["transition-duration"]= ms + "ms";
                    this._node.style["-webkit-transition-duration"] = ms + "ms";
                }
                this._lasttransition = ms;
            }

            //public then(fn:(_this?:DomElement)=>void,waittime_ms:number = 0):void{
            //    this.addEventListener(StyleEvent.TRAN_SITION_END,()=>{
            //        this.removeEventListener(StyleEvent.TRAN_SITION_END, <any>arguments.callee,this);
            //        //trace("lastindex",this._lastindex)
            //        //this.index(this._lastindex);
            //        if(waittime_ms>100){
            //            setTimeout(fn,waittime_ms,this);
            //        }else{
            //            fn(this);
            //        }
            //    },this);
            //}

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
                    parent = dom.query(this._node.parentElement)[0]
                }
                return parent
            }

            public children(fn?:(child)=>void):Array<DomElement>{
                var result = [];
                if(this._node.children){
                    for(var i=0;i<this._node.children.length;i++){
                        var child = dom.query(<any>this._node.children[i])[0];
                        result.push(child);
                        if(fn)fn(child)
                    }
                }
                return result
            }

            public find(selector:string):DomElement[]{
                var results:any = [],
                    eles = DomManager.instance.ElementSelector(selector,<any>this.node);
                //console.log(selector,eles)
                for(var i=0;i<eles.length;i++){
                    results.push(DomManager.instance.htmlele2domele(eles[i]));
                }
                return results;
            }

            public innerContent(anything:string){
                this.node.innerText = anything
            }

            /**
             * 读取或更改一个自定义属性
             */
            public attr(key,value?:string):any{
                if(value)this._node.setAttribute(key,value);
                return this._node.getAttribute(key);
            }

            public data(key,value?:string):any{
                if(value)this.attr("data-"+key,value);
                return this._node.getAttribute("data-"+key);
            }

            /**
             * 设置ID
             * @param id
             */
            public set id(id:string){
                if(!document.getElementById(id) || dom.compare(this._node,document.getElementById(id))){
                    this._node.id = id;
                }else{
                    warn("duplicate id assignment. ",id);
                }
            }
            public get id(){return this._node.id}

            /**
             * 对于该DomElement元素的唯一ID
             * @returns {number}
             */
            public get apid():number{
                return this._apid;
            }

            public get node():any {
                return this._node;
            }

            public get bound():any{
                return this._node.getBoundingClientRect();
            }

            public get tagname():string {
                return this.node.nodeName.toLowerCase();
            }
        }

    }
}