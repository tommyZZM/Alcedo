declare module alcedo {
    /**
     * 获取类名,不包括命名空间
     * @param obj
     * @returns {string}
     */
    function getClassName(obj: any): string;
    /**
     * 判断类型是否继承?类型
     * @returns {boolean}
     * @param targetClass
     * @param testClass
     */
    function isOfClass(targetClass: any, testClass: any): boolean;
    function expandMethod(method: string | Function, target: Function, thisArg?: any): Function;
}
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
}
/**
 * Created by tommyZZM on 2015/4/4.
 */
declare module alcedo {
    class AppNotifyable {
        static registNotify(notifymap: any, name: string, callback: Function, thisObject: any, param?: Array<any>, priority?: number): boolean;
        static unregistNotify(notifymap: any, name: string, callback: Function, thisObject: any): void;
        static notify(notifymap: any, name: string, param?: Array<any>): boolean;
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
/**
 * Created by tommyZZM on 2015/4/3.
 */
declare module alcedo {
    class EventDispatcher extends AppObject {
        protected _eventsMap: any;
        constructor();
        addEventListener(event: string, listener: Function, thisObject: any, priority?: number): void;
        clearEventListener(event: string): void;
        removeEventListener(event: string, listener: Function, thisObject: any): void;
        dispatchEvent(event: Event): any;
        emit(event: string, data?: any): any;
    }
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
interface Math {
    randomFrom(num1: number, num2: number): any;
}
/**
 * Created by tommyZZM on 2015/4/5.
 */ declare module alcedo {
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
 * Created by tommyZZM on 2015/4/8.
 */
declare module alcedo {
    module art {
        function HexToColorString(value: number): string;
        function StringToColorHex(value: string): number;
        function HexToRGB(value: number | string): Array<number>;
        function RGBToHex(r: number | Array<any>, g?: number, b?: number): string;
    }
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
declare module alcedo {
}
/**
 * Created by tommyZZM on 2015/4/9.
 */
declare module alcedo {
    function checkNormalType(data: any): boolean;
    function toValue(str: string): number;
    /**
     * TryCatch隔离
     * @param fn
     * @param onerror
     * @param thisObject
     */
    function tryExecute(fn: Function, onerror?: Function, thisObject?: any): void;
}
