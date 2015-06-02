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
        protected _eventTarget: any;
        protected _eventsMap: Dict;
        constructor();
        addEventListener(event: string, listener: Function, thisObject: any, priority?: number): void;
        clearEventListener(event: string): void;
        removeEventListener(event: string, listener: Function, thisObject: any): void;
        dispatchEvent(event: Event): any;
        emit(event: string, data?: any): any;
    }
}
/**
 * Created by tommyZZM on 2015/4/6.
 */
declare module alcedo {
    module canvas {
        class Matrix2D extends AppObject {
            /**
             * 创建一个 canvas.Matrix2D 对象 （3x3矩阵）
             * @param a {number} 缩放或旋转图像时影响像素沿 x 轴定位的值。
             * @param b {number} 旋转或倾斜图像时影响像素沿 y 轴定位的值。
             * @param c {number} 旋转或倾斜图像时影响像素沿 x 轴定位的值。
             * @param d {number} 缩放或旋转图像时影响像素沿 y 轴定位的值。
             * @param tx {number} 沿 x 轴平移每个点的距离。
             * @param ty {number} 沿 y 轴平移每个点的距离。
             *
             * | a | b | tx|
             * | c | d | ty|
             * | 0 | 0 | 1 |
             *
             */
            static identity: Matrix2D;
            constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
            /**
             * [缩放]或[旋转]图像时影响像素沿 x 轴定位的值
             */
            a: number;
            /**
             * [旋转]或[倾斜]图像时影响像素沿 y 轴定位的值
             */
            b: number;
            /**
             * [旋转]或[倾斜]图像时影响像素沿 x 轴定位的值
             */
            c: number;
            /**
             * [缩放]或[旋转]图像时影响像素沿 y 轴定位的值
             */
            d: number;
            /**
             * 沿 x 轴平移每个点的距离
             */
            tx: number;
            /**
             * 沿 y 轴平移每个点的距离
             */
            ty: number;
            /**
             * 前置矩阵
             * @param a {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
             * @param b {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
             * @param c {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
             * @param d {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
             * @param tx {number} 沿 x 轴平移每个点的距离
             * @param ty {number} 沿 y 轴平移每个点的距离
             * @returns {Matrix2D}
             */
            prepend(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix2D;
            /**
             * 后置矩阵
             * @param a {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
             * @param b {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
             * @param c {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
             * @param d {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
             * @param tx {number} 沿 x 轴平移每个点的距离
             * @param ty {number} 沿 y 轴平移每个点的距离
             * @returns {Matrix2D}
             */
            append(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix2D;
            /**
             * 前置矩阵
             * @method Matrix2D#prependTransform
             * @param x {number} x值
             * @param y {number} y值
             * @param scaleX {number} 水平缩放
             * @param scaleY {number} 垂直缩放
             * @param rotation {number} 旋转
             * @param skewX {number} x方向斜切
             * @param skewY {number} y方向斜切
             * @param regX {number} x值偏移
             * @param regY {number} y值偏移
             * @returns {Matrix2D}
             */
            prependTransform(x: number, y: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number, regX: number, regY: number): Matrix2D;
            /**
             * 后置矩阵
             * @method Matrix2D#appendTransform
             * @param x {number} x值
             * @param y {number} y值
             * @param scaleX {number} 水平缩放
             * @param scaleY {number} 垂直缩放
             * @param rotation {number} 旋转
             * @param skewX {number} x方向斜切
             * @param skewY {number} y方向斜切
             * @param regX {number} x值偏移
             * @param regY {number} y值偏移
             * @returns {Matrix2D}
             */
            appendTransform(x: number, y: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number, regX: number, regY: number): Matrix2D;
            /**
             * 对 Matrix2D 对象应用旋转转换。
             * 矩阵旋转，以角度制为单位
             * @method Matrix2D#rotate
             * @param angle {number} 角度
             * @returns {Matrix2D}
             */
            rotate(angle: number): Matrix2D;
            /**
             * 矩阵斜切，以角度值为单位
             * @method Matrix2D#skew
             * @param skewX {number} x方向斜切
             * @param skewY {number} y方向斜切
             * @returns {Matrix2D}
             */
            skew(skewX: number, skewY: number): Matrix2D;
            /**
             * 矩阵缩放
             * @method Matrix2D#scale
             * @param x {number} 水平缩放
             * @param y {number} 垂直缩放
             * @returns {Matrix2D}
             */
            scale(x: number, y: number): Matrix2D;
            /**
             * 沿 x 和 y 轴平移矩阵，由 x 和 y 参数指定。
             * @method Matrix2D#translate
             * @param x {number} 沿 x 轴向右移动的量（以像素为单位）。
             * @param y {number} 沿 y 轴向下移动的量（以像素为单位）。
             * @returns {Matrix2D}
             */
            translate(x: number, y: number): Matrix2D;
            /**
             * 为每个矩阵属性设置一个值，该值将导致 null 转换。
             * 通过应用恒等矩阵转换的对象将与原始对象完全相同。
             * 调用 identity() 方法后，生成的矩阵具有以下属性：a=1、b=0、c=0、d=1、tx=0 和 ty=0。
             * @method Matrix2D#identity
             * @returns {Matrix2D}
             */
            identity(): Matrix2D;
            /**
             * 矩阵重置为目标矩阵
             * @method Matrix2D#identityMatrix
             * @param Matrix2D {Matrix2D} 重置的目标矩阵
             * @returns {Matrix2D}
             */
            identityMatrix(Matrix2D: Matrix2D): Matrix2D;
            /**
             * 执行原始矩阵的逆转换。
             * 您可以将一个逆矩阵应用于对象来撤消在应用原始矩阵时执行的转换。
             * @method Matrix2D#invert
             * @returns {Matrix2D}
             */
            invert(): Matrix2D;
            private _toarray;
            toArray(transpose: any): any;
        }
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
        protected dispatchDemand(event: string, courier?: any): void;
    }
}
/**
 * Created by tommyZZM on 2015/4/8.
 */
declare module alcedo {
    module canvas {
        class DisplayObject extends EventDispatcher implements IDisplayObject {
            protected static ON_UPDATE_BOUND: string;
            /**位置**/
            protected _position: Point2D;
            position: Point2D;
            /**描点**/
            protected _pivot: Vector2D;
            /**缩放**/
            protected _scale: Vector2D;
            scale: Vector2D;
            protected _worldscale: Vector2D;
            /**矩阵变换**/
            protected _worldtransform: Matrix2D;
            worldtransform: Matrix2D;
            /**旋转**/
            protected _rotation: number;
            rotation: number;
            protected _visible: boolean;
            visible: boolean;
            protected _alpha: number;
            protected _worldalpha: number;
            alpha: number;
            worldalpha: number;
            protected _staticboundingbox: Rectangle;
            protected _dirty: boolean;
            protected _texture_to_render: any;
            protected _cacheAsBitmap: boolean;
            /**
             * 显示对象
             */
            constructor();
            x: number;
            y: number;
            private _globalposition;
            globalx: number;
            globaly: number;
            private _updateGlobalPosition();
            width: number;
            height: number;
            protected updateBound(x?: any, y?: any, width?: any, height?: any): void;
            pivotX: number;
            pivotOffsetX: number;
            pivotY: number;
            pivotOffsetY: number;
            scaleToWidth(width: number): void;
            scaleToHeight(height: number): void;
            scaleALL(value: number): void;
            scaleX: number;
            scaleY: number;
            /**
             * 碰撞检测,可以被重写
             * @private
             */
            /**
             * [只读]获得现实对象当前的静态包围盒
             * @returns {Rectangle}
             */
            boundBox(): Rectangle;
            isInViewPort(): boolean;
            /**
             * OverRide position method
             * 主要更新了可视包围盒，TODO:有Bug,待优化
             */
            protected _actualboundingbox: Rectangle;
            actualBound(): Rectangle;
            actualLeftTop(): Point2D;
            actualRightTop(): Point2D;
            actualRightBottom(): Point2D;
            actualLeftBottom(): Point2D;
            actualWidth(): number;
            actualHeight(): number;
            /**
             * 将 point 对象从显示对象的（本地）坐标转换为舞台（全局）坐标。
             * 此方法允许您将任何给定的 x 和 y 坐标从相对于特定显示对象原点 (0,0) 的值（本地坐标）转换为相对于舞台原点的值（全局坐标）。
             * @method canvas.DisplayObject#localToGlobal
             * @param x {number} 本地x坐标
             * @param y {number} 本地y坐标
             * @param resultPoint {Point2D} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
             * @returns 具有相对于舞台的坐标的 Point 对象。
             */
            localToGlobal(x?: number, y?: number, resultPoint?: any): Point2D;
            /**
             * 将指定舞台坐标（全局）转换为显示对象（本地）坐标。
             * @method canvas.DisplayObject#globalToLocal
             * @param x {number} 全局x坐标
             * @param y {number} 全局y坐标
             * @param resultPoint {Point2D} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
             * @returns 具有相对于显示对象的坐标的 Point2D 对象。
             */
            globalToLocal(x?: number, y?: number, resultPoint?: Point2D): Point2D;
            private static identityMatrixForGetConcatenated;
            protected _getConcatenatedMatrix(): Matrix2D;
            /**
             * 显示列表
             */
            /**父节点**/
            protected _parent: DisplatObjectContainer;
            parent: DisplatObjectContainer;
            protected _setParent(parent: DisplatObjectContainer): void;
            protected _stage: Stage;
            protected _onAdd(): void;
            removeFromParent(): void;
            protected _root: DisplatObjectContainer;
            root: DisplatObjectContainer;
            isAddtoStage(): boolean;
            /**
             * 矩阵运算物体在场景中的位置
             * @private
             */
            _transform(): void;
            /**
             * 每帧渲染
             * @private
             */
            protected _render(renderer: CanvasRenderer): void;
            _draw(renderer: CanvasRenderer): void;
            protected _refreshBitmapCache(): void;
            protected _createBitmapCache(): void;
            protected _offset(): any;
            protected _getMatrix(matrix: Matrix2D): Matrix2D;
        }
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
    add(...nums: any[]): any;
    randomFrom(num1: number, num2: number): any;
    probabilityPool(pool: number[]): any;
}
/**
 * Created by tommyZZM on 2015/4/8.
 */
declare module alcedo {
    module canvas {
        /**
         * Bug to fix;
         * 容器Scale有莫名其妙的BUG
         *
         */
        class DisplatObjectContainer extends DisplayObject implements IDisplatObjectContainer {
            protected _children: Array<DisplayObject>;
            constructor();
            children: DisplayObject[];
            _transform(): void;
            protected _render(renderer: CanvasRenderer): void;
            addChild(child: DisplayObject): void;
            private _addChild(child);
            addChildAt(child: DisplayObject, index: number): void;
            setChildIndex(child: DisplayObject, index: number): void;
            removeChild(child: DisplayObject): void;
            removeChildren(): void;
            eachChilder(fn: (child) => void): void;
            protected _onAdd(): void;
        }
        interface IDisplatObjectContainer {
            addChild(child: DisplayObject): any;
            removeChild(child: DisplayObject): any;
            removeChildren(): any;
            eachChilder(fn: (child) => {}): any;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/8.
 */
declare module alcedo {
    module canvas {
        class Point2D implements Ixy {
            x: number;
            y: number;
            private static _identity;
            static identity(x?: number, y?: number): Point2D;
            constructor(x?: number, y?: number);
            /**
             * 克隆点对象
             */
            clone(): Point2D;
            /**
             * 设置X,y
             */
            reset(x?: number, y?: number): void;
            /** 加 **/
            add(vector: Vector2D): Point2D;
            /** 减 **/
            subtract(vector: Vector2D): Point2D;
            /** 乘 **/
            multiply(vector: Vector2D): Point2D;
            /** 除 **/
            divide(vector: Vector2D): Point2D;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/5.
 */
declare module alcedo {
    module canvas {
        class CanvasRenderer extends AppSubCore {
            protected static RENDERER_MAIN_LOOP: string;
            protected _stage: Stage;
            protected _canvas: HTMLCanvasElement;
            protected _canvasRenderContext: any;
            protected _renderoption: any;
            protected _mainlooptask: Dict;
            constructor();
            protected render(): void;
            executeMainLoop(stage: Stage, canvas: HTMLCanvasElement): void;
            clearScreen(): void;
            /**
             * 注册主循环任务
             * @param task
             * @param thisObject
             * @param priority
             */
            registMainLoopTask(task: Function, thisObject: any, priority?: number): void;
            /**
             * 取消主循环任务
             * @param task
             * @param thisObject
             */
            unregistMainLoopTask(task: Function, thisObject: any): void;
            setTransform(matrix: Matrix2D): void;
            context: any;
            smooth: boolean;
            static detecter(): CanvasRenderer;
        }
    }
}
interface Array<T> {
    prototype: any;
    /**
     * 快速移除某个元素，默认会以最后一个元素填充到移除元素的位置，返回移除的元素。
     * @param index
     */
    fastRemove(index: number): any;
    first: any;
    last: any;
    randomselect(): any;
    copy(): Array<T>;
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
 * Created by tommyZZM on 2015/4/4.
 */
declare module alcedo {
    var a$: any;
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
    function dispatchCmd(core: any, cmd: string, courier?: any): void;
    /**
     * 侦听业务核心的回调
     * @param core
     * @param type
     * @param callback
     * @param thisObject
     * @returns {boolean}
     */
    function addDemandListener(core: any, type: string, callback: Function, thisObject: any, priority?: number): boolean;
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
 * Created by tommyZZM on 2015/4/4.
 */
declare module alcedo {
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
 * Created by tommyZZM on 2015/4/6.
 */
declare module alcedo {
    class Constant {
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
 * Created by tommyZZM on 2015/5/4.
 */
declare module alcedo {
    module canvas {
        class TouchEvent extends Event {
            static TOUCH_BEGIN: string;
            static TOUCH_END: string;
            static TOUCH_TAP: string;
            private static touchTargetPool;
            static createSimpleTouchEvent(identifier: any, x: any, y: any): any;
        }
        interface ITouchEvent {
            x: number;
            y: number;
            identifier: number;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/8.
 */
declare module alcedo {
    module canvas {
        class Vector2D implements Ixy {
            x: number;
            y: number;
            private static _identity;
            static identity(x?: number, y?: number): Vector2D;
            constructor(x?: number, y?: number);
            /** 加 **/
            add(vector: Vector2D): Vector2D;
            /** 减 **/
            subtract(vector: Vector2D): Vector2D;
            /** 乘 **/
            multiply(vector: Vector2D): Vector2D;
            /** 除 **/
            divide(value: Vector2D | number): Vector2D;
            /**
             * 向量积
             * @param vector
             * @returns {alcedo.canvas.Vector2D}
             */
            /**
             * 左手法向量
             */
            private _vectornormal;
            normalize(): Vector2D;
            /**
             * 矢量对象长度
             */
            length: number;
            unitlize(): Vector2D;
            deg: number;
            toNormalDeg(left: boolean): number;
            toRad(): number;
            /**
             * 克隆矢量对象
             */
            clone(): Vector2D;
            reset(x?: number, y?: number): Vector2D;
            resetAs(vector: Vector2D): Vector2D;
            resetToDeg(deg: number): void;
            /**
             * 从两个点创建适量对象
             */
            static createFromPoint(start: Point2D, end: Point2D): Vector2D;
            /**
             * 从一个角度创建向量
             */
            static createFromDeg(deg: number, length?: number): Vector2D;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/8.
 */
declare module alcedo {
    module canvas {
        class Rectangle {
            static _identity: Rectangle;
            static identity(rect_or_x?: number | Rectangle, y?: number, width?: number, height?: number): Rectangle;
            constructor(x?: number, y?: number, width?: number, height?: number);
            /**
             * 矩形左上角的 x 坐标。
             */
            x: number;
            /**
             * 矩形左上角的 y 坐标。
             */
            y: number;
            /**
             * 矩形的宽度（以像素为单位）。
             */
            width: number;
            /**
             * 矩形的高度（以像素为单位）。
             */
            height: number;
            /**
             * x 和 width 属性的和。
             */
            right: number;
            /**
             * y 和 height 属性的和。
             */
            bottom: number;
            /**
             * 举行类初始化赋值，开发者尽量调用此方法复用Rectangle对象，而不是每次需要的时候都重新创建
             */
            reset(x?: number, y?: number, width?: number, height?: number): Rectangle;
            /**
             * 举行类初始化赋值，开发者尽量调用此方法复用Rectangle对象，而不是每次需要的时候都重新创建
             */
            resetAs(rectangle: Rectangle): Rectangle;
            /**
             * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
             * 此方法与 Rectangle.contains() 方法类似，只不过它采用 Point 对象作为参数。
             */
            contains(point: Point2D): boolean;
            /**
             * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
             */
            hitRectangelTest(toHit: Rectangle): boolean;
            /**
             * 克隆矩形对象
             */
            clone(): Rectangle;
            /** 乘 **/
            multiply(vector: Vector2D): Rectangle;
            /** 除 **/
            divide(vector: Vector2D): Rectangle;
            /**
             * 静态方法
             */
            static rectangleFromFourPoint(p1: Point2D, p2: Point2D, p3: Point2D, p4: Point2D, saveRectt?: Rectangle): Rectangle;
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
            node: HTMLElement;
            tagname: string;
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
 * Created by tommyZZM on 2015/4/9.
 */
declare module alcedo {
    module net {
        class AsyncRESEvent extends Event {
            static ASSETS_COMPLETE: string;
            static ASSETS_PROGRESSING: string;
        }
        class AsyncRES extends AppSubCore {
            private static instanceable;
            private _repeatkey;
            private _assetspool;
            constructor();
            set(key: any, value: any): any;
            get(key: any): any;
            find(reg: RegExp): Array<any>;
            assets: Array<any>;
            keys: Array<any>;
        }
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
    module canvas {
        /**
         *
         * 组合了DomContext、TouchContext、RenderContext
         */
        var canvasStyleClass: {
            alcedo_canvas: string;
            alcedo_canvas_ui: string;
            alcedo_canvas_container: string;
            alcedo_canvas_profiler: string;
        };
        class CanvasMainContext extends EventDispatcher {
            private _designwidth;
            private _designheight;
            private _designw2h;
            private _canvascontainer;
            private _canvas;
            private _canvasgasket;
            private _canvasui;
            private _profiler;
            private _canvasrenderer;
            private _stage;
            static stage: Stage;
            constructor(stage: Stage, canvas: dom.DomElement);
            private createui();
            private run();
            private mainloop(renderer);
            checkorient(): boolean;
            resizecontext(): void;
            onResizeComplete(): void;
            container: dom.DomElement;
            canvas: dom.DomElement;
            gasket: dom.DomElement;
            canvasui: dom.DomElement;
            stage: Stage;
            containerStyleW2h: number;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/6.
 */
declare module alcedo {
    module canvas {
        function animationFrame(callback: any, thisArg: any): void;
    }
}
/**
 * Created by tommyZZM on 2015/4/5.
 */
declare module alcedo {
    module canvas {
        class TouchContext extends EventDispatcher {
            private _stage;
            private _gasket;
            private _canvas;
            constructor(stage: Stage);
            private onTouchBegin(e);
            private onTouchEnd(e);
            private onTouchTab(e);
            private emitTouchEvent(e, evnet);
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/11.
 */
declare module alcedo {
    module canvas {
        class Camera2D extends AppSubCore {
            private _stage;
            private _position;
            private _focal;
            private _yaw;
            private _buffer;
            private _vieworigin;
            private _viewfinder;
            private _viewsafe;
            constructor(stage: Stage, buffer?: number);
            x: number;
            y: number;
            focal: number;
            yawX: number;
            yawY: number;
            yaw: number;
            zoomTo(x: number, y: number, focal?: number, yawx?: number, yawy?: number): void;
            private _updateView();
            viewfinder(): Rectangle;
            viewsafe(): Rectangle;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/11.
 */
declare module alcedo {
    module canvas {
        /**
         * 当前canvas配置熟悉显示
         */
        class Profiler extends AppObject {
            private _maincontext;
            private _profilerdiv;
            constructor(context: CanvasMainContext);
            visible: boolean;
            private update(e);
        }
    }
}
/**
 * Created by tommyZZM on 1015/4/11.
 */
declare module alcedo {
    module canvas {
        class Ticker extends AppSubCore {
            private _stage;
            private _fps;
            private _total10microsecond;
            private _totalsecond;
            private _countmicrosecond;
            private _count10microsecond;
            private _last10microsecond;
            constructor(stage: Stage);
            private _lostfocustime;
            private onWindowFocus(e);
            private onWindowLostFocus(e);
            private update(e);
            private fps();
        }
        interface ITickerEvent {
            fps: number;
            count: number;
            dt: number;
            delay: number;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/25.
 */
declare module alcedo {
    module canvas {
        class DisplayGraphic extends DisplayObject {
            protected _fillcolour: string;
            protected _linecolour: string;
            _graphicfn: (context: CanvasRenderingContext2D | any) => void;
            _draw(renderer: CanvasRenderer): void;
            fillcolour: string;
        }
        module graphic {
            class Circle extends DisplayGraphic {
                private _radius;
                constructor(r?: number, coulour?: string);
                radius: number;
            }
            class Rectangle extends DisplayGraphic {
                constructor(width?: number, height?: number, coulour?: string);
            }
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/22.
 */
declare module alcedo {
    module canvas {
        class MovieClip extends DisplayObject {
            private _moveclipdata;
            private _isPlaying;
            private _frameRate;
            private _playTimes;
            constructor(movieclipdata: MovieClipData);
            _draw(renderer: CanvasRenderer): void;
            protected _onAdd(): void;
            isInViewPort(): boolean;
            /**
             * MovieClip API
             */
            play(playtimes?: number): void;
            stop(): void;
            gotoAndPlay(frame: number | string, playTimes?: number): void;
            gotoAndStop(frame: number | string): void;
            private _playtotag;
            playToAndStop(frame: number, playtimes?: number): void;
            stopAt(frame: number): void;
            private setPlayTimes(value);
            private gotoFrame(index);
            private selectFrame(index);
            /**
             * Movie interal
             */
            private _countdt;
            private _passtime;
            private _lasttime;
            private _nextframeindex;
            private _currframeindex;
            private _totalframescount;
            private _currframe;
            private _frameRateControl(e);
            private _updateCurrFrame();
            private _playstate;
            private _playstatetmp;
            private setPlayState(value);
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/10.
 */
declare module alcedo {
    module canvas {
        class Sprite extends DisplayObject {
            protected _texture: Texture;
            constructor(texture?: Texture);
            _draw(renderer: CanvasRenderer): void;
            texture: Texture;
            isInViewPort(): boolean;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/8.
 */
declare module alcedo {
    module canvas {
        class Stage extends DisplatObjectContainer {
            static ENTER_FRAME: string;
            static ENTER_MILLSECOND10: string;
            static ENTER_SECOND: string;
            static RESIZED: string;
            static RESIZE: string;
            private _stageWidth;
            stageWidth: number;
            private _stageHeight;
            stageHeight: number;
            private _maincontext;
            private _touchcontext;
            _options: any;
            private _orientchanged;
            private _ticker;
            private _camera;
            private _enterframemap;
            constructor(canvas: dom.DomElement, width?: number, height?: number, opts?: any);
            width: number;
            height: number;
            setStageWidth(width: number): void;
            setStageHeight(height: number): void;
            private initcomponent();
            private initcontext();
            render(renderer: CanvasRenderer): void;
            private _startTime;
            private _lastTime;
            private _nowTime();
            /**
             * 分发EnterFrame消息
             * @param renderer
             * @private
             */
            private _distapchEnterFrame(renderer);
            onenterframe(callback: any, thisOBject: any): void;
            container: dom.DomElement;
            /**
             * 获得Canvas
             * @returns {alcedo.dom.DomElement}
             */
            canvas: dom.DomElement;
            /**
             * 获得夹层
             * @returns {alcedo.dom.DomElement}
             */
            gasket: dom.DomElement;
            /**
             * 获得UI层
             * @returns {alcedo.dom.DomElement}
             */
            canvasui: dom.DomElement;
            options: any;
            resizecontext(): void;
            orientchanged: boolean;
            viewPort: Rectangle;
            camera: Camera2D;
            _transform(): void;
            isInViewPort(): boolean;
            addChild(child: DisplayObject): void;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/24.
 * 一枚单独的栗子
 * 栗子的生命周期 create prebron alive decaying decay
 *
 */
declare module alcedo {
    module canvas {
        class Particle implements IDisplayObject {
            position: Vector2D;
            scale: Vector2D;
            scaleAll(value: any): void;
            pivot: Vector2D;
            rotation: number;
            alpha: number;
            private _mass;
            private _velocity;
            private _acceleration;
            worldtransform: Matrix2D;
            private _currtime;
            private _lifetime;
            constructor();
            _stagetransform(stage: Stage): void;
            _transform(): void;
            _draw(renderer: CanvasRenderer | any): void;
            protected display(renderer: CanvasRenderer): void;
            /**
             * [控制栗子运动的接口]
             * 给栗子施加一个力
             * @param vector
             */
            applyForce(vector: Vector2D): void;
            /**
             * 栗子生命周期开始
             * @param x
             * @param y
             * @param mass
             * @param preserve
             */
            create(x: number, y: number, mass?: number, ...preserve: any[]): void;
            protected oncreate(x: number, y: number, mass?: number): void;
            /**
             * 栗子生命周期相位.可变，会在Update方法中调用
             */
            private _currphase;
            private _lifephase;
            private readPhase(e);
            /**
             * 当栗子诞生
             */
            protected prebron(): boolean;
            /**
             * 栗子
             */
            protected alive(): boolean;
            /**
             * 栗子逝去
             */
            protected decaying(): boolean;
            private _isdecayed;
            protected decay(): void;
            private _onDecayTask;
            onDecay(callback: Function, thisObject: any, param?: Array<any>): void;
            update(e: ITickerEvent): void;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/24.
 * 离子发射器
 */
declare module alcedo {
    module canvas {
        class ParticleEmitter extends DisplayObject {
            private _particlespool;
            private _particles;
            private _max;
            private _particleClass;
            private _currinitial;
            private _initial;
            private _mass;
            private _spread;
            private _massrandom;
            private _rate;
            private _raterandom;
            /**
             * @param initial
             * @param opts
             * @particleClass 粒子类
             */
            constructor(opts?: any);
            _draw(renderer: any): void;
            /**
             * 创建一枚栗子
             * @private
             */
            private _createOneParticle();
            private _ParticleInit(paricle);
            /**
             * 更新栗子们,判断是否创建栗子
             * @param e
             * @private
             */
            private _shouldcreate;
            private _updateParticles(e);
            /**
             * 更新一枚栗子
             * @param partile
             * @private
             */
            protected _updateOneParticle(partile: Particle): void;
            /**
             * 粒子行为控制
             */
            private _force;
            applyForce(force: Vector2D): void;
            initialdegree: number;
            /**
             * 发射器开关控制系统
             * @private
             */
            protected _onAdd(): void;
            play(): void;
            stop(): void;
            private _playstate;
            private _playstatetmp;
            private setPlayState(value);
            dispose(): void;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/19.
 */
declare module alcedo {
    module canvas {
        class DisplayObjectEvent extends Event {
            static ON_ADD: string;
            static ON_REMOVE: string;
            static ON_ADD_TO_STAGE: string;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/11.
 */
declare module alcedo {
    module canvas {
        class Segment2D {
            /**
             *
             * 创建一个 canvas.Segment2D (二维线段) 对象
             * @param begin Point2D(x,y)
             * @param end Point2D(x,y)
             */
            begin: Point2D;
            end: Point2D;
            static identity: Segment2D;
            constructor(begin: Point2D, end: Point2D);
            /**
             * 转换成二维向量
             */
            vector: Vector2D;
            length: number;
        }
    }
}
/**
 * Created by tommyZZM on 2015/5/8.
 */
declare module alcedo {
    module canvas {
        class Bezier2D {
            private _controlpoints;
            private _curve;
            constructor(points: Array<Ixy>, accuracy?: number);
            private _generate(step);
            curve: Point2D[];
            controlpoints: Point2D[];
            getPointAt(precent: number): Point2D;
            eachPointsOnCurve(fn: (point: Point2D) => void): void;
            private static lerpCurve(inPoints, t);
            private static lerpPoint(fromPoint, toPoint, t);
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/11.
 */
declare module alcedo {
    module canvas {
        class Circle {
            center: Point2D;
            radius: number;
            constructor(center: Point2D, r: number);
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/25.
 */
declare module alcedo {
    module canvas {
        interface IDisplayObject {
            position: any;
            scale: any;
            rotation: any;
            _transform(): any;
            _draw(renderer: CanvasRenderer | any): any;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/25.
 */
declare module alcedo {
    module canvas {
        interface Ixy {
            x: any;
            y: any;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/5.
 */
declare module alcedo {
    module canvas {
        class Context2DRenderer extends CanvasRenderer {
            constructor();
            /**
             * 渲染主循环
             */
            protected render(): void;
            setTransform(matrix: Matrix2D): void;
            /**
             * context 2d
             * 启动渲染循环
             */
            private _smoothProperty;
            executeMainLoop(stage: Stage, canvas: HTMLCanvasElement): void;
            context: CanvasRenderingContext2D;
            smooth: boolean;
            clearScreen(): void;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/5.
 */
declare module alcedo {
    module canvas {
        class WebGLRenderer extends CanvasRenderer {
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/22.
 */
declare module alcedo {
    module canvas {
        class MovieClipRepository extends AppSubCore {
            private static instanceable;
            private _movieclipdataspool;
            constructor();
            /**
             * 解析MovieClipData并存入仓库
             * @param dataset
             * @param sheet
             */
            praseMovieClipData(dataset: any, sheettexture: Texture): void;
            /**
             * 解析雪碧图(egret)
             * @param sheetdataset
             * @param sheet
             */
            private praseSheetData(sheetdataset?, sheet?);
            get(name: string): MovieClipData;
        }
        class MovieClipData extends AppObject {
            private _name;
            private _framerate;
            private _frames;
            private _framescount;
            constructor(name: string);
            _importFrames(frames: Array<Texture>, frameRate: number): void;
            getFrames(): Array<Texture>;
            getFrame(index: number): Texture;
            getFrameRate(): number;
            /**
             * Size
             */
            private _bound;
            left: number;
            top: number;
            width: number;
            height: number;
            private static getBoundFromFrames(frames);
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/22.
 */
declare module alcedo {
    module canvas {
        class SpriteSheet extends AppObject {
            constructor(texture: Texture);
            private _texture;
            private _sourceWidth;
            private _sourceHeight;
            _textureMap: Dict;
            getTexture(name: string): Texture;
            createTexture(sourceX?: number, sourceY?: number, sourceWidth?: number, sourceHeight?: number): Texture;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/8.
 */
declare module alcedo {
    module canvas {
        class Texture extends AppObject {
            _sourceX: number;
            _sourceY: number;
            /**
             * 表示这个纹理在 源 bitmapData 上的宽度
             */
            _sourceWidth: number;
            /**
             * 表示这个纹理在 源 bitmapData 上的高度
             */
            _sourceHeight: number;
            /**
             * 这个纹理的纹理x,Y,width,height
             */
            _textureWidth: number;
            _textureHeight: number;
            _offsetX: number;
            _offsetY: number;
            /**
             * 表示这个纹理在 源 bitmapData 上的宽高比
             */
            _sourceW2H: number;
            _bitmapData: any;
            private _bound;
            /**
             * 纹理对象中得位图数据
             * @member {ImageData} canvas.Texture#bitmapData
             */
            bitmapData: HTMLImageElement | HTMLElement;
            sourceUrl: string;
            constructor(value?: HTMLImageElement | ImageData, args?: any);
            clone(): Texture;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/9.
 */
declare module alcedo {
    module canvas {
        class TextureRepository extends AppSubCore {
            private static instanceable;
            static ASSETS_COMPLETE: string;
            static ASSETS_PROGRESSING: string;
            private _repeatkey;
            private _texurespool;
            constructor();
            set(key: string, value: Texture): void;
            get(key: string): Texture;
            find(reg: RegExp): Array<any>;
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
    function px(value: number): string;
    function percent(value: number): string;
}
/**
 * Created by tommyZZM on 2015/4/9.
 */
declare module alcedo {
    module net {
        class RequestMethod {
            static GET: string;
            static POST: string;
        }
        class RequestDataType {
            /**
             * 指定以原始二进制数据形式接收下载的数据。
             */
            static BINARY: string;
            /**
             * 指定以文本形式接收已下载的数据。
             */
            static TEXT: string;
            /**
             * 指定以JSON形式接收已下载的数据。
             */
            static JSON: string;
        }
        class DataType {
            static TEXT: string;
            static JSON: string;
            static IMAGE: string;
            static SOUND: string;
            static SCRIPT: string;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/8.
 */
declare module alcedo {
    module net {
        /**Ajax请求**/
        function ajax(url: string, args: {
            async?: boolean;
            success: Function;
            error?: Function;
            method?: string;
            data?: any;
            user?: string;
            password?: string;
            responseType?: string;
            courier?: any;
        }, thisArg?: any): void;
        /**异步载入图片**/
        function asyncImage(url: any, args: {
            success: Function;
            error?: Function;
            courier?: any;
        }, thisArg?: any): void;
        class AsyncProxy extends AppSubCore {
            static instanceable: boolean;
            constructor();
            private bindcallback(args, thisArg?);
            /**
             * ajax方法
             * @param url
             * @param method
             * @param args
             * @param thisArg
             */
            ajax(url: string, args: {
                async: boolean;
                success: Function;
                error?: Function;
                method?: string;
                data?: any;
                user?: string;
                password?: string;
                responseType?: string;
                courier?: any;
            }, thisArg?: any): void;
            private getXHR();
            private _asyncimagepool;
            asyncImage(url: string, args: {
                success: Function;
                error?: Function;
                courier?: any;
            }, thisArg?: any): void;
        }
    }
}
/**
 * Created by tommyZZM on 2015/4/9.
 */
declare module alcedo {
    module net {
        class AsyncAssetsLoader extends AppSubCore {
            private static instanceable;
            private _basedir;
            private _thread;
            private _threadCound;
            private _assets_pool;
            private _assets_configs;
            private _assets_groups;
            private _assets_groups_waitingload;
            private _assets_groups_loading;
            private _assets_groups_loaded;
            constructor();
            /**
             * 通过url,加载一个资源文件配置
             * @param configurl
             */
            addConfig(configurl: string): void;
            /**
             * 加载组
             * @param names
             */
            loadGroup(...names: any[]): void;
            /**
             * 资源组
             */
            loadAssets(assets: Array<any>, groupname: string, basedir: string): void;
            /**
             * 加载单个资源
             * @type {Array}
             * @private
             */
            private _assets_loading_tasks;
            loadAsset(asset: any, groupname: any, basedir: any): void;
            /**一个资源加载结束**/
            private _oneAsssetComplete(counter);
            private _loadNextAssets();
            /**一个资源组加载完成了**/
            private _oneAsssetsGroupComplete();
        }
    }
}
