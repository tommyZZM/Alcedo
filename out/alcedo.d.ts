/**
 * Created by tommyZZM on 2015/4/3.
 */
declare module alcedo {
    class AppObject {
        constructor();
        /**
         * 哈希计数
         */
        private static hashCount;
        private _aperureHashIndex;
        hashIndex: number;
        private _classname;
        className: string;
    }
    interface ICycable {
        onCreate(): any;
        onDestory(): any;
    }
}
/**
 * Created by tommyZZM on 2015/4/3.
 */
declare module alcedo {
    class EventDispatcher extends AppObject {
        protected _eventsMap: Dict;
        constructor();
        addEventListener(event: string, listener: Function, thisObject: any, priority?: number): void;
        clearEventListener(event: string): void;
        removeEventListener(event: string, listener: Function, thisObject: any): void;
        dispatchEvent(event: Event): any;
        emit(event: string, data?: any): any;
    }
}
declare class Dict {
    private _map;
    private _keys;
    constructor();
    set(key: string, value: any): void;
    get(key: string): any;
    find(reg: RegExp): Array<any>;
    delete(key: string): void;
    has(key: string): boolean;
    clear(): void;
    /** @/deprecated */
    forEach(callbackfn: (value, key?: string) => void, thisArg?: any): void;
    values: any[];
    keys: string[];
    size: number;
}
interface IDict {
    set(key: any, value: any): any;
    get(key: any): any;
    delete(key: any): any;
}
/**
 * Created by tommyZZM on 2015/5/16.
 */
declare module alcedo {
    class AppSubCore extends EventDispatcher {
        constructor();
        startUp(...anyarg: any[]): void;
        shutDown(...anyarg: any[]): void;
        protected addCmdHandler(notify: string, callback: Function): void;
        protected removeCmdHandler(notify: string, callback: Function): void;
    }
}
/**
 * Created by tommyZZM on 2015/4/4.
 */
declare module alcedo {
    class AppNotifyable {
        static registNotify(notifymap: Dict, name: string, callback: Function, thisObject: any, param?: Array<any>, priority?: number): boolean;
        static unregistNotify(notifymap: Dict, name: string, callback: Function, thisObject: any): void;
        static notify(notifymap: Dict, name: string, param?: Array<any>): boolean;
        static notifyArray(arr: Array<{
            callback: Function;
            thisObject: any;
            param: Array<any>;
        }>, param?: Array<any>): void;
    }
}
/**
 * Created by tommyZZM on 2015/4/3.
 */
declare module alcedo {
    class Event extends AppObject {
        protected _type: string;
        protected _courier: any;
        constructor(_type: string, courier?: Array<any>);
        type: string;
        courier: string;
    }
}
interface Math {
    randomFrom(num1: number, num2: number): any;
}
/**
 * Created by tommyZZM on 2015/4/4.
 */
declare module alcedo {
    class FacadeEvent extends Event {
        static UNIQUE: string;
        private _core;
        private _notify;
        constructor();
        setNotify(core: any, notify: string, courier?: any): void;
        core: string;
        notify: string;
    }
}
/**
 * 获取类名,不包括命名空间
 * @param obj
 * @returns {string}
 */
declare function getClassName(obj: any): string;
/**
 * 判断类型是否继承?类型
 * @returns {boolean}
 * @param targetClass
 * @param testClass
 */
declare function isOfClass(targetClass: any, testClass: any): boolean;
declare function expandMethod(method: string | Function, target: Function, thisArg?: any): Function;
/**
 * Created by tommyZZM on 2015/4/4.
 */
