/**
 * Created by tommyZZM on 2015/4/3.
 */
var alcedo;
(function (alcedo) {
    var AppObject = (function () {
        function AppObject() {
            this._classname = getClassName(this);
            this._aperureHashIndex = AppObject.hashCount++;
        }
        Object.defineProperty(AppObject.prototype, "hashIndex", {
            get: function () {
                return this._aperureHashIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppObject.prototype, "className", {
            get: function () {
                return this._classname;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 哈希计数
         */
        AppObject.hashCount = 1;
        return AppObject;
    })();
    alcedo.AppObject = AppObject;
})(alcedo || (alcedo = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by tommyZZM on 2015/4/3.
 */
var alcedo;
(function (alcedo) {
    var EventDispatcher = (function (_super) {
        __extends(EventDispatcher, _super);
        function EventDispatcher() {
            _super.call(this);
            this._eventsMap = new Dict();
        }
        EventDispatcher.prototype.addEventListener = function (event, listener, thisObject, priority) {
            alcedo.AppNotifyable.registNotify(this._eventsMap, event, listener, thisObject, null, priority);
        };
        EventDispatcher.prototype.clearEventListener = function (event) {
            this._eventsMap.set(event, []);
        };
        EventDispatcher.prototype.removeEventListener = function (event, listener, thisObject) {
            alcedo.AppNotifyable.unregistNotify(this._eventsMap, event, listener, thisObject);
        };
        EventDispatcher.prototype.dispatchEvent = function (event) {
            alcedo.AppNotifyable.notify(this._eventsMap, event.type, [event]);
        };
        EventDispatcher.prototype.emit = function (event, data) {
            if (data === void 0) { data = undefined; }
            alcedo.AppNotifyable.notify(this._eventsMap, event, [data]);
        };
        return EventDispatcher;
    })(alcedo.AppObject);
    alcedo.EventDispatcher = EventDispatcher;
})(alcedo || (alcedo = {}));
var Dict = (function () {
    function Dict() {
        this._map = {};
        this._keys = [];
        //var a:Map = new Map()
    }
    Dict.prototype.set = function (key, value) {
        if (!this._map[key]) {
            this._keys.push(key);
        }
        this._map[key] = value;
    };
    Dict.prototype.get = function (key) {
        return this._map[key];
    };
    Dict.prototype.find = function (reg) {
        var i, keys = this._keys, result = [];
        for (i = 0; i < keys.length; i++) {
            if (reg.test(keys[i])) {
                if (this.get(keys[i]))
                    result.push(this.get(keys[i]));
            }
        }
        return result;
    };
    Dict.prototype.delete = function (key) {
        var index = this._keys.indexOf(key, 0);
        if (index >= 0) {
            this._keys.splice(index, 1);
        }
        if (this.has(key))
            delete this._map[key];
    };
    Dict.prototype.has = function (key) {
        return this._map[key] ? true : false;
    };
    Dict.prototype.clear = function () {
        this._map = {};
        this._keys = [];
    };
    /** @/deprecated */
    Dict.prototype.forEach = function (callbackfn, thisArg) {
        for (var i = 0; i < this._keys.length; i++) {
            var key = this._keys[i];
            var value = this._map[this._keys[i]];
            callbackfn.apply(thisArg, [value, key]);
        }
    };
    Object.defineProperty(Dict.prototype, "values", {
        get: function () {
            var values = [];
            for (var i = 0; i < this._keys.length; i++) {
                var value = this._map[this._keys[i]];
                values.push(value);
            }
            return values;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dict.prototype, "keys", {
        get: function () {
            return this._keys;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dict.prototype, "size", {
        get: function () {
            return this._keys.length;
        },
        enumerable: true,
        configurable: true
    });
    return Dict;
})();
/**
 * Created by tommyZZM on 2015/5/16.
 */
//取代AppCycle和AppProxyer
var alcedo;
(function (alcedo) {
    var AppSubCore = (function (_super) {
        __extends(AppSubCore, _super);
        //private static uncreateable:boolean = true;
        function AppSubCore() {
            var _this = this;
            _super.call(this);
            var _startup = this.startUp;
            _startup.started = false;
            this.startUp = function () {
                var anyarg = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    anyarg[_i - 0] = arguments[_i];
                }
                if (_startup.started)
                    return;
                _startup.apply(_this, anyarg);
                _startup.started = true;
            };
        }
        AppSubCore.prototype.startUp = function () {
            var anyarg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                anyarg[_i - 0] = arguments[_i];
            }
            //启动
        };
        AppSubCore.prototype.shutDown = function () {
            var anyarg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                anyarg[_i - 0] = arguments[_i];
            }
            //关闭
        };
        AppSubCore.prototype.addCmdHandler = function (notify, callback) {
            if (!alcedo["@AppOverCore"].instance.postals.has(alcedo["@AppOverCore"].getCoreFullName(this))) {
                alcedo["@AppOverCore"].instance.postals.set(alcedo["@AppOverCore"].getCoreFullName(this), new Dict());
            }
            alcedo["@AppOverCore"].instance.postals.get(alcedo["@AppOverCore"].getCoreFullName(this)).set(notify, { thisobj: this, callback: callback });
        };
        AppSubCore.prototype.removeCmdHandler = function (notify, callback) {
            if (!alcedo["@AppOverCore"].instance.postals.has(alcedo["@AppOverCore"].getCoreFullName(this))) {
                return;
            }
            alcedo["@AppOverCore"].instance.postals.get(alcedo["@AppOverCore"].getCoreFullName(this)).delete(notify);
        };
        return AppSubCore;
    })(alcedo.EventDispatcher);
    alcedo.AppSubCore = AppSubCore;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/4.
 */
var alcedo;
(function (alcedo) {
    var AppNotifyable = (function () {
        function AppNotifyable() {
        }
        AppNotifyable.registNotify = function (notifymap, name, callback, thisObject, param, priority) {
            if (!notifymap.has(name))
                notifymap.set(name, []);
            var map = notifymap.get(name);
            var length = map.length;
            var insertIndex = -1;
            if (priority === undefined)
                priority = 0;
            for (var i = 0; i < length; i++) {
                var bin = map[i];
                if (bin && bin.callback === callback && bin.thisObject === thisObject) {
                    return false; //防止重复插入
                }
                if (bin && insertIndex == -1 && bin.priority < priority) {
                    insertIndex = i;
                }
            }
            var bin = { callback: callback, thisObject: thisObject, param: param ? param : [], priority: priority };
            if (insertIndex != -1) {
                map.splice(insertIndex, 0, bin);
            }
            else {
                map.push(bin);
            }
            notifymap.set(name, map);
        };
        AppNotifyable.unregistNotify = function (notifymap, name, callback, thisObject) {
            if (!notifymap.has(name))
                return;
            var map = notifymap.get(name);
            if (map) {
                for (var i in map) {
                    var bin = map[i];
                    if (bin && bin.callback === callback && bin.thisObject === thisObject) {
                        map.splice(i, 1);
                    }
                }
                notifymap.set(name, map);
            }
        };
        AppNotifyable.notify = function (notifymap, name, param) {
            var map = notifymap.get(name);
            if (map) {
                this.notifyArray(map, param);
                return true;
            }
            else {
                return false;
            }
        };
        AppNotifyable.notifyArray = function (arr, param) {
            var length = arr.length;
            for (var i = 0; i < length; i++) {
                var bin = arr[i];
                if (bin && bin.callback) {
                    if (!param)
                        param = [];
                    if (bin.param)
                        param = bin.param.concat(param);
                    bin.callback.apply(bin.thisObject, param);
                }
            }
        };
        return AppNotifyable;
    })();
    alcedo.AppNotifyable = AppNotifyable;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/3.
 */
var alcedo;
(function (alcedo) {
    var Event = (function (_super) {
        __extends(Event, _super);
        function Event(_type, courier) {
            _super.call(this);
            this._type = _type;
            this._courier = courier;
        }
        Object.defineProperty(Event.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Event.prototype, "courier", {
            get: function () {
                return this._courier;
            },
            enumerable: true,
            configurable: true
        });
        return Event;
    })(alcedo.AppObject);
    alcedo.Event = Event;
})(alcedo || (alcedo = {}));
Math.randomFrom = function (begin, to) {
    var d = to - begin, min = to > begin ? begin : to;
    if (d < 0)
        d = -d;
    return Math.random() * d + min;
};
/**
 * Created by tommyZZM on 2015/4/4.
 */
var alcedo;
(function (alcedo) {
    var FacadeEvent = (function (_super) {
        __extends(FacadeEvent, _super);
        function FacadeEvent() {
            //:your code here
            _super.call(this, FacadeEvent.UNIQUE);
        }
        FacadeEvent.prototype.setNotify = function (core, notify, courier) {
            this._core = alcedo["@AppOverCore"].getCoreFullName(core);
            this._notify = notify;
            this._courier = courier;
        };
        Object.defineProperty(FacadeEvent.prototype, "core", {
            get: function () {
                return this._core;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FacadeEvent.prototype, "notify", {
            get: function () {
                return this._notify;
            },
            enumerable: true,
            configurable: true
        });
        FacadeEvent.UNIQUE = 'facadeEvent0811';
        return FacadeEvent;
    })(alcedo.Event);
    alcedo.FacadeEvent = FacadeEvent;
})(alcedo || (alcedo = {}));
//Ecmascript Multiplexing OO expand
//function getClassName(obj:any):string{
//    //class?
//    if (obj.prototype) {
//        if (obj.prototype.__class__ && obj.prototype.constructor){
//            return obj.prototype.__class__;
//        }
//    }else if(obj.__proto__){
//        if (obj.__proto__.__class__ && obj.__proto__.constructor){
//            return obj.__proto__.__class__;
//        }
//    }else{
//        //console.warn(obj,'is not a class!');
//        return undefined;
//    }
//}
//对未提供bind的浏览器实现bind机制
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function () {
        }, fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}
/**
 * 获取类名,不包括命名空间
 * @param obj
 * @returns {string}
 */
function getClassName(obj) {
    //class?
    if (obj.prototype && obj.prototype.constructor) {
        return obj.prototype.constructor["name"];
    }
    else if (obj.__proto__ && obj.__proto__.constructor) {
        return obj.__proto__.constructor["name"];
    }
    else if (obj instanceof Object) {
        return "Object";
    }
    else {
        //console.warn(obj,'is not a class!');
        return undefined;
    }
}
/**
 * 判断类型是否继承?类型
 * @returns {boolean}
 * @param targetClass
 * @param testClass
 */
function isOfClass(targetClass, testClass) {
    if (!targetClass.prototype || !targetClass.prototype.constructor) {
        //console.warn("not typescript class");
        return false;
    }
    return (targetClass.prototype.constructor.prototype instanceof testClass);
}
//function isOfClass(target,test):boolean{
//    if(!target||!target.prototype||!target.prototype['__class__'] || !test.prototype['__class__']){
//        console.warn(target,"not typescript class");
//        return false;
//    }
//
//    if(target.prototype['__class__']==test.prototype['__class__']){
//        return true;
//    }else{
//        var flag:number = 0;
//        var protoTest = (target,test)=>{
//            //console.log(target.__class__,test.prototype['__class__'])
//            if(target){
//                if(target.__class__){
//                    if(target.__class__ == test.prototype['__class__']){
//                        return 1;
//                    }else{
//                        return 0;
//                    }
//                }
//                return -1
//            }
//            return -1
//        };
//
//        target = target.prototype.__proto__;
//        while(flag==0){
//            flag = protoTest(target,test);
//            target = target.__proto__;
//        }
//        return flag == 1;
//    }
//}
function expandMethod(method, target, thisArg) {
    var _method;
    if (typeof method == "string") {
        if (!thisArg || !thisArg['__proto__'][method] || !(thisArg['__proto__'][method] instanceof Function)) {
            return target;
        }
        _method = thisArg['__proto__'][method];
        target["_origin"] = _method.bind(thisArg);
        thisArg['__proto__'][method] = target;
    }
    else {
        if (!(method instanceof Function)) {
            return target;
        }
        _method = method;
        target["_origin"] = _method.bind(thisArg);
    }
    return target;
}
/**
 * Created by tommyZZM on 2015/4/4.
 */
var alcedo;
(function (alcedo) {
    //export var a$:any;
    alcedo.isdebug = false;
    /**
     * 获得一个业务核心
     * @param core
     * @returns {undefined|*|null|null}
     * @param name
     */
    function core(core, name) {
        return alcedo["@AppOverCore"].instance.core(core, name);
    }
    alcedo.core = core;
    /**
     * 向指定业务核心发布一个命令
     * @param core
     * @param cmd
     * @param courier
     */
    function dispatchCmd2Core(core, cmd, courier) {
        if (courier === void 0) { courier = {}; }
        alcedo["@AppOverCore"].instance.dispatchCmd2Core(core, cmd, courier);
    }
    alcedo.dispatchCmd2Core = dispatchCmd2Core;
    /**
     * 发布一个命令(所有业务核心)
     * @param cmd
     * @param courier
     */
    function dispatchCmd(cmd, courier) {
        if (courier === void 0) { courier = {}; }
        var a$ = alcedo["@AppOverCore"].instance;
        var cores = a$._proxypool.values;
        for (var i = 0; i < cores.length; i++) {
            var core = cores[i];
            if (core instanceof alcedo.AppSubCore) {
                a$.dispatchCmd2Core(core, cmd, courier);
            }
            else if (core instanceof Dict) {
                var brothercores = core[i].values;
                for (var j = 0; j < brothercores.length; j++) {
                    var brothercore = brothercores[j];
                    if (brothercore instanceof alcedo.AppSubCore) {
                        a$.dispatchCmd2Core(brothercore, cmd, courier);
                    }
                }
            }
        }
    }
    alcedo.dispatchCmd = dispatchCmd;
    /**
     * 广播
     */
    function dispatchBoardCast(boardcast, courier) {
        if (courier === void 0) { courier = {}; }
        var a$ = alcedo["@AppOverCore"].instance;
        alcedo.AppNotifyable.notify(a$._boardCastMap, boardcast, [courier]);
    }
    alcedo.dispatchBoardCast = dispatchBoardCast;
    /**
     * 广播侦听
     */
    function addBoardCastListener(boardcast, listener, thisObject, priority) {
        var a$ = alcedo["@AppOverCore"].instance;
        alcedo.AppNotifyable.registNotify(a$._boardCastMap, boardcast, listener, thisObject, null, priority);
    }
    alcedo.addBoardCastListener = addBoardCastListener;
    /**
     * 业务核心管理器
     */
    var AppOverCore = (function (_super) {
        __extends(AppOverCore, _super);
        function AppOverCore() {
            _super.call(this);
            if (AppOverCore._instance != null) {
            }
            this._subcore = new Dict();
            this._cmdpool = new Dict();
            this._proxypool = new Dict();
            this._postals = new Dict();
            this._boardCastMap = new Dict();
            this._postman = new alcedo.FacadeEvent();
            this.addEventListener(alcedo.FacadeEvent.UNIQUE, this._postOffice, this);
        }
        AppOverCore.prototype.init = function () {
        };
        Object.defineProperty(AppOverCore.prototype, "postals", {
            get: function () {
                return this._postals;
            },
            enumerable: true,
            configurable: true
        });
        //邮局，传递子系统中的消息
        AppOverCore.prototype._postOffice = function (e) {
            if (!this._postals.has(e.core)) {
                this._postals.set(e.core, new Dict());
            }
            var ant = this._postals.get(e.core).get(e.notify);
            if (ant && ant.callback && ant.thisobj) {
                ant.callback.apply(ant.thisobj, [e.courier]);
            }
        };
        AppOverCore.prototype.core = function (core, name) {
            if (isOfClass(core, alcedo.AppSubCore)) {
                if (core === alcedo.AppSubCore) {
                    error(core, "could be select");
                    return;
                }
                var corename = getClassName(core) + "_" + AppOverCore.getCoreId(core);
                var result = this._proxypool.get(corename);
                if (core.instanceable === true || !name) {
                    if (!result) {
                        this._proxypool.set(corename, new core());
                    }
                    return this._proxypool.get(corename);
                }
                else if (name) {
                    var proxydict = this._proxypool.get(corename);
                    if (!proxydict || !(proxydict instanceof Dict)) {
                        this._proxypool.set(corename, new Dict());
                    }
                    if (!this._proxypool.get(corename).has(name)) {
                        this._proxypool.get(corename).set(name, new core());
                    }
                    return this._proxypool.get(corename).get(name);
                }
                else {
                    error("Are you want a instanceable core? create a static var instanceable==true");
                    return null;
                }
            }
            else {
                error(core, name || "", "select fail!");
                return null;
            }
        };
        //获得业务核心的唯一ID
        AppOverCore.getCoreId = function (core) {
            var id;
            if (isOfClass(core, alcedo.AppSubCore)) {
                if (core.uncreateable)
                    return 0;
                if (!core.prototype.___coreid) {
                    this._subcoreid++;
                    core.prototype.___coreid = this._subcoreid;
                }
                id = core.prototype.___coreid;
            }
            else if (core instanceof alcedo.AppSubCore) {
                if (!core["__proto__"].___coreid) {
                    this._subcoreid++;
                    core["__proto__"].___coreid = this._subcoreid;
                }
                id = core["__proto__"].___coreid;
            }
            return id;
        };
        //获得业务核心全名
        AppOverCore.getCoreFullName = function (core) {
            if (isOfClass(core, alcedo.AppSubCore) || core instanceof alcedo.AppSubCore) {
                return getClassName(core) + "_" + this.getCoreId(core);
            }
        };
        //发布命令给业务核心
        AppOverCore.prototype.dispatchCmd2Core = function (core, cmd, courier) {
            if (courier === void 0) { courier = {}; }
            if (!(core instanceof alcedo.AppSubCore))
                this.core(core);
            courier._cmd = cmd;
            this._postman.setNotify(core, cmd, courier);
            this.dispatchEvent(this._postman);
        };
        Object.defineProperty(AppOverCore, "instance", {
            get: function () {
                if (!AppOverCore._instance) {
                    AppOverCore._instance = new AppOverCore();
                    AppOverCore._instance.init();
                }
                return AppOverCore._instance;
            },
            enumerable: true,
            configurable: true
        });
        //获得一枚业务核心
        AppOverCore._subcoreid = 0;
        return AppOverCore;
    })(alcedo.EventDispatcher);
    alcedo["@AppOverCore"] = AppOverCore;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/3.
 */
var alcedo;
(function (alcedo) {
    var AppCycler = (function (_super) {
        __extends(AppCycler, _super);
        function AppCycler() {
            _super.call(this);
            this.addCmdHandler(alcedo.AppLauncher.START_UP, this.cmdStartup);
            alcedo.launch(this, true);
        }
        AppCycler.prototype.cmdStartup = function () {
            var courier = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                courier[_i - 0] = arguments[_i];
            }
        };
        return AppCycler;
    })(alcedo.AppSubCore);
    alcedo.AppCycler = AppCycler;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/4.
 */
//var ap:any = aperture;
var alcedo;
(function (alcedo) {
    alcedo.config = {
        hellowords: true
    };
    var AppLauncher = (function () {
        function AppLauncher(debug) {
            if (AppLauncher._instance) {
                return;
            }
            alcedo.isdebug = debug;
            alcedo.debuginit();
            if (alcedo.config.hellowords) {
                info("%cAlcedo", "color:#1ac2ff;font-weight:bold;", "A Simple TypeScript HTML5 Game FrameWork!");
                info("gitHub:", 'https://github.com/tommyZZM/Alcedo');
                info("If you are a non-employee who has discovered this facility amid the ruins of civilization.\n" + "Welcome! And remember: Testing is the future, and the future starts with you.");
            }
            alcedo["@AppOverCore"].instance;
        }
        AppLauncher.prototype.launch = function (app, courier) {
            if (this._launched)
                return;
            this._launched = true;
            alcedo["@AppOverCore"].instance.dispatchCmd2Core(app, AppLauncher.START_UP, courier);
        };
        AppLauncher.instance = function (debug) {
            if (this._instance == null) {
                this._instance = new AppLauncher(debug);
            }
            //if(this._instance['_game'] && this._instance['_display']){this._instance['_isinit'] = true;}
            return this._instance;
        };
        AppLauncher.START_UP = "AppLauncher.START_UP";
        return AppLauncher;
    })();
    alcedo.AppLauncher = AppLauncher;
    function launch(app, debug, courier) {
        AppLauncher.instance(debug).launch(app, courier);
    }
    alcedo.launch = launch;
})(alcedo || (alcedo = {}));
function trace() {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i - 0] = arguments[_i];
    }
}
function warn() {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i - 0] = arguments[_i];
    }
}
function info() {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i - 0] = arguments[_i];
    }
}
function error() {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i - 0] = arguments[_i];
    }
}
var alcedo;
(function (alcedo) {
    function debuginit() {
        if (alcedo.isdebug) {
            window["log"] = console.log.bind(console);
            window["trace"] = console.log.bind(console);
            window["debug"] = console.debug.bind(console);
            window["warn"] = console.warn.bind(console);
            window["info"] = console.info.bind(console);
            window["error"] = console.error.bind(console);
        }
    }
    alcedo.debuginit = debuginit;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/5.
 * TODO:Dom元素操作优化
 */
var alcedo;
(function (alcedo) {
    var ___d$; //DomManager instance
    var dom;
    (function (dom) {
        function ready(callback, thisObject) {
            var param = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                param[_i - 2] = arguments[_i];
            }
            ___d$.ready.apply(___d$, [callback, thisObject].concat(param));
        }
        dom.ready = ready;
        function resize(callback, thisObject) {
            var param = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                param[_i - 2] = arguments[_i];
            }
            ___d$.resize.apply(___d$, [callback, thisObject].concat(param));
        }
        dom.resize = resize;
        function query(selector) {
            return ___d$.query(selector);
        }
        dom.query = query;
        function compare(node1, node2) {
            return ___d$.compare(node1, node2);
        }
        dom.compare = compare;
        function addEventListener(event, listener, thisObject, priority) {
            ___d$.addEventListener(event, listener, thisObject, priority);
        }
        dom.addEventListener = addEventListener;
        function removeEventListener(event, listener, thisObject, priority) {
            ___d$.removeEventListener(event, listener, thisObject);
        }
        dom.removeEventListener = removeEventListener;
        var DomManager = (function (_super) {
            __extends(DomManager, _super);
            function DomManager() {
                _super.call(this);
                if (DomManager._instance != null) {
                }
                this._querypool = new Dict();
                this._domtask = new Dict();
                this._domtask.set(DomEventType.ready, []);
                this.usefulDomEvent();
                //this.windowConfigure()
            }
            DomManager.prototype.usefulDomEvent = function () {
                var _this = this;
                window.onresize = this.onresize.bind(this);
                document.addEventListener('webkitvisibilitychange', function () {
                    if (!document.hidden) {
                        _this.onShow();
                    }
                    else {
                        _this.onHide();
                    }
                });
                window.addEventListener("pageshow", this.onShow.bind(this));
                window.addEventListener("pagehide", this.onHide.bind(this));
            };
            DomManager.prototype.onShow = function () {
                if (this._lastfocusstate === this._focus)
                    return;
                this._focus = true;
                this._lastfocusstate = this._focus;
                this.emit(dom.DomEvents.ON_FOCUS, { time: Date.now() });
            };
            DomManager.prototype.onHide = function () {
                this._focus = false;
                this.emit(dom.DomEvents.ON_LOST_FOCUS, { time: Date.now() });
            };
            DomManager.prototype.windowConfigure = function () {
                //体验优化CSS
                var defaultcss = "*{user-select: none; user-focus: none; -webkit-touch-callout: none; -webkit-user-select: none;} " + "input{user-select: auto; user-focus: auto; -webkit-touch-callout: auto; -webkit-user-select: auto;}", defaultstyle = document.createElement("style"), head = document.head || document.getElementsByTagName('head')[0];
                defaultstyle.type = 'text/css';
                if (defaultstyle.styleSheet) {
                    defaultstyle.styleSheet["cssText"] = defaultcss;
                }
                else {
                    defaultstyle.appendChild(document.createTextNode(defaultcss));
                }
                head.appendChild(defaultstyle);
            };
            DomManager.prototype.onready = function () {
                this._readychekced = true;
                alcedo.AppNotifyable.notify(this._domtask, DomEventType.ready);
                this._domtask.set(DomEventType.ready, []);
            };
            DomManager.prototype.checkready = function () {
                var _this = this;
                if (document.readyState === "complete" || this._readychekced) {
                    this.onready();
                }
                else {
                    // Use the handy event callback
                    //document.addEventListener( "DOMContentLoaded", this.readyed.bind(this) );
                    // A fallback to window.onload, that will always work
                    if (!this._readychekced) {
                        window.addEventListener("load", function () {
                            window.removeEventListener("load", arguments.callee, false);
                            //trace("window loaded");
                            _this.onready();
                        }, false);
                    }
                }
            };
            DomManager.prototype.ready = function (callback, thisObject) {
                var param = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    param[_i - 2] = arguments[_i];
                }
                if (this._readychekced) {
                    callback.apply(thisObject, param);
                }
                else {
                    alcedo.AppNotifyable.registNotify(this._domtask, DomEventType.ready, callback, thisObject, param);
                    this.checkready();
                }
            };
            /**
             * resized
             */
            DomManager.prototype.onresize = function () {
                alcedo.AppNotifyable.notify(this._domtask, DomEventType.resize);
            };
            DomManager.prototype.resize = function (callback, thisObject) {
                var param = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    param[_i - 2] = arguments[_i];
                }
                callback.apply(thisObject, param); //注册的时候先执行一次
                alcedo.AppNotifyable.registNotify(this._domtask, DomEventType.resize, callback, thisObject, param);
            };
            DomManager.prototype.query = function (selector) {
                var results = [], eles = this.prase(selector);
                for (var i = 0; i < eles.length; i++) {
                    results.push(this.htmlele2domele(eles[i]));
                }
                if (results.length == 0) {
                    results = [];
                }
                //results.first = function(){
                //    return this[0]
                //};
                //if(eles.length==1)results=results[0];
                return results;
            };
            DomManager.prototype.htmlele2domele = function (ele) {
                var result;
                if (ele) {
                    if (!ele.getAttribute("data-" + dom._elemark)) {
                        _elecount++;
                        ele.setAttribute("data-" + dom._elemark, _elecount + "");
                        result = new dom.DomElement(ele);
                        this._querypool.set(result.apid + "", result);
                    }
                    else {
                        result = this._querypool.get(ele.getAttribute("data-" + dom._elemark));
                    }
                }
                return result;
            };
            DomManager.prototype.ElementSelector = function (e, context) {
                if (context === void 0) { context = document; }
                return (typeof (context) === "undefined") ? e : (context.querySelectorAll ? context.querySelectorAll(e) : context.getElementById((e.charAt(0) === "#") ? e.substr(1) : e));
            };
            DomManager.prototype.prase = function (selector) {
                var match, elem, result = [];
                //console.log("here")
                if (typeof selector === "string") {
                    if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
                        match = [null, selector, null];
                    }
                    if (match) {
                        // HANDLE: $(html) -> $(array)
                        if (match[1]) {
                            var parsed = _rsingleTag.exec(match[1]);
                            if (parsed) {
                                elem = document.createElement(parsed[1]);
                            }
                            else {
                                parsed = _rhtml.test(match[1]);
                                if (parsed) {
                                    elem = match[1];
                                    var fragment = document.createDocumentFragment();
                                    var fragment = fragment.appendChild(document.createElement("div"));
                                    //tag = ( _rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
                                    fragment.innerHTML = elem.replace(_rxhtmlTag, "<$1></$2>");
                                    var tmp = fragment.firstChild;
                                    elem = tmp;
                                    fragment.textContent = "";
                                }
                            }
                            result = [elem];
                        }
                        else {
                            result = this.ElementSelector(selector);
                        }
                    }
                    else {
                        result = this.ElementSelector(selector);
                    }
                }
                else if (selector.nodeType == 1 /* ELEMENT */) {
                    result = [selector];
                }
                return result;
            };
            DomManager.prototype.compare = function (node1, node2) {
                var boo = (node1 === node2);
                if (node1.isSameNode)
                    boo = node1.isSameNode(node2);
                return boo;
            };
            Object.defineProperty(DomManager, "instance", {
                get: function () {
                    if (DomManager._instance == null) {
                        DomManager._instance = new DomManager();
                    }
                    return DomManager._instance;
                },
                enumerable: true,
                configurable: true
            });
            return DomManager;
        })(alcedo.EventDispatcher);
        dom.DomManager = DomManager;
        (function (NodeType) {
            NodeType[NodeType["ELEMENT"] = 1] = "ELEMENT";
            NodeType[NodeType["ARRT"] = 2] = "ARRT";
            NodeType[NodeType["TEXT"] = 3] = "TEXT";
            NodeType[NodeType["COMMENTS"] = 8] = "COMMENTS";
            NodeType[NodeType["DOCUMENT"] = 9] = "DOCUMENT";
        })(dom.NodeType || (dom.NodeType = {}));
        var NodeType = dom.NodeType;
        var DomEventType = {
            "ready": "ready",
            "resize": "resize"
        };
        ___d$ = dom.DomManager.instance;
        //var _rquickExpr:RegExp = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
        var _rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);
        var _rhtml = /<|&#?\w+;/;
        //var _rtagName:RegExp = /<([\w:]+)/;
        var _rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
        //var _rallLetter:RegExp = /^[A-Za-z]+$/;
        var _elecount = 0;
        dom._elemark = "apid";
    })(dom = alcedo.dom || (alcedo.dom = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/25.
 *
 * Dont Try To Extend any interal Object
 *
 */
//Object.defineProperty(Array.prototype, 'fastRemove', {
//    value: function (index:number) {
//        var result = this[index];
//        if(this.length==1){
//            this.length=0;
//            return result;
//        }
//        this[index] = this.pop();
//        return result;
//    },enumerable: false
//});
//
//Object.defineProperty(Array.prototype, 'first', {
//    get : function () {
//        return this[0];
//    },
//    enumerable: false
//});
//
//Object.defineProperty(Array.prototype, 'last', {
//    get : function () {
//        return this[this.length-1];
//    },
//    enumerable: false
//});
//
//Object.defineProperty(Array.prototype, 'randomselect', {
//    value: function () {
//        if(this.length<1){return;}
//        if(this.length==1){return this[0];}
//        var i = Math.randomFrom(0,this.length)^0;
//        return this[i];
//    },enumerable: false
//});
//
//Object.defineProperty(Array.prototype, 'copy', {
//    value: function () {
//        var result = [];
//        for(var i=0;i<this.length;i++){
//            result[i]=this[i];
//        }
//        return result;
//    },enumerable: false
//});
//
//interface Array<T>{
//    prototype;
//
//    /**
//     * 快速移除某个元素，默认会以最后一个元素填充到移除元素的位置，返回移除的元素。
//     * @param index
//     */
//    fastRemove(index:number);
//
//    first:any
//    //最后一个元素
//    last:any
//
//    //随机选取一个元素
//    randomselect();
//
//    //复制一个数组
//    copy():Array<T>;
//} 
/**
 * Created by tommyZZM on 2015/4/8.
 */
var Art;
(function (Art) {
    function HexToColorString(value) {
        if (isNaN(value) || value < 0)
            value = 0;
        if (value > 16777215)
            value = 16777215;
        var color = value.toString(16).toUpperCase();
        while (color.length < 6) {
            color = "0" + color;
        }
        return "#" + color;
    }
    Art.HexToColorString = HexToColorString;
    var _rcolourhex = /(0x|#)?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/i;
    function StringToColorHex(value) {
        var _result = _rcolourhex.exec(value + "");
        if (_result && _result[2] && _result[3] && _result[4]) {
            _result = "0x" + _result[2] + _result[3] + _result[4];
        }
        return +_result;
        //return "#"+color;
    }
    Art.StringToColorHex = StringToColorHex;
    function HexToRGB(value) {
        var _result = _rcolourhex.exec(value + "");
        _result = [
            parseInt(_result[2], 16),
            parseInt(_result[3], 16),
            parseInt(_result[4], 16)
        ];
        return _result;
    }
    Art.HexToRGB = HexToRGB;
    function RGBToHex(r, g, b) {
        var _r = r, _g = g, _b = b;
        if (Array.isArray(r)) {
            _r = r[0];
            _g = r[1];
            _b = r[2];
        }
        return "#" + _r.toString(16) + _g.toString(16) + _b.toString(16);
    }
    Art.RGBToHex = RGBToHex;
})(Art || (Art = {}));
/**
 * Created by tommyZZM on 2015/4/9.
 */
var alcedo;
(function (alcedo) {
    function checkNormalType(data) {
        return (typeof data == "string" || typeof data == "number");
    }
    alcedo.checkNormalType = checkNormalType;
    var _r2value = /(\w*)^((\d|\.)+)(\w*)$/i;
    function toValue(str) {
        //trace("toValue",_r2value.exec(str),str)
        var _str, _rstr = _r2value.exec(str);
        if (_rstr) {
            _str = Number(_rstr[2]);
        }
        if (!_str) {
            _str = 0;
        }
        return _str;
    }
    alcedo.toValue = toValue;
    /**
     * TryCatch����
     * @param fn
     * @param onerror
     * @param thisObject
     */
    function tryExecute(fn, onerror, thisObject) {
        try {
            thisObject ? fn.apply(thisObject) : fn();
        }
        catch (e) {
            thisObject ? onerror.apply(thisObject, e) : onerror(e);
        }
    }
    alcedo.tryExecute = tryExecute;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/6.
 */
var alcedo;
(function (alcedo) {
    var m = window["Math"];
    var uMath = (function () {
        function uMath() {
        }
        /**
         * 得到对应角度值的sin近似值
         * @param value {number} 角度值
         * @returns {number} sin值
         */
        uMath.sin = function (value) {
            return m.sin(value);
        };
        /**
         * 得到对应角度值的cos近似值
         * @param value {number} 角度值
         * @returns {number} cos值
         */
        uMath.cos = function (value) {
            return m.cos(value);
        };
        uMath.PI = m.PI;
        /**
         * @property {Number} PI_2
         */
        uMath.PI_2 = Math.PI * 2;
        /**
         * @property {Number} RAD_TO_DEG
         */
        uMath.RAD_TO_DEG = 180 / Math.PI;
        /**
         * @property {Number} DEG_TO_RAD
         */
        uMath.DEG_TO_RAD = Math.PI / 180;
        return uMath;
    })();
    alcedo.uMath = uMath;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/11.
 */
var alcedo;
(function (alcedo) {
    var dstruct;
    (function (dstruct) {
        var QuadTree = (function () {
            function QuadTree() {
            }
            return QuadTree;
        })();
        dstruct.QuadTree = QuadTree;
    })(dstruct = alcedo.dstruct || (alcedo.dstruct = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/6.
 */
var alcedo;
(function (alcedo) {
    var testMoblileDeviceType = function () {
        if (!this["navigator"]) {
            return true;
        }
        var ua = navigator.userAgent.toLowerCase();
        return (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
    };
    var dom;
    (function (dom) {
        var pixable_css_prop = ["width", "height", "top"];
        var _rcssprop = /^(\d+\.?\d+)(\w+)$/i;
        var DomElement = (function (_super) {
            __extends(DomElement, _super);
            function DomElement(ele) {
                _super.call(this);
                this._node = ele; //this.init(selector);
                if (this._node) {
                    this._apid = +(ele.getAttribute("data-" + dom._elemark));
                    this._designedcss = this.abscss();
                    this._domEventnotify = new Dict();
                    if (this.tagname != "body")
                        this.initevent();
                }
            }
            DomElement.prototype.initevent = function () {
                var _this = this;
                //TODO:点击事件可能会有BUG,待优化.
                if (testMoblileDeviceType()) {
                    this._node.addEventListener("touchstart", function (e) {
                        _this.ontouchbegin(e);
                    }, false);
                    this._node.addEventListener("touchmove", function (e) {
                        _this.ontouchmove(e);
                    }, false);
                    this._node.addEventListener("touchend", function (e) {
                        _this.ontouchend(e);
                    }, false);
                    this._node.addEventListener("touchcancel", function (e) {
                        _this.ontouchend(e);
                    }, false);
                    this._node.addEventListener("tap", function (e) {
                        _this.ontouchtap(e);
                    }, false);
                }
                else {
                    this._node.addEventListener("mousedown", function (e) {
                        _this.onmousedown(e);
                    }, false);
                    this._node.addEventListener("mouseup", function (e) {
                        _this.onmouseup(e);
                    }, false);
                    this._node.addEventListener("click", function (e) {
                        _this.onmouseclick(e);
                    }, false);
                }
                this._node.addEventListener("DOMSubtreeModified", this._onmodified.bind(this));
                this._node.addEventListener('transitionend', this._oncsstransitionend.bind(this), false);
                this._node.addEventListener("webkitTransitionEnd", this._oncsstransitionend.bind(this), false);
            };
            /**
             * Event
             **/
            DomElement.prototype.onmousedown = function (e) {
                e.identifier = 0;
                //e.target = this;
                this.emit(dom.TouchEvent.TOUCH_BEGIN, e);
            };
            DomElement.prototype.onmouseup = function (e) {
                e.identifier = 0;
                //e.target = this;
                this.emit(dom.TouchEvent.TOUCH_END, e);
            };
            DomElement.prototype.onmouseclick = function (e) {
                e.identifier = 0;
                //e.target = this;
                this.emit(dom.TouchEvent.TOUCH_TAP, e);
            };
            /**
             * Touch事件
             **/
            DomElement.prototype.emitTouchEvent = function (e, event) {
                if (e.changedTouches) {
                    var l = e.changedTouches.length;
                    for (var i = 0; i < l; i++) {
                        var touchtarget = e.changedTouches[i];
                        touchtarget.type = event;
                        //e.changedTouches[i].target = this;
                        this.emit(event, e.changedTouches[i]);
                    }
                }
            };
            DomElement.prototype.ontouchbegin = function (e) {
                //trace("ontouchbegin",e);
                this.emitTouchEvent(e, dom.TouchEvent.TOUCH_BEGIN);
            };
            DomElement.prototype.ontouchmove = function (e) {
            };
            DomElement.prototype.ontouchend = function (e) {
                //trace("ontouchend",e);
                this.emitTouchEvent(e, dom.TouchEvent.TOUCH_END);
                var lasttouch, l = e.changedTouches.length;
                for (var i = 0; i < l; i++) {
                    lasttouch = e.changedTouches[i];
                    if (dom.compare(this._node, document.elementFromPoint(lasttouch.clientX, lasttouch.clientY))) {
                        var evt;
                        if (window["CustomEvent"]) {
                            evt = new window["CustomEvent"]('tap', {
                                bubbles: true,
                                cancelable: true
                            });
                        }
                        else {
                            evt = document.createEvent('Event');
                            evt.initEvent('tap', true, true);
                        }
                        evt.touchTarget = lasttouch;
                        evt.touchTarget.type = dom.TouchEvent.TOUCH_TAP;
                        //e.stopPropagation();
                        if (!e.target.dispatchEvent(evt)) {
                            e.preventDefault();
                        }
                    }
                }
            };
            DomElement.prototype.ontouchtap = function (e) {
                //trace("ontouchtap",this.node);
                this.emit(dom.TouchEvent.TOUCH_TAP, e.touchTarget);
            };
            DomElement.prototype._onmodified = function (e) {
                //console.log(e);
            };
            DomElement.prototype._oncsstransitionend = function (e) {
                var _this = this;
                if (!this._csstransitionSleep) {
                    this._csstransitionSleep = true;
                    this.emit(dom.StyleEvent.TRAN_SITION_END);
                    //trace(this.apid,this._lastindex,this.index());
                    this.index = this._lastindex;
                }
                setTimeout(function () {
                    _this._csstransitionSleep = false; //防止重复出发transitionend事件,在下个时间点再允许事件触发
                }, 20);
            };
            /**
             * CSS style
             */
            //CSS 类
            DomElement.prototype.hasClass = function (className) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                return !!this._node.className.match(reg);
            };
            DomElement.prototype.addClass = function (className) {
                if (!this.hasClass(className)) {
                    if (!this._node.className) {
                        this._node.className += className;
                    }
                    else {
                        this._node.className += " " + className;
                    }
                }
            };
            DomElement.prototype.removeClass = function (className) {
                if (this.hasClass(className)) {
                    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                    this._node.className = this._node.className.replace(reg, '');
                    if (this._node.className === '') {
                        this._node.removeAttribute("class");
                    }
                }
            };
            Object.defineProperty(DomElement.prototype, "styleClass", {
                get: function () {
                    return this._node.className;
                },
                set: function (calss) {
                    this._node.className = calss;
                },
                enumerable: true,
                configurable: true
            });
            //CSS 属性
            DomElement.prototype.css = function (cssprops) {
                if (cssprops) {
                    for (var prop in cssprops) {
                        var unit = "";
                        if ((pixable_css_prop.indexOf(prop + "") >= 0) && (typeof cssprops[prop + ""] === "number")) {
                            unit = "px";
                        }
                        this._node.style[prop + ""] = cssprops[prop + ""] + unit;
                    }
                }
                return this;
            };
            DomElement.prototype.abscss = function () {
                var result;
                if (window.getComputedStyle) {
                    result = window.getComputedStyle(this._node, null);
                }
                else {
                    result = this._node.style;
                }
                return result;
            };
            DomElement.prototype.getcsspropvalue = function (name) {
                //var result:any = this.css()[name];
                var result = this.node.style[name];
                if (!result || result == "auto")
                    result = this.abscss()[name];
                return result;
            };
            Object.defineProperty(DomElement.prototype, "styleWidth", {
                get: function () {
                    return this.getcsspropvalue("width");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DomElement.prototype, "styleHeight", {
                get: function () {
                    return this.getcsspropvalue("height");
                },
                enumerable: true,
                configurable: true
            });
            DomElement.prototype.show = function () {
                //console.log("show",this,this._display);
                if (this._display) {
                    this.css({ display: this._display });
                }
                else {
                    this.css({ display: "block" });
                }
                //this.transition = this._lasttransition;
                return this;
            };
            DomElement.prototype.hide = function () {
                this._display = this.abscss().display;
                //console.log("hide",this,this._display);
                this.css({ display: "none" });
                return this;
            };
            Object.defineProperty(DomElement.prototype, "index", {
                get: function () {
                    var result = this.node.style["z-index"];
                    if (!result)
                        result = this.abscss()["z-index"];
                    return result;
                },
                set: function (index) {
                    this.css({ "z-index": index });
                },
                enumerable: true,
                configurable: true
            });
            //CSS3动画效果
            DomElement.prototype.css_transform_to = function (cssprops, transition) {
                if (transition === void 0) { transition = 660; }
                if (this._lastindex != this.index)
                    this._lastindex = this.index;
                this.css_transition = transition;
                this.css(cssprops);
                return this;
            };
            DomElement.prototype.css_transform_rotate = function (angle, transition) {
                if (transition === void 0) { transition = 660; }
                this.css_transition = transition;
                if (angle == 0 || angle || angle != this._rotation) {
                    var rotate = angle; // - this._rotation;
                    //trace(this._rotation);
                    this._node.style.transform = "rotate(" + angle + "deg)";
                    this._node.style["-webkit-transform"] = "rotate(" + angle + "deg)";
                    this._rotation = rotate;
                }
                return this;
            };
            DomElement.prototype.css_transform_scale = function (scale, transition) {
                if (transition === void 0) { transition = 660; }
                this.css_transition = transition;
                this._node.style.transform = "scale(" + scale + "," + scale + ")";
                this._node.style["-webkit-transform"] = "scale(" + scale + "," + scale + ")";
                return this;
            };
            DomElement.prototype.css_transform_translate = function (x, y, transition) {
                if (transition === void 0) { transition = 660; }
                this.css_transition = transition;
                this._node.style.transform = "translate(" + x + "px," + y + "px)";
                this._node.style["-webkit-transform"] = "translate(" + x + "px," + y + "px)";
                return this;
            };
            Object.defineProperty(DomElement.prototype, "css_transition", {
                set: function (ms) {
                    if (ms <= 0 || !ms) {
                        delete this._node.style["transition-duration"];
                        delete this._node.style["-webkit-transition-duration"];
                    }
                    else {
                        this._node.style["transition-duration"] = ms + "ms";
                        this._node.style["-webkit-transition-duration"] = ms + "ms";
                    }
                    this._lasttransition = ms;
                },
                enumerable: true,
                configurable: true
            });
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
            DomElement.prototype.appendChild = function (ele) {
                this.node.appendChild(ele.node);
                return ele;
            };
            DomElement.prototype.prependChild = function (ele) {
                this.node.insertBefore(ele.node, this.node.children[0]);
                return ele;
            };
            DomElement.prototype.insertBefore = function (ele) {
                ele.node.parentElement.insertBefore(this.node, ele.node);
                return ele;
            };
            DomElement.prototype.removeChild = function (ele) {
                this.node.removeChild(ele.node);
                return ele;
            };
            DomElement.prototype.parent = function () {
                var parent;
                if (this._node.parentElement) {
                    parent = dom.query(this._node.parentElement)[0];
                }
                return parent;
            };
            DomElement.prototype.children = function (fn) {
                var result = [];
                if (this._node.children) {
                    for (var i = 0; i < this._node.children.length; i++) {
                        var child = dom.query(this._node.children[i])[0];
                        result.push(child);
                        if (fn)
                            fn(child);
                    }
                }
                return result;
            };
            DomElement.prototype.find = function (selector) {
                var results = [], eles = dom.DomManager.instance.ElementSelector(selector, this.node);
                for (var i = 0; i < eles.length; i++) {
                    results.push(dom.DomManager.instance.htmlele2domele(eles[i]));
                }
                return results;
            };
            DomElement.prototype.innerContent = function (anything) {
                this.node.innerText = anything;
            };
            /**
             * 读取或更改一个自定义属性
             */
            DomElement.prototype.attr = function (key, value) {
                if (value)
                    this._node.setAttribute(key, value);
                return this._node.getAttribute(key);
            };
            DomElement.prototype.data = function (key, value) {
                if (value)
                    this.attr("data-" + key, value);
                return this._node.getAttribute("data-" + key);
            };
            Object.defineProperty(DomElement.prototype, "id", {
                get: function () {
                    return this._node.id;
                },
                /**
                 * 设置ID
                 * @param id
                 */
                set: function (id) {
                    if (!document.getElementById(id) || dom.compare(this._node, document.getElementById(id))) {
                        this._node.id = id;
                    }
                    else {
                        warn("duplicate id assignment. ", id);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DomElement.prototype, "apid", {
                /**
                 * 对于该DomElement元素的唯一ID
                 * @returns {number}
                 */
                get: function () {
                    return this._apid;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DomElement.prototype, "node", {
                get: function () {
                    return this._node;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DomElement.prototype, "bound", {
                get: function () {
                    return this._node.getBoundingClientRect();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DomElement.prototype, "tagname", {
                get: function () {
                    return this.node.nodeName.toLowerCase();
                },
                enumerable: true,
                configurable: true
            });
            return DomElement;
        })(alcedo.EventDispatcher);
        dom.DomElement = DomElement;
    })(dom = alcedo.dom || (alcedo.dom = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/6.
 */
var alcedo;
(function (alcedo) {
    var dom;
    (function (dom) {
        function width() {
            var result;
            if (document.documentElement.clientWidth) {
                result = document.documentElement.clientWidth;
            }
            else {
                result = window.innerWidth;
            }
            return result;
        }
        dom.width = width;
        function height() {
            var result;
            if (document.documentElement.clientHeight) {
                result = document.documentElement.clientHeight;
            }
            else {
                result = window.innerHeight;
            }
            return result;
        }
        dom.height = height;
        function w2h() {
            return width() / height();
        }
        dom.w2h = w2h;
        var navigator;
        if (!navigator) {
            navigator = { userAgent: "commonJS" };
        }
        dom.ua = navigator.userAgent.toLowerCase();
        function device() {
            if (/iphone|ipad|ipod/i.test(dom.ua)) {
                return 2 /* IOS */;
            }
            if (/android/i.test(dom.ua)) {
                return 1 /* Android */;
            }
            if (/windows/i.test(dom.ua) && /phone/i.test(dom.ua)) {
                return 3 /* WinPhone */;
            }
            return 0 /* PC */;
        }
        dom.device = device;
        (function (DeviceType) {
            DeviceType[DeviceType["Android"] = 1] = "Android";
            DeviceType[DeviceType["IOS"] = 2] = "IOS";
            DeviceType[DeviceType["WinPhone"] = 3] = "WinPhone";
            DeviceType[DeviceType["PC"] = 0] = "PC";
            DeviceType[DeviceType["Other"] = -1] = "Other";
        })(dom.DeviceType || (dom.DeviceType = {}));
        var DeviceType = dom.DeviceType;
    })(dom = alcedo.dom || (alcedo.dom = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/13.
 */
var alcedo;
(function (alcedo) {
    var dom;
    (function (dom) {
        var DomEvents = (function (_super) {
            __extends(DomEvents, _super);
            function DomEvents() {
                _super.apply(this, arguments);
            }
            DomEvents.ON_FOCUS = "dom_ON_FOCUS";
            DomEvents.ON_LOST_FOCUS = "dom_ON_LOST_FOCUS";
            return DomEvents;
        })(alcedo.Event);
        dom.DomEvents = DomEvents;
        var StyleEvent = (function (_super) {
            __extends(StyleEvent, _super);
            function StyleEvent() {
                _super.apply(this, arguments);
            }
            StyleEvent.TRAN_SITION_END = "dom_webkitTransitionEnd";
            return StyleEvent;
        })(alcedo.Event);
        dom.StyleEvent = StyleEvent;
    })(dom = alcedo.dom || (alcedo.dom = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/5/4.
 */
var alcedo;
(function (alcedo) {
    var dom;
    (function (dom) {
        var TouchEvent = (function (_super) {
            __extends(TouchEvent, _super);
            function TouchEvent() {
                _super.apply(this, arguments);
            }
            TouchEvent.TOUCH_BEGIN = "dom_touchbegin";
            TouchEvent.TOUCH_END = "dom_touchend";
            TouchEvent.TOUCH_TAP = "dom_touchtap";
            return TouchEvent;
        })(alcedo.Event);
        dom.TouchEvent = TouchEvent;
    })(dom = alcedo.dom || (alcedo.dom = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/13.
 */
var alcedo;
(function (alcedo) {
    function px(value) {
        return value.toFixed(1) + "px";
    }
    alcedo.px = px;
    function percent(value) {
        return value.toFixed(1) + "%";
    }
    alcedo.percent = percent;
})(alcedo || (alcedo = {}));
