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
            this._eventTarget = this;
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
        AppSubCore.prototype.dispatchDemand = function (event, courier) {
            this.emit(event, courier);
        };
        return AppSubCore;
    })(alcedo.EventDispatcher);
    alcedo.AppSubCore = AppSubCore;
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
//相加
Math.add = function () {
    var nums = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nums[_i - 0] = arguments[_i];
    }
    var result = 0;
    for (var i = 0; i < nums.length; i++) {
        if (Number(nums[i])) {
            result += Number(nums[i]);
        }
        else {
        }
    }
    return result;
};
//可能性分布概率池
Math.probabilityPool = function probabilityPool(pool) {
    if (pool.length == 1) {
        pool.push(1 - pool[0]);
    }
    var cdf = this.probabilityPool._cache.get(pool);
    var y = Math.random();
    for (var x in cdf)
        if (y < cdf[x])
            return Number(x);
    return -1; // should never runs here, assuming last element in cdf is 1
};
/**缓存数组**/
Math.probabilityPool._cache = {
    pool: {},
    length: 0,
    get: function (array) {
        var cachename = array.join("_");
        if (!this.pool[cachename]) {
            if (this.length > 100) {
                this.length = 0;
                this.pool = {};
            }
            this.length++;
            this.pool[cachename] = Math.probabilityPool._pdf2cdf(array);
        }
        return this.pool[cachename];
    }
};
/**逆变换取样**/
Math.probabilityPool._pdf2cdf = function (pdf) {
    var total = 0;
    for (var i = 0; i < pdf.length; i++) {
        total += pdf[i];
        if (total > 1) {
            total -= pdf[i];
            //warn('total probability in',pdf," scene",pdf[i],'['+i+'] is > 1');
            pdf.splice(i, pdf.length - i);
            break;
        }
    }
    if (total < 1) {
        pdf.push(1);
    }
    var cdf = pdf.slice();
    for (var i = 1; i < cdf.length - 1; i++) {
        cdf[i] += cdf[i - 1];
    }
    // Force set last cdf to 1, preventing floating-point summing error in the loop.
    cdf[cdf.length - 1] = 1;
    //trace(pdf,cdf,total)
    return cdf;
};
/**
 * Created by tommyZZM on 2015/4/25.
 */
