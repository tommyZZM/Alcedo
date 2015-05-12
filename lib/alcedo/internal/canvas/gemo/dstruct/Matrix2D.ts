/**
 * Created by tommyZZM on 2015/4/6.
 */
module alcedo {
    export module canvas {
        export class Matrix2D extends AppObject{
            /**
             * 创建一个 canvas.Matrix2D 对象
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
            public static identity:Matrix2D = new Matrix2D();
            constructor(a:number = 1, b:number = 0, c:number = 0, d:number = 1, tx:number = 0, ty:number = 0) {
                super();
                this.a = a;
                this.b = b;
                this.c = c;
                this.d = d;
                this.tx = tx;
                this.ty = ty;
            }

            /**
             * [缩放]或[旋转]图像时影响像素沿 x 轴定位的值
             */
            public a:number;
            /**
             * [旋转]或[倾斜]图像时影响像素沿 y 轴定位的值
             */
            public b:number;
            /**
             * [旋转]或[倾斜]图像时影响像素沿 x 轴定位的值
             */
            public c:number;
            /**
             * [缩放]或[旋转]图像时影响像素沿 y 轴定位的值
             */
            public d:number;
            /**
             * 沿 x 轴平移每个点的距离
             */
            public tx:number;
            /**
             * 沿 y 轴平移每个点的距离
             */
            public ty:number;

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
            public prepend(a:number, b:number, c:number, d:number, tx:number, ty:number):Matrix2D {
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
            }

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
            public append(a:number, b:number, c:number, d:number, tx:number, ty:number):Matrix2D {
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
            }

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
            public prependTransform(x:number, y:number, scaleX:number, scaleY:number, rotation:number, skewX:number, skewY:number, regX:number, regY:number):Matrix2D {

                var r = rotation* Constant.DEG_TO_RAD;// * Matrix2D.DEG_TO_RAD;
                var cos = Constant.cos(r);
                var sin = Constant.sin(r);

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
                    this.prepend(Constant.cos(skewY), Constant.sin(skewY), -Constant.sin(skewX), Constant.cos(skewX), x, y);
                } else {
                    this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
                }
                return this;
            }


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
            public appendTransform(x:number, y:number, scaleX:number, scaleY:number, rotation:number, skewX:number, skewY:number, regX:number, regY:number):Matrix2D {
                if (rotation % 360) {
                    var r = rotation*Constant.DEG_TO_RAD;// * Matrix2D.DEG_TO_RAD;
                    var cos = Constant.cos(r);
                    var sin = Constant.sin(r);
                } else {
                    cos = 1;
                    sin = 0;
                }

                if (skewX || skewY) {
                    // TODO: can this be combined into a single append?
                    //                skewX *= Matrix2D.DEG_TO_RAD;
                    //                skewY *= Matrix2D.DEG_TO_RAD;
                    this.append(Constant.cos(skewY), Constant.sin(skewY), -Constant.sin(skewX), Constant.cos(skewX), x, y);
                    this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
                } else {
                    this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
                }

                if (regX || regY) {
                    // prepend the registration offset:
                    this.tx -= regX * this.a + regY * this.c;
                    this.ty -= regX * this.b + regY * this.d;
                }
                return this;
            }

            /**
             * 对 Matrix2D 对象应用旋转转换。
             * 矩阵旋转，以角度制为单位
             * @method Matrix2D#rotate
             * @param angle {number} 角度
             * @returns {Matrix2D}
             */
            public rotate(angle:number):Matrix2D {
                var cos = Constant.cos(angle);
                var sin = Constant.sin(angle);

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
            }

            /**
             * 矩阵斜切，以角度值为单位
             * @method Matrix2D#skew
             * @param skewX {number} x方向斜切
             * @param skewY {number} y方向斜切
             * @returns {Matrix2D}
             */
            public skew(skewX:number, skewY:number):Matrix2D {
            //            skewX = skewX * Matrix2D.DEG_TO_RAD;
            //            skewY = skewY * Matrix2D.DEG_TO_RAD;
                this.append(Constant.cos(skewY), Constant.sin(skewY), -Constant.sin(skewX), Constant.cos(skewX), 0, 0);
                return this;
            }

            /**
             * 矩阵缩放
             * @method Matrix2D#scale
             * @param x {number} 水平缩放
             * @param y {number} 垂直缩放
             * @returns {Matrix2D}
             */
            public scale(x:number, y:number):Matrix2D {
                this.a *= x;
                this.d *= y;
                this.c *= x;
                this.b *= y;
                this.tx *= x;
                this.ty *= y;
                return this;
            }


            /**
             * 沿 x 和 y 轴平移矩阵，由 x 和 y 参数指定。
             * @method Matrix2D#translate
             * @param x {number} 沿 x 轴向右移动的量（以像素为单位）。
             * @param y {number} 沿 y 轴向下移动的量（以像素为单位）。
             * @returns {Matrix2D}
             */
            public translate(x:number, y:number):Matrix2D {
                this.tx += x;
                this.ty += y;
                return this;
            }

            /**
             * 为每个矩阵属性设置一个值，该值将导致 null 转换。
             * 通过应用恒等矩阵转换的对象将与原始对象完全相同。
             * 调用 identity() 方法后，生成的矩阵具有以下属性：a=1、b=0、c=0、d=1、tx=0 和 ty=0。
             * @method Matrix2D#identity
             * @returns {Matrix2D}
             */
            public identity():Matrix2D {
                this.a = this.d = 1;
                this.b = this.c = this.tx = this.ty = 0;
                return this;
            }

            /**
             * 矩阵重置为目标矩阵
             * @method Matrix2D#identityMatrix
             * @param Matrix2D {Matrix2D} 重置的目标矩阵
             * @returns {Matrix2D}
             */
            public identityMatrix(Matrix2D:Matrix2D):Matrix2D {
                this.a = Matrix2D.a;
                this.b = Matrix2D.b;
                this.c = Matrix2D.c;
                this.d = Matrix2D.d;
                this.tx = Matrix2D.tx;
                this.ty = Matrix2D.ty;
                return this;
            }

            /**
             * 执行原始矩阵的逆转换。
             * 您可以将一个逆矩阵应用于对象来撤消在应用原始矩阵时执行的转换。
             * @method Matrix2D#invert
             * @returns {Matrix2D}
             */
            public invert():Matrix2D {
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
            }

            private _toarray;
            public toArray(transpose) {
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
            }
        }
    }
}