/**
 * Created by tommyZZM on 2015/4/5.
 * TODO:Dom元素操作优化
 */
module alcedo{
    export var ___d$:dom.DomManager;

    export module dom{
        export function ready(callback:Function,thisObject?:any,...param){
            ___d$.ready.apply(___d$,[callback,thisObject].concat(param));
        }

        export function resize(callback:Function,thisObject?:any,...param){
            ___d$.resize.apply(___d$,[callback,thisObject].concat(param));
        }

        export function query(selector:HTMLElement|string):DomElement[]{
            return ___d$.query(selector);
        }

        export function compare(node1:Node,node2:Node):boolean{
            return ___d$.compare(node1,node2)
        }

        export function addEventListener(event:string, listener:Function, thisObject:any,priority?:number){
            ___d$.addEventListener(event,listener,thisObject,priority)
        }

        export function removeEventListener(event:string, listener:Function, thisObject:any,priority?:number){
            ___d$.removeEventListener(event,listener,thisObject)
        }

        export class DomManager extends EventDispatcher{

            private _readytask:string;
            private _domtask:Dict;

            public constructor(){
                super();

                if (DomManager._instance != null) {
                    console.error(dom.log_code(1001))
                }

                this._querypool = new Dict();

                this._domtask = new Dict();
                this._domtask.set(DomEventType.ready,[]);

                this.usefulDomEvent();
                this.windowConfigure()
            }

            private usefulDomEvent(){
                window.onresize = this.onresize.bind(this);

                document.addEventListener('webkitvisibilitychange', ()=>{
                    if(!document.hidden){
                        this.onShow();
                    }else{
                        this.onHide();
                    }
                });
                window.addEventListener("pageshow",  this.onShow.bind(this));
                window.addEventListener("pagehide", this.onHide.bind(this));
            }

            private _focus:boolean;
            private _lastfocusstate:boolean;
            private onShow(){
                if(this._lastfocusstate===this._focus)return;
                this._focus = true;
                this._lastfocusstate = this._focus;
                this.emit(DomEvents.ON_FOCUS,{time:Date.now()})
            }

            private onHide(){
                this._focus = false;
                this.emit(DomEvents.ON_LOST_FOCUS,{time:Date.now()})
            }

            private windowConfigure(){
                //体验优化CSS
                var defaultcss = "*{user-select: none; user-focus: none; -webkit-touch-callout: none; -webkit-user-select: none;} " +
                    "input{user-select: auto; user-focus: auto; -webkit-touch-callout: auto; -webkit-user-select: auto;}"
                    ,defaultstyle = document.createElement("style")
                    ,head = document.head || document.getElementsByTagName('head')[0];
                defaultstyle.type = 'text/css';
                if (defaultstyle.styleSheet){
                    defaultstyle.styleSheet["cssText"] = defaultcss;
                } else {
                    defaultstyle.appendChild(document.createTextNode(defaultcss));
                }
                head.appendChild(defaultstyle);
            }

            /**
             * ready
             */
            private _readychekced:boolean;
            private onready(){
                this._readychekced = true;
                AppNotifyable.notify(this._domtask,DomEventType.ready);
                this._domtask.set(DomEventType.ready,[]);
            }
            private checkready(){
                if ( document.readyState === "complete" || this._readychekced) {
                    this.onready();
                } else {
                    // Use the handy event callback
                    //document.addEventListener( "DOMContentLoaded", this.readyed.bind(this) );
                    // A fallback to window.onload, that will always work
                    if(!this._readychekced){
                        window.addEventListener("load", ()=>{
                            window.removeEventListener( "load", <any>arguments.callee, false );
                            //trace("window loaded");
                            this.onready();
                        }, false );
                    }
                }
            }
            public ready(callback:Function,thisObject?:any,...param){
                if(this._readychekced){
                    callback.apply(thisObject,param);
                }else{
                    AppNotifyable.registNotify(this._domtask,DomEventType.ready,callback,thisObject,param)
                    this.checkready();
                }

            }


            /**
             * resized
             */
            private onresize(){
                AppNotifyable.notify(this._domtask,DomEventType.resize);
            }
            public resize(callback:Function,thisObject?:any,...param){
                callback.apply(thisObject,param);//注册的时候先执行一次
                AppNotifyable.registNotify(this._domtask,DomEventType.resize,callback,thisObject,param)
            }

            /**
             * ele queryer
             */
            private _querypool:Dict;
            public query(selector:HTMLElement|string):DomElement[]{
                var results:any = [],
                    eles = this.prase(selector);
                //console.log(selector,eles)
                for(var i=0;i<eles.length;i++){
                    results.push(this.htmlele2domele(eles[i]));
                }

                if(results.length==0){results = []}

                //results.first = function(){
                //    return this[0]
                //};
                //if(eles.length==1)results=results[0];
                return results;
            }
            public htmlele2domele(ele:HTMLElement):DomElement{
                var result;
                if(ele){
                    if(!ele.getAttribute("data-"+_elemark)){
                        _elecount++;
                        ele.setAttribute("data-"+_elemark,_elecount+"");
                        result = new DomElement(ele);
                        this._querypool.set(result.apid+"",result);
                    }else{
                        result = this._querypool.get(ele.getAttribute("data-"+_elemark));
                    }
                }
                return result;
            }

            private prase(selector):Array<HTMLElement>{
                var match,elem,
                    result=[];
                if ( typeof selector === "string" ) {
                    if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
                        match = [ null, selector, null ];
                    }

                    if ( match ) {
                        // HANDLE: $(html) -> $(array)
                        if (match[1]) {
                            var parsed:any = _rsingleTag.exec(match[1]);
                            if(parsed){
                                elem = document.createElement( parsed[1] );
                            }else{
                                parsed = _rhtml.test(match[1]);
                                if(parsed){
                                    elem = match[1];
                                    var fragment:any = document.createDocumentFragment();
                                    var fragment:any =fragment.appendChild( document.createElement("div") );
                                    //tag = ( _rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
                                    fragment.innerHTML =  elem.replace( _rxhtmlTag, "<$1></$2>" );
                                    var tmp = fragment.firstChild;
                                    elem = tmp;
                                    fragment.textContent = "";
                                }
                            }
                            result = [elem];
                        }else{
                            result = Sizzle(selector)
                        }
                    }else{
                        result = Sizzle(selector);
                        //console.log(result)
                    }
                }else if ( selector.nodeType == NodeType.ELEMENT ) {
                    result = [selector];
                }
                return result
            }

            public compare(node1:Node,node2:Node):boolean{
                var boo = (node1===node2);
                if(node1.isSameNode)boo = node1.isSameNode(node2);
                return boo;
            }

            //instance mode
            private static _instance:DomManager;
            public static get instance():DomManager{
                if (DomManager._instance == null) {
                    DomManager._instance = new DomManager()
                }
                return DomManager._instance;
            }
        }

        export enum NodeType{
            ELEMENT=1,
            ARRT = 2,
            TEXT = 3,
            COMMENTS = 8,
            DOCUMENT = 9
        }

        var DomEventType = {
            "ready":"ready",
            "resize":"resize"
        };

        ___d$ =  dom.DomManager.instance;

        //var _rquickExpr:RegExp = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
        var _rsingleTag:RegExp = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);
        var _rhtml:RegExp = /<|&#?\w+;/;
        //var _rtagName:RegExp = /<([\w:]+)/;
        var _rxhtmlTag:RegExp = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
        //var _rallLetter:RegExp = /^[A-Za-z]+$/;
        var _elecount = 0;
        export var _elemark = "apid";
    }
}