Object.defineProperty(Array.prototype, 'fastRemove', {
    value: function (index) {
        var result = this[index];
        if (this.length == 1) {
            this.length = 0;
            return result;
        }
        this[index] = this.pop();
        return result;
    },
    enumerable: false
});
Object.defineProperty(Array.prototype, 'first', {
    get: function () {
        return this[0];
    },
    enumerable: false
});
Object.defineProperty(Array.prototype, 'last', {
    get: function () {
        return this[this.length - 1];
    },
    enumerable: false
});
Object.defineProperty(Array.prototype, 'randomselect', {
    value: function () {
        if (this.length < 1) {
            return;
        }
        if (this.length == 1) {
            return this[0];
        }
        var i = Math.randomFrom(0, this.length) ^ 0;
        return this[i];
    },
    enumerable: false
});
Object.defineProperty(Array.prototype, 'copy', {
    value: function () {
        var result = [];
        for (var i = 0; i < this.length; i++) {
            result[i] = this[i];
        }
        return result;
    },
    enumerable: false
});
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
    alcedo.a$;
    alcedo.isdebug = false;
    /**
     * 获得一个业务核心
     * @param core
     * @returns {undefined|*|null|null}
     * @param name
     */
    function core(core, name) {
        return alcedo.a$.core(core, name);
    }
    alcedo.core = core;
    /**
     * 向指定业务核心发布一个命令
     * @param core
     * @param cmd
     * @param courier
     */
    function dispatchCmd(core, cmd, courier) {
        if (courier === void 0) { courier = {}; }
        alcedo.a$.dispatchCmd(core, cmd, courier);
    }
    alcedo.dispatchCmd = dispatchCmd;
    /**
     * 侦听业务核心的回调
     * @param core
     * @param type
     * @param callback
     * @param thisObject
     * @returns {boolean}
     */
    function addDemandListener(core, type, callback, thisObject, priority) {
        return alcedo.a$.addDemandListener(core, type, callback, thisObject, priority);
    }
    alcedo.addDemandListener = addDemandListener;
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
        AppOverCore.prototype.dispatchCmd = function (core, cmd, courier) {
            if (courier === void 0) { courier = {}; }
            if (!(core instanceof alcedo.AppSubCore))
                this.core(core);
            courier._cmd = cmd;
            this._postman.setNotify(core, cmd, courier);
            this.dispatchEvent(this._postman);
        };
        //侦听业务核心的回调
        AppOverCore.prototype.addDemandListener = function (core, type, callback, thisObject, priority) {
            if (isOfClass(core, alcedo.AppSubCore)) {
                var c = this.core(core);
                c.addEventListener(type, callback, thisObject, priority);
                return true;
            }
            return false;
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
                this.windowConfigure();
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
 * Created by tommyZZM on 2015/4/4.
 */
//var ap:any = aperture;
var alcedo;
(function (alcedo) {
    var AppLauncher = (function () {
        function AppLauncher(debug) {
            if (AppLauncher._instance) {
                return;
            }
            alcedo.isdebug = debug;
            alcedo.debuginit();
            info("%cAlcedo", "color:#1ac2ff;font-weight:bold;", "A Simple TypeScript HTML5 Game FrameWork!");
            info("gitHub:", 'https://github.com/tommyZZM/Alcedo');
            info("If you are a non-employee who has discovered this facility amid the ruins of civilization.\n" + "Welcome! And remember: Testing is the future, and the future starts with you.");
            alcedo.a$ = alcedo["@AppOverCore"].instance;
        }
        AppLauncher.prototype.launch = function (app, courier) {
            if (this._launched)
                return;
            this._launched = true;
            alcedo.a$.dispatchCmd(app, AppLauncher.START_UP, courier);
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
 * Created by tommyZZM on 2015/4/11.
 */
var alcedo;
(function (alcedo) {
    var Profiler = (function (_super) {
        __extends(Profiler, _super);
        function Profiler(context) {
            _super.call(this);
            this._updatedelay = 0;
            this._maincontext = context;
            this._profilerdiv = alcedo.dom.query("<div style='font-family:Microsoft Yahei;background-color: black;opacity: 0.6;color: #fff;line-height: 1.3;padding: 3px'>" + "<p style='margin: 0;'>FPS:<span class='fps'>60</span></p>" + "<p style='margin: 0;' class='rendertype'>...</p>" + "</div>")[0];
            this._profilerdiv.css({ position: "absolute" });
            this._profilerdiv.addClass(alcedo.canvasStyleClass.alcedo_canvas_profiler);
            this.visible = false;
            this._maincontext.stage.addEventListener(alcedo.Stage.ENTER_MILLSECOND10, this.update, this);
            this._maincontext.container.prependChild(this._profilerdiv);
            this._rendertype = this._profilerdiv.find(".rendertype")[0];
        }
        Object.defineProperty(Profiler.prototype, "renderType", {
            set: function (renderer) {
                if (renderer instanceof PIXI.CanvasRenderer) {
                    this._rendertype.innerContent("Pixi Canvas");
                    return;
                }
                if (renderer instanceof PIXI.WebGLRenderer) {
                    this._rendertype.innerContent("Pixi WebGL");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Profiler.prototype, "visible", {
            set: function (visible) {
                if (visible) {
                    this._profilerdiv.show();
                }
                else {
                    this._profilerdiv.hide();
                }
            },
            enumerable: true,
            configurable: true
        });
        Profiler.prototype.update = function (e) {
            this._updatedelay++;
            if (this._updatedelay < 20) {
                return;
            }
            this._updatedelay = 0;
            this._profilerdiv.find(".fps")[0].innerContent(e.fps);
        };
        return Profiler;
    })(alcedo.AppObject);
    alcedo.Profiler = Profiler;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 1015/4/11.
 */
var alcedo;
(function (alcedo) {
    var Ticker = (function (_super) {
        __extends(Ticker, _super);
        function Ticker(context) {
            _super.call(this);
            this._fps = 0;
            this._total10microsecond = 0;
            this._totalsecond = 0;
            this._countmicrosecond = 0;
            this._count10microsecond = 0;
            this._last10microsecond = 0;
            this._stage = context.stage;
            this._stage.onenterframe(this.update, this);
            this._lostfocustime = 0;
            alcedo.dom.addEventListener(alcedo.dom.DomEvents.ON_FOCUS, this.onWindowFocus, this);
            alcedo.dom.addEventListener(alcedo.dom.DomEvents.ON_LOST_FOCUS, this.onWindowLostFocus, this);
        }
        Ticker.prototype.onWindowFocus = function (e) {
            if (!this._lostfocustime)
                return;
            this._lostfocustime = e.time - this._lostfocustime;
            //trace("onWindowFocus",this._lostfocustime)
        };
        Ticker.prototype.onWindowLostFocus = function (e) {
            //trace("onWindowLostFocus")
            this._lostfocustime = e.time;
        };
        Ticker.prototype.update = function (e) {
            var i, dt = e.dt, _counter;
            //if(e.dt>=100)e.dt=100;
            if (this._lostfocustime > 0 && e.dt > this._lostfocustime) {
                dt = e.dt - this._lostfocustime; //trace("ReFocus",e.dt,this._lostfocustime,dt)
                this._lostfocustime = 0;
            }
            if (dt > 102.20)
                dt = 102.20; //Magic Number
            this._countmicrosecond += dt;
            this._fps = 1000 / dt;
            //TODO:不使用for循环,改成50毫秒
            _counter = +(this._countmicrosecond / 10) ^ 0;
            if (_counter >= 1) {
                this._total10microsecond += _counter;
                this._stage.emit(alcedo.Stage.ENTER_MILLSECOND10, { fps: this.fps(), count: this._total10microsecond, dt: dt, delay: _counter });
                //trace("10microsecode",_counter)
                this._countmicrosecond = 0;
            }
            this._count10microsecond += (this._total10microsecond - this._last10microsecond);
            _counter = +(this._count10microsecond / 100) ^ 0;
            if (_counter >= 1) {
                this._stage.emit(alcedo.Stage.ENTER_SECOND, { fps: this.fps(), count: this._totalsecond, dt: dt, delay: _counter });
                this._count10microsecond = 0;
            }
            this._last10microsecond = this._total10microsecond;
        };
        Ticker.prototype.fps = function () {
            return +this._fps.toFixed(0);
        };
        return Ticker;
    })(alcedo.AppSubCore);
    alcedo.Ticker = Ticker;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/6.
 */
var alcedo;
(function (alcedo) {
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
                this._node.addEventListener("DOMSubtreeModified", this._onmodified.bind(this));
                this._node.addEventListener('transitionend', this._oncsstransitionend.bind(this), false);
                this._node.addEventListener("webkitTransitionEnd", this._oncsstransitionend.bind(this), false);
            };
            /**
             * Event
             **/
            /**
             * Touch事件
             **/
            DomElement.prototype.emitTouchEvent = function (e, event) {
                if (e.changedTouches) {
                    var l = e.changedTouches.length;
                    for (var i = 0; i < l; i++) {
                        var touchtarget = e.changedTouches[i];
                        touchtarget.type = event;
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
            DomElement.prototype._onmouse = function (e) {
                //trace("_onmouse",e);
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
 * Created by tommyZZM on 2015/5/25.
 */
var alcedo;
(function (alcedo) {
    alcedo.canvasStyleClass = {
        alcedo_canvas: "alcedo-canvas",
        alcedo_canvas_ui: "alcedo-canvas-ui",
        alcedo_canvas_container: "alcedo-canvas-container",
        alcedo_canvas_profiler: "alcedo-canvas-profiler",
    };
    var MainContext = (function (_super) {
        __extends(MainContext, _super);
        function MainContext(stage, canvas) {
            _super.call(this);
            this._stage = stage;
            this._designwidth = this._stage.stageWidth;
            this._designheight = this._stage.stageHeight;
            this._designw2h = this._designwidth / this._designheight;
            this._canvas = canvas;
            this._canvascontainer = alcedo.dom.query("<div></div>")[0];
            this._canvascontainer.styleClass = this._canvas.styleClass;
            this._canvascontainer.insertBefore(this._canvas);
            this._canvascontainer.appendChild(this._canvas);
            this._ticker = new alcedo.Ticker(this);
            if (this._stage.options.profiler === true) {
                this._profiler = new alcedo.Profiler(this);
                this._profiler.visible = true;
            }
            this._canvas.addClass(alcedo.canvasStyleClass.alcedo_canvas);
            this._canvascontainer.addClass(alcedo.canvasStyleClass.alcedo_canvas_container);
            this.createui();
            this.run();
        }
        //创建dom ui;
        MainContext.prototype.createui = function () {
            var id = "";
            if (this._stage.options.ui === true) {
                this._canvasui = alcedo.dom.query("<div></div>")[0];
                id = this._canvas.id + "_ui";
            }
            if (typeof this._stage.options.ui == "string") {
                this._canvasui = alcedo.dom.query("#" + this._stage.options.ui)[0];
                id = this._stage.options.ui;
            }
            if (!this._canvasui) {
                this._canvasui = alcedo.dom.query("<div></div>")[0];
            }
            if (this._canvasui) {
                this._canvasui.id = id;
                this._canvasui.insertBefore(this._canvas);
                this._canvasui.addClass(alcedo.canvasStyleClass.alcedo_canvas_ui);
                this._canvasui.css({ position: "absolute", width: "100%" }); //,width:"100%",height:"100%"
                if (typeof this.canvas.index == "number") {
                    this._canvasui.css({ "z-index": Math.add(this.canvas.index, 1) });
                }
                else {
                }
            }
        };
        MainContext.prototype.run = function () {
            //Improtant:new a PIXI Renderer
            this._canvasrenderer = PIXI.autoDetectRenderer(this._designwidth, this._designheight, {
                view: this.canvas.node,
                antialiasing: false,
                transparent: false,
                resolution: 1,
                clearBeforeRendering: false,
                preserveDrawingBuffer: false,
                forceFXAA: false,
                backgroundColor: this._stage.options.backgroundColor
            });
            if (this._profiler) {
                this._profiler.renderType = this._canvasrenderer;
            }
            this._canvascontainer.css_transition = 10;
            this._canvascontainer.addEventListener(alcedo.dom.StyleEvent.TRAN_SITION_END, this.onResizeComplete, this);
            this._mainloopcallback = this.mainloop.bind(this);
            this.mainloop();
        };
        MainContext.prototype.mainloop = function () {
            requestAnimationFrame(this._mainloopcallback);
            this._stage.render(this._canvasrenderer);
        };
        MainContext.prototype.resizeContext = function () {
            var currstylew2h = this.containerStyleW2h;
            if (this.checkorient()) {
                currstylew2h = 1 / currstylew2h;
            }
            if (currstylew2h > this._designw2h) {
                //this._stage._stageHeight = toValue(this._canvas.abscss().height);
                this._stage.setStageHeight(this._designheight);
                this._stage.setStageWidth(this._stage.stageHeight * currstylew2h);
            }
            else {
                this._stage.setStageWidth(this._designwidth);
                this._stage.setStageHeight(this._stage.stageWidth / currstylew2h);
            }
            //trace(this._stage.stageWidth,this._stage.stageHeight)
            this._canvas.node["width"] = this._stage.stageWidth;
            this._canvas.node["height"] = this._stage.stageHeight;
            this._canvascontainer.css({ width: this._canvas.styleWidth, height: 0 });
            //console.log("resized");
        };
        MainContext.prototype.onResizeComplete = function () {
            this._stage.emit(alcedo.Stage.RESIZED);
        };
        Object.defineProperty(MainContext.prototype, "container", {
            get: function () {
                return this._canvascontainer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainContext.prototype, "canvas", {
            get: function () {
                return this._canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainContext.prototype, "gasket", {
            get: function () {
                return this._canvasgasket;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainContext.prototype, "canvasui", {
            get: function () {
                return this._canvasui;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainContext.prototype, "stage", {
            get: function () {
                return this._stage;
            },
            enumerable: true,
            configurable: true
        });
        MainContext.prototype.checkorient = function () {
            var currstylew2h = this.containerStyleW2h;
            if (this._stage.options.orient === true) {
                if (this._designw2h > 1) {
                    if (!(currstylew2h > 1)) {
                        return true;
                    }
                }
                else {
                    if (currstylew2h > 1) {
                        return true;
                    }
                }
            }
            return false;
        };
        Object.defineProperty(MainContext.prototype, "containerStyleW2h", {
            get: function () {
                return alcedo.toValue(this._canvas.abscss().width) / alcedo.toValue(this._canvas.abscss().height);
            },
            enumerable: true,
            configurable: true
        });
        return MainContext;
    })(alcedo.EventDispatcher);
    alcedo.MainContext = MainContext;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/8.
 */
var Art;
(function (Art) {
    function toColorString(value) {
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
    Art.toColorString = toColorString;
})(Art || (Art = {}));
/**
 * Created by tommyZZM on 2015/4/24.
 */
/**
 * Created by tommyZZM on 2015/4/28.
 */
//定义一个快捷扩展对象属性的方法 
/**
 * Created by tommyZZM on 2015/4/6.
 */
var alcedo;
(function (alcedo) {
    var Constant = (function () {
        function Constant() {
        }
        /**
         * 得到对应角度值的sin近似值
         * @param value {number} 角度值
         * @returns {number} sin值
         */
        Constant.sin = function (value) {
            var result = 0;
            if (value % (Constant.PI_2 * Constant.RAD_TO_DEG)) {
                result = Math.sin(value);
            }
            else {
                result = 0;
            }
            return result;
        };
        /**
         * 得到对应角度值的cos近似值
         * @param value {number} 角度值
         * @returns {number} cos值
         */
        Constant.cos = function (value) {
            var result = 0;
            if (value % (Constant.PI_2 * Constant.RAD_TO_DEG)) {
                result = Math.cos(value);
            }
            else {
                result = 1;
            }
            return Math.cos(value);
        };
        Constant.PI = 3.14;
        /**
         * @property {Number} PI_2
         */
        Constant.PI_2 = Math.PI * 2;
        /**
         * @property {Number} RAD_TO_DEG
         */
        Constant.RAD_TO_DEG = 180 / Math.PI;
        /**
         * @property {Number} DEG_TO_RAD
         */
        Constant.DEG_TO_RAD = Math.PI / 180;
        return Constant;
    })();
    alcedo.Constant = Constant;
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
/**
 * Created by tommyZZM on 2015/4/9.
 */
var alcedo;
(function (alcedo) {
    var net;
    (function (net) {
        var RequestMethod = (function () {
            function RequestMethod() {
            }
            RequestMethod.GET = "get";
            RequestMethod.POST = "post";
            return RequestMethod;
        })();
        net.RequestMethod = RequestMethod;
        var RequestDataType = (function () {
            function RequestDataType() {
            }
            /**
             * 指定以原始二进制数据形式接收下载的数据。
             */
            RequestDataType.BINARY = "binary";
            /**
             * 指定以文本形式接收已下载的数据。
             */
            RequestDataType.TEXT = "text";
            /**
             * 指定以JSON形式接收已下载的数据。
             */
            RequestDataType.JSON = "json";
            return RequestDataType;
        })();
        net.RequestDataType = RequestDataType;
        var DataType = (function () {
            function DataType() {
            }
            DataType.TEXT = "text";
            DataType.JSON = "json";
            DataType.IMAGE = "image";
            DataType.SOUND = "sound";
            DataType.SCRIPT = "script";
            return DataType;
        })();
        net.DataType = DataType;
    })(net = alcedo.net || (alcedo.net = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var net;
    (function (net) {
        /**Ajax请求**/
        function ajax(url, args, thisArg) {
            if (args.async == undefined) {
                args.async = true;
            }
            alcedo.a$.core(AsyncProxy).ajax(url, args, thisArg);
        }
        net.ajax = ajax;
        /**异步载入图片**/
        function asyncImage(url, args, thisArg) {
            alcedo.a$.core(AsyncProxy).asyncImage(url, args, thisArg);
        }
        net.asyncImage = asyncImage;
        var AsyncProxy = (function (_super) {
            __extends(AsyncProxy, _super);
            function AsyncProxy() {
                _super.call(this);
                this._asyncimagepool = new Dict();
            }
            AsyncProxy.prototype.bindcallback = function (args, thisArg) {
                if (thisArg) {
                    if (args.success)
                        args.success = args.success.bind(thisArg);
                    if (args.error)
                        args.error = args.error.bind(thisArg);
                }
                return args;
            };
            /**
             * ajax方法
             * @param url
             * @param method
             * @param args
             * @param thisArg
             */
            AsyncProxy.prototype.ajax = function (url, args, thisArg) {
                //default value;
                var xhr = this.getXHR();
                args.method = args.method ? args.method : "get";
                if (args.responseType == net.RequestDataType.BINARY) {
                    xhr.responseType = net.RequestDataType.BINARY;
                }
                if (args.responseType == net.RequestDataType.BINARY) {
                    //warn(url,"AjaxResponseType.BINARY require method of post")
                    args.method = "post";
                }
                args = this.bindcallback(args, thisArg);
                if (!alcedo.checkNormalType(args.data) || args.data) {
                    var _datastr = "";
                    for (var i in args.data) {
                        if (alcedo.checkNormalType(args.data[i])) {
                            _datastr += "&" + i + "=" + args.data[i];
                        }
                    }
                    args.data = _datastr;
                }
                xhr.onreadystatechange = function () {
                    // 4 = "finish"
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var data = "";
                            switch (args.responseType) {
                                default:
                                case net.RequestDataType.TEXT: {
                                    data = xhr.responseText;
                                    break;
                                }
                                case net.RequestDataType.JSON: {
                                    //TODO:tryCatch隔离
                                    alcedo.tryExecute(function () {
                                        data = JSON.parse(xhr.responseText);
                                    }, function () {
                                        console.warn("data is not a json type", { data: xhr.responseText });
                                    });
                                    break;
                                }
                                case net.RequestDataType.BINARY: {
                                    data = xhr.response;
                                    break;
                                }
                            }
                            args.success(data, args.courier);
                        }
                        if (xhr.stage >= 400) {
                            args.error(xhr.status);
                        }
                    }
                };
                xhr.open(args.method, url, args.async, args.user, args.password);
                if (args.method == net.RequestMethod.GET || !args.data) {
                    xhr.send();
                }
            };
            AsyncProxy.prototype.getXHR = function () {
                if (window["XMLHttpRequest"]) {
                    return new window["XMLHttpRequest"]();
                }
                else if (window["ActiveXObject"]) {
                    return new ActiveXObject("MSXML2.XMLHTTP");
                }
                else {
                    console.error("XMLHttpRequest not support on this device!");
                }
            };
            AsyncProxy.prototype.asyncImage = function (url, args, thisArg) {
                var _this = this;
                args = this.bindcallback(args, thisArg);
                if (!this._asyncimagepool.has(url)) {
                    var image = new Image();
                    image.onload = function () {
                        _this._asyncimagepool.set(url, image);
                        args.success(_this._asyncimagepool.get(url), args.courier);
                    };
                    image.onerror = args.error;
                    image.src = url;
                }
                else {
                    args.success(this._asyncimagepool.get(url), args.courier);
                }
            };
            AsyncProxy.instanceable = true;
            return AsyncProxy;
        })(alcedo.AppSubCore);
        net.AsyncProxy = AsyncProxy;
    })(net = alcedo.net || (alcedo.net = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/9.
 */
var alcedo;
(function (alcedo) {
    var net;
    (function (net) {
        var AsyncAssetsLoader = (function (_super) {
            __extends(AsyncAssetsLoader, _super);
            function AsyncAssetsLoader() {
                _super.call(this);
                this._thread = 2; /**最大并发鲜橙树**/
                this._threadCound = 0;
                /**
                 * 加载单个资源
                 * @type {Array}
                 * @private
                 */
                this._assets_loading_tasks = [];
                this._assets_groups_loading = new Dict();
                this._assets_groups_loaded = new Dict();
                this._assets_pool = new Dict();
                this._assets_groups = new Dict();
                this._assets_configs = new Dict();
                this._assets_groups_waitingload = [];
                this._basedir = window.location.href.replace(/\w+\.(html|htm)$/, "");
            }
            /**
             * 通过url,加载一个资源文件配置
             * @param configurl
             */
            AsyncAssetsLoader.prototype.addConfig = function (configurl) {
                var _this = this;
                if (this._assets_configs.has(configurl)) {
                    return;
                }
                var _configurl = configurl.indexOf("://") < 0 ? (this._basedir + "/" + configurl) : configurl;
                this._assets_configs.set(_configurl, { configed: false, refdir: _configurl.replace(/\w+\.json$/, "") });
                net.ajax(_configurl, {
                    success: function (data) {
                        var i, _config = JSON.parse(data);
                        _this._assets_configs.get(_configurl).configed = true;
                        for (i = 0; i < _config.resources.length; i++) {
                            _this._assets_pool.set(_config.resources[i].name, _config.resources[i]);
                        }
                        for (i = 0; i < _config.groups.length; i++) {
                            if (!_this._assets_groups.has(_config.groups[i].name)) {
                                _config.groups[i].loaded = false;
                                _config.groups[i].refdir = _configurl.replace(/\w+\.json$/, "");
                                _this._assets_groups.set(_config.groups[i].name, _config.groups[i]);
                            }
                        }
                        _this.loadGroup(_this._assets_groups_waitingload);
                    }
                });
            };
            /**
             * 加载组
             * @param names
             */
            AsyncAssetsLoader.prototype.loadGroup = function () {
                var names = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    names[_i - 0] = arguments[_i];
                }
                var i, j, _names, _name;
                if (Array.isArray(names[0]))
                    names = names[0];
                if (names.length < 1)
                    return;
                for (i = 0; i < this._assets_configs.size; i++) {
                    if (!this._assets_configs.values[i].configed) {
                        _names = [];
                        for (j = 0; j < names.length; j++) {
                            if (this._assets_groups_waitingload.indexOf(names[j]) < 0) {
                                _names.push(names[j]);
                            }
                        }
                        this._assets_groups_waitingload = this._assets_groups_waitingload.concat(_names);
                        return;
                    }
                }
                this._assets_groups_waitingload = [];
                for (i = 0; i < names.length; i++) {
                    _name = names[i];
                    if (this._assets_groups.has(_name) && !this._assets_groups_loaded.get(_name)) {
                        var assetsobjs = [], assets = this._assets_groups.get(_name).keys;
                        assets = assets.split(",");
                        for (j = 0; j < assets.length; j++) {
                            var assetsobj = this._assets_pool.get(assets[j]);
                            if (assetsobj)
                                assetsobjs.push(assetsobj);
                        }
                        this.loadAssets(assetsobjs, _name, this._assets_groups.get(_name).refdir);
                    }
                }
            };
            /**
             * 资源组
             */
            AsyncAssetsLoader.prototype.loadAssets = function (assets, groupname, basedir) {
                //console.log(basedir);
                if (assets && Array.isArray(assets)) {
                    this._assets_groups_loading.set(groupname, 0);
                    this._assets_groups_loaded.set(groupname, { length: assets.length, complete: false });
                    for (var i = 0; i < assets.length; i++) {
                        var asset = assets[i];
                        var name = asset.name;
                        if (alcedo.core(net.AsyncRES).get(name)) {
                            continue;
                        }
                        this.loadAsset(asset, groupname, basedir);
                    }
                }
            };
            AsyncAssetsLoader.prototype.loadAsset = function (asset, groupname, basedir) {
                var _this = this;
                if (this._threadCound >= this._thread) {
                    this._assets_loading_tasks.push([asset, groupname, basedir]);
                    return;
                }
                this._threadCound++;
                switch (asset.type) {
                    default:
                    case net.DataType.IMAGE:
                        {
                            net.asyncImage(basedir + "/" + asset.url, {
                                success: function (image, courier) {
                                    alcedo.core(net.AsyncRES).set(courier.name, image); //{type:asset.type,res:image}
                                    _this._oneAsssetComplete(groupname);
                                },
                                error: function () {
                                    _this._oneAsssetComplete(groupname);
                                },
                                courier: {
                                    name: asset.name //防止变量提升,把name存进courier里
                                }
                            }, this);
                        }
                        break;
                    case net.DataType.JSON: {
                        net.ajax(basedir + "/" + asset.url, {
                            success: function (json, courier) {
                                var _jsonobj;
                                try {
                                    _jsonobj = JSON.parse(json);
                                }
                                catch (e) {
                                    trace(json, "format error!");
                                    _this._oneAsssetComplete(groupname);
                                    return;
                                }
                                alcedo.core(net.AsyncRES).set(courier.name, _jsonobj); //{type:asset.type,res:image}
                                _this._oneAsssetComplete(groupname);
                            },
                            error: function () {
                                _this._oneAsssetComplete(groupname);
                            },
                            courier: {
                                name: asset.name //防止变量提升,把name存进courier里
                            }
                        });
                    }
                }
            };
            /**一个资源加载结束**/
            AsyncAssetsLoader.prototype._oneAsssetComplete = function (counter) {
                var a = this._assets_groups_loading.get(counter) + 1;
                this._assets_groups_loading.set(counter, a);
                this._threadCound--;
                //trace(counter,this._assets_loaded.get(counter).length,this._assets_loading.get(counter))
                //trace(this._assets_loading_tasks)
                if (this._assets_loading_tasks.length > 0) {
                    this._loadNextAssets();
                }
                if (this._assets_groups_loaded.get(counter).length == this._assets_groups_loading.get(counter)) {
                    this._assets_groups_loaded.get(counter).complete = true;
                    this._oneAsssetsGroupComplete();
                }
            };
            AsyncAssetsLoader.prototype._loadNextAssets = function () {
                var task = this._assets_loading_tasks.shift();
                this.loadAsset(task[0], task[1], task[2]);
            };
            /**一个资源组加载完成了**/
            AsyncAssetsLoader.prototype._oneAsssetsGroupComplete = function () {
                var loadedgroups = this._assets_groups_loaded.values;
                var flag = true;
                for (var i = 0; i < loadedgroups.length; i++) {
                    if (loadedgroups[i].complete == false) {
                        flag = false;
                        break;
                    }
                }
                if (flag)
                    this.emit(net.AsyncRESEvent.ASSETS_COMPLETE);
            };
            AsyncAssetsLoader.instanceable = true;
            return AsyncAssetsLoader;
        })(alcedo.AppSubCore);
        net.AsyncAssetsLoader = AsyncAssetsLoader;
    })(net = alcedo.net || (alcedo.net = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/9.
 */
var alcedo;
(function (alcedo) {
    var net;
    (function (net) {
        var AsyncRESEvent = (function (_super) {
            __extends(AsyncRESEvent, _super);
            function AsyncRESEvent() {
                _super.apply(this, arguments);
            }
            AsyncRESEvent.ASSETS_COMPLETE = "AsyncAssetsEvent_LOAD_COMPLETE";
            AsyncRESEvent.ASSETS_PROGRESSING = "AsyncAssetsEvent_LOAD_ASSETS_PROGRESSING";
            return AsyncRESEvent;
        })(alcedo.Event);
        net.AsyncRESEvent = AsyncRESEvent;
        var AsyncRES = (function (_super) {
            __extends(AsyncRES, _super);
            function AsyncRES() {
                _super.call(this);
                this._assetspool = new Dict();
                this._repeatkey = {};
            }
            AsyncRES.prototype.set = function (key, value) {
                if (this._assetspool.has(key)) {
                    var tmp = this._assetspool.get(key);
                    if (Array.isArray(tmp)) {
                        tmp.push(value);
                        this._assetspool.set(key, tmp);
                    }
                }
                else {
                    this._assetspool.set(key, [value]);
                }
            };
            AsyncRES.prototype.get = function (key) {
                return this._assetspool.get(key);
            };
            AsyncRES.prototype.find = function (reg) {
                var i, keys = this._assetspool.keys, result = [];
                for (i = 0; i < keys.length; i++) {
                    if (reg.test(keys[i])) {
                        if (this.get(keys[i]))
                            result.push(this.get(keys[i])[0]);
                    }
                }
                return result;
            };
            Object.defineProperty(AsyncRES.prototype, "assets", {
                get: function () {
                    return this._assetspool.values;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AsyncRES.prototype, "keys", {
                get: function () {
                    return this._assetspool.keys;
                },
                enumerable: true,
                configurable: true
            });
            AsyncRES.instanceable = true;
            return AsyncRES;
        })(alcedo.AppSubCore);
        net.AsyncRES = AsyncRES;
    })(net = alcedo.net || (alcedo.net = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/5/25.
 */
var alcedo;
(function (alcedo) {
    var Stage = (function (_super) {
        __extends(Stage, _super);
        function Stage(canvas, width, height, opts) {
            if (width === void 0) { width = 320; }
            if (height === void 0) { height = 480; }
            if (opts === void 0) { opts = {}; }
            _super.call(this);
            this._startTime = 0;
            this._lastTime = 0;
            this._options = opts;
            this.setStageWidth(width);
            this.setStageHeight(height);
            this._enterframemap = new Dict();
            this._root = new PIXI.Container();
            this._maincontext = new alcedo.MainContext(this, canvas);
            this.resizeContext();
        }
        //渲染循环
        Stage.prototype.render = function (renderer) {
            renderer.render(this._root);
            this._distapchEnterFrame(renderer); //分发EnterFrame事件
        };
        Stage.prototype._nowTime = function () {
            return Date.now() - this._startTime;
        };
        /**
         * 分发EnterFrame消息
         * @param renderer
         * @private
         */
        Stage.prototype._distapchEnterFrame = function (renderer) {
            var nowTime = this._nowTime();
            var dt = nowTime - this._lastTime;
            //TODO:广播EnterFrame;
            alcedo.AppNotifyable.notify(this._enterframemap, Stage.ENTER_FRAME, [{ dt: dt, renderer: renderer }]);
            this.emit(Stage.ENTER_FRAME, { dt: dt });
            this._lastTime = nowTime;
        };
        Stage.prototype.onenterframe = function (callback, thisOBject) {
            alcedo.AppNotifyable.registNotify(this._enterframemap, Stage.ENTER_FRAME, callback, thisOBject);
        };
        Object.defineProperty(Stage.prototype, "stageWidth", {
            get: function () {
                return this._stageWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "stageHeight", {
            get: function () {
                return this._stageHeight;
            },
            enumerable: true,
            configurable: true
        });
        //设置渲染宽度
        Stage.prototype.setStageWidth = function (width) {
            this._stageWidth = width;
        };
        //设置渲染高度
        Stage.prototype.setStageHeight = function (height) {
            this._stageHeight = height;
        };
        Object.defineProperty(Stage.prototype, "warpper", {
            get: function () {
                return this._maincontext["_canvascontainer"];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "canvas", {
            /**
             * 获得Canvas
             * @returns {alcedo.dom.DomElement}
             */
            get: function () {
                return this._maincontext.canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "canvasui", {
            /**
             * 获得UI层
             * @returns {alcedo.dom.DomElement}
             */
            get: function () {
                return this._maincontext.canvasui;
            },
            enumerable: true,
            configurable: true
        });
        //resize
        Stage.prototype.resizeContext = function () {
            this._maincontext.resizeContext();
        };
        Object.defineProperty(Stage.prototype, "orientchanged", {
            //获得轴向是否改变了
            get: function () {
                return this._maincontext.checkorient();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "options", {
            get: function () {
                return this._options;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "root", {
            get: function () {
                return this._root;
            },
            enumerable: true,
            configurable: true
        });
        Stage.ENTER_FRAME = "Stage_ENTER_FRAME";
        Stage.ENTER_MILLSECOND10 = "Stage_ENTER_20MILLSECOND";
        Stage.ENTER_SECOND = "Stage_ENTER_SECOND";
        Stage.RESIZED = "Stage_RESIZED";
        return Stage;
    })(alcedo.EventDispatcher);
    alcedo.Stage = Stage;
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/5/25.
 */