declare module alcedo {
    var isdebug: boolean;
    /**
     * 获得一个业务核心
     * @param core
     * @returns {undefined|*|null|null}
     * @param name
     */
    function core(core: any, name?: string): any | AppSubCore;
    /**
     * 向指定业务核心发布一个命令
     * @param core
     * @param cmd
     * @param courier
     */
    function dispatchCmd2Core(core: any, cmd: string, courier?: any): void;
    /**
     * 发布一个命令(所有业务核心)
     * @param cmd
     * @param courier
     */
    function dispatchCmd(cmd: string, courier?: any): void;
    /**
     * 广播
     */
    function dispatchBoardCast(boardcast: string, courier?: any): void;
    /**
     * 广播侦听
     */
    function addBoardCastListener(boardcast: string, listener: Function, thisObject: any, priority?: number): void;
}
/**
 * Created by tommyZZM on 2015/4/3.
 */
declare module alcedo {
    class AppCycler extends AppSubCore {
        constructor();
        protected cmdStartup(...courier: any[]): void;
    }
}
/**
 * Created by tommyZZM on 2015/4/4.
 */
declare module alcedo {
    var config: {
        hellowords: boolean;
    };
    class AppLauncher {
        static START_UP: string;
        private _launched;
        constructor(debug: boolean);
        launch(app: AppCycler, courier?: any): void;
        private static _instance;
        static instance(debug?: boolean): AppLauncher;
    }
    function launch(app: AppCycler, debug?: boolean, courier?: any): void;
}
declare function trace(...msg: any[]): void;
declare function warn(...msg: any[]): void;
declare function info(...msg: any[]): void;
declare function error(...msg: any[]): void;
declare module alcedo {
    function debuginit(): void;
}
/**
 * Created by tommyZZM on 2015/4/5.
 * TODO:Dom元素操作优化
 */
declare module alcedo {
    module dom {
        function ready(callback: Function, thisObject?: any, ...param: any[]): void;
        function resize(callback: Function, thisObject?: any, ...param: any[]): void;
        function query(selector: HTMLElement | string): DomElement[];
        function compare(node1: Node, node2: Node): boolean;
        function addEventListener(event: string, listener: Function, thisObject: any, priority?: number): void;
        function removeEventListener(event: string, listener: Function, thisObject: any, priority?: number): void;
        class DomManager extends EventDispatcher {
            private _readytask;
            private _domtask;
            constructor();
            private usefulDomEvent();
            private _focus;
            private _lastfocusstate;
            private onShow();
            private onHide();
            private windowConfigure();
            /**
             * ready
             */
            private _readychekced;
            private onready();
            private checkready();
            ready(callback: Function, thisObject?: any, ...param: any[]): void;
            /**
             * resized
             */
            private onresize();
            resize(callback: Function, thisObject?: any, ...param: any[]): void;
            /**
             * ele queryer
             */
            private _querypool;
            query(selector: HTMLElement | string): DomElement[];
            htmlele2domele(ele: HTMLElement): DomElement;
            ElementSelector(e: any, context?: Document): any;
            private prase(selector);
            compare(node1: Node, node2: Node): boolean;
            private static _instance;
            static instance: DomManager;
        }
        enum NodeType {
            ELEMENT = 1,
            ARRT = 2,
            TEXT = 3,
            COMMENTS = 8,
            DOCUMENT = 9,
        }
        var _elemark: string;
    }
}
/**
 * Created by tommyZZM on 2015/4/5.
 */
declare module alcedo {
}
/**
 * Created by tommyZZM on 2015/4/8.
 */
declare module Art {
    function HexToColorString(value: number): string;
    function StringToColorHex(value: string): number;
    function HexToRGB(value: number | string): Array<number>;
    function RGBToHex(r: number | Array<any>, g?: number, b?: number): string;
}
/**
 * Created by tommyZZM on 2015/4/9.
 */
declare module alcedo {
    function checkNormalType(data: any): boolean;
    function toValue(str: string): number;
    /**
     * TryCatch����
     * @param fn
     * @param onerror
     * @param thisObject
     */
    function tryExecute(fn: Function, onerror?: Function, thisObject?: any): void;
}
/**
 * Created by tommyZZM on 2015/4/6.
 */
