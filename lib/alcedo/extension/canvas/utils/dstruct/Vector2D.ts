/**
 * Created by tommyZZM on 2015/4/8.
 */
module alcedo {
    export module canvas {
        export class Vector2D {
            public x:number;

            public y:number;

            public constructor(x:number=0,y:number=0){
                //super();
                this.x = x;
                this.y = y;
            }

            //四则运算
            /** 加 **/
            public add(vector:Vector2D){
                this.x += vector.x;
                this.y += vector.y;

                return this;
            }
            /** 减 **/
            public subtract(vector: Vector2D): Vector2D {
                this.x -= vector.x;
                this.y -= vector.y;

                return this;
            }
            /** 乘 **/
            public multiply(vector: Vector2D): Vector2D {
                this.x *= vector.x;
                this.y *= vector.y;

                return this;
            }
            /** 除 **/
            public divide(vector: Vector2D): Vector2D {
                this.x /= vector.x;
                this.y /= vector.y;

                return this;
            }

            /**
             * 矢量对象长度
             */
            public get length():number{
                var result = Math.sqrt(this.x*this.x + this.y*this.y);
                return result;
            }

            public toDeg():number{
                return 0;
            }

            public toRad():number{
                return 0
            }

            /**
             * 克隆矢量对象
             */
            public clone():Vector2D {
                return new Vector2D(this.x, this.y);
            }

            /**
             * 从两个点创建适量对象
             */
            public static createFromPoint(start:Point2D,end:Point2D){
                return new Vector2D(end.x-start.x,end.y-start.y);
            }
        }
    }
}