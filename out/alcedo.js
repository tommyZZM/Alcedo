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
var alcedo;
(function (alcedo) {
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
    alcedo.getClassName = getClassName;
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
    alcedo.isOfClass = isOfClass;
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
    alcedo.expandMethod = expandMethod;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/3.
 */
var alcedo;
(function (alcedo) {
    var AppObject = (function () {
        function AppObject() {
            this._classname = alcedo.getClassName(this);
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
/**
 * Created by tommyZZM on 2015/4/4.
 */
var alcedo;
(function (alcedo) {
    var AppNotifyable = (function () {
        function AppNotifyable() {
        }
        AppNotifyable.registNotify = function (notifymap, name, callback, thisObject, param, priority) {
            if (!notifymap[name])
                notifymap[name] = [];
            var map = notifymap[name];
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
            notifymap[name] = map;
        };
        AppNotifyable.unregistNotify = function (notifymap, name, callback, thisObject) {
            if (!notifymap[name])
                return;
            var map = notifymap[name];
            if (map) {
                for (var i in map) {
                    var bin = map[i];
                    if (bin && bin.callback === callback && bin.thisObject === thisObject) {
                        map.splice(i, 1);
                    }
                }
                notifymap[name] = map;
            }
        };
        AppNotifyable.notify = function (notifymap, name, param) {
            var map = notifymap[name];
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
/**
 * Created by tommyZZM on 2015/4/3.
 */
var alcedo;
(function (alcedo) {
    var EventDispatcher = (function (_super) {
        __extends(EventDispatcher, _super);
        function EventDispatcher() {
            _super.call(this);
            this._eventsMap = {};
        }
        EventDispatcher.prototype.addEventListener = function (event, listener, thisObject, priority) {
            alcedo.AppNotifyable.registNotify(this._eventsMap, event, listener, thisObject, null, priority);
        };
        EventDispatcher.prototype.clearEventListener = function (event) {
            this._eventsMap[event] = [];
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
                alcedo["@AppOverCore"].instance.postals.set(alcedo["@AppOverCore"].getCoreFullName(this), {});
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
            else if (core["$subcoredict"]) {
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
            this._subcore = {};
            this._postals = {};
            this._boardCastMap = {};
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
            if (!this._postals[e.core]) {
                this._postals[e.core] = {};
            }
            var ant = this._postals[e.core][e.notify];
            if (ant && ant.callback && ant.thisobj) {
                ant.callback.apply(ant.thisobj, [e.courier]);
            }
        };
        AppOverCore.prototype.core = function (core, name) {
            if (alcedo.isOfClass(core, alcedo.AppSubCore)) {
                if (core === alcedo.AppSubCore) {
                    error(core, "could be select");
                    return;
                }
                var corename = alcedo.getClassName(core) + "_" + AppOverCore.getCoreId(core);
                var result = this._subcore[corename];
                if (core.instanceable === true || !name) {
                    if (!result) {
                        this._subcore[corename] = new core();
                    }
                    return this._subcore[corename];
                }
                else if (name) {
                    var proxydict = this._subcore[corename];
                    if (!proxydict || !proxydict["$subcoredict"]) {
                        this._subcore[corename] = {};
                        this._subcore[corename]["$subcoredict"] = true;
                    }
                    if (!this._subcore[corename][name]) {
                        this._subcore[corename][name] = new core();
                    }
                    return this._subcore[corename][name];
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
            if (alcedo.isOfClass(core, alcedo.AppSubCore)) {
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
            if (alcedo.isOfClass(core, alcedo.AppSubCore) || core instanceof alcedo.AppSubCore) {
                return alcedo.getClassName(core) + "_" + this.getCoreId(core);
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
Math.randomFrom = function (begin, to) {
    var d = to - begin, min = to > begin ? begin : to;
    if (d < 0)
        d = -d;
    return Math.random() * d + min;
};
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
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var art;
    (function (art) {
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
        art.HexToColorString = HexToColorString;
        var _rcolourhex = /(0x|#)?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/i;
        function StringToColorHex(value) {
            var _result = _rcolourhex.exec(value + "");
            if (_result && _result[2] && _result[3] && _result[4]) {
                _result = "0x" + _result[2] + _result[3] + _result[4];
            }
            return +_result;
            //return "#"+color;
        }
        art.StringToColorHex = StringToColorHex;
        function HexToRGB(value) {
            var _result = _rcolourhex.exec(value + "");
            _result = [
                parseInt(_result[2], 16),
                parseInt(_result[3], 16),
                parseInt(_result[4], 16)
            ];
            return _result;
        }
        art.HexToRGB = HexToRGB;
        function RGBToHex(r, g, b) {
            var _r = r, _g = g, _b = b;
            if (Array.isArray(r)) {
                _r = r[0];
                _g = r[1];
                _b = r[2];
            }
            return "#" + _r.toString(16) + _g.toString(16) + _b.toString(16);
        }
        art.RGBToHex = RGBToHex;
    })(art = alcedo.art || (alcedo.art = {}));
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
     * TryCatch隔离
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
