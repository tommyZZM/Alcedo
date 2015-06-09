/**
 * Created by tommyZZM on 2015/4/8.
 */
module alcedo {
    export module canvas {
        export class Point2D implements Ixy{
            public x:number;

            public y:number;

            private static _identity:Point2D = new Point2D();
            public static identity(x:number=0,y:number=0):Point2D{
                Point2D._identity.reset(x,y);
                return Point2D._identity;
            }
            public constructor(x:number=0,y:number=0){
                //super();
                this.x = x;
                this.y = y;
            }

            /**
             * 克隆点对象
             */
            public clone():Point2D {
                return new Point2D(this.x, this.y);
            }

            /**
             * 设置X,y
             */
            public reset(x:number=0,y:number=0){
                this.x = x;
                this.y = y;
            }

            /** 加 **/
            public add(vector:Vector2D){
                this.x += vector.x;
                this.y += vector.y;

                return this;
            }
            /** 减 **/
            public subtract(vector: Vector2D): Point2D {
                this.x -= vector.x;
                this.y -= vector.y;

                return this;
            }
            /** 乘 **/
            public multiply(vector: Vector2D): Point2D {
                this.x *= vector.x;
                this.y *= vector.y;

                return this;
            }
            /** 除 **/
            public divide(vector: Vector2D): Point2D {
                this.x /= vector.x;
                this.y /= vector.y;

                return this;
            }
        }
    }
}