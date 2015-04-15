/**
 * Created by tommyZZM on 2015/4/5.
 */
module alcedo{
    export var d$:dom.DomManager;

    export module dom{
        export class DomManager extends AppNotifyable{

            private _readytask:string;
            private _domtask:Dict;

            public constructor(){
                super();

                if (DomManager._instance != null) {
                    console.error(dom.log_code(1001))
                }

                this._querypool = new Dict();

                this._domtask = new Dict();
                this._domtask.set(DomEvent.ready,[]);

                window.onresize = this.onresize.bind(this);

                this.windowConfigure()
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
                this.notify(this._domtask,DomEvent.ready);
                this._domtask.set(DomEvent.ready,[]);
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
                    this.registNotify(this._domtask,DomEvent.ready,callback,thisObject,param)
                    this.checkready();
                }

            }


            /**
             * resized
             */
            private onresize(){
                this.notify(this._domtask,DomEvent.resize);
            }
            public resize(callback:Function,thisObject?:any,...param){
                callback.apply(thisObject,param);//注册的时候先执行一次
                this.registNotify(this._domtask,DomEvent.resize,callback,thisObject,param)
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
                            result = (<any>window).Sizzle(selector)
                        }
                    }else{
                        result = (<any>window).Sizzle(selector);
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

        export var DomEvent = {
            "ready":"ready",
            "resize":"resize"
        };

        d$ =  dom.DomManager.instance;

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