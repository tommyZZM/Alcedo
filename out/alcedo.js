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
 * Created by tommyZZM on 2015/4/6.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Matrix2D = (function (_super) {
            __extends(Matrix2D, _super);
            function Matrix2D(a, b, c, d, tx, ty) {
                if (a === void 0) { a = 1; }
                if (b === void 0) { b = 0; }
                if (c === void 0) { c = 0; }
                if (d === void 0) { d = 1; }
                if (tx === void 0) { tx = 0; }
                if (ty === void 0) { ty = 0; }
                _super.call(this);
                this.a = a;
                this.b = b;
                this.c = c;
                this.d = d;
                this.tx = tx;
                this.ty = ty;
            }
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
            Matrix2D.prototype.prepend = function (a, b, c, d, tx, ty) {
                var tx1 = this.tx;
                if (a != 1 || b != 0 || c != 0 || d != 1) {
                    var a1 = this.a;
                    var c1 = this.c;
                    this.a = a1 * a + this.b * c;
                    this.b = a1 * b + this.b * d;
                    this.c = c1 * a + this.d * c;
                    this.d = c1 * b + this.d * d;
                }
                this.tx = tx1 * a + this.ty * c + tx;
                this.ty = tx1 * b + this.ty * d + ty;
                return this;
            };
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
            Matrix2D.prototype.append = function (a, b, c, d, tx, ty) {
                var a1 = this.a;
                var b1 = this.b;
                var c1 = this.c;
                var d1 = this.d;
                if (a != 1 || b != 0 || c != 0 || d != 1) {
                    this.a = a * a1 + b * c1;
                    this.b = a * b1 + b * d1;
                    this.c = c * a1 + d * c1;
                    this.d = c * b1 + d * d1;
                }
                this.tx = tx * a1 + ty * c1 + this.tx;
                this.ty = tx * b1 + ty * d1 + this.ty;
                return this;
            };
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
            Matrix2D.prototype.prependTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
                var r = rotation * alcedo.Constant.DEG_TO_RAD; // * Matrix2D.DEG_TO_RAD;
                var cos = alcedo.Constant.cos(r);
                var sin = alcedo.Constant.sin(r);
                if (regX || regY) {
                    // append the registration offset:
                    this.tx -= regX;
                    this.ty -= regY;
                }
                if (skewX || skewY) {
                    // TODO: can this be combined into a single prepend operation?
                    //                skewX *= Matrix2D.DEG_TO_RAD;
                    //                skewY *= Matrix2D.DEG_TO_RAD;
                    this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
                    this.prepend(alcedo.Constant.cos(skewY), alcedo.Constant.sin(skewY), -alcedo.Constant.sin(skewX), alcedo.Constant.cos(skewX), x, y);
                }
                else {
                    this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
                }
                return this;
            };
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
            Matrix2D.prototype.appendTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
                if (rotation % 360) {
                    var r = rotation * alcedo.Constant.DEG_TO_RAD; // * Matrix2D.DEG_TO_RAD;
                    var cos = alcedo.Constant.cos(r);
                    var sin = alcedo.Constant.sin(r);
                }
                else {
                    cos = 1;
                    sin = 0;
                }
                if (skewX || skewY) {
                    // TODO: can this be combined into a single append?
                    //                skewX *= Matrix2D.DEG_TO_RAD;
                    //                skewY *= Matrix2D.DEG_TO_RAD;
                    this.append(alcedo.Constant.cos(skewY), alcedo.Constant.sin(skewY), -alcedo.Constant.sin(skewX), alcedo.Constant.cos(skewX), x, y);
                    this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
                }
                else {
                    this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
                }
                if (regX || regY) {
                    // prepend the registration offset:
                    this.tx -= regX * this.a + regY * this.c;
                    this.ty -= regX * this.b + regY * this.d;
                }
                return this;
            };
            /**
             * 对 Matrix2D 对象应用旋转转换。
             * 矩阵旋转，以角度制为单位
             * @method Matrix2D#rotate
             * @param angle {number} 角度
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.rotate = function (angle) {
                var cos = alcedo.Constant.cos(angle);
                var sin = alcedo.Constant.sin(angle);
                var a1 = this.a;
                var c1 = this.c;
                var tx1 = this.tx;
                this.a = a1 * cos - this.b * sin;
                this.b = a1 * sin + this.b * cos;
                this.c = c1 * cos - this.d * sin;
                this.d = c1 * sin + this.d * cos;
                this.tx = tx1 * cos - this.ty * sin;
                this.ty = tx1 * sin + this.ty * cos;
                return this;
            };
            /**
             * 矩阵斜切，以角度值为单位
             * @method Matrix2D#skew
             * @param skewX {number} x方向斜切
             * @param skewY {number} y方向斜切
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.skew = function (skewX, skewY) {
                //            skewX = skewX * Matrix2D.DEG_TO_RAD;
                //            skewY = skewY * Matrix2D.DEG_TO_RAD;
                this.append(alcedo.Constant.cos(skewY), alcedo.Constant.sin(skewY), -alcedo.Constant.sin(skewX), alcedo.Constant.cos(skewX), 0, 0);
                return this;
            };
            /**
             * 矩阵缩放
             * @method Matrix2D#scale
             * @param x {number} 水平缩放
             * @param y {number} 垂直缩放
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.scale = function (x, y) {
                this.a *= x;
                this.d *= y;
                this.c *= x;
                this.b *= y;
                this.tx *= x;
                this.ty *= y;
                return this;
            };
            /**
             * 沿 x 和 y 轴平移矩阵，由 x 和 y 参数指定。
             * @method Matrix2D#translate
             * @param x {number} 沿 x 轴向右移动的量（以像素为单位）。
             * @param y {number} 沿 y 轴向下移动的量（以像素为单位）。
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.translate = function (x, y) {
                this.tx += x;
                this.ty += y;
                return this;
            };
            /**
             * 为每个矩阵属性设置一个值，该值将导致 null 转换。
             * 通过应用恒等矩阵转换的对象将与原始对象完全相同。
             * 调用 identity() 方法后，生成的矩阵具有以下属性：a=1、b=0、c=0、d=1、tx=0 和 ty=0。
             * @method Matrix2D#identity
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.identity = function () {
                this.a = this.d = 1;
                this.b = this.c = this.tx = this.ty = 0;
                return this;
            };
            /**
             * 矩阵重置为目标矩阵
             * @method Matrix2D#identityMatrix
             * @param Matrix2D {Matrix2D} 重置的目标矩阵
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.identityMatrix = function (Matrix2D) {
                this.a = Matrix2D.a;
                this.b = Matrix2D.b;
                this.c = Matrix2D.c;
                this.d = Matrix2D.d;
                this.tx = Matrix2D.tx;
                this.ty = Matrix2D.ty;
                return this;
            };
            /**
             * 执行原始矩阵的逆转换。
             * 您可以将一个逆矩阵应用于对象来撤消在应用原始矩阵时执行的转换。
             * @method Matrix2D#invert
             * @returns {Matrix2D}
             */
            Matrix2D.prototype.invert = function () {
                var a1 = this.a;
                var b1 = this.b;
                var c1 = this.c;
                var d1 = this.d;
                var tx1 = this.tx;
                var n = a1 * d1 - b1 * c1;
                this.a = d1 / n;
                this.b = -b1 / n;
                this.c = -c1 / n;
                this.d = a1 / n;
                this.tx = (c1 * this.ty - d1 * tx1) / n;
                this.ty = -(a1 * this.ty - b1 * tx1) / n;
                return this;
            };
            Matrix2D.prototype.toArray = function (transpose) {
                if (!this._toarray) {
                    this._toarray = new Float32Array(9);
                }
                if (transpose) {
                    this._toarray[0] = this.a;
                    this._toarray[1] = this.b;
                    this._toarray[2] = 0;
                    this._toarray[3] = this.c;
                    this._toarray[4] = this.d;
                    this._toarray[5] = 0;
                    this._toarray[6] = this.tx;
                    this._toarray[7] = this.ty;
                    this._toarray[8] = 1;
                }
                else {
                    this._toarray[0] = this.a;
                    this._toarray[1] = this.b;
                    this._toarray[2] = this.tx;
                    this._toarray[3] = this.c;
                    this._toarray[4] = this.d;
                    this._toarray[5] = this.ty;
                    this._toarray[6] = 0;
                    this._toarray[7] = 0;
                    this._toarray[8] = 1;
                }
                return this._toarray;
            };
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
            Matrix2D.identity = new Matrix2D();
            return Matrix2D;
        })(alcedo.AppObject);
        canvas.Matrix2D = Matrix2D;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
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
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var DisplayObject = (function (_super) {
            __extends(DisplayObject, _super);
            /**
             * 显示对象
             */
            function DisplayObject() {
                _super.call(this);
                /**旋转**/
                this._rotation = 0;
                this._visible = true;
                this._alpha = 1;
                this._worldalpha = 1;
                this._dirty = false;
                this._cacheAsBitmap = false;
                /**
                 * OverRide position method
                 * 主要更新了可视包围盒，TODO:有Bug,待优化
                 */
                this._actualboundingbox = new canvas.Rectangle();
                /**
                 * 显示列表
                 */
                /**父节点**/
                this._parent = null;
                this._root = null;
                this._position = new canvas.Point2D(0, 0);
                this._globalposition = new canvas.Point2D();
                this._pivot = new canvas.Vector2D(0, 0);
                this._scale = new canvas.Vector2D(1, 1);
                this._worldscale = this._scale.clone();
                this._worldtransform = new canvas.Matrix2D();
                this._staticboundingbox = new canvas.Rectangle();
            }
            Object.defineProperty(DisplayObject.prototype, "position", {
                get: function () {
                    return this._position;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "scale", {
                get: function () {
                    return this._scale;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "worldtransform", {
                get: function () {
                    return this._worldtransform;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "rotation", {
                get: function () {
                    return this._rotation;
                },
                set: function (angle) {
                    this._rotation = angle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "visible", {
                get: function () {
                    return this._visible;
                },
                set: function (boo) {
                    this._visible = boo;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "alpha", {
                get: function () {
                    return this._alpha;
                },
                set: function (alpha) {
                    this._alpha = alpha;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "worldalpha", {
                get: function () {
                    return this._worldalpha;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "x", {
                get: function () {
                    return this._position.x;
                },
                set: function (px) {
                    if (isNaN(px)) {
                        //warn("nan",px);
                        return;
                    }
                    this._position.x = px;
                    this._staticboundingbox.x = px - this.pivotOffsetY;
                    this.updateBound(px);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "y", {
                get: function () {
                    return this._position.y;
                },
                set: function (px) {
                    if (isNaN(px))
                        return;
                    var _px = px;
                    this._position.y = _px;
                    this._staticboundingbox.y = _px - this.pivotOffsetY;
                    this.updateBound(null, _px);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "globalx", {
                get: function () {
                    this._updateGlobalPosition();
                    return this._globalposition.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "globaly", {
                get: function () {
                    this._updateGlobalPosition();
                    return this._globalposition.y;
                },
                enumerable: true,
                configurable: true
            });
            DisplayObject.prototype._updateGlobalPosition = function () {
                if (this._parent) {
                    this._parent.localToGlobal(this._position.x, this._position.y, this._globalposition);
                }
                else {
                    this._globalposition.reset(this._position.x, this._position.y);
                }
            };
            Object.defineProperty(DisplayObject.prototype, "width", {
                get: function () {
                    return this._staticboundingbox.width;
                },
                set: function (px) {
                    if (isNaN(px))
                        return;
                    this.updateBound(null, null, px);
                    this._staticboundingbox.width = px;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "height", {
                get: function () {
                    return this._staticboundingbox.height;
                },
                set: function (px) {
                    if (isNaN(px))
                        return;
                    this.updateBound(null, null, null, px);
                    this._staticboundingbox.height = px;
                },
                enumerable: true,
                configurable: true
            });
            DisplayObject.prototype.updateBound = function (x, y, width, height) {
                if (typeof x == "number")
                    this._staticboundingbox.x = x - this.pivotOffsetX;
                if (typeof y == "number")
                    this._staticboundingbox.y = y - this.pivotOffsetY;
                if (typeof width == "number")
                    this._staticboundingbox.width = width;
                if (typeof height == "number")
                    this._staticboundingbox.height = height;
                //this.emit(DisplayObject.ON_UPDATE_BOUND,{x:x,y:y,width:width,height:height});
            };
            Object.defineProperty(DisplayObject.prototype, "pivotX", {
                get: function () {
                    return this._pivot.x;
                },
                set: function (value) {
                    this._pivot.x = value;
                    this.updateBound(this.x);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "pivotOffsetX", {
                get: function () {
                    return this._pivot.x * this._staticboundingbox.width;
                },
                set: function (px) {
                    this.pivotX = px / this._staticboundingbox.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "pivotY", {
                get: function () {
                    return this._pivot.y;
                },
                set: function (value) {
                    this._pivot.y = value;
                    this.updateBound(null, this.y);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "pivotOffsetY", {
                get: function () {
                    return this._pivot.y * this._staticboundingbox.height;
                },
                set: function (px) {
                    this.pivotY = px / this._staticboundingbox.height;
                },
                enumerable: true,
                configurable: true
            });
            DisplayObject.prototype.scaleToWidth = function (width) {
                var _scale = width / this._staticboundingbox.width;
                this.scaleALL(_scale);
            };
            DisplayObject.prototype.scaleToHeight = function (height) {
                var _scale = height / this._staticboundingbox.height;
                this.scaleALL(_scale);
            };
            DisplayObject.prototype.scaleALL = function (value) {
                this.scaleX = value;
                this.scaleY = value;
            };
            Object.defineProperty(DisplayObject.prototype, "scaleX", {
                get: function () {
                    return this._scale.x;
                },
                set: function (value) {
                    this._scale.x = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DisplayObject.prototype, "scaleY", {
                get: function () {
                    return this._scale.y;
                },
                set: function (value) {
                    this._scale.y = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 碰撞检测,可以被重写
             * @private
             */
            //public hitPointTest(point:Point2D):boolean{
            //    return this._staticboundingbox.contains(point)
            //}
            //
            //public hitDisplayObjectTest(toHit:DisplayObject):boolean{
            //    return this._staticboundingbox.hitRectangelTest(toHit.staticBound)
            //}
            /**
             * [只读]获得现实对象当前的静态包围盒
             * @returns {Rectangle}
             */
            DisplayObject.prototype.boundBox = function () {
                return this._staticboundingbox.clone();
            };
            DisplayObject.prototype.isInViewPort = function () {
                if (!this.isAddtoStage()) {
                    return false;
                }
                return this._root.viewPort.hitRectangelTest(this.boundBox());
            };
            DisplayObject.prototype.actualBound = function () {
                //计算最大包围盒
                var _pointlefttop = this.actualLeftTop();
                var _pointrighttop = this.actualRightTop();
                var _pointrightbottom = this.actualRightBottom();
                var _pointleftbottom = this.actualLeftBottom();
                canvas.Rectangle.rectangleFromFourPoint(_pointlefttop, _pointrighttop, _pointrightbottom, _pointleftbottom, this._actualboundingbox);
                //
                //trace(this._actualboundingbox);
                return this._actualboundingbox;
            };
            DisplayObject.prototype.actualLeftTop = function () {
                return this.localToGlobal(0, 0);
            };
            DisplayObject.prototype.actualRightTop = function () {
                return this.localToGlobal(this._staticboundingbox.width, 0);
            };
            DisplayObject.prototype.actualRightBottom = function () {
                return this.localToGlobal(this._staticboundingbox.width, this._staticboundingbox.height);
            };
            DisplayObject.prototype.actualLeftBottom = function () {
                return this.localToGlobal(0, this._staticboundingbox.height);
            };
            DisplayObject.prototype.actualWidth = function () {
                return this._actualboundingbox.width;
            };
            DisplayObject.prototype.actualHeight = function () {
                return this._actualboundingbox.height;
            };
            /**
             * 将 point 对象从显示对象的（本地）坐标转换为舞台（全局）坐标。
             * 此方法允许您将任何给定的 x 和 y 坐标从相对于特定显示对象原点 (0,0) 的值（本地坐标）转换为相对于舞台原点的值（全局坐标）。
             * @method canvas.DisplayObject#localToGlobal
             * @param x {number} 本地x坐标
             * @param y {number} 本地y坐标
             * @param resultPoint {Point2D} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
             * @returns 具有相对于舞台的坐标的 Point 对象。
             */
            DisplayObject.prototype.localToGlobal = function (x, y, resultPoint) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                var mtx = this._getConcatenatedMatrix();
                mtx.append(1, 0, 0, 1, x, y);
                if (!resultPoint) {
                    resultPoint = new canvas.Point2D();
                }
                resultPoint.x = mtx.tx;
                resultPoint.y = mtx.ty;
                return resultPoint;
            };
            /**
             * 将指定舞台坐标（全局）转换为显示对象（本地）坐标。
             * @method canvas.DisplayObject#globalToLocal
             * @param x {number} 全局x坐标
             * @param y {number} 全局y坐标
             * @param resultPoint {Point2D} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
             * @returns 具有相对于显示对象的坐标的 Point2D 对象。
             */
            DisplayObject.prototype.globalToLocal = function (x, y, resultPoint) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                var mtx = this._getConcatenatedMatrix();
                mtx.invert();
                mtx.append(1, 0, 0, 1, x, y);
                if (!resultPoint) {
                    resultPoint = new canvas.Point2D();
                }
                resultPoint.x = mtx.tx;
                resultPoint.y = mtx.ty;
                return resultPoint;
            };
            DisplayObject.prototype._getConcatenatedMatrix = function () {
                //todo:----------------------------
                var matrix = DisplayObject.identityMatrixForGetConcatenated.identity();
                var o = this;
                while (o != null && !(o instanceof canvas.Stage)) {
                    if (o._pivot.x != 0 || o._pivot.y != 0) {
                        var bounds = this.boundBox();
                        matrix.prependTransform(o._position.x, o._position.y, o._scale.x, o._scale.y, o._rotation, 0, 0, bounds.width * o._pivot.x, bounds.height * o._pivot.y);
                    }
                    else {
                        matrix.prependTransform(o._position.x, o._position.y, o._scale.x, o._scale.y, o._rotation, 0, 0, o.pivotOffsetX, o.pivotOffsetY);
                    }
                    o = o._parent;
                }
                return matrix;
            };
            Object.defineProperty(DisplayObject.prototype, "parent", {
                get: function () {
                    return this._parent;
                },
                enumerable: true,
                configurable: true
            });
            DisplayObject.prototype._setParent = function (parent) {
                if (this._parent === parent)
                    return;
                this.removeFromParent();
                this._parent = parent;
                if (!this._parent) {
                    this._root = null;
                    return;
                }
                //trace(getClassName(this),"_setParent",this._parent._root, this._root);
                var parent = this._parent;
                var _root = parent;
                while (_root._parent) {
                    if (_root._parent === _root) {
                        throw new Error("_root._parent===_root");
                    }
                    _root = _root._parent;
                }
                this._root = _root;
                this._onAdd();
            };
            DisplayObject.prototype._onAdd = function () {
                //this.emit(DisplayObjectEvent.ON_ADD);
                if (this.isAddtoStage()) {
                    this.emit(canvas.DisplayObjectEvent.ON_ADD_TO_STAGE);
                    this._stage = this._root;
                }
            };
            DisplayObject.prototype.removeFromParent = function () {
                if (this._parent)
                    this._parent.removeChild(this);
            };
            Object.defineProperty(DisplayObject.prototype, "root", {
                get: function () {
                    return this._root;
                },
                enumerable: true,
                configurable: true
            });
            DisplayObject.prototype.isAddtoStage = function () {
                return this._root instanceof canvas.Stage;
            };
            /**
             * 矩阵运算物体在场景中的位置
             * @private
             */
            //private _transformMatrix:Matrix2D = new Matrix2D();
            DisplayObject.prototype._transform = function () {
                var flag = !!this._parent, pt = canvas.Matrix2D.identity;
                if (flag)
                    pt = this._parent._worldtransform;
                this._worldtransform.identityMatrix(pt);
                this._worldtransform = this._getMatrix(this._worldtransform);
                this._worldalpha = flag ? (this._alpha * this._parent._worldalpha) : this._alpha;
                this._worldscale.resetAs(this._scale); //shax
                if (flag)
                    this._worldscale.multiply(this._parent._worldscale);
            };
            /**
             * 每帧渲染
             * @private
             */
            DisplayObject.prototype._render = function (renderer) {
                //处理其他通用的渲染步骤（滤镜，遮罩等）
                if (!this._visible || this._worldalpha === 0)
                    return;
                renderer.context.globalAlpha = this._worldalpha;
                renderer.setTransform(this._worldtransform);
                this._draw(renderer);
            };
            DisplayObject.prototype._draw = function (renderer) {
                //绘制
                //needs to be override or extend;
            };
            DisplayObject.prototype._refreshBitmapCache = function () {
            };
            DisplayObject.prototype._createBitmapCache = function () {
            };
            DisplayObject.prototype._offset = function () {
                var o = this;
                var offsetx = o._pivot.x * o._staticboundingbox.width;
                var offsety = o._pivot.y * o._staticboundingbox.height;
                return canvas.Point2D.identity(offsetx, offsety);
                //return Point(0,0);
            };
            DisplayObject.prototype._getMatrix = function (matrix) {
                var _matrix = matrix;
                if (!_matrix) {
                    _matrix = canvas.Matrix2D.identity;
                }
                var offsetPoint = this._offset();
                _matrix.appendTransform(this._position.x, this._position.y, this._scale.x, this._scale.y, this._rotation, 0, 0, offsetPoint.x, offsetPoint.y);
                return _matrix;
            };
            DisplayObject.ON_UPDATE_BOUND = "DisplayObject_ON_UPDATE_BOUND";
            DisplayObject.identityMatrixForGetConcatenated = new canvas.Matrix2D();
            return DisplayObject;
        })(alcedo.EventDispatcher);
        canvas.DisplayObject = DisplayObject;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
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
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        /**
         * Bug to fix;
         * 容器Scale有莫名其妙的BUG
         *
         */
        var DisplatObjectContainer = (function (_super) {
            __extends(DisplatObjectContainer, _super);
            function DisplatObjectContainer() {
                _super.call(this);
                this._children = [];
            }
            Object.defineProperty(DisplatObjectContainer.prototype, "children", {
                get: function () {
                    return this._children;
                },
                enumerable: true,
                configurable: true
            });
            DisplatObjectContainer.prototype._transform = function () {
                _super.prototype._transform.call(this);
                this.eachChilder(function (child) {
                    child._transform();
                });
            };
            DisplatObjectContainer.prototype._render = function (renderer) {
                //super._render(renderer);
                this.eachChilder(function (child) {
                    child._render(renderer);
                });
            };
            DisplatObjectContainer.prototype.addChild = function (child) {
                var success = this._addChild(child);
                if (!success) {
                    //warn("addChild fail");
                    return;
                }
                child.emit(canvas.DisplayObjectEvent.ON_ADD, { parent: this, index: this._children.length - 1 });
            };
            DisplatObjectContainer.prototype._addChild = function (child) {
                if (child.parent == this)
                    return false;
                this._children.push(child);
                child._setParent(this);
                return true;
            };
            DisplatObjectContainer.prototype.addChildAt = function (child, index) {
                var success = this._addChild(child);
                if (!success)
                    return;
                this.setChildIndex(child, index);
                child.emit(canvas.DisplayObjectEvent.ON_ADD, { parent: this });
            };
            DisplatObjectContainer.prototype.setChildIndex = function (child, index) {
                var lastIdx = this._children.indexOf(child);
                if (lastIdx < 0) {
                    return;
                }
                //从原来的位置删除
                this._children.splice(lastIdx, 1);
                //放到新的位置
                if (index < 0 || this._children.length <= index) {
                    this._children.push(child);
                }
                else {
                    this._children.splice(index, 0, child);
                }
            };
            DisplatObjectContainer.prototype.removeChild = function (child) {
                var i = this._children.indexOf(child);
                if (i >= 0) {
                    this._children.splice(i, 1);
                    child._setParent(null);
                    child.emit(canvas.DisplayObjectEvent.ON_REMOVE, { parent: this });
                }
            };
            DisplatObjectContainer.prototype.removeChildren = function () {
                this.eachChilder(function (child) {
                    child._setParent(null);
                });
                this._children = [];
            };
            DisplatObjectContainer.prototype.eachChilder = function (fn) {
                for (var i = 0; i < this._children.length; i++) {
                    fn.call(this, this._children[i]);
                }
            };
            DisplatObjectContainer.prototype._onAdd = function () {
                var _this = this;
                _super.prototype._onAdd.call(this);
                this.eachChilder(function (child) {
                    child._root = _this._root;
                    child._onAdd();
                });
            };
            return DisplatObjectContainer;
        })(canvas.DisplayObject);
        canvas.DisplatObjectContainer = DisplatObjectContainer;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Point2D = (function () {
            function Point2D(x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                //super();
                this.x = x;
                this.y = y;
            }
            Point2D.identity = function (x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                Point2D._identity.reset(x, y);
                return Point2D._identity;
            };
            /**
             * 克隆点对象
             */
            Point2D.prototype.clone = function () {
                return new Point2D(this.x, this.y);
            };
            /**
             * 设置X,y
             */
            Point2D.prototype.reset = function (x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                this.x = x;
                this.y = y;
            };
            /** 加 **/
            Point2D.prototype.add = function (vector) {
                this.x += vector.x;
                this.y += vector.y;
                return this;
            };
            /** 减 **/
            Point2D.prototype.subtract = function (vector) {
                this.x -= vector.x;
                this.y -= vector.y;
                return this;
            };
            /** 乘 **/
            Point2D.prototype.multiply = function (vector) {
                this.x *= vector.x;
                this.y *= vector.y;
                return this;
            };
            /** 除 **/
            Point2D.prototype.divide = function (vector) {
                this.x /= vector.x;
                this.y /= vector.y;
                return this;
            };
            Point2D._identity = new Point2D();
            return Point2D;
        })();
        canvas.Point2D = Point2D;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/5.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (_canvas) {
        var CanvasRenderer = (function (_super) {
            __extends(CanvasRenderer, _super);
            function CanvasRenderer() {
                _super.call(this);
                this._mainlooptask = new Dict();
            }
            CanvasRenderer.prototype.render = function () {
                //TODO:绘制canvas
            };
            CanvasRenderer.prototype.executeMainLoop = function (stage, canvas) {
                //this._stage = stage;
                //this._canvas = <any>stage.canvas;
            };
            CanvasRenderer.prototype.clearScreen = function () {
            };
            /**
             * 注册主循环任务
             * @param task
             * @param thisObject
             * @param priority
             */
            CanvasRenderer.prototype.registMainLoopTask = function (task, thisObject, priority) {
                alcedo.AppNotifyable.registNotify(this._mainlooptask, CanvasRenderer.RENDERER_MAIN_LOOP, task, thisObject, null, priority);
            };
            /**
             * 取消主循环任务
             * @param task
             * @param thisObject
             */
            CanvasRenderer.prototype.unregistMainLoopTask = function (task, thisObject) {
                alcedo.AppNotifyable.unregistNotify(this._mainlooptask, CanvasRenderer.RENDERER_MAIN_LOOP, task, thisObject);
            };
            CanvasRenderer.prototype.setTransform = function (matrix) {
            };
            Object.defineProperty(CanvasRenderer.prototype, "context", {
                get: function () {
                    return this._canvasRenderContext;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasRenderer.prototype, "smooth", {
                set: function (flag) {
                },
                enumerable: true,
                configurable: true
            });
            CanvasRenderer.detecter = function () {
                var webglsupport = (function () {
                    try {
                        var canvas = document.createElement('canvas');
                        return !!window["WebGLRenderingContext"] && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
                    }
                    catch (e) {
                        return false;
                    }
                })();
                if (webglsupport) {
                }
                else {
                }
                return new _canvas.Context2DRenderer();
            };
            CanvasRenderer.RENDERER_MAIN_LOOP = "CanvasRenderer_MainLoop";
            return CanvasRenderer;
        })(alcedo.AppSubCore);
        _canvas.CanvasRenderer = CanvasRenderer;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
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
 * Created by tommyZZM on 2015/5/4.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var TouchEvent = (function (_super) {
            __extends(TouchEvent, _super);
            function TouchEvent() {
                _super.apply(this, arguments);
            }
            TouchEvent.createSimpleTouchEvent = function (identifier, x, y) {
                if (!this.touchTargetPool)
                    this.touchTargetPool = {};
                var result = this.touchTargetPool[identifier];
                if (!result) {
                    result = this.touchTargetPool[identifier] = {
                        indentifier: identifier,
                        x: x,
                        y: y
                    };
                }
                return result;
            };
            TouchEvent.TOUCH_BEGIN = "canvasTOUCH_BEGIN";
            TouchEvent.TOUCH_END = "canvasTOUCH_END";
            TouchEvent.TOUCH_TAP = "canvasTOUCH_TAP";
            return TouchEvent;
        })(alcedo.Event);
        canvas.TouchEvent = TouchEvent;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Vector2D = (function () {
            function Vector2D(x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                //super();
                this.x = x;
                this.y = y;
            }
            Vector2D.identity = function (x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                Vector2D._identity.reset(x, y);
                return Vector2D._identity;
            };
            //四则运算
            /** 加 **/
            Vector2D.prototype.add = function (vector) {
                this.x += vector.x;
                this.y += vector.y;
                return this;
            };
            /** 减 **/
            Vector2D.prototype.subtract = function (vector) {
                this.x -= vector.x;
                this.y -= vector.y;
                return this;
            };
            /** 乘 **/
            Vector2D.prototype.multiply = function (vector) {
                this.x *= vector.x;
                this.y *= vector.y;
                return this;
            };
            /** 除 **/
            Vector2D.prototype.divide = function (value) {
                var _vaule = value;
                if (_vaule instanceof Vector2D) {
                    this.x /= _vaule.x;
                    this.y /= _vaule.y;
                }
                else {
                    this.x /= _vaule;
                    this.y /= _vaule;
                }
                return this;
            };
            Vector2D.prototype.normalize = function () {
                if (!this._vectornormal)
                    this._vectornormal = new Vector2D();
                this._vectornormal.reset(this.y, -this.x);
                this._vectornormal.length = 1;
                return this._vectornormal;
            };
            Object.defineProperty(Vector2D.prototype, "length", {
                get: function () {
                    if (this.x == 0 && this.y == 0)
                        return 0;
                    var result = Math.sqrt(this.x * this.x + this.y * this.y);
                    if (isNaN(result)) {
                        result = 0;
                    }
                    return result;
                },
                /**
                 * 矢量对象长度
                 */
                set: function (value) {
                    var length = this.length;
                    if (length === 0) {
                        this.x = 1;
                        length = 1;
                    }
                    length = value / length;
                    this.x *= length;
                    this.y *= length;
                },
                enumerable: true,
                configurable: true
            });
            //转换为单位向量
            Vector2D.prototype.unitlize = function () {
                this.length = 1;
                return this;
            };
            Object.defineProperty(Vector2D.prototype, "deg", {
                get: function () {
                    //TODO:x,y更新时才需要重新计算 , PS 我也不知道什么要-270哦
                    return -(Math.atan2(this.x, this.y) * alcedo.Constant.RAD_TO_DEG).toFixed(1) + 90;
                },
                set: function (deg) {
                    var length = this.length;
                    this.x = alcedo.Constant.cos(deg * alcedo.Constant.DEG_TO_RAD) * length;
                    this.y = alcedo.Constant.sin(deg * alcedo.Constant.DEG_TO_RAD) * length;
                    //trace(this.x,this.y);
                },
                enumerable: true,
                configurable: true
            });
            //法向量角
            Vector2D.prototype.toNormalDeg = function (left) {
                return this.deg - (left ? 90 : (-90));
            };
            Vector2D.prototype.toRad = function () {
                return 0;
            };
            /**
             * 克隆矢量对象
             */
            Vector2D.prototype.clone = function () {
                return new Vector2D(this.x, this.y);
            };
            Vector2D.prototype.reset = function (x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                this.x = x;
                this.y = y;
                return this;
            };
            Vector2D.prototype.resetAs = function (vector) {
                if (vector === this)
                    return this;
                this.x = vector.x;
                this.y = vector.y;
                return this;
            };
            Vector2D.prototype.resetToDeg = function (deg) {
                var length = this.length;
                if (length === 0) {
                    return;
                }
                this.x = alcedo.Constant.cos(deg * alcedo.Constant.DEG_TO_RAD);
                this.y = alcedo.Constant.sin(deg * alcedo.Constant.DEG_TO_RAD);
                this.length = length;
            };
            /**
             * 从两个点创建适量对象
             */
            Vector2D.createFromPoint = function (start, end) {
                return new Vector2D(end.x - start.x, end.y - start.y);
            };
            /**
             * 从一个角度创建向量
             */
            Vector2D.createFromDeg = function (deg, length) {
                if (length === void 0) { length = 1; }
                return new Vector2D(alcedo.Constant.cos(deg), alcedo.Constant.sin(deg));
            };
            Vector2D._identity = new Vector2D();
            return Vector2D;
        })();
        canvas.Vector2D = Vector2D;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Rectangle = (function () {
            function Rectangle(x, y, width, height) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (width === void 0) { width = 0; }
                if (height === void 0) { height = 0; }
                //super();
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
            Rectangle.identity = function (rect_or_x, y, width, height) {
                if (rect_or_x === void 0) { rect_or_x = 0; }
                if (y === void 0) { y = 0; }
                if (width === void 0) { width = 0; }
                if (height === void 0) { height = 0; }
                if (typeof rect_or_x == "number") {
                    return Rectangle._identity.reset(rect_or_x, y, width, height);
                }
                else {
                    return Rectangle._identity.resetAs(rect_or_x);
                }
            };
            Object.defineProperty(Rectangle.prototype, "right", {
                /**
                 * x 和 width 属性的和。
                 */
                get: function () {
                    return this.x + this.width;
                },
                set: function (value) {
                    this.width = value - this.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "bottom", {
                /**
                 * y 和 height 属性的和。
                 */
                get: function () {
                    return this.y + this.height;
                },
                set: function (value) {
                    this.height = value - this.y;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 举行类初始化赋值，开发者尽量调用此方法复用Rectangle对象，而不是每次需要的时候都重新创建
             */
            Rectangle.prototype.reset = function (x, y, width, height) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (width === void 0) { width = 0; }
                if (height === void 0) { height = 0; }
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                return this;
            };
            /**
             * 举行类初始化赋值，开发者尽量调用此方法复用Rectangle对象，而不是每次需要的时候都重新创建
             */
            Rectangle.prototype.resetAs = function (rectangle) {
                this.x = rectangle.x;
                this.y = rectangle.y;
                this.width = rectangle.width;
                this.height = rectangle.height;
                return this;
            };
            /**
             * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
             * 此方法与 Rectangle.contains() 方法类似，只不过它采用 Point 对象作为参数。
             */
            Rectangle.prototype.contains = function (point) {
                var result = (this.x < point.x && this.x + this.width > point.x && this.y < point.y && this.y + this.height > point.y);
                return result;
            };
            /**
             * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
             */
            Rectangle.prototype.hitRectangelTest = function (toHit) {
                return Math.max(this.x, toHit.x) <= Math.min(this.right, toHit.right) && Math.max(this.y, toHit.y) <= Math.min(this.bottom, toHit.bottom);
            };
            /**
             * 克隆矩形对象
             */
            Rectangle.prototype.clone = function () {
                return new Rectangle(this.x, this.y, this.width, this.height);
            };
            /** 乘 **/
            Rectangle.prototype.multiply = function (vector) {
                this.x *= vector.x;
                this.y *= vector.y;
                this.width *= vector.x;
                this.height *= vector.y;
                return this;
            };
            /** 除 **/
            Rectangle.prototype.divide = function (vector) {
                this.x /= vector.x;
                this.y /= vector.y;
                this.width /= vector.x;
                this.height /= vector.y;
                return this;
            };
            /**
             * 静态方法
             */
            //从4个点生成一个最大包围矩形
            Rectangle.rectangleFromFourPoint = function (p1, p2, p3, p4, saveRectt) {
                var __x = Math.min(p1.x, p2.x, p3.x, p4.x);
                var __y = Math.min(p1.y, p2.y, p3.y, p4.y);
                var __x_r = Math.max(p1.x, p2.x, p3.x, p4.x);
                var __y_b = Math.max(p1.y, p2.y, p3.y, p4.y);
                //trace(p1.x,p2.x,p3.x,p4.x)
                if (saveRectt) {
                    saveRectt.reset(__x, __y, (__x_r - __x), (__y_b - __y));
                }
                else {
                    saveRectt = new Rectangle(__x, __y, (__x_r - __x), (__y_b - __y));
                }
                return saveRectt;
            };
            Rectangle._identity = new Rectangle();
            return Rectangle;
        })();
        canvas.Rectangle = Rectangle;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
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
                this.emit(dom.TouchEvent.TOUCH_BEGIN, e);
            };
            DomElement.prototype.onmouseup = function (e) {
                e.identifier = 0;
                this.emit(dom.TouchEvent.TOUCH_END, e);
            };
            DomElement.prototype.onmouseclick = function (e) {
                e.identifier = 0;
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
 * Created by tommyZZM on 2015/4/24.
 */
/**
 * Created by tommyZZM on 2015/4/28.
 */
//定义一个快捷扩展对象属性的方法 
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
    var canvas;
    (function (_canvas) {
        /**
         *
         * 组合了DomContext、TouchContext、RenderContext
         */
        _canvas.canvasStyleClass = {
            alcedo_canvas: "alcedo-canvas",
            alcedo_canvas_ui: "alcedo-canvas-ui",
            alcedo_canvas_container: "alcedo-canvas-container",
            alcedo_canvas_profiler: "alcedo-canvas-profiler",
        };
        var CanvasMainContext = (function (_super) {
            __extends(CanvasMainContext, _super);
            function CanvasMainContext(stage, canvas) {
                _super.call(this);
                this._stage = stage;
                this._designwidth = this._stage.stageWidth;
                this._designheight = this._stage.stageHeight;
                this._designw2h = this._designwidth / this._designheight;
                this._canvas = canvas;
                this._canvas.addClass(_canvas.canvasStyleClass.alcedo_canvas);
                this._canvascontainer = alcedo.dom.query("<div></div>")[0];
                this._canvascontainer.addClass(_canvas.canvasStyleClass.alcedo_canvas_container);
                this._canvascontainer.css({});
                this._canvascontainer.insertBefore(this._canvas);
                this._canvascontainer.appendChild(this._canvas);
                if (this._stage.options.profiler === true) {
                    this._profiler = new _canvas.Profiler(this);
                    this._profiler.visible = true;
                }
                this.createui();
                this.run();
            }
            //创建dom ui;
            CanvasMainContext.prototype.createui = function () {
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
                    this._canvasui.addClass(_canvas.canvasStyleClass.alcedo_canvas_ui);
                    this._canvasui.css({ position: "absolute" }); //,width:"100%",height:"100%"
                    if (typeof this.canvas.index == "number") {
                        this._canvasui.css({ "z-index": Math.add(this.canvas.index, 1) });
                    }
                    else {
                    }
                    //在ui层底部插入control gasket, 作为canvas的控制传导垫片
                    this._canvasgasket = alcedo.dom.query("<div style='position: absolute;top:0;left: 0'></div>")[0];
                    this._canvasgasket.id = this._canvas.id + "_gasket";
                    this._canvasgasket.insertBefore(this._canvasui);
                }
            };
            CanvasMainContext.prototype.run = function () {
                this._canvasrenderer = _canvas.CanvasRenderer.detecter(); //default 2d(cpu|webgl)
                //TODO:if webgl3d || other reset this._canvasrender
                this._canvasrenderer.executeMainLoop(this._stage, this._canvas.node);
                this._canvasrenderer.registMainLoopTask(this.mainloop, this);
                this._canvascontainer.css_transition = 10;
                this._canvascontainer.addEventListener(alcedo.dom.StyleEvent.TRAN_SITION_END, this.onResizeComplete, this);
                //this._stage = new Stage();
            };
            CanvasMainContext.prototype.mainloop = function (renderer) {
                //(<any>this._stage)._enterframe(renderer);
            };
            CanvasMainContext.prototype.checkorient = function () {
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
            CanvasMainContext.prototype.resizecontext = function () {
                var currstylew2h = this.containerStyleW2h;
                if (this.stage.orientchanged) {
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
                this._stage.emit(_canvas.Stage.RESIZE);
                //trace(this._stage.stageWidth,this._stage.stageHeight)
                this._canvas.node["width"] = this._stage.stageWidth;
                this._canvas.node["height"] = this._stage.stageHeight;
                this._canvasui.css({ width: this._canvas.styleWidth, height: 0 });
                if (this._canvasgasket) {
                    this._canvasgasket.css({ width: this._canvas.styleWidth, height: this._canvas.styleHeight });
                }
                //console.log("resized");
            };
            CanvasMainContext.prototype.onResizeComplete = function () {
                this._stage.emit(_canvas.Stage.RESIZED);
            };
            Object.defineProperty(CanvasMainContext.prototype, "container", {
                get: function () {
                    return this._canvascontainer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasMainContext.prototype, "canvas", {
                get: function () {
                    return this._canvas;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasMainContext.prototype, "gasket", {
                get: function () {
                    return this._canvasgasket;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasMainContext.prototype, "canvasui", {
                get: function () {
                    return this._canvasui;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasMainContext.prototype, "stage", {
                get: function () {
                    return this._stage;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasMainContext.prototype, "containerStyleW2h", {
                get: function () {
                    return alcedo.toValue(this._canvas.abscss().width) / alcedo.toValue(this._canvas.abscss().height);
                },
                enumerable: true,
                configurable: true
            });
            return CanvasMainContext;
        })(alcedo.EventDispatcher);
        _canvas.CanvasMainContext = CanvasMainContext;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/6.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
            window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
        function animationFrame(callback, thisArg) {
            window.requestAnimationFrame(callback.bind(thisArg));
        }
        canvas.animationFrame = animationFrame;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/5.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var TouchContext = (function (_super) {
            __extends(TouchContext, _super);
            function TouchContext(stage) {
                _super.call(this);
                this._stage = stage;
                this._gasket = stage.gasket;
                this._canvas = stage.canvas;
                this._gasket.addEventListener(alcedo.dom.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
                //TODO:touchmove
                this._gasket.addEventListener(alcedo.dom.TouchEvent.TOUCH_END, this.onTouchEnd, this);
                this._gasket.addEventListener(alcedo.dom.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
            }
            TouchContext.prototype.onTouchBegin = function (e) {
                //trace("onTouchBegin",e);
                this.emitTouchEvent(e, alcedo.canvas.TouchEvent.TOUCH_BEGIN);
            };
            TouchContext.prototype.onTouchEnd = function (e) {
                //trace("onTouchEnd",e);
                this.emitTouchEvent(e, alcedo.canvas.TouchEvent.TOUCH_END);
            };
            TouchContext.prototype.onTouchTab = function (e) {
                //trace("onTouchTab",e);
                this.emitTouchEvent(e, alcedo.canvas.TouchEvent.TOUCH_TAP);
            };
            TouchContext.prototype.emitTouchEvent = function (e, evnet) {
                var touchseedling = canvas.TouchEvent.createSimpleTouchEvent(e.identifier, e.pageX, e.pageY);
                this._stage.emit(evnet, touchseedling);
            };
            return TouchContext;
        })(alcedo.EventDispatcher);
        canvas.TouchContext = TouchContext;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/11.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Camera2D = (function (_super) {
            __extends(Camera2D, _super);
            function Camera2D(stage, buffer) {
                if (buffer === void 0) { buffer = 1.2; }
                _super.call(this);
                this._focal = 1;
                this._yaw = new canvas.Vector2D(0.5, 0.5);
                this._buffer = buffer > 1 ? buffer : 1;
                this._position = new canvas.Point2D();
                this._stage = stage;
                this._vieworigin = new canvas.Rectangle(stage.x, stage.y, stage.width, stage.height);
                this._viewfinder = this._vieworigin.clone();
                this._viewsafe = this._vieworigin.clone();
                //this.zoomToPoint(Point2D.identity(0,0),1,0);
            }
            Object.defineProperty(Camera2D.prototype, "x", {
                get: function () {
                    return this._position.x;
                },
                set: function (x) {
                    this._position.x = x;
                    this._stage.pivotOffsetX = this._position.x;
                    this._updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Camera2D.prototype, "y", {
                get: function () {
                    return this._position.y;
                },
                set: function (y) {
                    this._position.y = y;
                    this._stage.pivotOffsetY = this._position.y;
                    this._updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Camera2D.prototype, "focal", {
                get: function () {
                    return this._focal;
                },
                set: function (focal) {
                    this._focal = focal;
                    this._updateView();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Camera2D.prototype, "yawX", {
                get: function () {
                    return this._yaw.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Camera2D.prototype, "yawY", {
                get: function () {
                    return this._yaw.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Camera2D.prototype, "yaw", {
                set: function (yaw) {
                    this._yaw.x = yaw;
                    this._yaw.y = yaw;
                    this._updateView();
                },
                enumerable: true,
                configurable: true
            });
            Camera2D.prototype.zoomTo = function (x, y, focal, yawx, yawy) {
                if (focal === void 0) { focal = 1; }
                if (yawx === void 0) { yawx = 0.5; }
                if (yawy === void 0) { yawy = 0.5; }
                this._position.x = x;
                this._stage.pivotOffsetX = this._position.x;
                this._position.y = y;
                this._stage.pivotOffsetY = this._position.y;
                this._focal = 1 / focal;
                this._yaw.x = yawx;
                this._yaw.y = yawy;
                this._updateView();
            };
            Camera2D.prototype._updateView = function () {
                //TODO:现在的Viewport计算不正确！
                this._stage.x = this._stage.width * this._yaw.x;
                this._stage.y = this._stage.height * this._yaw.y;
                this._stage.scaleALL(1 / this._focal);
                this._viewfinder.width = this._focal * this._stage.width;
                this._viewfinder.height = this._focal * this._stage.height;
                this._viewfinder.x = this._position.x - this._viewfinder.width / 2;
                this._viewfinder.y = this._position.y - this._viewfinder.height / 2;
                var buffer = this._buffer;
                this._viewsafe.width = this._viewfinder.width; //*buffer;
                this._viewsafe.height = this._viewfinder.height; //*buffer;
                this._viewsafe.x = this._viewfinder.x; //-(this._viewfinder.width*(buffer-1))/2;
                this._viewsafe.y = this._viewfinder.y; //-(this._viewfinder.width*(buffer-1))/2;
                //trace(this._stage.x,this._stage.y,this._stage.width(),this._stage.height(),this._stage["_staticboundingbox"]);
            };
            Camera2D.prototype.viewfinder = function () {
                return this._viewfinder.clone();
            };
            Camera2D.prototype.viewsafe = function () {
                return this._viewsafe.clone();
            };
            return Camera2D;
        })(alcedo.AppSubCore);
        canvas.Camera2D = Camera2D;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/11.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        /**
         * 当前canvas配置熟悉显示
         */
        var Profiler = (function (_super) {
            __extends(Profiler, _super);
            function Profiler(context) {
                _super.call(this);
                this._maincontext = context;
                this._profilerdiv = alcedo.dom.query("<div style='font-family:Microsoft Yahei;background-color: black;opacity: 0.6;color: #fff;line-height: 1.3;padding: 3px'>" + "<p style='margin: 0;'>FPS:<span class='fps'>60</span></p>" + "<p style='margin: 0;'>Canvas</p>" + "</div>")[0];
                this._profilerdiv.css({ position: "absolute" });
                this._profilerdiv.addClass(canvas.canvasStyleClass.alcedo_canvas_profiler);
                //this._profilerdiv.id = this._maincontext.canvas.id+"_profiler";
                this._maincontext.stage.addEventListener(canvas.Stage.ENTER_SECOND, this.update, this);
                this.visible = false;
                this._maincontext.container.prependChild(this._profilerdiv);
            }
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
                //trace(e.fps);
                this._profilerdiv.find(".fps")[0].innerContent(e.fps);
            };
            return Profiler;
        })(alcedo.AppObject);
        canvas.Profiler = Profiler;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 1015/4/11.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Ticker = (function (_super) {
            __extends(Ticker, _super);
            function Ticker(stage) {
                _super.call(this);
                this._fps = 0;
                this._total10microsecond = 0;
                this._totalsecond = 0;
                this._countmicrosecond = 0;
                this._count10microsecond = 0;
                this._last10microsecond = 0;
                this._stage = stage;
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
                    this._stage.emit(canvas.Stage.ENTER_MILLSECOND10, { fps: this.fps(), count: this._total10microsecond, dt: dt, delay: _counter });
                    //trace("10microsecode",_counter)
                    this._countmicrosecond = 0;
                }
                this._count10microsecond += (this._total10microsecond - this._last10microsecond);
                _counter = +(this._count10microsecond / 100) ^ 0;
                if (_counter >= 1) {
                    this._stage.emit(canvas.Stage.ENTER_SECOND, { fps: this.fps(), count: this._totalsecond, dt: dt, delay: _counter });
                    this._count10microsecond = 0;
                }
                this._last10microsecond = this._total10microsecond;
            };
            Ticker.prototype.fps = function () {
                return +this._fps.toFixed(0);
            };
            return Ticker;
        })(alcedo.AppSubCore);
        canvas.Ticker = Ticker;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/25.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var DisplayGraphic = (function (_super) {
            __extends(DisplayGraphic, _super);
            function DisplayGraphic() {
                _super.apply(this, arguments);
            }
            //public graphic(fn:(context:CanvasRenderingContext2D|any)=>void):void{
            //    this._graphicfn = fn;
            //}
            DisplayGraphic.prototype._draw = function (renderer) {
                this._graphicfn(renderer.context);
            };
            Object.defineProperty(DisplayGraphic.prototype, "fillcolour", {
                set: function (clour) {
                    this._fillcolour = clour;
                },
                enumerable: true,
                configurable: true
            });
            return DisplayGraphic;
        })(canvas.DisplayObject);
        canvas.DisplayGraphic = DisplayGraphic;
        var graphic;
        (function (graphic) {
            var Circle = (function (_super) {
                __extends(Circle, _super);
                function Circle(r, coulour) {
                    var _this = this;
                    if (r === void 0) { r = 5; }
                    if (coulour === void 0) { coulour = "#000"; }
                    _super.call(this);
                    this._fillcolour = coulour;
                    //this.x = x;
                    //this.y = y;
                    this._radius = r;
                    this._graphicfn = function (context) {
                        context.beginPath();
                        context.fillStyle = _this._fillcolour;
                        context.arc(0, 0, _this._radius, 0, 2 * Math.PI, false);
                        context.closePath();
                        context.fill();
                    };
                }
                Object.defineProperty(Circle.prototype, "radius", {
                    get: function () {
                        return this._radius;
                    },
                    set: function (value) {
                        this._radius = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Circle;
            })(DisplayGraphic);
            graphic.Circle = Circle;
            var Rectangle = (function (_super) {
                __extends(Rectangle, _super);
                //private _shapewidth:number;
                //private _shapeheight:number;
                function Rectangle(width, height, coulour) {
                    var _this = this;
                    if (width === void 0) { width = 100; }
                    if (height === void 0) { height = 100; }
                    if (coulour === void 0) { coulour = "#000"; }
                    _super.call(this);
                    this._fillcolour = coulour;
                    //this.x = x;
                    //this.y = y;
                    this.width = width;
                    this.height = height;
                    this._graphicfn = function (context) {
                        context.beginPath();
                        context.fillStyle = _this._fillcolour;
                        context.fillRect(0, 0, _this.width, _this.height);
                        context.closePath();
                    };
                }
                return Rectangle;
            })(DisplayGraphic);
            graphic.Rectangle = Rectangle;
        })(graphic = canvas.graphic || (canvas.graphic = {}));
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/22.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var MovieClip = (function (_super) {
            __extends(MovieClip, _super);
            function MovieClip(movieclipdata) {
                _super.call(this);
                this._moveclipdata = movieclipdata;
                this._nextframeindex = 0;
                this._currframeindex = 1;
                this._totalframescount = movieclipdata.getFrames().length;
                this._frameRate = movieclipdata.getFrameRate();
                this._countdt = 1000 / this._frameRate;
                this._passtime = 0;
                this._lasttime = 0;
                this.width = this._moveclipdata.width;
                this.height = this._moveclipdata.height;
                this.gotoAndStop(1);
            }
            MovieClip.prototype._draw = function (renderer) {
                this._texture_to_render = this._currframe;
                //console.log(this._position)
                var texture = this._texture_to_render;
                if (texture && texture.bitmapData && this._alpha > 0 && this._visible) {
                    renderer.context.globalAlpha = this._worldalpha;
                    renderer.setTransform(this._worldtransform);
                    var offsetX = texture._offsetX - this._moveclipdata.left;
                    var offsetY = texture._offsetY - this._moveclipdata.top;
                    var destW = Math.round(texture._sourceWidth);
                    var destH = Math.round(texture._sourceHeight);
                    renderer.context.drawImage(texture.bitmapData, texture._sourceX, texture._sourceY, texture._sourceWidth, texture._sourceHeight, offsetX, offsetY, destW, destH);
                }
            };
            MovieClip.prototype._onAdd = function () {
                _super.prototype._onAdd.call(this);
                this.setPlayState(this._playstatetmp); //防止在add到stage之前执行playstate;
            };
            MovieClip.prototype.isInViewPort = function () {
                if (!this.isAddtoStage()) {
                    return false;
                }
                var result = this._root.viewPort.hitRectangelTest(this.actualBound());
                return result;
            };
            /**
             * MovieClip API
             */
            MovieClip.prototype.play = function (playtimes) {
                if (playtimes === void 0) { playtimes = 0; }
                this._playtotag = -1;
                this._isPlaying = true;
                this.setPlayTimes(playtimes);
                this.setPlayState(true);
            };
            MovieClip.prototype.stop = function () {
                this._playtotag = -1;
                this._isPlaying = false;
                this.setPlayState(false);
            };
            //TODO:supprot label
            MovieClip.prototype.gotoAndPlay = function (frame, playTimes) {
                if (playTimes === void 0) { playTimes = 0; }
                this.play(playTimes);
                this.gotoFrame(+frame);
            };
            MovieClip.prototype.gotoAndStop = function (frame) {
                this.stop();
                this.gotoFrame(+frame);
            };
            MovieClip.prototype.playToAndStop = function (frame, playtimes) {
                if (playtimes === void 0) { playtimes = 0; }
                this._playtotag = this.selectFrame(frame);
                this.setPlayTimes(playtimes);
                this.setPlayState(true);
            };
            MovieClip.prototype.stopAt = function (frame) {
                this._playtotag = this.selectFrame(frame);
            };
            MovieClip.prototype.setPlayTimes = function (value) {
                if (value === 0)
                    value = -1;
                if (value < 0 || value >= 1) {
                    this._playTimes = value < 0 ? -1 : Math.floor(value);
                }
            };
            MovieClip.prototype.gotoFrame = function (index) {
                var _index = this.selectFrame(index);
                if (this._nextframeindex === _index) {
                    return;
                }
                this._nextframeindex = _index;
                this._updateCurrFrame();
            };
            MovieClip.prototype.selectFrame = function (index) {
                var result = index;
                if (result > this._totalframescount) {
                    result = this._totalframescount;
                }
                else if (result < 1 || !result) {
                    result = 1;
                }
                return result;
            };
            MovieClip.prototype._frameRateControl = function (e) {
                var countdt = this._countdt, currtime = this._passtime + e.dt;
                this._passtime = currtime % countdt;
                var delay = currtime / countdt;
                if (delay < 1) {
                    return;
                }
                delay = delay ^ 0;
                this._nextframeindex += delay;
                if (this._nextframeindex > this._totalframescount) {
                    this._playTimes--;
                    if (this._playtotag < 1) {
                        if (this._playTimes == -2) {
                            this._playTimes++;
                            this._nextframeindex = 1;
                        }
                        else if (this._playTimes > 0) {
                            this._nextframeindex = 1;
                        }
                        else {
                            this._nextframeindex = this._totalframescount;
                            this.stop();
                        }
                    }
                    else {
                        this._nextframeindex = 1;
                    }
                }
                if (this._playtotag >= 1) {
                    //trace(this._playTimes)
                    if (this._playTimes <= 0) {
                        if (this._nextframeindex == this._playtotag) {
                            this.stop();
                            this._playtotag = -1;
                        }
                    }
                }
                this._updateCurrFrame();
            };
            MovieClip.prototype._updateCurrFrame = function () {
                this._currframeindex = this._nextframeindex;
                var currframe = this._currframeindex - 1;
                this._currframe = this._moveclipdata.getFrame(currframe);
            };
            MovieClip.prototype.setPlayState = function (value) {
                if (this._playstate == value) {
                    return;
                }
                if (!this.isAddtoStage()) {
                    this._playstatetmp = value;
                    //trace("'[dev]!this.isAddtoStage()");
                    return;
                }
                this._playstate = value;
                if (value) {
                    this._stage.addEventListener(canvas.Stage.ENTER_MILLSECOND10, this._frameRateControl, this, Number.NEGATIVE_INFINITY);
                }
                else {
                    this._stage.removeEventListener(canvas.Stage.ENTER_MILLSECOND10, this._frameRateControl, this);
                }
            };
            return MovieClip;
        })(canvas.DisplayObject);
        canvas.MovieClip = MovieClip;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/10.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Sprite = (function (_super) {
            __extends(Sprite, _super);
            //protected _visualboundingbox:Rectangle;//可视包围盒
            function Sprite(texture) {
                _super.call(this);
                if (texture) {
                    this.texture = texture;
                }
                else {
                    warn("texture undefined");
                }
            }
            Sprite.prototype._draw = function (renderer) {
                //if(!this.isInViewPort())return;
                this._texture_to_render = this._texture;
                //console.log(this._position)
                if (this._texture_to_render && this._texture_to_render.bitmapData && this._alpha > 0 && this._visible) {
                    renderer.context.drawImage(this._texture_to_render.bitmapData, this._texture_to_render._sourceX, this._texture_to_render._sourceY, this._texture_to_render._sourceWidth, this._texture_to_render._sourceHeight, this._texture_to_render._offsetX, this._texture_to_render._offsetY, this.width, this.height);
                }
            };
            Object.defineProperty(Sprite.prototype, "texture", {
                get: function () {
                    return this._texture;
                },
                set: function (texture) {
                    this._texture = texture;
                    this.width = this._texture._sourceWidth;
                    this.height = this._texture._sourceHeight;
                    //this._visualboundingbox = this._staticboundingbox.clone();
                },
                enumerable: true,
                configurable: true
            });
            Sprite.prototype.isInViewPort = function () {
                if (!this.isAddtoStage()) {
                    return false;
                }
                var result = this._root.viewPort.hitRectangelTest(this.actualBound());
                return result;
            };
            return Sprite;
        })(canvas.DisplayObject);
        canvas.Sprite = Sprite;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (_canvas) {
        var Stage = (function (_super) {
            __extends(Stage, _super);
            function Stage(canvas, width, height, opts) {
                if (width === void 0) { width = 320; }
                if (height === void 0) { height = 480; }
                if (opts === void 0) { opts = {}; }
                _super.call(this);
                this._startTime = 0;
                this._lastTime = 0;
                this._enterframemap = new Dict();
                //Stage的宽高一旦被初始化之后就不会改变
                this._staticboundingbox.width = width;
                this._staticboundingbox.height = height;
                this.setStageWidth(width);
                this.setStageHeight(height);
                this._options = opts;
                this.initcomponent();
                this._maincontext = new _canvas.CanvasMainContext(this, canvas);
                this.resizecontext();
                this.initcontext();
            }
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
            Object.defineProperty(Stage.prototype, "width", {
                //只读
                get: function () {
                    return this._staticboundingbox.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "height", {
                get: function () {
                    return this._staticboundingbox.height;
                },
                enumerable: true,
                configurable: true
            });
            //设置渲染宽度
            Stage.prototype.setStageWidth = function (width) {
                this._stageWidth = width;
                this._staticboundingbox.width = width;
            };
            //设置渲染高度
            Stage.prototype.setStageHeight = function (height) {
                this._stageHeight = height;
                this._staticboundingbox.height = height;
            };
            //初始化组件
            Stage.prototype.initcomponent = function () {
                this._ticker = new _canvas.Ticker(this);
                this._camera = new _canvas.Camera2D(this);
                //this._camera.zoomTo(this.width>>1,this.height*1,1);
                //trace(this)
                this._startTime = Date.now();
            };
            //初始化子Context
            Stage.prototype.initcontext = function () {
                this._touchcontext = new _canvas.TouchContext(this);
            };
            //渲染循环
            Stage.prototype.render = function (renderer) {
                this._transform(); //遍历显示对象树，计算每个显示对象变换矩阵
                this._render(renderer); //绘制每个显示对象
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
            Object.defineProperty(Stage.prototype, "container", {
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
            Object.defineProperty(Stage.prototype, "gasket", {
                /**
                 * 获得夹层
                 * @returns {alcedo.dom.DomElement}
                 */
                get: function () {
                    return this._maincontext.gasket;
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
            Object.defineProperty(Stage.prototype, "options", {
                //Stage的设置
                get: function () {
                    return this._options;
                },
                enumerable: true,
                configurable: true
            });
            //resize
            Stage.prototype.resizecontext = function () {
                this._maincontext.resizecontext();
            };
            Object.defineProperty(Stage.prototype, "orientchanged", {
                //获得轴向是否改变了
                get: function () {
                    return this._maincontext.checkorient();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "viewPort", {
                //获得取景器
                get: function () {
                    return this._camera.viewsafe();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stage.prototype, "camera", {
                //获得镜头
                get: function () {
                    return this._camera;
                },
                enumerable: true,
                configurable: true
            });
            Stage.prototype._transform = function () {
                var wt = this._worldtransform;
                wt.identity();
                this._getMatrix(wt);
                this.eachChilder(function (child) {
                    child._transform();
                });
            };
            Stage.prototype.isInViewPort = function () {
                return true;
                //nothing
            };
            Stage.prototype.addChild = function (child) {
                if (child instanceof Stage)
                    return; //todo:error log here;
                _super.prototype.addChild.call(this, child);
            };
            Stage.ENTER_FRAME = "Stage_ENTER_FRAME";
            Stage.ENTER_MILLSECOND10 = "Stage_ENTER_20MILLSECOND";
            Stage.ENTER_SECOND = "Stage_ENTER_SECOND";
            Stage.RESIZED = "Stage_RESIZED";
            Stage.RESIZE = "Stage_RESIZE";
            return Stage;
        })(_canvas.DisplatObjectContainer);
        _canvas.Stage = Stage;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/24.
 * 一枚单独的栗子
 * 栗子的生命周期 create prebron alive decaying decay
 *
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Particle = (function () {
            function Particle() {
                this.rotation = 0;
                this.alpha = 1;
                this._mass = 1; //质量哦
                this._onDecayTask = [];
                this.position = new canvas.Vector2D();
                this.scale = new canvas.Vector2D(1, 1);
                this.pivot = new canvas.Vector2D();
                this._velocity = new canvas.Vector2D();
                this._acceleration = new canvas.Vector2D();
                this.worldtransform = new canvas.Matrix2D();
                this.create(0, 0);
            }
            Particle.prototype.scaleAll = function (value) {
                this.scale.x = value;
                this.scale.y = value;
            };
            Particle.prototype._stagetransform = function (stage) {
                this.worldtransform.identityMatrix(stage.worldtransform);
            };
            Particle.prototype._transform = function () {
                //this.worldtransform.identityMatrix(Matrix2D.identity);
                this.worldtransform.appendTransform(this.position.x, this.position.y, this.scale.x, this.scale.y, this.rotation, 0, 0, this.pivot.x, this.pivot.y);
            };
            Particle.prototype._draw = function (renderer) {
                this.display(renderer);
            };
            Particle.prototype.display = function (renderer) {
                //be overriden
                var context = renderer.context;
                context.beginPath();
                context.arc(0, 0, 6, 0, 2 * Math.PI, false);
                context.fillStyle = '#95a5a6';
                context.fill();
                context.lineWidth = 3;
                context.strokeStyle = '#2c3e50';
                context.stroke();
            };
            /**
             * [控制栗子运动的接口]
             * 给栗子施加一个力
             * @param vector
             */
            Particle.prototype.applyForce = function (vector) {
                this._velocity.add(vector.divide(canvas.Vector2D.identity(this._mass, this._mass)));
            };
            /**
             * 栗子生命周期开始
             * @param x
             * @param y
             * @param mass
             * @param preserve
             */
            Particle.prototype.create = function (x, y, mass) {
                if (mass === void 0) { mass = 1; }
                var preserve = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    preserve[_i - 3] = arguments[_i];
                }
                this.position.reset(x, y);
                this.scale.reset(1, 1);
                this.rotation = 0;
                this._velocity.reset();
                this._acceleration.reset();
                this._currtime = 0;
                this._lifetime = 60000;
                this._onDecayTask = [];
                this.alpha = 1;
                this._mass = mass;
                this._isdecayed = false;
                this._currphase = 0;
                this.oncreate(x, y, mass);
                this._lifephase = [this.prebron, this.alive, this.decaying];
            };
            Particle.prototype.oncreate = function (x, y, mass) {
                if (mass === void 0) { mass = 1; }
            };
            Particle.prototype.readPhase = function (e) {
                if (this._isdecayed)
                    return;
                if (this._lifephase[this._currphase].call(this, e) === true) {
                    this._currphase++;
                }
                //trace(this._currtime>this._lifetime);
                if (this._currphase >= this._lifephase.length || this._currtime > this._lifetime) {
                    this.decay();
                }
            };
            /**
             * 当栗子诞生
             */
            Particle.prototype.prebron = function () {
                this.scale.x += 0.05;
                this.scale.y += 0.05;
                if (this.scale.x > 1.6) {
                    this.scale.x = 1.6;
                    this.scale.y = 1.6;
                    return true;
                }
            };
            /**
             * 栗子
             */
            Particle.prototype.alive = function () {
                return true;
            };
            /**
             * 栗子逝去
             */
            Particle.prototype.decaying = function () {
                this.alpha -= 0.01;
                this.scale.x -= 0.01;
                this.scale.y -= 0.01;
                if (this.alpha < 0) {
                    this.alpha = 0;
                    return true;
                }
            };
            Particle.prototype.decay = function () {
                this._isdecayed = true;
                alcedo.AppNotifyable.notifyArray(this._onDecayTask, [this]);
            };
            Particle.prototype.onDecay = function (callback, thisObject, param) {
                if (param === void 0) { param = []; }
                this._onDecayTask.push({ callback: callback, thisObject: thisObject, param: param });
            };
            Particle.prototype.update = function (e) {
                this._velocity.add(this._acceleration);
                this.position.add(this._velocity);
                this._currtime += e.dt;
                this.readPhase(e);
            };
            return Particle;
        })();
        canvas.Particle = Particle;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/24.
 * 离子发射器
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var ParticleEmitter = (function (_super) {
            __extends(ParticleEmitter, _super);
            /**
             * @param initial
             * @param opts
             * @particleClass 粒子类
             */
            function ParticleEmitter(opts) {
                if (opts === void 0) { opts = {}; }
                _super.call(this);
                //trace(opts)
                this._particles = [];
                this._particlespool = [];
                this._currinitial = new canvas.Vector2D();
                //this._forcemoment = new Vector2D();
                this._force = new canvas.Vector2D();
                this._shouldcreate = 0;
                //frequency
                this._initial = opts.initial ? opts.initial.clone() : new canvas.Vector2D();
                this._spread = opts.spread || 0;
                this._mass = opts.massrandom || 1;
                this._massrandom = opts.massrandom || 0;
                this._rate = opts.rate || 1;
                this._max = opts.max || 1;
                this._particleClass = opts.particleClass ? opts.particleClass : canvas.Particle;
            }
            ParticleEmitter.prototype._draw = function (renderer) {
                var wt, partile;
                for (var i = 0; i < this._particles.length; i++) {
                    partile = this._particles[i];
                    partile._stagetransform(this._stage);
                    partile._transform();
                    renderer.context.globalAlpha = partile.alpha * this._alpha;
                    //trace(partile.alpha,this._alpha,partile.alpha*this._alpha);
                    //partile.worldtransform = this._getMatrix(partile.worldtransform)
                    renderer.setTransform(partile.worldtransform);
                    partile._draw(renderer);
                }
            };
            /**
             * 创建一枚栗子
             * @private
             */
            ParticleEmitter.prototype._createOneParticle = function () {
                var _this = this;
                var partile;
                if (this._particlespool.length > 0) {
                    partile = this._particlespool.pop();
                }
                else {
                    partile = new this._particleClass();
                }
                this._ParticleInit(partile);
                this._particles.push(partile);
                partile.onDecay(function (particle) {
                    _this._particles.fastRemove(_this._particles.indexOf(particle)); //you dian diao a
                    _this._particlespool.push(particle);
                }, this);
            };
            ParticleEmitter.prototype._ParticleInit = function (paricle) {
                paricle.create(this.globalx, this.globaly);
                this._currinitial.resetAs(this._initial);
                if (this._spread) {
                    var _randeg = Math.randomFrom(-1, 1) * this._spread / 2;
                    var _curdeg = _randeg + this._initial.deg;
                    this._currinitial.resetToDeg(_curdeg);
                }
                paricle.applyForce(this._currinitial);
            };
            ParticleEmitter.prototype._updateParticles = function (e) {
                var partile;
                for (var i = 0; i < this._particles.length; i++) {
                    partile = this._particles[i];
                    this._updateOneParticle(partile);
                    partile.update(e);
                }
                //if(this._forcemoment.length>0){
                //    this._forcemoment.reset();
                //}
                this._shouldcreate += (this._rate / 100);
                var delay = (this._shouldcreate) ^ 0;
                if (this._shouldcreate > 1)
                    this._shouldcreate = 0;
                //trace(delay,this._particles.length,this._max);
                if (delay < 1 || this._particles.length >= this._max)
                    return;
                for (var i = 0; i < delay; i++) {
                    //TODO:当i>1时说明错过了上次创建粒子的时机
                    this._createOneParticle();
                }
            };
            /**
             * 更新一枚栗子
             * @param partile
             * @private
             */
            ParticleEmitter.prototype._updateOneParticle = function (partile) {
                partile.applyForce(this._force);
                //if(this._forcemoment.length>0){
                //    partile.applyForce(this._forcemoment);
                //}
            };
            //private _forcemoment:Vector2D;
            ParticleEmitter.prototype.applyForce = function (force) {
                this._force.add(force);
            };
            Object.defineProperty(ParticleEmitter.prototype, "initialdegree", {
                set: function (drgee) {
                    this._initial.resetToDeg(drgee);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 发射器开关控制系统
             * @private
             */
            ParticleEmitter.prototype._onAdd = function () {
                _super.prototype._onAdd.call(this);
                if (this.isAddtoStage()) {
                    this.setPlayState(this._playstatetmp);
                }
            };
            ParticleEmitter.prototype.play = function () {
                this.setPlayState(true);
            };
            ParticleEmitter.prototype.stop = function () {
                this.setPlayState(false);
            };
            ParticleEmitter.prototype.setPlayState = function (value) {
                //trace(this._playstate , value)
                if (this._playstate == value) {
                    return;
                }
                if (!this.isAddtoStage()) {
                    this._playstatetmp = value;
                    //trace("'[dev particle]!this.isAddtoStage()");
                    return;
                }
                this._playstate = value;
                if (value) {
                    this._stage.addEventListener(canvas.Stage.ENTER_FRAME, this._updateParticles, this);
                }
                else {
                    this._stage.removeEventListener(canvas.Stage.ENTER_FRAME, this._updateParticles, this);
                }
            };
            ParticleEmitter.prototype.dispose = function () {
                //todo:释放粒子发射器
            };
            return ParticleEmitter;
        })(canvas.DisplayObject);
        canvas.ParticleEmitter = ParticleEmitter;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/19.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var DisplayObjectEvent = (function (_super) {
            __extends(DisplayObjectEvent, _super);
            function DisplayObjectEvent() {
                _super.apply(this, arguments);
            }
            DisplayObjectEvent.ON_ADD = "DisplayObjectEventON_ON_ADD";
            DisplayObjectEvent.ON_REMOVE = "DisplayObjectEventON_ON_REMOVE";
            DisplayObjectEvent.ON_ADD_TO_STAGE = "DisplayObjectEventON_ADD_TO_STAGE";
            return DisplayObjectEvent;
        })(alcedo.Event);
        canvas.DisplayObjectEvent = DisplayObjectEvent;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/11.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Segment2D = (function () {
            function Segment2D(begin, end) {
                this.begin = new canvas.Point2D(begin.x, begin.y);
                this.end = new canvas.Point2D(end.x, end.y);
            }
            Object.defineProperty(Segment2D.prototype, "vector", {
                /**
                 * 转换成二维向量
                 */
                get: function () {
                    return canvas.Vector2D.createFromPoint(this.begin, this.end);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Segment2D.prototype, "length", {
                get: function () {
                    return this.vector.length;
                },
                enumerable: true,
                configurable: true
            });
            Segment2D.identity = new Segment2D(canvas.Point2D.identity(), canvas.Point2D.identity());
            return Segment2D;
        })();
        canvas.Segment2D = Segment2D;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/5/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Bezier2D = (function () {
            function Bezier2D(points, accuracy) {
                if (accuracy === void 0) { accuracy = 66; }
                this._controlpoints = [];
                if (points.length < 0)
                    return;
                for (var i = 0; i < points.length; i++) {
                    this._controlpoints.push(new canvas.Point2D(points[i].x, points[i].y));
                }
                this._controlpoints = this._controlpoints.map(function (p) { return p; });
                this._generate(1 / accuracy);
            }
            Bezier2D.prototype._generate = function (step) {
                var points = [];
                //make sure the curve goes through the first point
                points.push(this._controlpoints[0]);
                for (var t = step; t <= 1; t += step) {
                    points.push(Bezier2D.lerpCurve(this._controlpoints, t));
                }
                //make sure the curve goes through the last point
                points.push(this._controlpoints.last);
                this._curve = points;
            };
            Object.defineProperty(Bezier2D.prototype, "curve", {
                get: function () {
                    return this._curve;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Bezier2D.prototype, "controlpoints", {
                get: function () {
                    return this._controlpoints;
                },
                enumerable: true,
                configurable: true
            });
            //public get length(){
            //
            //}
            Bezier2D.prototype.getPointAt = function (precent) {
                var _precent = precent;
                if (_precent > 100)
                    _precent = _precent % 100;
                var _index = this._curve.length * (_precent / 100) ^ 0;
                return this._curve[_index];
            };
            Bezier2D.prototype.eachPointsOnCurve = function (fn) {
                for (var i = 0; i < this._curve.length; i++) {
                    fn(this._curve[i]);
                }
            };
            Bezier2D.lerpCurve = function (inPoints, t) {
                if (inPoints.length == 1) {
                    return inPoints[0];
                }
                var points = [];
                for (var i = 0; i < inPoints.length - 1; i++) {
                    var pt1 = inPoints[i];
                    var pt2 = inPoints[i + 1];
                    points[i] = this.lerpPoint(pt1, pt2, t);
                }
                return this.lerpCurve(points, t);
            };
            Bezier2D.lerpPoint = function (fromPoint, toPoint, t) {
                var s = 1.0 - t;
                var x = fromPoint.x * s + toPoint.x * t;
                var y = fromPoint.y * s + toPoint.y * t;
                return new canvas.Point2D(x, y);
            };
            return Bezier2D;
        })();
        canvas.Bezier2D = Bezier2D;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/11.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Circle = (function () {
            function Circle(center, r) {
                this.center = center;
                this.radius = r;
            }
            return Circle;
        })();
        canvas.Circle = Circle;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/5.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (_canvas) {
        var Context2DRenderer = (function (_super) {
            __extends(Context2DRenderer, _super);
            function Context2DRenderer() {
                _super.call(this);
            }
            /**
             * 渲染主循环
             */
            Context2DRenderer.prototype.render = function () {
                //transform
                this._canvasRenderContext.setTransform(1, 0, 0, 1, 0, 0); //重置canvas的transform
                this._canvasRenderContext.globalAlpha = 1;
                this._canvasRenderContext.globalCompositeOperation = "source-over";
                if (this._renderoption.background) {
                    this._canvasRenderContext.fillStyle = this._renderoption.background;
                    this._canvasRenderContext.fillRect(0, 0, this._stage.stageWidth, this._stage.stageHeight);
                }
                else {
                    this._canvasRenderContext.clearRect(0, 0, this._stage.stageWidth, this._stage.stageHeight);
                }
                //render
                //this._stage._debugdraw(this);
                this._stage.render(this);
                alcedo.AppNotifyable.notify(this._mainlooptask, _canvas.CanvasRenderer.RENDERER_MAIN_LOOP, [this]);
                _canvas.animationFrame(this.render, this);
            };
            Context2DRenderer.prototype.setTransform = function (matrix) {
                //在没有旋转缩放斜切的情况下，先不进行矩阵偏移，等下次绘制的时候偏移
                this._canvasRenderContext.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            };
            Context2DRenderer.prototype.executeMainLoop = function (stage, canvas) {
                this._stage = stage;
                this._canvas = canvas;
                this._canvasRenderContext = this._canvas.getContext("2d");
                this._renderoption = this._stage._options;
                //TODO:判断option是否合法
                //使用平滑设置
                if ("imageSmoothingEnabled" in this._canvasRenderContext) {
                    this._smoothProperty = "imageSmoothingEnabled";
                }
                else if ("webkitImageSmoothingEnabled" in this._canvasRenderContext) {
                    this._smoothProperty = "webkitImageSmoothingEnabled";
                }
                else if ("mozImageSmoothingEnabled" in this._canvasRenderContext) {
                    this._smoothProperty = "mozImageSmoothingEnabled";
                }
                else if ("oImageSmoothingEnabled" in this._canvasRenderContext) {
                    this._smoothProperty = "oImageSmoothingEnabled";
                }
                else if ("msImageSmoothingEnabled" in this._canvasRenderContext) {
                    this._smoothProperty = "msImageSmoothingEnabled";
                }
                //混合设置
                this._canvasRenderContext.globalCompositeOperation = "source-over";
                this.smooth = true;
                _canvas.animationFrame(this.render, this);
            };
            Object.defineProperty(Context2DRenderer.prototype, "context", {
                get: function () {
                    return this._canvasRenderContext;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Context2DRenderer.prototype, "smooth", {
                set: function (flag) {
                    this._canvasRenderContext[this._smoothProperty] = flag;
                },
                enumerable: true,
                configurable: true
            });
            Context2DRenderer.prototype.clearScreen = function () {
                this._canvasRenderContext.clear();
            };
            return Context2DRenderer;
        })(_canvas.CanvasRenderer);
        _canvas.Context2DRenderer = Context2DRenderer;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/5.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var WebGLRenderer = (function (_super) {
            __extends(WebGLRenderer, _super);
            function WebGLRenderer() {
                _super.apply(this, arguments);
            }
            return WebGLRenderer;
        })(canvas.CanvasRenderer);
        canvas.WebGLRenderer = WebGLRenderer;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/22.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var MovieClipRepository = (function (_super) {
            __extends(MovieClipRepository, _super);
            function MovieClipRepository() {
                _super.call(this);
                this._movieclipdataspool = new Dict();
            }
            /**
             * 解析MovieClipData并存入仓库
             * @param dataset
             * @param sheet
             */
            MovieClipRepository.prototype.praseMovieClipData = function (dataset, sheettexture) {
                var _dataset = dataset;
                if (Array.isArray(_dataset)) {
                    _dataset = _dataset[0];
                }
                if (!_dataset.mc) {
                    trace("praseMovieClipData dataset format invalid!!!", _dataset);
                    return;
                } //invalid foramt
                if (_dataset.res && sheettexture) {
                    var _tmpsheetdata = this.praseSheetData(_dataset.res, new canvas.SpriteSheet(sheettexture));
                }
                for (var name in _dataset.mc) {
                    if (typeof name == "string") {
                        var moveclip, frames = [], moveclipdata = _dataset.mc[name];
                        if (!this._movieclipdataspool.has(name) && Array.isArray(moveclipdata.frames)) {
                            moveclip = new MovieClipData(name);
                            for (var i = 0; i < moveclipdata.frames.length; i++) {
                                var texture = _tmpsheetdata.get(moveclipdata.frames[i].res);
                                texture._offsetX = moveclipdata.frames[i].x || 0;
                                texture._offsetY = moveclipdata.frames[i].y || 0;
                                frames.push(texture);
                            }
                            if (frames.length > 0)
                                moveclip._importFrames(frames, moveclipdata.frameRate);
                            this._movieclipdataspool.set(name, moveclip);
                        }
                        else {
                        }
                    }
                }
            };
            /**
             * 解析雪碧图(egret)
             * @param sheetdataset
             * @param sheet
             */
            MovieClipRepository.prototype.praseSheetData = function (sheetdataset, sheet) {
                var texture, texturedata, name, sheetdata = new Dict();
                for (name in sheetdataset) {
                    if (typeof name == "string") {
                        texturedata = sheetdataset[name];
                        texture = sheet.createTexture(texturedata.x, texturedata.y, texturedata.w, texturedata.h);
                        sheetdata.set(name, texture);
                    }
                }
                return sheetdata;
            };
            MovieClipRepository.prototype.get = function (name) {
                return this._movieclipdataspool.get(name);
            };
            MovieClipRepository.instanceable = true;
            return MovieClipRepository;
        })(alcedo.AppSubCore);
        canvas.MovieClipRepository = MovieClipRepository;
        var MovieClipData = (function (_super) {
            __extends(MovieClipData, _super);
            function MovieClipData(name) {
                _super.call(this);
                this._name = name;
                this._bound = new alcedo.canvas.Rectangle();
            }
            MovieClipData.prototype._importFrames = function (frames, frameRate) {
                this._frames = frames;
                this._framerate = frameRate;
                this._framescount = frames.length;
                this._bound = MovieClipData.getBoundFromFrames(frames);
            };
            MovieClipData.prototype.getFrames = function () {
                return this._frames;
            };
            MovieClipData.prototype.getFrame = function (index) {
                return this._frames[index];
            };
            MovieClipData.prototype.getFrameRate = function () {
                return this._framerate;
            };
            Object.defineProperty(MovieClipData.prototype, "left", {
                get: function () {
                    return this._bound.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MovieClipData.prototype, "top", {
                get: function () {
                    return this._bound.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MovieClipData.prototype, "width", {
                get: function () {
                    return this._bound.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MovieClipData.prototype, "height", {
                get: function () {
                    return this._bound.height;
                },
                enumerable: true,
                configurable: true
            });
            MovieClipData.getBoundFromFrames = function (frames) {
                var lefts = [];
                var rights = [];
                var tops = [];
                var bottoms = [];
                for (var i = 0; i < frames.length; i++) {
                    var frame = frames[i];
                    lefts.push(frame._offsetX);
                    rights.push(frame._sourceWidth);
                    tops.push(frame._offsetY);
                    bottoms.push(frame._sourceHeight);
                }
                var minleft = Math.min.apply(Math, lefts);
                var mintop = Math.min.apply(Math, tops);
                var maxright = Math.max.apply(Math, rights);
                var maxbottom = Math.max.apply(Math, bottoms);
                return new canvas.Rectangle(minleft, mintop, maxright, maxbottom);
            };
            return MovieClipData;
        })(alcedo.AppObject);
        canvas.MovieClipData = MovieClipData;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/22.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var SpriteSheet = (function (_super) {
            __extends(SpriteSheet, _super);
            function SpriteSheet(texture) {
                _super.call(this);
                this._sourceWidth = 0;
                this._sourceHeight = 0;
                this._texture = texture;
                this._sourceWidth = texture._sourceWidth;
                this._sourceHeight = texture._sourceHeight;
                this._textureMap = new Dict();
            }
            //public createTexturesFromConfig(config:any){
            //
            //}
            SpriteSheet.prototype.getTexture = function (name) {
                return this._textureMap.get(name);
            };
            SpriteSheet.prototype.createTexture = function (sourceX, sourceY, sourceWidth, sourceHeight) {
                if (sourceX === void 0) { sourceX = 0; }
                if (sourceY === void 0) { sourceY = 0; }
                var texture = this._texture.clone();
                texture._sourceX = sourceX;
                texture._sourceY = sourceY;
                texture._sourceWidth = sourceWidth;
                texture._sourceHeight = sourceHeight;
                return texture;
            };
            return SpriteSheet;
        })(alcedo.AppObject);
        canvas.SpriteSheet = SpriteSheet;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/8.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var Texture = (function (_super) {
            __extends(Texture, _super);
            function Texture(value, args) {
                _super.call(this);
                this._sourceX = 0;
                this._sourceY = 0;
                /**
                 * 表示这个纹理在 源 bitmapData 上的宽度
                 */
                this._sourceWidth = 0;
                /**
                 * 表示这个纹理在 源 bitmapData 上的高度
                 */
                this._sourceHeight = 0;
                /**
                 * 这个纹理的纹理x,Y,width,height
                 */
                //public _textureX:number = 0;
                //public _textureY:number = 0;
                this._textureWidth = 0;
                this._textureHeight = 0;
                this._offsetX = 0;
                this._offsetY = 0;
                /**
                 * 表示这个纹理在 源 bitmapData 上的宽高比
                 */
                this._sourceW2H = 0;
                this._bitmapData = null;
                this._bitmapData = value;
                this._sourceWidth = this._textureWidth = value.width;
                this._sourceHeight = this._textureHeight = value.height;
                this._sourceW2H = this._sourceWidth / this._sourceHeight;
                this._bound = new alcedo.canvas.Rectangle();
            }
            Object.defineProperty(Texture.prototype, "bitmapData", {
                /**
                 * 纹理对象中得位图数据
                 * @member {ImageData} canvas.Texture#bitmapData
                 */
                get: function () {
                    return this._bitmapData;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Texture.prototype, "sourceUrl", {
                get: function () {
                    if (this._bitmapData.src) {
                        return this._bitmapData.src;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Texture.prototype.clone = function () {
                var texture = new Texture(this._bitmapData);
                return texture;
            };
            return Texture;
        })(alcedo.AppObject);
        canvas.Texture = Texture;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
})(alcedo || (alcedo = {}));
/**
 * Created by tommyZZM on 2015/4/9.
 */
var alcedo;
(function (alcedo) {
    var canvas;
    (function (canvas) {
        var TextureRepository = (function (_super) {
            __extends(TextureRepository, _super);
            function TextureRepository() {
                _super.call(this);
                this._texurespool = new Dict();
                this._repeatkey = {};
            }
            TextureRepository.prototype.set = function (key, value) {
                this._texurespool.set(key, value);
            };
            TextureRepository.prototype.get = function (key) {
                //trace(a$.proxy(net.AsyncRES))
                if (!this._texurespool.has(key)) {
                    if (alcedo.core(alcedo.net.AsyncRES).get(key) && alcedo.core(alcedo.net.AsyncRES).get(key)[0] instanceof HTMLImageElement) {
                        var img = alcedo.core(alcedo.net.AsyncRES).get(key)[0];
                        var texture = new canvas.Texture(img);
                        this._texurespool.set(key, texture);
                    }
                }
                return this._texurespool.get(key);
            };
            TextureRepository.prototype.find = function (reg) {
                var i, keys = alcedo.core(alcedo.net.AsyncRES).keys, result = [];
                for (i = 0; i < keys.length; i++) {
                    if (reg.test(keys[i])) {
                        if (this.get(keys[i]))
                            result.push(this.get(keys[i]));
                    }
                }
                return result;
            };
            TextureRepository.instanceable = true;
            TextureRepository.ASSETS_COMPLETE = "TextureRepository_LOAD_COMPLETE";
            TextureRepository.ASSETS_PROGRESSING = "TextureRepository_LOAD_ASSETS_PROGRESSING";
            return TextureRepository;
        })(alcedo.AppSubCore);
        canvas.TextureRepository = TextureRepository;
    })(canvas = alcedo.canvas || (alcedo.canvas = {}));
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