declare module alcedo {
    class uMath {
        static PI: number;
        /**
         * @property {Number} PI_2
         */
        static PI_2: number;
        /**
         * @property {Number} RAD_TO_DEG
         */
        static RAD_TO_DEG: number;
        /**
         * @property {Number} DEG_TO_RAD
         */
        static DEG_TO_RAD: number;
        /**
         * 得到对应角度值的sin近似值
         * @param value {number} 角度值
         * @returns {number} sin值
         */
        static sin(value: number): number;
        /**
         * 得到对应角度值的cos近似值
         * @param value {number} 角度值
         * @returns {number} cos值
         */
        static cos(value: number): number;
    }
}
/**
 * Created by tommyZZM on 2015/4/11.
 */
declare module alcedo {
    module dstruct {
        class QuadTree {
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/6.
 */
declare module alcedo {
    module dom {
        class DomElement extends EventDispatcher {
            private _node;
            private _apid;
            private _designedcss;
            private _domEventnotify;
            constructor(ele: HTMLElement);
            private initevent();
            /**
             * Event
             **/
            private onmousedown(e);
            private onmouseup(e);
            private onmouseclick(e);
            /**
             * Touch事件
             **/
            private emitTouchEvent(e, event);
            private ontouchbegin(e);
            private ontouchmove(e);
            private ontouchend(e);
            private ontouchtap(e);
            private _onmodified(e);
            private _csstransitionSleep;
            private _oncsstransitionend(e);
            /**
             * CSS style
             */
            hasClass(className: any): boolean;
            addClass(className: any): void;
            removeClass(className: any): void;
            styleClass: string;
            css(cssprops: any): DomElement;
            abscss(): any;
            private getcsspropvalue(name);
            styleWidth: string;
            styleHeight: string;
            private _display;
            show(): DomElement;
            hide(): DomElement;
            private _lastindex;
            index: string | number;
            css_transform_to(cssprops: any, transition?: number): DomElement;
            private _rotation;
            css_transform_rotate(angle: number, transition?: number): DomElement;
            css_transform_scale(scale: number, transition?: number): DomElement;
            css_transform_translate(x: number, y: number, transition?: number): DomElement;
            private _lasttransition;
            css_transition: number;
            /**
             * Html Document Object Model
             */
            appendChild(ele: DomElement): DomElement;
            prependChild(ele: DomElement): DomElement;
            insertBefore(ele: DomElement): DomElement;
            removeChild(ele: DomElement): DomElement;
            parent(): DomElement;
            children(fn?: (child) => void): Array<DomElement>;
            find(selector: string): DomElement[];
            innerContent(anything: string): void;
            /**
             * 读取或更改一个自定义属性
             */
            attr(key: any, value?: string): any;
            data(key: any, value?: string): any;
            /**
             * 设置ID
             * @param id
             */
            id: string;
            /**
             * 对于该DomElement元素的唯一ID
             * @returns {number}
             */
            apid: number;
            node: any;
            bound: any;
            tagname: string;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/6.
 */
declare module alcedo {
    module dom {
        function width(): number;
        function height(): number;
        function w2h(): number;
        var ua: any;
        function device(): DeviceType;
        enum DeviceType {
            Android = 1,
            IOS = 2,
            WinPhone = 3,
            PC = 0,
            Other = -1,
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/13.
 */
declare module alcedo {
    module dom {
        class DomEvents extends Event {
            static ON_FOCUS: string;
            static ON_LOST_FOCUS: string;
        }
        class StyleEvent extends Event {
            static TRAN_SITION_END: string;
        }
    }
}
/**
 * Created by tommyZZM on 2015/5/4.
 */
declare module alcedo {
    module dom {
        class TouchEvent extends Event {
            static TOUCH_BEGIN: string;
            static TOUCH_END: string;
            static TOUCH_TAP: string;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/13.
 */
declare module alcedo {
    function px(value: number): string;
    function percent(value: number): string;
}
