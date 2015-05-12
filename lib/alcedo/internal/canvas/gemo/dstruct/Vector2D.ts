/**
 * Created by tommyZZM on 2015/4/8.
 */
module alcedo {
    export module canvas {
        export class Vector2D implements Ixy{
            public x:number;

            public y:number;

            private static _identity:Vector2D = new Vector2D();
            public static identity(x:number=0,y:number=0):Vector2D{
                Vector2D._identity.reset(x,y);
                return Vector2D._identity;
            }
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
            public set length(value:number){
                var length = this.length;

                if(length === 0){
                    this.x = 1;
                    length = 1;
                }

                length = value / length;

                this.x *= length;
                this.y *= length;
            }
            public get length():number{
                if(this.x==0&&this.y==0)return 0;
                var result = Math.sqrt(this.x*this.x + this.y*this.y);
                if(isNaN(result)){result=0}
                return result;
            }

            //转换为单位向量
            public unitlize(): Vector2D {
                this.length = 1;
                return this;
            }

            public set deg(deg:number){
                var length =  this.length;
                this.x = Constant.cos(deg*Constant.DEG_TO_RAD)* length;
                this.y = Constant.sin(deg*Constant.DEG_TO_RAD)* length;
                //trace(this.x,this.y);
            }

            public get deg():number{
                //TODO:x,y更新时才需要重新计算 , PS 我也不知道什么要-270哦
                return -(Math.atan2(this.x, this.y)* Constant.RAD_TO_DEG).toFixed(1)+90;
            }

            //法向量角
            public toNormalDeg(left:boolean):number{
                return this.deg-(left?90:(-90));
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

            public reset(x:number = 0, y:number = 0):Vector2D {
                this.x = x;
                this.y = y;
                return this;
            }

            public resetAs(vector:Vector2D):Vector2D {
                if(vector===this)return this;
                this.x = vector.x;
                this.y = vector.y;
                return this;
            }

            public resetToDeg(deg:number){
                var length = this.length;

                if(length === 0){
                    return;
                }

                this.x = Constant.cos(deg*Constant.DEG_TO_RAD);
                this.y = Constant.sin(deg*Constant.DEG_TO_RAD);

                this.length = length;
            }

            /**
             * 从两个点创建适量对象
             */
            public static createFromPoint(start:Point2D,end:Point2D){
                return new Vector2D(end.x-start.x,end.y-start.y);
            }

            /**
             * 从一个角度创建向量
             */
            public static createFromDeg(deg:number,length:number=1){
                return new Vector2D(Constant.cos(deg), Constant.sin(deg) );
            }
        }
    }
}